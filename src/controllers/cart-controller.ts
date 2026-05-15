'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export async function addToCart(menuId: string, quantity: number, notes: string) {
  try {
    // 1. Cek apakah user sudah login
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk memesan.' };
    }

    // 2. Cek apakah menu ini sudah ada di keranjang user
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_menuId: {
          userId: userId,
          menuId: menuId,
        },
      },
    });

    if (existingCartItem) {
      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          notes: notes ? notes : existingCartItem.notes, // Update catatan jika ada yang baru
        },
      });
    } else {
      // Jika belum ada, buat item baru di keranjang
      await prisma.cart.create({
        data: {
          userId: userId,
          menuId: menuId,
          quantity: quantity,
          notes: notes || null,
        },
      });
    }
    
    return { success: true, message: 'Berhasil ditambahkan ke keranjang!' };
  } catch (error) {
    console.error('Error addToCart:', error);
    return { success: false, message: 'Terjadi kesalahan sistem.' };
  }
}

export async function getCustomerCart() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return []; 
  }

  const cartItems = await prisma.cart.findMany({
    where: { userId: userId },
    include: {
      menu: {
        include: {
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { addedAt: 'desc' }, 
  });

  return cartItems.map((item) => ({
    id: item.id,                  // ID dari tabel Cart 
    menuId: item.menu.id,         // ID menu 
    name: item.menu.name,
    price: toNumber(item.menu.price),
    avgRating: toNumber(item.menu.avgRating),
    imageUrl: item.menu.imageUrl,
    categoryName: item.menu.category.name,
    qty: item.quantity,          
    note: item.notes || "",      
  }));
}

export async function updateCartNote(cartId: string, newNote: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Akses ditolak. Silakan login kembali.' };
    }

    await prisma.cart.update({
      where: { 
        id: cartId,
        userId: userId,
      },
      data: {
        notes: newNote,
      },
    });

    return { success: true, message: 'Catatan berhasil diperbarui!' };
  } catch (error) {
    console.error('Error updateCartNote:', error);
    return { success: false, message: 'Gagal memperbarui catatan sistem.' };
  }
}

// Tambahkan di bagian bawah file src/controllers/cart-controller.ts

export async function updateCartQuantity(cartId: string, newQuantity: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Akses ditolak.' };
    }

    if (newQuantity < 1) {
      return { success: false, message: 'Kuantitas minimal 1 porsi.' };
    }

    // Update kuantitas di database
    await prisma.cart.update({
      where: { 
        id: cartId,
        userId: userId, 
      },
      data: {
        quantity: newQuantity,
      },
    });

    return { success: true, message: 'Kuantitas berhasil diperbarui!' };
  } catch (error) {
    console.error('Error updateCartQuantity:', error);
    return { success: false, message: 'Gagal memperbarui kuantitas.' };
  }
}