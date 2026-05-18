'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Trash2, CheckCircle2, X } from 'lucide-react';
import {
  MejaData,
  updateTableStatus,
  deleteTable,
  createTable,
} from '@/src/controllers/table-controller';

type ModalState = 'none' | 'berhasil-hapus' | 'tambah-meja' | 'berhasil-tambah' | 'konfirmasi-status';

export default function ManajemenMejaClient({ tables }: { tables: MejaData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State lokal untuk optimistic update
  const [localTables, setLocalTables] = useState<MejaData[]>(tables);

  // Modal states
  const [hapusMeja, setHapusMeja] = useState<MejaData | null>(null);
  const [statusMeja, setStatusMeja] = useState<{ id: string; status: 'Tersedia' | 'Dipakai' } | null>(null);
  const [modalState, setModalState] = useState<ModalState>('none');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Tambah Meja state
  const [newMejaName, setNewMejaName] = useState('');
  const [newMejaCode, setNewMejaCode] = useState('');

  // Urutkan berdasarkan tableCode numerik
  const sorted = [...localTables].sort((a, b) =>
    a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
  );

  // Split berdasarkan isInLayout (tersimpan di DB)
  const diDenah = sorted.filter((m) => m.isInLayout);

  // Bagi denah ke 3 group sesuai Figma:
  // Kiri        : slot 0–5  → Meja 1–6
  // Kanan Bawah : slot 6–9  → Meja 7–10
  // Kanan Atas  : slot 10–11 → Meja 11–12
  
  const layoutSlots = Array(12).fill(null);
  diDenah.forEach((meja, idx) => {
    if (idx < 12) layoutSlots[idx] = meja;
  });

  const mejaLeft        = layoutSlots.slice(0, 6);
  const mejaBottomRight = layoutSlots.slice(6, 10);
  const mejaTopRight    = layoutSlots.slice(10, 12);

  // ── Toggle status meja ──────────────────────────────────────────
  const handleToggleStatus = (tableId: string, currentStatus: 'Tersedia' | 'Dipakai') => {
    setStatusMeja({ id: tableId, status: currentStatus });
    setModalState('konfirmasi-status');
  };

  const confirmToggleStatus = () => {
    if (!statusMeja) return;
    const { id, status } = statusMeja;
    const nextStatus: 'Tersedia' | 'Dipakai' = status === 'Tersedia' ? 'Dipakai' : 'Tersedia';

    // Optimistic update
    setLocalTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    setModalState('none');
    setStatusMeja(null);

    startTransition(async () => {
      const result = await updateTableStatus(id, status);
      if (!result.success) {
        // Revert
        setLocalTables((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: status } : t))
        );
        setErrorMsg(result.message);
      }
    });
  };

  // ── Tambah meja ─────────────────────────────────────────────────
  const handleTambahMeja = () => {
    setErrorMsg('');
    if (!newMejaName || !newMejaCode) {
      setErrorMsg('Nama dan Kode meja wajib diisi.');
      return;
    }

    startTransition(async () => {
      const result = await createTable(newMejaName, newMejaCode);
      if (result.success && result.table) {
        setLocalTables((prev) => [...prev, result.table!]);
        setModalState('berhasil-tambah');
        setNewMejaName('');
        setNewMejaCode('');
      } else {
        setErrorMsg(result.message);
      }
    });
  };

  // ── Hapus meja ──────────────────────────────────────────────────
  const handleHapus = () => {
    if (!hapusMeja) return;
    setErrorMsg('');

    startTransition(async () => {
      const result = await deleteTable(hapusMeja.id);
      if (result.success) {
        setLocalTables((prev) => prev.filter((t) => t.id !== hapusMeja.id));
        setHapusMeja(null);
        setModalState('berhasil-hapus');
      } else {
        setErrorMsg(result.message);
      }
    });
  };

  // ── Kartu di dalam Denah ─────────────────────────────────────────
  const DenahCard = ({ meja, index }: { meja: MejaData | null, index?: number }) => {
    if (!meja) {
      return (
        <div className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center h-28 bg-gray-50">
          <p className="text-[10px] text-gray-400 font-medium">Slot Kosong</p>
        </div>
      );
    }
    
    return (
      <div className="relative border border-[#8B1A1A] rounded-xl p-3 flex flex-col justify-between h-28 bg-white shadow-sm">
        {/* Badge Status */}
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-bold tracking-wide ${
            meja.status === 'Tersedia'
              ? 'bg-[#22C55E] text-white'
              : 'bg-[#FFC700] text-[#8B1A1A]'
          }`}
        >
          {meja.status}
        </div>

        <div>
          <p className="font-extrabold text-sm text-black">{meja.name}</p>
          <p className="text-[10px] text-[#8B1A1A] font-bold mt-0.5">#{meja.tableCode}</p>
        </div>

        <div className="flex justify-center mt-auto">
          <button
            onClick={() => handleToggleStatus(meja.id, meja.status)}
            disabled={isPending}
            className={`text-[8px] font-bold py-1.5 px-3 rounded-md w-full transition-colors disabled:opacity-60 ${
              meja.status === 'Tersedia'
                ? 'bg-[#8B1A1A] text-white hover:bg-red-900'
                : 'bg-white border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50'
            }`}
          >
            Ubah Status - {meja.status === 'Tersedia' ? 'Dipakai' : 'Tersedia'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black">Manajemen Meja</h1>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-300 rounded-lg px-4 py-3">
          <p className="text-sm font-bold text-red-700">{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <p className="text-xs font-bold text-[#8B1A1A] animate-pulse mb-2">Menyimpan...</p>
      )}

      {/* ── SECTION 1: DENAH MEJA ── */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[800px] h-[650px] relative border-[3px] border-[#8B1A1A] rounded-2xl bg-white mt-2">

          {/* Tab Kuning – Denah Meja */}
          <div className="absolute -top-[3px] left-8 bg-[#FFC700] px-8 py-2.5 rounded-b-xl text-black font-extrabold z-10 text-sm">
            Denah Meja
          </div>

          {/* Button Atur Tata Letak */}
          <Link
            href="/owner/meja/tata-letak"
            className="absolute top-4 right-4 flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 shadow-sm"
          >
            <LayoutGrid size={14} />
            <span>Atur Tata Letak</span>
          </Link>

          {/* Label Pintu Masuk */}
          <div className="absolute -bottom-[3px] left-[20%] transform translate-y-1/2 bg-white px-6 py-1.5 border-[3px] border-[#8B1A1A] rounded-lg text-[#8B1A1A] font-extrabold text-[11px] z-10">
            Pintu Masuk
          </div>

          {/* Sekat Ruangan – Vertikal */}
          <div className="absolute top-0 bottom-[64%] left-[48%] w-[3px] bg-[#8B1A1A] z-0" />
          {/* Sekat Ruangan – Horizontal */}
          <div className="absolute top-[35%] left-[60%] right-0 h-[3px] bg-[#8B1A1A] z-0" />

          {/* Group Kiri (Meja 1–6) */}
          <div className="absolute top-20 left-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {mejaLeft.map((meja, idx) => (
              <DenahCard key={meja ? meja.id : `empty-l-${idx}`} meja={meja} index={idx} />
            ))}
          </div>

          {/* Group Kanan Atas (MJ11–MJ12) */}
          <div className="absolute top-20 right-[5%] w-[38%] grid grid-cols-2 gap-x-6">
            {mejaTopRight.map((meja, idx) => (
              <DenahCard key={meja ? meja.id : `empty-tr-${idx}`} meja={meja} index={idx} />
            ))}
          </div>

          {/* Group Kanan Bawah (MJ07–MJ10) */}
          <div className="absolute top-[45%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {mejaBottomRight.map((meja, idx) => (
              <DenahCard key={meja ? meja.id : `empty-br-${idx}`} meja={meja} index={idx} />
            ))}
          </div>

        </div>
      </div>

      {/* ── SECTION 2: DAFTAR MEJA ── */}
      <div className="mt-8 border-[3px] border-[#8B1A1A] rounded-3xl p-6 md:p-8 bg-[#FAFAFA]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-[#8B1A1A]">Daftar Meja</h2>
          <button
            onClick={() => { setModalState('tambah-meja'); setErrorMsg(''); }}
            className="bg-[#8B1A1A] hover:bg-red-900 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
          >
            + Tambah Meja
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            Belum ada data meja.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map((meja) => (
              <div
                key={`daftar-${meja.id}`}
                className="border border-[#8B1A1A] rounded-xl p-5 flex flex-col justify-between h-36 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <p className="font-extrabold text-lg text-black">{meja.name}</p>
                  <p className="text-xs text-[#8B1A1A] font-bold mt-1">#{meja.tableCode}</p>
                </div>

                <div className="flex justify-end items-end w-full">
                  <button
                    onClick={() => { setHapusMeja(meja); setErrorMsg(''); }}
                    className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2 px-5 rounded-md transition-colors w-fit"
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                    <span>Hapus Meja</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ MODAL HAPUS MEJA ══ */}
      {hapusMeja && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans"
          onClick={(e) => { if (e.target === e.currentTarget) setHapusMeja(null); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">

            {/* Warning Icon */}
            <div className="w-20 h-20 bg-[#FF4C4C] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-[40px] font-black leading-none mt-1">!</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-2">
              Yakin Ingin <br /> Menghapus Meja?
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-6">
              {hapusMeja.name} · #{hapusMeja.tableCode}
            </p>

            {/* Error saat hapus */}
            {errorMsg && (
              <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 w-full text-left">
                {errorMsg}
              </p>
            )}

            <div className="w-full flex flex-col space-y-4">
              <button
                onClick={handleHapus}
                disabled={isPending}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isPending ? 'Menghapus...' : 'Lanjutkan'}
              </button>
              <button
                onClick={() => { setHapusMeja(null); setErrorMsg(''); }}
                disabled={isPending}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL BERHASIL DIHAPUS ══ */}
      {modalState === 'berhasil-hapus' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl">

            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <CheckCircle2 size={72} className="text-[#22C55E]" strokeWidth={1.5} />
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
              Meja Berhasil <br /> Dihapus
            </h2>

            <button
              onClick={() => { setModalState('none'); router.refresh(); }}
              className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}
      {/* ══ MODAL KONFIRMASI STATUS ══ */}
      {modalState === 'konfirmasi-status' && statusMeja && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans"
          onClick={(e) => { if (e.target === e.currentTarget) setModalState('none'); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-2">
              Ubah Status Meja?
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-6">
              Status meja akan diubah menjadi <span className="font-bold text-black">{statusMeja.status === 'Tersedia' ? 'Dipakai' : 'Tersedia'}</span>.
            </p>

            <div className="w-full flex flex-col space-y-4">
              <button
                onClick={confirmToggleStatus}
                disabled={isPending}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isPending ? 'Menyimpan...' : 'Ya, Ubah'}
              </button>
              <button
                onClick={() => setModalState('none')}
                disabled={isPending}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL TAMBAH MEJA ══ */}
      {modalState === 'tambah-meja' && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans"
          onClick={(e) => { if (e.target === e.currentTarget) setModalState('none'); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center shadow-2xl relative">
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-4">
              Tambah Meja Baru
            </h2>

            {errorMsg && (
              <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 w-full text-left">
                {errorMsg}
              </p>
            )}

            <div className="w-full mb-4 text-left">
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Meja</label>
              <input
                type="text"
                placeholder="Misal: Meja 1"
                value={newMejaName}
                onChange={(e) => setNewMejaName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-[#8B1A1A] outline-none"
              />
            </div>
            
            <div className="w-full mb-6 text-left">
              <label className="block text-xs font-bold text-gray-700 mb-1">Kode Meja</label>
              <input
                type="text"
                placeholder="Misal: TBL-01"
                value={newMejaCode}
                onChange={(e) => setNewMejaCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-[#8B1A1A] outline-none"
              />
            </div>

            <div className="w-full flex flex-col space-y-4">
              <button
                onClick={handleTambahMeja}
                disabled={isPending}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isPending ? 'Menyimpan...' : 'Simpan Meja'}
              </button>
              <button
                onClick={() => setModalState('none')}
                disabled={isPending}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL BERHASIL TAMBAH MEJA ══ */}
      {modalState === 'berhasil-tambah' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <CheckCircle2 size={72} className="text-[#22C55E]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
              Meja Berhasil <br /> Ditambahkan
            </h2>
            <button
              onClick={() => { setModalState('none'); router.refresh(); }}
              className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
