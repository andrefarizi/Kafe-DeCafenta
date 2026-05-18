'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export type MejaData = {
  id: string;
  name: string;
  tableCode: string;
  status: 'Tersedia' | 'Dipakai';
  isInLayout: boolean;
};

// ─────────────────────────────────────────────
//  READ
// ─────────────────────────────────────────────

/**
 * Ambil semua data meja dari database.
 * Digunakan oleh /kasir/kelola-meja & /owner/meja & /owner/meja/tata-letak
 */
export async function getTableList(): Promise<MejaData[]> {
  noStore();
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableCode: 'asc' },
    });

    return tables.map((t) => ({
      id: t.id,
      name: t.name,
      tableCode: t.tableCode,
      status: t.status === 'tersedia' ? 'Tersedia' : 'Dipakai',
      isInLayout: t.isInLayout,
    }));
  } catch (error) {
    console.error('getTableList error:', error);
    return [];
  }
}

// ─────────────────────────────────────────────
//  CREATE (Owner only)
// ─────────────────────────────────────────────

export async function createTable(
  name: string,
  tableCode: string
): Promise<{ success: boolean; message: string; table?: MejaData }> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'OWNER') {
      return { success: false, message: 'Akses ditolak.' };
    }

    const newTable = await prisma.table.create({
      data: {
        name,
        tableCode,
        status: 'tersedia',
        isInLayout: false,
      },
    });

    revalidatePath('/owner/meja');
    revalidatePath('/kasir/kelola-meja');

    return {
      success: true,
      message: 'Meja berhasil ditambahkan.',
      table: {
        id: newTable.id,
        name: newTable.name,
        tableCode: newTable.tableCode,
        status: 'Tersedia',
        isInLayout: newTable.isInLayout,
      },
    };
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return { success: false, message: 'Kode Meja sudah digunakan.' };
    }
    console.error('createTable error:', error);
    return { success: false, message: 'Gagal menambahkan meja.' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE – Status (Kasir & Owner)
// ─────────────────────────────────────────────

/**
 * Toggle status meja antara 'tersedia' dan 'dipakai'.
 */
export async function updateTableStatus(
  tableId: string,
  currentStatus: 'Tersedia' | 'Dipakai'
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Sesi tidak valid. Silakan login ulang.' };
    }

    const nextStatus = currentStatus === 'Tersedia' ? 'dipakai' : 'tersedia';

    await prisma.table.update({
      where: { id: tableId },
      data: { status: nextStatus },
    });

    revalidatePath('/kasir/kelola-meja');
    revalidatePath('/kasir/beranda');
    revalidatePath('/owner/meja');

    return { success: true, message: 'Status meja berhasil diperbarui!' };
  } catch (error) {
    console.error('updateTableStatus error:', error);
    return { success: false, message: 'Gagal memperbarui status meja. Coba lagi.' };
  }
}

// ─────────────────────────────────────────────
//  DELETE (Owner only)
// ─────────────────────────────────────────────

/**
 * Hapus meja. Hanya bisa dihapus jika status tersedia.
 */
export async function deleteTable(
  tableId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'OWNER') {
      return { success: false, message: 'Akses ditolak.' };
    }

    const meja = await prisma.table.findUnique({ where: { id: tableId } });
    if (!meja) return { success: false, message: 'Meja tidak ditemukan.' };
    if (meja.status === 'dipakai') {
      return { success: false, message: 'Meja sedang dipakai dan tidak dapat dihapus.' };
    }

    await prisma.table.delete({ where: { id: tableId } });

    revalidatePath('/owner/meja');
    revalidatePath('/kasir/kelola-meja');

    return { success: true, message: 'Meja berhasil dihapus.' };
  } catch (error) {
    console.error('deleteTable error:', error);
    return { success: false, message: 'Gagal menghapus meja. Coba lagi.' };
  }
}

// ─────────────────────────────────────────────
//  TATA LETAK – Simpan isInLayout ke DB (Owner)
// ─────────────────────────────────────────────

/**
 * Simpan tata letak meja.
 * - tableIdsInLayout : array ID meja yang ADA di denah → isInLayout = true
 * - Semua meja lain yang tidak ada di array → isInLayout = false
 */
export async function saveTataLetakMeja(
  tableIdsInLayout: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'OWNER') {
      return { success: false, message: 'Akses ditolak.' };
    }

    // Set isInLayout = true untuk meja yang ada di denah
    await prisma.table.updateMany({
      where: { id: { in: tableIdsInLayout } },
      data: { isInLayout: true },
    });

    // Set isInLayout = false untuk meja yang TIDAK ada di denah
    await prisma.table.updateMany({
      where: { id: { notIn: tableIdsInLayout } },
      data: { isInLayout: false },
    });

    revalidatePath('/owner/meja');
    revalidatePath('/owner/meja/tata-letak');
    revalidatePath('/kasir/kelola-meja');
    revalidatePath('/kasir/beranda');

    return { success: true, message: 'Tata letak berhasil disimpan.' };
  } catch (error) {
    console.error('saveTataLetakMeja error:', error);
    return { success: false, message: 'Gagal menyimpan tata letak. Coba lagi.' };
  }
}
