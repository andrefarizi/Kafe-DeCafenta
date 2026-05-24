"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/customer/components/sidebar";
import Topbar from "@/app/customer/components/topbar";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getCustomerOrders } from "@/src/controllers/order-controller";

type Order = {
  id: string;
  orderCode: string;
  status: string;
  totalPrice: number;
  isPaid: boolean;
  orderType: string;
  itemCount: number;
  orderedAt: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  masuk:        { label: "Masuk",        color: "#D8A700" },
  dimasak:      { label: "Dimasak",      color: "#9B0000" },
  siap_diambil: { label: "Siap Diambil", color: "#0077D9" },
  selesai:      { label: "Selesai",      color: "#00C800" },
  dibatalkan:   { label: "Dibatalkan",   color: "#6B7280" },
};

export default function PesananPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Filter dan Search
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  // --- STATE UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tampilkan 5 data per halaman

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getCustomerOrders();
      setOrders(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  // Kembalikan ke halaman 1 setiap kali pelanggan mengganti Tab atau mencari nama
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // --- LOGIKA FILTERING (Gabungan Filter Tab dan Search) ---
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = filter === "semua" || o.status === filter;
      const matchSearch = search === "" || o.orderCode.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [orders, filter, search]);

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
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,"0")} : ${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const formatPrice = (p: number) => "Rp " + p.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-white flex font-sans text-gray-900">
      <Sidebar activeMenu="pesanan" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full pb-24 md:pb-8">
          
          <h1 className="text-3xl font-extrabold mb-6 text-black">
            Pesanan Saya
          </h1>

          <div className="flex items-center w-full border-2 border-[#FFC700] rounded-full overflow-hidden mb-8">
            <div className="bg-[#FFC700] w-12 h-12 rounded-full flex justify-center items-center shrink-0">
              <Search className="text-white w-6 h-6" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Contoh : #DFC001"
              className="flex-1 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 font-medium bg-transparent"
            />
          </div>

          <div className="flex overflow-x-auto gap-4 mb-8 pb-2 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { key: "semua",       label: "Semua",       img: "/group 135.png" },
              { key: "masuk",       label: "Masuk",       img: "/Food Icon Illustrations Kit (1).png" },
              { key: "dimasak",     label: "Dimasak",     img: "/Food Icon Illustrations Kit (2).png" },
              { key: "siap_diambil",label: "Siap Diambil",img: "/Food Icon Illustrations Kit (3).png" },
              { key: "selesai",     label: "Selesai",     img: "/Food Icon Illustrations Kit (4).png" },
            ].map((tab) => {
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex-shrink-0 whitespace-nowrap flex items-center space-x-2 px-6 py-2.5 rounded-full border-2 text-sm font-extrabold transition-colors shadow-sm ${
                    isActive 
                      ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white' 
                      : 'bg-white border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50'
                  }`}
                >
                  <img 
                    src={tab.img} 
                    alt={tab.label} 
                    className={`w-5 h-5 object-contain ${isActive ? 'invert brightness-0' : ''}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full mb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-[#8B1A1A]">
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin w-10 h-10" />
                        </div>
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center font-bold text-gray-500">
                        {search 
                          ? `Tidak ditemukan pesanan dengan pencarian "${search}"` 
                          : `Belum ada pesanan ${filter === 'semua' ? 'apapun' : `dengan status ${statusConfig[filter]?.label || filter}`}.`
                        }
                      </td>
                    </tr>
                  ) : (
                    // PERHATIKAN: Sekarang kita loop menggunakan paginatedOrders
                    paginatedOrders.map((order) => {
                      const cfg = statusConfig[order.status] || { label: order.status, color: "#333" };
                      return (
                        <tr key={order.id} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-5 px-4 flex items-center space-x-4">
                            <div className="relative text-[#8B1A1A]">
                              <img src="/material-symbols_order-approve-outline-rounded.png" alt="icon" className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <p className="font-extrabold text-black text-[15px]">#{order.orderCode}</p>
                              <p className="text-[#8B1A1A] font-bold text-xs mt-0.5">{order.orderType}</p>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center font-medium text-black text-sm">
                            {order.itemCount} Menu
                          </td>
                          <td className="py-5 px-4 text-center font-medium text-black text-sm">
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-center justify-center w-full mr-4">
                                <span className="text-xs font-extrabold mb-1" style={{ color: cfg.color }}>
                                  {cfg.label}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                  {formatDate(order.orderedAt)}
                                </span>
                              </div>
                              <button
                                onClick={() => router.push(`/customer/detail_pesanan/cash?orderId=${order.id}`)}
                                className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-3 rounded-md transition-colors whitespace-nowrap leading-tight text-center shadow-sm"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Info Teks Menampilkan X dari Y Data */}
            {!isLoading && filteredOrders.length > 0 && (
              <div className="text-right text-xs text-gray-500 mt-4 font-medium">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} dari total {filteredOrders.length} pesanan
              </div>
            )}
          </div>

          {/* Pagination Section Dinamis */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pb-8 mt-6">
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

        </main>
      </div>
    </div>
  );
}