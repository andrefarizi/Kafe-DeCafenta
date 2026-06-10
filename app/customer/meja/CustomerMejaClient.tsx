'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import { MejaData } from '@/src/controllers/table-controller';

// --- KOMPONEN KARTU MEJA (Statis, tanpa tombol) ---
function RenderCard({ meja }: { meja: MejaData | null }) {
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
        <div className={`w-full h-1.5 rounded-full mt-2 ${meja.status === 'Tersedia' ? 'bg-[#22c55e]' : 'bg-[#ffc107]'}`}></div>
      </div>
    </div>
  );
}

// --- KOMPONEN UTAMA ---
export default function CustomerMejaClient({ tables }: { tables: MejaData[] }) {
  const [localTables, setLocalTables] = useState<MejaData[]>(tables);

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/menu?type=tables', { cache: 'no-store' });
        // Fallback: just use current data if API not available
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Urutkan berdasarkan tableCode
  const sorted = [...localTables].sort((a, b) =>
    a.tableCode.localeCompare(b.tableCode, undefined, { numeric: true })
  );

  const diDenah = sorted.filter((m) => m.isInLayout);

  const layoutSlots = Array(12).fill(null);
  diDenah.forEach((meja) => {
    if (meja.layoutSlot !== null && meja.layoutSlot >= 0 && meja.layoutSlot < 12) {
      layoutSlots[meja.layoutSlot] = meja;
    } else {
      const empty = layoutSlots.findIndex(s => s === null);
      if (empty !== -1) layoutSlots[empty] = meja;
    }
  });

  const mejaLeft        = layoutSlots.slice(0, 6);
  const mejaBottomRight = layoutSlots.slice(6, 10);
  const mejaTopRight    = layoutSlots.slice(10, 12);

  const tersediaCount = localTables.filter(t => t.status === 'Tersedia').length;
  const dipakaiCount = localTables.filter(t => t.status === 'Dipakai').length;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar activeMenu="meja" />
      <main className="w-full sm:flex-1 flex flex-col h-screen overflow-hidden text-left">
        <div className="flex-none">
          <Topbar />
        </div>

        <div className="p-4 md:p-6 w-full overflow-y-auto pb-28 md:pb-10">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-black mb-2">Denah Meja</h1>
            <p className="text-sm text-gray-500 font-medium mb-6">Lihat ketersediaan meja secara real-time</p>

            {/* Ringkasan Status */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <span className="text-sm font-bold text-green-800">{tersediaCount} Tersedia</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-[#ffc107]"></div>
                <span className="text-sm font-bold text-yellow-800">{dipakaiCount} Dipakai</span>
              </div>
            </div>

            {/* ── SECTION 1: DENAH MEJA ── */}
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[800px] h-[650px] relative border-[3px] border-[#8B1A1A] rounded-2xl bg-white mt-2">

                {/* Tab Kuning – Denah Meja */}
                <div className="absolute -top-[3px] left-8 bg-[#FFC700] px-8 py-2.5 rounded-b-xl text-black font-extrabold z-10 text-sm">
                  Denah Meja
                </div>

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
                    <RenderCard key={meja ? meja.id : `empty-l-${idx}`} meja={meja} />
                  ))}
                </div>

                {/* Group Kanan Atas (MJ11–MJ12) */}
                <div className="absolute top-20 right-[5%] w-[38%] grid grid-cols-2 gap-x-6">
                  {mejaTopRight.map((meja, idx) => (
                    <RenderCard key={meja ? meja.id : `empty-tr-${idx}`} meja={meja} />
                  ))}
                </div>

                {/* Group Kanan Bawah (MJ07–MJ10) */}
                <div className="absolute top-[45%] right-[5%] w-[38%] grid grid-cols-2 gap-x-6 gap-y-12">
                  {mejaBottomRight.map((meja, idx) => (
                    <RenderCard key={meja ? meja.id : `empty-br-${idx}`} meja={meja} />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
