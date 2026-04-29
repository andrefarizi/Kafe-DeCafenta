"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Search, Star } from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Semua Menu");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const categories = ["Semua Menu", "Nasi", "Mie", "Snack", "Minuman"];

  const menuData = {
    Nasi: [
      { id: 1, name: "Nasgor wira", price: "Rp 15.000", rating: "5.0", image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg" },
      { id: 2, name: "Nasgor wira", price: "Rp 15.000", rating: "5.0", image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg" },
      { id: 3, name: "Nasgor wira", price: "Rp 15.000", rating: "5.0", image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg" },
      { id: 4, name: "Nasgor wira", price: "Rp 15.000", rating: "5.0", image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg" },
      { id: 5, name: "Nasgor wira", price: "Rp 15.000", rating: "5.0", image: "https://www.dapurkobe.co.id/wp-content/uploads/nasi-goreng-kencur-kemangi.jpg" },
    ],
    Mie: [
      { id: 6, name: "Mie Bakso Zhrn", price: "Rp 20.000", rating: "5.0", image: "https://asset.kompas.com/crops/ipkaNYHecesaQlMwLopA-YvbB5o=/0x0:1500x1000/1200x800/data/photo/2021/01/20/6007eb25c08c3.jpg" },
      { id: 7, name: "Mie Bakso Zhrn", price: "Rp 20.000", rating: "5.0", image: "https://asset.kompas.com/crops/ipkaNYHecesaQlMwLopA-YvbB5o=/0x0:1500x1000/1200x800/data/photo/2021/01/20/6007eb25c08c3.jpg" },
      { id: 8, name: "Mie Bakso Zhrn", price: "Rp 20.000", rating: "5.0", image: "https://asset.kompas.com/crops/ipkaNYHecesaQlMwLopA-YvbB5o=/0x0:1500x1000/1200x800/data/photo/2021/01/20/6007eb25c08c3.jpg" },
      { id: 9, name: "Mie Bakso Zhrn", price: "Rp 20.000", rating: "5.0", image: "https://asset.kompas.com/crops/ipkaNYHecesaQlMwLopA-YvbB5o=/0x0:1500x1000/1200x800/data/photo/2021/01/20/6007eb25c08c3.jpg" },
      { id: 10, name: "Mie Bakso Zhrn", price: "Rp 20.000", rating: "5.0", image: "https://asset.kompas.com/crops/ipkaNYHecesaQlMwLopA-YvbB5o=/0x0:1500x1000/1200x800/data/photo/2021/01/20/6007eb25c08c3.jpg" },
    ],
    Snack: [
      { id: 11, name: "Kentang Goreng", price: "Rp 12.000", rating: "5.0", image: "https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" },
      { id: 12, name: "Kentang Goreng", price: "Rp 12.000", rating: "5.0", image: "https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" },
      { id: 13, name: "Kentang Goreng", price: "Rp 12.000", rating: "5.0", image: "https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" },
      { id: 14, name: "Kentang Goreng", price: "Rp 12.000", rating: "5.0", image: "https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" },
      { id: 15, name: "Kentang Goreng", price: "Rp 12.000", rating: "5.0", image: "https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" },
    ],
      Minuman: [
      { id: 16, name: "Semangka Enjely", price: "Rp 7.000", rating: "5.0", image: "https://www.yesdok.com/visual/slideshow/plastic-cup-with-fresh-watermelon-juice-grey-article-1618187592.jpg?w=1200" },
      { id: 17, name: "Semangka Enjely", price: "Rp 7.000", rating: "5.0", image: "https://www.yesdok.com/visual/slideshow/plastic-cup-with-fresh-watermelon-juice-grey-article-1618187592.jpg?w=1200" },
      { id: 18, name: "Semangka Enjely", price: "Rp 7.000", rating: "5.0", image: "https://www.yesdok.com/visual/slideshow/plastic-cup-with-fresh-watermelon-juice-grey-article-1618187592.jpg?w=1200" },
      { id: 19, name: "Semangka Enjely", price: "Rp 7.000", rating: "5.0", image: "https://www.yesdok.com/visual/slideshow/plastic-cup-with-fresh-watermelon-juice-grey-article-1618187592.jpg?w=1200" },
      { id: 20, name: "Semangka Enjely", price: "Rp 7.000", rating: "5.0", image: "https://www.yesdok.com/visual/slideshow/plastic-cup-with-fresh-watermelon-juice-grey-article-1618187592.jpg?w=1200" },
    ]
  };

  const MenuItem = ({ item }: { item: any }) => (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="relative w-full h-[160px] rounded-[15px] overflow-hidden mb-3">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {item.rating}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-black text-md mb-1">{item.name}</h3>
          <p className="text-sm text-black font-medium">{item.price}</p>
        </div>
        <button 
          onClick={() => setIsSuccessModalOpen(true)}
          className="w-full bg-[#8B0000] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#6A0000] transition-colors mt-4"
        >
          Tambah
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu="menu" />

      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-6 lg:p-8 pt-4">
          <h1 className="text-2xl font-extrabold text-black tracking-tight mb-6">Menu De Cafenta</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFC107] p-2 rounded-full">
              <Search size={18} className="text-white" strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="Cari Menu Pilihan Anda" 
              className="w-full bg-white border-2 border-[#FFC107] rounded-full py-4 pl-16 pr-6 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 shadow-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-5 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-2.5 rounded-full text-lg font-bold border-2 transition-all ${
                  activeCategory === category 
                    ? "bg-[#8B0000] border-[#8B0000] text-white" 
                    : "bg-white border-[#8B0000] text-black hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="space-y-10">
            {(activeCategory === "Semua Menu" || activeCategory === "Nasi") && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Menu Nasi</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {menuData.Nasi.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === "Semua Menu" || activeCategory === "Mie") && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Menu Mie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {menuData.Mie.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === "Semua Menu" || activeCategory === "Snack") && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Menu Snack</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {menuData.Snack.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === "Semua Menu" || activeCategory === "Minuman") && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Menu Minuman</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {menuData.Minuman.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL MENU SUKSES DITAMBAHKAN */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-[3px] border-[#8B0000] rounded-[36px] w-full max-w-[600px] p-12 text-center shadow-2xl">
              
              <div className="flex justify-center ">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex justify-center items-center">
                    <img 
                      src="/makanan.png" 
                      alt="Berhasil" 
                      className="w-36 h-36 object-contain "
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-[36px] font-extrabold text-black mb-4 tracking-tight">Menu Sukses ditambahkan!</h2>
              
              <p className="text-black font-medium text-[16px] leading-relaxed mb-12 px-6">
                Selamat menu kamu telah berhasil ditambahkan<br />
                silahkan periksa keranjang anda sekarang
              </p>

              <div className="flex flex-col gap-4 px-8">
                <button 
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    // Tambahkan aksi redirect ke halaman keranjang jika diperlukan
                  }}
                  className="w-full bg-[#8B0000] text-white py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-[#6A0000] transition-colors shadow-md"
                >
                  Periksa Keranjang
                </button>
                <button 
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full bg-white border-[2.5px] border-[#8B0000] text-[#8B0000] py-4 rounded-[16px] font-extrabold text-[20px] hover:bg-red-50 transition-colors"
                >
                  Lanjut Memesan
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
