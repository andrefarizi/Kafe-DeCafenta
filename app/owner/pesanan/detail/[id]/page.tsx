import React from 'react';
import { getKasirOrderDetail } from '@/src/controllers/kasir-order-controller';
import OwnerDetailPesananClient from './OwnerDetailPesananClient';

export const dynamic = 'force-dynamic';

export default async function OwnerDetailPesananPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  
  const orderData = await getKasirOrderDetail(orderId);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-black mb-2">Pesanan tidak ditemukan.</h1>
        <p className="text-gray-500">Mencari ID: {orderId}</p>
      </div>
    );
  }

  return <OwnerDetailPesananClient order={orderData} />;
}
