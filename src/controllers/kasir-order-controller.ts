'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

// --- FUNGSI GENERATE KODE RANDOM ---
function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DCF${timestamp}${random}`;
}

export type OrderSummaryData = {
  dbId: string;
  orderCode: string;
  nama: string;
  jumlah: string;
  harga: string;
  status: 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai';
  tanggal: string;
  waktu: string;
};

export type OrderDetailData = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  status: 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai';
  tanggal: string;
  waktu: string;
  paymentMethod: string;
  paymentMethodDetail: string;
  orderType: string;
  isPaid: boolean;
  totalPrice: number;
  totalItems: number;
  items: {
    id: string;
    name: string;
    note: string;
    category: string;
    qty: number;
    price: number;
    image: string;
  }[];
};

// --- TIPE DATA DARI FRONTEND ---
export type KasirCheckoutPayload = {
  orderCode: string;
  customerName: string;
  orderType: string;
  paymentMethod: string; 
  items: {
    menuId: string;
    qty: number;
    price: number;
    note: string;
  }[];
};

export type CreateOrderResult = {
  success: boolean;
  message: string;
  orderId?: string;
  orderCode?: string;
};

export async function createKasirOrder(data: KasirCheckoutPayload): Promise<CreateOrderResult> {
  try {
    // 1. Validasi Akses Kasir
    const session = await auth();
    const kasirId = session?.user?.id;

    if (!kasirId) {
      return { success: false, message: 'Sesi kasir tidak valid. Silakan login ulang.' };
    }

    // 2. Validasi Nama Pelanggan 
    if (!data.customerName || data.customerName.trim() === '') {
      return { success: false, message: 'Nama pelanggan tidak boleh kosong. Silakan isi terlebih dahulu!' };
    }

    // 3. Validasi Keranjang
    if (!data.items || data.items.length === 0) {
      return { success: false, message: 'Keranjang pesanan masih kosong.' };
    }

    // 4. Kalkulasi Total Harga dari Database Asli
    let subtotal = 0;
    const orderItemsInput: {
      menuId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      customNotes: string | null;
    }[] = [];

    for (const item of data.items) {
      const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
      if (!menu) throw new Error(`Menu dengan ID ${item.menuId} tidak ditemukan.`);

      if (menu.stock !== null && menu.stock < item.qty) {
        return { success: false, message: `Maaf, sisa stock ${menu.name} hanya ${menu.stock} porsi.` };
      }

      const itemSubtotal = Number(menu.price) * item.qty;
      subtotal += itemSubtotal;

      orderItemsInput.push({
        menuId: item.menuId,
        quantity: item.qty,
        unitPrice: Number(menu.price),
        subtotal: itemSubtotal,
        customNotes: item.note || null,
      });
    }

    // Sesuaikan dengan UI: Subtotal + Pajak 10%
    const tax = subtotal * 0.1;
    const grandTotal = subtotal + tax;

    // 5. Proteksi Ganda: Pastikan Kode Pesanan Unik
    let finalOrderCode = data.orderCode;
    let isUnique = false;
    
    while (!isUnique) {
      const existingOrder = await prisma.order.findUnique({
        where: { orderCode: finalOrderCode },
      });
      
      if (!existingOrder) {
        isUnique = true;
      } else {
        finalOrderCode = generateOrderCode();
      }
    }

    // 6. Penyesuaian Mapping (Tipe Pesanan & Metode Pembayaran)
    // PERBAIKAN: Mengecek nilai dari frontend dengan benar ("dine_in_kasir")
    const isDineIn = data.orderType === 'dine_in_kasir'; 
    
    // Karena ini transaksi dari kasir, kita map ke 'dine_in_kasir'
    // (Atau jika di skemamu hanya ada 'dine_in_app', ganti jadi 'dine_in_app')
    const orderTypeEnum = 'dine_in_kasir';
    
    let mappedPaymentMethod: 'cash' | 'ewallet' = 'cash';
    if (data.paymentMethod === 'Gopay' || data.paymentMethod === 'Dana') {
      mappedPaymentMethod = 'ewallet';
    }

    // PERBAIKAN: Menentukan teks berdasarkan variabel isDineIn yang sudah benar
    const detailTipe = isDineIn ? 'Makan Ditempat' : 'Bawa Pulang';
    const finalNotes = `${detailTipe} (Pembayaran: ${data.paymentMethod})`;

    // 7. Simpan Pesanan ke Database
    const order = await prisma.$transaction(async (tx) => {
      // Buat Order
      const newOrder = await tx.order.create({
        data: {
          orderCode: finalOrderCode,
          kasirId: kasirId,
          customerName: data.customerName.trim(),
          orderType: orderTypeEnum,
          status: 'masuk',
          paymentMethod: mappedPaymentMethod,
          totalPrice: grandTotal,
          isPaid: false,
          notes: finalNotes, 
        },
      });

      // Buat Order Items
      await tx.orderItem.createMany({
        data: orderItemsInput.map((item) => ({
          orderId: newOrder.id,
          menuId: item.menuId,
          quantity: item.quantity,
          customNotes: item.customNotes,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      });

      // Kurangi Stock
      for (const item of orderItemsInput) {
        const menu = await tx.menu.findUnique({ where: { id: item.menuId } });
        if (menu && menu.stock !== null) {
          await tx.menu.update({
            where: { id: item.menuId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    revalidatePath('/kasir/pesan-ditempat'); 

    return { 
      success: true, 
      message: 'Pesanan berhasil dibuat!',
      orderId: order.id,
      orderCode: order.orderCode
    };

  } catch (error) {
    console.error('Error createKasirOrder:', error);
    return { success: false, message: 'Gagal membuat pesanan. Silakan coba lagi.' };
  }
}

export async function getDaftarPesanan(
  statusFilter?: 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai'
): Promise<OrderSummaryData[]> {
  noStore(); 
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const orders = await prisma.order.findMany({
      include: {
        orderItems: { select: { quantity: true } },
        user: { select: { name: true } }
      },
      orderBy: { orderedAt: 'desc' }, 
    });

    // Auto-fix DB state
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.isPaid && order.status === 'masuk') {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'dimasak' },
          });
          return { ...order, status: 'dimasak' };
        }
        return order;
      })
    );

    // Mapping Data ke format UI
    const mappedOrders = updatedOrders.map((order) => {
      const totalItems = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);

      let statusUI: 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai' = 'Masuk';
      if (order.status === 'dimasak') statusUI = 'Dimasak';
      if (order.status === 'siap_diambil') statusUI = 'Siap Diambil';
      if (order.status === 'selesai') statusUI = 'Selesai';

      const dateObj = new Date(order.orderedAt);
      const tanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ' : ');

      const namaPelanggan = order.customerName || order.user?.name || 'Pelanggan Walk-in';

      return {
        dbId: order.id,
        orderCode: `#${order.orderCode}`,
        nama: namaPelanggan, 
        jumlah: `${totalItems} Menu`,
        harga: `Rp ${Number(order.totalPrice).toLocaleString('id-ID')}`,
        status: statusUI,
        tanggal: tanggal,
        waktu: waktu
      };
    });

    // PERBAIKAN: Lakukan filter di tahap akhir jika statusFilter dikirimkan
    if (statusFilter) {
      return mappedOrders.filter(order => order.status === statusFilter);
    }

    // Jika statusFilter tidak ada, kembalikan semua data
    return mappedOrders;

  } catch (error) {
    console.error('Error getDaftarPesanan:', error);
    return [];
  }
}


