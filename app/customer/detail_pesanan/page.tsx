import React from 'react';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import { ChevronLeft, RotateCcw, Copy } from 'lucide-react';

const DetailPesanan = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar activeMenu="pesanan" />
      <main className="flex-1 flex flex-col h-screen overflow-hidden text-left">
        <div className="flex-none">
          <Topbar />
        </div>

        <div className="p-5 w-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4 w-full">
            <div className="flex items-center gap-3">
              <button className="p-1 border rounded-md bg-white hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <div className="text-left">
                <h1 className="text-xl font-bold text-black leading-tight">Detail Pesanan</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-[#8A0000] text-xs">#DCF001</span>
                  <span className="bg-yellow-400 text-[#8A0000] text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Masuk</span>
                </div>
              </div>
            </div>
            <p className="text-[#8A0000] font-bold text-[10px] mt-6 font-sans">8 April 2026, 10.30</p>
          </div>

          {/* Status Tracker Card */}
          <div className="bg-white rounded-lg border border-1 border-[#8A0000] p-4 mb-6 relative shadow-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#8A0000] font-bold text-[11px]">Status Pesanan</h2>
              <button className="flex items-center gap-1 bg-[#8A0000] text-white text-[9px] px-2 py-1 rounded-md">
                <RotateCcw size={10} /> Refresh Status
              </button>
            </div>

            <div className="relative flex justify-between px-2 items-center w-full max-w-6xl mx-auto">
              <div className="absolute top-[35%] left-10 right-10 h-0.5 bg-gray-200 z-0"></div>

              <div className="relative z-10 flex flex-col items-center w-20">
                <img src="/IconMasuk.png" alt="Masuk" className="w-full h-auto" />
              </div>
              <div className="relative z-10 flex flex-col items-center w-20">
                <img src="/IconDimasak.png" alt="Dimasak" className="w-full h-auto" />
              </div>
              <div className="relative z-10 flex flex-col items-center w-22">
                <img src="/IconSiapDiambil.png" alt="Siap Diambil" className="w-full h-auto" />
              </div>
              <div className="relative z-10 flex flex-col items-center w-16">
                <img src="/IconSelesai.png" alt="Selesai" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* Pembayaran Section */}
          <section className="mb-6 flex flex-col gap-5 w-full text-left">
            <div className="text-left">
              <h3 className="font-bold text-lg text-black">Pembayaran</h3>
              <p className="text-[11px] text-gray-500">Selesaikan pembayaran untuk melanjutkan pesanan anda</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-black">Metode Pembayaran</h3>
                <p className="text-xs text-gray-700 font-medium">Gopay</p>
              </div>

              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-black">Tipe Pesanan</h3>
                <p className="text-xs text-gray-700 font-medium">Makan Ditempat</p>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-sm font-bold text-black mb-2">Kode QR</h3>
              <div className="w-24 h-24 border-1 border-[#8A0000] rounded-lg p-1.5 flex items-center justify-center bg-[#FFECEC]">
                <div className="w-full h-full bg-white rounded flex items-center justify-center overflow-hidden">
                  <img src="/Frame 363.png" alt="QR" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-sm font-bold text-black mb-1">Nomor Virtual Account</h3>
              <div className="flex items-center gap-2">
                <Copy size={14} className="text-red-700 cursor-pointer hover:text-red-900" />
                <span className="text-xs font-mono font-bold text-gray-700">190138615933481029498</span>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-sm font-bold text-black mb-2">Status Pembayaran</h3>
              <span className="inline-block w-34 bg-[#484040] text-white text-[10px] pl-3 py-1 rounded-full text-left">
                Belum Dibayar
              </span>
            </div>
          </section>

          {/* Table Produk */}
          <div className="overflow-x-auto mb-6 w-full text-left">
            <table className="w-full">
              <thead>
                <tr className="text-black border-b border-gray-200">
                  <th className="pb-2 font-bold text-[11px] text-left">Produk</th>
                  <th className="pb-2 font-bold text-[11px] text-center">Kategori</th>
                  <th className="pb-2 font-bold text-[11px] text-center">Jumlah</th>
                  <th className="pb-2 font-bold text-[11px] text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <TableRow name="Nasi Goreng" category="Nasi" qty={1} price="Rp 20.000" note="Jangan pedas" img="/Rectangle 43.png" />
                <TableRow name="Nasi Goreng" category="Mie" qty={1} price="Rp 20.000" note="Jangan pedas" img="/Rectangle 43.png" />
                <TableRow name="Americano" category="Minuman" qty={1} price="Rp 20.000" note="Es nya dikit aja" img="/Rectangle 43 (1).png" />
              </tbody>
            </table>

            <div className="border-t-1 border-black mt-4 pt-2 flex justify-end">
              <h2 className="text-l font-bold text-[#8A0000]">Total 3 Menu : Rp 60.000</h2>
            </div>
          </div>

          <button className="w-full bg-[#8A0000] text-white py-2.5 rounded-lg font-bold text-[11px] hover:bg-red-900 mb-10 uppercase transition-all">
            Batalkan Pesanan
          </button>
        </div>
      </main>
    </div>
  );
};

const TableRow = ({ name, category, qty, price, note, img }: any) => (
  <tr className="border-b border-gray-50">
    <td className="py-3">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
          <img src={img} className="w-full h-full object-cover" alt={name} />
        </div>
        <div>
          <p className="font-bold text-black text-[11px] leading-tight">{name}</p>
          <p className="text-[9px] text-gray-500 italic">Catatan : {note}</p>
        </div>
      </div>
    </td>
    <td className="py-3 text-center font-bold text-black text-[11px]">{category}</td>
    <td className="py-3 text-center font-bold text-black text-[11px]">{qty}</td>
    <td className="py-3 text-right font-bold text-black text-[11px]">{price}</td>
  </tr>
);

export default DetailPesanan;