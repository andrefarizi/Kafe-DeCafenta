import React from 'react';
import { getTableList } from '@/src/controllers/table-controller';
import ManajemenMejaClient from './ManajemenMejaClient';

// Selalu fetch data terbaru dari database
export const dynamic = 'force-dynamic';

export default async function ManajemenMejaPage() {
  const tables = await getTableList();
  return <ManajemenMejaClient tables={tables} />;
}