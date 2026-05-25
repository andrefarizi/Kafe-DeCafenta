'use client';

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { hapusMenu } from '@/src/controllers/menu-controller';
import toast from 'react-hot-toast';

export default function DeleteMenuButton({ menuId, menuName }: { menuId: string, menuName: string }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMenu = async () => {
    setIsDeleting(true);
    const res = await hapusMenu(menuId);
    setIsDeleting(false);
    if (res.success) {
      toast.success(res.message);
      router.push('/owner/menu');
      router.refresh();
    } else {
      toast.error(res.message);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowDeleteModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-500 text-red-600 bg-red-50 hover:bg-red-200 transition-all font-bold text-sm shadow-sm"
      >
        <Trash2 size={16} />
        Hapus Menu
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-xl font-extrabold text-black">Hapus Menu?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-black">{menuName}</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteMenu}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#8B1A1A] hover:bg-red-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
