'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2
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

// --- Dummy Data (Difilter khusus status "Masuk" sesuai mockup) ---
const orderList: OrderData[] = [
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
  { id: '#DCF001', nama: 'Andre Ganteng', jumlah: '1 Menu', harga: 'Rp 20.000', status: 'Masuk', tanggal: '8 Apr 2026', waktu: '10 : 30' },
];

const tabs = [
  { label: 'Semua', icon: '/Group 135.png', href: '/owner/pesanan/masuk' },
  { label: 'Masuk', icon: '/Food Icon Illustrations Kit (1).png', href: '/owner/pesanan/masuk/1' },
  { label: 'Dimasak', icon: '/Food Icon Illustrations Kit (2).png', href: '/owner/pesanan/dimasak' },
  { label: 'Siap Diambil', icon: '/Food Icon Illustrations Kit (3).png', href: '/owner/pesanan/siap-diambil' },
  { label: 'Selesai', icon: '/Food Icon Illustrations Kit (4).png', href: '/owner/pesanan/selesai' },
];

export default function PesananMasukFiltered() {
  // Set default state ke "Masuk" agar sesuai dengan gambar
  const [activeTab, setActiveTab] = useState('Masuk');

  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case 'Masuk': return 'text-[#FFC700]';
      case 'Dimasak': return 'text-[#8B1A1A]';
      case 'Siap Diambil': return 'text-[#3B82F6]';
      case 'Selesai': return 'text-[#22C55E]';
      default: return 'text-gray-900';
    }
  };

  // Fungsi pembantu untuk URL detail berdasarkan status
  const getDetailHref = (status: StatusPesanan) => {
    switch (status) {
      case 'Masuk':        return '/owner/pesanan/masuk/detail';
      case 'Dimasak':      return '/owner/pesanan/dimasak/detail';
      case 'Siap Diambil': return '/owner/pesanan/siap-diambil/detail';
      case 'Selesai':      return '/owner/pesanan/selesai/detail';
      default:             return '/owner/pesanan/masuk/detail';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-6xl mx-auto">
      
      <h1 className="text-3xl font-extrabold mb-6 text-black">Pesanan Masuk</h1>

      {/* Search Bar */}
            <div className="flex items-center w-full border-2 border-[#FFC700] rounded-full overflow-hidden mb-8">
              <div className="bg-[#FFC700] w-12 h-12 rounded-full flex justify-center items-center ">
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
          const isActive = activeTab === tab.label;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full border-2 text-sm font-extrabold transition-colors shadow-sm ${
                isActive 
                  ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white' 
                  : 'bg-white border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50'
              }`}
            >
              <img 
                src={tab.icon} 
                alt={tab.label} 
                className={`w-5 h-5 object-contain ${isActive ? 'invert brightness-0' : ''}`}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="w-full mb-12">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#e9b7b7fb] text-left">
                <th className="py-3 px-4 rounded-l-lg font-bold text-black w-1/3">Nama Pelanggan</th>
                <th className="py-3 px-4 font-bold text-black text-center w-1/5">Jumlah Pesanan</th>
                <th className="py-3 px-4 font-bold text-black text-center w-1/5">Harga</th>
                <th className="py-3 px-4 rounded-r-lg font-bold text-black text-center w-auto">Status</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {orderList.map((order, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                  {/* Nama Pelanggan Column */}
                  <td className="py-4 px-4 flex items-center space-x-4">
                    <div className="relative text-[#8B1A1A]">
                      <img src="/material-symbols_order-approve-outline-rounded.png" alt="icon" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <p className="font-extrabold text-black text-lg">{order.nama}</p>
                      <p className="text-[#8B1A1A] font-bold text-sm">{order.id}</p>
                    </div>
                  </td>
                  
                  {/* Jumlah Pesanan Column */}
                  <td className="py-4 px-4 text-center font-medium text-black">
                    {order.jumlah}
                  </td>
                  
                  {/* Harga Column */}
                  <td className="py-4 px-4 text-center font-medium text-black">
                    {order.harga}
                  </td>
                  
                  {/* Status Column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center justify-center w-full mr-4">
                        <span className={`text-xs font-extrabold mb-1 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-600 font-medium whitespace-nowrap">
                          {order.tanggal}, {order.waktu}
                        </span>
                      </div>
                      <Link
                        href={getDetailHref(order.status)}
                        className="bg-[#8B1A1A] hover:bg-red-900 text-white text-xs font-bold py-2 px-3 rounded-md transition-colors whitespace-nowrap leading-tight text-center"
                      >
                        Perbarui<br/>Status
                      </Link>
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
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-lg text-[#8B1A1A] hover:bg-gray-50 transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    
                    <button className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors">
                      Awal
                    </button>
                    
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#8B1A1A] text-white font-bold text-sm shadow-sm">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200  border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
                      3
                    </button>
                    
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
                      ...
                    </button>
                    
                    <button className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors">
                      Akhir
                    </button>
                    
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>

    </div>
  );
}