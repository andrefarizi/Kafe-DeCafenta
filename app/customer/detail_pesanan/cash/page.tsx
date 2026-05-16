"use client";

import React, {
  useEffect, useState, useRef, Suspense, useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/customer/components/sidebar";
import Topbar from "@/app/customer/components/topbar";
import {
  ChevronLeft, RotateCcw, ClipboardList, CookingPot,
  Package, Check, Loader2, Copy, CheckCircle2,
} from "lucide-react";
import { getOrderDetail } from "@/src/controllers/order-controller";
import { useSession } from "next-auth/react";

/* ─────────── TYPES ─────────── */
type OrderDetail = {
  id: string; orderCode: string; status: string;
  totalPrice: number; isPaid: boolean; paymentMethod: string;
  orderType: string; orderedAt: string;
  items: { id: string; name: string; category: string; quantity: number; unitPrice: number; subtotal: number; notes: string }[];
};
type PaymentMethod = "gopay" | "dana" | "bank_va";

/* ─────────── CONSTANTS ─────────── */
const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  gopay: "GoPay", dana: "DANA / QRIS", bank_va: "Bank (Virtual Account BCA)",
};

const STEPS = [
  { key: "masuk",        label: "Masuk",        color: "#FFC700" },
  { key: "dimasak",      label: "Dimasak",       color: "#8B0000" },
  { key: "siap_diambil", label: "Siap Diambil",  color: "#0077D9" },
  { key: "selesai",      label: "Selesai",        color: "#22C55E" },
] as const;

// Warna ring pulse per step
const PULSE_RING_CLASS: Record<string, string> = {
  masuk:        "pulse-ring-yellow",
  dimasak:      "pulse-ring-red",
  siap_diambil: "pulse-ring-blue",
  selesai:      "pulse-ring-green",
};

// CSS kelas shimmer untuk garis antar-step (Gojek-style)
const LINE_PULSE_CLASS: Record<string, string> = {
  masuk:        "line-pulse-yellow",
  dimasak:      "line-pulse-red",
  siap_diambil: "line-pulse-blue",
  selesai:      "line-pulse-green",
};

const fmt = (p: number) => "Rp " + p.toLocaleString("id-ID");

/* ═══════════════════════════════════
   STATUS TRACKER COMPONENT
═══════════════════════════════════ */
const STATUS_LABEL: Record<string, { label: string; color: string; emoji: string }> = {
  masuk:        { label: "Pesanan Masuk",       color: "#FFC700", emoji: "📋" },
  dimasak:      { label: "Sedang Dimasak",      color: "#8B0000", emoji: "👨‍🍳" },
  siap_diambil: { label: "Siap Diambil!",       color: "#0077D9", emoji: "📦" },
  selesai:      { label: "Pesanan Selesai! 🎉", color: "#22C55E", emoji: "✅" },
};

