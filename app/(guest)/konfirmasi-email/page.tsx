'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestOTPAction } from './actions';

export default function ForgotPassword() {
  const router = useRouter();
  const [actionState, formAction, isPending] = useActionState(
    requestOTPAction,
    { success: false, message: '', email: '' }
  );

  useEffect(() => {
    if (actionState?.success && actionState.email) {
      // Redirect to reset password with email as query param
      router.push(`/reset-password?email=${encodeURIComponent(actionState.email)}`);
    }
  }, [actionState, router]);

  return (
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
      <div className="relative z-10 w-full max-w-5xl bg-gradient-to-br from-[#e2c8b8] to-[#e8d0c8] rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row border-5 border-blue-400/20">
        {/* Tombol Kembali (Absolute inside card) */}
        <Link href="/login" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white text-[#8b1c1c] font-bold text-sm md:text-base rounded-full border-2 border-[#8b1c1c] hover:bg-[#8b1c1c] hover:text-white transition-all duration-300 group shadow-sm">
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>

        {/* Kolom Kiri: Form */}
        <div className="w-full md:w-1/2 p-8 pt-24 md:p-14 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm mt-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/Group%202%201.png" alt="Logo D" className="h-8 object-contain" />
              <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
            </div>

            {/* Judul & Subjudul */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#6b1d1d] mb-4 shadow-sm text-center">LUPA PASSWORD</h1>
            <p className="text-sm text-gray-700 font-semibold text-center mb-8 px-4">
              Masukkan email yang terhubung dengan akun untuk menerima kode OTP
            </p>

            {/* Form */}
            <form action={formAction} className="space-y-6 flex flex-col">
              
              {/* Tampilkan Pesan Error */}
              {actionState?.message && !actionState.success && (
                <div className="text-red-600 font-semibold text-sm text-center bg-red-100 p-2 rounded-lg">
                  {actionState.message}
                </div>
              )}

              {/* Input Email */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="w-full pl-14 pr-4 py-3 rounded-full bg-white/80 border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 shadow-inner font-medium"
                />
              </div>

              {/* Tombol Kirim */}
              <button 
                type="submit"
                disabled={isPending}
                className={`w-full py-3 rounded-full bg-[#8b1c1c] text-white font-bold text-base hover:bg-[#6b1d1d] transition-colors shadow-lg ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPending ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
              </button>

            </form>

            {/* Footer Text */}
            <p className="mt-8 text-sm text-gray-800 font-medium text-center">
              Sudah ingat password?{' '}
              <Link href="/login" className="text-[#8b1c1c] font-bold hover:underline">
                Login Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Ilustrasi */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center min-h-[400px]">
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gray-500/70 z-20"></div>
          <img src="/Rectangle%203.png" alt="Background Ilustrasi" className="absolute inset-0 w-full h-full object-cover z-0" />
          <img 
            src="/db14d680-6eb9-45c8-9819-dee00d879e55-removebg-preview (2) 1.png" 
            alt="Forgot Password Illustration" 
            className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl transition-transform duration-300" 
          />
        </div>

      </div>
    </div>
  );
}