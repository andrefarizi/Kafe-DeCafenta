import React from 'react';
import { getDaftarPesanan } from '@/src/controllers/kasir-order-controller';
import PesananMasukClient from './PesananMasukClient';

export const dynamic = 'force-dynamic'; 

export default async function SemuaPesananPage() {
  const orders = await getDaftarPesanan(); 
  return <PesananMasukClient initialOrders={orders} activeTab="Semua" />;
}