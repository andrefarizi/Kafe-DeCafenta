'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, Power, ChevronLeft, ChevronRight, X, Plus, Loader2 } from 'lucide-react';
import { StaffKasirData, toggleStaffStatus, addStaffKasir } from '@/src/controllers/staff-controller';
import toast from 'react-hot-toast';

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

  React.useEffect(() => {
    setLocalList(staffList);
  }, [staffList]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, staffId: string, currentStatus: 'Aktif' | 'Nonaktif' | null, staffName: string}>({
    isOpen: false,
    staffId: '',
    currentStatus: null,
    staffName: ''
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newKasir, setNewKasir] = useState({
    nama: '',
    email: '',
    telepon: '',
    staffNumber: ''
  });
  const [formErrors, setFormErrors] = useState({
    nama: '',
    email: '',
    telepon: '',
    staffNumber: '',
    general: ''
  });

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
  const handleToggleClick = (staffId: string, currentStatus: 'Aktif' | 'Nonaktif', staffName: string) => {
    setConfirmModal({
      isOpen: true,
      staffId,
      currentStatus,
      staffName
    });
  };

  const handleConfirmToggle = () => {
    const { staffId, currentStatus } = confirmModal;
    if (!currentStatus) return;

    const nextStatus: 'Aktif' | 'Nonaktif' = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';

    setConfirmModal(prev => ({ ...prev, isOpen: false }));

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

  const handleAddKasir = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({ nama: '', email: '', telepon: '', staffNumber: '', general: '' });

    let hasError = false;
    const errors = { nama: '', email: '', telepon: '', staffNumber: '', general: '' };

    if (!newKasir.nama.trim()) {
      errors.nama = 'Nama wajib diisi.';
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newKasir.email.trim()) {
      errors.email = 'Email wajib diisi.';
      hasError = true;
    } else if (!emailRegex.test(newKasir.email)) {
      errors.email = 'Format email tidak valid.';
      hasError = true;
    }

    if (newKasir.telepon) {
      const phoneRegex = /^(08|628)[0-9]{7,13}$/;
      if (!phoneRegex.test(newKasir.telepon)) {
        errors.telepon = 'Nomor telepon harus valid (diawali 08 atau 628, minimal 9 digit angka).';
        hasError = true;
      }
    }

    if (!newKasir.staffNumber.trim()) {
      errors.staffNumber = 'ID Staff wajib diisi.';
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    setIsAdding(true);
    const res = await addStaffKasir(newKasir);
    setIsAdding(false);
    
    if (res.success) {
      toast.success(res.message);
      setAddModalOpen(false);
      setNewKasir({ nama: '', email: '', telepon: '', staffNumber: '' });
      setFormErrors({ nama: '', email: '', telepon: '', staffNumber: '', general: '' });
      router.refresh();
    } else {
      if (res.message.includes('Email')) {
        setFormErrors(prev => ({ ...prev, email: res.message }));
      } else if (res.message.includes('telepon')) {
        setFormErrors(prev => ({ ...prev, telepon: res.message }));
      } else if (res.message.includes('ID Staff')) {
        setFormErrors(prev => ({ ...prev, staffNumber: res.message }));
      } else {
        setFormErrors(prev => ({ ...prev, general: res.message }));
      }
    }
  };

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
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-black">
              Semua Staff
              <span className="ml-2 text-sm font-normal text-gray-400">({total} kasir)</span>
            </h2>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#8B1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-900 transition-colors"
            >
              <Plus size={16} /> Tambah Staff
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
                name="q"
                type="text"
                defaultValue={currentSearch}
                placeholder="Cari nama / email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A] focus:outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-between w-full sm:w-56 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <span>
                  Filter : <span className="font-bold text-black">{currentStatus}</span>
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
                <th className="pb-4 font-medium text-gray-400 text-sm">Nama Staff</th>
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
                          onClick={() => handleToggleClick(staff.id, staff.status, staff.nama)}
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

      {/* Modal Konfirmasi */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-xl font-black mb-2">Konfirmasi</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Apakah Anda yakin ingin {confirmModal.currentStatus === 'Aktif' ? 'menonaktifkan' : 'mengaktifkan'} staff <strong>{confirmModal.staffName}</strong>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmToggle}
                className="flex-1 bg-[#8B1A1A] text-white py-3 rounded-2xl font-bold text-sm hover:bg-red-900 transition shadow-lg"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Kasir */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black mb-4">Tambah Kasir Baru</h3>
            
            {formErrors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-200">
                {formErrors.general}
              </div>
            )}

            <form onSubmit={handleAddKasir} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  required
                  value={newKasir.nama}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[^a-zA-Z\s']/.test(val)) {
                      setFormErrors(prev => ({ ...prev, nama: 'Nama hanya boleh berisi huruf.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, nama: '' }));
                    }
                    setNewKasir({ ...newKasir, nama: val });
                  }}
                  className={`w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 ${
                    formErrors.nama ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8B1A1A]'
                  }`}
                  placeholder="Nama Kasir"
                />
                {formErrors.nama && <p className="text-xs text-red-500 font-bold mt-1">{formErrors.nama}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newKasir.email}
                  onChange={(e) => {
                    setNewKasir({ ...newKasir, email: e.target.value });
                    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 ${
                    formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8B1A1A]'
                  }`}
                  placeholder="email@example.com"
                />
                {formErrors.email && <p className="text-xs text-red-500 font-bold mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={newKasir.telepon}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[^0-9]/.test(val)) {
                      setFormErrors(prev => ({ ...prev, telepon: 'Nomor telepon hanya boleh angka.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, telepon: '' }));
                    }
                    setNewKasir({ ...newKasir, telepon: val });
                  }}
                  className={`w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 ${
                    formErrors.telepon ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8B1A1A]'
                  }`}
                  placeholder="081234567890"
                />
                {formErrors.telepon && <p className="text-xs text-red-500 font-bold mt-1">{formErrors.telepon}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ID Staff (Staff Number)</label>
                <input
                  type="text"
                  required
                  value={newKasir.staffNumber}
                  onChange={(e) => {
                    setNewKasir({ ...newKasir, staffNumber: e.target.value });
                    if (formErrors.staffNumber) setFormErrors(prev => ({ ...prev, staffNumber: '' }));
                  }}
                  className={`w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 ${
                    formErrors.staffNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8B1A1A]'
                  }`}
                  placeholder="STF-001"
                />
                {formErrors.staffNumber && <p className="text-xs text-red-500 font-bold mt-1">{formErrors.staffNumber}</p>}
              </div>
              <p className="text-xs text-gray-500 italic mt-2">Password default akan diatur ke: Kasir123!</p>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    setFormErrors({ nama: '', email: '', telepon: '', staffNumber: '', general: '' });
                  }}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
                  disabled={isAdding}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#8B1A1A] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-900 transition shadow-md disabled:opacity-70"
                >
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : null}
                  Simpan Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
