'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Star, ChevronRight, Loader2 } from 'lucide-react';
import { getMenuWithReviews } from '@/src/controllers/menu-controller';

// --- Types ---
type ReviewData = {
  id: string;
  name: string;
  date: string;
  text: string;
  rating: number;
  img: string;
};

export default function UlasanOwner() {
  const router = useRouter();
  
  const params = useParams();
  const menuId = params?.id as string;

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [menuInfo, setMenuInfo] = useState({ name: 'Memuat...', avgRating: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // <--- SUDAH DIUBAH MENJADI 5 ULASAN PER HALAMAN

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(reviews.length / itemsPerPage) || 1;
  const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

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

  // --- FUNGSI FORMAT TANGGAL & ANGKA ---
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      const short = Math.round(count / 100) / 10;
      return `${short.toString().replace('.', ',')}rb ulasan`;
    }
    return `${count} ulasan`;
  };

  // --- FETCHING DATA DATABASE ---
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      if (menuId) {
        const data = await getMenuWithReviews(menuId);
        if (data && !('error' in data)) {
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

    fetchReviews();
  }, [menuId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#8B1A1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-3xl font-extrabold text-black">Ulasan {menuInfo.name !== 'Memuat...' ? `- ${menuInfo.name}` : ''}</h1>
      </div>

      {/* Rating Summary Badge */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#8B1A1A] flex items-center space-x-1.5 px-3 py-1.5 rounded-lg shadow-sm">
          <Star size={16} fill="#FFC700" className="text-[#FFC700]" />
          <span className="text-white text-sm font-extrabold">{menuInfo.avgRating.toFixed(1)}</span>
        </div>
        <h2 className="text-lg font-extrabold text-black">Ulasan ({formatReviewCount(reviews.length)})</h2>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 font-bold">Belum ada ulasan untuk menu ini.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 mb-8">
          {currentReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-[#f3cccc] border border-[#e9c3c0] rounded-2xl p-4 md:p-5 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <img 
                src={review.img} 
                alt={review.name} 
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-sm border-2 border-white bg-gray-200"
              />
              
              {/* Content Container */}
              <div className="w-full sm:flex-1 flex flex-col justify-center">
                
                {/* Name, Date, and Stars Row */}
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-black">{review.name}</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 mb-1.5">{formatDate(review.date)}</p>
                  </div>
                  
                  {/* Dynamic Stars Rating */}
                  <div className="flex space-x-0.5 md:space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < review.rating ? "#FFC700" : "transparent"} 
                        className={i < review.rating ? "text-[#FFC700]" : "text-gray-400"} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Comment Text */}
                <p className="text-[11px] md:text-xs text-black font-medium leading-relaxed">
                  {review.text}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Teks Menampilkan X dari Y Data */}
      {!isLoading && reviews.length > 0 && (
        <div className="text-right text-xs text-gray-500 mt-4 mb-6 font-medium">
          Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, reviews.length)} dari total {reviews.length} ulasan
        </div>
      )}

      {/* Pagination Section Dinamis */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pb-8">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button 
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="px-6 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Awal
          </button>
          
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm shadow-sm transition-colors ${
                currentPage === pageNum 
                  ? 'bg-[#8B1A1A] text-white border-transparent' 
                  : 'bg-white border border-gray-200 text-[#8B1A1A] hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {currentPage < totalPages - 2 && totalPages > 3 && (
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm cursor-default">
              ...
            </button>
          )}
          
          <button 
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="px-6 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Akhir
          </button>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}