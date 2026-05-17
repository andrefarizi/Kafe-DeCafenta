'use client';

import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import React, { useState, useEffect } from 'react'; 
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getMenuWithReviews } from '@/src/controllers/menu-controller';

// Type data untuk ulasan
type ReviewData = {
  id: string;
  name: string;
  date: string;
  text: string;
  rating: number;
  img: string;
};

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [menuInfo, setMenuInfo] = useState({ name: 'Memuat...', avgRating: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Menampilkan 6 ulasan per halaman

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(reviews.length / itemsPerPage) || 1;
  
  // Ambil hanya 6 data untuk halaman yang sedang aktif
  const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // Fungsi memformat tanggal ke format lokal Indonesia
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Mengambil data dari database
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const data = await getMenuWithReviews(menuId);
      
      if (data) {
        if ('error' in data) {
          alert(`EROR DATABASE: ${data.error}`);
        } else {
          setMenuInfo({
            name: data.menuName,
            avgRating: data.avgRating,
            total: data.reviewCount
          });
          setReviews(data.reviews);
        }
      }
      setIsLoading(false);
    };

    if (menuId) fetchReviews();
  }, [menuId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar activeMenu="menu" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-[#8B0000]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu='menu' />

      <div className="flex-1 flex flex-col min-h-screen relative">
        
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <main className="p-6 lg:p-10 flex-1">
          <div className="max-w-4xl mx-auto">

            <div className="flex items-center gap-4 mb-5">
              <button 
                onClick={() => router.back()}
                className="p-1.5 bg-white rounded-md border border-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={20} strokeWidth={3} className="text-[#8B0000]" />
              </button>
              <h1 className="text-2xl font-bold text-black tracking-tight">Ulasan {menuInfo.name}</h1>
            </div>

            {/* Rating Pill */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#8B0000] text-white px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold shadow-sm">
                <span className="text-yellow-400 text-lg">★</span> 
                <span className="text-base">{menuInfo.avgRating.toFixed(1)}</span>
              </div>
              <span className="text-lg font-bold text-black">Ulasan ({reviews.length} ulasan)</span>
            </div>

            {/* Review List */}
            {reviews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                <p className="text-gray-500 font-bold">Belum ada ulasan untuk menu ini.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {currentReviews.map((review) => (
                  <div key={review.id} className="bg-[#FFF0F0] border border-pink-50 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white bg-gray-200">
                        <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h3 className="font-bold text-black text-[15px]">{review.name}</h3>
                          <p className="text-[10px] text-gray-500">{formatDate(review.date)}</p>
                        </div>
                        <div className="flex text-yellow-400 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                            ))}
                        </div>
                      </div>
                      <p className="text-sm text-black font-medium leading-snug">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Teks Menampilkan X dari Y Data */}
            {reviews.length > 0 && (
              <div className="text-right text-xs text-gray-500 mt-4 font-medium">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, reviews.length)} dari total {reviews.length} ulasan
              </div>
            )}

            {/* Pagination Section Dinamis */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pb-8 mt-6">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B0000] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <button 
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B0000] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Awal
                </button>

                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm shadow-sm transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-[#8B0000] text-white' 
                        : 'bg-gray-200 border border-gray-200 text-[#8B0000] hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {currentPage < totalPages - 2 && totalPages > 3 && (
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B0000] font-bold text-sm cursor-default">
                    ...
                  </button>
                )}
                
                <button 
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-1.5 bg-gray-200 border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B0000] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Akhir
                </button>
                
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 border border-gray-200 shadow-sm text-[#8B0000] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}