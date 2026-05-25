"use client";

import React, {
  useEffect, useState, useRef, Suspense, useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/customer/components/sidebar";
import Topbar from "@/app/customer/components/topbar";
import {
  ChevronLeft, RotateCcw, ClipboardList, CookingPot,
  Package, Check, Loader2, Copy, CheckCircle2, Star, X
} from "lucide-react";
import { getOrderDetail } from "@/src/controllers/order-controller";
import { addMenuReview } from "@/src/controllers/menu-controller";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

/* ─────────── TYPES ─────────── */
type OrderDetail = {
  id: string; orderCode: string; status: string;
  totalPrice: number; isPaid: boolean; paymentMethod: string;
  orderType: string; orderedAt: string;
  items: { 
    id: string; 
    menuId?: string; 
    name: string; 
    category: string; 
    quantity: number; 
    unitPrice: number; 
    subtotal: number; 
    notes: string;
    isReviewed: boolean; 
  }[];
}
type PaymentMethod = "cash" | "gopay" | "dana" | "bank_va";

/* ─────────── CONSTANTS ─────────── */
const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash", gopay: "GoPay", dana: "DANA / QRIS", bank_va: "Bank (Virtual Account BCA)",
};

/* ─────────── KONFIGURASI STATUS TRACKER ─────────── */
const STEPS = [
  { key: "masuk",        label: "Masuk",        color: "#FFC700" },
  { key: "dimasak",      label: "Dimasak",       color: "#8B1A1A" },
  { key: "siap_diambil", label: "Siap Diambil",  color: "#3B82F6" },
  { key: "selesai",      label: "Selesai",        color: "#22C55E" },
] as const;

const SEGMENT_GRADIENTS = [
  { from: "#FFC700", to: "#8B1A1A" },
  { from: "#8B1A1A", to: "#3B82F6" },
  { from: "#3B82F6", to: "#22C55E" },
];

/* ─────────── KONFIGURASI ANIMASI PULSE ─────────── */
const PULSE_RING_CLASS: Record<string, string> = {
  'masuk':        "pulse-ring-yellow",
  'dimasak':      "pulse-ring-red",
  'siap_diambil': "pulse-ring-blue",
  'selesai':      "pulse-ring-green",
};

const LINE_PULSE_CLASS: Record<string, string> = {
  'masuk':        "line-pulse-yellow",
  'dimasak':      "line-pulse-red",
  'siap_diambil': "line-pulse-blue",
  'selesai':      "line-pulse-green",
};

const fmt = (p: number) => "Rp " + p.toLocaleString("id-ID");

/* ═══════════════════════════════════
   STATUS TRACKER COMPONENT
═══════════════════════════════════ */
const STATUS_LABEL: Record<string, { label: string; color: string; emoji: string }> = {
  masuk:        { label: "Pesanan Masuk",       color: "#FFC700", emoji: "📋" },
  dimasak:      { label: "Sedang Dimasak",      color: "#8B1A1A", emoji: "👨‍🍳" },
  siap_diambil: { label: "Siap Diambil!",       color: "#3B82F6", emoji: "📦" },
  selesai:      { label: "Pesanan Selesai! 🎉", color: "#22C55E", emoji: "✅" },
};

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

