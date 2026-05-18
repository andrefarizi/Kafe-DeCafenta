'use client';

import React, { useState, useTransition } from 'react';
import { MejaData, updateTableStatus } from '@/src/controllers/table-controller';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

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

  // States for modals
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, tableId: string, currentStatus: 'Tersedia' | 'Dipakai' | null, tableName: string}>({
    isOpen: false,
    tableId: '',
    currentStatus: null,
    tableName: ''
  });
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});
  const [errorModal, setErrorModal] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});

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

  // Handler: buka modal konfirmasi
  const handleToggleClick = (tableId: string, currentStatus: 'Tersedia' | 'Dipakai') => {
    const table = localTables.find(t => t.id === tableId);
    setConfirmModal({
      isOpen: true,
      tableId,
      currentStatus,
      tableName: table?.name || ''
    });
  };

  const handleConfirmToggle = () => {
    const { tableId, currentStatus } = confirmModal;
    if (!currentStatus) return;

    const nextStatus = currentStatus === 'Tersedia' ? 'Dipakai' : 'Tersedia';

    setConfirmModal(prev => ({ ...prev, isOpen: false }));

    // Optimistic update
    setLocalTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t))
    );

    startTransition(async () => {
      const result = await updateTableStatus(tableId, currentStatus);
      if (!result.success) {
        // Revert jika gagal
        setLocalTables((prev) =>
          prev.map((t) => (t.id === tableId ? { ...t, status: currentStatus } : t))
        );
        setErrorModal({ isOpen: true, message: result.message || "Gagal mengubah status meja" });
      } else {
        setSuccessModal({ isOpen: true, message: `Status meja berhasil diubah menjadi ${nextStatus}` });
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
                    onToggle={handleToggleClick}
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
                    onToggle={handleToggleClick}
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
                    onToggle={handleToggleClick}
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

        {/* Modal Konfirmasi */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-[#8B0000]" />
              </div>
              <h3 className="text-xl font-black mb-2">Ubah Status Meja</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Apakah Anda yakin ingin mengubah status <strong>{confirmModal.tableName}</strong> menjadi <strong>{confirmModal.currentStatus === 'Tersedia' ? 'Dipakai' : 'Tersedia'}</strong>?
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
                  className="flex-1 bg-[#8B0000] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#6A0000] transition shadow-lg"
                >
                  Ya, Ubah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sukses */}
        {successModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-black mb-2">Berhasil!</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {successModal.message}
              </p>
              <button
                onClick={() => setSuccessModal({ isOpen: false, message: '' })}
                className="w-full bg-[#8B0000] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#6A0000] transition shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Error */}
        {errorModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black mb-2">Gagal!</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {errorModal.message}
              </p>
              <button
                onClick={() => setErrorModal({ isOpen: false, message: '' })}
                className="w-full bg-[#8B0000] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#6A0000] transition shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
