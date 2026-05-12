import { prisma } from '@/lib/prisma';

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
};

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

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

export type { MenuListItem };
