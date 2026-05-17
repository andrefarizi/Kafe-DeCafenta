'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
  totalOrdered?: number;
};

type MenuRow = {
  id: string;
  name: string;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
  totalOrdered?: number | null;
};

type MenuDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
  reviewCount: number;
};

type MenuReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userName: string;
  userImage: string | null;
};

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const mapMenuRow = (menu: MenuRow): MenuListItem => ({
  id: menu.id,
  name: menu.name,
  price: toNumber(menu.price),
  avgRating: toNumber(menu.avgRating),
  imageUrl: menu.imageUrl,
  categoryName: menu.categoryName,
  totalOrdered: menu.totalOrdered ? toNumber(menu.totalOrdered) : 0,
});

export async function getGuestMenuList(): Promise<MenuListItem[]> {
  const menus = await prisma.menu.findMany({
    include: {
      category: {
        select: { name: true },
      },
    },
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  });

  return menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    price: toNumber(menu.price),
    avgRating: toNumber(menu.avgRating),
    imageUrl: menu.imageUrl,
    categoryName: menu.category.name,
  }));
}

export async function getMenuCatalog(): Promise<MenuListItem[]> {
  const menus = await prisma.menu.findMany({
    include: {
      category: {
        select: { name: true },
      },
    },
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  });

  return menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    price: toNumber(menu.price),
    avgRating: toNumber(menu.avgRating),
    imageUrl: menu.imageUrl,
    categoryName: menu.category.name,
  }));
}

