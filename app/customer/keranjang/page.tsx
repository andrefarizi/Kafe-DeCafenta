"use client";

import React, { useState, useEffect, useTransition } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Trash2, Edit, ChevronDown, ChevronUp, ShoppingBag, Loader2 } from "lucide-react";
import { 
  getCustomerCart, 
  updateCartNote, 
  updateCartQuantity 
} from "@/src/controllers/cart-controller"; 

// --- HELPER UNTUK GAMBAR ---
function getDummyImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes('kentang') || n.includes('snack')) return '/kentang.png';
  if (n.includes('teh') || n.includes('jus') || n.includes('minuman') || n.includes('es')) return '/IconKopi.png';
  return '/burger.png';
}

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const resolveMenuImage = (name: string, categoryName: string, imageUrl?: string | null) => {
  return imageUrl || categoryFallbacks[categoryName] || getDummyImage(name);
};
// ----------------------------

// Tipe data item keranjang yang ditarik dari database
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

export default function KeranjangPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  
  // Perhatikan tipe datanya diubah jadi string karena ID Prisma (CUID) adalah string
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  
  const [selectedOrderType, setSelectedOrderType] = useState<"dine_in" | "takeaway" | "">("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");

  // State untuk data database & loading
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const data = await getCustomerCart();
      setItems(data);
      setIsLoading(false);
    };

    fetchCart();
  }, []);

  const formatPrice = (price: number) => {
    return "Rp " + price.toLocaleString("id-ID");
  };

  const handleUpdateQuantity = async (cartId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    
    // Jangan lakukan apa-apa jika kuantitas mau dikurangi di bawah 1
    if (newQty < 1) return;

    // 1. OPTIMISTIC UPDATE: Ubah UI secara instan agar terasa super cepat!
    setItems(items.map(item => 
      item.id === cartId ? { ...item, qty: newQty } : item
    ));

    // 2. Simpan ke database secara diam-diam di background
    const result = await updateCartQuantity(cartId, newQty);

    // 3. Jika ternyata database gagal/error, kembalikan angka di UI ke posisi semula (Revert)
    if (!result.success) {
      setItems(items.map(item => 
        item.id === cartId ? { ...item, qty: currentQty } : item
      ));
      alert(result.message);
    }
  };

  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu="keranjang" />

      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-6 lg:p-12 pb-24">
          <h1 className="text-[32px] font-extrabold text-black mb-12">Keranjang</h1>

          <div className="bg-transparent mb-12">
            <div className="grid grid-cols-12 gap-4 text-black font-extrabold text-lg mb-8 pb-2 items-center">
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
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-2 h-[100px]">
                    <div className="col-span-1 text-center text-black font-bold text-[15px]">{index + 1}</div>
                    
                    <div className="col-span-5 flex items-center gap-6">
                      <div className="w-[85px] h-[85px] rounded-[18px] overflow-hidden shrink-0 shadow-sm">
                        {/* Menggunakan fungsi resolveMenuImage seperti di Beranda */}
                        <img 
                          src={resolveMenuImage(item.name, item.categoryName, item.imageUrl)} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-extrabold text-black text-[18px]">{item.name}</h3>
                        <p className="text-[12px] text-gray-800 font-medium mb-1.5 mt-0.5">Catatan : {item.note || "-"}</p>
                        <button 
                          onClick={() => {
                            setEditingItemId(item.id);
                            setEditNoteText(item.note);
                            setIsEditNoteOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 bg-[#FFC107] hover:bg-[#ffcd38] text-black text-[11px] font-extrabold py-1.5 px-4 rounded-full w-max transition-colors mt-0.5 shadow-sm"
                        >
                          <Edit size={12} strokeWidth={2.5} /> Ubah Catatan
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center text-black font-medium text-[14px]">
                      {formatPrice(item.price)}
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-center gap-4">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.qty, 1)}
                        className="flex items-center justify-center w-[24px] h-[24px] bg-[#8B0000] rounded-[4px] hover:opacity-90 transition-opacity active:scale-90"
                      >
                        <span className="text-white font-bold select-none leading-none relative -top-[1.5px]">+</span>
                      </button>

                      <span className="font-extrabold text-black w-4 text-center text-[15px]">{item.qty}</span>

                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.qty, -1)}
                        className={`flex items-center justify-center w-[24px] h-[24px] border-[1.5px] border-[#8B0000] bg-transparent rounded-[4px] transition-colors active:scale-90 ${item.qty <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        disabled={item.qty <= 1} // Matikan tombol jika kuantitas 1
                      >
                        <span className="text-[#8B0000] font-bold select-none leading-none relative -top-[1.5px]">-</span>
                      </button>
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                      <button className="flex items-center justify-center gap-2.5 bg-[#FEE2E2] hover:bg-[#fcd4d4] text-[#8B0000] font-bold py-1.5 px-3.5 rounded-[8px] text-[11px] transition-colors">
                        <Trash2 size={17} strokeWidth={2.5} /> Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Menampilkan total hanya jika data sudah di-load dan tidak kosong */}
          {!isLoading && items.length > 0 && (
            <div className="mt-12 flex flex-col items-end pt-8 mr-6">
              <div className="flex items-center gap-[40px] mb-8">
                <span className="text-[18px] font-extrabold text-[#8B0000]">Total yang harus dibayarkan :</span>
                <span className="text-[18px] font-extrabold text-[#8B0000]">{formatPrice(totalPrice)}</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-[380px] bg-[#8B0000] hover:bg-[#6A0000] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-[14px]">
                Buat Pesanan
              </button>
            </div>
          )}
        </div>

        {/* MODAL RINCIAN PESANAN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[2px] border-[#8B0000] rounded-[24px] w-full max-w-[650px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-[32px] font-extrabold text-black mb-8 tracking-tight">Rincian Pesanan</h2>

              {/* Table */}
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

              {/* Payment Method */}
              <div className="mb-8 px-2">
                <h3 className="font-extrabold text-black text-[18px]">Pilih Metode Pembayaran</h3>
                <p className="text-[14px] text-black font-medium mb-4">Pilihlah Metode Pembayaran Andalan anda</p>

                <div className="border-[1.5px] border-[#8B0000] rounded-xl overflow-hidden bg-white w-full max-w-[400px]">
                  <div 
                    onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                    className="p-3.5 border-b-[1.5px] border-[#8B0000] flex justify-between items-center text-[#8B0000] font-medium text-[15px] cursor-pointer bg-white"
                  >
                    <span>{selectedPayment || "Pilih Metode Pembayaran"}</span>
                    <ChevronDown size={20} strokeWidth={2.5} className={`transition-transform ${isPaymentOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isPaymentOpen && (
                    <div className="bg-white">
                      {["Cash", "Gopay", "Dana", "Bank ( Virtual Account )"].map((method, idx, arr) => (
                        <div 
                          key={method}
                          onClick={() => {
                            setSelectedPayment(method);
                            setIsPaymentOpen(false);
                          }}
                          className={`p-3.5 flex justify-between items-center text-[#8B0000] font-medium text-[15px] cursor-pointer hover:bg-red-50 transition-colors ${idx !== arr.length - 1 ? 'border-b-[1.5px] border-[#8B0000]' : ''}`}
                        >
                          <span>{method}</span>
                          <ChevronUp size={20} strokeWidth={2.5} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t-[1.5px] border-black mb-10 pt-4 flex justify-between items-end px-2">
                <div className="flex flex-col gap-0.5">
                  <div className="text-black font-bold text-[16px]">Total Menu</div>
                  <div className="text-black font-extrabold text-[22px]">{items.length} Menu</div>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <div className="text-black font-bold text-[16px]">Total Harga</div>
                  <div className="text-[#8B0000] font-extrabold text-[22px]">
                    {formatPrice(totalPrice)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-5">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="border-[1.5px] border-[#8B0000] text-[#8B0000] px-8 py-2.5 rounded-[8px] font-bold text-[15px] hover:bg-red-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsOrderTypeOpen(true);
                  }}
                  className="bg-[#8B0000] border-[1.5px] border-[#8B0000] text-white px-8 py-2.5 rounded-[8px] font-bold text-[15px] hover:bg-[#6A0000] transition-colors"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TIPE PESANAN */}
        {isOrderTypeOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[2px] border-[#8B0000] rounded-[32px] w-full max-w-[800px] p-10 pt-14 shadow-2xl">
              <h2 className="text-[38px] font-extrabold text-black mb-12 tracking-tight text-center leading-snug">Pilih Tipe Pesanan Anda</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-14 justify-center px-4">
                <div 
                  onClick={() => setSelectedOrderType("dine_in")}
                  className={`flex-1 flex flex-col items-center justify-start p-10 rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[300px] ${
                    selectedOrderType === "dine_in" 
                      ? 'bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.6)]' 
                      : 'bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60'
                  }`}
                >
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center pointer-events-none">
                    <img src="/makanditempat.png" alt="Makan Ditempat" />
                  </div>
                  <h3 className="text-[26px] font-extrabold text-[#8B0000] mb-4 text-center">Makan Di tempat</h3>
                  <p className="text-black font-medium text-[15px] text-center px-4 leading-relaxed">
                    Rasakan Makanan nikmat anda langsung di DE CAFENTA
                  </p>
                </div>

                <div 
                  onClick={() => setSelectedOrderType("takeaway")}
                  className={`flex-1 flex flex-col items-center justify-start p-10 rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[300px] ${
                    selectedOrderType === "takeaway" 
                      ? 'bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.6)]' 
                      : 'bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60'
                  }`}
                >
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center pointer-events-none">
                    <img src="/bawapulang.png" alt="Bawa Pulang" />
                  </div>
                  <h3 className="text-[26px] font-extrabold text-[#8B0000] mb-4 text-center">Bawa Pulang</h3>
                  <p className="text-black font-medium text-[15px] text-center px-4 leading-relaxed">
                    Bawa Pulang menu terbaik DE CAFENTA untuk di bawa pulang
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-6 px-10">
                <button 
                  onClick={() => setIsOrderTypeOpen(false)}
                  className="flex-1 bg-white border-[2px] border-[#8B0000] text-[#8B0000] py-4 rounded-[14px] font-extrabold text-[18px] hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    setIsOrderTypeOpen(false);
                    setIsSuccessOpen(true);
                  }}
                  className="flex-1 bg-[#8B0000] border-[2px] border-[#8B0000] text-white py-4 rounded-[14px] font-extrabold text-[18px] hover:bg-[#6A0000] transition-colors"
                >
                  Buat Pesanan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PESANAN BERHASIL DIBUAT */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[650px] p-12 text-center shadow-2xl">
              <div className="flex justify-center mb-1">
                <div className="relative w-40 h-40">
                  <div className="relative w-40 h-40 mb-8 flex items-center justify-center pointer-events-none">
                    <img src="/pesanansukses.png" alt="Pesanan Sukses" />
                  </div>
                </div>
              </div>

              <h2 className="text-[36px] font-extrabold text-black mb-4 tracking-tight">Pesanan Berhasil dibuat!</h2>
              
              <p className="text-black font-medium text-[18px] leading-relaxed mb-12 px-6">
                Selamat pesanan anda berhasil di buat<br />
                silahkan lanjutkan pembayaran untuk menyelesaikan<br />
                pesanan anda
              </p>

              <div className="flex flex-col gap-4 px-10">
                <button 
                  onClick={() => {
                    setIsSuccessOpen(false);
                  }}
                  className="w-full bg-[#8B0000] text-white py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
                >
                  Periksa Pesanan
                </button>
                <button 
                  onClick={() => setIsSuccessOpen(false)}
                  className="w-full bg-white border-[2px] border-[#8B0000] text-[#8B0000] py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-red-50 transition-colors"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDIT CATATAN */}
        {isEditNoteOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#F8F9FA] border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[650px] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <img src="/rincian.png" alt="" className="w-12 h-12" />
                <h2 className="text-[38px] font-extrabold text-black tracking-tight mt-1">Edit Catatan</h2>
              </div>
              
              <div className="mb-10 w-full relative">
                <textarea 
                  value={editNoteText}
                  onChange={(e) => setEditNoteText(e.target.value)}
                  className="w-full bg-[#F0F2F5] border border-gray-300 rounded-[12px] p-5 text-[18px] text-black min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/50 resize-none font-medium placeholder:text-gray-400"
                  placeholder="Ketik catatan..."
                />
              </div>

              <button 
                disabled={isUpdating}
                onClick={() => {
                  if (!editingItemId) return;

                  startTransition(async () => {
                    const result = await updateCartNote(editingItemId, editNoteText);

                    if (result.success) {
                      setItems(items.map(item => 
                        item.id === editingItemId ? { ...item, note: editNoteText } : item
                      ));
                      setIsEditNoteOpen(false);
                    } else {
                      alert(result.message);
                    }
                  });
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#6A0000] text-white py-5 rounded-[40px] font-extrabold text-[22px] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}