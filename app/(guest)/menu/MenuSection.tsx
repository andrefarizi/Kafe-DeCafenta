import React from 'react';
import Link from 'next/link';

type GuestMenuItem = {
  id: string;
  name: string;
  price: string;
  rating: string;
  image: string;
  category: string;
};

type MenuSectionProps = {
  title: string;
  items: GuestMenuItem[];
  onAdd: () => void;
};

export default function MenuSection({ title, items, onAdd }: MenuSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-black mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm font-bold text-gray-500">Menu belum tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/customer/detail_menu/${item.id}`}
              className="block h-full"
            >
              <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative w-full h-[160px] rounded-[15px] overflow-hidden mb-3">
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold z-10">
                    <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {item.rating}
                  </div>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-black text-md mb-1">{item.name}</h3>
                    <p className="text-sm text-black font-medium">{item.price}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onAdd();
                      }}
                      className="w-full bg-[#8B0000] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#6A0000] transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export type { GuestMenuItem };
