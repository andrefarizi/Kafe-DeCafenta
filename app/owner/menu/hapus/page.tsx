import React from 'react';

export default function ModalKonfirmasiHapus() {
  return (
    // Wrapper luar berfungsi sebagai overlay gelap untuk modal popup
    <div className="min-h-screen bg-gray-900/40 flex items-center justify-center p-4 font-sans">
      
      {/* Modal Card Container */}
      <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Warning Icon (Red Circle with Exclamation) */}
        <div className="w-20 h-20 bg-[#FF4C4C] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="text-white text-[40px] font-black leading-none mt-1">
            !
          </span>
        </div>

        {/* Confirmation Message */}
        <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
          Yakin Ingin <br /> Membatalkan Pesanan?
        </h2>

        {/* Action Buttons Container */}
        <div className="w-full flex flex-col space-y-4">
          
          {/* Lanjutkan Button (Primary / Destructive Action) */}
          <button 
            className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Lanjutkan
          </button>
          
          {/* Batal Button (Secondary Action) */}
          <button 
            className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Batal
          </button>

        </div>

      </div>
      
    </div>
  );
}