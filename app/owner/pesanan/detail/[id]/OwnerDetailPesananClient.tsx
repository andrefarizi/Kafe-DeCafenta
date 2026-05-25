'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ClipboardList, 
  CookingPot, 
  Package, 
  Check,
  FileText
} from 'lucide-react';
import { OrderDetailData, hapusPesananKasir, updateOrderStatusKasir } from '@/src/controllers/kasir-order-controller';

/* ─────────── KONFIGURASI STATUS TRACKER ─────────── */
const STEPS = [
  { key: "Masuk",        label: "Masuk",        color: "#FFC700" },
  { key: "Dimasak",      label: "Dimasak",      color: "#8B1A1A" },
  { key: "Siap Diambil", label: "Siap Diambil", color: "#3B82F6" },
  { key: "Selesai",      label: "Selesai",      color: "#22C55E" },
] as const;

const SEGMENT_GRADIENTS = [
  { from: "#FFC700", to: "#8B1A1A" },
  { from: "#8B1A1A", to: "#3B82F6" },
  { from: "#3B82F6", to: "#22C55E" },
];

/* ─────────── KONFIGURASI ANIMASI PULSE ─────────── */
const PULSE_RING_CLASS: Record<string, string> = {
  'Masuk':        "pulse-ring-yellow",
  'Dimasak':      "pulse-ring-red",
  'Siap Diambil': "pulse-ring-blue",
  'Selesai':      "pulse-ring-green",
};

const LINE_PULSE_CLASS: Record<string, string> = {
  'Masuk':        "line-pulse-yellow",
  'Dimasak':      "line-pulse-red",
  'Siap Diambil': "line-pulse-blue",
  'Selesai':      "line-pulse-green",
};

