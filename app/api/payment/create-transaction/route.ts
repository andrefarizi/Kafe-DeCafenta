import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Load env vars yang WAJIB exist
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || process.env.MIDTRANS_CLIENT_KEY;

    if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
      console.error("❌ ERROR: Midtrans credentials tidak terkonfigurasi di .env");
      return NextResponse.json(
        { success: false, message: "Server error: Payment gateway tidak terkonfigurasi" },
        { status: 500 }
      );
    }

    const coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
      clientKey: MIDTRANS_CLIENT_KEY
    });
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentType, totalAmount, customerName, customerEmail } = body;

    if (!orderId || !paymentType || !totalAmount) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    // Ambil data order dari DB untuk validasi
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { menu: true } } },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.isPaid) {
      return NextResponse.json({ success: false, message: 'Pesanan sudah dibayar' }, { status: 400 });
    }

    // Build payload berdasarkan tipe pembayaran
    const orderCode = order.orderCode;
    const grossAmount = Math.round(Number(totalAmount));

    const itemDetails = order.orderItems.map((item) => ({
      id: item.menuId,
      price: Math.round(Number(item.unitPrice)),
      quantity: item.quantity,
      name: item.menu.name.substring(0, 50),
    }));

    let chargePayload: Record<string, unknown> = {
      transaction_details: {
        order_id: `${orderCode}-${Date.now()}`,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerName || 'Customer',
        email: customerEmail || 'customer@decafenta.com',
      },
    };

    // Tentukan payment type payload
    if (paymentType === 'gopay') {
      chargePayload = {
        ...chargePayload,
        payment_type: 'gopay',
        gopay: { enable_callback: false },
      };
    } else if (paymentType === 'dana') {
      chargePayload = {
        ...chargePayload,
        payment_type: 'qris',
        qris: { acquirer: 'gopay' },
      };
    } else if (paymentType === 'bca_va' || paymentType === 'bank_va') {
      chargePayload = {
        ...chargePayload,
        payment_type: 'bank_transfer',
        bank_transfer: { bank: 'bca' },
      };
    } else {
      return NextResponse.json({ success: false, message: 'Metode pembayaran tidak didukung' }, { status: 400 });
    }

    // Panggil Midtrans Core API
    const midtransData = await coreApi.charge(chargePayload) as {
      status_code?: string;
      status_message?: string;
      transaction_id?: string;
      [key: string]: unknown;
    };

    if (midtransData.status_code && parseInt(midtransData.status_code) >= 400) {
      console.error('Midtrans error:', midtransData);
      return NextResponse.json(
        { success: false, message: midtransData.status_message || 'Gagal membuat transaksi' },
        { status: 400 }
      );
    }

    // Update order dengan midtrans transaction id
    await prisma.order.update({
      where: { id: orderId },
      data: {
        notes: order.notes
          ? `${order.notes} | midtrans_id:${midtransData.transaction_id}`
          : `midtrans_id:${midtransData.transaction_id}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: midtransData,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
