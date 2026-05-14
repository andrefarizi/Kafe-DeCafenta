'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { registerAction } from './actions';

export default function PesananPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const allowSubmitRef = useRef(false);
  const [actionState, formAction, isPending] = useActionState(
    registerAction,
    { success: false, message: '' }
  );

  const handleOpenIntro = (event: React.FormEvent<HTMLFormElement>) => {
    if (!allowSubmitRef.current) {
      event.preventDefault();
      setErrorMsg('');
      setShowIntroModal(true);
      return;
    }

    allowSubmitRef.current = false;
  };

  useEffect(() => {
    if (!actionState?.message) {
      return;
    }

    if (actionState.success) {
      setErrorMsg('');
      setShowSuccessModal(true);
    } else {
      setErrorMsg(actionState.message);
    }
  }, [actionState]);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/customer/beranda" });
  };

  const handleFacebookLogin = () => {
    signIn("facebook", { callbackUrl: "/customer/beranda" });
  };

  return (
    // Background utama merah gelap
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

      {showIntroModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[2rem] border-2 border-[#8b1c1c] p-8 text-center shadow-2xl">
            <img src="/Group (4).png" alt="Buat akun baru" className="mx-auto h-36 w-36 object-contain" />
            <h2 className="text-2xl font-extrabold text-black mt-4">Buat akun baru?</h2>
            <p className="text-sm font-semibold text-gray-700 mt-2">
              Daftar sekarang untuk mulai memesan menu favoritmu dan menikmati fitur De Cafenta
            </p>
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => {
                  allowSubmitRef.current = true;
                  setShowIntroModal(false);
                  formRef.current?.requestSubmit();
                }}
                className="w-full py-3 bg-[#8b1c1c] text-white text-sm font-bold rounded-xl hover:bg-[#6b1d1d] transition-colors"
              >
                Buat Akun Sekarang
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowIntroModal(false);
                }}
                className="w-full py-3 border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm font-bold rounded-xl hover:bg-[#8b1c1c] hover:text-white transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[2rem] border-2 border-[#8b1c1c] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 h-28 w-28 rounded-full bg-[#e7f7e7] flex items-center justify-center">
              <img src="/Berhasil Icon.png" alt="Akun berhasil dibuat" className="h-16 w-16 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-black">Akun berhasil dibuat!</h2>
            <p className="text-sm font-semibold text-gray-700 mt-2">
              Selamat Akun berhasil dibuat lanjutkan ke halaman login untuk masuk ke akun anda
            </p>
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-[#8b1c1c] text-white text-sm font-bold rounded-xl hover:bg-[#6b1d1d] transition-colors"
              >
                Lanjutkan
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm font-bold rounded-xl hover:bg-[#8b1c1c] hover:text-white transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Ornamen Desain Figma */}
      <img
        src="/Rectangle%205%20(1).png"
        alt="Ornament Bottom Left"
        className="absolute bottom-6 left-0 w-40 md:w-60 lg:w-40 object-contain pointer-events-none z-0"
      />
      <img
        src="/Rectangle%205.png"
        alt="Ornament Top Right"
        className="absolute top-6 right-0 w-40 md:w-72 lg:w-45 object-contain pointer-events-none z-0"
      />

      {/* Container Card Utama */}
      
      <div className="relative z-10 w-full max-w-6xl bg-gradient-to-r from-[#e6d582] via-[#e2c8b8] to-[#e8d0c8] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-[3px]">
                <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white text-[#8b1c1c] font-bold text-sm md:text-base rounded-full border-2 border-[#8b1c1c] hover:bg-[#8b1c1c] hover:text-white transition-all duration-300 group shadow-sm">
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>
        {/* Kolom Kiri: Ilustrasi */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-6">
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <img src="/Group (4).png" alt="Group 4" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Garis vertikal tipis pembatas di tengah */}
        <div className="hidden md:block w-px bg-gray-500/40 my-12"></div>

        {/* Kolom Kanan: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/Group 2 1.png" alt="Logo D" className="h-8 object-contain" />
            <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#6b1d1d] mb-8 drop-shadow-sm text-center">Daftar</h1>

          {/* Form Inputs */}
          <form
            ref={formRef}
            action={formAction}
            onSubmit={handleOpenIntro}
            className="space-y-4 flex flex-col"
          >
            
            {/* Tampilkan Pesan Error / Success */}
            {errorMsg && <div className="text-red-600 font-semibold text-sm text-center bg-red-100 p-2 rounded-lg">{errorMsg}</div>}
            
            {/* Input Nama (Icon Kiri) */}
            <div className="relative flex items-center">
              <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                {/* Ikon User */}
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <input 
                type="text" 
                name="name"
                required
                placeholder="Nama" 
                className="w-full pl-14 pr-4 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Input Email (Icon Kanan) */}
            <div className="relative flex items-center">
              <input 
                type="email" 
                name="email"
                required
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
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                placeholder="Password" 
                className="w-full pl-14 pr-12 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer text-black"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Tombol Daftar Outline */}
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full py-3.5 bg-transparent border-2 border-[#6b1d1d] hover:bg-[#6b1d1d] hover:text-white transition-colors text-[#6b1d1d] font-bold rounded-full mt-6 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Mendaftar...' : 'Daftar'}
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
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="group flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 bg-white rounded-xl shadow-sm hover:bg-[#8b1c1c] transition-all duration-300">
              <img src="/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14 1 (1).png" alt="Google" className="h-5 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert" />
              <span className="text-sm font-bold text-black hidden sm:block transition-colors duration-300 group-hover:text-white">Google</span>
            </button>

            <button 
              type="button"
              onClick={handleFacebookLogin}
              className="group flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 bg-white rounded-xl shadow-sm hover:bg-[#8b1c1c] transition-all duration-300">
             <img src="/image-removebg-preview%20(1)%201.png" alt="Facebook" className="w-5 h-5 object-contain transition-all duration-300" />
              <span className="text-sm font-bold text-black hidden sm:block transition-colors duration-300 group-hover:text-white">Facebook</span>
            </button>
          </div>

          {/* Teks Footer Login */}
          <p className="text-center text-sm font-medium text-gray-800">
            Sudah punya akun? <a href="/login" className="text-[#8b1c1c] hover:underline font-bold">Login Sekarang</a>
          </p>

        </div>
      </div>
    </div>
  );
}


