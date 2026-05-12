"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DaftarPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Pendaftaran gagal. Coba lagi.");
      } else {
        setSuccess("Akun berhasil dibuat! Mengarahkan ke halaman login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/customer/beranda" });
  };

  const handleFacebookRegister = () => {
    signIn("facebook", { callbackUrl: "/customer/beranda" });
  };

  return (
    <div className="min-h-screen bg-[#8b1c1c] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

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

        {/* Kolom Kiri: Ilustrasi */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-6">
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <img src="/Group (4).png" alt="Ilustrasi Kopi" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Garis vertikal pembatas */}
        <div className="hidden md:block w-px bg-gray-500/40 my-12"></div>

        {/* Kolom Kanan: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center items-center relative">
          <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/Group 2 1.png" alt="Logo D" className="h-8 object-contain" />
            <span className="text-sm font-bold text-[#6b1d1d] tracking-widest mt-1">DE CAFENTA</span>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#6b1d1d] mb-8 drop-shadow-sm text-center">Daftar</h1>

          {/* Pesan Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Pesan Sukses */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm text-center">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col" suppressHydrationWarning>

            {/* Input Nama */}
            <div className="relative flex items-center">
              <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="name"
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full pl-14 pr-4 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner disabled:opacity-60"
              />
            </div>

            {/* Input Email */}
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pr-14 pl-6 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner disabled:opacity-60"
              />
              <div className="absolute -right-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Input Password */}
            <div className="relative flex items-center">
              <div className="absolute -left-1 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-14 pr-12 py-3 rounded-full bg-[#f4eae1]/80 border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-400 shadow-inner disabled:opacity-60"
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

            {/* Tombol Daftar */}
            <button
              id="btn-daftar"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-transparent border-2 border-[#6b1d1d] hover:bg-[#6b1d1d] hover:text-white transition-colors text-[#6b1d1d] font-bold rounded-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mendaftar...
                </>
              ) : "Daftar"}
            </button>
          </form>

          {/* Divider ATAU */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-500/50"></div>
            <span className="mx-4 text-xs font-bold text-gray-700">ATAU</span>
            <div className="flex-grow border-t border-gray-500/50"></div>
          </div>

          {/* Social Register Buttons — hanya Google & Facebook */}
          <div className="flex justify-between gap-3 mb-6">
            <button
              id="btn-daftar-google"
              type="button"
              onClick={handleGoogleRegister}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <img
                src="/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14 1 (1).png"
                alt="Google"
                className="w-5 h-5 object-contain"
              />
              <span className="text-sm font-bold text-black">Google</span>
            </button>
            <button
              id="btn-daftar-facebook"
              type="button"
              onClick={handleFacebookRegister}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <img
                src="/image-removebg-preview (1) 1.png"
                alt="Facebook"
                className="w-5 h-5 object-contain"
              />
              <span className="text-sm font-bold text-black">Facebook</span>
            </button>
          </div>

          {/* Link Login */}
          <p className="text-center text-sm font-medium text-gray-800">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#8b1c1c] hover:underline font-bold">
              Login Sekarang
            </Link>
          </p>

          </div>
        </div>
      </div>
    </div>
  );
}
