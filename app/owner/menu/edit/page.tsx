import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Pencil, Star } from 'lucide-react';

// --- Dummy Data Ulasan ---
const ulasanData = [
  {
    id: 1,
    nama: 'Flins',
    tanggal: '31 Februari 2026',
    rating: '5.0',
    komentar: 'keren',
    avatar: '/Ellipse 9.png' // Placeholder Avatar
  },
  {
    id: 2,
    nama: 'Andre wira pratama',
    tanggal: '31 Februari 2026',
    rating: '5.0',
    komentar: 'luar biasa yes yes yes',
    avatar: '/Ellipse 9 (1).png' // Placeholder Kucing
  }
];

export default function DetailMenu() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Detail Menu</h1>
      </div>

      {/* --- KARTU DETAIL UTAMA --- */}
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-8 mb-8 bg-white shadow-sm">
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Kolom Kiri: Gambar Menu */}
          <div className="relative w-full md:w-1/2 aspect-square max-w-sm flex items-center justify-center mx-auto md:mx-0 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            <img 
              src="/kentang goreng.png" 
              alt="Kentang Goreng" 
              className="w-full h-full object-cover"
            />
            {/* Tombol Edit Gambar */}
            <button className="absolute bottom-4 right-4 flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
              <Pencil size={14} fill="currentColor" className="text-white" />
              <span className="text-xs font-bold">Edit Gambar</span>
            </button>
          </div>

          {/* Kolom Kanan: Info Menu */}
          <div className="w-full md:w-1/2 flex flex-col justify-start pt-2">
            
            {/* Nama Menu */}
            <div className="mb-8">
              <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-1 transition-all">
                <Pencil size={12} strokeWidth={3} />
                <span className="text-[11px] font-extrabold">Edit Nama</span>
              </button>
              <h2 className="text-3xl font-extrabold text-black">Nama Menu</h2>
            </div>

            {/* Harga Menu */}
            <div className="mb-10">
              <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-1 transition-all">
                <Pencil size={12} strokeWidth={3} />
                <span className="text-[11px] font-extrabold">Edit Harga</span>
              </button>
              <p className="text-5xl font-black text-black">Rp20.000</p>
            </div>

            {/* Kotak Rating */}
            <div className="bg-[#8B1A1A] rounded-3xl p-2.5 w-60 shadow-sm">
              <div className="bg-white text-[#8B1A1A] text-center font-extrabold text-lg py-2 rounded-2xl mb-2">
                Rating
              </div>
              <div className="flex justify-center items-center space-x-3 pb-1 pt-1">
                <span className="text-white font-black text-2xl">5.0</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFC700" className="text-[#FFC700]" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Baris Bawah: Deskripsi Menu */}
        <div className="border-t border-gray-200 pt-6">
          <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-2 transition-all">
            <Pencil size={12} strokeWidth={3} />
            <span className="text-[11px] font-extrabold">Edit Deskripsi</span>
          </button>
          <h3 className="text-lg font-extrabold text-black mb-3">Deskripsi Menu</h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </div>

      </div>

      {/* --- KARTU ULASAN --- */}
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-8 bg-white shadow-sm">
        
        {/* Header Ulasan */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-extrabold text-black">Ringkasan Ulasan (3rb ulasan)</h3>
          <Link href="/owner/ulasan" className="text-[#8B1A1A] font-extrabold text-sm hover:underline">
            Lihat Semua
          </Link>
        </div>

        {/* Daftar Ulasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ulasanData.map((ulasan) => (
            <div key={ulasan.id} className="flex space-x-4">
              {/* Avatar */}
              <img 
                src={ulasan.avatar} 
                alt={ulasan.nama} 
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              
              {/* Detail Ulasan */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-black">{ulasan.nama}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{ulasan.tanggal}</p>
                  </div>
                  
                  {/* Badge Rating Kecil */}
                  <div className="bg-[#8B1A1A] flex items-center space-x-1 px-2 py-0.5 rounded-md">
                    <Star size={10} fill="#FFC700" className="text-[#FFC700]" />
                    <span className="text-white text-[10px] font-bold">{ulasan.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-black font-medium mt-3">
                  {ulasan.komentar}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}