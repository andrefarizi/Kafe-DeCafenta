'use client';

import React, { useState } from 'react';
import { createCategory, deleteCategory } from '@/src/controllers/menu-controller';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function KategoriClient({ initialCategories }: { initialCategories: { id: string, name: string }[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    const res = await createCategory(newCategoryName);
    setIsSubmitting(false);

    if (res.success && res.category) {
      toast.success(res.message);
      setCategories([...categories, res.category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName('');
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    
    setDeletingId(id);
    const res = await deleteCategory(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(res.message);
      setCategories(categories.filter(c => c.id !== id));
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="bg-white border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-10 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-black mb-2">Tambah Kategori Baru</h2>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nama kategori..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-5 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] transition-all"
            maxLength={50}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newCategoryName.trim()}
            className="bg-[#8B1A1A] hover:bg-red-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Tambah
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-black mb-4">Daftar Kategori</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada kategori.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5">
                <span className="font-bold text-black">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={deletingId === cat.id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  aria-label="Hapus kategori"
                >
                  {deletingId === cat.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 flex items-start gap-2 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
        <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 font-medium">
          Catatan: Anda tidak dapat menghapus kategori yang masih digunakan oleh menu. Jika ingin menghapus, pastikan tidak ada menu yang terkait dengan kategori tersebut.
        </p>
      </div>
    </div>
  );
}
