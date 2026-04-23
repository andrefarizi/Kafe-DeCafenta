'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Trash2, CheckCircle2 } from 'lucide-react';

// --- Types ---
type StatusMeja = 'Tersedia' | 'Dipakai';

interface Meja {
  id: number;
  kode: string;
  status: StatusMeja;
}

// --- Dummy Data ---
const mejaData: Meja[] = [
  { id: 1, kode: '#MJ01', status: 'Tersedia' },
  { id: 2, kode: '#MJ02', status: 'Dipakai' },
  { id: 3, kode: '#MJ03', status: 'Tersedia' },
  { id: 4, kode: '#MJ04', status: 'Tersedia' },
  { id: 5, kode: '#MJ05', status: 'Dipakai' },
  { id: 6, kode: '#MJ06', status: 'Tersedia' },
  { id: 7, kode: '#MJ07', status: 'Tersedia' },
  { id: 8, kode: '#MJ08', status: 'Tersedia' },
  { id: 9, kode: '#MJ09', status: 'Tersedia' },
  { id: 10, kode: '#MJ010', status: 'Tersedia' },
  { id: 11, kode: '#MJ011', status: 'Tersedia' },
  { id: 12, kode: '#MJ012', status: 'Tersedia' },
];

type ModalState = 'none' | 'tambah' | 'berhasil';

