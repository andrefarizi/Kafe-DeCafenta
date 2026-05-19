'use client';

import React, { useState } from 'react';
import { Pencil, Star, Loader2 } from 'lucide-react';
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
};

export default function MenuDetailClient({ menu }: { menu: MenuProps }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<'name' | 'price' | 'description' | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (field: 'name' | 'price' | 'description', currentValue: string | number | null) => {
    setIsEditing(field);
    setEditValue(currentValue?.toString() || '');
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

  const handleTogglePromo = async () => {
    setIsSaving(true);
    const res = await updateMenuDetail(menu.id, { isPromo: !menu.isPromo });
    setIsSaving(false);
    
    if (res.success) {
      toast.success(menu.isPromo ? 'Menu dihapus dari promo' : 'Menu ditambahkan ke promo');
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
              className="w-full border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#8B1A1A] font-medium"
              rows={4}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Masukkan deskripsi..."
            />
          ) : isEditing === 'price' ? (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
              <input
                type="number"
                className="w-full border-2 border-gray-300 rounded-xl p-3 pl-12 focus:outline-none focus:border-[#8B1A1A] font-medium"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="0"
              />
            </div>
          ) : (
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#8B1A1A] font-medium"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Nama Menu"
            />
          )}

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
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#8B1A1A] hover:bg-red-900 transition-colors flex items-center space-x-2"
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

  return (
    <>
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-8 mb-8 bg-white shadow-sm relative">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="relative w-full md:w-1/2 aspect-square max-w-sm flex items-center justify-center mx-auto md:mx-0 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-sm group">
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* 
              Catatan: Edit Gambar seringkali melibatkan upload file kompleks, 
              untuk sekarang tombol ini akan kita buat untuk visual UI atau 
              nanti diintegrasikan dengan fitur upload terpisah.
            */}
            {/* <button className="absolute bottom-4 right-4 flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
              <Pencil size={14} fill="currentColor" className="text-white" />
              <span className="text-xs font-bold">Edit Gambar</span>
            </button> */}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start pt-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="relative group cursor-pointer inline-block w-fit" onClick={() => handleEdit('name', menu.name)}>
                <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-1">
                  <Pencil size={12} strokeWidth={3} />
                  <span className="text-[11px] font-extrabold">Edit Nama</span>
                </button>
                <h2 className="text-3xl font-extrabold text-black group-hover:text-[#8B1A1A] transition-colors">{menu.name}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  disabled={isSaving}
                  onClick={handleTogglePromo}
                  className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                    menu.isPromo 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-500 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {menu.isPromo ? 'Status: Sedang Promo' : 'Jadikan Promo'}
                </button>
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

            <div className="mb-10 relative group cursor-pointer inline-block w-fit" onClick={() => handleEdit('price', menu.price)}>
              <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-1">
                <Pencil size={12} strokeWidth={3} />
                <span className="text-[11px] font-extrabold">Edit Harga</span>
              </button>
              <p className="text-5xl font-black text-black group-hover:text-[#8B1A1A] transition-colors">{formatRupiah(menu.price)}</p>
            </div>

            <div className="bg-[#8B1A1A] rounded-3xl p-2.5 w-60 shadow-sm mt-auto">
              <div className="bg-white text-[#8B1A1A] text-center font-extrabold text-lg py-2 rounded-2xl mb-2">
                Rating
              </div>
              <div className="flex justify-center items-center space-x-3 pb-1 pt-1">
                <span className="text-white font-black text-2xl">{menu.avgRating}</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFC700" className="text-[#FFC700]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 group cursor-pointer" onClick={() => handleEdit('description', menu.description)}>
          <button className="flex items-center space-x-1.5 text-[#8B1A1A] hover:underline mb-2">
            <Pencil size={12} strokeWidth={3} />
            <span className="text-[11px] font-extrabold">Edit Deskripsi</span>
          </button>
          <h3 className="text-lg font-extrabold text-black mb-3">
            Deskripsi Menu
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium max-w-3xl group-hover:text-black transition-colors">
            {menu.description?.trim() || 'Deskripsi menu belum tersedia. Klik untuk menambahkan deskripsi.'}
          </p>
        </div>
      </div>
      {renderModal()}
    </>
  );
}
