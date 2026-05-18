'use server';

import { prisma as db } from '@/lib/prisma';
import { sendOTP } from '@/lib/email';

export async function requestOTPAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, message: 'Email harus diisi' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Email tidak ditemukan di sistem kami' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Hapus token lama jika ada untuk email ini
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Simpan token baru
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
      },
    });

    // Kirim email
    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return { success: false, message: 'Gagal mengirim email OTP. Pastikan konfigurasi SMTP di file .env sudah benar.' };
    }

    return { success: true, message: 'Kode OTP berhasil dikirim ke email Anda', email };
  } catch (error) {
    console.error('Request OTP Error:', error);
    return { success: false, message: 'Terjadi kesalahan pada server saat memproses permintaan' };
  }
}
