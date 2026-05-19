import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isGuestPath = 
    nextUrl.pathname.startsWith("/login") || 
    nextUrl.pathname.startsWith("/daftar") || 
    nextUrl.pathname.startsWith("/reset-password") || 
    nextUrl.pathname.startsWith("/konfirmasi-email");

  const isOwnerPath = nextUrl.pathname.startsWith("/owner");
  const isKasirPath = nextUrl.pathname.startsWith("/kasir");
  const isCustomerPath = nextUrl.pathname.startsWith("/customer");

  if (isGuestPath) {
    if (isLoggedIn) {
      if (role === "OWNER") return NextResponse.redirect(new URL("/owner/beranda", nextUrl));
      if (role === "KASIR") return NextResponse.redirect(new URL("/kasir/beranda", nextUrl));
      return NextResponse.redirect(new URL("/customer/beranda", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && (isOwnerPath || isKasirPath || isCustomerPath)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isOwnerPath && role !== "OWNER") {
    if (role === "KASIR") return NextResponse.redirect(new URL("/kasir/beranda", nextUrl));
    return NextResponse.redirect(new URL("/customer/beranda", nextUrl));
  }

  if (isKasirPath && role !== "KASIR") {
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner/beranda", nextUrl));
    return NextResponse.redirect(new URL("/customer/beranda", nextUrl));
  }

  if (isCustomerPath && role !== "CUSTOMER") {
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner/beranda", nextUrl));
    if (role === "KASIR") return NextResponse.redirect(new URL("/kasir/beranda", nextUrl));
  }

  return NextResponse.next();
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|avatars|uploads|.*\\..*).*)",
  ],
};