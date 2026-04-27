"use client";

import React, { useState } from 'react';

// --- ICONS (SVG) ---
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mr-1">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

const DocEditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// --- MAIN COMPONENT ---
export default function FormPesananPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [catatanText, setCatatanText] = useState("Jangan pedas");

  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">Pesan ditempat</h1>
          <button className="bg-[#8b0000] text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2">
            <span>+</span> Pesanan Baru
          </button>
        </div>

        {/* Master Container with Red Border */}
        <div className="border border-[#8b0000] rounded-xl p-6">
          
          {/* Section 1: Data Pelanggan */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs font-bold mb-1">
                Kode Pesanan <span className="font-normal text-[10px] text-gray-500">(Format Otomatis)</span>
              </p>
              <h2 className="text-3xl font-black text-[#8b0000]">#DCF001</h2>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Nama Pelanggan</label>
              <input 
                type="text" 
                placeholder="Contoh: Andre Ganteng" 
                className="w-full bg-[#f3f4f6] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Tipe Pesanan</label>
              <div className="relative">
                <select className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm appearance-none focus:outline-none focus:border-[#8b0000]">
                  <option>Makan ditempat</option>
                  <option>Bawa Pulang</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Daftar Pesanan */}
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4">Daftar Pesanan</h2>
            <div className="border-t-2 border-black w-full mb-4"></div>

            {/* Table Header */}
            <div className="grid grid-cols-12 pb-3 border-b border-black text-xs font-bold">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-4">Produk</div>
              <div className="col-span-3 text-center">Harga</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            {/* Table Items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="grid grid-cols-12 py-4 border-b border-gray-200 items-center">
                <div className="col-span-1 text-center text-xs">{item}</div>
                <div className="col-span-4 flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-200 p-0.5">
                    <img src="/api/placeholder/100/100" alt="Nasgor wira" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Nasgor wira</p>
                    <p className="text-[10px] text-gray-500 mb-1">Catatan: Jangan pedas</p>
                    <button onClick={toggleEditModal} className="bg-[#ffc107] text-black text-[9px] px-2.5 py-1 rounded-full font-bold flex items-center hover:bg-[#e0a800]">
                      <EditIcon /> Ubah Catatan
                    </button>
                  </div>
                </div>
                <div className="col-span-3 text-center text-xs font-bold">Rp 20.000</div>
                <div className="col-span-2 flex justify-center items-center gap-2">
                  <button className="w-5 h-5 bg-[#8b0000] text-white rounded-sm flex items-center justify-center text-xs font-bold">-</button>
                  <span className="font-bold text-xs">2</span>
                  <button className="w-5 h-5 bg-white border border-[#8b0000] text-[#8b0000] rounded-sm flex items-center justify-center text-xs font-bold">+</button>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button className="bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded flex items-center text-[9px] font-bold">
                    <TrashIcon /> Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* Subtotal & Total */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Subtotal</span>
                <span>Rp 20.000</span>
              </div>
              <div className="flex justify-between text-xs font-bold pb-4 border-b border-black">
                <span>Pajak</span>
                <span>Rp 2.000</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="font-normal text-xs text-gray-600">Total<br/>dibayar</span>
                <span className="text-xl font-black text-[#8b0000]">Rp 22.000</span>
              </div>
            </div>
          </div>

          {/* Section 3: Daftar Menu */}
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4">Daftar Menu</h2>
            
            {/* Search Bar */}
            <div className="relative flex mb-6">
              <div className="bg-[#ffc107] w-12 flex items-center justify-center rounded-l-full z-10 border border-[#ffc107]">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Cari Menu" 
                className="w-full border border-[#ffc107] rounded-r-full py-2.5 px-4 text-sm focus:outline-none -ml-1"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <button className="border border-[#8b0000] text-black px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Semua Menu</button>
              <button className="border border-[#8b0000] text-black px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Nasi</button>
              <button className="border border-[#8b0000] text-black px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Mie</button>
              <button className="bg-[#8b0000] border border-[#8b0000] text-white px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Snack</button>
              <button className="border border-[#8b0000] text-black px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Minuman</button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="border border-gray-200 rounded-xl p-2 bg-white">
                  <div className="relative aspect-square mb-2 rounded-lg overflow-hidden">
                    <img src="/api/placeholder/200/200" alt="Burger" className="w-full h-full object-cover" />
                    <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center">
                      <StarIcon /> 5.0
                    </div>
                  </div>
                  <h3 className="font-bold text-[11px] truncate">Namaaaaaaaaa...</h3>
                  <p className="text-[10px] text-gray-500 mb-2">Rp 40.000</p>
                  <button className="w-full bg-[#8b0000] text-white py-1.5 rounded-md font-bold text-[10px] hover:bg-[#6b0000]">
                    Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-[#8b0000] text-white py-3 rounded-md font-bold text-sm hover:bg-[#6b0000] transition">
              Konfirmasi Pesanan
            </button>
            <button className="w-full bg-white border border-[#8b0000] text-[#8b0000] py-3 rounded-md font-bold text-sm hover:bg-gray-50 transition">
              Batalkan Pesanan
            </button>
          </div>

        </div>
      </div>

      {/* --- MODAL EDIT CATATAN (Image 2) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8fafc] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative border border-gray-200">
            
            <button onClick={toggleEditModal} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 font-bold">✕</button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-4">
              <DocEditIcon />
              <h2 className="text-xl font-black">Edit Catatan</h2>
            </div>

            {/* Input Textarea */}
            <div className="mb-6">
              <textarea 
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#8b0000] h-24"
              ></textarea>
            </div>

            {/* Save Button */}
            <button 
              onClick={toggleEditModal}
              className="w-full bg-[#8b0000] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#6b0000] transition"
            >
              Simpan Perubahan
            </button>
            
          </div>
        </div>
      )}
      
    </div>
  );
}