import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang membutuhkan login
const protectedRoutes = ["/owner", "/kasir", "/customer"];

// Route yang hanya bisa diakses jika BELUM login
const authRoutes = ["/login", "/daftar"];

// Next.js 16: file ini menggantikan middleware.ts
// PENTING: Proxy TIDAK boleh import Prisma atau module Node.js berat
// Session dibaca dari cookie JWT yang di-set oleh NextAuth
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md

export function proxy(req: NextRequest) {
  const { nextUrl } = req;

  // Baca session token dari cookie NextAuth (JWT)
  // NextAuth v5 menyimpan token di cookie "authjs.session-token" atau "__Secure-authjs.session-token"
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Jika user belum login dan coba akses halaman protected → redirect ke login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Jika user sudah login dan coba akses halaman login/daftar
  // Kita biarkan user tetap bisa akses halaman /login atau /daftar
  // Jika mereka ingin login dengan akun lain atau daftar akun baru
  // if (isAuthRoute && isLoggedIn) {
  //   return NextResponse.redirect(new URL("/redirect", nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan di semua route kecuali:
    // - _next/static, _next/image, favicon, gambar
    // - /api/auth (NextAuth endpoints — jangan di-intercept!)
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
