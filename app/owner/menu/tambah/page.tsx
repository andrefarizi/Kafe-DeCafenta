'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function TambahMenu() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/owner/menu" className="mr-4 p-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Tambah Menu</h1>
      </div>

      {/* Main Card Container */}
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-10 bg-white shadow-sm mb-12">
        
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowModal(true); }}>
          
          {/* Area Upload Gambar Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Gambar Menu
            </label>
            <div className="w-full h-64 md:h-72 bg-[#F8F9FA] border border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <img 
                src="/Frame 560.png" 
                alt="Upload Menu" 
                className="w-16 h-16 object-contain mb-4" 
              />
              <h3 className="text-lg md:text-xl font-extrabold text-black mb-2 text-center">
                Tarik Gambar atau Tekan disini
              </h3>
              <p className="text-xs font-medium text-gray-500 text-center">
                Format file yang didukung PNG , JPG , SVG
              </p>
            </div>
          </div>

          {/* Input Nama Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Nama Menu
            </label>
            <input 
              type="text" 
              placeholder="contoh : Ayam Penyet" 
              className="w-full bg-gray-200 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            />
          </div>

          {/* Select Kategori */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Kategori
            </label>
            <div className="relative">
              <select className="w-full bg-gray-200 border border-red-700 rounded-xl px-5 py-3.5 text-sm text-black font-extrabold appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all cursor-pointer">
                <option value="nasi">Nasi</option>
                <option value="mie">Mie</option>
                <option value="minuman">Minuman</option>
                <option value="snack">Snack</option>
              </select>
              {/* Custom Dropdown Icon */}
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <ChevronDown size={20} className="text-black" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Input Harga Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Harga Menu
            </label>
            <input 
              type="text" 
              placeholder="Rp. XXXXXXXX" 
              className="w-full bg-gray-200 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            />
          </div>

          {/* Input Deskripsi Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Deskripsi Menu
            </label>
            <textarea 
              rows={5} 
              placeholder="Contoh : Ini adalah Ayam Penyet Terbaik yang pernah ada ( Maksimal 100 Karakter )" 
              className="w-full bg-gray-200 border border-gray-200 rounded-xl px-5 py-4 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              className="w-full sm:w-auto px-12 bg-[#8B1A1A] hover:bg-red-900 text-white text-center font-extrabold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Simpan Menu
            </button>
          </div>

        </form>

      </div>

      {/* ====== MODAL BERHASIL DITAMBAHKAN ====== */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[360px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl">
            
            {/* Ikon Sukses */}
            <div className="mb-3">
              <CheckCircle2 size={64} className="text-[#22C55E] mx-auto" strokeWidth={1.5} />
            </div>

            {/* Ilustrasi */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img 
                src="/Group (6).png" 
                alt="Ilustrasi Sukses" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Pesan Sukses */}
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-3">
              Menu Berhasil <br /> Ditambahkan!
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-8">
              Menu baru berhasil ditambahkan ke daftar menu.
            </p>

            {/* Tombol Kembali ke Menu */}
            <Link
              href="/owner/menu"
              className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm text-center block"
            >
              Kembali ke Manajemen Menu
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}