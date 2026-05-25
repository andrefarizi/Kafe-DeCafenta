'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Star } from 'lucide-react';

type OwnerMenuItem = {
  id: string;
  name: string;
  price: string;
  rating: string;
  category: string;
  isAvailable: boolean;
  image: string;
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
            className="w-full sm:flex-1 px-4 py-2 text-sm focus:outline-none placeholder-gray-500 font-medium bg-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                activeCategory === category
                  ? 'bg-[#8B0000] border-[#8B0000] text-white'
                  : 'bg-white border-[#8B0000] text-black hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 && (
        <p className="text-sm font-bold text-gray-600">Menu belum tersedia.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-12">
        {filteredItems.map((item) => (
          <Link href={`/owner/menu/${item.id}`} key={item.id} className="block h-full cursor-pointer">
            <div className="bg-white rounded-[16px] md:rounded-[20px] p-3 md:p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="relative w-full h-[120px] md:h-[160px] rounded-[12px] md:rounded-[15px] overflow-hidden mb-2 md:mb-3">
                <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale opacity-70' : ''}`} />
                <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[9px] md:text-[10px] font-bold z-10">
                  <Star size={9} className="text-yellow-400 fill-yellow-400" />
                  {item.rating}
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] md:text-xs font-bold rounded-full">Tidak Tersedia</span>
                  </div>
                )}
              </div>
              <div className="w-full flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-black text-[12px] md:text-md mb-0.5 md:mb-1 line-clamp-2 leading-tight">{item.name}</h3>
                  <p className="text-[11px] md:text-sm text-black font-medium">{item.price}</p>
                </div>
                <div className="mt-2 md:mt-4">
                  <div className="w-full bg-[#8B0000] text-center text-white py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-[#6A0000] transition-colors">
                    Detail
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export type { OwnerMenuItem };
