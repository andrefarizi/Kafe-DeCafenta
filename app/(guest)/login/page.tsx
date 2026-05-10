"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        // Login berhasil — redirect ke halaman owner
        router.push("/owner/beranda");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/customer/beranda" });
  };

  const handleFacebookLogin = () => {
    signIn("facebook", { callbackUrl: "/customer/beranda" });
  };

  return (
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

      {/* Tombol Kembali */}
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-white text-[#8b1c1c] font-bold rounded-full shadow-lg border-2 border-white hover:bg-[#8b1c1c] hover:text-white transition-all duration-300 group">
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </Link>

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
      <div className="relative z-10 w-full max-w-7xl bg-gradient-to-br from-[#e2c8b8] to-[#e8d0c8] rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row border-4 border-blue-400/20">

        {/* Kolom Kiri: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/Group%202%201.png" alt="Logo D" className="h-8 object-contain" />
            <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#6b1d1d] mb-10 drop-shadow-sm text-center">MASUK</h1>

          {/* Pesan Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">

            {/* Input Email */}
            <div className="relative flex items-center">
              <div className="absolute left-0 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-14 pr-4 py-3 rounded-full bg-white/80 border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner disabled:opacity-60"
              />
            </div>

            {/* Input Password */}
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-6 pr-24 py-3 rounded-full bg-white/80 border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-14 cursor-pointer text-black"
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
              <div className="absolute right-0 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Lupa Password */}
            <div className="text-right mt-2">
              <a href="#" className="text-sm font-medium text-[#8b1c1c] hover:underline">
                Lupa Password?
              </a>
            </div>

            {/* Tombol Masuk */}
            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#6b1d1d] hover:bg-[#8b1c1c] transition-colors text-white font-semibold rounded-full shadow-md mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Masuk...
                </>
              ) : "Masuk"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-400/50"></div>
            <span className="mx-4 text-xs font-bold text-gray-600">ATAU</span>
            <div className="flex-grow border-t border-gray-400/50"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-between gap-3 mb-8">
            <button
              id="btn-login-google"
              type="button"
              onClick={handleGoogleLogin}
              className="group flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-[#8b1c1c] transition-all duration-300"
            >
              <img src="/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14%201%20(1).png" alt="Google" className="w-5 h-5 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert" />
              <span className="text-sm font-bold text-black transition-colors duration-300 group-hover:text-white">Google</span>
            </button>
            <button
              id="btn-login-facebook"
              type="button"
              onClick={handleFacebookLogin}
              className="group flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-[#8b1c1c] transition-all duration-300"
            >
              <img src="/image-removebg-preview%20(1)%201.png" alt="Facebook" className="w-5 h-5 object-contain transition-all duration-300" />
              <span className="text-sm font-bold text-black transition-colors duration-300 group-hover:text-white">Facebook</span>
            </button>
          </div>

          {/* Link Daftar */}
          <p className="text-center text-sm font-medium text-gray-700">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-[#8b1c1c] hover:underline font-bold">
              Daftar Sekarang
            </Link>
          </p>
        </div>

        {/* Kolom Kanan: Ilustrasi */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center min-h-[400px]">
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gray-500/70 z-20"></div>
          <img src="/Rectangle%203.png" alt="Background Ilustrasi" className="absolute inset-0 w-full h-full object-cover z-0" />
          <img src="/Group%20(3).png" alt="Burger dan Minuman" className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
}