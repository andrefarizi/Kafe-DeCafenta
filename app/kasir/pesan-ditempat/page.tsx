import React from 'react';
import { getMenuCatalog } from '@/src/controllers/menu-controller';
import FormKasirClient from './FormKasirClient'; // Kita akan buat file ini di langkah 2

export const dynamic = 'force-dynamic'; // Pastikan data selalu fresh

export default async function PesanDitempatPage() {
  // 1. Ambil data dengan aman di sisi Server
  const menuCatalog = await getMenuCatalog();

  // 2. Oper datanya ke komponen Client (UI)
  return <FormKasirClient initialMenus={menuCatalog} />;
}