'use client';

import React, { useMemo, useState, useTransition } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { Search, Star, Plus, Minus, X, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// IMPORT FUNGSI BACKEND
import { addToCart } from '@/src/controllers/cart-controller';

type CustomerMenuItem = {
  id: string;
  name: string;
  price: string; 
  rating: string;
  image: string;
  category: string;
};

type MenuClientProps = {
  items: CustomerMenuItem[];
};

const defaultCategoryOrder = ['Nasi', 'Mie', 'Snack', 'Minuman'];

export default function MenuClient({ items }: MenuClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CustomerMenuItem | null>(null);
  
  // State Input Keranjang
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // State Loading untuk transaksi database
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const available = Array.from(new Set(items.map((item) => item.category)));
    const ordered = defaultCategoryOrder.filter((cat) => available.includes(cat));
    const extra = available.filter((cat) => !defaultCategoryOrder.includes(cat));
    return ['Semua Menu', ...ordered, ...extra];
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua Menu' || item.category === activeCategory;
      const matchesSearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchTerm]);

  const groupedItems = useMemo(() => {
    const group: Record<string, CustomerMenuItem[]> = {};
    filteredItems.forEach((item) => {
      if (!group[item.category]) {
        group[item.category] = [];
      }
      group[item.category].push(item);
    });
    return group;
  }, [filteredItems]);

  const sections = activeCategory === 'Semua Menu'
    ? categories.filter((cat) => cat !== 'Semua Menu')
    : [activeCategory];

  const parsePrice = (value: string) => {
    const numeric = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const handleOpenAddModal = (item: CustomerMenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setNotes('');
    setIsAddModalOpen(true);
  };

  // FUNGSI SAMBUNG KE DATABASE
  const handleConfirmAdd = () => {
    if (!selectedItem) return;

    startTransition(async () => {
      const result = await addToCart(selectedItem.id, quantity, notes);

      if (result.success) {
        setIsAddModalOpen(false);
        setIsSuccessModalOpen(true);
        // Trigger event untuk memperbarui badge keranjang
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(result.message); // Tampilkan alert jika gagal
      }
    });
  };

  const MenuItemCard = ({ item }: { item: CustomerMenuItem }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/customer/detail_menu/${item.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          router.push(`/customer/detail_menu/${item.id}`);
        }
      }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative w-full h-44">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {item.rating}
        </div>
      </div>
      <div className="p-4 w-full sm:flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-black text-sm mb-1">{item.name}</h3>
          <p className="text-xs font-bold text-[#8B0000]">{item.price}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenAddModal(item);
          }}
          className="w-full bg-[#8B0000] text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-[#6A0000] transition-colors mt-3"
        >
          Tambah
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu="menu" />

      <main className="w-full sm:flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-6 lg:p-8 pt-4 pb-24 md:pb-8">
          <h1 className="text-2xl font-extrabold text-black tracking-tight mb-6">Menu De Cafenta</h1>

          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFC107] p-2 rounded-full">
              <Search size={18} className="text-white" strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari Menu Pilihan Anda"
              className="w-full bg-white border-2 border-[#FFC107] rounded-full py-4 pl-16 pr-6 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 shadow-sm"
            />
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x flex-nowrap mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap snap-start px-8 py-2 rounded-full text-sm font-bold border-2 transition-all shrink-0 ${
                  activeCategory === category
                    ? 'bg-[#8B0000] border-[#8B0000] text-white'
                    : 'bg-white border-[#8B0000] text-[#8B0000] hover:bg-red-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-sm font-bold text-gray-600">Menu belum tersedia.</p>
          )}

          <div className="space-y-10">
            {sections.map((category) => {
              const itemsForCategory = groupedItems[category] || [];
              if (itemsForCategory.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  <h2 className="text-xl font-bold text-black mb-4">Menu {category}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {itemsForCategory.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL SUCCESS */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[600px] p-12 text-center shadow-2xl">
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

              <h2 className="text-3xl md:text-[36px] font-extrabold text-black mb-4 tracking-tight">Menu Sukses ditambahkan!</h2>

              <p className="text-black font-medium text-[16px] leading-relaxed mb-12 px-6">
                Selamat menu kamu telah berhasil ditambahkan<br />
                silahkan periksa keranjang anda sekarang
              </p>

              <div className="flex flex-col gap-4 px-8">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.push('/customer/keranjang'); // <-- Arahkan ke halaman keranjang
                  }}
                  className="w-full bg-[#8B0000] text-white py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
                >
                  Periksa Keranjang
                </button>
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.refresh(); // <-- Soft refresh jika ada yang bergantung pada cache
                  }}
                  className="w-full bg-white border-[2.5px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-red-50 transition-colors"
                >
                  Lanjut Memesan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH PESANAN */}
        {isAddModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative bg-[#F8F9FA] w-full max-w-[450px] rounded-[20px] md:rounded-[30px] shadow-2xl border-2 border-[#8B0000] p-5 md:p-6 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute -top-2 -right-2 bg-[#8B0000] text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-colors z-10"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">{selectedItem.name}</h2>
                <span className="text-xl font-bold text-[#8B0000]">{selectedItem.price}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
                <div className="w-[110px] h-[100px] rounded-[15px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full sm:flex-1 flex flex-col min-w-0">
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
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-5 h-5 flex items-center justify-center bg-[#8B0000] text-white rounded shadow-sm active:scale-90"
                  >
                    <Plus size={12} strokeWidth={4} />
                  </button>
                  <span className="text-md font-black text-black w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-5 h-5 flex items-center justify-center border-2 border-[#8B0000] text-[#8B0000] rounded shadow-sm active:scale-90"
                  >
                    <Minus size={12} strokeWidth={4} />
                  </button>
                </div>
              </div>

              {/* TOMBOL KONFIRMASI DENGAN LOADING */}
              <button
                disabled={isPending}
                onClick={handleConfirmAdd}
                className="w-full bg-[#8B0000] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#6A0000] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Memproses...
                  </>
                ) : (
                  `Tambah Pembelian - Rp ${(parsePrice(selectedItem.price) * quantity).toLocaleString('id-ID')}`
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export type { CustomerMenuItem };