"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Trash2, Edit, ChevronDown, ChevronUp, ShoppingBag, Loader2 } from "lucide-react";
import { getCustomerCart, updateCartNote, updateCartQuantity } from "@/src/controllers/cart-controller";
import { deleteCartItem, createOrderFromCart } from "@/src/controllers/order-controller";

function getDummyImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes("kentang") || n.includes("snack")) return "/kentang.png";
  if (n.includes("teh") || n.includes("jus") || n.includes("minuman") || n.includes("es")) return "/IconKopi.png";
  return "/burger.png";
}

const categoryFallbacks: Record<string, string> = {
  Nasi: "/nasi goreng.png",
  Mie: "/bakso.png",
  Snack: "/kentang goreng.png",
  Minuman: "/jus semangka.png",
};

const resolveMenuImage = (name: string, categoryName: string, imageUrl?: string | null) =>
  imageUrl || categoryFallbacks[categoryName] || getDummyImage(name);

type CartItem = {
  id: string;
  menuId: string;
  name: string;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
  qty: number;
  note: string;
};

type PaymentOption = "cash" | "gopay" | "dana" | "bank_va";

const PAYMENT_OPTIONS: { value: PaymentOption; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "gopay", label: "GoPay" },
  { value: "dana", label: "DANA / QRIS" },
  { value: "bank_va", label: "Bank (Virtual Account)" },
];

// Step: "orderType" | "detail" | "editNote" | "noteSuccess" | "orderSuccess" | "deleteConfirm"
type ModalStep = "" | "orderType" | "detail" | "editNote" | "noteSuccess" | "orderSuccess" | "deleteConfirm";

