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
};

export default function MenuDetailClient({ menu }: { menu: MenuProps }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<'name' | 'price' | 'description' | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Promo modal state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');

  const handleEdit = (field: 'name' | 'price' | 'description', currentValue: string | number | null) => {
    setIsEditing(field);
    setEditValue(currentValue?.toString() || '');
    setEditError('');
  };

  const handleSave = async () => {
    if (!isEditing) return;
    setIsSaving(true);
    
    let payload: { name?: string; price?: number; description?: string } = {};
    if (isEditing === 'name') payload.name = editValue.trim();
    if (isEditing === 'price') payload.price = Number(editValue) || 0;
    if (isEditing === 'description') payload.description = editValue.trim();

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
            Edit {isEditing === 'name' ? 'Nama' : isEditing === 'price' ? 'Harga' : 'Deskripsi'}
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
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:max-w-md flex items-center justify-center mx-auto md:mx-0 bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm group">
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start pt-2">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="w-full flex-1 group cursor-pointer" onClick={() => handleEdit('name', menu.name)}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-black group-hover:text-[#8B1A1A] transition-colors flex items-center gap-3">
                  {menu.name}
                  <Pencil size={20} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
                </h2>
                <p className="text-xs text-gray-500 mt-1">Klik pada nama untuk mengedit</p>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                {/* Promo Button */}
                {menu.isPromo ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-500 rounded-full px-3 py-1.5">
                      <Tag size={12} className="text-yellow-700" />
                      <span className="text-xs font-black text-yellow-700">Promo {menu.discountPercent ?? 0}% OFF</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        disabled={isSaving}
                        onClick={() => { setDiscountInput(String(menu.discountPercent ?? '')); setDiscountError(''); setShowPromoModal(true); }}
                        className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100 transition-all"
                      >
                        Ubah %
                      </button>
                      <button
                        disabled={isSaving}
                        onClick={handleRemovePromo}
                        className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 bg-red-50 text-red-700 border-red-300 hover:bg-red-100 transition-all"
                      >
                        Hapus Promo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled={isSaving}
                    onClick={() => { setDiscountInput(''); setDiscountError(''); setShowPromoModal(true); }}
                    className="px-4 py-2 rounded-full text-xs font-bold border-2 bg-gray-100 text-gray-700 border-gray-300 hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-700 transition-all flex items-center gap-1.5"
                  >
                    <Tag size={12} /> Jadikan Promo
                  </button>
                )}

                <button
                  disabled={isSaving}
                  onClick={handleToggleAvailable}
                  className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                    menu.isAvailable 
                      ? 'bg-green-100 text-green-700 border-green-500 hover:bg-green-200' 
                      : 'bg-red-100 text-red-700 border-red-500 hover:bg-red-200'
                  }`}
                >
                  {menu.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                </button>
              </div>
            </div>

            <div className="mb-8 group cursor-pointer" onClick={() => handleEdit('price', menu.price)}>
              <p className="text-4xl md:text-5xl font-black text-[#8B1A1A] group-hover:text-red-900 transition-colors flex items-center gap-3">
                {formatRupiah(menu.price)}
                <Pencil size={20} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
              </p>
              {menu.isPromo && menu.discountPercent && menu.discountPercent > 0 && (
                <p className="text-base font-bold text-green-600 mt-1">
                  Setelah diskon: {formatRupiah(Math.round(menu.price * (1 - menu.discountPercent / 100)))}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Klik pada harga untuk mengedit</p>
            </div>

            <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 mb-auto self-start">
              <span className="text-gray-700 font-extrabold text-lg">Rating</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Star size={20} fill="#FFC700" className="text-[#FFC700]" />
                <span className="text-black font-black text-xl">{menu.avgRating}</span>
              </div>
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
