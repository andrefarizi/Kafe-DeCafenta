import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

    if (!MIDTRANS_SERVER_KEY) {
      console.error("❌ ERROR: MIDTRANS_SERVER_KEY tidak terkonfigurasi di .env");
      return NextResponse.json(
        { success: false, message: 'Server not configured' },
        { status: 500 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const midtransOrderId = searchParams.get('midtransOrderId');

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'orderId diperlukan' }, { status: 400 });
    }

    // Ambil order dari DB
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order tidak ditemukan' }, { status: 404 });
    }

    // Jika sudah dibayar di DB, langsung kembalikan
    if (order.isPaid) {
      if (order.status === 'masuk') {
        const updated = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'dimasak' }
        });
        return NextResponse.json({ success: true, isPaid: true, status: updated.status });
      }
      return NextResponse.json({ success: true, isPaid: true, status: order.status });
    }

    // Cek ke Midtrans jika ada midtransOrderId
    if (midtransOrderId) {
      const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');
      const res = await fetch(
        `https://api.sandbox.midtrans.com/v2/${midtransOrderId}/status`,
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: 'application/json',
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const txStatus = data.transaction_status;
        const fraudStatus = data.fraud_status;

        const isSettled =
          txStatus === 'settlement' ||
          (txStatus === 'capture' && fraudStatus === 'accept');

        if (isSettled) {
          // Update DB: bayar lunas → status naik ke dimasak
          await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true, status: 'dimasak' },
          });
          return NextResponse.json({ success: true, isPaid: true, status: 'dimasak' });
        }

        return NextResponse.json({
          success: true,
          isPaid: false,
          midtransStatus: txStatus,
          status: order.status,
        });
      }
    }

    return NextResponse.json({ success: true, isPaid: false, status: order.status });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
