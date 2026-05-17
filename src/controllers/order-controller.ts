'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DCF${timestamp}${random}`;
}

export type CreateOrderResult = {
  success: boolean;
  message: string;
  orderId?: string;
  orderCode?: string;
};

type PaymentChannel = 'cash' | 'gopay' | 'dana' | 'bank_va';

export async function createOrderFromCart(
  orderType: 'dine_in' | 'takeaway',
  paymentMethod: PaymentChannel
): Promise<CreateOrderResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Silakan login terlebih dahulu.' };
    }

    if (!paymentMethod) {
      return { success: false, message: 'Metode pembayaran belum dipilih.' };
    }

    // Ambil keranjang user
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        menu: {
          include: { category: { select: { name: true } } },
        },
      },
    });

    if (cartItems.length === 0) {
      return { success: false, message: 'Keranjang kosong.' };
    }

    // Hitung total harga
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + Number(item.menu.price) * item.quantity,
      0
    );

    const orderCode = generateOrderCode();

    // Map orderType ke enum Prisma
    const orderTypeEnum = orderType === 'dine_in' ? 'dine_in_app' : 'dine_in_app';

    const orderTypeLabel = orderType === 'dine_in' ? 'Makan Ditempat' : 'Bawa Pulang';
    const paymentMethodEnum = paymentMethod === 'cash' ? 'cash' : 'ewallet';
    const notes = `${orderTypeLabel} | payment_method:${paymentMethod}`;

    // Ambil nama user untuk customerName
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Buat order dalam satu transaksi
    const order = await prisma.$transaction(async (tx) => {
      // Buat order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          userId,
          customerName: userRecord?.name ?? null,
          orderType: orderTypeEnum,
          status: 'masuk',
          paymentMethod: paymentMethodEnum,
          totalPrice,
          isPaid: false,
          notes,
        },
      });

      // Buat order items dari cart
      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          menuId: item.menuId,
          quantity: item.quantity,
          customNotes: item.notes,
          unitPrice: item.menu.price,
          subtotal: Number(item.menu.price) * item.quantity,
        })),
      });

      // Hapus keranjang user setelah order dibuat
      await tx.cart.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    revalidatePath('/customer/keranjang');
    revalidatePath('/customer/Pesanan');

    return {
      success: true,
      message: 'Pesanan berhasil dibuat!',
      orderId: order.id,
      orderCode: order.orderCode,
    };
  } catch (error) {
    console.error('Error createOrderFromCart:', error);
    return { success: false, message: 'Gagal membuat pesanan. Silakan coba lagi.' };
  }
}

export async function getCustomerOrders() {
  noStore();
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { menu: { select: { name: true, price: true } } },
        },
      },
      orderBy: { orderedAt: 'desc' },
    });

    // Auto-fix DB state synchronously for arrays
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.isPaid && order.status === 'masuk') {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'dimasak' },
          });
          return { ...order, status: 'dimasak' };
        }
        return order;
      })
    );

    return updatedOrders.map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      status: order.status,
      totalPrice: Number(order.totalPrice),
      isPaid: order.isPaid,
      orderType: order.notes?.includes('Bawa Pulang') ? 'Bawa Pulang' : 'Makan Ditempat',
      itemCount: order.orderItems.length,
      orderedAt: order.orderedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error getCustomerOrders:', error);
    return [];
  }
}

export async function getOrderDetail(orderId: string) {
  noStore();
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: {
            menu: {
              include: { category: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!order) return null;

    // Auto-fix status if stuck at "masuk" but already paid
    if (order.isPaid && order.status === 'masuk') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'dimasak' },
      });
      order.status = 'dimasak';
    }

    return {
      id: order.id,
      orderCode: order.orderCode,
      status: order.status,
      totalPrice: Number(order.totalPrice),
      isPaid: order.isPaid,
      notes: order.notes,
      paymentMethod: order.paymentMethod,
      orderType: order.notes?.includes('Bawa Pulang') ? 'Bawa Pulang' : 'Makan Ditempat',
      orderedAt: order.orderedAt.toISOString(),
      items: order.orderItems.map((item) => ({
        id: item.id,
        menuId: item.menu.id,
        name: item.menu.name,
        category: item.menu.category.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
        notes: item.customNotes || '',
        isReviewed: item.isReviewed || false, 
      })),
    };
  } catch (error) {
    console.error('Error getOrderDetail:', error);
    return null;
  }
}

export async function deleteCartItem(cartId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Akses ditolak.' };
    }

    await prisma.cart.delete({
      where: { id: cartId, userId },
    });

    return { success: true, message: 'Item berhasil dihapus dari keranjang.' };
  } catch (error) {
    console.error('Error deleteCartItem:', error);
    return { success: false, message: 'Gagal menghapus item.' };
  }
}
