'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MenuNasi from './MenuNasi';
import MenuMie from './MenuMie';
import MenuSnack from './MenuSnack';
import MenuMinuman from './MenuMinuman';

const categories = ['Semua Menu', 'Nasi', 'Mie', 'Snack', 'Minuman'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Semua Menu');

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden flex flex-col">
      
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/Group 2 1.png" alt="Logo D" className="h-8 object-contain" />
          <span className="text-xs font-bold text-[#8b1c1c] tracking-widest mt-1">DE CAFENTA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-800">
          <a href="#" className="hover:text-[#8b1c1c] transition-colors">Tentang Kami</a>
          {/* Teks "Menu" berwarna merah menandakan halaman aktif */}
          <a href="#" className="text-[#8b1c1c]">Menu</a>
          <a href="#" className="hover:text-[#8b1c1c] transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-6 py-2 bg-[#8b1c1c] text-white text-sm font-bold rounded-full hover:bg-[#6b1d1d] transition-colors">
            Masuk
          </Link>
          <Link href="/daftar" className="px-6 py-2 bg-transparent border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm font-bold rounded-full hover:bg-[#8b1c1c] hover:text-white transition-colors">
            Daftar
          </Link>
        </div>
      </nav>

      {/* ================= HEADER MENU ================= */}
      <section className="px-8 md:px-16 pt-10 pb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black mb-6">Menu De Cafenta</h1>

        {/* Search Bar */}
        <div className="relative flex items-center mb-6">
          <div className="absolute left-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
            {/* Search Icon */}
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari Menu Pilihan Anda" 
            className="w-full pl-14 pr-4 py-3 rounded-full bg-white border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm shadow-sm"
          />
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <button 
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#8b1c1c] border-[#8b1c1c] text-white' // Aktif
                  : 'bg-transparent border-[#8b1c1c] text-[#8b1c1c] hover:bg-red-50' // Tidak aktif
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= KONTEN MENU ================= */}
      <section className="px-8 md:px-16 pb-90 max-w-7xl mx-auto space-y-12">
        {(activeCategory === 'Semua Menu' || activeCategory === 'Nasi') && <MenuNasi />}
        {(activeCategory === 'Semua Menu' || activeCategory === 'Mie') && <MenuMie />}
        {(activeCategory === 'Semua Menu' || activeCategory === 'Snack') && <MenuSnack />}
        {(activeCategory === 'Semua Menu' || activeCategory === 'Minuman') && <MenuMinuman />}
      </section>

     {/* ================= KONTAK & FOOTER ================= */}
      {/* Background Section Full Solid Pink, tidak digradasi */}
      <div className="relative bg-[#ff9c9c] pt-8 pb-1 px-8 md:px-15 overflow-visible">
        
        {/* Kotak Kontak Merah di Tengah */}
        <div className="relative max-w-[1000px] mx-auto bg-[#c40202] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-2xl z-10 mb-20 md:min-h-[280px] -mt-55">
          
          {/* Kiri: Ilustrasi Kotak Pos Placeholder */}
          <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0 relative">
             <div className="md:absolute md:-top-[300px] w-200 h-120 rounded-2xl flex flex-col items-center justify-center ">
                <img src="/ikon-pos-3d-dengan-kotak-surat 1.png" alt="image" className="w-full h-full object-contain" />
             </div>
             <div className="hidden md:block w-56 h-10"></div> 
          </div>

          {/* Kanan: Form Tanya */}
          <div className="w-full md:w-2/3 md:pl-12 text-white">
            <h3 className="text-sm font-bold mb-2 text-white/90">Punya Pertanyaan?</h3>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-snug">
              Kirimkan pertanyaan terbaik anda kepada pihak <span className="text-[#f4d03f]">DA CAFENTA</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="relative w-full">
                <div className="absolute left-1.0 top-1.0 w-[52px] h-[52px] bg-[#f4d03f] rounded-full flex items-center justify-center">
                  <img src="/ic_round-email.png" alt="Email Icon" className="w-8 h-8 text-white" />
                </div>
                <input 
                  type="text" 
                  placeholder="Pertanyaan" 
                  className="w-full pl-[70px] pr-6 py-[14px] rounded-full bg-white border-none focus:ring-4 focus:ring-[#f4d03f]/50 focus:outline-none text-black font-semibold shadow-inner text-base"
                />
              </div>
              <button className="w-full md:w-auto px-12 py-[14px] bg-[#f4d03f] text-white font-black rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap text-base shadow-lg">
                Kirim
              </button>
            </div>
            <p className="text-[11px] md:text-xs text-white/80 font-medium">
              Setiap pertanyaan anda akan menjadi peran agar kami melakukan improvisasi
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <footer className="text-center pt-8 pb-4 z-0 relative flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-6">
            {/* Placeholder D Footer */}
            <div className="w-16 h-16 flex items-center justify-center">
                <img src="/Group 2 1.png" alt="Icon" className="w-15 h-15 object-contain1 object-contain" />
            </div>
            <span className="text-base font-extrabold text-white tracking-[0.1em] mt-4">DE CAFENTA</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-[#6b1d1d] font-bold text-sm mb-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <p className="text-sm md:text-base">Durian Jangak, Kec. Pancur Batu, Kabupaten Deli Serdang, Sumatera Utara</p>
          </div>
          <p className="text-[#6b1d1d] font-black text-sm md:text-base">Buka 10:00 - 22:00 WIB</p>
        </footer>
      </div>

    </div>
  );
}
