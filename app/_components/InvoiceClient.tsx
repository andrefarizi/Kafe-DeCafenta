'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Printer } from 'lucide-react';
import { OrderDetailData } from '@/src/controllers/kasir-order-controller';

interface InvoiceClientProps {
  order: OrderDetailData;
  backHref: string;
}

export default function InvoiceClient({ order, backHref }: InvoiceClientProps) {
  const router = useRouter();

  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

  // Hitung subtotal (tanpa pajak): totalPrice / 1.1
  const subtotal = Math.round(order.totalPrice / 1.1);
  const pajak    = order.totalPrice - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative pb-12">
      
      {/* Print styles: sembunyikan tombol saat print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <main className="pt-8 md:pt-12 px-4 md:px-10 max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 no-print">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push(backHref)}
              className="p-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Kembali"
            >
              <ChevronLeft size={24} className="text-[#8B1A1A]" />
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-black">Invoice</h1>
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
          >
            <Printer size={18} />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* --- INVOICE CARD --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 md:p-12">
          
          {/* Invoice Header (Logo & Info) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            
            {/* Left: Brand Details */}
            <div className="flex items-center space-x-5">
              <div className="flex flex-col items-center">
                <img 
                  src="/Group 2 1.png" 
                  alt="Logo De Cafenta" 
                  className="w-12 h-14 object-contain mb-1" 
                />
                <span className="text-[10px] font-bold text-[#8B1A1A] text-center leading-tight">
                  DE CAFENTA<br/>
                  <span className="text-[7px] tracking-widest text-black font-medium">FOODS &amp; DRINKS</span><br/>
                  <span className="text-[6px] tracking-widest text-[#8B1A1A] font-medium">FREE WIFI</span>
                </span>
              </div>
              
              <div className="max-w-[280px]">
                <h2 className="font-extrabold text-[#8B1A1A] text-xl leading-tight mb-1">DE CAFENTA</h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Durian Jangak, Kecamatan Pancur Batu, 
                  Kabupaten Deli Serdang, Sumatera Utara
                </p>
              </div>
            </div>

            {/* Right: Invoice Number & Date */}
            <div className="text-left md:text-right w-full sm:w-1/2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-1 break-all uppercase">{order.orderCode}</h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium">{order.tanggal}, {order.waktu}</p>
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="w-full border-b-2 border-dotted border-gray-300 mb-8"></div>

          {/* Customer Information */}
          <div className="flex flex-col space-y-6 mb-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">NAMA PELANGGAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{order.customerName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">METODE<br className="hidden sm:block"/>PEMBAYARAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{order.paymentMethod}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">TIPE PESANAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{order.orderType}</span>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-12">
            {/* Mobile View (< sm) */}
            <div className="block sm:hidden border-t border-gray-200 mt-6">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 border-b border-gray-200 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-extrabold text-black text-sm leading-snug mb-0.5">{item.name}</p>
                      {item.note && <p className="text-[11px] text-gray-500">{item.note}</p>}
                    </div>
                    <p className="font-extrabold text-black text-sm text-right whitespace-nowrap">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {item.qty} x {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#FADCD9]">
                    <th className="py-4 px-4 font-extrabold text-black text-sm w-2/5 rounded-l-md">Produk</th>
                    <th className="py-4 px-4 font-extrabold text-black text-sm w-1/5 text-center">Harga</th>
                    <th className="py-4 px-4 font-extrabold text-black text-sm w-1/5 text-center">Jumlah</th>
                    <th className="py-4 px-4 font-extrabold text-black text-sm w-1/5 text-right rounded-r-md">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-6 px-4">
                        <p className="font-extrabold text-black text-sm mb-0.5">{item.name}</p>
                        <p className="text-[11px] text-gray-500">{item.note}</p>
                      </td>
                      <td className="py-6 px-4 text-center font-medium text-black text-sm">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-6 px-4 text-center font-medium text-black text-sm">
                        {item.qty}
                      </td>
                      <td className="py-6 px-4 text-right font-extrabold text-black text-sm">
                        {formatPrice(item.price * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end mb-16">
            <div className="w-full sm:w-80 flex flex-col space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-black font-medium text-sm">Subtotal</span>
                <span className="text-black font-extrabold text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-black font-medium text-sm">Pajak (10%)</span>
                <span className="text-black font-extrabold text-sm">{formatPrice(pajak)}</span>
              </div>
              
              <div className="border-t-2 border-gray-400 my-1"></div>
              
              <div className="flex justify-between items-center pt-2 px-4">
                <span className="text-black font-medium text-sm">Total<br/>dibayar</span>
                <span className="text-[#8B1A1A] font-extrabold text-base">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div>
            <p className="text-[11px] font-medium text-black">
              Note : semua transaksi yang ada di nota ini bersifat final
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}
