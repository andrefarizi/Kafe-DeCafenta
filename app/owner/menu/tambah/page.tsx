import { getCategories } from '@/src/controllers/menu-controller';
import TambahMenuClient from './TambahMenuClient';

export const dynamic = 'force-dynamic';

export default async function TambahMenuPage() {
  const categories = await getCategories();
  return <TambahMenuClient categories={categories} />;
}