export async function getKasirOrderDetail(orderId: string): Promise<OrderDetailData | null> {
  noStore();
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true, // Diubah jadi true agar lebih aman
        orderItems: {
          include: {
            menu: {
              include: { category: true }
            }
          }
        }
      }
    });

    if (!order) {
      console.log("Pesanan dengan ID", orderId, "tidak ada di tabel Order.");
      return null;
    }

    // Mapping Status Database ke Status UI
    let statusUI: 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai' = 'Masuk';
    if (order.status === 'dimasak') statusUI = 'Dimasak';
    if (order.status === 'siap_diambil') statusUI = 'Siap Diambil';
    if (order.status === 'selesai') statusUI = 'Selesai';

    // Format Tanggal dan Waktu
    const dateObj = new Date(order.orderedAt);
    const tanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', '.');

    // Tentukan Nama Pelanggan
    const namaPelanggan = order.customerName || order.user?.name || 'Pelanggan Walk-in';

    // Hitung total item & mapping array produk
    let totalQty = 0;
    const items = order.orderItems.map(item => {
      totalQty += item.quantity;
      
      // Fallback gambar jika tidak ada
      let img = item.menu.imageUrl || '/burger.png';
      const n = item.menu.name.toLowerCase();
      const cat = item.menu.category?.name || '';
      if (!item.menu.imageUrl) {
        if (n.includes('kentang') || n.includes('snack') || cat === 'Snack') img = '/kentang.png';
        else if (n.includes('teh') || n.includes('jus') || cat === 'Minuman') img = '/jus semangka.png';
        else if (cat === 'Nasi') img = '/nasi goreng.png';
        else if (cat === 'Mie') img = '/bakso.png';
      }

      return {
        id: item.id,
        name: item.menu.name,
        note: item.customNotes ? `Catatan : ${item.customNotes}` : 'Tidak ada catatan',
        category: cat || 'Lainnya',
        qty: item.quantity,
        price: Number(item.unitPrice),
        image: img
      };
    });

    // Extract specific payment method from notes if available
    let paymentMethodDetail = order.paymentMethod === 'cash' ? 'Cash' : 'E-Wallet';
    const notesStr = order.notes || '';
    if (notesStr.includes('payment_method:gopay')) paymentMethodDetail = 'GoPay';
    else if (notesStr.includes('payment_method:dana')) paymentMethodDetail = 'DANA / QRIS';
    else if (notesStr.includes('payment_method:bank_va')) paymentMethodDetail = 'Bank (Virtual Account BCA)';
    else if (notesStr.includes('Pembayaran: Gopay')) paymentMethodDetail = 'GoPay';
    else if (notesStr.includes('Pembayaran: Dana')) paymentMethodDetail = 'DANA / QRIS';
    else if (notesStr.includes('Pembayaran: Cash')) paymentMethodDetail = 'Cash';

    return {
      id: order.id,
      orderCode: `#${order.orderCode}`,
      customerName: namaPelanggan,
      customerEmail: order.user?.email || null,
      customerPhone: order.user?.phone || null,
      status: statusUI,
      tanggal: tanggal,
      waktu: waktu,
      paymentMethod: order.paymentMethod === 'cash' ? 'Cash' : 'E-Wallet',
      paymentMethodDetail: paymentMethodDetail,
      orderType: order.notes?.includes('Bawa Pulang') ? 'Bawa Pulang' : 'Makan Ditempat',
      isPaid: order.isPaid,
      totalPrice: Number(order.totalPrice),
      totalItems: totalQty,
      items: items
    };

  } catch (error) {
    console.error("Gagal mengambil detail pesanan:", error);
    return null;
  }
}

