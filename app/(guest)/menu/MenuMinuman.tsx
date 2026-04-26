import React from 'react';

const menuData = Array(4).fill({ 
  id: 4, 
  name: 'Semangka Enjely', 
  price: 'Rp 7.000', 
  rating: '5.0', 
  image: '/jus semangka.png' 
});

export default function MenuMinuman() {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-black mb-4">Menu Minuman</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {menuData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 md:p-5 shadow-lg border border-transparent flex flex-col group hover:shadow-[0px_14px_28px_rgba(0,0,0,0.14)] transition-shadow">
            <div className="relative w-full h-40 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#f4d03f] flex items-center gap-1 z-10">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95１-.69l１.０７-３．２９２z" /></svg>
                {item.rating}
              </div>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-black text-sm md:text-base">{item.name}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1 mb-4">{item.price}</p>
            <button className="w-full py-2 bg-[#8b1c1c] text-white text-sm font-bold rounded-lg hover:bg-[#6b1d1d] transition-colors mt-auto">
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}