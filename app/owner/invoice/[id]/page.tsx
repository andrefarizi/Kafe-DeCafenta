import React from 'react';
import { getKasirOrderDetail } from '@/src/controllers/kasir-order-controller';
import InvoiceClient from '@/app/_components/InvoiceClient';

export const dynamic = 'force-dynamic';

export default async function OwnerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await getKasirOrderDetail(orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-black mb-2">Invoice tidak ditemukan.</h1>
        <p className="text-gray-500">Pesanan dengan ID: {orderId} tidak ada.</p>
      </div>
    );
  }

  return <InvoiceClient order={order} backHref={`/owner/pesanan/detail/${orderId}`} />;
}