export async function hapusPesananKasir(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Sesi tidak valid' };
    }

    await prisma.$transaction(async (tx) => {
      // Hapus data yang berelasi terlebih dahulu
      await tx.orderItem.deleteMany({ where: { orderId } });
      await tx.invoice.deleteMany({ where: { orderId } });
      
      await tx.order.delete({ where: { id: orderId } });
    });

    // Revalidate daftar pesanan setelah hapus
    revalidatePath('/kasir/daftar-pesanan');

    return { success: true, message: 'Pesanan berhasil dihapus' };
  } catch (error) {
    console.error('Error hapusPesananKasir:', error);
    return { success: false, message: 'Gagal membatalkan pesanan. Coba lagi.' };
  }
}

// --- TAMBAHKAN DI BAGIAN BAWAH FILE ---

export async function updateOrderStatusKasir(orderId: string, currentStatusUI: string, isPaid: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Sesi tidak valid' };
    }

    let nextStatusDB: 'masuk' | 'dimasak' | 'siap_diambil' | 'selesai' = 'masuk';
    let newPaidStatus = isPaid;

    // Logika Perubahan Status Berantai
    if (currentStatusUI === 'Masuk') {
      // Jika belum bayar, lunasi dan langsung masak. Jika sudah bayar, lanjut masak.
      newPaidStatus = true; 
      nextStatusDB = 'dimasak';
    } else if (currentStatusUI === 'Dimasak') {
      nextStatusDB = 'siap_diambil';
    } else if (currentStatusUI === 'Siap Diambil') {
      nextStatusDB = 'selesai';
    } else {
      return { success: false, message: 'Status pesanan sudah maksimal.' };
    }

    // Update data di database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: nextStatusDB,
        isPaid: newPaidStatus
      }
    });

    // Revalidate halaman agar UI segar tanpa reload manual
    revalidatePath('/kasir/daftar-pesanan');
    revalidatePath(`/kasir/daftar-pesanan/detail/${orderId}`);
    revalidatePath(`/kasir/invoice/${orderId}`);

    return { success: true, message: 'Status berhasil diperbarui!' };
  } catch (error) {
    console.error('Error updateOrderStatusKasir:', error);
    return { success: false, message: 'Gagal memperbarui status. Silakan coba lagi.' };
  }
}
