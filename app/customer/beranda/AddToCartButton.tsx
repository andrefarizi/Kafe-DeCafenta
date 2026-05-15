'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Minus, X, FileText, Loader2 } from 'lucide-react';
import { addToCart } from '@/src/controllers/cart-controller';
import { useRouter } from 'next/navigation';

type AddToCartItem = {
  id: string; 
  name: string;
  price: number;
  image: string;
};

type AddToCartButtonProps = {
  item: AddToCartItem;
  className?: string;
  label?: string;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export default function AddToCartButton({ item, className = '', label = 'Tambah' }: AddToCartButtonProps) {
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setQuantity(1);
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await addToCart(item.id, quantity, notes);

      if (result.success) {
        setIsAddModalOpen(false);
        setIsSuccessOpen(true); // Popup berhasil muncul dengan aman!
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        {label}
      </button>

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsAddModalOpen(false);
          }}
        >
          <div
            className="relative bg-[#F8F9FA] w-full max-w-[450px] rounded-[30px] shadow-2xl border-2 border-[#8B0000] p-6 animate-in fade-in zoom-in duration-200"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsAddModalOpen(false);
              }}
              className="absolute -top-2 -right-2 bg-[#8B0000] text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-colors z-10"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black tracking-tight leading-none">{item.name}</h2>
              <span className="text-xl font-bold text-[#8B0000]">{formatRupiah(item.price)}</span>
            </div>

            <div className="flex gap-4 mb-5">
              <div className="w-[110px] h-[100px] rounded-[15px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText size={14} className="text-black" />
                  <span className="font-bold text-black text-xs">Catatan (opsional)</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Contoh: jangan pedas, ya"
                  className="w-full flex-1 bg-gray-300 rounded-xl p-3 text-black placeholder:text-gray-600 text-[11px] focus:outline-none border border-transparent min-h-[75px] resize-none shadow-inner"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-400 mb-4"></div>

            <div className="flex justify-between items-center mb-5 px-1">
              <span className="text-sm font-bold text-black">Jumlah Pembelian</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center bg-[#8B0000] text-white rounded shadow-sm active:scale-90"
                >
                  <Plus size={12} strokeWidth={4} />
                </button>
                <span className="text-md font-black text-black w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-5 h-5 flex items-center justify-center border-2 border-[#8B0000] text-[#8B0000] rounded shadow-sm active:scale-90"
                >
                  <Minus size={12} strokeWidth={4} />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isPending} 
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleConfirm();
              }}
              className="w-full bg-[#8B0000] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#6A0000] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memproses...
                </>
              ) : (
                `Tambah Pembelian - Rp ${(item.price * quantity).toLocaleString('id-ID')}`
              )}
            </button>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsSuccessOpen(false);
          }}
        >
          <div
            className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[600px] p-12 text-center shadow-2xl"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <div className="flex justify-center ">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex justify-center items-center">
                  <img
                    src="/makanan.png"
                    alt="Berhasil"
                    className="w-36 h-36 object-contain "
                  />
                </div>
              </div>
            </div>

            <h2 className="text-[36px] font-extrabold text-black mb-4 tracking-tight">Menu Sukses ditambahkan!</h2>

            <p className="text-black font-medium text-[16px] leading-relaxed mb-12 px-6">
              Selamat menu kamu telah berhasil ditambahkan<br />
              silahkan periksa keranjang anda sekarang
            </p>

            <div className="flex flex-col gap-4 px-8">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsSuccessOpen(false);
                  router.push('/customer/keranjang');
                }}
                className="w-full bg-[#8B0000] text-white py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
              >
                Periksa Keranjang
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsSuccessOpen(false);
                  router.refresh();
                }}
                className="w-full bg-white border-[2.5px] border-[#8B0000] text-[#8B0000] py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-red-50 transition-colors"
              >
                Lanjut Memesan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
