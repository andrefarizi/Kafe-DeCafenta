"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Trash2, Edit, ChevronDown, ChevronUp, MapPin, ShoppingBag, CheckCircle2 } from "lucide-react";

export default function KeranjangPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  
  const [selectedOrderType, setSelectedOrderType] = useState<"dine_in" | "takeaway" | "">("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Nasgor wira",
      note: "Jangan pedas",
      price: 30000,
      qty: 2,
      image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg"
    },
    {
      id: 2,
      name: "Nasgor wira",
      note: "Jangan pedas",
      price: 30000,
      qty: 2,
      image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg"
    },
    {
      id: 3,
      name: "Nasgor wira",
      note: "Jangan pedas",
      price: 30000,
      qty: 2,
      image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg"
    }
  ]);

  const formatPrice = (price: number) => {
    return "Rp " + price.toLocaleString("id-ID");
  };

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
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-2 h-[100px]">
                  <div className="col-span-1 text-center text-black font-bold text-[15px]">{index + 1}</div>
                  
                  <div className="col-span-5 flex items-center gap-6">
                    <div className="w-[85px] h-[85px] rounded-[18px] overflow-hidden shrink-0 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                    <button className="flex items-center justify-center w-[24px] h-[24px] bg-[#8B0000] rounded-[4px] hover:opacity-90 transition-opacity">
                      <span className="text-white font-bold select-none leading-none relative -top-[1.5px]">+</span>
                    </button>
                    <span className="font-extrabold text-black w-4 text-center text-[15px]">{item.qty}</span>
                    <button className="flex items-center justify-center w-[24px] h-[24px] border-[1.5px] border-[#8B0000]  bg-transparent rounded-[4px] hover:bg-gray-50 transition-colors">
                      <span className="text-[#8B0000] font-bold select-none leading-none relative -top-[1.5px]">-</span>
                    </button>
                  </div>
                  
                  <div className="col-span-2 flex justify-center">
                    <button className="flex items-center justify-center gap-2.5 bg-[#FEE2E2] hover:bg-[#fcd4d4] text-[#8B0000] font-bold py-1.5 px-3.5 rounded-[8px] text-[11px] transition-colors">
                      <Trash2 size={17} strokeWidth={2.5} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-end pt-8 mr-6">
            <div className="flex items-center gap-[40px] mb-8">
              <span className="text-[18px] font-extrabold text-[#8B0000]">Total yang harus dibayarkan :</span>
              <span className="text-[18px] font-extrabold text-[#8B0000]">Rp 90.000</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-[380px] bg-[#8B0000] hover:bg-[#6A0000] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-[14px]">
              Buat Pesanan
            </button>
          </div>
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
                    <React.Fragment key={idx}>
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
                    Rp {items.reduce((acc, item) => acc + (item.price * item.qty), 0).toLocaleString('id-ID')}
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
                {/* Makan Ditempat Card */}
                <div 
                  onClick={() => setSelectedOrderType("dine_in")}
                  className={`flex-1 flex flex-col items-center justify-start p-10 rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[300px] ${
                    selectedOrderType === "dine_in" 
                      ? 'bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.1)]' 
                      : 'bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60'
                  }`}
                >
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center pointer-events-none">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/854/854878.png" 
                      alt="Mapan" 
                      className="w-full h-full object-contain opacity-40 mix-blend-multiply" 
                    />
                    <div className="absolute top-4 bg-[#E04B4B] w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin size={24} className="text-white fill-white" />
                    </div>
                  </div>
                  <h3 className="text-[26px] font-extrabold text-[#8B0000] mb-4 text-center">Makan Di tempat</h3>
                  <p className="text-black font-medium text-[15px] text-center px-4 leading-relaxed">
                    Rasakan Makanan nikmat anda langsung di DE CAFENTA
                  </p>
                </div>

                {/* Bawa Pulang Card */}
                <div 
                  onClick={() => setSelectedOrderType("takeaway")}
                  className={`flex-1 flex flex-col items-center justify-start p-10 rounded-[32px] border-[2px] cursor-pointer transition-all min-h-[300px] ${
                    selectedOrderType === "takeaway" 
                      ? 'bg-[#FFE2E2] border-[#8B0000] shadow-[0_0_0_4px_rgba(139,0,0,0.1)]' 
                      : 'bg-[#FFE2E2]/60 border-[#FFBDBD] hover:border-[#8B0000]/60'
                  }`}
                >
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full bg-[#E04B4B] rounded-t-full rounded-b-xl flex items-center justify-center shadow-md border-b-4 border-[#BA3A3A] relative">
                       <ShoppingBag size={48} className="text-white" strokeWidth={1.5} />
                       <div className="absolute -bottom-3 -left-2 w-6 h-6 bg-gray-800 rounded-full"></div>
                       <div className="absolute -bottom-3 -right-2 w-6 h-6 bg-gray-800 rounded-full"></div>
                    </div>
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
              
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  {/* Ilustrasi Note */}
                  <div className="absolute inset-0 flex justify-center items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1001/1001093.png" 
                      alt="Berhasil" 
                      className="w-32 h-32 object-contain opacity-90"
                      style={{ filter: "hue-rotate(330deg) saturate(1)" }}
                    />
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
                    // Aksi periksa pesanan di sini (redirect dsb)
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
                <div className="bg-black p-2.5 rounded-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4C4 2.89543 4.89543 2 6 2H14.1716C14.702 2 15.2107 2.21071 15.5858 2.58579L19.4142 6.41421C19.7893 6.78929 20 7.29799 20 7.82843V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="white"/>
                    <path d="M8 8H16" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M8 12H13" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
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
                onClick={() => {
                  setItems(items.map(item => item.id === editingItemId ? { ...item, note: editNoteText } : item));
                  setIsEditNoteOpen(false);
                }}
                className="w-full bg-[#8B0000] hover:bg-[#6A0000] text-white py-5 rounded-[40px] font-extrabold text-[22px] transition-colors shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
