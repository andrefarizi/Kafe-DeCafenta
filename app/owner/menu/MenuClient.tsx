'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Star } from 'lucide-react';

type OwnerMenuItem = {
  id: string;
  name: string;
  price: string;
  rating: string;
  image: string;
  category: string;
};

type MenuClientProps = {
  items: OwnerMenuItem[];
};

const defaultCategoryOrder = ['Nasi', 'Mie', 'Snack', 'Minuman'];

export default function MenuClient({ items }: MenuClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua Menu');

  const categories = useMemo(() => {
    const available = Array.from(new Set(items.map((item) => item.category)));
    const ordered = defaultCategoryOrder.filter((cat) => available.includes(cat));
    const extra = available.filter((cat) => !defaultCategoryOrder.includes(cat));
    return ['Semua Menu', ...ordered, ...extra];
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua Menu' || item.category === activeCategory;
      const matchesSearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchTerm]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-[#8B1A1A] mb-4">Daftar Menu</h2>

        <div className="flex items-center w-full border-[2.5px] border-[#FFC700] rounded-full mb-4 shadow-sm bg-white">
          <div className="bg-[#FFC700] w-12 h-12 md:w-12 md:h-12 rounded-full flex justify-center items-center ">
            <Search className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Contoh : Nasi Goreng"
            className="flex-1 px-4 py-2 text-sm focus:outline-none placeholder-gray-500 font-medium bg-transparent"
          />
        </div>

        <div className="flex">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
              className="appearance-none flex items-center justify-between w-auto min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm pr-8"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  Kategori berdasarkan : {category}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-black" />
          </div>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <p className="text-sm font-bold text-gray-600">Menu belum tersedia.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#FAFAFA] border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-36 md:h-44 w-full bg-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                <Star size={10} className="text-[#FFC700] fill-[#FFC700]" />
                <span className="text-white text-[10px] font-bold">{item.rating}</span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div>
                <h3 className="font-extrabold text-sm text-black line-clamp-1">{item.name}</h3>
                <p className="text-[10px] text-gray-600 font-medium mt-1">{item.price}</p>
              </div>

              <div className="mt-auto pt-4">
                <Link href={`/owner/menu/${item.id}`} className="block w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm text-center">
                  Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { OwnerMenuItem };
