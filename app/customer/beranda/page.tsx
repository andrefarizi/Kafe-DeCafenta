import React from 'react';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import { ChevronLeft, ChevronRight, Star, ThumbsUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Helper function to assign dummy images based on menu name
function getDummyImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes('kentang') || n.includes('snack')) return '/kentang.png';
  if (n.includes('teh') || n.includes('jus') || n.includes('minuman') || n.includes('es')) return '/IconKopi.png';
  return '/burger.png';
}

const Beranda = async () => {
  // Fetch menus from the database (seeded previously)
  const menus = await prisma.menu.findMany({
    take: 10,
    orderBy: { createdAt: 'asc' }, // just a deterministic sort
  });

  // Assign them to different sections just to make the UI look full
  const promoMenus = menus.slice(0, 4);
  const bestSellers = menus.slice(0, 3);
  const rekomendedMenus = menus.slice(0, 4);
  const keranjangMenus = menus.slice(0, 5);

  const formatRupiah = (price: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800">
      <Sidebar activeMenu='beranda' />

      <main className="flex-1 flex flex-col h-screen overflow-hidden text-left">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-5 space-y-8">

          {/* Banner Selamat Datang */}
          <div className="relative w-full bg-[#DE2014] rounded-[1.5rem] p-10 flex justify-between items-center text-white overflow-hidden shadow-xl min-h-[240px]">
            <div className="z-10 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/Group 2 1.png" alt="De Cafenta" className="h-10 w-auto object-contain" />
                <span className="text-xs font-black tracking-[0.15em] text-white uppercase">DE CAFENTA</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                Selamat Datang Pelanggan<br />
                <span className="text-[#FFD700] drop-shadow-sm">DE CAFENTA</span> Tersayang
              </h1>

              <p className="text-sm font-medium opacity-90 max-w-sm">
                Mulailah harimu dengan secangkir kopi hari ini
              </p>
            </div>

            <div className="z-10 pr-4">
              <img
                src="/IconKopi.png"
                alt="Coffee"
                className="h-48 w-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
              />
            </div>

            <div className="absolute right-0 bottom-0 opacity-10">
              <div className="w-80 h-80 bg-white rounded-full -mr-28 -mb-28"></div>
            </div>
          </div>

          {/* Heading Section */}
          <div className="text-center my-6">
            <h1 className="text-4xl font-black text-[#8A0000]">
              Halo <span className="text-[#FFCC00]">DE CAFENTA MANIA</span>
            </h1>
            <p className="text-2xl text-[#8A0000] font-bold">Pilihlah Menu Terbaik Anda</p>
          </div>

          {/* Promo Spesial Section */}
          <div className="bg-[#FFCC00] rounded-2xl p-6 relative shadow-lg">
            <div className="bg-[#8A0000] rounded-t-xl py-3 text-center mb-0">
              <h3 className="text-white font-black text-2xl tracking-[0.4em] uppercase">
                PROMO SPESIAL
              </h3>
            </div>

            <div className="bg-[#FFCC00] rounded-b-xl p-4 relative flex items-center justify-center gap-4 border-x-[6px] border-b-[6px] border-[#8A0000]">
              <button className="absolute left-0 -translate-x-1/2 z-30 bg-[#8A0000] text-white rounded-full p-2 hover:bg-red-900 transition-all shadow-md flex items-center justify-center">
                <ChevronLeft size={28} strokeWidth={2} />
              </button>

              {/* Grid Kartu Menu */}
              <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-8">
                {promoMenus.map((item) => (
                  <div key={item.id} className="min-w-[180px] bg-[#E32111] rounded-2xl overflow-hidden border-2 border-[#8A0000] shadow-md">
                    <div className="relative h-32">
                      <img
                        src={getDummyImage(item.name)}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-[12px] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{Number(item.avgRating).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="p-3 text-white">
                      <p className="text-sm font-bold truncate mb-1">{item.name}</p>
                      <p className="text-[10px] opacity-80 line-through leading-tight">{formatRupiah(Number(item.price) + 15000)}</p>
                      <p className="text-sm font-black mb-3">{formatRupiah(item.price)}</p>

                      <button className="w-full bg-[#FFF5E1] text-[#8A0000] text-xs font-black py-2 rounded-xl shadow-inner hover:bg-white transition-colors uppercase">
                        Tambah
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="absolute right-0 translate-x-1/2 z-30 bg-[#8A0000] text-white rounded-full p-2 hover:bg-red-900 transition-all shadow-md flex items-center justify-center">
                <ChevronRight size={28} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Best Seller Section */}
          <div className="bg-[#FFC7C7] -mx-5 px-5 py-8 text-center relative overflow-hidden">
            <div className="absolute top-[-45px] right-0 w-45 h-45 pointer-events-none z-0">
              <img
                src="/Rectangle 5cs.png"
                alt="Decoration Top Right"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-0 left-0 w-50 h-50 pointer-events-none z-0">
              <img
                src="/Rectangle 4.png"
                alt="Decoration Bottom Left"
                className="w-full h-full object-left-bottom object-contain"
              />
            </div>
            <h3 className="text-[33px] text-[#8A0000] font-black text-lg uppercase tracking-tight">BEST SELLER</h3>
            <p className="text-[20px] text-gray-600 mb-6">Menu yang paling populer untuk anda</p>

            <div className="flex justify-center gap-16 relative z-10 mb-16">
              {bestSellers.map((item) => (
                <div key={item.id} className="relative">

                  <div className="bg-white rounded-2xl p-4 shadow-md w-50 h-50 relative z-10">
                    <div className="absolute -top-3 -right-3 z-20 w-20 h-20 flex items-center justify-center">
                      <img
                        src="/approve.png"
                        alt="Best Seller Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <img src={getDummyImage(item.name)} className="w-full h-30 object-cover rounded-xl mb-2" alt={item.name} />
                    <p className="text-[14px] font-bold text-black mb-1">{item.name}</p>
                    <p className="text-xs font-bold text-[#8A0000]">{formatRupiah(item.price)}</p>
                  </div>

                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[120%] h-auto z-0 pointer-events-none">
                    <img
                      src="/Group 42.png"
                      alt="Plate Decoration"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Rekomendasi Menu */}
          <section className="mt-8">
            <h3 className="text-[20px] font-bold text-black mb-4">Rekomendasi Menu</h3>
            <div className="grid grid-cols-4 gap-6">
              {rekomendedMenus.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-44">
                    <img src={getDummyImage(item.name)} className="w-full h-full object-cover" alt={item.name} />
                    <div className="absolute top-2 right-2 bg-black/50 text-[11px] text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" /> {Number(item.avgRating).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-black">{item.name}</p>
                    <p className="text-xs text-[#8A0000] font-bold mb-3">{formatRupiah(item.price)}</p>
                    <button className="w-full bg-[#8A0000] text-white text-[10px] font-bold py-1.5 rounded-md hover:bg-red-900 transition-colors">Tambah</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dari Keranjang Anda */}
          <section className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-bold text-black">Dari Keranjang Anda</h3>
              <button className="text-[#8A0000] text-[12px]">Lihat Semua</button>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {keranjangMenus.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-32">
                    <img src={getDummyImage(item.name)} className="w-full h-full object-cover" alt={item.name} />
                    <div className="absolute top-1.5 right-1.5 bg-black/50 text-[10px] text-white px-1 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" /> {Number(item.avgRating).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] font-bold text-black truncate">{item.name}</p>
                    <p className="text-[11px] text-[#8A0000] font-bold mb-2">{formatRupiah(item.price)}</p>
                    <button className="w-full bg-[#8A0000] text-white text-[9px] font-bold py-1 rounded-md">Tambah</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Beranda;