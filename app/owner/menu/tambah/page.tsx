import React from 'react';
import { ChevronLeft, Upload, ChevronDown } from 'lucide-react';

export default function TambahMenu() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button className="mr-4 p-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Tambah Menu</h1>
      </div>

      {/* Main Card Container */}
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-10 bg-white shadow-sm mb-12">
        
        <form className="space-y-8">
          
          {/* Area Upload Gambar Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Gambar Menu
            </label>
            <div className="w-full h-64 md:h-72 bg-[#F8F9FA] border border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-[#8B1A1A] rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Upload size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-black mb-2 text-center">
                Tarik Gambar atau Tekan disini
              </h3>
              <p className="text-xs font-medium text-gray-500 text-center">
                Format file yang didukung PNG , JPG , SVG
              </p>
            </div>
          </div>

          {/* Input Nama Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Nama Menu
            </label>
            <input 
              type="text" 
              placeholder="contoh : Ayam Penyet" 
              className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            />
          </div>

          {/* Select Kategori */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Kategori
            </label>
            <div className="relative">
              <select className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black font-extrabold appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all cursor-pointer">
                <option value="nasi">Nasi</option>
                <option value="mie">Mie</option>
                <option value="minuman">Minuman</option>
                <option value="snack">Snack</option>
              </select>
              {/* Custom Dropdown Icon */}
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <ChevronDown size={20} className="text-black" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Input Harga Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Harga Menu
            </label>
            <input 
              type="text" 
              placeholder="Rp. XXXXXXXX" 
              className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            />
          </div>

          {/* Input Deskripsi Menu */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Deskripsi Menu
            </label>
            <textarea 
              rows={5} 
              placeholder="Contoh : Ini adalah Ayam Penyet Terbaik yang pernah ada ( Maksimal 100 Karakter )" 
              className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-5 py-4 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              className="w-full sm:w-auto px-12 bg-[#8B1A1A] hover:bg-red-900 text-white font-extrabold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Simpan Menu
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}