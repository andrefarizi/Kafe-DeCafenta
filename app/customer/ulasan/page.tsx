'use client';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import React, { useState } from 'react'; 
import { 
  ChevronLeft, 
  ChevronRight,
  Star
} from 'lucide-react';

const ReviewPage = () => {
  const reviews = [
    { id: 1, name: 'Gojo Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 2, img: 'https://i.pinimg.com/736x/54/c2/bc/54c2bcc1bcde783510c439b8aebf8b38.jpg' },
    { id: 2, name: 'Gojo Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 5, img: 'https://i.pinimg.com/736x/54/c2/bc/54c2bcc1bcde783510c439b8aebf8b38.jpg' },
    { id: 3, name: 'Gojo Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 4, img: 'https://i.pinimg.com/736x/54/c2/bc/54c2bcc1bcde783510c439b8aebf8b38.jpg' },
    { id: 4, name: 'Flins Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 3, img: 'https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg' },
    { id: 5, name: 'Flins Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 3, img: 'https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg' },
    { id: 6, name: 'Flins Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 3, img: 'https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg' },
    { id: 7, name: 'Flins Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 3, img: 'https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg' },
    { id: 8, name: 'Flins Sitorus', date: '31 Februari 2026', text: 'kentang goreng nya enak banget, kentangnya kentang banget!!', rating: 3, img: 'https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    if (currentPage < 3) {
      pages.push(1, 2, 3, '...');
    } else if (currentPage >= totalPages - 1) {
      pages.push('...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push('...', currentPage, '...', totalPages);
    }
    return pages;
  };

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
              <button className="p-1.5 bg-white rounded-md border border-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all">
                <ChevronLeft size={20} strokeWidth={3} className="text-[#8B0000]" />
              </button>
              <h1 className="text-2xl font-bold text-black tracking-tight">Ulasan</h1>
            </div>

            {/* Rating Pill */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#8B0000] text-white px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold shadow-sm">
                <span className="text-yellow-400 text-lg">★</span> 
                <span className="text-base">5.0</span>
              </div>
              <span className="text-lg font-bold text-black">Ulasan ({reviews.length} ulasan)</span>
            </div>

            {/* Review List */}
            <div className="space-y-3 mb-8">
              {currentReviews.map((review) => (
                <div key={review.id} className="bg-[#FFF0F0] border border-pink-50 rounded-2xl p-4 flex gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white">
                      <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="font-bold text-black text-[15px]">{review.name}</h3>
                        <p className="text-[10px] text-gray-500">{review.date}</p>
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

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6 pb-10">
              <PaginationButton 
                  icon={<ChevronLeft size={18} />} 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              />
              <PaginationButton label="Awal" onClick={() => setCurrentPage(1)} />
              
              {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                  {page === '...' ? (
                      <span className="w-8 text-center text-[#8B0000] font-bold">...</span>
                  ) : (
                      <PaginationButton 
                        label={page.toString()} 
                        active={currentPage === page} 
                        onClick={() => setCurrentPage(page as number)}
                      />
                  )}
                  </React.Fragment>
              ))}

              <PaginationButton label="Akhir" onClick={() => setCurrentPage(totalPages)} />
              <PaginationButton 
                  icon={<ChevronRight size={18} />} 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Sub-component */
const PaginationButton = ({ label, icon, active = false, onClick }: { label?: string, icon?: any, active?: boolean, onClick?: () => void }) => {
  const isLargeButton = label === "Awal" || label === "Akhir";
  return (
    <button
      onClick={onClick}
      className={`
      h-10 px-3 flex items-center justify-center rounded-lg border transition-all
      ${isLargeButton ? 'min-w-[120px]' : 'min-w-[40px]'}
      shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.1)]
      active:translate-y-0.5 active:shadow-sm
      ${active ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold' : 'bg-white text-[#8B0000] border-gray-100 font-semibold hover:bg-gray-50'}
    `}>
      {label || icon}
    </button>
  );
};

export default ReviewPage;