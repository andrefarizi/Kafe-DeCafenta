'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PromoItem = {
  id: string;
  name: string;
  price: number;
  avgRating: number;
  image: string;
};

type PromoCarouselProps = {
  items: PromoItem[];
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export default function PromoCarousel({ items }: PromoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getScrollStep = () => {
    const track = trackRef.current;
    if (!track) return 220;
    const firstCard = track.querySelector<HTMLElement>('[data-card="promo"]');
    const cardWidth = firstCard?.offsetWidth ?? 220;
    const style = window.getComputedStyle(track);
    const gapValue = parseFloat(style.columnGap || style.gap || '0');
    return cardWidth + (Number.isFinite(gapValue) ? gapValue : 0);
  };

  const handleScroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const step = getScrollStep();
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FFCC00] rounded-b-xl p-6 border-x-[6px] border-b-[6px] border-[#8A0000]">
        <p className="text-sm font-bold text-[#8A0000]">Menu promo belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFCC00] rounded-b-xl p-4 relative flex items-center justify-center gap-4 border-x-[6px] border-b-[6px] border-[#8A0000]">
      <button
        type="button"
        onClick={() => handleScroll(-1)}
        className="absolute left-0 -translate-x-1/2 z-30 bg-[#8A0000] text-white rounded-full p-2 hover:bg-red-900 transition-all shadow-md flex items-center justify-center"
      >
        <ChevronLeft size={28} strokeWidth={2} />
      </button>

      <div ref={trackRef} className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-8 scroll-smooth snap-x snap-mandatory">
        {items.map((item) => (
          <div
            key={item.id}
            data-card="promo"
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/customer/detail_menu/${item.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                router.push(`/customer/detail_menu/${item.id}`);
              }
            }}
            className="min-w-[180px] bg-[#E32111] rounded-2xl overflow-hidden border-2 border-[#8A0000] shadow-md hover:shadow-lg transition-shadow cursor-pointer snap-start"
          >
            <div className="relative h-32">
              <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-[12px] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{Number(item.avgRating).toFixed(1)}</span>
              </div>
            </div>

            <div className="p-3 text-white">
              <p className="text-sm font-bold truncate mb-1">{item.name}</p>
              <p className="text-[10px] opacity-80 line-through leading-tight">
                {formatRupiah(item.price + 15000)}
              </p>
              <p className="text-sm font-black mb-3">{formatRupiah(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleScroll(1)}
        className="absolute right-0 translate-x-1/2 z-30 bg-[#8A0000] text-white rounded-full p-2 hover:bg-red-900 transition-all shadow-md flex items-center justify-center"
      >
        <ChevronRight size={28} strokeWidth={2} />
      </button>
    </div>
  );
}
