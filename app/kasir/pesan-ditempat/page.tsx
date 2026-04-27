"use client";

import React from 'react';

// --- ICONS (SVG) ---
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" className="mr-1">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);


const EditIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffc107" className="mr-1">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// --- MAIN COMPONENT ---
export default function FormPesananPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[26px] font-black">Pesan ditempat</h1>
          <button className="bg-[#8b0000] text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2">
            <span>+</span> Pesanan Baru
          </button>
        </div>

        {/* Master Container with Dark Red Border */}
        <div className="border-[1.5px] border-[#8b0000] rounded-xl p-6">
          
          {/* Section 1: Informasi Pesanan */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs font-bold mb-1">
                Kode Pesanan <span className="font-normal text-[10px] text-gray-500">(Terbuat Otomatis)</span>
              </p>
              <h2 className="text-[28px] font-black text-[#8b0000]">#DCF001</h2>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Nama Pelanggan</label>
              <input 
                type="text" 
                placeholder="contoh: Andre Ganteng" 
                className="w-full bg-white border border-gray-300 none rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b0000] placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Tipe Pesanan</label>
              <div className="relative">
                <select className="w-full bg-white border border-red-700 rounded-md p-3 text-sm appearance-none focus:outline-none focus:border-[#8b0000]">
                  <option>Makan ditempat</option>
                  <option>Bawa Pulang</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Daftar Pesanan */}
          <div className="mb-10">
            <h2 className="text-xl font-black mb-2">Daftar Pesanan</h2>
            <div className="border-t-[1.5px] border-black w-full mb-4"></div>

            {/* Table Header */}
            <div className="grid grid-cols-12 pb-3 text-[13px] font-bold">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-4 pl-2">Produk</div>
              <div className="col-span-3 text-center">Harga</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            

            {/* Table Items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="grid grid-cols-12 py-4 items-center">
                <div className="col-span-1 text-center text-sm">{item}</div>
                <div className="col-span-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                    <img src="/nasi goreng.png" alt="Nasgor wira" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-bold text-[15px] leading-tight">Nasgor wira</p>
                    <p className="text-[10px] text-gray-500 mb-1.5 mt-0.5">Catatan : Jangan pedas</p>
                    <button className="bg-[#ffc107] text-black text-[9px] px-3 py-1.5 rounded-full font-bold flex items-center hover:bg-[#e0a800] transition">
                      <EditIcon /> Ubah Catatan
                    </button>
                  </div>
                </div>
                <div className="col-span-3 text-center text-xs font-bold">Rp 30.000</div>
                <div className="col-span-2 flex justify-center items-center gap-3">
                  <button className="w-5 h-5 bg-[#8b0000] text-white rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-[#6b0000]">-</button>
                  <span className="font-bold text-[13px]">2</span>
                  <button className="w-5 h-5 bg-white border-[1.5px] border-[#8b0000] text-[#8b0000] rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-gray-50">+</button>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button className="bg-[#fce8e8] text-[#dc2626] px-3 py-1.5 rounded-md flex items-center text-[10px] font-bold hover:bg-[#fbd5d5] transition">
                    <TrashIcon /> Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* Subtotal & Total Container */}
            <div className="mt-4 pt-4 border-t-[1.5px] border-gray-200">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="font-normal text-gray-700">Subtotal</span>
                <span>Rp 20.000</span>
              </div>
              <div className="flex justify-between text-sm font-bold pb-4 border-b-[1.5px] border-black">
                <span className="font-normal text-gray-700">Pajak</span>
                <span>Rp 2.000</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-3">
                <span className="font-normal text-[13px] text-gray-700 leading-tight">Total<br/>dibayar</span>
                <span className="text-[22px] font-black text-[#8b0000]">Rp 22.000</span>
              </div>
            </div>
          </div>




          {/* Section 3: Daftar Menu */}
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4">Daftar Menu</h2>
            
             {/* Search Bar */}
        <div className="relative flex items-center mb-6">
          <div className="absolute left-0 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
            {/* Search Icon */}
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari Menu Pilihan Anda" 
            className="w-full pl-14 pr-4 py-3 rounded-full bg-white border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm shadow-sm"
          />
        </div>

            {/* Category Filters */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              <button className="border-[1.5px] border-[#8b0000] text-black px-5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap hover:bg-gray-50">Semua Menu</button>
              <button className="border-[1.5px] border-[#8b0000] text-black px-7 py-1.5 rounded-full font-bold text-xs whitespace-nowrap hover:bg-gray-50">Nasi</button>
              <button className="border-[1.5px] border-[#8b0000] text-black px-7 py-1.5 rounded-full font-bold text-xs whitespace-nowrap hover:bg-gray-50">Mie</button>
              <button className="bg-[#8b0000] border-[1.5px] border-[#8b0000] text-white px-7 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Snack</button>
              <button className="border-[1.5px] border-[#8b0000] text-black px-5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap hover:bg-gray-50">Minuman</button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="border-[1.5px] border-gray-200 rounded-xl p-2.5 bg-white shadow-sm flex flex-col">
                  <div className="relative aspect-square mb-2.5 rounded-lg overflow-hidden shrink-0">
                    <img src="/Frame 26.png" alt="Burger" className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded-[4px] flex items-center font-bold">
                      <StarIcon /> 5.0
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-[12px] truncate mb-0.5">Namaaaaaaaa...</h3>
                      <p className="text-[11px] text-gray-700 mb-3">Rp 60.000</p>
                    </div>
                    <button className="w-full bg-[#8b0000] text-white py-2 rounded-md font-bold text-[11px] hover:bg-[#6b0000] transition">
                      Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="space-y-3 mt-10">
            <button className="w-full bg-[#8b0000] text-white py-3.5 rounded-md font-bold text-sm hover:bg-[#6b0000] transition shadow-sm">
              Konfirmasi Pesanan
            </button>
            <button className="w-full bg-white border-[1.5px] border-[#8b0000] text-[#8b0000] py-3.5 rounded-md font-bold text-sm hover:bg-red-50 transition shadow-sm">
              Batalkan Pesanan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}