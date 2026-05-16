'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- FUNGSI GENERATE KODE RANDOM ---
function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DCF${timestamp}${random}`;
}

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
    const orderItemsInput = [];

    for (const item of data.items) {
      const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
      if (!menu) throw new Error(`Menu dengan ID ${item.menuId} tidak ditemukan.`);

      const itemSubtotal = Number(menu.price) * item.qty;
      subtotal += itemSubtotal;

      orderItemsInput.push({
        menuId: item.menuId,
        quantity: item.qty,
        unitPrice: menu.price,
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
    
    let mappedPaymentMethod = 'cash';
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
          orderType: orderTypeEnum as any,
          status: 'masuk',
          paymentMethod: mappedPaymentMethod as any,
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