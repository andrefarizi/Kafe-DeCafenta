import React from 'react';
import { getTableList } from '@/src/controllers/table-controller';
import KelolaMejaClient from './KelolaMejaClient';

// Selalu fetch data terbaru dari database
export const dynamic = 'force-dynamic';

export default async function ManajemenMejaPage() {
  // Ambil data meja real dari database
  const tables = await getTableList();

  // Teruskan ke Client Component untuk interaktivitas
  return <KelolaMejaClient tables={tables} />;
}