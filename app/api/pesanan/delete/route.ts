import { NextResponse } from 'next/server';
import { hapusPesananKasir } from '@/src/controllers/kasir-order-controller';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID pesanan tidak ditemukan' }, { status: 400 });
    }
    const result = await hapusPesananKasir(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error delete order API:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus pesanan' }, { status: 500 });
  }
}
