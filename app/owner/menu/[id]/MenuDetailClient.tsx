'use client';

import React, { useState } from 'react';
import { Pencil, Star, Loader2, Tag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateMenuDetail } from '@/src/controllers/menu-controller';
import toast from 'react-hot-toast';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

type MenuProps = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  avgRating: string;
  imageUrl: string;
  isAvailable: boolean;
  isPromo: boolean;
  discountPercent?: number;
  stock: number | null;
};

export default function MenuDetailClient({ menu }: { menu: MenuProps }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<'name' | 'price' | 'description' | 'stock' | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Promo modal state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');

  const handleEdit = (field: 'name' | 'price' | 'description' | 'stock', currentValue: string | number | null) => {
    setIsEditing(field);
    setEditValue(currentValue?.toString() || '');
    setEditError('');
  };

  const handleOpenPromoModal = () => {
    if (!menu.isAvailable) {
      toast.error('Menu sedang tidak tersedia! Promo tidak dapat ditambahkan atau diubah.');
      return;
    }
    setDiscountInput(menu.isPromo ? String(menu.discountPercent ?? '') : '');
    setDiscountError('');
    setShowPromoModal(true);
  };

  const handleSave = async () => {
    if (!isEditing) return;
    setIsSaving(true);
    
    let payload: { name?: string; price?: number; description?: string; stock?: number | null } = {};
    if (isEditing === 'name') payload.name = editValue.trim();
    if (isEditing === 'price') payload.price = Number(editValue) || 0;
    if (isEditing === 'description') payload.description = editValue.trim();
    if (isEditing === 'stock') payload.stock = editValue.trim() === '' ? 1 : Number(editValue);

    const res = await updateMenuDetail(menu.id, payload);
    setIsSaving(false);
    setIsEditing(null);

    if (res.success) {
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const handleToggleAvailable = async () => {
    setIsSaving(true);
    const res = await updateMenuDetail(menu.id, { isAvailable: !menu.isAvailable });
    setIsSaving(false);
    
    if (res.success) {
      toast.success(menu.isAvailable ? 'Menu ditandai tidak tersedia' : 'Menu ditandai tersedia');
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const handleRemovePromo = async () => {
    setIsSaving(true);
    const res = await updateMenuDetail(menu.id, { isPromo: false, discountPercent: 0 });
    setIsSaving(false);
    if (res.success) {
      toast.success('Menu dihapus dari promo');
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const handleSavePromo = async () => {
    const pct = Number(discountInput);
    if (!discountInput || isNaN(pct) || pct < 1 || pct > 99) {
      setDiscountError('Masukkan persentase antara 1–99.');
      return;
    }
    setIsSaving(true);
    const res = await updateMenuDetail(menu.id, { isPromo: true, discountPercent: pct });
    setIsSaving(false);
    if (res.success) {
      toast.success(`Promo ${pct}% berhasil disimpan!`);
      setShowPromoModal(false);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const renderModal = () => {
    if (!isEditing) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-extrabold text-black mb-4">
            Edit {isEditing === 'name' ? 'Nama' : isEditing === 'price' ? 'Harga' : isEditing === 'stock' ? 'Stok' : 'Deskripsi'}
          </h3>
          
          {isEditing === 'description' ? (
              <textarea
                className={`w-full border-2 rounded-xl p-3 focus:outline-none font-medium ${editError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8B1A1A]'}`}
                rows={4}
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  setEditError(e.target.value.length > 300 ? 'Deskripsi maksimal 300 karakter.' : '');
                }}
                placeholder="Masukkan deskripsi..."
              />
          ) : isEditing === 'stock' ? (
              <input
                type="number"
                min="0"
                className={`w-full border-2 rounded-xl p-3 focus:outline-none font-medium ${editError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8B1A1A]'}`}
                value={editValue}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.startsWith('-') || Number(val) < 0) {
                    val = '0';
                  }
                  setEditValue(val);
                  setEditError('');
                }}
                placeholder="Kosongkan untuk set stok ke 1"
              />
          ) : isEditing === 'price' ? (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
                <input
                  type="text"
                  className={`w-full border-2 rounded-xl p-3 pl-12 focus:outline-none font-medium ${editError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8B1A1A]'}`}
                  value={editValue}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (Number(raw) <= 0) {
                      setEditError('Harga harus lebih dari 0.');
                    } else if (Number(raw) > 10000000) {
                      setEditError('Harga maksimal 10.000.000.');
                    } else {
                      setEditError('');
                    }
                    setEditValue(raw);
                  }}
                  placeholder="0"
                />
            </div>
          ) : (
              <input
                type="text"
                className={`w-full border-2 rounded-xl p-3 focus:outline-none font-medium ${editError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8B1A1A]'}`}
                value={editValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^[a-zA-Z0-9àáâãäåæçèéêëìíîïðñòóôõöùúûüýÿĀāĂăĄąĆćĊċČčĎďĒēĔĕĖėĘęĚěĞğĠġĢģĤĥĪīĬĭĮįİıĶķĹĺĻļĽľŁłŃńŅņŇňŌōŎŏŐőŔŕŖŗŘřŚśŞşŠšŢţŤťŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž \-]*$/.test(val)) {
                    setEditError('Nama tidak boleh mengandung simbol khusus.');
                    const filtered = val.replace(/[^a-zA-Z0-9àáâãäåæçèéêëìíîïðñòóôõöùúûüýÿ \-]/g, '');
                    setEditValue(filtered);
                  } else {
                    setEditError('');
                    setEditValue(val);
                  }
                }}
                placeholder="Nama Menu"
              />
          )}

          {editError && <p className="text-red-500 text-xs mt-2 font-bold">{editError}</p>}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsEditing(null)}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!editError || !editValue.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#8B1A1A] hover:bg-red-900 transition-colors flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <><Loader2 size={16} className="animate-spin" /> <span>Menyimpan</span></>
              ) : (
                <span>Simpan</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPromoModal = () => {
    if (!showPromoModal) return null;
    const previewPrice = discountInput && Number(discountInput) > 0 && Number(discountInput) <= 99
      ? Math.round(menu.price * (1 - Number(discountInput) / 100))
      : null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200 relative">
          <button onClick={() => setShowPromoModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Tag size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-extrabold text-black">Atur Promo</h3>
          </div>

          <p className="text-sm text-gray-500 mb-4 font-medium">Masukkan persentase diskon untuk <span className="font-bold text-black">{menu.name}</span></p>

          <div className="relative mb-2">
            <input
              type="number"
              min={1}
              max={99}
              value={discountInput}
              onChange={(e) => {
                setDiscountInput(e.target.value);
                const v = Number(e.target.value);
                if (!e.target.value) { setDiscountError(''); return; }
                if (v < 1 || v > 99) setDiscountError('Persentase harus antara 1–99.');
                else setDiscountError('');
              }}
              className={`w-full border-2 rounded-xl p-3 pr-10 focus:outline-none font-bold text-lg ${discountError ? 'border-red-400' : 'border-gray-300 focus:border-[#8B1A1A]'}`}
              placeholder="Contoh: 20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">%</span>
          </div>
          {discountError && <p className="text-red-500 text-xs mb-2 font-bold">{discountError}</p>}

          {previewPrice !== null && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 font-medium">Preview Harga</p>
              <p className="text-sm font-bold text-gray-400 line-through">{formatRupiah(menu.price)}</p>
              <p className="text-xl font-black text-[#8B1A1A]">{formatRupiah(previewPrice)}</p>
              <p className="text-xs text-green-600 font-bold">Hemat {discountInput}% • Harga setelah diskon</p>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button onClick={() => setShowPromoModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" disabled={isSaving}>
              Batal
            </button>
            <button
              onClick={handleSavePromo}
              disabled={isSaving || !!discountError || !discountInput}
              className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#8B1A1A] hover:bg-red-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
              Simpan Promo
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-8 mb-8 bg-white shadow-sm relative">
        <div className="flex flex-col md:flex-row gap-8 mb-8 mt-6 md:mt-0">
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:max-w-md flex items-center justify-center mx-auto md:mx-0 bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm group">
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start pt-2">
            <div className="w-full group cursor-pointer mb-6" onClick={() => handleEdit('name', menu.name)}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-black group-hover:text-[#8B1A1A] transition-colors flex items-center gap-3">
                {menu.name}
                <Pencil size={20} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
              </h2>
              <p className="text-xs text-gray-500 mt-1">Klik pada nama untuk mengedit</p>
            </div>

            <div className="mb-6 group cursor-pointer" onClick={() => handleEdit('price', menu.price)}>
              <p className="text-4xl md:text-5xl font-black text-[#8B1A1A] group-hover:text-red-900 transition-colors flex items-center gap-3">
                {formatRupiah(menu.price)}
                <Pencil size={20} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
              </p>
              {menu.isPromo && menu.discountPercent && menu.discountPercent > 0 ? (
                <p className="text-base font-bold text-green-600 mt-1">
                  Setelah diskon: {formatRupiah(Math.round(menu.price * (1 - menu.discountPercent / 100)))}
                </p>
              ) : null}
              <p className="text-xs text-gray-500 mt-1">Klik pada harga untuk mengedit</p>
            </div>

            <div className="mb-6 group cursor-pointer" onClick={() => handleEdit('stock', menu.stock)}>
              <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 self-start group-hover:border-[#8B1A1A] transition-colors">
                <span className="text-gray-700 font-extrabold text-lg">Stok</span>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-black font-black text-xl">{menu.stock === null ? 'Tidak Terbatas' : menu.stock}</span>
                </div>
                <Pencil size={16} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors ml-2" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Klik pada kotak stok untuk mengedit</p>
            </div>

            <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 mb-8 self-start">
              <span className="text-gray-700 font-extrabold text-lg">Rating</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Star size={20} fill="#FFC700" className="text-[#FFC700]" />
                <span className="text-black font-black text-xl">{menu.avgRating}</span>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-wrap items-center gap-3 mt-auto pt-6 border-t border-gray-100">
              <button
                disabled={isSaving}
                onClick={handleToggleAvailable}
                className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all flex items-center gap-2 shadow-sm ${
                  menu.isAvailable 
                    ? 'bg-[#8B1A1A] text-white border-[#8B1A1A] hover:bg-red-900' 
                    : 'bg-white text-[#8B1A1A] border-[#8B1A1A] hover:bg-red-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${menu.isAvailable ? 'bg-white' : 'bg-[#8B1A1A]'} animate-pulse`}></div>
                {menu.isAvailable ? 'Status: Tersedia' : 'Status: Tidak Tersedia'}
              </button>

              {menu.isPromo ? (
                <>
                  <button
                    disabled={isSaving}
                    onClick={handleOpenPromoModal}
                    className="px-5 py-2.5 rounded-full text-sm font-bold border-2 bg-yellow-50 text-yellow-700 border-yellow-500 hover:bg-yellow-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Tag size={16} className="text-yellow-700" />
                    Ubah Promo ({menu.discountPercent ?? 0}%)
                  </button>
                  <button
                    disabled={isSaving}
                    onClick={handleRemovePromo}
                    className="px-5 py-2.5 rounded-full text-sm font-bold border-2 bg-white text-[#8B1A1A] border-[#8B1A1A] hover:bg-red-50 transition-all shadow-sm"
                  >
                    Hapus Promo
                  </button>
                </>
              ) : (
                <button
                  disabled={isSaving}
                  onClick={handleOpenPromoModal}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
                    !menu.isAvailable ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300' : 'bg-[#FFC700] text-black hover:bg-yellow-500'
                  }`}
                >
                  <Tag size={16} /> Jadikan Promo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 group cursor-pointer" onClick={() => handleEdit('description', menu.description)}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-extrabold text-black">Deskripsi Menu</h3>
            <Pencil size={18} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
          </div>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium group-hover:text-black transition-colors">
            {menu.description?.trim() || 'Deskripsi menu belum tersedia. Klik area ini untuk menambahkan deskripsi.'}
          </p>
        </div>
      </div>
      {renderModal()}
      {renderPromoModal()}
    </>
  );
}
