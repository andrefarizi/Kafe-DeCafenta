'use client';

import React, { useState } from 'react';
import { updateMenuStock, updateMenuDetail } from '@/src/controllers/menu-controller';
import { Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KasirKelolaStokClient({ initialMenus }: { initialMenus: any[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredMenus = menus.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUpdateStock = async (id: string, value: string) => {
    setUpdatingId(id);
    const stockVal = value.trim() === '' ? null : parseInt(value, 10);
    
    if (stockVal !== null && stockVal < 0) {
      toast.error('Stok tidak boleh negatif.');
      setUpdatingId(null);
      return;
    }

    const res = await updateMenuStock(id, stockVal);
    if (res.success) {
      toast.success('Stok diperbarui');
      setMenus(menus.map(m => m.id === id ? { ...m, stock: stockVal } : m));
    } else {
      toast.error(res.message);
    }
    setUpdatingId(null);
  };

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const res = await updateMenuDetail(id, { isAvailable: !currentStatus });
    if (res.success) {
      toast.success(currentStatus ? 'Menu ditandai tidak tersedia' : 'Menu ditandai tersedia');
      setMenus(menus.map(m => m.id === id ? { ...m, isAvailable: !currentStatus } : m));
    } else {
      toast.error(res.message);
    }
    setUpdatingId(null);
  };

  return (
    <div className="bg-white border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-center w-full border-2 border-gray-200 rounded-xl mb-6 shadow-sm bg-gray-50 px-4 focus-within:border-[#8B1A1A] transition-colors">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari menu..."
          className="w-full px-4 py-3 text-sm focus:outline-none placeholder-gray-400 font-medium bg-transparent"
        />
      </div>

      <div className="space-y-4">
        {filteredMenus.map((menu) => (
          <div key={menu.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#8B1A1A] transition-colors bg-white gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img src={menu.imageUrl || '/nasi goreng.png'} alt={menu.name} className={`w-16 h-16 rounded-lg object-cover ${!menu.isAvailable ? 'grayscale opacity-70' : ''}`} />
              <div>
                <h3 className="font-extrabold text-black">{menu.name}</h3>
                <p className="text-sm font-medium text-gray-500">{menu.categoryName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-600">Stok:</span>
                <input
                  type="number"
                  placeholder="Unlimited"
                  defaultValue={menu.stock === null ? '' : menu.stock}
                  onBlur={(e) => {
                    if (e.target.value !== String(menu.stock === null ? '' : menu.stock)) {
                      handleUpdateStock(menu.id, e.target.value);
                    }
                  }}
                  disabled={updatingId === menu.id}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-[#8B1A1A]"
                />
              </div>

              <button
                onClick={() => handleToggleAvailable(menu.id, menu.isAvailable)}
                disabled={updatingId === menu.id}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all flex items-center justify-center min-w-[120px] ${
                  menu.isAvailable 
                    ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]' 
                    : 'bg-white text-gray-500 border-gray-300'
                }`}
              >
                {updatingId === menu.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  menu.isAvailable ? 'Tersedia' : 'Tidak Tersedia'
                )}
              </button>
            </div>
          </div>
        ))}
        {filteredMenus.length === 0 && (
          <p className="text-center text-gray-500 font-medium py-8">Menu tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}
