import React from 'react';

export default function ModalSuksesTambahMeja() {
  return (
    // Wrapper luar ini berfungsi sebagai overlay gelap untuk modal popup.
    <div className="min-h-screen bg-gray-900/40 flex items-center justify-center p-4 font-sans">
      
      {/* Modal Card Container */}
      <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Illustration */}
        <div className="w-28 h-28 md:w-32 md:h-32 mb-6 flex items-center justify-center">
          {/* Ganti src di bawah ini dengan path gambar ilustrasi toko kamu, misal: "/assets/shop-illustration.png" */}
          <img 
            src="/Group (6).png" 
            alt="Ilustrasi Toko" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Success Message */}
        <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
          Meja Berhasil <br /> Ditambahkan
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