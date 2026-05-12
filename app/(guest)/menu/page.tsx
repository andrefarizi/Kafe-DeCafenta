import type { GuestMenuItem } from './MenuSection';

import MenuClient from './MenuClient';
import { getGuestMenuList } from '@/src/controllers/menu-controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const formatRating = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
};

export default async function MenuPage() {
  let menuItems: GuestMenuItem[] = [];
  let errorMessage = '';

  try {
    const menus = await getGuestMenuList();
    menuItems = menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      price: formatRupiah(menu.price),
      rating: formatRating(menu.avgRating),
      image: menu.imageUrl || categoryFallbacks[menu.categoryName] || '/nasi goreng.png',
      category: menu.categoryName,
    }));
  } catch (error) {
    errorMessage = 'Menu belum bisa ditampilkan. Coba lagi sebentar.';
  }

  return <MenuClient items={menuItems} errorMessage={errorMessage} />;
}
