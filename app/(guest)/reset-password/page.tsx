'use client';

import React, { useState, useActionState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAction } from './actions';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));

  const [actionState, formAction, isPending] = useActionState(
    resetPasswordAction,
    { success: false, message: '' }
  );

  useEffect(() => {
    if (actionState?.success) {
      router.push('/login?reset=success');
    }
  }, [actionState, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    // Background utama merah gelap
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">

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
      <div className="relative z-10 w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Tombol Kembali (Absolute inside card) */}
        <Link href="/konfirmasi-email" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white text-[#8b1c1c] font-bold text-sm md:text-base rounded-full border-2 border-[#8b1c1c] hover:bg-[#8b1c1c] hover:text-white transition-all duration-300 group shadow-sm">
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>

        {/* Kolom Kiri: Ilustrasi */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center min-h-[400px] bg-gradient-to-br from-[#F6E9D5] to-[#F1D365]">
          <img 
            src="/db14d680-6eb9-45c8-9819-dee00d879e55-removebg-preview (2) 1.png" 
            alt="Reset Password Illustration" 
            className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl transition-transform duration-300" 
          />
        </div>

        {/* Kolom Kanan: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative bg-[#EBE4E2] z-10">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <img src="/Group%202%201.png" alt="Logo D" className="h-8 object-contain" />
              <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#6b1d1d] mb-3 shadow-sm text-center">RESET PASSWORD</h1>
            <p className="text-[13px] text-gray-800 font-bold text-center leading-tight">
              Masukkan kode OTP yang telah dikirim dan<br />password baru anda
            </p>
          </div>

          {/* Form Container */}
          <form action={formAction} className="space-y-4 flex flex-col w-full max-w-sm mx-auto">
            
            {/* Tampilkan Pesan Error */}
            {actionState?.message && !actionState.success && (
              <div className="text-red-600 font-semibold text-sm text-center bg-red-100 p-2 rounded-lg">
                {actionState.message}
              </div>
            )}

            {/* Hidden inputs untuk email dan OTP */}
            <input type="hidden" name="email" value={emailParam} />
            <input type="hidden" name="otp" value={otpValues.join('')} />

            {/* 1. Email Tujuan */}
            <div className="space-y-1">
              <div className="relative flex items-center h-[52px]">
                <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="w-full pl-14 pr-4 h-full rounded-full bg-white/80 border border-[#f4d03f] flex flex-col justify-center shadow-inner">
                  <span className="text-[10px] text-gray-500 font-semibold leading-tight">Email Tujuan</span>
                  <span className="text-xs font-bold text-gray-800 leading-tight truncate">{emailParam || 'Belum ada email'}</span>
                </div>
              </div>
            </div>

            {/* 2. Kode OTP */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#761A13] ml-1">Kode OTP</label>
              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={otpValues[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-11 md:w-[46px] md:h-[46px] text-center text-lg font-bold rounded-xl bg-white/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-800 shadow-sm"
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-700 font-semibold mt-1 text-center">
                Cek email Anda untuk kode OTP (berlaku 10 menit)
              </p>
            </div>

            {/* 3. Password Baru */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#761A13] ml-1">Password Baru</label>
              <div className="relative flex items-center h-[52px]">
                <input 
                  type={showPass ? "text" : "password"} 
                  name="password"
                  required
                  placeholder="Password" 
                  className="w-full pl-6 pr-20 h-full rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 shadow-inner text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-14 cursor-pointer text-black"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
                <div className="absolute -right-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            {/* 4. Konfirmasi Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#761A13] ml-1">Konfirmasi Password</label>
              <div className="relative flex items-center h-[52px]">
                <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  name="confirmPassword"
                  required
                  placeholder="Masukkan ulang password" 
                  className="w-full pl-14 pr-12 h-full rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 shadow-inner text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 cursor-pointer text-black z-10"
                >
                  {showConfirmPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit"
              disabled={isPending}
              className={`w-full py-3.5 mt-2 rounded-full bg-[#8b1c1c] text-white hover:bg-[#6b1d1d] font-bold text-sm transition-colors shadow-sm ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Memproses...' : 'Reset Password'}
            </button>

            {/* Link Kirim Ulang */}
            <div className="text-center pt-2">
              <p className="text-[12px] font-bold text-gray-800">
                Tidak menerima kode?{' '}
                <Link href="/konfirmasi-email" className="text-[#8b1c1c] hover:underline">Kirim Ulang</Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center text-white font-bold">Memuat...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}