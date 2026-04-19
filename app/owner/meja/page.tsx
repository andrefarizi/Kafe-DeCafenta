import React from 'react';
import { Plus, LayoutGrid, Trash2 } from 'lucide-react';

// --- Types ---
type StatusMeja = 'Tersedia' | 'Dipakai';

interface Meja {
  id: number;
  kode: string;
  status: StatusMeja;
}

// --- Dummy Data ---
// Mengikuti data yang ada di mockup gambar
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

export default function ManajemenMeja() {
  
  // Komponen Helper untuk Kartu Meja di dalam Denah
  const DenahCard = ({ meja }: { meja: Meja }) => (
    <div className="relative border border-[#8B1A1A] rounded-xl p-3 flex flex-col justify-between h-28 bg-white shadow-sm">
      {/* Badge Status */}
      <div 
        className={`absolute -top-2.5 right-2 px-2 py-0.5 rounded text-[8px] font-bold border border-white tracking-wide ${
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
        <button className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm">
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
          <button className="absolute top-4 right-4 flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 shadow-sm">
            <LayoutGrid size={14} />
            <span>Atur Tata Letak</span>
          </button>

          {/* Label Pintu Masuk */}
          <div className="absolute -bottom-[3px] left-[20%] transform translate-y-1/2 bg-white px-6 py-1.5 border-[3px] border-[#8B1A1A] rounded-lg text-[#8B1A1A] font-extrabold text-[11px] z-10">
            Pintu Masuk
          </div>

          {/* --- WALLS / SEKAT RUANGAN --- */}
          {/* Garis Vertikal */}
          <div className="absolute top-0 bottom-[22%] left-[48%] w-[3px] bg-[#8B1A1A] z-0"></div>
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
              
              <div className="flex justify-center mt-auto">
                <button className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-5 rounded-md transition-colors w-fit">
                  <Trash2 size={12} strokeWidth={2.5} />
                  <span>Hapus Meja</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}