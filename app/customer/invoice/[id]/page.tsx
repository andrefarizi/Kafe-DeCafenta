import React from 'react';
import { getKasirOrderDetail } from '@/src/controllers/kasir-order-controller';
import InvoiceClient from '@/app/_components/InvoiceClient';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CustomerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await getKasirOrderDetail(orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans text-gray-800">
        <Sidebar activeMenu="pesanan" />
        <main className="w-full sm:flex-1 flex flex-col min-h-screen relative">
          <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
            <Topbar />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold text-black mb-2">Invoice tidak ditemukan.</h1>
            <p className="text-gray-500 mb-6">Pesanan dengan ID: {orderId} tidak ada.</p>
            <Link href="/customer/Pesanan" className="bg-[#8B0000] text-white px-6 py-2 rounded-lg font-bold">
              Kembali ke Pesanan
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Bungkus InvoiceClient dengan layout Customer (Sidebar & Topbar) jika diperlukan,
  // Atau karena InvoiceClient full page, kita bisa gunakan InvoiceClient aja langsung?
  // Tapi InvoiceClient tidak ada Sidebar, jadi mari kita gabungkan:
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <div className="no-print hidden sm:block">
        <Sidebar activeMenu="pesanan" />
      </div>

      <main className="w-full sm:flex-1 flex flex-col min-h-screen relative">
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA] no-print">
          <Topbar />
        </div>
        
        {/* InvoiceClient merender konten invoice secara penuh */}
        <div className="flex-1 overflow-y-auto">
          <InvoiceClient order={order} backHref={`/customer/detail_pesanan/cash?orderId=${orderId}`} />
        </div>
      </main>
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
