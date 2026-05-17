'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { OrderSummaryData } from '@/src/controllers/kasir-order-controller';

type StatusPesanan = 'Masuk' | 'Dimasak' | 'Siap Diambil' | 'Selesai';
type TabId = 'Semua' | StatusPesanan;

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'Semua', label: 'Semua', icon: '/Group 135.png' },
  { id: 'Masuk', label: 'Masuk', icon: '/Food Icon Illustrations Kit (1).png' },
  { id: 'Dimasak', label: 'Dimasak', icon: '/Food Icon Illustrations Kit (2).png' },
  { id: 'Siap Diambil', label: 'Siap Diambil', icon: '/Food Icon Illustrations Kit (3).png' },
  { id: 'Selesai', label: 'Selesai', icon: '/Food Icon Illustrations Kit (4).png' },
];

export default function PesananMasukClient({
  initialOrders,
  activeTab: initialActiveTab = 'Semua',
}: {
  initialOrders: OrderSummaryData[];
  activeTab?: TabId;
}) {
  const [activeTab, setActiveTab] = useState<TabId>(initialActiveTab);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- STATE UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Batas pesanan per halaman

  // Kembalikan ke halaman 1 setiap kali kasir mengganti Tab atau mencari nama
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // --- LOGIKA FILTERING ---
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchTab = activeTab === 'Semua' || order.status === activeTab;
      const matchSearch = searchTerm === '' || 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.nama.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchTab && matchSearch;
    });
  }, [initialOrders, activeTab, searchTerm]);

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  // Ambil hanya 5 data untuk halaman yang sedang aktif
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Fungsi navigasi halaman
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  // Buat deretan angka halaman (maksimal 3 angka berurutan agar rapi)
  const getPageNumbers = () => {
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Fungsi pembantu warna
  const getStatusColor = (status: StatusPesanan) => {
    switch (status) {
      case 'Masuk': return 'text-[#FFC700]';
      case 'Dimasak': return 'text-[#8B1A1A]';
      case 'Siap Diambil': return 'text-[#3B82F6]';
      case 'Selesai': return 'text-[#22C55E]';
      default: return 'text-gray-900';
    }
  };

  const getDetailHref = (status: StatusPesanan, dbId: string) => {
    return `/kasir/daftar-pesanan/detail/${dbId}`;
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-6xl mx-auto">
      
      <h1 className="text-3xl font-extrabold mb-6 text-black">
        {activeTab === 'Semua' ? 'Semua Pesanan' : `Pesanan ${activeTab}`}
      </h1>

      {/* Search Bar */}
      <div className="flex items-center w-full border-2 border-[#FFC700] rounded-full overflow-hidden mb-8">
        <div className="bg-[#FFC700] w-12 h-12 rounded-full flex justify-center items-center ">
          <Search className="text-white w-6 h-6" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari Kode (Contoh: #DCF001) atau Nama..."
          className="flex-1 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 font-medium"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id; 
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            </button>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="w-full mb-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-[#e9b7b7fb] text-left">
                <th className="py-4 px-4 rounded-l-lg font-bold text-black w-1/3 text-sm">Nama Pelanggan</th>
                <th className="py-4 px-4 font-bold text-black text-center w-1/5 text-sm">Jumlah Pesanan</th>
                <th className="py-4 px-4 font-bold text-black text-center w-1/5 text-sm">Harga</th>
                <th className="py-4 px-4 rounded-r-lg font-bold text-black text-center w-auto text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center font-bold text-gray-500">
                    {searchTerm 
                      ? `Tidak ditemukan pesanan dengan pencarian "${searchTerm}"` 
                      : `Belum ada pesanan dengan status ${activeTab}.`
                    }
                  </td>
                </tr>
              ) : (
                // PERHATIKAN: Sekarang kita menggunakan paginatedOrders, bukan filteredOrders
                paginatedOrders.map((order) => (
                  <tr key={order.dbId} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-4 flex items-center space-x-4">
                      <div className="relative text-[#8B1A1A]">
                        <img src="/material-symbols_order-approve-outline-rounded.png" alt="icon" className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <p className="font-extrabold text-black text-[15px]">{order.nama}</p>
                        <p className="text-[#8B1A1A] font-bold text-xs mt-0.5">{order.orderCode}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center font-medium text-black text-sm">
                      {order.jumlah}
                    </td>
                    <td className="py-5 px-4 text-center font-medium text-black text-sm">
                      {order.harga}
                    </td>
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
                        <Link
                          href={getDetailHref(order.status, order.dbId)}
                          className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-3 rounded-md transition-colors whitespace-nowrap leading-tight text-center"
                        >
                          Perbarui<br/>Status
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Info Total Data */}
        {filteredOrders.length > 0 && (
          <div className="text-right text-xs text-gray-500 mt-3 font-medium">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} dari total {filteredOrders.length} pesanan
          </div>
        )}
      </div>

      {/* Pagination Section Berfungsi */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pb-8">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button 
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Awal
          </button>

          {/* Render Angka Halaman Dinamis */}
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm shadow-sm transition-colors ${
                currentPage === pageNum 
                  ? 'bg-[#8B1A1A] text-white' 
                  : 'bg-gray-200 border border-gray-200 text-[#8B1A1A] hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Tampilkan elipsis "..." jika halaman total masih jauh dari halaman yg tampil */}
          {currentPage < totalPages - 2 && totalPages > 3 && (
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm cursor-default">
              ...
            </button>
          )}
          
          <button 
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Akhir
          </button>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}