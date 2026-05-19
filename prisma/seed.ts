import { prisma } from '../lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('Menghapus data lama (jika ada)...');
  await prisma.staffDetail.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Membuat akun Owner...');
  const ownerPassword = await bcryptjs.hash('Owner123!', 10);
  await prisma.user.create({
    data: {
      name: 'Owner Decafenta',
      email: 'owner@decafenta.com',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  console.log('Membuat akun Kasir...');
  const kasirPassword = await bcryptjs.hash('Kasir123!', 10);
  const kasir = await prisma.user.create({
    data: {
      name: 'Kasir Andalan',
      email: 'kasir@decafenta.com',
      password: kasirPassword,
      phone: '081234567890',
      role: 'KASIR',
    },
  });

  await prisma.staffDetail.create({
    data: {
      userId: kasir.id,
      staffNumber: 'KSR-001',
      workStatus: 'aktif',
    },
  });

  console.log('Membuat akun Customer...');
  const customerPassword = await bcryptjs.hash('Customer123!', 10);
  await prisma.user.create({
    data: {
      name: 'Pelanggan Setia',
      email: 'customer@decafenta.com',
      password: customerPassword,
      phone: '081298765432',
      role: 'CUSTOMER',
    },
  });

  console.log('Membuat Kategori...');
  const categoryNasi = await prisma.category.create({ data: { name: 'Nasi' } });
  const categoryMie = await prisma.category.create({ data: { name: 'Mie' } });
  const categorySnack = await prisma.category.create({ data: { name: 'Snack' } });
  const categoryMinuman = await prisma.category.create({ data: { name: 'Minuman' } });

  console.log('Membuat Menu Dummy...');
  // Menu Nasi
  await prisma.menu.createMany({
    data: [
      {
        categoryId: categoryNasi.id,
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur, ayam, dan sosis.',
        price: 25000,
        isAvailable: true,
        isPromo: true,
      },
      {
        categoryId: categoryNasi.id,
        name: 'Nasi Ayam Geprek',
        description: 'Nasi putih dengan ayam geprek sambal bawang pedas.',
        price: 20000,
        isAvailable: true,
        isPromo: false,
      },
    ],
  });

  // Menu Mie
  await prisma.menu.createMany({
    data: [
      {
        categoryId: categoryMie.id,
        name: 'Mie Goreng Seafood',
        description: 'Mie goreng dengan udang dan cumi segar.',
        price: 28000,
        isAvailable: true,
        isPromo: false,
      },
      {
        categoryId: categoryMie.id,
        name: 'Mie Nyemek',
        description: 'Mie kuah kental dengan bumbu jawa yang khas.',
        price: 18000,
        isAvailable: true,
        isPromo: true,
      },
    ],
  });

  // Menu Minuman
  await prisma.menu.createMany({
    data: [
      {
        categoryId: categoryMinuman.id,
        name: 'Es Kopi Susu Aren',
        description: 'Kopi susu murni dengan manisnya gula aren lokal.',
        price: 15000,
        isAvailable: true,
        isPromo: true,
      },
      {
        categoryId: categoryMinuman.id,
        name: 'Thai Tea',
        description: 'Teh Thailand yang segar dan creamy.',
        price: 12000,
        isAvailable: true,
        isPromo: false,
      },
    ],
  });

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
