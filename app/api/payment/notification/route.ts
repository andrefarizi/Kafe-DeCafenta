import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY?.trim() || 'SB-Mid-server-vtes-EfWHAIMBGLjEXF06HtG';
    const body = await request.json();

    // Verifikasi signature Midtrans
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // Cari order berdasarkan orderCode (order_id mengandung orderCode)
    const orderCode = order_id.split('-')[0]; // format: DCF001-timestamp
    const order = await prisma.order.findFirst({
      where: { orderCode: orderCode },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update isPaid berdasarkan status transaksi
    const isSuccess =
      transaction_status === 'capture' && fraud_status === 'accept'
        ? true
        : transaction_status === 'settlement'
        ? true
        : false;

    if (isSuccess) {
      await prisma.order.update({
        where: { id: order.id },
        data: { isPaid: true, status: 'dimasak' },
      });
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
