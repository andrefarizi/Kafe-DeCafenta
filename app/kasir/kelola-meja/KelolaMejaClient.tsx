'use client';

import React, { useState, useTransition } from 'react';
import { MejaData, updateTableStatus } from '@/src/controllers/table-controller';

// --- KOMPONEN KARTU MEJA (UI identik dengan desain asli) ---
function RenderCard({
  meja,
  onToggle,
  isPending,
}: {
  meja: MejaData;
  onToggle: (id: string, currentStatus: 'Tersedia' | 'Dipakai') => void;
  isPending: boolean;
}) {
  return (
    <div className="bg-white border-[1.5px] border-[#8b0000] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-[130px] shadow-sm">
      {/* Badge Status di Pojok Kanan Atas */}
      <div
        className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-bold rounded-bl-lg 
        ${meja.status === 'Tersedia' ? 'bg-[#22c55e] text-white' : 'bg-[#ffc107] text-black'}`}
      >
        {meja.status}
      </div>

      <div>
        <h3 className="font-black text-lg">{meja.name}</h3>
        <p className="text-[10px] text-[#8b0000] font-bold">#{meja.tableCode}</p>
      </div>

      <button
        onClick={() => onToggle(meja.id, meja.status)}
        disabled={isPending}
        className={`w-full py-1.5 rounded-md text-[9px] font-bold transition-all disabled:opacity-60
        ${
          meja.status === 'Tersedia'
            ? 'bg-[#8b0000] text-white hover:bg-[#6b0000]'
            : 'bg-white text-[#8b0000] border border-[#8b0000] hover:bg-red-50'
        }`}
      >
        Ubah Status - {meja.status === 'Tersedia' ? 'Dipakai' : 'Tersedia'}
      </button>
    </div>
  );
}

// --- KOMPONEN UTAMA (menerima data real dari Server Component) ---
export default function KelolaMejaClient({ tables }: { tables: MejaData[] }) {
  const [isPending, startTransition] = useTransition();
  // State lokal untuk optimistic update agar UI responsif tanpa tunggu server
  const [localTables, setLocalTables] = useState<MejaData[]>(tables);

  // Urutkan berdasarkan tableCode (MJ01, MJ02, ... MJ12)
  const sorted = [...localTables].sort((a, b) =>
    a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
  );

  // Bagi ke group denah sesuai layout desain asli:
  // Kiri   : 6 meja pertama  (MJ01–MJ06)
  // Kanan Bawah: 4 meja berikutnya (MJ07–MJ10)
  // Kanan Atas : 2 meja terakhir   (MJ11–MJ12)
  const mejaLeft        = sorted.slice(0, 6);
  const mejaBottomRight = sorted.slice(6, 10);
  const mejaTopRight    = sorted.slice(10, 12);

  // Handler: optimistic update → panggil server action
  const handleToggle = (tableId: string, currentStatus: 'Tersedia' | 'Dipakai') => {
    const nextStatus = currentStatus === 'Tersedia' ? 'Dipakai' : 'Tersedia';

    // Optimistic: langsung update UI
    setLocalTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t))
    );

    startTransition(async () => {
      const result = await updateTableStatus(tableId, currentStatus);
      if (!result.success) {
        // Revert jika server action gagal
        setLocalTables((prev) =>
          prev.map((t) => (t.id === tableId ? { ...t, status: currentStatus } : t))
        );
        alert(result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black font-sans p-6 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Manajemen Meja</h1>

        {/* Master Container dengan Garis Merah (Dinding Luar) */}
        <div className="border-[3px] border-[#8b0000] rounded-2xl relative bg-white mt-4 pb-16 pt-8 px-8">

          {/* Garis Pemisah Vertikal dari atas */}
          <div className="absolute top-0 left-[52%] w-[3px] bg-[#8b0000] h-[42%]"></div>

          {/* Garis Pemisah Horizontal dari kanan */}
          <div className="absolute top-[42%] right-0 h-[4px] bg-[#8b0000] w-[35%]"></div>

          {/* --- LABEL DENAH --- */}
          <div className="absolute top-0 left-0 bg-[#ffc107] text-[15px] font-black px-10 py-3 rounded-tl-[13px] rounded-br-2xl z-10">
            Denah Meja
          </div>

          {/* Indikator loading saat ubah status */}
          {isPending && (
            <div className="absolute top-3 right-4 text-[11px] font-bold text-[#8b0000] animate-pulse z-20">
              Menyimpan...
            </div>
          )}

          {/* Container Denah Ruangan */}
          <div className="flex flex-col md:flex-row gap-16 relative mt-12 z-10">

            {/* Bagian Kiri (Meja 1–6) */}
            <div className="flex-[1.1] grid grid-cols-2 gap-6 pb-2">
              {mejaLeft.length > 0 ? (
                mejaLeft.map((meja) => (
                  <RenderCard
                    key={meja.id}
                    meja={meja}
                    onToggle={handleToggle}
                    isPending={isPending}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-400 text-sm py-8">
                  Belum ada data meja.
                </div>
              )}
            </div>

            {/* Bagian Kanan */}
            <div className="flex-1 flex flex-col pb-2">

              {/* Kanan Atas (MJ11 & MJ12) */}
              <div className="grid grid-cols-2 gap-6 mb-20">
                {mejaTopRight.map((meja) => (
                  <RenderCard
                    key={meja.id}
                    meja={meja}
                    onToggle={handleToggle}
                    isPending={isPending}
                  />
                ))}
              </div>

              {/* Kanan Bawah (MJ07–MJ10) */}
              <div className="grid grid-cols-2 gap-6 mt-20">
                {mejaBottomRight.map((meja) => (
                  <RenderCard
                    key={meja.id}
                    meja={meja}
                    onToggle={handleToggle}
                    isPending={isPending}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Label "Pintu Masuk" di bawah area kiri */}
          <div className="absolute bottom-0 left-[25%] transform -translate-x-1/2 translate-y-1/2 bg-white px-8 py-1.5 border-[3px] border-[#8b0000] rounded-lg shadow-sm z-20">
            <span className="text-[#8b0000] font-black text-sm">Pintu Masuk</span>
          </div>

        </div>
      </div>
    </div>
  );
}
