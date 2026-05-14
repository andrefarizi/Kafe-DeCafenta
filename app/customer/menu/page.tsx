import MenuClient, { CustomerMenuItem } from './MenuClient';
import { getMenuCatalog } from '@/src/controllers/menu-controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const formatRating = (value: number) =>
  Number.isFinite(value) ? value.toFixed(1) : '0.0';

export default async function MenuPage() {
  const menus = await getMenuCatalog();

  const items: CustomerMenuItem[] = menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    price: formatRupiah(menu.price),
    rating: formatRating(menu.avgRating),
    image: menu.imageUrl || categoryFallbacks[menu.categoryName] || '/nasi goreng.png',
    category: menu.categoryName,
  }));

  return <MenuClient items={items} />;
}
