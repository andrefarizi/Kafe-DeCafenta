'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function FilterMonthDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentMonthIdx = searchParams.get('month') 
    ? Number(searchParams.get('month')) - 1 
    : new Date().getMonth();
    
  const currentMonthName = MONTHS[currentMonthIdx] || 'Bulan ini';

  const handleSelect = (idx: number) => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', (idx + 1).toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span>Filter bulan : <span className="font-semibold text-black">{currentMonthName}</span></span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-2 z-30">
          <div className="max-h-64 overflow-y-auto">
            {MONTHS.map((m, idx) => (
              <button
                key={m}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors ${
                  idx === currentMonthIdx ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
