import React from 'react';
import { getStaffKasirList } from '@/src/controllers/staff-controller';
import DataStaffClient from './DataStaffClient';

export const dynamic = 'force-dynamic';

type SearchParams = { search?: string; status?: string; page?: string };

export default async function DaftarStaffKasirPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params: SearchParams = await (searchParams ?? Promise.resolve<SearchParams>({}));
  const search = params.search ?? '';
  const filterStatus =
    params.status === 'Aktif'
      ? 'Aktif'
      : params.status === 'Nonaktif'
      ? 'Nonaktif'
      : 'Semua';
  const page = Number(params.page ?? 1);

  const { data, total, totalPages } = await getStaffKasirList({
    search,
    filterStatus: filterStatus as 'Aktif' | 'Nonaktif' | 'Semua',
    page,
    perPage: 8,
  });

  return (
    <DataStaffClient
      staffList={data}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      currentSearch={search}
      currentStatus={filterStatus}
    />
  );
}