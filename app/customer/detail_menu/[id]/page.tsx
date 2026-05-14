import { notFound } from 'next/navigation';
import DetailMenuClient from '../DetailMenuClient';
import {
  getMenuDetail,
  getMenuReviews,
} from '@/src/controllers/menu-controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const resolveMenuImage = (name: string, categoryName: string, imageUrl: string | null) => {
  if (imageUrl) return imageUrl;
  return categoryFallbacks[categoryName] || '/burger.png';
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailMenuPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const menu = await getMenuDetail(id);

  if (!menu) {
    notFound();
  }

  const reviews = await getMenuReviews(menu.id, 2);

  return (
    <DetailMenuClient
      menu={{
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        avgRating: menu.avgRating,
        image: resolveMenuImage(menu.name, menu.categoryName, menu.imageUrl),
        reviewCount: menu.reviewCount,
      }}
      reviews={reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        userName: review.userName,
        userImage: review.userImage,
      }))}
    />
  );
}
