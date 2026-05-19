'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/customer/beranda')}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-white text-[#9b0000] shadow-md hover:bg-gray-50 transition-colors"
    >
      <ChevronLeft size={26} strokeWidth={3} />
    </button>
  );
}
