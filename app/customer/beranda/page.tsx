import React from 'react';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import { Star } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import PromoCarousel from './PromoCarousel';
import { auth } from '@/lib/auth';
import {
  getBestSellerMenus,
  // getCustomerOrderHistoryMenus,
  getPromoMenus,
  getRecommendedMenus,
  getCustomerCartMenus,
} from '@/src/controllers/menu-controller';

// Helper function to assign dummy images based on menu name
function getDummyImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes('kentang') || n.includes('snack')) return '/kentang.png';
  if (n.includes('teh') || n.includes('jus') || n.includes('minuman') || n.includes('es')) return '/IconKopi.png';
  return '/burger.png';
}

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const resolveMenuImage = (name: string, categoryName: string, imageUrl?: string | null) => {
  return imageUrl || categoryFallbacks[categoryName] || getDummyImage(name);
};

const Beranda = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const [promoMenus, bestSellers, rekomendedMenus, keranjangMenus] = await Promise.all([
    getPromoMenus(4),
    getBestSellerMenus(3),
    getRecommendedMenus(4),
    // userId ? getCustomerOrderHistoryMenus(userId, 5) : Promise.resolve([]),
    userId ? getCustomerCartMenus(userId, 5) : Promise.resolve([]),
  ]);

  const formatRupiah = (price: number | string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));
  };

  const promoItems = promoMenus.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    avgRating: Number(item.avgRating),
    image: resolveMenuImage(item.name, item.categoryName, item.imageUrl),
    isAvailable: item.isAvailable ?? true,
  }));

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

            <PromoCarousel items={promoItems} />
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
                  <Link 
                    key={item.id} 
                    href={item.isAvailable === false ? '#' : `/customer/detail_menu/${item.id}`} 
                    className={`relative ${item.isAvailable === false ? 'cursor-not-allowed pointer-events-none' : ''}`}
                  >

                    <div className={`bg-white rounded-2xl p-4 shadow-md w-50 h-50 relative z-10 ${item.isAvailable === false ? 'opacity-80 grayscale' : ''}`}>
                      <div className="absolute -top-3 -right-3 z-20 w-20 h-20 flex items-center justify-center">
                        <img
                          src="/approve.png"
                          alt="Best Seller Icon"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <img
                        src={resolveMenuImage(item.name, item.categoryName, item.imageUrl)}
                        className="w-full h-30 object-cover rounded-xl mb-2"
                        alt={item.name}
                      />
                      {item.isAvailable === false && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1 text-[11px] font-black rounded-md whitespace-nowrap z-30 shadow-md">
                          TIDAK TERSEDIA
                        </div>
                      )}
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

                  </Link>
                ))}
            </div>
          </div>

          {/* Rekomendasi Menu */}
          <section className="mt-8">
            <h3 className="text-[20px] font-bold text-black mb-4">Rekomendasi Menu</h3>
            <div className="grid grid-cols-4 gap-6">
              {rekomendedMenus.map((item) => {
                const imageSrc = resolveMenuImage(item.name, item.categoryName, item.imageUrl);

                return (
                  <Link 
                    key={item.id} 
                    href={item.isAvailable === false ? '#' : `/customer/detail_menu/${item.id}`} 
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${item.isAvailable === false ? 'cursor-not-allowed pointer-events-none opacity-80 grayscale' : 'hover:shadow-md transition-shadow'}`}
                  >
                    <div className="relative h-44">
                      <img
                        src={imageSrc}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                      {item.isAvailable === false && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                          <span className="bg-red-600 text-white px-3 py-1 text-[11px] font-black rounded-full">TIDAK TERSEDIA</span>
                        </div>
                      )}
                    <div className="absolute top-2 right-2 bg-black/50 text-[11px] text-white px-1.5 py-0.5 rounded-full flex items-center gap-1 z-30">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" /> {Number(item.avgRating).toFixed(1)}
                    </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-[#8A0000] font-bold mb-3">{formatRupiah(item.price)}</p>
                      {item.isAvailable !== false && (
                        <AddToCartButton
                          item={{
                            id: item.id,
                            name: item.name,
                            price: Number(item.price),
                            image: imageSrc,
                          }}
                          className="w-full bg-[#8A0000] text-white text-[10px] font-bold py-1.5 rounded-md hover:bg-red-900 transition-colors"
                        />
                      )}
                      {item.isAvailable === false && (
                        <div className="w-full bg-gray-400 text-white text-[10px] text-center font-bold py-1.5 rounded-md">
                          HABIS
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Dari Keranjang Anda */}
          <section className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-bold text-black">Dari Keranjang Anda</h3>
              {keranjangMenus.length > 0 && (
                <button className="text-[#8A0000] text-[12px]">Lihat Semua</button>
              )}
            </div>
            {keranjangMenus.length === 0 ? (
              <p className="text-sm font-bold text-gray-600">Anda belum memesan menu apapun.</p>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {keranjangMenus.map((item) => {
                  const imageSrc = resolveMenuImage(item.name, item.categoryName, item.imageUrl);

                  return (
                    <Link key={item.id} href={`/customer/detail_menu/${item.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32">
                        <img
                          src={imageSrc}
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                      <div className="absolute top-1.5 right-1.5 bg-black/50 text-[10px] text-white px-1 py-0.5 rounded-full flex items-center gap-0.5">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" /> {Number(item.avgRating).toFixed(1)}
                      </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[12px] font-bold text-black truncate">{item.name}</p>
                        <p className="text-[11px] text-[#8A0000] font-bold mb-2">{formatRupiah(item.price)}</p>
                        <AddToCartButton
                          item={{
                            id: item.id,
                            name: item.name,
                            price: Number(item.price),
                            image: imageSrc,
                          }}
                          className="w-full bg-[#8A0000] text-white text-[9px] font-bold py-1 rounded-md"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Beranda;