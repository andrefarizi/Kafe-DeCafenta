'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function getKasirDashboardData() {
  noStore();
  try {
    const session = await auth();
    const kasirId = session?.user?.id;
    const kasirName = session?.user?.name ?? 'Kasir';

    // Ambil 5 pesanan terbaru
    const recentOrdersRaw = await prisma.order.findMany({
      take: 5,
      orderBy: { orderedAt: 'desc' },
      include: {
        orderItems: { select: { quantity: true } },
        user: { select: { name: true } },
      },
    });

    const recentOrders = recentOrdersRaw.map((o) => {
      const totalItems = o.orderItems.reduce((s, i) => s + i.quantity, 0);
      const nama = o.customerName || o.user?.name || 'Pelanggan Walk-in';
      return {
        id: o.id,
        orderCode: `#${o.orderCode}`,
        nama,
        jumlah: `${totalItems} Menu`,
        harga: `Rp ${Number(o.totalPrice).toLocaleString('id-ID')}`,
        status: o.status,
      };
    });

    // Ambil semua pesanan aktif (bukan selesai/dibatalkan) untuk "pesanan ditempat"
    const activeOrdersRaw = await prisma.order.findMany({
      where: { status: { notIn: ['selesai', 'dibatalkan'] } },
      take: 5,
      orderBy: { orderedAt: 'desc' },
      include: {
        orderItems: { select: { quantity: true } },
        user: { select: { name: true } },
      },
    });

    const activeOrders = activeOrdersRaw.map((o) => {
      const totalItems = o.orderItems.reduce((s, i) => s + i.quantity, 0);
      const nama = o.customerName || o.user?.name || 'Pelanggan Walk-in';
      return {
        id: o.id,
        orderCode: `#${o.orderCode}`,
        nama,
        jumlah: `${totalItems} Menu`,
        harga: `Rp ${Number(o.totalPrice).toLocaleString('id-ID')}`,
      };
    });

    // Ambil data meja dari database
    const tables = await prisma.table.findMany({
      orderBy: { name: 'asc' },
    });

    const tableData = tables.map((t) => ({
      id: t.id,
      name: t.name,
      tableCode: `#${t.tableCode}`,
      status: t.status === 'tersedia' ? 'Tersedia' : 'Dipakai',
    }));

    return {
      kasirName,
      kasirId,
      recentOrders,
      activeOrders,
      tables: tableData,
    };
  } catch (error) {
    console.error('getKasirDashboardData error:', error);
    return {
      kasirName: 'Kasir',
      kasirId: null,
      recentOrders: [],
      activeOrders: [],
      tables: [],
    };
  }
}
