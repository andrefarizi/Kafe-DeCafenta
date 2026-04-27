"use client";

import React from 'react';

// --- TIPE DATA ---
type Meja = {
  id: number;
  no: string;
  status: 'Tersedia' | 'Dipakai';
};

// --- KOMPONEN UTAMA ---
export default function ManajemenMeja() {
  // Data Mapping sesuai gambar desain
  const mejaLeft: Meja[] = [
    { id: 1, no: '#MJ01', status: 'Tersedia' },
    { id: 2, no: '#MJ02', status: 'Dipakai' },
    { id: 3, no: '#MJ03', status: 'Tersedia' },
    { id: 4, no: '#MJ04', status: 'Tersedia' },
    { id: 5, no: '#MJ05', status: 'Dipakai' },
    { id: 6, no: '#MJ06', status: 'Tersedia' }, 
  ];

  const mejaTopRight: Meja[] = [
    { id: 11, no: '#MJ11', status: 'Tersedia' },
    { id: 12, no: '#MJ12', status: 'Tersedia' },
  ];

  const mejaBottomRight: Meja[] = [
    { id: 7, no: '#MJ07', status: 'Tersedia' },
    { id: 8, no: '#MJ08', status: 'Tersedia' },
    { id: 9, no: '#MJ09', status: 'Tersedia' },
    { id: 10, no: '#MJ10', status: 'Tersedia' },
  ];

  // Komponen Reusable untuk Kotak Meja
  const RenderCard = ({ meja }: { meja: Meja }) => (
    <div key={meja.id} className="bg-white border-[1.5px] border-[#8b0000] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-[130px] shadow-sm">
      {/* Badge Status di Pojok Kanan Atas */}
      <div 
        className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-bold rounded-bl-lg 
        ${meja.status === 'Tersedia' ? 'bg-[#22c55e] text-white' : 'bg-[#ffc107] text-black'}`}
      >
        {meja.status}
      </div>
      
      <div>
        <h3 className="font-black text-lg">Meja {meja.id}</h3>
        <p className="text-[10px] text-[#8b0000] font-bold">{meja.no}</p>
      </div>

      <button 
        className={`w-full py-1.5 rounded-md text-[9px] font-bold transition-all 
        ${meja.status === 'Tersedia' 
          ? 'bg-[#8b0000] text-white hover:bg-[#6b0000]' 
          : 'bg-white text-[#8b0000] border border-[#8b0000] hover:bg-red-50'}`}
      >
        Ubah Status - {meja.status === 'Tersedia' ? 'Dipakai' : 'Tersedia'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black font-sans p-6 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Manajemen Meja</h1>

        {/* Master Container dengan Garis Merah (Dinding Luar) */}
        <div className="border-[3px] border-[#8b0000] rounded-2xl relative bg-white mt-4 pb-16 pt-8 px-8">
          
          {/* Garis Pemisah Vertikal dari atas */}
          <div className="absolute top-0 left-[52%] w-[3px] bg-[#8b0000] h-[42%]"></div>

          {/* Garis Pemisah Horizontal dari kanan */}
          <div className="absolute top-[42%] right-0 h-[4px] bg-[#8b0000] w-[35%]"></div>

          {/* --- LABEL DENAH --- */}
          <div className="absolute top-0 left-0 bg-[#ffc107] text-[15px] font-black px-10 py-3 rounded-tl-[13px] rounded-br-2xl z-10">
            Denah Meja
          </div>

          {/* Container Denah Ruangan */}
          <div className="flex flex-col md:flex-row gap-16 relative mt-12 z-10">
            
            {/* Bagian Kiri (Meja 1-6) */}
            <div className="flex-[1.1] grid grid-cols-2 gap-6 pb-2">
              {mejaLeft.map(meja => <RenderCard key={meja.id} meja={meja} />)}
            </div>

            {/* Bagian Kanan */}
            <div className="flex-1 flex flex-col pb-2">
               
               {/* Kanan Atas (11 & 12) */}
               <div className="grid grid-cols-2 gap-6 mb-20">
                 {mejaTopRight.map(meja => <RenderCard key={meja.id} meja={meja} />)}
               </div>
               
               {/* Kanan Bawah (7-10) */}
               <div className="grid grid-cols-2 gap-6 mt-20">
                 {mejaBottomRight.map(meja => <RenderCard key={meja.id} meja={meja} />)}
               </div>
            </div>
          </div>

          {/* Label "Pintu Masuk" di bawah area kiri */}
          <div className="absolute bottom-0 left-[25%] transform -translate-x-1/2 translate-y-1/2 bg-white px-8 py-1.5 border-[3px] border-[#8b0000] rounded-lg shadow-sm z-20">
            <span className="text-[#8b0000] font-black text-sm">Pintu Masuk</span>
          </div>

        </div>
      </div>
    </div>
  );
}