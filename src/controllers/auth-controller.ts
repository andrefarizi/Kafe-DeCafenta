'use server'

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerController(formData: FormData | { name?: string, email?: string, password?: string }) {
  try {
    let name, email, password;

    if (formData instanceof FormData) {
        name = formData.get("name") as string;
        email = formData.get("email") as string;
        password = formData.get("password") as string;
    } else {
        name = formData.name;
        email = formData.email;
        password = formData.password;
    }

    // ===== Validasi Input =====
    if (!name || !email || !password) {
      return { success: false, message: "Nama, email, dan password wajib diisi." };
    }

    if (name.trim().length < 2) {
      return { success: false, message: "Nama minimal 2 karakter." };
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Format email tidak valid." };
    }

    if (password.length < 8) {
      return { success: false, message: "Password minimal 8 karakter." };
    }

    // ===== Cek Email Sudah Terdaftar =====
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah terdaftar. Silakan login atau gunakan email lain." };
    }

    // ===== Hash Password =====
    const hashedPassword = await bcrypt.hash(password, 12);

    // ===== Simpan User ke Database =====
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        // Asumsi nilai default CUSTOMER.
        role: "CUSTOMER", 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: "Akun berhasil dibuat! Silakan login.",
      data: user,
    };
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return { success: false, message: "Terjadi kesalahan server. Coba lagi nanti." };
  }
}
