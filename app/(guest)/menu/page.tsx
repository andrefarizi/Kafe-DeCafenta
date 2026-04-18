import React from 'react';

// --- Tipe Data TypeScript ---
interface MenuItem {
  id: number;
  name: string;
  price: string;
  rating: string;
}

// --- Data Dummy ---
const menuNasi: MenuItem[] = Array(4).fill({ id: 1, name: 'Nasgor wira', price: 'Rp 15.000', rating: '5.0' });
const menuMie: MenuItem[] = Array(4).fill({ id: 2, name: 'Mie Bakso Zhrn', price: 'Rp 20.000', rating: '5.0' });
const menuSnack: MenuItem[] = Array(4).fill({ id: 3, name: 'Kentang Goreng', price: 'Rp 12.000', rating: '5.0' });
const menuMinuman: MenuItem[] = Array(4).fill({ id: 4, name: 'Semangka Enjely', price: 'Rp 7.000', rating: '5.0' });

const categories = ['Semua Menu', 'Nasi', 'Mie', 'Snack', 'Minuman'];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-black">D</span>
          <span className="text-xs font-bold text-[#8b1c1c] tracking-widest mt-1">DE CAFENTA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-800">
          <a href="#" className="hover:text-[#8b1c1c] transition-colors">Tentang Kami</a>
          {/* Teks "Menu" berwarna merah menandakan halaman aktif */}
          <a href="#" className="text-[#8b1c1c]">Menu</a>
          <a href="#" className="hover:text-[#8b1c1c] transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-[#8b1c1c] text-white text-sm font-bold rounded-full hover:bg-[#6b1d1d] transition-colors">
            Masuk
          </button>
          <button className="px-6 py-2 bg-transparent border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm font-bold rounded-full hover:bg-[#8b1c1c] hover:text-white transition-colors">
            Daftar
          </button>
        </div>
      </nav>

      {/* ================= HEADER MENU ================= */}
      <section className="px-8 md:px-16 pt-10 pb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black mb-6">Menu De Cafenta</h1>

        {/* Search Bar */}
        <div className="relative flex items-center mb-6">
          <div className="absolute left-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center z-10 shadow-sm">
            {/* Search Icon */}
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari Menu Pilihan Anda" 
            className="w-full pl-14 pr-4 py-3 rounded-full bg-white border border-[#f4d03f] focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm shadow-sm"
          />
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <button 
              key={index}
              className={`px-8 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                index === 0 
                  ? 'bg-[#8b1c1c] border-[#8b1c1c] text-white' // Aktif
                  : 'bg-transparent border-[#8b1c1c] text-[#8b1c1c] hover:bg-red-50' // Tidak aktif
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= KONTEN MENU ================= */}
      <section className="px-8 md:px-16 pb-20 max-w-7xl mx-auto space-y-12">
        {/* Kategori Nasi */}
        <MenuSection title="Menu Nasi" items={menuNasi} />
        {/* Kategori Mie */}
        <MenuSection title="Menu Mie" items={menuMie} />
        {/* Kategori Snack */}
        <MenuSection title="Menu Snack" items={menuSnack} />
        {/* Kategori Minuman */}
        <MenuSection title="Menu Minuman" items={menuMinuman} />
      </section>

      {/* ================= KONTAK & FOOTER ================= */}
      <div className="relative bg-gradient-to-b from-[#fafafa] to-[#eab2a9] pt-10 pb-10 px-4 md:px-8">
        {/* Kotak Kontak Merah di Tengah */}
        <div className="relative max-w-5xl mx-auto bg-[#9c2518] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl z-10 mb-16 mt-10">
          
          {/* Ilustrasi Kotak Pos */}
          <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0 relative">
             <div className="absolute -top-16 md:-top-32 w-48 h-64 bg-white/10 rounded-xl border-2 border-dashed border-white/40 flex items-center justify-center backdrop-blur-md">
                <p className="text-white text-xs text-center p-2">Export 3D Mailbox Figma Letakkan Disini</p>
             </div>
             <div className="w-48 h-32 opacity-0"></div> 
          </div>

          {/* Form Tanya */}
          <div className="w-full md:w-2/3 md:pl-10 text-white">
            <h3 className="text-sm font-bold mb-1">Punya Pertanyaan?</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
              Kirimkan pertanyaan terbaik anda kepada pihak <span className="text-[#f4d03f]">DA CAFENTA</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <div className="absolute left-1 top-1 w-10 h-10 bg-[#f4d03f] rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Pertanyaan" 
                  className="w-full pl-14 pr-4 py-3.5 rounded-full bg-white border-none focus:ring-2 focus:ring-[#f4d03f] focus:outline-none text-gray-700 shadow-inner text-sm"
                />
              </div>
              <button className="w-full md:w-auto px-10 py-3.5 bg-[#f4d03f] text-black font-extrabold rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap">
                Kirim
              </button>
            </div>
            <p className="text-[10px] md:text-xs text-white/70 mt-3 font-medium">
              Setiap pertanyaan anda akan menjadi pesan agar kami melakukan improvisasi
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <footer className="text-center pt-8 pb-4 z-0 relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl font-extrabold text-black">D</span>
            <span className="text-sm font-bold text-white tracking-widest mt-1">DE CAFENTA</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[#6b1d1d] font-bold text-sm mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <p>Durian Jengkol, Kec. Pancur Batu, Kabupaten Deli Serdang, Sumatera Utara</p>
          </div>
          <p className="text-[#6b1d1d] font-extrabold text-sm">Buka 10:00 - 22:00 WIB</p>
        </footer>
      </div>

    </div>
  );
}

// ================= KOMPONEN BANTUAN ================= //

function MenuSection({ title, items }: { title: string, items: MenuItem[] }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-black mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <MenuCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

function MenuCard({ data }: { data: MenuItem }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
      {/* Area Gambar dengan Badge Rating */}
      <div className="relative w-full h-40 bg-gray-200 rounded-xl mb-3 overflow-hidden border border-dashed border-gray-300 flex items-center justify-center">
        {/* Badge Rating */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#f4d03f] flex items-center gap-1 z-10">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {data.rating}
        </div>
        
        {/* Teks Pengganti Gambar Asli */}
        <span className="text-xs text-gray-500 font-medium">Gambar {data.name}</span>
      </div>

      {/* Info Menu */}
      <h3 className="font-extrabold text-black text-base">{data.name}</h3>
      <p className="text-xs font-bold text-gray-500 mt-1 mb-4">{data.price}</p>

      {/* Tombol Tambah */}
      <button className="w-full py-2 bg-[#8b1c1c] text-white text-sm font-bold rounded-lg hover:bg-[#6b1d1d] transition-colors mt-auto">
        Tambah
      </button>
    </div>
  );
}