export async function getBestSellerMenus(limit = 3): Promise<MenuListItem[]> {
  const ordered = await prisma.orderItem.groupBy({
    by: ['menuId'],
    _sum: { quantity: true },
    orderBy: [{ _sum: { quantity: 'desc' } }],
    take: limit,
  });

  if (ordered.length === 0) {
    const fallback = await prisma.menu.findMany({
      include: { category: { select: { name: true } } },
      orderBy: [{ avgRating: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return fallback.map((menu) => ({
      id: menu.id,
      name: menu.name,
      price: toNumber(menu.price),
      avgRating: toNumber(menu.avgRating),
      imageUrl: menu.imageUrl,
      categoryName: menu.category.name,
    }));
  }

  const menuIds = ordered.map((item) => item.menuId);
  const menus = await prisma.menu.findMany({
    where: { id: { in: menuIds } },
    include: { category: { select: { name: true } } },
  });

  const menuMap = new Map(menus.map((menu) => [menu.id, menu]));

  return ordered
    .map((item) => {
      const menu = menuMap.get(item.menuId);
      if (!menu) return null;
      return {
        id: menu.id,
        name: menu.name,
        price: toNumber(menu.price),
        avgRating: toNumber(menu.avgRating),
        imageUrl: menu.imageUrl,
        categoryName: menu.category.name,
        totalOrdered: toNumber(item._sum.quantity),
      };
    })
    .filter((menu): menu is MenuListItem => Boolean(menu));
}

export async function getRecommendedMenus(limit = 4): Promise<MenuListItem[]> {
  const menus = await prisma.menu.findMany({
    include: {
      category: { select: { name: true } },
    },
  });

  const shuffled = [...menus];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit).map((menu) => ({
    id: menu.id,
    name: menu.name,
    price: toNumber(menu.price),
    avgRating: toNumber(menu.avgRating),
    imageUrl: menu.imageUrl,
    categoryName: menu.category.name,
  }));
}

export async function getPromoMenus(limit = 4): Promise<MenuListItem[]> {
  const rows = await prisma.$queryRaw<MenuRow[]>(Prisma.sql`
    SELECT m.id,
           m.name,
           m.price,
           m."avgRating" AS "avgRating",
           m."imageUrl" AS "imageUrl",
           c.name AS "categoryName",
           COALESCE(SUM(oi.quantity), 0) AS "totalOrdered"
    FROM menus m
    JOIN categories c ON c.id = m."categoryId"
    LEFT JOIN order_items oi ON oi."menuId" = m.id
    GROUP BY m.id, m.name, m.price, m."avgRating", m."imageUrl", c.name
    ORDER BY "totalOrdered" DESC, m."avgRating" DESC, m.price ASC
    LIMIT ${limit}
  `);

  return rows.map(mapMenuRow);
}

export async function getCustomerOrderHistoryMenus(
  userId: string,
  limit = 5
): Promise<MenuListItem[]> {
  const rows = await prisma.$queryRaw<MenuRow[]>(Prisma.sql`
    SELECT m.id,
           m.name,
           m.price,
           m."avgRating" AS "avgRating",
           m."imageUrl" AS "imageUrl",
           c.name AS "categoryName",
           COALESCE(SUM(oi.quantity), 0) AS "totalOrdered"
    FROM order_items oi
    JOIN orders o ON o.id = oi."orderId"
    JOIN menus m ON m.id = oi."menuId"
    JOIN categories c ON c.id = m."categoryId"
    WHERE o."userId" = ${userId}
    GROUP BY m.id, m.name, m.price, m."avgRating", m."imageUrl", c.name
    ORDER BY MAX(o."orderedAt") DESC
    LIMIT ${limit}
  `);

  return rows.map(mapMenuRow);
}

export async function getCustomerCartMenus(
  userId: string,
  limit = 5
): Promise<MenuListItem[]> {
  const cartItems = await prisma.cart.findMany({
    where: { userId: userId },
    include: {
      menu: {
        include: {
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { addedAt: 'desc' }, 
    take: limit,
  });

  return cartItems.map((item) => ({
    id: item.menu.id,
    name: item.menu.name,
    price: toNumber(item.menu.price),
    avgRating: toNumber(item.menu.avgRating),
    imageUrl: item.menu.imageUrl,
    categoryName: item.menu.category.name,
    totalOrdered: item.quantity, 
  }));
}

export async function getMenuDetail(menuId: string): Promise<MenuDetail | null> {
  if (!menuId) {
    return null;
  }

  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    include: {
      category: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (!menu) {
    return null;
  }

  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: toNumber(menu.price),
    avgRating: toNumber(menu.avgRating),
    imageUrl: menu.imageUrl,
    categoryName: menu.category.name,
    reviewCount: menu._count.reviews,
  };
}

export async function getMenuReviews(menuId: string, limit = 2): Promise<MenuReview[]> {
  const reviews = await prisma.review.findMany({
    where: { menuId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return reviews.map((review) => ({
    id: review.id,
    rating: toNumber(review.rating),
    comment: review.comment,
    createdAt: review.createdAt,
    userName: review.user.name ?? 'Pelanggan',
    userImage: review.user.image,
  }));
}

// export type { MenuListItem, MenuDetail, MenuReview };


export async function addMenuReview(menuId: string, rating: number, comment: string, orderItemId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) return { success: false, message: 'Harus login untuk mengulas.' };

    const cleanComment = comment.trim() === "" ? null : comment.trim();

    // 1. Buat Ulasannya (Ini yang udah berhasil masuk)
    console.log("1. Menyimpan ulasan untuk menu:", menuId);
    await prisma.review.create({
      data: {
        menuId: menuId,
        userId: userId, 
        rating: rating,
        comment: cleanComment,
      }
    });

    // 2. UBAH STATUS ITEM PESANAN (Nah, biasanya crash di sini nih!)
    console.log("2. Mengubah status isReviewed untuk OrderItem ID:", orderItemId);
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { isReviewed: true }
    });

    // 3. Update Rata-rata Bintang Menu
    try {
      const aggregate = await prisma.review.aggregate({
        where: { menuId }, _avg: { rating: true }, _count: { id: true }
      });
      await prisma.menu.update({
        where: { id: menuId },
        data: { avgRating: aggregate._avg.rating || 0, reviewCount: aggregate._count.id }
      });
    } catch (e) { 
      console.log("Gagal update rata-rata bintang (Aman diabaikan)"); 
    }

    return { success: true, message: 'Ulasan berhasil ditambahkan!' };
    
  } catch (error: any) {
    console.error('================ ERROR ADD MENU REVIEW ================');
    console.error(error);
    console.error('=======================================================');
    
    // KITA TAMPILKAN EROR ASLINYA KE LAYAR BIAR KETAHUAN!
    return { 
      success: false, 
      message: `Eror Database: ${error.message || 'Gagal menyimpan status'}` 
    };
  }
}

/// Fungsi untuk mengambil semua ulasan dari satu menu (VERSI AMAN DARI DECIMAL ERROR)
export async function getMenuWithReviews(menuId: string) {
  try {
    // 1. Ambil data menunya saja dulu
    const menu = await prisma.menu.findUnique({
      where: { id: menuId }
    });

    if (!menu) return null;

    // 2. Ambil ulasannya secara terpisah
    const reviews = await prisma.review.findMany({
      where: { menuId: menuId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true // Ambil user-nya
      }
    });

    return {
      menuName: menu.name,
      avgRating: Number(menu.avgRating) || 0, 
      reviewCount: menu.reviewCount || 0,
      reviews: reviews.map((r: any) => ({
        id: r.id,
        name: r.user?.name || 'Pengguna',
        date: r.createdAt.toISOString(),
        text: r.comment || 'Tanpa komentar',
        rating: r.rating,
        img: r.user?.image || '/LOGOPROFIL.png'
      }))
    };
  } catch (error: any) {
    console.error("================ EROR GET REVIEWS ================");
    console.error(error.message);
    return { error: error.message }; 
  }
}