import React from 'react';
import { MinusCircle, Plus } from 'lucide-react';

// --- Types ---
interface MejaItem {
  id: number;
  kode: string;
}

// --- Dummy Data ---
// Mengikuti data yang ada di mockup gambar
const diletakkan: MejaItem[] = [
  { id: 1, kode: '#MJ01' }, { id: 2, kode: '#MJ02' },
  { id: 3, kode: '#MJ03' }, { id: 4, kode: '#MJ04' },
  { id: 5, kode: '#MJ05' }, { id: 6, kode: '#MJ06' }, // Mockup tertulis Meja 6 #MJ04 (typo di mockup, tapi saya ikuti visual)
  { id: 11, kode: '#MJ011' }, { id: 12, kode: '#MJ012' },
  { id: 7, kode: '#MJ07' }, { id: 8, kode: '#MJ08' },
  { id: 9, kode: '#MJ09' }, { id: 10, kode: '#MJ010' },
];

const belumDigunakan: MejaItem[] = [
  { id: 13, kode: '#MJ01' },
  { id: 14, kode: '#MJ02' },
  { id: 15, kode: '#MJ03' },
];

export default function TataLetakMeja() {
  
  // Komponen Helper untuk Kartu Meja di dalam Denah
  const MejaCanvasCard = ({ meja }: { meja: MejaItem }) => (
    <div className="border border-[#8B1A1A] rounded-xl p-3 flex flex-col justify-between h-28 bg-white shadow-sm hover:shadow-md transition-shadow cursor-move">
      <div>
        <p className="font-extrabold text-sm text-black">Meja {meja.id}</p>
        <p className="text-[10px] text-[#8B1A1A] font-bold mt-0.5">{meja.kode === '#MJ06' && meja.id === 6 ? '#MJ04' : meja.kode}</p> 
      </div>
      
      <div className="flex justify-end mt-auto">
        <button className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[9px] font-bold py-1.5 px-3 rounded-md transition-colors">
          <MinusCircle size={10} strokeWidth={2.5} />
          <span>Keluarkan Meja</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#8B1A1A] mb-1">Tata Letak Meja</h1>
        <p className="text-xs font-bold text-black">Geser meja yang diinginkan untuk mengatur posisi meja</p>
      </div>

      {/* --- SECTION 1: CANVAS DENAH MEJA --- */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-[800px] h-[650px] relative border-[3px] border-[#8B1A1A] rounded-2xl bg-white mt-2 shadow-sm">
          
          {/* Label Pintu Masuk */}
          <div className="absolute -bottom-[15px] left-[20%] transform -translate-x-1/2 bg-white px-8 py-1.5 border-[3px] border-[#8B1A1A] rounded-lg text-[#8B1A1A] font-extrabold text-xs z-10">
            Pintu Masuk
          </div>

          {/* --- WALLS / SEKAT RUANGAN --- */}
          {/* Garis Vertikal */}
          <div className="absolute top-0 bottom-[30%] left-[48%] w-[4px] bg-[#8B1A1A] z-0"></div>
          {/* Garis Horizontal */}
          <div className="absolute top-[32%] left-[58%] right-0 h-[4px] bg-[#8B1A1A] z-0"></div>

          {/* --- TABLE PLACEMENT GROUPS --- */}
          
          {/* Group Kiri (Meja 1-6) */}
          <div className="absolute top-12 left-[5%] w-[40%] grid grid-cols-2 gap-x-6 gap-y-12">
            {diletakkan.filter(m => m.id >= 1 && m.id <= 6).map(meja => (
              <MejaCanvasCard key={meja.id} meja={meja} />
            ))}
          </div>

          {/* Group Kanan Atas (Meja 11-12) */}
          <div className="absolute top-12 right-[5%] w-[38%] grid grid-cols-2 gap-x-6">
            {diletakkan.filter(m => m.id >= 11 && m.id <= 12).map(meja => (
              <MejaCanvasCard key={meja.id} meja={meja} />
            ))}
          </div>

          {/* Group Kanan Bawah (Meja 7-10) */}
          <div className="absolute top-[42%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {diletakkan.filter(m => m.id >= 7 && m.id <= 10).map(meja => (
              <MejaCanvasCard key={meja.id} meja={meja} />
            ))}
          </div>

        </div>
      </div>

      {/* --- SECTION 2: DAFTAR MEJA BELUM DIGUNAKAN --- */}
      <div className="border-[3px] border-[#8B1A1A] rounded-2xl p-6 bg-[#FAFAFA] mb-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-black mb-6">Daftar Meja Belum Digunakan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {belumDigunakan.map((meja) => (
            <div key={`unused-${meja.id}`} className="border border-[#8B1A1A] rounded-xl p-4 flex flex-col justify-between h-28 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-base text-black">Meja {meja.id}</p>
                <p className="text-[10px] text-[#8B1A1A] font-bold">{meja.kode}</p>
              </div>
              
              <div className="flex justify-end mt-auto">
                <button className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-md transition-colors">
                  <Plus size={12} strokeWidth={3} />
                  <span>Tambahkan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: ACTION BUTTONS --- */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-gray-300 pt-6">
        <button className="w-full sm:w-48 bg-white border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3 rounded-lg transition-colors shadow-sm">
          Batalkan
        </button>
        <button className="w-full sm:w-48 bg-[#8B1A1A] border border-[#8B1A1A] text-white hover:bg-red-900 font-extrabold text-sm py-3 rounded-lg transition-colors shadow-sm">
          Simpan
        </button>
      </div>

    </div>
  );
}