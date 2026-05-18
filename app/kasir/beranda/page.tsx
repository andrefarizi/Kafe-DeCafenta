import React from 'react';
import Link from 'next/link';
import { getKasirDashboardData } from '@/src/controllers/kasir-dashboard-controller';
import KasirLogoutButton from '../_components/KasirLogoutButton';

export const dynamic = 'force-dynamic';

const ReceiptIcon = () => (
  <img
    src="/material-symbols_order-approve-outline-rounded (1).png"
    alt="receipt icon"
    width={36}
    height={36}
  />
);

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'masuk':        return 'bg-[#FFC700] text-black';
    case 'dimasak':      return 'bg-[#8B1A1A] text-white';
    case 'siap_diambil': return 'bg-[#3B82F6] text-white';
    case 'selesai':      return 'bg-[#22C55E] text-white';
    default:             return 'bg-gray-300 text-black';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'masuk':        return 'Masuk';
    case 'dimasak':      return 'Dimasak';
    case 'siap_diambil': return 'Siap Diambil';
    case 'selesai':      return 'Selesai';
    default:             return status;
  }
};

export default async function DashboardKasir() {
  const { kasirName, recentOrders, activeOrders, tables } =
    await getKasirDashboardData();

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">

        {/* Header Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 border border-[#6a1713] rounded-md shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6a1713]">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-semibold text-[#6a1713]">Dashboard Kasir</span>
        </div>

        {/* Profile Card */}
        <div className="border-2 border-[#6a1713] rounded-xl p-4 flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src="/Vector (5).png" alt="user avatar" width={46} height={46} />
            <div>
              <h2 className="font-bold text-lg">{kasirName}</h2>
              <p className="text-[#6a1713] text-sm font-medium">Kasir De Cafenta</p>
            </div>
          </div>
        </div>

        {/* Pesanan Aktif Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">Pesanan Ditempat</h1>
          <p className="text-[#6a1713] text-sm mb-4">Catat pesanan pelanggan anda secara langsung dengan mudah</p>

          <div className="border-2 border-[#6a1713] rounded-xl p-5">
            {/* Action Card Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img src="/fluent_service-bell-16-filled.png" alt="bell" width={46} height={46} />
                <h3 className="font-bold text-lg">Catat Sekarang</h3>
              </div>
              <Link
                href="/kasir/pesan-ditempat"
                className="bg-[#6a1713] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors"
              >
                Buat Pesanan Baru
              </Link>
            </div>

            <hr className="border-t-2 border-black mb-4" />
            <h4 className="font-bold text-[#6a1713] mb-4">Pesanan Aktif</h4>

            {/* Table Header */}
            <div className="bg-[#FFC7C7] rounded-md py-3 px-4 grid grid-cols-3 text-sm font-bold mb-2">
              <div>Nama Pelanggan</div>
              <div className="text-center">Jumlah</div>
              <div className="text-right">Harga</div>
            </div>

            {activeOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm font-medium">Belum ada pesanan aktif.</p>
            ) : (
              activeOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/kasir/daftar-pesanan/detail/${order.id}`}
                  className="grid grid-cols-3 items-center py-3 px-4 border-b border-gray-200 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ReceiptIcon />
                    <div>
                      <p className="font-bold text-sm">{order.nama}</p>
                      <p className="text-[#6a1713] text-xs font-semibold">{order.orderCode}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium">{order.jumlah}</div>
                  <div className="text-right text-sm font-medium">{order.harga}</div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Daftar Pesanan Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">Daftar Pesanan</h1>
          <p className="text-[#6a1713] text-sm mb-4">Daftar pesanan terakhir yang masuk</p>

          <div className="border-2 border-[#6a1713] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#6a1713]">Pesanan Terakhir</h3>
              <Link
                href="/kasir/daftar-pesanan"
                className="flex items-center gap-2 text-[#6a1713] text-sm hover:underline"
              >
                Selengkapnya
                <span className="border border-[#6a1713] rounded-full w-5 h-5 flex items-center justify-center text-xs">{'>'}</span>
              </Link>
            </div>

            {/* Table Header */}
            <div className="bg-[#FFC7C7] rounded-md py-3 px-4 grid grid-cols-4 text-sm font-bold mb-2">
              <div className="col-span-2">Nama Pelanggan</div>
              <div className="text-center">Jumlah</div>
              <div className="text-right">Harga</div>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm font-medium">Belum ada pesanan.</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/kasir/daftar-pesanan/detail/${order.id}`}
                  className="grid grid-cols-4 items-center py-3 px-4 border-b border-gray-200 hover:bg-red-50 transition-colors"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <ReceiptIcon />
                    <div>
                      <p className="font-bold text-sm">{order.nama}</p>
                      <p className="text-[#6a1713] text-xs font-semibold">{order.orderCode}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium">{order.jumlah}</div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.harga}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Ketersediaan Meja Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Ketersediaan Meja</h1>
            <Link
              href="/kasir/kelola-meja"
              className="flex items-center gap-2 text-[#6a1713] text-sm hover:underline"
            >
              Selengkapnya
              <span className="border border-[#6a1713] rounded-full w-5 h-5 flex items-center justify-center text-xs">{'>'}</span>
            </Link>
          </div>

          <div className="bg-white border border-red-200 rounded-2xl p-6 relative">
            {tables.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm font-medium">Belum ada data meja.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tables.map((meja) => (
                  <div
                    key={meja.id}
                    className="bg-white border-2 border-[#8A0000] rounded-xl p-4 flex flex-col justify-between h-28"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{meja.name}</h3>
                      <span className="text-[#6a1713] text-xs font-bold">{meja.tableCode}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 mb-1">Status</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${meja.status === 'Tersedia' ? 'bg-[#5cb85c]' : 'bg-[#c9302c]'}`}>
                        {meja.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}