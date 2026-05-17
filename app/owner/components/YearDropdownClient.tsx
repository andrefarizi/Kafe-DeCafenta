"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface Props {
  currentYear: number;
  month: number;
}

export default function YearDropdownClient({ currentYear, month }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleSelect = (year: number) => {
    setIsOpen(false);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('year', String(year));
    params.set('month', String(month));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span>Filter Tahun : <span className="font-bold text-black">{currentYear}</span></span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => handleSelect(y)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentYear === y ? 'font-bold text-[#8B1A1A] bg-red-50' : 'text-gray-700'}`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
