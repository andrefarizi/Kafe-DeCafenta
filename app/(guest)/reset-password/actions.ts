'use server';

import { prisma as db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !otp || !password || !confirmPassword) {
    return { success: false, message: 'Semua kolom harus diisi' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Password tidak cocok' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter' };
  }

  try {
    // Verifikasi OTP
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    });

    if (!verificationToken) {
      return { success: false, message: 'Kode OTP salah' };
    }

    if (new Date() > verificationToken.expires) {
      // Hapus token yang sudah kadaluarsa
      await db.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: otp } },
      });
      return { success: false, message: 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.' };
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password user
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Hapus token setelah berhasil digunakan
    await db.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: otp } },
    });

    return { success: true, message: 'Password berhasil direset. Silakan login.' };
  } catch (error) {
    console.error('Reset Password Error:', error);
    return { success: false, message: 'Terjadi kesalahan pada server saat memproses permintaan' };
  }
}
