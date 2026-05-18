"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props {
  basePath: string; // e.g. '/owner/total-pendapatan'
  month: number;
  year: number;
  daysInMonth: number;
  initialDay?: number | null;
}

export default function DateCarouselClient({ basePath, month, year, daysInMonth, initialDay = null }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<number | null>(initialDay);

  useEffect(() => {
    setSelected(initialDay);
  }, [initialDay]);

  function navigateTo(day: number) {
    setSelected(day);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('month', String(month));
    params.set('day', String(day));
    params.set('year', String(year));
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-3 px-2 snap-x snap-mandatory">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => navigateTo(d)}
            className={`flex-shrink-0 snap-start w-20 h-20 rounded-md border-2 flex flex-col items-center justify-center transition-all ${
              selected === d ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white' : 'bg-white border-[#8B1A1A] text-black'
            }`}
          >
            <span className={`text-[10px] mb-1 ${selected === d ? 'text-gray-200' : 'text-gray-600'}`}>Tanggal</span>
            <span className="text-2xl font-extrabold">{d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
