"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";

export default function KeranjangPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                      <p className="text-[12px] text-gray-800 font-medium mb-1.5 mt-0.5">Catatan : {item.note}</p>
                      <button className="flex items-center justify-center gap-1.5 bg-[#FFC107] hover:bg-[#ffcd38] text-black text-[11px] font-extrabold py-1.5 px-4 rounded-full w-max transition-colors mt-0.5 shadow-sm">
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
                    <button className="flex items-center justify-center gap-1.5 bg-[#FEE2E2] hover:bg-[#fcd4d4] text-[#8B0000] font-bold py-1.5 px-3.5 rounded-[8px] text-[11px] transition-colors">
                      <Trash2 size={13} strokeWidth={2.5} /> Hapus
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#8B0000] border-[1.5px] border-[#8B0000] text-white px-8 py-2.5 rounded-[8px] font-bold text-[15px] hover:bg-[#6A0000] transition-colors"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