export default function ManajemenMeja() {
  const [modalState, setModalState] = useState<ModalState>('none');
  const [hapusMeja, setHapusMeja] = useState<Meja | null>(null);

  // Komponen Helper untuk Kartu Meja di dalam Denah
  const DenahCard = ({ meja }: { meja: Meja }) => (
    <div className="relative border border-[#8B1A1A] rounded-xl p-3 flex flex-col justify-between h-28 bg-white shadow-sm">
      {/* Badge Status */}
      <div 
        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-bold tracking-wide ${
          meja.status === 'Tersedia' 
            ? 'bg-[#22C55E] text-white' 
            : 'bg-[#FFC700] text-[#8B1A1A]'
        }`}
      >
        {meja.status}
      </div>
      
      <div>
        <p className="font-extrabold text-sm text-black">Meja {meja.id}</p>
        <p className="text-[10px] text-[#8B1A1A] font-bold mt-0.5">{meja.kode}</p>
      </div>
      
      <div className="flex justify-center mt-auto">
        <button 
          className={`text-[8px] font-bold py-1.5 px-3 rounded-md w-full transition-colors ${
            meja.status === 'Tersedia' 
              ? 'bg-[#8B1A1A] text-white hover:bg-red-900' 
              : 'bg-white border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50'
          }`}
        >
          Ubah Status - {meja.status === 'Tersedia' ? 'Dipakai' : 'Tersedia'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-black">Manajemen Meja</h1>
        <button 
          onClick={() => setModalState('tambah')}
          className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Tambah Meja</span>
        </button>
      </div>

      {/* --- SECTION 1: DENAH MEJA --- */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[800px] h-[650px] relative border-[3px] border-[#8B1A1A] rounded-2xl bg-white mt-2">
          
          {/* Label Denah Meja (Tab Kuning) */}
          <div className="absolute -top-[3px] left-8 bg-[#FFC700] px-8 py-2.5 rounded-b-xl text-black font-extrabold z-10 text-sm">
            Denah Meja
          </div>

          {/* Button Atur Tata Letak */}
          <Link href="/owner/meja/tata-letak" className="absolute top-4 right-4 flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 shadow-sm">
            <LayoutGrid size={14} />
            <span>Atur Tata Letak</span>
          </Link>

          {/* Label Pintu Masuk */}
          <div className="absolute -bottom-[3px] left-[20%] transform translate-y-1/2 bg-white px-6 py-1.5 border-[3px] border-[#8B1A1A] rounded-lg text-[#8B1A1A] font-extrabold text-[11px] z-10">
            Pintu Masuk
          </div>

          {/* --- WALLS / SEKAT RUANGAN --- */}
          {/* Garis Vertikal */}
          <div className="absolute top-0 bottom-[64%] left-[48%] w-[3px] bg-[#8B1A1A] z-0"></div>
          {/* Garis Horizontal */}
          <div className="absolute top-[35%] left-[60%] right-0 h-[3px] bg-[#8B1A1A] z-0"></div>

          {/* --- TABLE PLACEMENT GROUPS --- */}
          
          {/* Group Kiri (Meja 1-6) */}
          <div className="absolute top-20 left-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {mejaData.filter(m => m.id >= 1 && m.id <= 6).map(meja => (
              <DenahCard key={meja.id} meja={meja} />
            ))}
          </div>

          {/* Group Kanan Atas (Meja 11-12) */}
          <div className="absolute top-20 right-[5%] w-[38%] grid grid-cols-2 gap-x-6">
            {mejaData.filter(m => m.id >= 11 && m.id <= 12).map(meja => (
              <DenahCard key={meja.id} meja={meja} />
            ))}
          </div>

          {/* Group Kanan Bawah (Meja 7-10) */}
          <div className="absolute top-[45%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {mejaData.filter(m => m.id >= 7 && m.id <= 10).map(meja => (
              <DenahCard key={meja.id} meja={meja} />
            ))}
          </div>

        </div>
      </div>

      {/* --- SECTION 2: DAFTAR MEJA --- */}
      <div className="mt-8 border-[3px] border-[#8B1A1A] rounded-3xl p-6 md:p-8 bg-[#FAFAFA]">
        <h2 className="text-2xl font-extrabold text-[#8B1A1A] mb-8">Daftar Meja</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mejaData.map((meja) => (
            <div key={`daftar-${meja.id}`} className="border border-[#8B1A1A] rounded-xl p-5 flex flex-col justify-between h-36 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-lg text-black">Meja {meja.id}</p>
                <p className="text-xs text-[#8B1A1A] font-bold mt-1">{meja.kode}</p>
              </div>
              
              <div className="flex justify-end items-end w-full">
                <button
                  onClick={() => setHapusMeja(meja)}
                  className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-5 rounded-md transition-colors w-fit"
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                  <span>Hapus Meja</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== MODAL HAPUS MEJA ====== */}
      {hapusMeja && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans"
          onClick={(e) => { if (e.target === e.currentTarget) setHapusMeja(null); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            
            {/* Warning Icon (Red Circle with Exclamation) */}
            <div className="w-20 h-20 bg-[#FF4C4C] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-[40px] font-black leading-none mt-1">
                !
              </span>
            </div>

            {/* Confirmation Message */}
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
              Yakin Ingin <br /> Menghapus Meja?
            </h2>

            {/* Action Buttons Container */}
            <div className="w-full flex flex-col space-y-4">
              
              {/* Lanjutkan Button (Primary / Destructive Action) */}
              <button
                onClick={() => setHapusMeja(null)}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Lanjutkan
              </button>
              
              {/* Batal Button (Secondary Action) */}
              <button
                onClick={() => setHapusMeja(null)}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Batal
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ====== MODAL TAMBAH / BERHASIL ====== */}
      {modalState !== 'none' && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalState('none'); }}
        >
          {/* ── Modal Tambah Meja ── */}
          {modalState === 'tambah' && (
            <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-sm p-8 flex flex-col items-center text-center shadow-2xl relative">
              {/* Tombol tutup */}
              <button 
                onClick={() => setModalState('none')}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Ilustrasi */}
              <div className="w-28 h-28 mb-5 flex items-center justify-center">
                <img src="/Group (6).png" alt="Ilustrasi Meja" className="w-full h-full object-contain" />
              </div>

              <h2 className="text-xl font-extrabold text-black mb-2">Tambah Meja Baru</h2>
              <p className="text-xs text-gray-500 font-medium mb-6">Masukkan nama atau nomor meja baru yang akan ditambahkan ke denah.</p>

              {/* Input Nomor Meja */}
              <div className="w-full mb-4">
                <label className="block text-left text-sm font-extrabold text-black mb-2">Nomor Meja</label>
                <input
                  type="text"
                  placeholder="Contoh: Meja 13"
                  className="w-full border-[2px] border-[#8B1A1A] rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 transition-all"
                />
              </div>

              {/* Input Kode Meja */}
              <div className="w-full mb-8">
                <label className="block text-left text-sm font-extrabold text-black mb-2">Kode Meja</label>
                <input
                  type="text"
                  placeholder="Contoh: #MJ013"
                  className="w-full border-[2px] border-[#8B1A1A] rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 transition-all"
                />
              </div>

              {/* Tombol Tambahkan Meja */}
              <button
                onClick={() => setModalState('berhasil')}
                className="w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Tambahkan Meja
              </button>
            </div>
          )}

          {/* ── Modal Berhasil Ditambahkan ── */}
          {modalState === 'berhasil' && (
            <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl">
              {/* Ilustrasi */}
              <div className="w-28 h-28 md:w-32 md:h-32 mb-6 flex items-center justify-center">
                <img 
                  src="/Group (6).png" 
                  alt="Ilustrasi Toko" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Ikon centang sukses */}
              <div className="mb-4">
                <CheckCircle2 size={48} className="text-[#22C55E] mx-auto" strokeWidth={1.5} />
              </div>

              {/* Pesan Sukses */}
              <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
                Meja Berhasil <br /> Ditambahkan
              </h2>

              {/* Tombol Lanjutkan */}
              <button 
                onClick={() => setModalState('none')}
                className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Lanjutkan
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}