export default function KeranjangPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal flow
  const [step, setStep] = useState<ModalStep>("");

  // Tipe pesanan
  const [selectedOrderType, setSelectedOrderType] = useState<"dine_in" | "takeaway" | "">("");

  // Edit catatan
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");

  // Hapus item
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState("");

  // Hasil order
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Payment dropdown di rincian
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | "">("");

  // Loading states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const data = await getCustomerCart();
      setItems(data);
      setIsLoading(false);
    };
    fetchCart();
  }, []);

  const formatPrice = (price: number) => "Rp " + price.toLocaleString("id-ID");
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleUpdateQuantity = async (cartId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    setItems(items.map((i) => (i.id === cartId ? { ...i, qty: newQty } : i)));
    const result = await updateCartQuantity(cartId, newQty);
    if (!result.success) {
      setItems(items.map((i) => (i.id === cartId ? { ...i, qty: currentQty } : i)));
    }
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    const result = await deleteCartItem(deleteItemId);
    if (result.success) {
      setItems(items.filter((i) => i.id !== deleteItemId));
      window.dispatchEvent(new Event("cart-updated"));
    }
    setIsDeleting(false);
    setDeleteItemId(null);
    setStep("");
  };

  const handleSaveNote = () => {
    if (!editingItemId) return;
    startTransition(async () => {
      const result = await updateCartNote(editingItemId, editNoteText);
      if (result.success) {
        setItems(items.map((i) => (i.id === editingItemId ? { ...i, note: editNoteText } : i)));
        setStep("noteSuccess");
      }
    });
  };

  const handleCreateOrder = async () => {
    if (!selectedOrderType) return;
    if (!selectedPayment) {
      toast.error("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }
    setIsCreatingOrder(true);
    const result = await createOrderFromCart(selectedOrderType, selectedPayment);
    setIsCreatingOrder(false);
    if (result.success) {
      setCreatedOrderId(result.orderId || null);
      setStep("orderSuccess");
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu="keranjang" />
      <main className="w-full sm:flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-4 md:p-6 lg:p-12 pb-28 md:pb-24">
          <h1 className="text-2xl md:text-2xl md:text-[32px] font-extrabold text-black mb-6 md:mb-12">Keranjang</h1>

          <div className="bg-transparent mb-8 md:mb-12">
            {/* Header tabel - sembunyikan di mobile, ganti dengan card layout */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-black font-extrabold text-lg mb-8 pb-2 items-center">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-5 pl-4">Produk</div>
              <div className="col-span-2 text-center">Harga</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20 text-[#8B0000]">
                  <Loader2 className="animate-spin w-10 h-10" />
                  <span className="ml-3 font-bold text-lg">Memuat keranjang...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700">Keranjang masih kosong</h3>
                  <p className="text-gray-500 mt-2">Silakan pilih menu favorit Anda di halaman Beranda.</p>
                </div>
              ) : (
                items.map((item, index) => (
                  /* Desktop: grid layout */
                  <div key={item.id} className="hidden md:grid grid-cols-12 gap-4 items-center py-2 h-[100px]">
                    <div className="col-span-1 text-center text-black font-bold text-[15px]">{index + 1}</div>
                    <div className="col-span-5 flex items-center gap-6">
                      <div className="w-[85px] h-[85px] rounded-[18px] overflow-hidden shrink-0 shadow-sm">
                        <img src={resolveMenuImage(item.name, item.categoryName, item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-extrabold text-black text-[18px]">{item.name}</h3>
                        <p className="text-[12px] text-gray-800 font-medium mb-1.5 mt-0.5">Catatan : {item.note || "-"}</p>
                        <button
                          onClick={() => { setEditingItemId(item.id); setEditNoteText(item.note); setStep("editNote"); }}
                          className="flex items-center justify-center gap-1.5 bg-[#FFC107] hover:bg-[#ffcd38] text-black text-[11px] font-extrabold py-1.5 px-4 rounded-full w-max transition-colors mt-0.5 shadow-sm"
                        >
                          <Edit size={12} strokeWidth={2.5} /> Ubah Catatan
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-black font-medium text-[14px]">{formatPrice(item.price)}</div>
                    <div className="col-span-2 flex items-center justify-center gap-4">
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty, 1)} className="flex items-center justify-center w-[24px] h-[24px] bg-[#8B0000] rounded-[4px] hover:opacity-90 transition-opacity">
                        <span className="text-white font-bold select-none leading-none relative -top-[1.5px]">+</span>
                      </button>
                      <span className="font-extrabold text-black w-4 text-center text-[15px]">{item.qty}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty, -1)} disabled={item.qty <= 1} className={`flex items-center justify-center w-[24px] h-[24px] border-[1.5px] border-[#8B0000] bg-transparent rounded-[4px] transition-colors ${item.qty <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}>
                        <span className="text-[#8B0000] font-bold select-none leading-none relative -top-[1.5px]">-</span>
                      </button>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => { setDeleteItemId(item.id); setDeleteItemName(item.name); setStep("deleteConfirm"); }}
                        className="flex items-center justify-center gap-2.5 bg-[#FEE2E2] hover:bg-[#fcd4d4] text-[#8B0000] font-bold py-1.5 px-3.5 rounded-[8px] text-[11px] transition-colors"
                      >
                        <Trash2 size={17} strokeWidth={2.5} /> Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Cart Cards */}
          {!isLoading && items.length > 0 && (
            <div className="md:hidden space-y-4 mb-8">
              {items.map((item, index) => (
                <div key={`mob-${item.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-gray-400 mt-1">{index + 1}</span>
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={resolveMenuImage(item.name, item.categoryName, item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full sm:flex-1 min-w-0">
                      <h3 className="font-extrabold text-black text-[15px] leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-[#8B0000] mt-0.5">{formatPrice(item.price)}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Catatan: {item.note || "-"}</p>
                      <button
                        onClick={() => { setEditingItemId(item.id); setEditNoteText(item.note); setStep("editNote"); }}
                        className="flex items-center gap-1 bg-[#FFC107] text-black text-[10px] font-extrabold py-1 px-3 rounded-full mt-1.5"
                      >
                        <Edit size={10} strokeWidth={2.5} /> Ubah Catatan
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty, 1)} className="flex items-center justify-center w-7 h-7 bg-[#8B0000] rounded-md">
                        <span className="text-white font-bold text-lg leading-none">+</span>
                      </button>
                      <span className="font-extrabold text-black text-[15px] w-5 text-center">{item.qty}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty, -1)} disabled={item.qty <= 1} className={`flex items-center justify-center w-7 h-7 border-[1.5px] border-[#8B0000] rounded-md ${item.qty <= 1 ? 'opacity-50' : ''}`}>
                        <span className="text-[#8B0000] font-bold text-lg leading-none">-</span>
                      </button>
                    </div>
                    <button
                      onClick={() => { setDeleteItemId(item.id); setDeleteItemName(item.name); setStep("deleteConfirm"); }}
                      className="flex items-center gap-1.5 bg-[#FEE2E2] text-[#8B0000] font-bold py-1.5 px-3 rounded-lg text-[11px]"
                    >
                      <Trash2 size={14} strokeWidth={2} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <div className="mt-6 md:mt-12 flex flex-col items-stretch md:items-end pt-4 md:pt-8 md:mr-6 gap-3 pb-20">
              <div className="flex items-center justify-between md:gap-[40px] bg-red-50 md:bg-transparent rounded-xl p-3 md:p-0">
                <span className="text-sm md:text-[18px] font-extrabold text-[#8B0000]">Total yang harus dibayarkan :</span>
                <span className="text-sm md:text-[18px] font-extrabold text-[#8B0000]">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={() => { setSelectedOrderType(""); setStep("orderType"); }}
                className="w-full md:w-[380px] bg-[#8B0000] hover:bg-[#6A0000] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-[14px]"
              >
                Buat Pesanan
              </button>
            </div>
          )}
        </div>

        {/* ===== MODAL: KONFIRMASI HAPUS ===== */}
        {step === "deleteConfirm" && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[2px] border-[#8B0000] rounded-[24px] w-full max-w-[420px] p-5 md:p-8 shadow-2xl text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                  <Trash2 size={32} className="text-[#8B0000]" />
                </div>
              </div>
              <h2 className="text-xl md:text-[22px] font-extrabold text-black mb-2">Hapus Item?</h2>
              <p className="text-gray-600 font-medium text-[14px] mb-8">
                Apakah kamu yakin ingin menghapus <span className="font-extrabold text-black">{deleteItemName}</span> dari keranjang?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => { setStep(""); setDeleteItemId(null); }} className="w-full sm:flex-1 border-[1.5px] border-[#8B0000] text-[#8B0000] py-2 md:py-3 rounded-[10px] font-bold text-sm md:text-[15px] hover:bg-red-50 transition-colors">
                  Batal
                </button>
                <button onClick={handleDeleteConfirm} disabled={isDeleting} className="w-full sm:flex-1 bg-[#8B0000] text-white py-2 md:py-3 rounded-[10px] font-bold text-sm md:text-[15px] hover:bg-[#6A0000] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {isDeleting ? <><Loader2 size={16} className="animate-spin" /> Menghapus...</> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: PILIH TIPE PESANAN ===== */}
        {step === "orderType" && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[2px] border-[#8B0000] rounded-[24px] md:rounded-[32px] w-full max-w-[800px] p-6 md:p-10 pt-8 md:pt-14 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl md:text-[38px] font-extrabold text-black mb-6 md:mb-12 tracking-tight text-center leading-snug">Pilih Tipe Pesanan Anda</h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-14 justify-center px-0 md:px-4">
                <div onClick={() => setSelectedOrderType("dine_in")} className={`flex-1 flex flex-col items-center justify-start p-6 md:p-10 rounded-[20px] md:rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[220px] md:min-h-[300px] ${selectedOrderType === "dine_in" ? "bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.6)]" : "bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60"}`}>
                  <div className="relative w-20 h-20 md:w-28 md:h-28 mb-4 md:mb-8 flex items-center justify-center">
                    <img src="/makanditempat.png" alt="Makan Ditempat" className="object-contain w-full h-full" />
                  </div>
                  <h3 className="text-xl md:text-[26px] font-extrabold text-[#8B0000] mb-2 md:mb-4 text-center">Makan Di tempat</h3>
                  <p className="text-black font-medium text-sm md:text-[15px] text-center px-2 md:px-4 leading-relaxed">Rasakan Makanan nikmat anda langsung di DE CAFENTA</p>
                </div>
                <div onClick={() => setSelectedOrderType("takeaway")} className={`flex-1 flex flex-col items-center justify-start p-6 md:p-10 rounded-[20px] md:rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[220px] md:min-h-[300px] ${selectedOrderType === "takeaway" ? "bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.6)]" : "bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60"}`}>
                  <div className="relative w-20 h-20 md:w-28 md:h-28 mb-4 md:mb-8 flex items-center justify-center">
                    <img src="/bawapulang.png" alt="Bawa Pulang" className="object-contain w-full h-full" />
                  </div>
                  <h3 className="text-xl md:text-[26px] font-extrabold text-[#8B0000] mb-2 md:mb-4 text-center">Bawa Pulang</h3>
                  <p className="text-black font-medium text-sm md:text-[15px] text-center px-2 md:px-4 leading-relaxed">Bawa Pulang menu terbaik DE CAFENTA untuk di bawa pulang</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 px-0 md:px-10">
                <button onClick={() => setStep("")} className="w-full sm:w-auto sm:flex-1 bg-white border-[2px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] hover:bg-gray-50 transition-colors">Batal</button>
                <button
                  onClick={() => { if (selectedOrderType) setStep("detail"); }}
                  disabled={!selectedOrderType}
                  className="w-full sm:w-auto sm:flex-1 bg-[#8B0000] border-[2px] border-[#8B0000] text-white py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] hover:bg-[#6A0000] transition-colors disabled:opacity-50"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: RINCIAN PESANAN ===== */}
        {step === "detail" && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[2px] border-[#8B0000] rounded-[24px] w-full max-w-[650px] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl md:text-[32px] font-extrabold text-black mb-8 tracking-tight">Rincian Pesanan</h2>
              <div className="mb-8">
                <div className="grid grid-cols-12 bg-[#FFD1D1] py-3.5 px-6 rounded-xl mb-4">
                  <div className="col-span-6 font-extrabold text-black text-[16px]">Produk</div>
                  <div className="col-span-3 font-extrabold text-black text-center text-[16px]">Jumlah</div>
                  <div className="col-span-3 font-extrabold text-black text-right text-[16px]">Harga</div>
                </div>
                <div className="space-y-4 px-6">
                  {items.map((item, idx) => (
                    <React.Fragment key={item.id || idx}>
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-6 text-black font-semibold text-[15px]">{item.name}</div>
                        <div className="col-span-3 text-black text-center font-semibold text-[15px]">{item.qty}</div>
                        <div className="col-span-3 text-black text-right font-semibold text-[15px]">{formatPrice(item.price)}</div>
                      </div>
                      <div className="h-[1.5px] w-full bg-gray-300"></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-8 px-2">
                <h3 className="font-extrabold text-black text-[18px]">Tipe Pesanan</h3>
                <p className="text-[14px] text-black font-medium mb-4">{selectedOrderType === "dine_in" ? "Makan Di Tempat" : "Bawa Pulang"}</p>
              </div>

              <div className="mb-8 px-2">
                <h3 className="font-extrabold text-black text-[18px]">Pilih Metode Pembayaran</h3>
                <p className="text-[14px] text-black font-medium mb-4">Pilihlah metode pembayaran andalan Anda</p>
                <div className="border-[1.5px] border-[#8B0000] rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                    className="w-full p-3 flex justify-between items-center text-[#8B0000] font-medium text-[14px]"
                  >
                    <span>
                      {selectedPayment
                        ? PAYMENT_OPTIONS.find((opt) => opt.value === selectedPayment)?.label
                        : "Pilih Metode Pembayaran"}
                    </span>
                    {isPaymentOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isPaymentOpen && (
                    <div className="bg-white border-t border-[#8B0000]">
                      {PAYMENT_OPTIONS.map((opt, idx) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => {
                            setSelectedPayment(opt.value);
                            setIsPaymentOpen(false);
                          }}
                          className={`w-full p-3 text-left text-[#8B0000] font-medium text-[14px] hover:bg-red-50 transition-colors ${idx !== PAYMENT_OPTIONS.length - 1 ? "border-b border-[#8B0000]" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t-[1.5px] border-black mb-10 pt-4 flex justify-between items-end px-2">
                <div className="flex flex-col gap-0.5">
                  <div className="text-black font-bold text-[16px]">Total Menu</div>
                  <div className="text-black font-extrabold text-xl md:text-[22px]">{items.length} Menu</div>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <div className="text-black font-bold text-[16px]">Total Harga</div>
                  <div className="text-[#8B0000] font-extrabold text-xl md:text-[22px]">{formatPrice(totalPrice)}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5">
                <button onClick={() => setStep("orderType")} className="border-[1.5px] border-[#8B0000] text-[#8B0000] px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-[8px] font-bold text-sm md:text-[15px] hover:bg-red-50 transition-colors">Batal</button>
                <button
                  onClick={handleCreateOrder} 
                  disabled={isCreatingOrder} 
                  className="bg-[#8B0000] border-[1.5px] border-[#8B0000] text-white px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-[8px] font-bold text-sm md:text-[15px] hover:bg-[#6A0000] transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isCreatingOrder ? (
                    <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                  ) : (
                    "Lanjutkan"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: EDIT CATATAN ===== */}
        {step === "editNote" && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[650px] p-6 md:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <img src="/rincian.png" alt="" className="w-12 h-12" />
                <h2 className="text-[38px] font-extrabold text-black tracking-tight mt-1">Edit Catatan</h2>
              </div>
              <div className="mb-10 w-full">
                <textarea
                  value={editNoteText}
                  onChange={(e) => setEditNoteText(e.target.value)}
                  className="w-full bg-[#F0F2F5] border border-gray-300 rounded-[12px] p-5 text-[18px] text-black min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/50 resize-none font-medium placeholder:text-gray-400"
                  placeholder="Jangan pedas"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => setStep("detail")} className="w-full sm:flex-1 border-[1.5px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] hover:bg-red-50 transition-colors">Batalkan</button>
                <button
                  disabled={isPending}
                  onClick={handleSaveNote}
                  className="w-full sm:flex-1 bg-[#8B0000] hover:bg-[#6A0000] text-white py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isPending ? <><Loader2 size={20} className="animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: CATATAN BERHASIL DIUBAH ===== */}
        {step === "noteSuccess" && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[500px] p-6 md:p-12 text-center shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="26" fill="#22C55E" fillOpacity="0.2"/>
                    <path d="M14 26L22 34L38 18" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-black mb-3">Catatan berhasil diubah!</h2>
              <p className="text-gray-600 font-medium text-[15px] mb-8">Catatan untuk menu pesanan anda sudah berhasil diubah</p>
              
              <button
                onClick={() => setStep("")} 
                className="w-full bg-[#8B0000] text-white py-4 rounded-[16px] font-extrabold text-[18px] hover:bg-[#6A0000] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* ===== MODAL: PESANAN BERHASIL DIBUAT ===== */}
        {step === "orderSuccess" && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[650px] p-6 md:p-12 text-center shadow-2xl">
              <div className="flex justify-center mb-1">
                <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                  <img src="/pesanansukses.png" alt="Pesanan Sukses" />
                </div>
              </div>
              <h2 className="text-3xl md:text-[36px] font-extrabold text-black mb-4 tracking-tight">Pesanan Berhasil dibuat!</h2>
              <p className="text-black font-medium text-[18px] leading-relaxed mb-12 px-6">
                Selamat pesanan anda berhasil di buat<br />
                silahkan lanjutkan pembayaran untuk menyelesaikan<br />
                pesanan anda
              </p>
              <div className="flex flex-col gap-4 px-10">
                <button
                  onClick={() => { 
                    setStep(""); 
                    router.push(`/customer/detail_pesanan/cash?orderId=${createdOrderId}`); 
                  }}
                  className="w-full bg-[#8B0000] text-white py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
                >
                  Periksa Pesanan
                </button>
                <button
                  onClick={() => { 
                    setStep("");
                    setItems([]); 
                    router.refresh(); 
                  }}
                  className="w-full bg-white border-[2px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-red-50 transition-colors"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}