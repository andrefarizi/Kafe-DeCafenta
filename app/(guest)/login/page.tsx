import React from 'react';

export default function LoginPage() {
  return (
    // Background utama merah gelap dengan sedikit gradasi/glow
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Ornamen Desain Figma */}
      <img 
        src="/Rectangle%205%20(1).png" 
        alt="Ornament Top Left" 
        className="absolute top-6 left-0 w-40 md:w-60 lg:w-40 object-contain pointer-events-none z-0" 
      />
      <img 
        src="/Rectangle%205.png" 
        alt="Ornament Bottom Right" 
        className="absolute bottom-6 right-0 w-40 md:w-72 lg:w-45 object-contain pointer-events-none z-0" 
      />

      {/* Container Card Utama */}
      <div className="relative z-10 w-full max-w-7xl bg-gradient-to-br from-[#f0e8e1] to-[#e6d8cb] rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row border-4 border-blue-400/20">
        
        {/* Kolom Kiri: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl font-extrabold text-black">D</span>
            <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#6b1d1d] mb-10 drop-shadow-sm">MASUK</h1>

          {/* Form Inputs */}
          <form className="space-y-5 flex flex-col">
            
            {/* Input Email */}
            <div className="relative flex items-center">
              <div className="absolute left-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
                {/* Ikon Amplop Sederhana */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pl-14 pr-4 py-3 rounded-full bg-white/80 border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Input Password */}
            <div className="relative flex items-center">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-6 pr-24 py-3 rounded-full bg-white/80 border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <div className="absolute right-14 cursor-pointer text-black">
                 {/* Ikon Eye */}
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <div className="absolute right-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center shadow-sm">
                {/* Ikon Gembok */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>

            {/* Lupa Password */}
            <div className="text-right mt-2">
              <a href="#" className="text-sm font-medium text-[#8b1c1c] hover:underline">Lupa Password?</a>
            </div>

            {/* Tombol Masuk Utama */}
            <button 
              type="submit" 
              className="w-full py-3.5 bg-[#6b1d1d] hover:bg-[#8b1c1c] transition-colors text-white font-semibold rounded-full shadow-md mt-4"
            >
              Masuk
            </button>
          </form>

          {/* Divider ATAU */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-400/50"></div>
            <span className="mx-4 text-xs font-bold text-gray-600">ATAU</span>
            <div className="flex-grow border-t border-gray-400/50"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-between gap-3 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-blue-500 text-lg">G</span>
              <span className="text-sm font-bold text-black">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-black text-lg"></span>
              <span className="text-sm font-bold text-black">Apple</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <span className="font-bold text-blue-600 text-lg">f</span>
              <span className="text-sm font-bold text-black">Facebook</span>
            </button>
          </div>

          {/* Daftar */}
          <p className="text-center text-sm font-medium text-gray-700">
            Belum punya akun? <a href="#" className="text-[#8b1c1c] hover:underline font-bold">Daftar Sekarang</a>
          </p>

        </div>

        {/* Kolom Kanan: Ilustrasi (Hanya tampil di layar md ke atas) */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center min-h-[400px]">
          
          {/* Garis vertikal pembatas di tengah */}
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gray-500/70 z-20"></div>

          {/* Background Ilustrasi (Rectangle 3) */}
          <img 
            src="/Rectangle%203.png" 
            alt="Background Ilustrasi" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          
          {/* Ilustrasi Burger & Minuman (Group 3) */}
          <img 
            src="/Group%20(3).png" 
            alt="Burger dan Minuman" 
            className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
          />
          
        </div>

      </div>
    </div>
  );
}