/* ═══════════════════════════════════
   STATUS UPDATE TOAST & BANNER
═══════════════════════════════════ */
function StatusUpdateToast({ status, onClose }: { status: string; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);
  const info = STATUS_LABEL[status] ?? { label: status, color: "#333", emoji: "🔔" };
  const close = () => { setExiting(true); setTimeout(onClose, 350); };
  useEffect(() => { const t = setTimeout(close, 5000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 ${exiting ? "status-toast-exit" : "status-toast-enter"}`}>
      <div className="flex items-center gap-3 rounded-2xl shadow-2xl px-5 py-3 text-white" style={{ background: info.color, minWidth: 220 }}>
        <span className="text-2xl">{info.emoji}</span>
        <div>
          <p className="font-extrabold text-[14px] leading-tight">Status Diperbarui!</p>
          <p className="text-[12px] opacity-90">{info.label}</p>
        </div>
        <button onClick={close} className="ml-2 text-white/70 hover:text-white text-lg">✕</button>
      </div>
    </div>
  );
}

function PaymentSuccessBanner({ onClose }: { onClose: () => void }) {
  const [exiting, setExiting] = useState(false);
  const close = () => { setExiting(true); setTimeout(onClose, 300); };
  useEffect(() => { const t = setTimeout(close, 6000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[999] w-full max-w-[480px] px-4 ${exiting ? "notif-exit" : "notif-enter"}`}>
      <div className="bg-white border-[2px] border-[#22C55E] rounded-2xl shadow-2xl flex items-start gap-4 px-5 py-4">
        <div className="shrink-0 w-11 h-11 bg-[#DCFCE7] rounded-full flex items-center justify-center mt-0.5">
          <CheckCircle2 size={24} className="text-[#16A34A]" />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-black text-[15px] leading-tight">Pembayaran Berhasil! 🎉</p>
          <p className="text-gray-500 text-[12px] mt-1">Transaksi dikonfirmasi. Pesanan Anda masuk ke antrian dapur.</p>
        </div>
        <button onClick={close} className="text-gray-400 hover:text-gray-600 text-[18px] shrink-0 mt-0.5">✕</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
function CashPageInner() {
  const searchParams      = useSearchParams();
  const router            = useRouter();
  const { data: session } = useSession();
  const orderId           = searchParams.get("orderId");

  const [order, setOrder]         = useState<OrderDetail | null>(null);
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK MODAL ULASAN
  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // STATE BARU UNTUK POPUP SUKSES ULASAN
  const [showReviewSuccessModal, setShowReviewSuccessModal] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");
  const [isPaymentOpen, setIsPaymentOpen]   = useState(false);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [paymentResult, setPaymentResult]   = useState<Record<string, unknown> | null>(null);
  const [midtransOrderId, setMidtransOrderId] = useState("");
  const [paymentError, setPaymentError]     = useState("");
  const [copied, setCopied]                 = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showStatusToast, setShowStatusToast]     = useState(false);
  const isFirstLoad = useRef(true);
  const [isPolling, setIsPolling]           = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  /* ── load order ── */
  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    const data = await getOrderDetail(orderId);
    if (data) {
      setOrder(prev => {
        if (prev && prev.status !== data.status) {
          setPrevStatus(prev.status); 
          if (!isFirstLoad.current) setShowStatusToast(true); 
        }
        return data;
      });
      isFirstLoad.current = false;
      
      // Extract payment method from notes if available
      const match = data.notes?.match(/payment_method:([^\s]+)/);
      if (match && match[1]) {
        setSelectedMethod(match[1] as PaymentMethod);
      } else if (data.paymentMethod === 'cash') {
        setSelectedMethod('cash');
      }
    }
  }, [orderId]);

  useEffect(() => {
    (async () => { setIsLoading(true); await loadOrder(); setIsLoading(false); })();
  }, [loadOrder]);

  /* ── polling otomatis ── */
  const startPolling = useCallback((mtId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    setIsPolling(true);
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/payment/check-status?orderId=${orderId}&midtransOrderId=${mtId}`);
        const json = await res.json();
        if (json.isPaid) {
          clearInterval(pollRef.current!);
          setIsPolling(false);
          setShowSuccessBanner(true);
          await loadOrder();
          router.refresh(); 
        }
      } catch { /* silent */ }
    }, 4000);
  }, [orderId, loadOrder]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* ── bayar ── */
  const handlePay = async () => {
    if (!selectedMethod || !order) return;
    setIsProcessing(true); setPaymentError("");
    try {
      const res  = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id, paymentType: selectedMethod,
          totalAmount: order.totalPrice,
          customerName: session?.user?.name   || "Customer",
          customerEmail: session?.user?.email || "customer@decafenta.com",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPaymentResult(json.data);
        const mtId = String((json.data as Record<string, unknown>).order_id || "");
        setMidtransOrderId(mtId);
        if (mtId) startPolling(mtId);
      } else {
        setPaymentError(json.message || "Gagal memproses pembayaran.");
      }
    } catch { setPaymentError("Terjadi kesalahan jaringan."); }
    finally  { setIsProcessing(false); }
  };

  /* ── cek manual ── */
  const handleCheckStatus = async () => {
    setIsPolling(true);
    try {
      const res  = await fetch(`/api/payment/check-status?orderId=${orderId}&midtransOrderId=${midtransOrderId}`);
      const json = await res.json();
      if (json.isPaid) {
        setShowSuccessBanner(true);
        await loadOrder();
        router.refresh(); 
      }
    } finally { setIsPolling(false); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  /* ── Handle Buka Modal Ulasan ── */
  const openReviewModal = (item: any) => {
    setReviewItem(item);
    setSelectedRating(0);
    setHoverRating(0);
    setReviewText("");
  };

  const closeReviewModal = () => {
    setReviewItem(null);
  };

  const submitReview = async () => {
    if (!reviewItem || selectedRating === 0) return;
    setIsSubmittingReview(true);
    
    const targetMenuId = reviewItem.menuId || reviewItem.id;
    // Parameter ke-4 adalah ID OrderItem
    const result = await addMenuReview(targetMenuId, selectedRating, reviewText, reviewItem.id);
    
    setIsSubmittingReview(false);

    if (result.success) {
      closeReviewModal();
      setShowReviewSuccessModal(true);
      await loadOrder(); // <--- Refresh data diam-diam dari DB
      router.refresh(); 
    } else {
      toast.error(result.message);
    }
  };

  /* Fallback gambar ringan */
  const getFallbackImg = (cat: string) => {
    if (cat === 'Minuman') return '/Rectangle 43 (1).png';
    return '/Rectangle 43.png';
  }

  /* ── loading / not found ── */
  if (isLoading) return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeMenu="pesanan" />
      <main className="w-full sm:flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#8B1A1A]" />
      </main>
    </div>
  );
  if (!order) return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeMenu="pesanan" />
      <main className="w-full sm:flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500 font-medium">Pesanan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="bg-[#8B1A1A] text-white px-6 py-2 rounded-lg font-bold">Kembali</button>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      {showSuccessBanner && <PaymentSuccessBanner onClose={() => setShowSuccessBanner(false)} />}
      {showStatusToast && order && <StatusUpdateToast status={order.status} onClose={() => setShowStatusToast(false)} />}

      <Sidebar activeMenu="pesanan" />
      
      <main className="w-full sm:flex-1 flex flex-col h-screen overflow-hidden text-left relative">
        <div className="flex-none"><Topbar /></div>

        <div className="w-full sm:flex-1 overflow-y-auto w-full">
          <div className="max-w-5xl mx-auto p-5 md:p-8 pb-24">
            
            {/* ── Header ── */}
            <div className="flex items-center mb-8 w-full">
              <button onClick={() => router.back()} className="mr-4 p-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <ChevronLeft size={20} className="text-black" />
              </button>
              <h1 className="text-2xl md:text-[32px] font-extrabold text-black">Detail Pesanan</h1>
            </div>

            {/* ── Order Info Card ── */}
            <div className="border-[1.5px] border-[#8B1A1A] rounded-2xl p-6 flex justify-between items-center mb-6 bg-white shadow-sm">
              <div>
                <p className="text-[11px] text-gray-500 font-medium mb-1">Kode Pesanan</p>
                <p className="text-xl md:text-[22px] font-black text-[#8B1A1A]">#{order.orderCode}</p>
                <p className="text-[#8B1A1A] font-bold text-[12px] mt-1">
                  {new Date(order.orderedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[11px] text-gray-500 font-medium mb-1.5">Status</p>
                <span 
                  className="text-[11px] px-4 py-1.5 rounded-md font-black uppercase text-white shadow-sm"
                  style={{ backgroundColor: STEPS.find(s => s.key === order.status)?.color || "#333" }}
                >
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* ── STATUS TRACKER CARD ── */}
            <div className="border-[1.5px] border-[#8B1A1A] rounded-2xl p-6 mb-8 relative bg-white shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[15px] font-extrabold text-[#8B1A1A]">Status Pesanan</h3>
                <button
                  onClick={async () => {
                    const toastId = toast.loading("Memuat status pesanan terbaru...", { position: 'top-center' });
                    await loadOrder();
                    router.refresh();
                    toast.dismiss(toastId);
                    toast.success("Status pesanan diperbarui", { position: 'top-center' });
                  }}
                  className="flex items-center gap-1.5 bg-[#8B1A1A] text-white text-[11px] font-bold px-3 py-1.5 rounded-md hover:bg-red-900 transition-colors shadow-sm"
                >
                  <RotateCcw size={12} /> Refresh Status
                </button>
              </div>

              <div className="mb-4">
                <StatusTracker currentStatus={order.status} />
              </div>
            </div>

            {/* ── Pembayaran Section ── */}
            <section className="mb-8 w-full text-left">
              <div className="mb-6">
                <h3 className="font-extrabold text-[16px] text-black">Pembayaran</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">Selesaikan pembayaran untuk melanjutkan pesanan anda</p>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-[14px] font-extrabold text-black mb-1">Tipe Pesanan</h3>
                  <p className="text-[13px] text-black font-medium">{order.orderType}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-extrabold text-black mb-2">Status Pembayaran</h3>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-bold shadow-sm ${order.isPaid ? "bg-[#22C55E]" : "bg-[#444444]"}`}>
                    {order.isPaid && <CheckCircle2 size={12} />}
                    {order.isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                  </span>
                </div>
              </div>
            </section>

            {/* Form Pembayaran (Jika belum bayar & belum ada VA) */}
            {!order.isPaid && !paymentResult && (
              <div className="border-[1.5px] border-[#8B1A1A] rounded-2xl p-6 bg-white w-full mb-10 shadow-sm">
                <h3 className="font-extrabold text-[14px] text-black mb-4">Informasi Pembayaran</h3>
                <div className="mb-5">
                  <p className="text-[13px] text-gray-600 font-medium mb-1">Metode Pembayaran yang dipilih:</p>
                  <p className="text-[15px] font-extrabold text-[#8B1A1A]">{selectedMethod ? PAYMENT_LABELS[selectedMethod] : "Memuat..."}</p>
                </div>

                {selectedMethod === 'cash' ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <p className="text-[13px] text-yellow-800 font-bold text-center">Silakan lakukan pembayaran langsung di kasir untuk menyelesaikan pesanan Anda.</p>
                  </div>
                ) : (
                  <>
                    {paymentError && <p className="text-red-600 text-xs font-bold mb-3">{paymentError}</p>}
                    <button onClick={handlePay} disabled={!selectedMethod || isProcessing}
                      className="w-full bg-[#8B1A1A] text-white py-3.5 rounded-xl font-bold text-[14px] hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                      {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : `Lanjutkan Pembayaran`}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Instruksi setelah charge (Virtual Account dll) */}
            {paymentResult && !order.isPaid && (
              <div className="border-[1.5px] border-[#8B1A1A] rounded-2xl p-6 bg-white w-full mb-10 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-[15px] text-black">Instruksi Pembayaran</h3>
                <p className="text-[13px] text-gray-500 font-medium">Status: <span className="font-extrabold text-[#FFC700] capitalize">{String((paymentResult).transaction_status || "")}</span></p>

                {Array.isArray(paymentResult.actions) && (
                  <div className="space-y-4 mt-2">
                    {(paymentResult.actions as Record<string, string>[]).map((a, i) => {
                      if (a.name === "generate-qr-code") return (
                        <div key={i}>
                          <p className="text-[13px] font-extrabold text-black mb-2">Scan QR Code:</p>
                          <div className="p-3 border-2 border-gray-100 rounded-xl w-fit shadow-sm">
                            <img src={a.url} alt="QR" className="w-40 h-40 object-contain" />
                          </div>
                        </div>
                      );
                      if (a.name === "deeplink-redirect") return (
                        <a key={i} href={a.url} className="block w-full bg-[#8B1A1A] text-white text-center py-3.5 rounded-xl text-[14px] font-bold hover:bg-red-900 shadow-sm mt-4">Buka Aplikasi GoPay</a>
                      );
                      return null;
                    })}
                  </div>
                )}

                {Array.isArray(paymentResult.va_numbers) && (
                  <div className="mt-2">
                    <p className="text-[13px] font-extrabold text-black mb-2">Nomor Virtual Account BCA:</p>
                    <div className="flex items-center gap-3 mb-1.5">
                      <button onClick={() => handleCopy((paymentResult.va_numbers as Record<string,string>[])[0]?.va_number || "")} className="text-[#8B1A1A] hover:text-red-900 bg-red-50 p-2 rounded-lg">
                        <Copy size={16} />
                      </button>
                      <span className="text-[15px] font-mono font-black text-gray-900 tracking-wide">
                        {(paymentResult.va_numbers as Record<string,string>[])[0]?.va_number}
                      </span>
                      {copied && <span className="text-[11px] text-green-600 font-extrabold bg-green-50 px-2 py-1 rounded-md">✓ Disalin</span>}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Bank: BCA • Bayar sebelum transaksi expired</p>
                  </div>
                )}

                <button onClick={handleCheckStatus} disabled={isPolling}
                  className="w-full border-[1.5px] border-[#8B1A1A] text-[#8B1A1A] py-3.5 rounded-xl text-[13px] font-extrabold hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-60 transition-colors mt-6 shadow-sm">
                  {isPolling ? <><Loader2 size={16} className="animate-spin" /> Mengecek...</> : <><RotateCcw size={16} /> Cek Status Pembayaran</>}
                </button>
                {isPolling && <p className="text-[11px] text-gray-400 font-medium text-center mt-2">🔄 Menunggu konfirmasi otomatis…</p>}
              </div>
            )}

            {/* Sudah bayar */}
            {order.isPaid && (
              <div className="border border-[#22C55E] rounded-xl p-4 bg-[#F0FFF4] w-full max-w-[420px] mb-8 ">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={18} className="text-[#16A34A]" />
                  <h3 className="font-bold text-[14px] text-[#16A34A]">Pembayaran Terverifikasi</h3>
                </div>
                <p className="text-[12px] text-gray-600">Pesanan anda sedang diproses oleh dapur. Pantau status di atas.</p>
              </div>
            )}

            {/* ── Tabel Produk ── */}
            <div className="mb-10 w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b-[1.5px] border-black">
                      <th className="pb-3 font-extrabold text-black text-[13px] w-2/5">Produk</th>
                      <th className="pb-3 font-extrabold text-black text-center text-[13px] w-1/5">Kategori</th>
                      <th className="pb-3 font-extrabold text-black text-center text-[13px] w-1/5">Jumlah</th>
                      <th className="pb-3 font-extrabold text-black text-right text-[13px] w-1/5">Harga</th>
                      {order.status === 'selesai' && <th className="pb-3 font-extrabold text-black text-center text-[13px] pl-4">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <ProductRowItem 
                        key={item.id} 
                        item={item} 
                        isCompleted={order.status === 'selesai'} 
                        isReviewed={item.isReviewed}
                        onOpenReview={() => openReviewModal(item)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t-[1.5px] border-black mt-1 pt-4 flex justify-end">
                <h2 className="text-[17px] font-black text-[#8B1A1A]">
                  Total {order.items.length} Menu : {fmt(order.totalPrice)}
                </h2>
              </div>
              {order.status === 'selesai' && (
                <div className="mt-6 flex flex-col items-end gap-2">
                  <span className="text-[12px] font-bold text-black">Cek Invoice</span>
                  <button 
                    onClick={() => router.push(`/customer/invoice/${order.id}`)}
                    className="flex items-center gap-4 bg-[#8A0000] text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-all shadow-md"
                  >
                    <ClipboardList size={18} />
                    <span className="text-[12px] font-bold">Invoice</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════
            MODAL POPUP BERI ULASAN
        ═══════════════════════════════════ */}
        {reviewItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeReviewModal}></div>
            <div className="relative bg-[#F8F9FA] w-full max-w-[450px] rounded-[30px] shadow-2xl border-2 border-[#8B1A1A] p-6 animate-in fade-in zoom-in duration-200">
              
              <button
                onClick={closeReviewModal}
                className="absolute -top-2 -right-2 bg-[#8B1A1A] text-white rounded-full p-1.5 shadow-lg hover:bg-red-900 transition-colors z-10"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-black tracking-tight leading-none">Beri Ulasan</h2>
              </div>

              {/* Produk Info */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
                <div className="w-[100px] h-[90px] rounded-[15px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img src={getFallbackImg(reviewItem.category)} alt={reviewItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full sm:flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="font-extrabold text-black text-[15px] mb-1 leading-tight">{reviewItem.name}</h4>
                  <p className="text-[11px] font-medium text-gray-500 leading-tight">Bagaimana rasa dan kualitas menu ini?</p>
                </div>
              </div>

              <div className="w-full h-[1.5px] bg-gray-300 mb-5"></div>

              {/* Input Rating Bintang */}
              <div className="mb-6 flex flex-col items-center">
                <p className="text-[13px] font-extrabold text-black mb-3">Berikan Rating Bintang <span className="text-red-500">*</span></p>
                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={38}
                      className={`cursor-pointer transition-all duration-200 ${
                        star <= (hoverRating || selectedRating)
                          ? 'text-[#FFC700] fill-[#FFC700] scale-110'
                          : 'text-gray-300 fill-transparent'
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setSelectedRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Input Teks Ulasan */}
              <div className="mb-6">
                <p className="text-[12px] font-extrabold text-black mb-2">Tulis Ulasan (Opsional)</p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Ceritakan pengalamanmu menikmati menu ini..."
                  className="w-full bg-white rounded-xl p-4 text-black placeholder:text-gray-400 text-[13px] font-medium focus:outline-none border-[1.5px] border-gray-300 focus:border-[#8B1A1A] min-h-[100px] resize-none shadow-inner"
                />
              </div>

              {/* Tombol Kirim */}
              <button
                disabled={isSubmittingReview || selectedRating === 0}
                onClick={submitReview}
                className="w-full bg-[#8B1A1A] text-white py-3.5 rounded-xl text-[14px] font-extrabold hover:bg-red-900 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? (
                  <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
                ) : (
                  "Kirim Ulasan"
                )}
              </button>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
            MODAL POPUP SUKSES ULASAN
        ═══════════════════════════════════ */}
        {showReviewSuccessModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[36px] w-full max-w-[450px] p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="26" fill="#22C55E" fillOpacity="0.2"/>
                    <path d="M14 26L22 34L38 18" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-[24px] font-extrabold text-black mb-3 leading-tight">Ulasan Berhasil Dikirim!</h2>
              <p className="text-gray-600 font-medium text-[14px] mb-8">Terima kasih telah memberikan ulasan. Penilaian Anda sangat berarti bagi kami.</p>
              
              <button
                onClick={() => setShowReviewSuccessModal(false)}
                className="w-full bg-[#8B1A1A] text-white py-3.5 rounded-[16px] font-extrabold text-[16px] hover:bg-red-900 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* Fallback gambar ringan global untuk dipakai ProductRowItem */
const getFallbackImg = (cat: string) => {
  if (cat === 'Minuman') return '/Rectangle 43 (1).png';
  return '/Rectangle 43.png';
}

/* ═══════════════════════════════════
   KOMPONEN BARIS PRODUK
═══════════════════════════════════ */
function ProductRowItem({ item, isCompleted, isReviewed, onOpenReview }: { item: any, isCompleted: boolean, isReviewed: boolean, onOpenReview: () => void }) {
  return (
    <tr key={item.id} className="border-b-[1.5px] border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 flex items-center space-x-4">
        <img 
          src={getFallbackImg(item.category)} 
          alt={item.name} 
          className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100 shrink-0"
        />
        <div>
          <p className="font-extrabold text-black text-[14px]">{item.name}</p>
          {item.notes && <p className="text-[11px] text-gray-500 font-medium italic mt-0.5">Catatan: {item.notes}</p>}
        </div>
      </td>
      <td className="py-4 text-center font-extrabold text-black text-[13px]">
        {item.category}
      </td>
      <td className="py-4 text-center font-bold text-black text-[13px]">
        {item.quantity}
      </td>
      <td className="py-4 text-right font-bold text-black text-[13px]">
        {fmt(item.unitPrice)}
      </td>
      
      {/* Tombol Beri Ulasan */}
      {isCompleted && (
        <td className="py-4 text-center pl-4">
          {isReviewed ? (
            <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-md whitespace-nowrap">
              ✓ Telah Diulas
            </span>
          ) : (
            <button 
              onClick={onOpenReview}
              className="bg-[#8B1A1A] text-white px-4 py-2 rounded-md text-[11px] font-bold hover:bg-red-900 transition-colors shadow-sm whitespace-nowrap active:scale-95"
            >
              Beri Ulasan
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

export default function CashPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-[#8B1A1A]" /></div>}>
      <CashPageInner />
    </Suspense>
  );
}