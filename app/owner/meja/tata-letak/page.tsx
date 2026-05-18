'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { MinusCircle, Plus, CheckCircle2 } from 'lucide-react';
import { getTableList, saveTataLetakMeja, MejaData } from '@/src/controllers/table-controller';

export default function TataLetakMejaPage() {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Meja yang ada di denah (max 12 sesuai Figma), null artinya slot kosong
  const [diDenah, setDiDenah] = useState<(MejaData | null)[]>(Array(12).fill(null));
  // Meja yang belum digunakan / belum masuk denah
  const [belumDigunakan, setBelumDigunakan] = useState<MejaData[]>([]);

  // ── Load data dari DB ─────────────────────────────────────────────
  useEffect(() => {
    getTableList().then((tables) => {
      const sorted = [...tables].sort((a, b) =>
        a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
      );
      
      const inLayout = sorted.filter((m) => m.isInLayout);
      const grid = Array(12).fill(null);
      
      inLayout.forEach((meja) => {
        const match = meja.tableCode.match(/\d+$/);
        const idx = match ? parseInt(match[0], 10) - 1 : -1;
        if (idx >= 0 && idx < 12 && !grid[idx]) {
          grid[idx] = meja;
        } else {
          // Fallback if slot taken or invalid id
          const emptyIdx = grid.findIndex(m => m === null);
          if (emptyIdx !== -1) grid[emptyIdx] = meja;
        }
      });

      setDiDenah(grid);
      setBelumDigunakan(sorted.filter((m) => !m.isInLayout));
      setLoading(false);
    });
  }, []);

  // ── Keluarkan meja dari denah → belum digunakan ──────────────────
  const handleKeluarkan = (meja: MejaData, slotIndex: number) => {
    const newGrid = [...diDenah];
    newGrid[slotIndex] = null;
    setDiDenah(newGrid);
    setBelumDigunakan((prev) =>
      [...prev, meja].sort((a, b) =>
        a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
      )
    );
  };

  // ── Tambahkan meja dari belum digunakan → denah ──────────────────
  const handleTambahkan = (meja: MejaData) => {
    const emptyIndex = diDenah.findIndex(m => m === null);
    if (emptyIndex === -1) return; // penuh

    const newGrid = [...diDenah];
    newGrid[emptyIndex] = meja;
    setDiDenah(newGrid);

    setBelumDigunakan((prev) => prev.filter((m) => m.id !== meja.id));
  };

  // ── Simpan Tata Letak ────────────────────────────────────────────
  const handleSimpan = () => {
    setErrorMsg('');
    startTransition(async () => {
      const activeIds = diDenah.filter((m) => m !== null).map((m) => m!.id);
      const result = await saveTataLetakMeja(activeIds);
      if (result.success) {
        setShowModal(true);
      } else {
        setErrorMsg(result.message);
      }
    });
  };

  // ── Bagi denah menjadi 3 group (sesuai Figma) ───────────────────
  // Kiri         : slot 0–5  (3 baris × 2 kolom) → Meja 1–6
  // Kanan Atas   : slot 10–11 (1 baris × 2 kolom) → Meja 11–12
  // Kanan Bawah  : slot 6–9  (2 baris × 2 kolom) → Meja 7–10
  const mejaLeft        = diDenah.slice(0, 6);
  const mejaTopRight    = diDenah.slice(10, 12);
  const mejaBottomRight = diDenah.slice(6, 10);

  // ── Kartu meja di dalam denah ────────────────────────────────────
  const DenahCard = ({ meja, slotIndex }: { meja: MejaData, slotIndex: number }) => (
    <div className="border border-[#8B1A1A] rounded-xl p-3 flex flex-col justify-between h-28 bg-white shadow-sm">
      <div>
        <p className="font-extrabold text-sm text-black">{meja.name}</p>
        <p className="text-[10px] text-[#8B1A1A] font-bold mt-0.5">#{meja.tableCode}</p>
      </div>
      <div className="flex justify-end mt-auto">
        <button
          onClick={() => handleKeluarkan(meja, slotIndex)}
          className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[9px] font-bold py-1.5 px-3 rounded-md transition-colors"
        >
          <MinusCircle size={10} strokeWidth={2.5} />
          <span>Keluarkan Meja</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#8B1A1A] font-bold animate-pulse">Memuat data meja...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#8B1A1A] mb-1">Tata Letak Meja</h1>
        <p className="text-xs font-bold text-black">Geser meja yang diinginkan untuk mengatur posisi meja</p>
      </div>

      {/* ── SECTION 1: CANVAS DENAH MEJA ── */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-[800px] h-[650px] relative border-[3px] border-[#8B1A1A] rounded-2xl bg-white mt-2 shadow-sm">

          {/* Label Pintu Masuk */}
          <div className="absolute -bottom-[15px] left-[20%] transform -translate-x-1/2 bg-white px-8 py-1.5 border-[3px] border-[#8B1A1A] rounded-lg text-[#8B1A1A] font-extrabold text-xs z-10">
            Pintu Masuk
          </div>

          {/* Sekat Vertikal (dari atas sampai 30% bawah, di tengah kiri) */}
          <div className="absolute top-0 bottom-[30%] left-[48%] w-[4px] bg-[#8B1A1A] z-0" />
          {/* Sekat Horizontal (dari tengah ke kanan) */}
          <div className="absolute top-[32%] left-[58%] right-0 h-[4px] bg-[#8B1A1A] z-0" />

          {/* ── Group Kiri: Meja 1–6 (3 baris × 2 kolom) ── */}
          <div className="absolute top-12 left-[5%] w-[40%] grid grid-cols-2 gap-x-6 gap-y-12 z-10">
            {mejaLeft.map((meja, idx) => (
              meja ? <DenahCard key={meja.id} meja={meja} slotIndex={idx} /> : (
                <div key={`placeholder-left-${idx}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center">
                  <p className="text-[10px] text-gray-400 font-medium">Slot Kosong</p>
                </div>
              )
            ))}
          </div>

          {/* ── Group Kanan Atas: Meja 11–12 (1 baris × 2 kolom) ── */}
          <div className="absolute top-12 right-[5%] w-[38%] grid grid-cols-2 gap-x-6 z-10">
            {mejaTopRight.map((meja, idx) => (
              meja ? <DenahCard key={meja.id} meja={meja} slotIndex={10 + idx} /> : (
                <div key={`placeholder-tr-${idx}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center">
                  <p className="text-[10px] text-gray-400 font-medium">Slot Kosong</p>
                </div>
              )
            ))}
          </div>

          {/* ── Group Kanan Bawah: Meja 7–10 (2 baris × 2 kolom) ── */}
          <div className="absolute top-[42%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12 z-10">
            {mejaBottomRight.map((meja, idx) => (
              meja ? <DenahCard key={meja.id} meja={meja} slotIndex={6 + idx} /> : (
                <div key={`placeholder-br-${idx}`} className="border-2 border-dashed border-gray-300 rounded-xl h-28 bg-gray-50 flex items-center justify-center">
                  <p className="text-[10px] text-gray-400 font-medium">Slot Kosong</p>
                </div>
              )
            ))}
          </div>

        </div>
      </div>

      {/* ── SECTION 2: DAFTAR MEJA BELUM DIGUNAKAN ── */}
      <div className="border-[3px] border-[#8B1A1A] rounded-2xl p-6 bg-[#FAFAFA] mb-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-black mb-6">Daftar Meja Belum Digunakan</h2>

        {belumDigunakan.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Semua meja sudah ditempatkan di denah.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {belumDigunakan.map((meja) => (
              <div
                key={`unused-${meja.id}`}
                className="border border-[#8B1A1A] rounded-xl p-4 flex flex-col justify-between h-28 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <p className="font-extrabold text-base text-black">{meja.name}</p>
                  <p className="text-[10px] text-[#8B1A1A] font-bold">#{meja.tableCode}</p>
                </div>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => handleTambahkan(meja)}
                    disabled={diDenah.length >= 12}
                    className="flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={12} strokeWidth={3} />
                    <span>Tambahkan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error banner */}
      {errorMsg && (
        <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {errorMsg}
        </p>
      )}

      {/* ── SECTION 3: ACTION BUTTONS ── */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-gray-300 pt-6">
        <Link
          href="/owner/meja"
          className="w-full sm:w-48 bg-white border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3 rounded-lg transition-colors shadow-sm text-center"
        >
          Batalkan
        </Link>
        <button
          onClick={handleSimpan}
          disabled={isPending}
          className="w-full sm:w-48 bg-[#8B1A1A] border border-[#8B1A1A] text-white hover:bg-red-900 font-extrabold text-sm py-3 rounded-lg transition-colors shadow-sm disabled:opacity-60"
        >
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* ══ MODAL TATA KELOLA BERHASIL ══ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[360px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl">

            {/* Ikon Sukses */}
            <div className="mb-4">
              <CheckCircle2 size={72} className="text-[#22C55E] mx-auto" strokeWidth={1.5} />
            </div>

            {/* Ilustrasi */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img
                src="/Group (6).png"
                alt="Ilustrasi Toko"
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-3">
              Tata Letak Berhasil <br /> Disimpan!
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-8">
              Perubahan tata letak meja telah berhasil disimpan.
            </p>

            <Link
              href="/owner/meja"
              className="w-full bg-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm text-center block"
            >
              Kembali ke Kelola Meja
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}