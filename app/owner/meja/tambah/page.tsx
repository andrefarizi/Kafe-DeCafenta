import React from 'react';
import Link from 'next/link';

export default function ModalTambahMeja() {
  return (
    // Wrapper luar ini berfungsi sebagai overlay gelap jika dijadikan modal popup.
    // Jika hanya ingin melihat card-nya saja, fokus pada elemen <div className="bg-white...">
    <div className="min-h-screen bg-gray-900/40 flex items-center justify-center p-4 font-sans">
      
      {/* Modal Card Container */}
      <div className="bg-white border-2 border-[#8B1A1A] rounded-[1.5rem] w-full max-w-2xl p-8 md:p-12 shadow-2xl relative">
        
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#8B1A1A] mb-10">
          Tambah Meja
        </h2>

        {/* Form Section */}
        <form className="space-y-8">
          
          {/* Input Nama Meja */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-3">
              Nama Meja
            </label>
            <input
              type="text"
              placeholder="contoh : Meja 13"
              className="w-full bg-[#F4F5F7] border border-gray-300 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            />
          </div>

          {/* Input Kode Meja (Read Only / Disabled) */}
          <div className="mb-12">
            <label className="block text-lg font-extrabold text-black mb-3">
              Kode Meja
            </label>
            <input
              type="text"
              disabled
              placeholder="Terbuat Otomatis ,contoh : #MJ013"
              className="w-full bg-[#F4F5F7] border border-gray-300 rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-500 placeholder:italic cursor-not-allowed opacity-80"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-4">
            <Link 
              href="/owner/meja"
              className="w-full sm:w-48 bg-white border border-[#8B1A1A] text-[#8B1A1A] font-extrabold py-3.5 rounded-xl hover:bg-red-50 transition-colors shadow-sm block text-center"
            >
              Batalkan
            </Link>
            <Link 
              href="/owner/meja/berhasil-ditambahkan"
              className="w-full sm:w-48 bg-[#8B1A1A] border border-[#8B1A1A] text-white font-extrabold py-3.5 rounded-xl hover:bg-red-900 transition-colors shadow-sm block text-center"
            >
              Tambahkan Meja
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}