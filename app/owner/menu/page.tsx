import React from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronDown, Star } from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: number;
  name: string;
  price: string;
  rating: string;
  image: string;
}

// --- Dummy Data ---
// Menggunakan placeholder gambar dari Unsplash yang relevan dengan makanan
const menuList: MenuItem[] = [
  { id: 1, name: 'Nasgor wira', price: 'Rp 15.000', rating: '5.0', image: '/nasi goreng.png' },
  { id: 2, name: 'Nasgor wira', price: 'Rp 15.000', rating: '5.0', image: '/nasi goreng.png' },
  { id: 3, name: 'Nasgor wira', price: 'Rp 15.000', rating: '5.0', image: '/nasi goreng.png' },
  { id: 4, name: 'Nasgor wira', price: 'Rp 15.000', rating: '5.0', image: '/nasi goreng.png' },
  { id: 5, name: 'Kentang Goreng', price: 'Rp 12.000', rating: '5.0', image: '/kentang goreng.png' },
  { id: 6, name: 'Kentang Goreng', price: 'Rp 12.000', rating: '5.0', image: '/kentang goreng.png' },
  { id: 7, name: 'Kentang Goreng', price: 'Rp 12.000', rating: '5.0', image: '/kentang goreng.png' },
  { id: 8, name: 'Kentang Goreng', price: 'Rp 12.000', rating: '5.0', image: '/kentang goreng.png' },
  { id: 9, name: 'Semangka Enjely', price: 'Rp 7.000', rating: '5.0', image: '/jus semangka.png' },
  { id: 10, name: 'Semangka Enjely', price: 'Rp 7.000', rating: '5.0', image: '/jus semangka.png' },
  { id: 11, name: 'Semangka Enjely', price: 'Rp 7.000', rating: '5.0', image: '/jus semangka.png' },
  { id: 12, name: 'Semangka Enjely', price: 'Rp 7.000', rating: '5.0', image: '/jus semangka.png' },
  { id: 13, name: 'Mie Bakso Zhrn', price: 'Rp 20.000', rating: '5.0', image: '/bakso.png' },
  { id: 14, name: 'Mie Bakso Zhrn', price: 'Rp 20.000', rating: '5.0', image: '/bakso.png' },
  { id: 15, name: 'Mie Bakso Zhrn', price: 'Rp 20.000', rating: '5.0', image: '/bakso.png' },
  { id: 16, name: 'Mie Bakso Zhrn', price: 'Rp 20.000', rating: '5.0', image: '/bakso.png' },
];

export default function ManajemenMenu() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-black">Manajemen Menu</h1>
        <Link href="/owner/menu/tambah" className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
          <Plus size={16} strokeWidth={3} />
          <span>Tambah Menu</span>
        </Link>
      </div>

      {/* Sub-Header & Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-[#8B1A1A] mb-4">Daftar Menu</h2>
        
        {/* Search Bar */}
        <div className="flex items-center w-full border-[2.5px] border-[#FFC700] rounded-full mb-4 shadow-sm bg-white">
          <div className="bg-[#FFC700] w-12 h-12 md:w-12 md:h-12 rounded-full flex justify-center items-center ">
            <Search className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <input
            type="text"
            placeholder="Contoh : Nasi Goreng"
            className="flex-1 px-4 py-2 text-sm focus:outline-none placeholder-gray-500 font-medium bg-transparent"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex">
          <button className="flex items-center justify-between w-auto min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <span>Kategori berdasarkan : <span className="font-extrabold text-black">Semua Menu</span></span>
            <ChevronDown size={14} className="ml-2 text-black" />
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      {/* Menggunakan grid-cols-2 untuk HP, 3 untuk tablet, 4 untuk Desktop/Laptop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
        {menuList.map((item, index) => (
          <div key={`${item.id}-${index}`} className="bg-[#FAFAFA] border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            
            {/* Image Container */}
            <div className="relative h-36 md:h-44 w-full bg-gray-200">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                <Star size={10} className="text-[#FFC700] fill-[#FFC700]" />
                <span className="text-white text-[10px] font-bold">{item.rating}</span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-1">
              <div>
                <h3 className="font-extrabold text-sm text-black line-clamp-1">{item.name}</h3>
                <p className="text-[10px] text-gray-600 font-medium mt-1">{item.price}</p>
              </div>
              
              <div className="mt-auto pt-4">
                <Link href="/owner/menu/edit" className="block w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm text-center">
                  Detail
                </Link>
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}