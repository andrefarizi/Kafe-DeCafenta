"use client";

import React, { useState } from 'react';

// --- ICONS (SVG) ---
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
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
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 mr-1">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// --- COMPONENT ---
export default function CheckoutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(2);

  // Fungsi untuk membuka/menutup modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black">Pesan ditempat</h1>
          <button className="bg-[#8a0000] text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2">
            <span>+</span> Pesanan Baru
          </button>
        </div>

        {/* Main Bordered Container */}
        <div className="border border-[#8a0000] rounded-xl p-6">
          
          {/* Section 1: Form Info */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs font-bold mb-1">Kode Pesanan <span className="font-normal text-gray-500 text-[10px]">(Format Otomatis)</span></p>
              <h2 className="text-2xl font-black text-[#8a0000]">#DCF001</h2>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Nama Pelanggan</label>
              <input 
                type="text" 
                placeholder="Contoh: andre ganteng" 
                className="w-full bg-[#f4f5f7] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a0000]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Tipe Pesanan</label>
              <div className="relative">
                <select className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm appearance-none focus:outline-none focus:border-[#8a0000]">
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
            <h2 className="text-lg font-black mb-4">Daftar Pesanan</h2>
            
            <div className="border-t-2 border-black w-full mb-4"></div>

            {/* Table Header */}
            <div className="grid grid-cols-12 pb-2 border-b border-gray-200 text-xs font-bold">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-4">Produk</div>
              <div className="col-span-3 text-center">Harga</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            {/* Table Items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="grid grid-cols-12 py-4 border-b border-gray-100 items-center">
                <div className="col-span-1 text-center text-sm">{item}</div>
                <div className="col-span-4 flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src="/api/placeholder/100/100" alt="Nasgor wira" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Nasgor wira</p>
                    <p className="text-[10px] text-gray-500 mb-1">Catatan: Jangan pedas</p>
                    <button className="bg-[#ffc107] text-black text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
                      <EditIcon /> Ubah Catatan
                    </button>
                  </div>
                </div>
                <div className="col-span-3 text-center text-xs font-bold">Rp 20.000</div>
                <div className="col-span-2 flex justify-center items-center gap-2">
                  <button className="w-4 h-4 bg-[#8a0000] text-white rounded-sm flex items-center justify-center text-xs font-bold">-</button>
                  <span className="font-bold text-xs">2</span>
                  <button className="w-4 h-4 bg-white border border-[#8a0000] text-[#8a0000] rounded-sm flex items-center justify-center text-xs font-bold">+</button>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold">
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
              <div className="flex justify-between text-xs font-bold pb-4 border-b-2 border-black">
                <span>Pajak</span>
                <span>Rp 2.000</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="font-normal">Total<br/>dibayar</span>
                <span className="text-lg font-black text-[#8a0000]">Rp 22.000</span>
              </div>
            </div>
          </div>

          {/* Section 3: Daftar Menu */}
          <div>
            <h2 className="text-lg font-black mb-4">Daftar Menu</h2>
            
            {/* Search Bar */}
            <div className="relative flex mb-6">
              <div className="bg-[#ffc107] w-12 flex items-center justify-center rounded-l-full z-10">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Cari Menu" 
                className="w-full border-2 border-[#ffc107] rounded-r-full py-2 px-4 text-sm focus:outline-none -ml-1"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
              <button className="border-2 border-[#8a0000] text-black px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Semua Menu</button>
              <button className="border-2 border-[#8a0000] text-black px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Nasi</button>
              <button className="border-2 border-[#8a0000] text-black px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Mie</button>
              <button className="bg-[#8a0000] border-2 border-[#8a0000] text-white px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Snack</button>
              <button className="border-2 border-[#8a0000] text-black px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">Minuman</button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="border border-gray-200 rounded-xl p-2.5">
                  <div className="relative aspect-square mb-2 rounded-lg overflow-hidden">
                    <img src="/api/placeholder/200/200" alt="Burger" className="w-full h-full object-cover" />
                    <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center">
                      <StarIcon /> 5.0
                    </div>
                  </div>
                  <h3 className="font-bold text-[11px] truncate">Namaaaaaa...</h3>
                  <p className="text-[10px] text-gray-500 mb-2">Rp 10.000</p>
                  <button onClick={toggleModal} className="w-full bg-[#8a0000] text-white py-1.5 rounded-md font-bold text-[10px]">
                    Tambah
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#8a0000] text-white py-3 rounded-md font-bold text-sm">
                Konfirmasi Pesanan
              </button>
              <button className="w-full bg-white border border-[#8a0000] text-[#8a0000] py-3 rounded-md font-bold text-sm">
                Batalkan Pesanan
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* --- MODAL OVERLAY & CONTENT (Image 2) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8fafc] rounded-2xl p-5 w-full max-w-md shadow-2xl relative border-2 border-gray-200">
            
            {/* Close Button Overlay (Optional for better UX) */}
            <button onClick={toggleModal} className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 font-bold">✕</button>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 mt-2">
              <h2 className="text-xl font-black">Namaaaaaaaaa..</h2>
              <span className="text-lg font-black text-[#8a0000]">Rp 20.000</span>
            </div>

            {/* Modal Body */}
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-white shadow-sm">
                <img src="/api/placeholder/200/200" alt="Kentang Goreng" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold mb-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Catatan (opsional)
                </label>
                <textarea 
                  placeholder="Contoh: jangan pedas, ya" 
                  className="w-full bg-[#f1f5f9] border border-gray-200 rounded-lg p-2 text-xs flex-1 resize-none focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            {/* Modal Footer Controls */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Jumlah Pembelian</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-6 h-6 bg-[#8a0000] text-white rounded flex items-center justify-center font-bold"
                >-</button>
                <span className="font-bold">{modalQuantity}</span>
                <button 
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-6 h-6 bg-white border border-[#8a0000] text-[#8a0000] rounded flex items-center justify-center font-bold"
                >+</button>
              </div>
            </div>

            {/* Add Button */}
            <button 
              onClick={toggleModal}
              className="w-full bg-[#8a0000] text-white py-3 rounded-full font-bold text-sm shadow-md"
            >
              Tambah Pembelian - Rp { (20000 * modalQuantity).toLocaleString('id-ID') }
            </button>

          </div>
        </div>
      )}
      
    </div>
  );
}