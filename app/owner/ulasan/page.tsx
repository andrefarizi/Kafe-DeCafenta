import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Star, ChevronRight } from 'lucide-react';

// --- Types ---
interface ReviewItem {
  id: number;
  nama: string;
  tanggal: string;
  komentar: string;
  avatar: string;
}

// --- Dummy Data ---
const reviewList: ReviewItem[] = [
  {
    id: 1,
    nama: 'Gojo Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Frame 397.png'
  },
  {
    id: 2,
    nama: 'Gojo Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Frame 397.png'
  },
  {
    id: 3,
    nama: 'Gojo Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Frame 397.png'
  },
  {
    id: 4,
    nama: 'Flins Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Ellipse 9.png'
  },
  {
    id: 5,
    nama: 'Flins Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Ellipse 9.png'
  },
  {
    id: 6,
    nama: 'Flins Sitorus',
    tanggal: '31 Februari 2026',
    komentar: 'kentang goreng nya enak banget, kentangnya kentang banget!!',
    avatar: '/Ellipse 9.png'
  },
];

export default function Ulasan() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex items-center mb-8">
        <Link href="/owner/menu" className="mr-4 p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </Link>
        <h1 className="text-3xl font-extrabold text-black">Ulasan</h1>
      </div>

      {/* Rating Summary Badge */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#8B1A1A] flex items-center space-x-1.5 px-3 py-1.5 rounded-lg shadow-sm">
          <Star size={16} fill="#FFC700" className="text-[#FFC700]" />
          <span className="text-white text-sm font-extrabold">5.0</span>
        </div>
        <h2 className="text-lg font-extrabold text-black">Ulasan (3rb ulasan)</h2>
      </div>

      {/* Review List */}
      <div className="flex flex-col space-y-4 mb-12">
        {reviewList.map((review) => (
          <div 
            key={review.id} 
            className="bg-[#f3cccc] border border-[#e9c3c0] rounded-2xl p-4 md:p-5 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Avatar */}
            <img 
              src={review.avatar} 
              alt={review.nama} 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-sm border-2 border-white"
            />
            
            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center">
              
              {/* Name, Date, and Stars Row */}
              <div className="flex justify-between items-start w-full">
                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-black">{review.nama}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 mb-1.5">{review.tanggal}</p>
                </div>
                
                {/* 5 Stars Rating */}
                <div className="flex space-x-0.5 md:space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFC700" className="text-[#FFC700]" />
                  ))}
                </div>
              </div>
              
              {/* Comment Text */}
              <p className="text-[11px] md:text-xs text-black font-medium leading-relaxed">
                {review.komentar}
              </p>
              
            </div>
          </div>
        ))}
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
        
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-[#8B1A1A] font-bold text-sm hover:bg-gray-50 transition-colors cursor-default">
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