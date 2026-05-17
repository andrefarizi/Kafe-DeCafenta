import { prisma } from '@/lib/prisma';

export async function getOwnerDashboardStats({ month, year }: { month?: number; year?: number } = {}) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);

  // Orders in the month
  const orders = await prisma.order.findMany({
    where: { orderedAt: { gte: start, lt: end } },
    select: { id: true, totalPrice: true },
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalPrice ?? 0), 0);

  // Aggregate order items by menu
  const items = await prisma.orderItem.findMany({
    where: { order: { orderedAt: { gte: start, lt: end } } },
    include: { menu: true },
  });

  const map = new Map<string, { id: string; name: string; qty: number; revenue: number }>();
  for (const it of items) {
    const id = it.menuId;
    const existing = map.get(id);
    const qty = it.quantity ?? 0;
    const revenue = Number(it.unitPrice ?? 0) * qty;
    if (existing) {
      existing.qty += qty;
      existing.revenue += revenue;
    } else {
      map.set(id, { id, name: it.menu?.name ?? 'Unknown', qty, revenue });
    }
  }

  const topMenus = Array.from(map.values()).sort((a, b) => b.qty - a.qty);

  return {
    month: m,
    year: y,
    totalOrders,
    totalRevenue,
    topMenus,
  };
}

export async function getOwnerMonthlyReport({ month, year, day }: { month?: number; year?: number; day?: number } = {}) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);

  const daysInMonth = new Date(y, m, 0).getDate();

  // Fetch orders in range
  const orders = await prisma.order.findMany({
    where: { orderedAt: { gte: start, lt: end } },
    select: { id: true, orderedAt: true, totalPrice: true, paymentMethod: true },
  });

  // Fetch order items in range (join via order relation)
  const items = await prisma.orderItem.findMany({
    where: { order: { orderedAt: { gte: start, lt: end } } },
    include: { menu: true, order: true },
  });

  // Build weekly buckets: 1-7,8-14,15-21,22-end
  const weeks = [
    { label: 'Tanggal 1 - 7', total: 0, count: 0 },
    { label: 'Tanggal 8 - 14', total: 0, count: 0 },
    { label: 'Tanggal 15 - 21', total: 0, count: 0 },
    { label: 'Tanggal 22 - Akhir Bulan', total: 0, count: 0 },
  ];

  const cash = { total: 0 };
  const ewallet = { total: 0 };
  let cashCount = 0;
  let ewalletCount = 0;

  // daily breakdown if requested
  let dailyTotal = 0;
  let dailyCount = 0;
  let dailyCash = 0;
  let dailyEwallet = 0;
  let dailyCashCount = 0;
  let dailyEwalletCount = 0;

  const fullMonthDailyBreakdown = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    totalRevenue: 0,
    ordersCount: 0,
    paymentBreakdown: { cash: 0, ewallet: 0 },
    paymentCounts: { cash: 0, ewallet: 0 }
  }));

  for (const o of orders) {
    const d = o.orderedAt.getDate();
    let idx = 3;
    if (d <= 7) idx = 0; else if (d <= 14) idx = 1; else if (d <= 21) idx = 2;
    const price = Number(o.totalPrice ?? 0);
    weeks[idx].total += price;
    weeks[idx].count += 1;

    const dayEntry = fullMonthDailyBreakdown[d - 1];
    dayEntry.totalRevenue += price;
    dayEntry.ordersCount += 1;

    if (o.paymentMethod === 'cash') {
      cash.total += price;
      cashCount += 1;
      dayEntry.paymentBreakdown.cash += price;
      dayEntry.paymentCounts.cash += 1;
      if (day && d === day) {
        dailyCash += price;
        dailyCashCount += 1;
      }
    } else {
      ewallet.total += price;
      ewalletCount += 1;
      dayEntry.paymentBreakdown.ewallet += price;
      dayEntry.paymentCounts.ewallet += 1;
      if (day && d === day) {
        dailyEwallet += price;
        dailyEwalletCount += 1;
      }
    }

    if (day && d === day) {
      dailyTotal += price;
      dailyCount += 1;
    }
  }

  // Aggregate by menu for the month
  const menuMap = new Map();
  for (const it of items) {
    const id = it.menuId;
    const qty = it.quantity ?? 0;
    const revenue = Number(it.unitPrice ?? 0) * qty;
    const name = it.menu?.name ?? 'Unknown';
    if (menuMap.has(id)) {
      const ex = menuMap.get(id);
      ex.qty += qty;
      ex.revenue += revenue;
    } else {
      menuMap.set(id, { id, name, qty, revenue });
    }
  }
  const menuBreakdown = Array.from(menuMap.values()).sort((a, b) => b.qty - a.qty);

  // If a day is selected, compute per-menu breakdown for that day
  let menuBreakdownDay = undefined;
  if (day) {
    const dayMap = new Map();
    for (const it of items) {
      const d = it.order.orderedAt.getDate();
      if (d !== day) continue;
      const id = it.menuId;
      const qty = it.quantity ?? 0;
      const revenue = Number(it.unitPrice ?? 0) * qty;
      const name = it.menu?.name ?? 'Unknown';
      if (dayMap.has(id)) {
        const ex = dayMap.get(id);
        ex.qty += qty;
        ex.revenue += revenue;
      } else {
        dayMap.set(id, { id, name, qty, revenue });
      }
    }
    menuBreakdownDay = Array.from(dayMap.values()).sort((a, b) => b.qty - a.qty);
  }

  const weeklyRevenue = weeks.map((w) => ({ label: w.label, total: w.total, count: w.count }));

  return {
    month: m,
    year: y,
    daysInMonth,
    totalRevenue: weeklyRevenue.reduce((s, w) => s + w.total, 0),
    paymentBreakdown: { cash: cash.total, ewallet: ewallet.total },
    weeklyRevenue,
    ordersCount: orders.length,
    paymentCounts: { cash: cashCount, ewallet: ewalletCount },
    fullMonthDailyBreakdown,
    dailyBreakdown: day
      ? {
          day,
          totalRevenue: dailyTotal,
          ordersCount: dailyCount,
          paymentBreakdown: { cash: dailyCash, ewallet: dailyEwallet },
          paymentCounts: { cash: dailyCashCount, ewallet: dailyEwalletCount },
          menuBreakdown: menuBreakdownDay,
        }
      : undefined,
  };
}

