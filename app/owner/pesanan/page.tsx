import React from 'react';
import { getDaftarPesanan } from '@/src/controllers/kasir-order-controller';
import OwnerPesananClient from './OwnerPesananClient';

export const dynamic = 'force-dynamic';

export default async function OwnerPesananPage() {
  const orders = await getDaftarPesanan();
  return <OwnerPesananClient initialOrders={orders} />;
}
