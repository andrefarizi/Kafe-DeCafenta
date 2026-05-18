'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Trash2, CheckCircle2, X } from 'lucide-react';
import {
  MejaData,
  updateTableStatus,
  deleteTable,
} from '@/src/controllers/table-controller';

type ModalState = 'none' | 'berhasil-hapus';

export default function ManajemenMejaClient({ tables }: { tables: MejaData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State lokal untuk optimistic update
  const [localTables, setLocalTables] = useState<MejaData[]>(tables);

  // Modal hapus
  const [hapusMeja, setHapusMeja] = useState<MejaData | null>(null);
  const [modalState, setModalState] = useState<ModalState>('none');
  const [errorMsg, setErrorMsg] = useState('');

  // Urutkan berdasarkan tableCode numerik
  const sorted = [...localTables].sort((a, b) =>
    a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
  );

  // Split berdasarkan isInLayout (tersimpan di DB)
  const grid = Array(12).fill(null);
  sorted.filter((m) => m.isInLayout).forEach((meja) => {
    const match = meja.tableCode.match(/\d+$/);
    const idx = match ? parseInt(match[0], 10) - 1 : -1;
    if (idx >= 0 && idx < 12 && !grid[idx]) grid[idx] = meja;
    else {
      const e = grid.findIndex(m => m === null);
      if (e !== -1) grid[e] = meja;
    }
  });
  const diDenah = grid;

  // Bagi denah ke 3 group sesuai Figma:
  // Kiri        : slot 0–5  → Meja 1–6
  // Kanan Atas  : slot 10–11 → Meja 11–12
  // Kanan Bawah : slot 6–9  → Meja 7–10
  const mejaLeft        = diDenah.slice(0, 6);
  const mejaBottomRight = diDenah.slice(6, 10);
  const mejaTopRight    = diDenah.slice(10, 12);

  // ── Toggle status meja ──────────────────────────────────────────
  const handleToggleStatus = (tableId: string, currentStatus: 'Tersedia' | 'Dipakai') => {
    const nextStatus: 'Tersedia' | 'Dipakai' =
      currentStatus === 'Tersedia' ? 'Dipakai' : 'Tersedia';

    // Optimistic update
    setLocalTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t))
    );

    startTransition(async () => {
      const result = await updateTableStatus(tableId, currentStatus);
      if (!result.success) {
        // Revert
        setLocalTables((prev) =>
          prev.map((t) => (t.id === tableId ? { ...t, status: currentStatus } : t))
        );
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
  const DenahCard = ({ meja }: { meja: MejaData }) => (
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
            {mejaLeft.map((meja, i) => (
              meja ? <DenahCard key={meja.id} meja={meja} /> : <div key={`el-${i}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center"><span className="text-xs text-gray-400 font-medium">Kosong</span></div>
            ))}
          </div>

          {/* Group Kanan Atas (MJ11–MJ12) */}
          <div className="absolute top-20 right-[5%] w-[38%] grid grid-cols-2 gap-x-6">
            {mejaTopRight.map((meja, i) => (
              meja ? <DenahCard key={meja.id} meja={meja} /> : <div key={`etr-${i}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center"><span className="text-xs text-gray-400 font-medium">Kosong</span></div>
            ))}
          </div>

          {/* Group Kanan Bawah (MJ07–MJ10) */}
          <div className="absolute top-[45%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
            {mejaBottomRight.map((meja, i) => (
              meja ? <DenahCard key={meja.id} meja={meja} /> : <div key={`ebr-${i}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center"><span className="text-xs text-gray-400 font-medium">Kosong</span></div>
            ))}
          </div>

        </div>
      </div>

      {/* ── SECTION 2: DAFTAR MEJA ── */}
      <div className="mt-8 border-[3px] border-[#8B1A1A] rounded-3xl p-6 md:p-8 bg-[#FAFAFA]">
        <h2 className="text-2xl font-extrabold text-[#8B1A1A] mb-8">Daftar Meja</h2>

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

    </div>
  );
}
