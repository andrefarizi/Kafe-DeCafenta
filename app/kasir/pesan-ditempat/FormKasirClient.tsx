"use client";

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { createKasirOrder } from '@/src/controllers/kasir-order-controller';
import { Plus, Minus, X, FileText, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// --- TYPES ---
type MenuListItem = {
  id: string;
  name: string;
  price: number;
  avgRating: number;
  imageUrl: string | null;
  categoryName: string;
  isAvailable?: boolean;
};

type KasirCartItem = {
  menuId: string;
  name: string;
  price: number;
  qty: number;
  note: string;
  image: string;
};

type FormKasirClientProps = {
  initialMenus: MenuListItem[];
};

// --- FUNGSI GENERATE KODE RANDOM ---
function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DCF${timestamp}${random}`;
}

// --- ICONS (SVG) ---
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" className="mr-1">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

const EditIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffc107" className="mr-1">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

// --- HELPER UNTUK GAMBAR ---
function getDummyImage(name: string, categoryName: string, imageUrl: string | null) {
  if (imageUrl) return imageUrl;
  const n = name.toLowerCase();
  if (n.includes('kentang') || n.includes('snack') || categoryName === 'Snack') return '/kentang.png';
  if (n.includes('teh') || n.includes('jus') || n.includes('minuman') || categoryName === 'Minuman') return '/jus semangka.png';
  if (categoryName === 'Nasi') return '/nasi goreng.png';
  if (categoryName === 'Mie') return '/bakso.png';
  return '/burger.png';
}

const defaultCategoryOrder = ['Nasi', 'Mie', 'Snack', 'Minuman'];

// --- MAIN COMPONENT ---
export default function FormKasirClient({ initialMenus }: FormKasirClientProps) {
  const router = useRouter();

  // State Form & Keranjang Lokal Kasir
  const [cartItems, setCartItems] = useState<KasirCartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [orderType, setOrderType] = useState("dine_in_kasir");
  
  // State Kode Pesanan Langsung di UI
  const [orderCode, setOrderCode] = useState(() => generateOrderCode());

  // State Searching & Filtering
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination for Menus
  const [menuPage, setMenuPage] = useState(1);
  const menusPerPage = 8;

  useEffect(() => {
    setMenuPage(1);
  }, [activeCategory, searchTerm]);

  // State Modal Tambah Menu
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuListItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // State Modal Ubah Catatan
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [isNoteSuccessOpen, setIsNoteSuccessOpen] = useState(false);

  // State Modal Konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState("");

  // State Modal Konfirmasi Pesanan & Pembayaran
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isPending, startTransition] = useTransition();

  // State Modal Sukses
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  // LOGIKA FILTERING (Data dari Props)
  const categories = useMemo(() => {
    const available = Array.from(new Set(initialMenus.map((item) => item.categoryName)));
    const ordered = defaultCategoryOrder.filter((cat) => available.includes(cat));
    const extra = available.filter((cat) => !defaultCategoryOrder.includes(cat));
    return ['Semua Menu', ...ordered, ...extra];
  }, [initialMenus]);

  const filteredMenus = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialMenus.filter((item) => {
      const matchesCategory = activeCategory === 'Semua Menu' || item.categoryName === activeCategory;
      const matchesSearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [initialMenus, activeCategory, searchTerm]);

  const totalPages = Math.ceil(filteredMenus.length / menusPerPage);
  const paginatedMenus = filteredMenus.slice((menuPage - 1) * menusPerPage, menuPage * menusPerPage);

  // Kalkulasi Harga (Subtotal, Pajak 10%, Total)
  const formatPrice = (price: number) => "Rp " + price.toLocaleString("id-ID");
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- HANDLER MODAL TAMBAH MENU ---
  const handleOpenAddModal = (menu: MenuListItem) => {
    setSelectedItem(menu);
    setQuantity(1);
    setNotes("");
    setIsAddModalOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.menuId === selectedItem.id);
      if (existing) {
        return prev.map(item => item.menuId === selectedItem.id ? { ...item, qty: item.qty + quantity } : item);
      }
      return [...prev, {
        menuId: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        qty: quantity,
        note: notes,
        image: getDummyImage(selectedItem.name, selectedItem.categoryName, selectedItem.imageUrl)
      }];
    });

    setIsAddModalOpen(false);
  };

  // --- HANDLER KERANJANG LAINNYA ---
  const handleUpdateQty = (menuId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.menuId === menuId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  // --- HANDLER MODAL HAPUS ---
  const openDeleteModal = (menuId: string, name: string) => {
    setDeleteItemId(menuId);
    setDeleteItemName(name);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItemId) {
      setCartItems(prev => prev.filter(item => item.menuId !== deleteItemId));
    }
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  // --- HANDLER UBAH CATATAN ---
  const saveNote = () => {
    startTransition(() => {
      setCartItems(prev => prev.map(item => 
        item.menuId === editingMenuId ? { ...item, note: editNoteText } : item
      ));
      setIsEditNoteOpen(false);
      setIsNoteSuccessOpen(true);
    });
  };

  // --- HANDLER RESET / PESANAN BARU ---
  const resetForm = () => {
    setCartItems([]);
    setCustomerName("");
    setSearchTerm("");
    setSelectedPayment("");
    setOrderCode(generateOrderCode()); // Buat kode baru
  };

  const handleReset = () => {
    if (cartItems.length === 0 && !customerName) {
      resetForm();
      return;
    }
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-sm">Yakin ingin membatalkan seluruh pesanan ini?</p>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => toast.dismiss(t.id)} 
              className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-black rounded-md text-xs font-bold hover:bg-gray-200"
            >
              Tidak
            </button>
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                resetForm();
                toast.success("Pesanan berhasil dibatalkan");
              }} 
              className="px-3 py-1.5 bg-[#8b0000] text-white rounded-md text-xs font-bold hover:bg-[#6a0000]"
            >
              Ya, Batalkan
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: 'reset-confirm' }
    );
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10 md:pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[26px] font-black">Pesan ditempat</h1>
          <button onClick={handleReset} className="bg-[#8b0000] text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-[#6A0000] transition">
            <span>+</span> Pesanan Baru
          </button>
        </div>

        {/* Master Container */}
        <div className="border-[1.5px] border-[#8b0000] rounded-xl p-6">
          
          {/* Section 1: Informasi Pesanan */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs font-bold mb-1">
                Kode Pesanan
              </p>
              <h2 className="text-2xl md:text-[28px] font-black text-[#8b0000]">
                #{orderCode || <span className="text-gray-400 text-lg">Memuat...</span>}
              </h2>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Nama Pelanggan</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/[^a-zA-Z\s']/.test(val)) {
                    setNameError('Nama pelanggan hanya boleh berisi huruf.');
                  } else {
                    setNameError('');
                  }
                  setCustomerName(val);
                }}
                placeholder="contoh: Andre Ganteng" 
                className={`w-full bg-white border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b0000] placeholder-gray-400 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {nameError && <p className="text-red-500 text-xs font-bold mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Tipe Pesanan</label>
              <div className="relative">
                <select 
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full bg-white border border-red-700 rounded-md p-3 text-sm appearance-none focus:outline-none focus:border-[#8b0000]"
                >
                  <option value="dine_in_kasir">Makan ditempat</option>
                  <option value="takeaway">Bawa Pulang</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Daftar Pesanan */}
          <div className="mb-10">
            <h2 className="text-xl font-black mb-2">Daftar Pesanan</h2>
            <div className="border-t-[1.5px] border-black w-full mb-4"></div>

            {/* Header Tabel - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 pb-3 text-[13px] font-bold">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-4 pl-2">Produk</div>
              <div className="col-span-3 text-center">Harga</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-bold text-sm">
                Belum ada pesanan yang ditambahkan.
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={item.menuId}>
                  {/* Desktop Row */}
                  <div className="hidden md:grid grid-cols-12 py-4 items-center border-b border-gray-100">
                    <div className="col-span-1 text-center text-sm font-bold">{index + 1}</div>
                    <div className="col-span-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-bold text-[15px] leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-500 mb-1.5 mt-0.5 line-clamp-1">Catatan : {item.note || "-"}</p>
                        <button 
                          onClick={() => {
                            setEditingMenuId(item.menuId);
                            setEditNoteText(item.note);
                            setIsEditNoteOpen(true);
                          }}
                          className="bg-[#ffc107] text-black text-[9px] px-3 py-1.5 rounded-full font-bold flex items-center hover:bg-[#e0a800] transition"
                        >
                          <EditIcon /> Ubah Catatan
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3 text-center text-xs font-bold">{formatPrice(item.price)}</div>
                    <div className="col-span-2 flex justify-center items-center gap-3">
                      <button onClick={() => handleUpdateQty(item.menuId, 1)} className="w-5 h-5 bg-[#8b0000] text-white rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-[#6b0000] active:scale-90">+</button>
                      <span className="font-bold text-[13px]">{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item.menuId, -1)} className="w-5 h-5 bg-white border-[1.5px] border-[#8b0000] text-[#8b0000] rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-gray-50 active:scale-90">-</button>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button onClick={() => openDeleteModal(item.menuId, item.name)} className="bg-[#fce8e8] text-[#dc2626] px-3 py-1.5 rounded-md flex items-center text-[10px] font-bold hover:bg-[#fbd5d5] transition active:scale-90">
                        <TrashIcon /> Hapus
                      </button>
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden flex items-start gap-3 py-4 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 shrink-0 w-5 pt-1">{index + 1}</span>
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full sm:flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 mb-1.5 line-clamp-1">Catatan: {item.note || "-"}</p>
                      <button
                        onClick={() => {
                          setEditingMenuId(item.menuId);
                          setEditNoteText(item.note);
                          setIsEditNoteOpen(true);
                        }}
                        className="bg-[#ffc107] text-black text-[9px] px-2.5 py-1 rounded-full font-bold flex items-center hover:bg-[#e0a800] transition mb-2"
                      >
                        <EditIcon /> Ubah Catatan
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#8b0000] flex-1">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleUpdateQty(item.menuId, 1)} className="w-6 h-6 bg-[#8b0000] text-white rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-[#6b0000] active:scale-90">+</button>
                          <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.menuId, -1)} className="w-6 h-6 bg-white border-[1.5px] border-[#8b0000] text-[#8b0000] rounded-[4px] flex items-center justify-center text-xs font-bold hover:bg-gray-50 active:scale-90">-</button>
                        </div>
                        <button onClick={() => openDeleteModal(item.menuId, item.name)} className="bg-[#fce8e8] text-[#dc2626] p-1.5 rounded-md flex items-center text-[10px] font-bold hover:bg-[#fbd5d5] transition active:scale-90">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Subtotal & Total Container */}
            <div className="mt-4 pt-4 border-t-[1.5px] border-gray-200">
              <div className="flex justify-between items-center text-sm pt-3">
                <span className="font-normal text-[13px] text-gray-700 leading-tight">Total<br/>dibayar</span>
                <span className="text-xl md:text-[22px] font-black text-[#8b0000]">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Daftar Menu */}
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4">Daftar Menu</h2>
            
            <div className="relative flex items-center mb-6">
              <div className="absolute left-0 w-12 h-12 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Menu Pilihan Anda" 
                className="w-full pl-14 pr-4 py-3 rounded-full bg-white border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
                    activeCategory === cat ? 'bg-[#8b0000] text-white border-[1.5px] border-[#8b0000]' : 'bg-white border-[1.5px] border-[#8b0000] text-black hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paginatedMenus.length === 0 ? (
                <div className="col-span-full py-10 text-center text-gray-500 font-bold">Menu tidak ditemukan.</div>
              ) : (
                paginatedMenus.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative w-full h-44">
                      <img src={getDummyImage(item.name, item.categoryName, item.imageUrl)} alt={item.name} className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale opacity-70' : ''}`} />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold z-10">
                        <StarIcon /> {item.avgRating.toFixed(1)}
                      </div>
                      {item.isAvailable === false && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">Tidak Tersedia</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 w-full sm:flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1 line-clamp-1" title={item.name}>{item.name}</h3>
                        <p className="text-xs font-bold text-[#8b0000]">{formatPrice(item.price)}</p>
                      </div>
                      <div className="mt-3">
                        <button 
                          disabled={item.isAvailable === false}
                          onClick={() => handleOpenAddModal(item)}
                          className={`w-full text-white py-1.5 rounded-md text-[10px] font-bold transition active:scale-95 ${
                            item.isAvailable === false
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#8b0000] hover:bg-[#6b0000]'
                          }`}
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setMenuPage(Math.max(1, menuPage - 1))}
                  disabled={menuPage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setMenuPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm transition-colors ${
                      p === menuPage
                        ? 'bg-[#8B1A1A] text-white'
                        : 'text-[#8B1A1A] hover:bg-red-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setMenuPage(Math.min(totalPages, menuPage + 1))}
                  disabled={menuPage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Action Buttons */}
          <div className="space-y-3 mt-10">
            <button 
              onClick={() => {
                if (cartItems.length === 0) {
                  toast.error("Keranjang masih kosong!");
                  return;
                }
                if (nameError) {
                  toast.error("Perbaiki kesalahan pada Nama Pelanggan sebelum melanjutkan!");
                  return;
                }
                if (!customerName.trim()) {
                  toast.error("Nama Pelanggan wajib diisi!");
                  return;
                }
                setIsConfirmModalOpen(true);
              }}
              className="w-full bg-[#8b0000] text-white py-3.5 rounded-md font-bold text-sm hover:bg-[#6b0000] transition shadow-sm active:scale-[0.99]"
            >
              Konfirmasi Pesanan
            </button>
          </div>

        </div>
      </div>

      {/* ===== MODAL: TAMBAH PESANAN (MENU) ===== */}
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
              <span className="text-xl font-bold text-[#8B0000]">{formatPrice(selectedItem.price)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
              <div className="w-[110px] h-[100px] rounded-[15px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                <img src={getDummyImage(selectedItem.name, selectedItem.categoryName, selectedItem.imageUrl)} alt={selectedItem.name} className="w-full h-full object-cover" />
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

            <button
              onClick={handleConfirmAdd}
              className="w-full bg-[#8B0000] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#6A0000] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.97]"
            >
              Tambah Pembelian - {formatPrice(selectedItem.price * quantity)}
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL: KONFIRMASI HAPUS ===== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
              <button 
                onClick={handleConfirmDelete} 
                className="w-full sm:flex-1 bg-[#8B0000] text-white py-2 md:py-3 rounded-[10px] font-bold text-sm md:text-[15px] hover:bg-[#6A0000] transition-colors flex items-center justify-center gap-2"
              >
                Ya, Hapus
              </button>
              <button 
                onClick={() => { setIsDeleteModalOpen(false); setDeleteItemId(null); }} 
                className="w-full sm:flex-1 border-[1.5px] border-[#8B0000] text-[#8B0000] py-2 md:py-3 rounded-[10px] font-bold text-sm md:text-[15px] hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: UBAH CATATAN ===== */}
      {isEditNoteOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[#F8F9FA] border-[3px] border-[#8B0000] rounded-[24px] w-full max-w-[500px] p-5 md:p-8 shadow-2xl">
            <h2 className="text-2xl md:text-[24px] font-extrabold text-black tracking-tight mb-6">Ubah Catatan</h2>
            <textarea 
              value={editNoteText}
              onChange={(e) => setEditNoteText(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-[12px] p-4 text-[15px] text-black min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/50 resize-none font-medium placeholder:text-gray-400 mb-6"
              placeholder="Contoh: Tanpa bawang, pedas sedang..."
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                disabled={isPending}
                onClick={saveNote}
                className="w-full sm:flex-1 bg-[#8B0000] hover:bg-[#6A0000] text-white py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <><Loader2 size={20} className="animate-spin" /> Menyimpan...</>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
              <button 
                onClick={() => setIsEditNoteOpen(false)}
                className="w-full sm:flex-1 border-[1.5px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px] hover:bg-red-50 transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: CATATAN BERHASIL DIUBAH ===== */}
      {isNoteSuccessOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
              onClick={() => setIsNoteSuccessOpen(false)} 
              className="w-full bg-[#8B0000] text-white py-4 rounded-[16px] font-extrabold text-[18px] hover:bg-[#6A0000] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL: RINCIAN PESANAN KASIR ===== */}
      {isConfirmModalOpen && (
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
                {cartItems.map((item, idx) => (
                  <React.Fragment key={item.menuId || idx}>
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
              <h3 className="font-extrabold text-black text-[18px]">Pilih Metode Pembayaran</h3>
              <p className="text-[14px] text-black font-medium mb-4">Pilihlah Metode Pembayaran Andalan anda</p>
              <div className="border-[1.5px] border-[#8B0000] rounded-xl overflow-hidden bg-white w-full max-w-[400px]">
                <div 
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                  className="p-3.5 border-b-[1.5px] border-[#8B0000] flex justify-between items-center text-[#8B0000] font-medium text-[15px] cursor-pointer bg-white"
                >
                  <span>{selectedPayment || "Pilih Metode Pembayaran"}</span>
                  <ChevronDown />
                </div>
                {isPaymentOpen && (
                  <div className="bg-white">
                    {["Cash", "Gopay", "Dana"].map((method, idx, arr) => (
                      <div 
                        key={method}
                        onClick={() => {
                          setSelectedPayment(method);
                          setIsPaymentOpen(false);
                        }}
                        className={`p-3.5 flex justify-between items-center text-[#8B0000] font-medium text-[15px] cursor-pointer hover:bg-red-50 transition-colors ${idx !== arr.length - 1 ? 'border-b-[1.5px] border-[#8B0000]' : ''}`}
                      >
                        <span>{method}</span>
                        <ChevronUp />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-[1.5px] border-black mb-10 pt-4 flex justify-between items-end px-2">
              <div className="flex flex-col gap-0.5">
                <div className="text-black font-bold text-[16px]">Total Menu</div>
                <div className="text-black font-extrabold text-xl md:text-[22px]">{cartItems.length} Menu</div>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <div className="text-black font-bold text-[16px]">Total Harga</div>
                <div className="text-[#8B0000] font-extrabold text-xl md:text-[22px]">{formatPrice(subtotal)}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5">
              <button 
                disabled={isPending}
                onClick={() => {
                  if (!selectedPayment) {
                    toast.error("Silakan pilih metode pembayaran!");
                    return;
                  }
                  startTransition(async () => {
                    const payload = {
                      orderCode,
                      customerName,
                      orderType,
                      paymentMethod: selectedPayment,
                      items: cartItems.map(item => ({
                        menuId: item.menuId,
                        qty: item.qty,
                        price: item.price,
                        note: item.note
                      }))
                    };
                    const res = await createKasirOrder(payload);
                    if (res.success) {
                      setCreatedOrderId(res.orderId || "");
                      setIsConfirmModalOpen(false);
                      setIsOrderSuccessOpen(true);
                      resetForm();
                    } else {
                      toast.error(res.message);
                    }
                  });
                }}
                className="bg-[#8B0000] border-[1.5px] border-[#8B0000] text-white px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-[8px] font-bold text-sm md:text-[15px] hover:bg-[#6A0000] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isPending ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Konfirmasi & Proses"}
              </button>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="border-[1.5px] border-[#8B0000] text-[#8B0000] px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-[8px] font-bold text-sm md:text-[15px] hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: PESANAN BERHASIL DIBUAT ===== */}
      {isOrderSuccessOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[650px] p-6 md:p-12 text-center shadow-2xl">
            <div className="flex justify-center mb-1">
              <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                <img src="/pesanansukses.png" alt="Pesanan Sukses" />
              </div>
            </div>
            <h2 className="text-3xl md:text-[36px] font-extrabold text-black mb-4 tracking-tight">Pesanan Berhasil dibuat!</h2>
            <p className="text-black font-medium text-[18px] leading-relaxed mb-4 px-6">
              Kode Pesanan: <span className="font-extrabold text-[#8b0000]">{orderCode}</span>
            </p>
            <p className="text-black font-medium text-[18px] leading-relaxed mb-12 px-6">
              Selamat pesanan anda berhasil di buat<br />
              silahkan lanjutkan pembayaran untuk menyelesaikan<br />
              pesanan anda
            </p>
            
            {/* CONTAINER 2 TOMBOL */}
            <div className="flex flex-col gap-4 px-10">
              <button
                onClick={() => { 
                  setIsOrderSuccessOpen(false);
                  resetForm();
                  router.push(`/kasir/daftar-pesanan/detail/${createdOrderId}`); 
                }}
                className="w-full bg-[#8B0000] text-white py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
              >
                Periksa Pesanan
              </button>
              
              <button
                onClick={() => { 
                  setIsOrderSuccessOpen(false);
                  resetForm();
                }}
                className="w-full bg-white border-[2px] border-[#8B0000] text-[#8B0000] py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px] hover:bg-red-50 transition-colors"
              >
                Kembali & Buat Pesanan Baru
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
