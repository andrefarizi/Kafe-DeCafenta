import React from 'react';
import { ChevronLeft, Printer } from 'lucide-react';

// --- Dummy Data ---
const invoiceData = {
  no: '#DCF001',
  tanggal: '8 Apr 2026 10 : 30',
  pelanggan: 'Andre Ganteng',
  metode: 'Gopay',
  tipe: 'Makan Ditempat',
  kasir: 'Wira Crypto',
  items: [
    { nama: 'Nasi Goreng', catatan: 'Jangan pedas', harga: 'Rp 20.000', jumlah: 1, total: 'Rp 20.000' },
    { nama: 'Nasi Goreng', catatan: 'Jangan pedas', harga: 'Rp 20.000', jumlah: 1, total: 'Rp 20.000' },
  ],
  subtotal: 'Rp 20.000',
  pajak: 'Rp 2.000',
  totalAkhir: 'Rp 22.000'
};

export default function InvoiceFullPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative pb-12">
      {/* Main Content Container */}
      <main className="pt-8 md:pt-12 px-4 md:px-10 max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button className="p-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm">
              <ChevronLeft size={24} className="text-[#8B1A1A]" />
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-black">Invoice</h1>
          </div>
          
          <button className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
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
              {/* Logo De Cafenta Custom */}
              <div className="flex flex-col items-center">
                <img 
                  src="/Group 2 1.png" 
                  alt="Logo D" 
                  className="w-12 h-14 object-contain mb-1" 
                />
                <span className="text-[10px] font-bold text-[#8B1A1A] text-center leading-tight">
                  DE CAFENTA<br/>
                  <span className="text-[7px] tracking-widest text-black font-medium">FOODS & DRINKS</span><br/>
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
            <div className="text-left md:text-right">
              <h2 className="text-3xl md:text-4xl font-black text-black mb-1">{invoiceData.no}</h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium">{invoiceData.tanggal}</p>
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="w-full border-b-2 border-dotted border-gray-300 mb-8"></div>

          {/* Customer Information Grid */}
          <div className="flex flex-col space-y-6 mb-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">NAMA PELANGGAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{invoiceData.pelanggan}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">METODE<br className="hidden sm:block"/>PEMBAYARAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{invoiceData.metode}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">TIPE PESANAN</span>
              <span className="font-medium text-black text-sm sm:text-right">{invoiceData.tipe}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-extrabold text-black text-sm">KASIR</span>
              <span className="font-medium text-black text-sm sm:text-right">{invoiceData.kasir}</span>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="mb-12 overflow-x-auto">
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
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-6 px-4">
                      <p className="font-extrabold text-black text-sm mb-0.5">{item.nama}</p>
                      <p className="text-[11px] text-gray-500">Catatan: {item.catatan}</p>
                    </td>
                    <td className="py-6 px-4 text-center font-medium text-black text-sm">{item.harga}</td>
                    <td className="py-6 px-4 text-center font-medium text-black text-sm">{item.jumlah}</td>
                    <td className="py-6 px-4 text-right font-extrabold text-black text-sm">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end mb-16">
            <div className="w-full sm:w-80 flex flex-col space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-black font-medium text-sm">Subtotal</span>
                <span className="text-black font-extrabold text-sm">{invoiceData.subtotal}</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-black font-medium text-sm">Pajak</span>
                <span className="text-black font-extrabold text-sm">{invoiceData.pajak}</span>
              </div>
              
              <div className="border-t-2 border-gray-400 my-1"></div>
              
              <div className="flex justify-between items-center pt-2 px-4">
                <span className="text-black font-medium text-sm">Total<br/>dibayar</span>
                <span className="text-[#8B1A1A] font-extrabold text-base">{invoiceData.totalAkhir}</span>
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