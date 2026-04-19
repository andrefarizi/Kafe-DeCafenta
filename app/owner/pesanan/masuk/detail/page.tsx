import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBasket, 
  Store, 
  CookingPot, 
  PackageCheck, 
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- Types ---
type StatusPesanan = 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai';

interface OrderData {
  id: string;
  nama: string;
  jumlah: string;
  harga: string;
  status: StatusPesanan;
  tanggal: string;
  waktu: string;
}

// --- Dummy Data (Difilter khusus status "Selesai" sesuai mockup) ---
const orderList: OrderData[] = [
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Selesai', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Selesai', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Selesai', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Selesai', tanggal: '8 Apr 2026', waktu: '10 : 30' },
];

const tabs = [
  { label: 'Semua', icon: ShoppingBasket },
  { label: 'Masuk', icon: Store },
  { label: 'Dimasak', icon: CookingPot },
  { label: 'Siap Diambil', icon: PackageCheck },
  { label: 'Selesai', icon: CheckCircle2 },
];

export default function PesananSelesaiFiltered() {
  // Set default state ke "Selesai" agar sesuai dengan gambar
  const [activeTab, setActiveTab] = useState('Selesai');

  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case 'Masuk': return 'text-[#FFC700]';
      case 'Dimasak': return 'text-[#8B1A1A]'; 
      case 'Siap Diambil': return 'text-[#2563EB]';
      case 'Selesai': return 'text-[#22C55E]'; // Hijau sesuai mockup
      default: return 'text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-6xl mx-auto">
      
      <h1 className="text-3xl font-extrabold mb-6 text-black">Pesanan Masuk</h1>

      {/* Search Bar */}
      <div className="flex items-center w-full border-2 border-[#FFC700] rounded-full overflow-hidden mb-8">
        <div className="bg-[#FFC700] p-3 md:p-4 flex justify-center items-center">
          <Search className="text-white w-6 h-6" />
        </div>
        <input
          type="text"
          placeholder="Contoh : #DCF001"
          className="flex-1 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 font-medium"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full border-2 text-sm font-extrabold transition-colors shadow-sm ${
                isActive 
                  ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white' 
                  : 'bg-white border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50'
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-[#8B1A1A]"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="w-full mb-12">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-[#FADCD9] text-left">
                <th className="py-4 px-4 rounded-l-lg font-bold text-black w-1/3 text-sm">Nama Pelanggan</th>
                <th className="py-4 px-4 font-bold text-black text-center w-1/5 text-sm">Jumlah Pesanan</th>
                <th className="py-4 px-4 font-bold text-black text-center w-1/5 text-sm">Harga</th>
                <th className="py-4 px-4 rounded-r-lg font-bold text-black text-center w-auto text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order, index) => (
                <tr key={index} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Kolom Nama */}
                  <td className="py-5 px-4 flex items-center space-x-4">
                    <div className="relative text-[#8B1A1A]">
                      <FileText size={32} strokeWidth={2} />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                        <CheckCircle2 size={16} className="text-[#8B1A1A] fill-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-extrabold text-black text-[15px]">{order.nama}</p>
                      <p className="text-[#8B1A1A] font-bold text-xs mt-0.5">{order.id}</p>
                    </div>
                  </td>
                  
                  {/* Kolom Jumlah */}
                  <td className="py-5 px-4 text-center font-medium text-black text-sm">
                    {order.jumlah}
                  </td>
                  
                  {/* Kolom Harga */}
                  <td className="py-5 px-4 text-center font-medium text-black text-sm">
                    {order.harga}
                  </td>
                  
                  {/* Kolom Status & Aksi */}
                  <td className="py-5 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center justify-center w-full mr-4">
                        <span className={`text-xs font-extrabold mb-1 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                          {order.tanggal}, {order.waktu}
                        </span>
                      </div>
                      <button className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-3 rounded-md transition-colors whitespace-nowrap leading-tight text-center">
                        Perbarui<br/>Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center space-x-2 pb-8">
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} />
        </button>
        
        <button className="px-6 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors">
          Awal
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#8B1A1A] text-white font-bold text-sm shadow-sm">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
          3
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
          ...
        </button>
        
        <button className="px-6 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors">
          Akhir
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}