function StatusTracker({
  currentStatus,
  prevStatus,
}: {
  currentStatus: string;
  prevStatus: string | null;
}) {
  const currentIdx   = STEPS.findIndex(s => s.key === currentStatus);
  const prevIdx      = STEPS.findIndex(s => s.key === prevStatus);
  const justAdvanced = prevStatus !== null && currentIdx > prevIdx;

  const icons = [
    <ClipboardList key="0" size={26} className={currentIdx >= 0 ? "text-white" : "text-gray-400"} strokeWidth={2.5} />,
    <CookingPot    key="1" size={26} className={currentIdx >= 1 ? "text-white" : "text-gray-400"} strokeWidth={2.5} />,
    <Package       key="2" size={26} className={currentIdx >= 2 ? "text-white" : "text-gray-400"} strokeWidth={2.5} />,
    <Check         key="3" size={36} className={currentIdx >= 3 ? "text-white" : "text-gray-400"} strokeWidth={2.5} />,
  ];

  // Segmen garis: ada 3 segmen (antara 4 step)
  // "done"    → sudah dilewati, solid warna step kanan
  // "active"  → sedang berjalan (currentIdx → currentIdx+1), shimmer berwarna step kiri
  // "pending" → belum dilewati, abu-abu
  const segments = STEPS.slice(0, -1).map((_, i) => {
    if (i < currentIdx)   return "done";
    if (i === currentIdx) return "active";
    return "pending";
  });

  return (
    <div className="relative flex items-start justify-between w-full" style={{ paddingTop: 6, paddingBottom: 6 }}>

      {/* ── SEGMEN GARIS ANTAR-STEP ── */}
      {segments.map((segStatus, i) => {
        const leftStep  = STEPS[i];
        const rightStep = STEPS[i + 1];
        const isDone    = segStatus === "done";
        const isActive  = segStatus === "active";
        const segWidth  = `calc((100% - 68px) / ${STEPS.length - 1})`;
        const segLeft   = `calc(34px + (100% - 68px) * ${i / (STEPS.length - 1)})`;

        // Base color segmen aktif: warna status saat ini tapi transparan (shimmer di atasnya)
        const activeBaseBg = leftStep.color + "40"; // hex opacity ~25%

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 40,
              left: segLeft,
              width: segWidth,
              height: 8,
              borderRadius: 9999,
              zIndex: isDone ? 2 : isActive ? 3 : 0,
              overflow: "hidden",
              background: isDone ? rightStep.color : isActive ? activeBaseBg : "#E5E7EB",
              transition: "background 0.5s ease",
            }}
          >
            {/* Shimmer traveling pulse untuk segmen aktif (Gojek-style, kiri→kanan) */}
            {isActive && (
              <div className={LINE_PULSE_CLASS[leftStep.key]} />
            )}
          </div>
        );
      })}


      {/* ── STEP CIRCLES ── */}
      {STEPS.map((step, idx) => {
        const active    = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const isNewStep = justAdvanced && idx === currentIdx;
        const color     = active ? step.color : "#D1D5DB";

        return (
          <div key={step.key} className="flex flex-col items-center" style={{ zIndex: 10, position: "relative" }}>
            <div style={{ position: "relative", width: 68, height: 68 }}>

              {/* Outer ring pulse (lebih besar, delay 0.5s) — Gojek double-ring */}
              {isCurrent && (
                <div className={`pulse-ring-outer ${PULSE_RING_CLASS[step.key]}`} />
              )}

              {/* Inner ring pulse */}
              {isCurrent && (
                <div className={`pulse-ring ${PULSE_RING_CLASS[step.key]}`} />
              )}

              {/* Lingkaran step */}
              <div
                style={{
                  width: 68, height: 68,
                  borderRadius: "50%",
                  border: `4px solid ${color}`,
                  padding: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.4s ease",
                  animation: isNewStep ? "step-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
                  position: "relative",
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    width: "100%", height: "100%",
                    borderRadius: "50%",
                    backgroundColor: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.4s ease",
                  }}
                >
                  {icons[idx]}
                </div>
              </div>
            </div>

            <span
              style={{
                marginTop: 12,
                fontSize: 14,
                fontWeight: 800,
                color: active ? "#000" : "#9CA3AF",
                whiteSpace: "nowrap",
                transition: "color 0.4s ease",
              }}
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
   STATUS UPDATE TOAST
═══════════════════════════════════ */
function StatusUpdateToast({ status, onClose }: { status: string; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);
  const info = STATUS_LABEL[status] ?? { label: status, color: "#333", emoji: "🔔" };
  const close = () => { setExiting(true); setTimeout(onClose, 350); };
  useEffect(() => { const t = setTimeout(close, 5000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 ${exiting ? "status-toast-exit" : "status-toast-enter"}`}>
      <div
        className="flex items-center gap-3 rounded-2xl shadow-2xl px-5 py-3 text-white"
        style={{ background: info.color, minWidth: 220 }}
      >
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

/* ═══════════════════════════════════
   FLOATING SUCCESS BANNER
═══════════════════════════════════ */
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
          setPrevStatus(prev.status); // trigger animasi garis
          if (!isFirstLoad.current) {
            setShowStatusToast(true); // toast hanya saat update, bukan load pertama
          }
        }
        return data;
      });
      isFirstLoad.current = false;
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
          router.refresh(); // <-- Paksa Next.js hapus cache client-side
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
        router.refresh(); // <-- Paksa Next.js hapus cache client-side
      }
    } finally { setIsPolling(false); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  /* ── loading / not found ── */
  if (isLoading) return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar activeMenu="pesanan" />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#8A0000]" />
      </main>
    </div>
  );
  if (!order) return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar activeMenu="pesanan" />
      <main className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500 font-medium">Pesanan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="bg-[#8A0000] text-white px-6 py-2 rounded-lg font-bold">Kembali</button>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      {showSuccessBanner && <PaymentSuccessBanner onClose={() => setShowSuccessBanner(false)} />}
      {showStatusToast && order && <StatusUpdateToast status={order.status} onClose={() => setShowStatusToast(false)} />}

      <Sidebar activeMenu="pesanan" />
      <main className="flex-1 flex flex-col h-screen overflow-hidden text-left">
        <div className="flex-none"><Topbar /></div>

        <div className="p-5 w-full overflow-y-auto">

          {/* ── Header ── */}
          <div className="flex justify-between items-start mb-4 w-full">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-1 border rounded-md bg-white hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <div className="text-left">
                <h1 className="text-xl font-bold text-black leading-tight">Detail Pesanan</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-[#8A0000] text-xs">#{order.orderCode}</span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase text-white"
                    style={{ backgroundColor: STEPS.find(s => s.key === order.status)?.color || "#333" }}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[#8A0000] font-bold text-[10px] mt-6">
              {new Date(order.orderedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* ── STATUS TRACKER CARD ── */}
          <div className="bg-white rounded-lg border border-[#8A0000] p-6 mb-6 shadow-sm w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[#8A0000] font-bold text-[12px]">Status Pesanan</h2>
              <button
                onClick={loadOrder}
                className="flex items-center gap-1 bg-[#8A0000] text-white text-[9px] px-2 py-1 rounded-md hover:bg-[#6A0000] transition-colors"
              >
                <RotateCcw size={10} /> Refresh Status
              </button>
            </div>

            {/* Status tracker dengan animasi gradien */}
            <div className="mb-4">
              <StatusTracker
                currentStatus={order.status}
                prevStatus={prevStatus}
              />
            </div>
          </div>

          {/* ── Pembayaran Section ── */}
          <section className="mb-6 flex flex-col gap-4 w-full text-left">
            <div>
              <h3 className="font-bold text-lg text-black">Pembayaran</h3>
              <p className="text-[11px] text-gray-500">Selesaikan pembayaran untuk melanjutkan pesanan anda</p>
            </div>

            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-bold text-black">Tipe Pesanan</h3>
                <p className="text-xs text-gray-700 font-medium">{order.orderType}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">Status Pembayaran</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold ${order.isPaid ? "bg-[#22C55E]" : "bg-[#484040]"}`}>
                  {order.isPaid && <CheckCircle2 size={11} />}
                  {order.isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                </span>
              </div>
            </div>

            {/* Form Pembayaran */}
            {!order.isPaid && !paymentResult && (
              <div className="border border-[#8A0000] rounded-xl p-4 bg-white w-full max-w-[420px]">
                <h3 className="font-bold text-[14px] text-black mb-3">Pilih Metode Pembayaran</h3>
                <div className="border-[1.5px] border-[#8B0000] rounded-xl overflow-hidden bg-white mb-4">
                  <div onClick={() => setIsPaymentOpen(!isPaymentOpen)} className="p-3 flex justify-between items-center text-[#8B0000] font-medium text-[14px] cursor-pointer">
                    <span>{selectedMethod ? PAYMENT_LABELS[selectedMethod] : "Pilih Metode"}</span>
                    <ChevronLeft size={18} className={`transition-transform duration-200 ${isPaymentOpen ? "-rotate-90" : "rotate-[270deg]"}`} />
                  </div>
                  {isPaymentOpen && (
                    <div className="bg-white border-t border-[#8B0000]">
                      {(Object.entries(PAYMENT_LABELS) as [PaymentMethod, string][]).map(([key, label], idx, arr) => (
                        <div key={key} onClick={() => { setSelectedMethod(key); setIsPaymentOpen(false); }}
                          className={`p-3 flex items-center text-[#8B0000] font-medium text-[14px] cursor-pointer hover:bg-red-50 transition-colors ${idx !== arr.length - 1 ? "border-b border-[#8B0000]" : ""}`}>
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {paymentError && <p className="text-red-600 text-[12px] font-medium mb-3">{paymentError}</p>}
                <button onClick={handlePay} disabled={!selectedMethod || isProcessing}
                  className="w-full bg-[#8A0000] text-white py-3 rounded-lg font-bold text-[13px] hover:bg-[#6A0000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Bayar Sekarang"}
                </button>
              </div>
            )}

            {/* Instruksi setelah charge */}
            {paymentResult && !order.isPaid && (
              <div className="border border-[#8A0000] rounded-xl p-4 bg-white w-full max-w-[420px] space-y-3">
                <h3 className="font-bold text-[14px] text-black">Instruksi Pembayaran</h3>
                <p className="text-[12px] text-gray-500">Status: <span className="font-bold text-[#D8A700] capitalize">{String((paymentResult).transaction_status || "")}</span></p>

                {/* QR / deeplink GoPay */}
                {Array.isArray(paymentResult.actions) && (
                  <div className="space-y-2">
                    {(paymentResult.actions as Record<string, string>[]).map((a, i) => {
                      if (a.name === "generate-qr-code") return (
                        <div key={i}><p className="text-[12px] font-bold text-black mb-1">Scan QR Code:</p>
                          <img src={a.url} alt="QR" className="w-32 h-32 border border-gray-200 rounded" />
                        </div>
                      );
                      if (a.name === "deeplink-redirect") return (
                        <a key={i} href={a.url} className="block bg-[#8A0000] text-white text-center py-2 rounded-lg text-[12px] font-bold">Buka GoPay</a>
                      );
                      return null;
                    })}
                  </div>
                )}

                {/* VA BCA */}
                {Array.isArray(paymentResult.va_numbers) && (
                  <div>
                    <p className="text-[12px] font-bold text-black mb-1">Nomor Virtual Account BCA:</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleCopy((paymentResult.va_numbers as Record<string,string>[])[0]?.va_number || "")} className="text-[#8A0000] hover:text-[#6A0000]">
                        <Copy size={14} />
                      </button>
                      <span className="text-xs font-mono font-bold text-gray-700">
                        {(paymentResult.va_numbers as Record<string,string>[])[0]?.va_number}
                      </span>
                      {copied && <span className="text-[10px] text-green-600 font-bold">✓ Disalin!</span>}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Bank: BCA • Bayar sebelum transaksi expired</p>
                  </div>
                )}

                <button onClick={handleCheckStatus} disabled={isPolling}
                  className="w-full border border-[#8A0000] text-[#8A0000] py-2 rounded-lg text-[12px] font-bold hover:bg-red-50 flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors">
                  {isPolling ? <><Loader2 size={12} className="animate-spin" /> Mengecek...</> : <><RotateCcw size={12} /> Cek Status Pembayaran</>}
                </button>
                {isPolling && <p className="text-[10px] text-gray-400 text-center">🔄 Menunggu konfirmasi otomatis…</p>}
              </div>
            )}

            {/* Sudah bayar */}
            {order.isPaid && (
              <div className="border border-[#22C55E] rounded-xl p-4 bg-[#F0FFF4] w-full max-w-[420px]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={18} className="text-[#16A34A]" />
                  <h3 className="font-bold text-[14px] text-[#16A34A]">Pembayaran Terverifikasi</h3>
                </div>
                <p className="text-[12px] text-gray-600">Pesanan anda sedang diproses oleh dapur. Pantau status di atas.</p>
              </div>
            )}
          </section>

          {/* ── Tabel Produk ── */}
          <div className="overflow-x-auto mb-6 w-full text-left">
            <table className="w-full">
              <thead>
                <tr className="text-black border-b border-gray-200">
                  <th className="pb-2 font-bold text-[11px] text-left">Produk</th>
                  <th className="pb-2 font-bold text-[11px] text-center">Kategori</th>
                  <th className="pb-2 font-bold text-[11px] text-center">Jumlah</th>
                  <th className="pb-2 font-bold text-[11px] text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-3">
                      <p className="font-bold text-black text-[11px]">{item.name}</p>
                      {item.notes && <p className="text-[9px] text-gray-500 italic">Catatan: {item.notes}</p>}
                    </td>
                    <td className="py-3 text-center font-bold text-black text-[11px]">{item.category}</td>
                    <td className="py-3 text-center font-bold text-black text-[11px]">{item.quantity}</td>
                    <td className="py-3 text-right font-bold text-black text-[11px]">{fmt(item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-black mt-4 pt-2 flex justify-end">
              <h2 className="text-base font-bold text-[#8A0000]">Total {order.items.length} Menu : {fmt(order.totalPrice)}</h2>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function CashPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-[#8A0000]" /></div>}>
      <CashPageInner />
    </Suspense>
  );
}