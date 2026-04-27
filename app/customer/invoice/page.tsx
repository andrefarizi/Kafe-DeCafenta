'use client';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import React from 'react';
import { 
  ChevronLeft, 
  Printer,
} from 'lucide-react';

const InvoicePage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar activeMenu="pesanan" />

      <main className="flex-1 flex flex-col min-h-screen relative">

        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            {/* Header Invoice */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button className={`
                            p-1.5
                            bg-white
                            rounded-md
                            border border-gray-100
                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.2)]
                            hover:bg-gray-50
                            transition-all
                            `}>
                        <ChevronLeft size={20} strokeWidth={3} className="text-[#8B0000]" />
                </button>
                <h1 className="text-2xl font-bold text-black tracking-tight">Invoice</h1>
              </div>
              <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 bg-[#8B0000] text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#700000] transition-all"
              >
                <Printer size={18} />
                Print Invoice
              </button>
            </div>

            {/* White Invoice Paper */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              
              {/* Logo & ID Section */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src="/Logo 4.png" 
                      alt="Logo De Cafenta"
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-[#8B0000] font-bold text-xl mb-1 uppercase">De Cafenta</h2>
                    <p className="text-gray-400 text-[11px] leading-tight font-medium">
                      Durian Jangak, Kecamatan Pancur Batu,<br/>
                      Kabupaten Deli Serdang, Sumatera Utara
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-black mt-2 mb-2 tracking-tighter">#DCF001</h2>
                  <p className="text-gray-400 text-[11px] font-medium">8 Apr 2026 10 : 30</p>
                </div>
              </div>

              <hr className="border-dashed border-gray-200 mb-6" />

              {/* Customer Details Table */}
              <div className="space-y-3 mb-8 px-2">
                <DetailRow label="NAMA PELANGGAN" value="Andre Ganteng" />
                <DetailRow label="METODE PEMBAYARAN" value="Gopay" />
                <DetailRow label="TIPE PESANAN" value="Makan Ditempat" />
                <DetailRow label="KASIR" value="Wira Crypto" />
              </div>

              {/* Items Table */}
              <table className="w-full mb-6 border-collapse">
                <thead>
                  <tr className="bg-[#FFD1D1] text-black font-bold text-xs uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-left">Produk</th>
                    <th className="py-2.5 px-4 text-right pr-20">Harga</th>
                    <th className="py-2.5 px-4 text-center">Jumlah</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  <ProductRow name="Nasi Goreng" note="Jangan pedas" price="20.000" qty="1" total="20.000" />
                  <ProductRow name="Nasi Goreng" note="-" price="20.000" qty="1" total="20.000" />
                  <tr className="border-t border-gray-300"></tr>
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex flex-col items-end gap-2 mt-8">
                <div className="flex justify-between w-56 text-base font-bold">
                  <span className="text-black font-bold">Subtotal</span>
                  <span className="text-black">Rp 20.000</span>
                </div>
                <div className="flex justify-between w-56 text-base font-bold">
                  <span className="text-black font-bold">Pajak</span>
                  <span className="text-black">Rp 2.000</span>
                </div>
                <div className="w-56 h-[1.2px] bg-black my-1"></div>
                <div className="flex justify-between w-56 text-base font-bold">
                  <span className="text-black">Total dibayar</span>
                  <span className="text-[#8B0000]">Rp 22.000</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8">
                <p className="text-[10px] text-gray-400 italic font-medium">
                  Note : semua transaksi yang ada di nota ini bersifat final
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Helper Components tetap di bawah */
const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between max-w-full">
    <span className="font-bold text-black text-sm tracking-tight w-1/2">{label}</span>
    <span className="text-sm font-semibold text-black text-right">{value}</span>
  </div>
);

const ProductRow = ({ name, note, price, qty, total }: any) => (
  <tr className="text-sm">
    <td className="py-3.5 px-4">
      <div className="font-bold text-black">{name}</div>
      <div className="text-[10px] text-gray-400 italic font-medium">Catatan: {note}</div>
    </td>
    <td className="py-3.5 px-4 text-right pr-16 font-semibold text-black">Rp {price}</td>
    <td className="py-3.5 px-4 text-center font-semibold text-black">{qty}</td>
    <td className="py-3.5 px-4 text-right font-bold text-black">Rp {total}</td>
  </tr>
);

export default InvoicePage;