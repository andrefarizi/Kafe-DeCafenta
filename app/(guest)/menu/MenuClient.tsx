'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MenuSection, { GuestMenuItem } from './MenuSection';

type MenuClientProps = {
  items: GuestMenuItem[];
  errorMessage?: string;
};

const categories = ['Semua Menu', 'Nasi', 'Mie', 'Snack', 'Minuman'];

export default function MenuClient({ items, errorMessage }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua Menu' || item.category === activeCategory;
      const matchesSearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchTerm]);

  const hasItems = filteredItems.length > 0;

  const router = useRouter();

  const handleAddClick = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden flex flex-col scroll-smooth">
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-white shadow-sm fixed top-0 w-full z-50">
        <div className="flex items-center gap-1 shrink-0">
          <img src="/Group 2 1.png" alt="Icon" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <span className="text-[10px] md:text-sm font-extrabold text-[#c8100e] tracking-widest mt-2 md:mt-3 hidden sm:block">DE CAFENTA</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 md:gap-10 text-[10px] sm:text-xs md:text-sm font-bold">
          <Link href="/" className="text-black hover:text-[#8b1c1c] transition-colors">Home</Link>
          <Link href="/menu" className="text-[#8b1c1c]">Menu</Link>
          <a href="#footer" className="text-black hover:text-[#8b1c1c] transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login" className="px-5 md:px-8 py-2 md:py-2.5 bg-[#8b1c1c] text-white text-xs md:text-sm font-bold rounded-full hover:bg-[#6b1d1d] transition-colors">
            Masuk
          </Link>
          <Link href="/daftar" className="px-5 md:px-8 py-2 md:py-2.5 bg-white border-2 border-[#8b1c1c] text-[#8b1c1c] text-xs md:text-sm font-bold rounded-full hover:bg-[#8b1c1c] hover:text-white transition-colors">
            Daftar
          </Link>
        </div>
      </nav>

      {/* ================= HEADER MENU ================= */}
      <section className="px-8 md:px-16 pt-10 pb-6 max-w-7xl mx-auto mt-20">
        <h1 className="text-3xl font-extrabold text-black mb-6">Menu De Cafenta</h1>

        {/* Search Bar */}
        <div className="relative flex items-center mb-6">
          <div className="absolute left-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari Menu Pilihan Anda"
            className="w-full pl-14 pr-4 py-3 rounded-full bg-white border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm shadow-sm"
          />
        </div>

        {/* Filter Kategori */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x flex-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap snap-start px-8 py-2 rounded-full text-sm font-bold border-2 transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#8b1c1c] border-[#8b1c1c] text-white'
                  : 'bg-transparent border-[#8b1c1c] text-[#8b1c1c] hover:bg-red-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= KONTEN MENU ================= */}
      <section className="px-8 md:px-16 pb-90 max-w-7xl mx-auto space-y-12">
        {errorMessage && (
          <p className="text-sm font-bold text-[#8b1c1c]">{errorMessage}</p>
        )}
        {!errorMessage && !hasItems && (
          <p className="text-sm font-bold text-gray-500">Menu belum tersedia.</p>
        )}
        {!errorMessage && hasItems && activeCategory === 'Semua Menu' && (
          <MenuSection
            title="Semua Menu"
            items={filteredItems}
            onAdd={handleAddClick}
          />
        )}
        {!errorMessage && hasItems && activeCategory !== 'Semua Menu' && (
          <MenuSection
            title={`Menu ${activeCategory}`}
            items={filteredItems}
            onAdd={handleAddClick}
          />
        )}
      </section>

      {/* ================= KONTAK & FOOTER ================= */}
      <div className="relative bg-[#ff9c9c] pt-8 pb-1 px-8 md:px-15 overflow-visible">
        <div className="relative max-w-[1000px] mx-auto bg-[#c40202] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-2xl z-10 mb-20 md:min-h-[280px] -mt-55">
          <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0 relative">
            <div className="md:absolute md:-top-[300px] w-200 h-120 rounded-2xl flex flex-col items-center justify-center ">
              <img
                src="/ikon-pos-3d-dengan-kotak-surat 1.png"
                alt="image"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden md:block w-56 h-10"></div>
          </div>

          <div className="w-full md:w-2/3 md:pl-12 text-white">
            <h3 className="text-sm font-bold mb-2 text-white/90">Punya Pertanyaan?</h3>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-snug">
              Kirimkan pertanyaan terbaik anda kepada pihak{' '}
              <span className="text-[#f4d03f]">DA CAFENTA</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="relative w-full">
                <div className="absolute left-1.0 top-1.0 w-[52px] h-[52px] bg-[#f4d03f] rounded-full flex items-center justify-center">
                  <img src="/ic_round-email.png" alt="Email Icon" className="w-8 h-8 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="decafenta@gmail.com"
                  disabled
                  className="w-full pl-[70px] pr-6 py-[14px] rounded-full bg-white border-none focus:ring-4 focus:ring-[#f4d03f]/50 focus:outline-none text-black font-semibold shadow-inner text-base"
                />
              </div>
            </div>
            <p className="text-[11px] md:text-xs text-white/80 font-medium">
              Setiap pertanyaan anda akan menjadi peran agar kami melakukan improvisasi
            </p>
          </div>
        </div>

        <footer className="text-center pt-8 pb-4 z-0 relative flex flex-col items-center justify-center " id="footer">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/Group 2 1.png" alt="Icon" className="w-15 h-15 object-contain1 object-contain" />
            </div>
            <span className="text-base font-extrabold text-white tracking-[0.1em] mt-4">
              DE CAFENTA
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[#6b1d1d] font-bold text-sm mb-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm md:text-base">
              Durian Jangak, Kec. Pancur Batu, Kabupaten Deli Serdang, Sumatera Utara
            </p>
          </div>
          <p className="text-[#6b1d1d] font-black text-sm md:text-base">Buka 10:00 - 22:00 WIB</p>
        </footer>
      </div>


    </div>
  );
}
