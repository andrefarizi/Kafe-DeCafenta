import React from 'react';

export default function RegisterPage() {
  return (
    // Background utama merah gelap
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8">
      
      {/* Container Card Utama */}
      {/* Menggunakan gradient dari kuning redup di kiri ke pink/krem di kanan */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-[#e6d582] via-[#e2c8b8] to-[#e8d0c8] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-[3px] border-blue-400">
        
        {/* Kolom Kiri: Ilustrasi (Hanya tampil di layar md ke atas) */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8">
          {/* Tempat untuk menaruh aset ilustrasi teko & cangkir kopi dari Figma */}
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            {/* GANTI TAG INI DENGAN <img src="/ilustrasi-kopi.png" /> HASIL EXPORT FIGMA */}
            <div className="text-center p-6 border-2 border-dashed border-[#8b1c1c]/30 rounded-2xl bg-white/20 backdrop-blur-sm">
               <p className="text-[#8b1c1c] font-semibold">Area Ilustrasi Teko & Kopi</p>
               <p className="text-sm text-gray-700 mt-2">Export dari Figma (SVG/PNG) letakkan di sini.</p>
            </div>
          </div>
        </div>

        {/* Garis vertikal tipis pembatas di tengah */}
        <div className="hidden md:block w-px bg-gray-500/40 my-12"></div>

        {/* Kolom Kanan: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative">
          
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <span className="text-3xl font-extrabold text-black">D</span>
            <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#6b1d1d] mb-8 drop-shadow-sm text-center md:text-left">Daftar</h1>

          {/* Form Inputs */}
          <form className="space-y-4 flex flex-col">
            
            {/* Input Nama (Icon Kiri) */}
            <div className="relative flex items-center">
              <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                {/* Ikon User */}
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Nama" 
                className="w-full pl-14 pr-4 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Input Email (Icon Kanan) */}
            <div className="relative flex items-center">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pr-14 pl-6 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <div className="absolute -right-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                {/* Ikon Amplop */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
            </div>

            {/* Input Password (Icon Kiri + Mata Kanan) */}
            <div className="relative flex items-center">
              <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                {/* Ikon Gembok */}
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              </div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-14 pr-12 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <div className="absolute right-4 cursor-pointer text-black">
                 {/* Ikon Eye */}
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
            </div>

            {/* Tombol Daftar Outline */}
            <button 
              type="submit" 
              className="w-full py-3.5 bg-transparent border-2 border-[#6b1d1d] hover:bg-[#6b1d1d] hover:text-white transition-colors text-[#6b1d1d] font-bold rounded-full mt-6"
            >
              Daftar
            </button>
          </form>

          {/* Divider ATAU */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-500/50"></div>
            <span className="mx-4 text-xs font-bold text-gray-700">ATAU</span>
            <div className="flex-grow border-t border-gray-500/50"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-2 md:gap-3 mb-6">
            <button className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-blue-500 text-lg">G</span>
              <span className="text-sm font-bold text-black hidden sm:block">Google</span>
            </button>
            <button className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-black text-lg"></span>
              <span className="text-sm font-bold text-black hidden sm:block">Apple</span>
            </button>
            <button className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-blue-600 text-lg">f</span>
              <span className="text-sm font-bold text-black hidden sm:block">Facebook</span>
            </button>
          </div>

          {/* Teks Footer Login */}
          <p className="text-center text-sm font-medium text-gray-800">
            Sudah punya akun? <a href="#" className="text-[#8b1c1c] hover:underline font-bold">Login Sekarang</a>
          </p>

        </div>
      </div>
    </div>
  );
}