/* ─────────── KOMPONEN STATUS TRACKER DINAMIS ─────────── */
function StatusTracker({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STEPS.findIndex(s => s.key === currentStatus);

  const icons = [
    <ClipboardList key="0" className="text-white w-5 h-5 md:w-[26px] md:h-[26px]" strokeWidth={2.5} />,
    <CookingPot    key="1" className="text-white w-5 h-5 md:w-[26px] md:h-[26px]" strokeWidth={2.5} />,
    <Package       key="2" className="text-white w-5 h-5 md:w-[26px] md:h-[26px]" strokeWidth={2.5} />,
    <Check         key="3" className="text-white w-6 h-6 md:w-[36px] md:h-[36px]" strokeWidth={2.5} />,
  ];

  return (
    <div className="relative flex justify-between px-0 md:px-8 mb-4 md:mb-8 z-0 w-full">
      {/* Garis Abu-Abu Background */}
      <div className="absolute left-[12.5%] right-[12.5%] top-[20px] md:top-[34px] -translate-y-1/2 h-1.5 md:h-2.5 bg-gray-300 z-[-1] rounded-full"></div>

      {/* Garis Segmen Warna Gradien + Shimmer */}
      {SEGMENT_GRADIENTS.map((seg, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        
        // Jangan render garis warna jika status belum sampai sini
        if (!isDone && !isActive) return null;

        return (
          <div
            key={`seg-${i}`}
            className="absolute left-0 top-[20px] md:top-[34px] -translate-y-1/2 h-1.5 md:h-[10px] rounded-full overflow-hidden"
            style={{
              left: `${12.5 + (i * 25)}%`, 
              width: "25%", 
              background: isActive 
                ? `${STEPS[i].color}40` // Transparan untuk base shimmer saat aktif
                : `linear-gradient(to right, ${seg.from}, ${seg.to})`,
              zIndex: isActive ? 3 : 2,
            }}
          >
            {/* Animasi Shimmer berjalan untuk garis yang sedang aktif */}
            {isActive && <div className={LINE_PULSE_CLASS[STEPS[i].key]} />}
          </div>
        );
      })}

      {/* Step Circles + Ring Pulse */}
      {STEPS.map((step, idx) => {
        const active = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const color = active ? step.color : "#D1D5DB";

        return (
          <div key={step.key} className="flex flex-col items-center w-1/4 z-10 px-0.5">
            <div className="relative w-[40px] h-[40px] md:w-[68px] md:h-[68px]">
              
              {/* Outer ring pulse */}
              {isCurrent && (
                <div className={`pulse-ring-outer ${PULSE_RING_CLASS[step.key]}`} />
              )}
              
              {/* Inner ring pulse */}
              {isCurrent && (
                <div className={`pulse-ring ${PULSE_RING_CLASS[step.key]}`} />
              )}

              {/* Base Circle */}
              <div
                className="w-full h-full rounded-full border-[3px] md:border-[4px] bg-white p-[2px] md:p-[3px] flex items-center justify-center transition-colors duration-500 relative z-10"
                style={{ borderColor: color }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-500"
                  style={{ backgroundColor: color }}
                >
                  {icons[idx]}
                </div>
              </div>
            </div>

            <span 
              className="text-[10px] md:text-base font-extrabold mt-1 md:mt-3 text-center md:whitespace-nowrap transition-colors duration-500 leading-[1.1] max-w-[60px] md:max-w-none"
              style={{ color: active ? "#000" : "#9CA3AF" }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── KOMPONEN UTAMA HALAMAN ─────────── */
export default function OwnerDetailPesananClient({ order }: { order: OrderDetailData }) {
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal]     = useState(false);
  const [showSuccessModal, setShowSuccessModal]     = useState(false);
  const [isDeleting, setIsDeleting]                 = useState(false);
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus]     = useState(false);

  const formatPrice = (p: number) => "Rp " + p.toLocaleString("id-ID");

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Masuk':        return 'bg-[#FFC700] text-black';
      case 'Dimasak':      return 'bg-[#8B1A1A] text-white';
      case 'Siap Diambil': return 'bg-[#3B82F6] text-white';
      case 'Selesai':      return 'bg-[#22C55E] text-white';
      default:             return 'bg-gray-200 text-black';
    }
  };

  const getNextStatusText = () => {
    if (order.status === 'Masuk' && !order.isPaid) return 'Lunas & Dimasak';
    if (order.status === 'Masuk' && order.isPaid)  return 'Dimasak';
    if (order.status === 'Dimasak')                return 'Siap Diambil';
    if (order.status === 'Siap Diambil')           return 'Selesai';
    return '';
  };

  const handleCancelOrder = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/pesanan/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id })
      });
      const result = await res.json();
      setIsDeleting(false);
      if (result.success) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      setIsDeleting(false);
      toast.error('Gagal menghubungi server.');
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    const result = await updateOrderStatusKasir(order.id, order.status, order.isPaid);
    setIsUpdatingStatus(false);
    if (result.success) {
      setShowStatusConfirmModal(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.push('/owner/pesanan')}
          aria-label="Kembali ke Pesanan" 
          title="Kembali ke Pesanan" 
          className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Detail Pesanan</h1>
      </div>

      {/* Customer Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 flex items-center mb-6">
        <img 
          src="/mdi_face-man.png" 
          alt="Avatar" 
          className="w-14 h-14 object-contain mr-4" 
        />
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Nama Pelanggan</p>
          <p className="text-lg font-extrabold text-[#8B1A1A]">{order.customerName}</p>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Kode Pesanan</p>
          <p className="text-lg font-extrabold text-[#8B1A1A]">{order.orderCode}</p>
          <p className="text-xs font-bold text-[#8B1A1A] mt-1">{order.tanggal}, {order.waktu}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[10px] text-gray-500 font-medium mb-1">Status</p>
          <span className={`${getStatusBadgeColor(order.status)} font-extrabold text-sm px-4 py-1 rounded-sm shadow-sm`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Status Timeline Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 mb-8 relative">
        <h3 className="text-sm font-extrabold text-[#8B1A1A] mb-8">Status Pesanan</h3>
        
        <StatusTracker currentStatus={order.status} />

        {order.status !== 'Selesai' && (
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setShowStatusConfirmModal(true)}
              className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2.5 px-6 rounded-md transition-colors"
            >
              {order.status === 'Masuk' && !order.isPaid ? 'Konfirmasi - ' : 'Ubah Status - '}
              <span className="font-extrabold">
                {order.status === 'Masuk' && !order.isPaid ? 'Pembayaran Lunas' : 
                 order.status === 'Masuk' && order.isPaid ? 'Dimasak' : 
                 order.status === 'Dimasak' ? 'Siap Diambil' : 
                 order.status === 'Siap Diambil' ? 'Selesai' : ''}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* General Information */}
      <div className="mb-10 space-y-5">
        <div>
          <h4 className="text-sm font-extrabold text-black mb-0.5">Metode Pembayaran</h4>
          <p className="text-xs font-medium text-black">{order.paymentMethod}</p>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-black mb-0.5">Tipe Pesanan</h4>
          <p className="text-xs font-medium text-black">{order.orderType}</p>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-black mb-1">Status Pembayaran</h4>
          {order.isPaid ? (
            <span className="inline-block bg-[#22C55E] text-white text-[10px] font-bold px-4 py-1 rounded-full">
              Sudah Dibayar
            </span>
          ) : (
            <span className="inline-block bg-[#484040] text-white text-[10px] font-bold px-4 py-1 rounded-full">
              Belum Dibayar
            </span>
          )}
        </div>
      </div>

      {/* Product List Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-4 font-extrabold text-black text-sm w-2/5">Produk</th>
              <th className="pb-4 font-extrabold text-black text-sm text-center w-1/5">Kategori</th>
              <th className="pb-4 font-extrabold text-black text-sm text-center w-1/5">Jumlah</th>
              <th className="pb-4 font-extrabold text-black text-sm text-right w-1/5">Harga</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100"
                  />
                  <div>
                    <p className="font-extrabold text-black text-sm">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium italic mt-0.5">{item.note}</p>
                  </div>
                </td>
                <td className="py-4 text-center font-extrabold text-black text-sm">
                  {item.category}
                </td>
                <td className="py-4 text-center font-medium text-black text-sm">
                  {item.qty}
                </td>
                <td className="py-4 text-right font-medium text-black text-sm">
                  {formatPrice(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div className="border-t border-gray-400 pt-4 mb-8 flex justify-end">
        <p className="text-xl font-extrabold text-[#8B1A1A]">
          Total {order.totalItems} Menu : {formatPrice(order.totalPrice)}
        </p>
      </div>

      {/* Tombol Invoice */}
      <div className="flex flex-col items-end mb-8">
        <p className="text-sm font-extrabold text-black mb-2">Cek Invoice</p>
        <Link 
          href={`/owner/invoice/${order.id}`} 
          className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-6 py-2 rounded-md transition-colors shadow-sm"
        >
          <FileText size={16} />
          <span className="text-xs font-bold">Invoice</span>
        </Link>
      </div>

      {/* Cancel Button */}
      {order.status !== 'Selesai' && !order.isPaid && (
        <button 
          onClick={() => setShowConfirmModal(true)}
          className="w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-4 rounded-md transition-colors shadow-sm"
        >
          Batalkan Pesanan
        </button>
      )}

      {/* =========================================
          MODAL KONFIRMASI UBAH STATUS
      ========================================= */}
      {showStatusConfirmModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-5 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 bg-[#FFC700] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-[40px] font-black leading-none mt-1">?</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-3">
              Yakin Ingin <br /> {order.status === 'Masuk' && !order.isPaid ? 'Konfirmasi Lunas?' : 'Ubah Status?'}
            </h2>
            <p className="text-[13px] font-medium text-gray-600 mb-8 px-2">
              Status pesanan akan diubah menjadi <br/>
              <span className="font-extrabold text-[#8B1A1A] text-[15px]">{getNextStatusText()}</span>
            </p>
            <div className="w-full flex flex-col space-y-4">
              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isUpdatingStatus ? 'Memproses...' : 'Ya, Lanjutkan'}
              </button>
              <button 
                onClick={() => setShowStatusConfirmModal(false)}
                disabled={isUpdatingStatus}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL KONFIRMASI HAPUS PESANAN
      ========================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-5 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 bg-[#FF4C4C] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="text-white text-[40px] font-black leading-none mt-1">!</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
              Yakin Ingin <br /> Membatalkan Pesanan?
            </h2>
            <div className="w-full flex flex-col space-y-4">
              <button 
                onClick={handleCancelOrder}
                disabled={isDeleting}
                className="w-full bg-[#8B1A1A] border-2 border-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isDeleting ? 'Memproses...' : 'Lanjutkan'}
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                className="w-full bg-white border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL SUKSES HAPUS PESANAN
      ========================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-[340px] p-5 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute w-16 h-16 bg-[#B6EBA5] rounded-xl z-0"></div>
              <div className="absolute w-16 h-16 bg-[#B6EBA5] rounded-xl rotate-45 z-0"></div>
              <Check size={40} className="text-[#16A34A] relative z-10 stroke-[4] mt-1" />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight mb-8">
              Pesanan berhasil <br /> dibatalkan
            </h2>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/owner/pesanan');
              }}
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
