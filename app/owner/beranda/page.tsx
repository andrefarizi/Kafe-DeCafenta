import React from 'react';
import { Home, ChevronRight, ChevronDown } from 'lucide-react';

// --- Types ---
interface MenuData {
  name: string;
  porsi: number;
  width: string;
}

interface MejaData {
  name: string;
  id: string;
  status: 'Tersedia' | 'Dipakai';
}

// --- Dummy Data ---
const menuTerfavorit: MenuData[] = [
  { name: 'Menu 1', porsi: 195, width: '90%' },
  { name: 'Menu 1', porsi: 150, width: '75%' },
  { name: 'Menu 1', porsi: 150, width: '70%' },
  { name: 'Menu 1', porsi: 150, width: '65%' },
  { name: 'Menu 1', porsi: 150, width: '60%' },
  { name: 'Menu 1', porsi: 150, width: '55%' },
  { name: 'Menu 1', porsi: 150, width: '50%' },
  { name: 'Menu 1', porsi: 150, width: '40%' },
  { name: 'Menu 1', porsi: 150, width: '30%' },
];

const ketersediaanMeja: MejaData[] = [
  { name: 'Meja 1', id: '#MJ01', status: 'Tersedia' },
  { name: 'Meja 2', id: '#MJ02', status: 'Dipakai' },
  { name: 'Meja 3', id: '#MJ03', status: 'Tersedia' },
  { name: 'Meja 4', id: '#MJ04', status: 'Tersedia' },
  { name: 'Meja 5', id: '#MJ05', status: 'Dipakai' },
  { name: 'Meja 6', id: '#MJ06', status: 'Tersedia' },
];

export default function DashboardOwner() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-red-700 font-medium mb-8">
        <div className="p-1 border border-red-700 rounded-md bg-red-50">
          <Home size={16} />
        </div>
        <span className="text-sm">Dashboard Owner</span>
      </div>

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold mb-6">
          Mari Kelola <span className="text-[#FFC700]">Da Cafenta</span> dengan Lebih Mudah
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Card Pendapatan */}
          <div className="bg-[#FFF5F5] rounded-2xl border border-red-200 p-6 relative overflow-hidden flex flex-col justify-between h-40">
            <div>
              <h2 className="text-lg font-bold">Total Pendapatan</h2>
              <p className="text-xs text-red-400 mt-1">Maret 2026</p>
            </div>
            <p className="text-3xl font-extrabold text-[#8B1A1A] mt-2">Rp 150.000.000</p>
            <button className="absolute bottom-4 right-4 flex items-center text-xs text-red-700 font-medium group">
              Selengkapnya <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card Pesanan */}
          <div className="bg-[#FFF5F5] rounded-2xl border border-red-200 p-6 relative overflow-hidden flex flex-col justify-between h-40">
            <div>
              <h2 className="text-lg font-bold">Total Pesanan</h2>
              <p className="text-xs text-red-400 mt-1">Maret 2026</p>
            </div>
            <p className="text-3xl font-extrabold text-[#8B1A1A] mt-2">2820 Pesanan</p>
            <button className="absolute bottom-4 right-4 flex items-center text-xs text-red-700 font-medium group">
              Selengkapnya <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Terfavorit Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Menu Terfavorit</h2>
        
        <div className="bg-[#FCF9F9] border border-red-200 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Diagram menu paling banyak dipesan</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600">
              <span>Filter bulan : <span className="font-semibold text-black">Maret</span></span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Chart Wrapper */}
          <div className="relative pl-4 border-l-4 border-black py-2">
            <div className="flex flex-col space-y-4">
              {menuTerfavorit.map((menu, index) => (
                <div key={index} className="flex items-center w-full">
                  <span className="w-20 text-sm font-medium">{menu.name}</span>
                  <div className="flex-1 flex items-center">
                    <div 
                      className="bg-[#FFC700] h-8 rounded-r-md flex items-center justify-end px-4"
                      style={{ width: menu.width }}
                    >
                      <span className="text-white font-bold text-sm">{menu.porsi} Porsi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12">
            <p className="text-red-700 font-bold text-sm mb-2">Keterangan :</p>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-5 h-5 bg-[#FFC700] border border-black rounded-sm"></div>
              <span>Jumlah Porsi Menu paling banyak dipesan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ketersediaan Meja Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Ketersediaan Meja</h2>
        
        <div className="bg-[#FCF9F9] border border-red-200 rounded-3xl p-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ketersediaanMeja.map((meja, index) => (
              <div key={index} className="bg-white border border-red-200 rounded-xl p-4 flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{meja.name}</h3>
                  <span className="text-red-700 font-semibold text-sm">{meja.id}</span>
                </div>
                <div className="flex justify-end items-end flex-col mt-auto">
                  <span className="text-[10px] text-gray-500 mb-1">Status</span>
                  <span 
                    className={`px-4 py-1 rounded-full text-xs font-bold text-white ${
                      meja.status === 'Tersedia' ? 'bg-[#22C55E]' : 'bg-[#E53E3E]'
                    }`}
                  >
                    {meja.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Link for Table */}
          <div className="flex justify-end">
            <button className="flex items-center text-xs text-red-700 font-medium group hover:underline">
              Selengkapnya 
              <div className="ml-2 border border-red-700 rounded-full p-[2px]">
                 <ChevronRight size={12} />
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
