'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PaymentMethod, OrderType, OrderStatus } from '@prisma/client';

// Tipe data yang diharapkan dikirim dari halaman Kasir
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

export async function createKasirOrder(data: KasirCheckoutPayload) {
  try {
    // 1. Validasi Akses (Pastikan Kasir sudah login)
    const session = await auth();
    const kasirId = session?.user?.id;

    if (!kasirId) {
      return { success: false, message: 'Sesi kasir tidak valid. Silakan login ulang.' };
    }

    if (!data.items || data.items.length === 0) {
      return { success: false, message: 'Keranjang pesanan masih kosong.' };
    }

    // 2. Kalkulasi ulang harga di Backend (Keamanan berlapis)
    let subtotal = 0;
    const orderItemsInput = data.items.map((item) => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;
      
      return {
        menuId: item.menuId,
        quantity: item.qty,
        unitPrice: item.price,
        subtotal: itemSubtotal,
        customNotes: item.note || null,
      };
    });

    const tax = subtotal * 0.1; // Pajak 10%
    const grandTotal = subtotal + tax;

    // 3. Mapping data dari UI (String) ke Enum Prisma
    // Mengubah pilihan pembayaran dari dropdown UI menjadi tipe enum database
    let mappedPaymentMethod = PaymentMethod.cash;
    if (data.paymentMethod === 'Gopay' || data.paymentMethod === 'Dana' || data.paymentMethod === 'Bank ( Virtual Account )') {
      mappedPaymentMethod = PaymentMethod.ewallet;
    }

    // Berdasarkan skema database kamu, OrderType hanya ada 'dine_in_app' dan 'dine_in_kasir'
    // Jika nanti kamu menambahkan 'takeaway_kasir' di skema, kamu bisa menambahkan logikanya di sini
    const mappedOrderType = OrderType.dine_in_kasir; 

    // 4. Proses Penyimpanan Database (Prisma Transaction)
    // Transaksi ini memastikan jika tabel Invoice gagal dibuat, tabel Order juga akan dibatalkan
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // A. Buat record Order utama
      const order = await tx.order.create({
        data: {
          orderCode: data.orderCode,
          kasirId: kasirId,
          customerName: data.customerName || 'Pelanggan Walk-in',
          orderType: mappedOrderType,
          paymentMethod: mappedPaymentMethod,
          totalPrice: grandTotal,
          status: OrderStatus.masuk, // Status awal saat masuk ke dapur
          isPaid: true, // Karena melalui kasir, diasumsikan sudah dibayar lunas
          
          // Langsung masukkan item menu-nya (Nested Writes)
          orderItems: {
            create: orderItemsInput,
          },
        },
      });

      // B. Buat record Invoice / Struk Pembayaran
      await tx.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber: `INV-${data.orderCode}`,
          totalAmount: grandTotal,
          cashAmount: mappedPaymentMethod === PaymentMethod.cash ? grandTotal : 0,
          ewalletAmount: mappedPaymentMethod === PaymentMethod.ewallet ? grandTotal : 0,
        },
      });

      return order;
    });

    return { 
      success: true, 
      message: 'Pesanan berhasil dikonfirmasi dan diteruskan ke dapur!',
      data: newOrder 
    };

  } catch (error) {
    console.error('Error createKasirOrder:', error);
    return { success: false, message: 'Gagal membuat pesanan. Terjadi kesalahan pada server.' };
  }
}