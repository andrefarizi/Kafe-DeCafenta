import React from 'react';
import { Check } from 'lucide-react';

export default function ModalSuksesSimpanTataLetak() {
  return (
    // Wrapper luar berfungsi sebagai overlay gelap untuk modal popup
    <div className="min-h-screen bg-gray-900/40 flex items-center justify-center p-4 font-sans">
      
      {/* Modal Card Container */}
      <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Success Icon Badge (Custom CSS Shape) */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Base shape */}
          <div className="absolute w-16 h-16 bg-[#B6EBA5] rounded-xl z-0"></div>
          {/* Rotated shape to create 8-point star effect */}
          <div className="absolute w-16 h-16 bg-[#B6EBA5] rounded-xl rotate-45 z-0"></div>
          
          {/* Thick Checkmark */}
          <Check size={40} className="text-[#16A34A] relative z-10 stroke-[4] mt-1" />
        </div>

        {/* Success Message */}
        <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
          pesanan berhasil <br /> dibatalkan
        </h2>

        {/* Action Button */}
        <button 
          className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
        >
          Lanjutkan
        </button>

      </div>
      
    </div>
  );
}