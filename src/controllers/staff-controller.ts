'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export type StaffKasirData = {
  id: string;          // staffDetail.id
  userId: string;
  nama: string;
  email: string;
  telepon: string;
  staffNumber: string;
  status: 'Aktif' | 'Nonaktif';
  joinedAt: string;    // ISO string
};

// ─────────────────────────────────────────────
//  READ
// ─────────────────────────────────────────────

/**
 * Ambil semua data staff kasir dari database.
 * Digunakan oleh /owner/data-staff
 */
export async function getStaffKasirList(params?: {
  search?: string;
  filterStatus?: 'Aktif' | 'Nonaktif' | 'Semua';
  page?: number;
  perPage?: number;
}): Promise<{ data: StaffKasirData[]; total: number; totalPages: number }> {
  noStore();

  const search = params?.search?.trim() ?? '';
  const filterStatus = params?.filterStatus ?? 'Semua';
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  try {
    // Build where clause
    const whereStatus =
      filterStatus === 'Aktif'
        ? 'aktif'
        : filterStatus === 'Nonaktif'
        ? 'non_aktif'
        : undefined;

    const staffDetails = await prisma.staffDetail.findMany({
      where: {
        user: {
          role: 'KASIR',
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        ...(whereStatus ? { workStatus: whereStatus } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const total = staffDetails.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const paginated = staffDetails.slice((page - 1) * perPage, page * perPage);

    const data: StaffKasirData[] = paginated.map((sd) => ({
      id: sd.id,
      userId: sd.userId,
      nama: sd.user.name ?? '-',
      email: sd.user.email ?? '-',
      telepon: sd.phone ?? sd.user.phone ?? '-',
      staffNumber: sd.staffNumber,
      status: sd.workStatus === 'aktif' ? 'Aktif' : 'Nonaktif',
      joinedAt: sd.joinedAt.toISOString(),
    }));

    return { data, total, totalPages };
  } catch (error) {
    console.error('getStaffKasirList error:', error);
    return { data: [], total: 0, totalPages: 1 };
  }
}

// ─────────────────────────────────────────────
//  UPDATE – Toggle Status Kasir (Owner only)
// ─────────────────────────────────────────────

/**
 * Toggle status kerja kasir antara 'aktif' dan 'non_aktif'.
 * staffDetailId: ID dari record StaffDetail (bukan userId).
 */
export async function toggleStaffStatus(
  staffDetailId: string
): Promise<{ success: boolean; message: string; newStatus?: 'Aktif' | 'Nonaktif' }> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'OWNER') {
      return { success: false, message: 'Akses ditolak. Hanya owner yang dapat mengubah status kasir.' };
    }

    const existing = await prisma.staffDetail.findUnique({
      where: { id: staffDetailId },
    });

    if (!existing) {
      return { success: false, message: 'Data staff tidak ditemukan.' };
    }

    const nextStatus = existing.workStatus === 'aktif' ? 'non_aktif' : 'aktif';

    await prisma.staffDetail.update({
      where: { id: staffDetailId },
      data: { workStatus: nextStatus },
    });

    revalidatePath('/owner/data-staff');
    return {
      success: true,
      message: `Status kasir berhasil diubah menjadi ${nextStatus === 'aktif' ? 'Aktif' : 'Nonaktif'}.`,
      newStatus: nextStatus === 'aktif' ? 'Aktif' : 'Nonaktif',
    };
  } catch (error) {
    console.error('toggleStaffStatus error:', error);
    return { success: false, message: 'Gagal mengubah status kasir. Coba lagi.' };
  }
}

export async function addStaffKasir(data: {
  nama: string;
  email: string;
  telepon: string;
  staffNumber: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'OWNER') {
      return { success: false, message: 'Akses ditolak. Hanya owner yang dapat menambahkan kasir.' };
    }

    const { nama, email, telepon, staffNumber } = data;

    if (!nama || !email || !staffNumber) {
      return { success: false, message: 'Nama, Email, dan ID Staff wajib diisi.' };
    }

    // Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    // Validasi Nomor Telepon
    if (telepon) {
      const phoneRegex = /^(08|628)[0-9]{7,13}$/;
      if (!phoneRegex.test(telepon)) {
        return { success: false, message: 'Nomor telepon harus valid (diawali 08 atau 628, minimal 9 digit angka).' };
      }
    }

    const bcryptjs = require('bcryptjs');
    const hashedPassword = await bcryptjs.hash('Kasir123!', 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }

    if (telepon) {
      const existingPhone = await prisma.user.findFirst({ where: { phone: telepon } });
      if (existingPhone) {
        return { success: false, message: 'Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.' };
      }
    }

    const existingStaffDetail = await prisma.staffDetail.findUnique({ where: { staffNumber } });
    if (existingStaffDetail) {
      return { success: false, message: 'ID Staff sudah digunakan. Silakan gunakan ID yang lain.' };
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: nama,
          email,
          phone: telepon,
          password: hashedPassword,
          role: 'KASIR',
        },
      });

      await tx.staffDetail.create({
        data: {
          userId: user.id,
          phone: telepon,
          staffNumber,
          workStatus: 'aktif',
        },
      });
    });

    revalidatePath('/owner/data-staff');

    return { success: true, message: 'Kasir berhasil ditambahkan.' };
  } catch (error) {
    console.error('addStaffKasir error:', error);
    return { success: false, message: 'Gagal menambahkan kasir. Coba lagi.' };
  }
}