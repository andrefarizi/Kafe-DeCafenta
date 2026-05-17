'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, Power, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { StaffKasirData, toggleStaffStatus } from '@/src/controllers/staff-controller';

interface Props {
  staffList: StaffKasirData[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentStatus: string;
}

export default function DataStaffClient({
  staffList,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  const [isPending, startTransition] = useTransition();

  // Optimistic state
  const [localList, setLocalList] = useState<StaffKasirData[]>(staffList);
  const [filterOpen, setFilterOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Update URL search params ─────────────────────────────────────
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // ── Toggle Status Kasir ──────────────────────────────────────────
  const handleToggle = (staffId: string, currentStatus: 'Aktif' | 'Nonaktif') => {
    const nextStatus: 'Aktif' | 'Nonaktif' =
      currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';

    // Optimistic update
    setLocalList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status: nextStatus } : s))
    );

    startTransition(async () => {
      const result = await toggleStaffStatus(staffId);
      if (!result.success) {
        // Revert
        setLocalList((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, status: currentStatus } : s))
        );
        setErrorMsg(result.message);
      }
    });
  };

  // ── Pagination helpers ───────────────────────────────────────────
  const goToPage = (p: number) => updateParams({ page: String(p) });

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  const statusOptions: Array<'Semua' | 'Aktif' | 'Nonaktif'> = ['Semua', 'Aktif', 'Nonaktif'];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900">

      {/* Page Title */}
      <h1 className="text-3xl font-extrabold mb-8 text-black">Daftar Staff Kasir</h1>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-300 rounded-lg px-4 py-3">
          <p className="text-sm font-bold text-red-700">{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-xl font-bold text-black">
            Semua Staff
            <span className="ml-2 text-sm font-normal text-gray-400">({total} kasir)</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                updateParams({ search: val, page: '1' });
              }}
              className="relative w-full sm:w-64"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                name="q"
                type="text"
                defaultValue={currentSearch}
                placeholder="Cari nama / email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A] focus:outline-none"
              />
            </form>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-between w-full sm:w-56 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <span>
                  Urutkan berdasarkan :{' '}
                  <span className="font-bold text-black">{currentStatus}</span>
                </span>
                <ChevronDown size={14} className="text-black" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        updateParams({ status: opt === 'Semua' ? '' : opt, page: '1' });
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-red-50 hover:text-[#8B1A1A] ${
                        currentStatus === opt ? 'bg-red-50 text-[#8B1A1A] font-bold' : 'text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isPending && (
          <p className="text-xs font-bold text-[#8B1A1A] animate-pulse mb-2">Menyimpan...</p>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-4 font-medium text-gray-400 text-sm">Nama Staff Kasir</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Email</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">No Telepon</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Status Kerja</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {localList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    Tidak ada data staff kasir ditemukan.
                  </td>
                </tr>
              ) : (
                localList.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 font-medium text-sm text-black">{staff.nama}</td>
                    <td className="py-4 text-sm text-black text-center">{staff.email}</td>
                    <td className="py-4 font-medium text-sm text-black text-center">{staff.telepon}</td>

                    {/* Status Badge */}
                    <td className="py-4 text-center">
                      <span
                        className={`inline-block px-4 py-1 rounded-md text-xs font-bold w-24 ${
                          staff.status === 'Aktif'
                            ? 'bg-[#A7F3D0] text-[#047857]'
                            : 'bg-[#FECACA] text-[#B91C1C]'
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggle(staff.id, staff.status)}
                          disabled={isPending}
                          className={`flex items-center justify-center space-x-2 w-32 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-60 ${
                            staff.status === 'Aktif'
                              ? 'bg-[#8B1A1A] text-white hover:bg-red-900'
                              : 'bg-white text-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-50'
                          }`}
                        >
                          <Power size={14} />
                          <span>{staff.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Previous Arrow */}
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Awal */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-1.5 bg-gray-50 rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              Awal
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm transition-colors ${
                  p === currentPage
                    ? 'bg-[#8B1A1A] text-white'
                    : 'text-[#8B1A1A] hover:bg-red-50'
                }`}
              >
                {p}
              </button>
            ))}

            {totalPages > pageNumbers[pageNumbers.length - 1] && (
              <span className="w-8 h-8 flex items-center justify-center text-[#8B1A1A] font-bold">
                ...
              </span>
            )}

            {/* Akhir */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 bg-gray-50 rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              Akhir
            </button>

            {/* Next Arrow */}
            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
