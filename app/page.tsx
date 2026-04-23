import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden selection:bg-[#f4d03f] selection:text-black">
      
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-1">
          {/* Placeholder Icon D Navbar */}
          <img src="/Group 2 1.png" alt="Icon" className="w-10 h-10  object-contain" />
          <span className="text-sm font-extrabold text-[#c8100e] tracking-widest mt-3">DE CAFENTA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold">
          <a href="#" className="text-[#8b1c1c]">Tentang Kami</a>
          <Link href="/menu" className="text-black hover:text-[#8b1c1c] transition-colors">Menu</Link>
          <a href="#footer" className="text-black hover:text-[#8b1c1c] transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-8 py-2.5 bg-[#8b1c1c] text-white text-sm font-bold rounded-full hover:bg-[#6b1d1d] transition-colors">
            Masuk
          </Link>
          <Link href="/daftar" className="px-8 py-2.5 bg-white border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm font-bold rounded-full hover:bg-[#8b1c1c] hover:text-white transition-colors">
            Daftar
          </Link>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative text-white pt-20 pb-40 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
        
        {/* Background Full dari Figma, diposisikan ke bawah (object-bottom) agar kurva tidak terpotong */}
        <img 
          src="/Rectangle 1.png" 
          alt="Coffee Background" 
          className="absolute inset-0 w-full h-full object-cover object-bottom z-0" 
        />

        {/* Ornamen Shape Kanan Atas - Disesuaikan agar tidak melebihi kurva bawah */}
        <div className="absolute inset-0 z-0 overflow-hidden flex justify-end items-start">
          <img 
            src="/Rectangle 2.png" 
            alt="Shape Right" 
            className="w-[40%] md:w-auto h-[50%] md:h-[60%] object-cover object-right-top opacity-90 -translate-y-8"
          />
        </div>

        {/* Konten Kiri */}
        <div className="w-full md:w-1/2 relative z-10 pt-4">
          <p className="text-lg font-bold mb-3 tracking-wide">Work &amp; Coffee Starts Here</p>
          <h1 className="text-5xl md:text-[64px] font-black leading-[1.1] mb-6">
            Nikmati Kopi &amp; Makanan Terbaik di <span className="text-[#f4d03f]">De Cafenta</span>
          </h1>
          <p className="text-base md:text-lg font-medium mb-10 text-white/90">
            Tempat nyaman dengan WIFI gratis untuk kerja &amp; santai
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Link href="/login" className="px-10 py-4 bg-[#f4d03f] text-black font-extrabold rounded-[10px] hover:bg-yellow-500 transition-colors">
              Pesan Sekarang
            </Link>
            <Link href="/menu" className="px-10 py-4 bg-transparent border-2 border-white text-white font-extrabold rounded-[10px] hover:bg-white hover:text-[#a52016] transition-colors">
              Lihat Menu
            </Link>
          </div>

          {/* Statistik */}
          <div className="flex items-center gap-12">
            <div>
              <p className="text-3xl font-black">4 Tahun</p>
              <p className="text-sm font-medium text-white/80 mt-1">Beroperasi</p>
            </div>
            <div>
              <p className="text-3xl font-black">20+</p>
              <p className="text-sm font-medium text-white/80 mt-1">Produk</p>
            </div>
            <div>
              <p className="text-3xl font-black">4.9 Rate</p>
              <p className="text-sm font-medium text-white/80 mt-1">Kepuasan</p>
            </div>
          </div>
        </div>

        {/* Ilustrasi Kanan Placeholder */}
        <div className="w-full md:w-1/2 flex justify-end mt-16 md:mt-0 relative z-10 pr-10">
          <div className="w-180 h-100   flex flex-col items-center justify-center p-6  rounded-xl">
            <img src="/Group 1.png" alt="image" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Gambar Biji Kopi Overlapping (Absolute Placeholder) */}
        <div className="absolute right-0 -bottom-24  h-120 z-20 hidden md:flex items-center justify-center ">
            <img src="/—Pngtree—bunch of coffee raw beans_20488485 1.png" alt="image" className="w-full h-full object-contain" />
        </div>

      </section>

      {/* ================= BERBAGAI MENU PILIHAN ================= */}
      <section className="pt-16 pb-28 px-8 text-center bg-white relative z-10">
        <h2 className="text-[2.2rem] font-black text-black mb-3">Berbagai Menu Pilihan</h2>
        <p className="text-base font-semibold text-[#a52016] mb-14">Semua menu terbaik kami siapkan untuk anda</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto px-1">
          {[
            { id: 1, img: "/Frame 26.png", clip: "polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)" },
            { id: 2, img: "/Frame 20.png", clip: "polygon(0% 10%, 100% 10%, 100% 90%, 0% 90%)" },
            { id: 3, img: "/Frame 19.png", clip: "polygon(0% 10%, 100% 10%, 100% 90%, 0% 90%)" },
            { id: 4, img: "/Frame 26 (1).png", clip: "polygon(0% 10%, 100% 0%, 100% 100%, 0% 90%)" },
          ].map((item) => (
            <div key={item.id} 
                 className="relative overflow-hidden h-56 w-full"
                 style={{ clipPath: item.clip }}>
               <img src={item.img} alt={`Menu ${item.id}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROMO MENU TERBAIK ================= */}
      <section className="relative py-40 px-8 overflow-hidden">
        
        {/* Background Full dari Figma */}
        <img 
          src="/Frame 25.png" 
          alt="Promo Background" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />

        {/* Blob Kuning di Belakang Card */}
        <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] max-w-[1050px] h-[200px] bg-[#fbd008] rounded-b-[4rem] z-0"></div>

        <div className="relative z-10 text-center mb-14 -mt-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-wide">Nikmati Promo Menu Terbaik!</h2>
          <p className="text-base font-semibold text-white">
            Jangan sampai ketinggalan promo menu-menu terbaik <span className="text-[#fbd008] font-black">DA CAFENTA</span>
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PromoCard title="Hamburger" oldPrice="Rp 20.000" newPrice="Rp 10.000" imgSrc="/Frame 26.png" />
          <PromoCard title="Americano Caffe" oldPrice="Rp 24.000" newPrice="Rp 15.000" imgSrc="/Frame 26 (1).png" />
          <PromoCard title="Steak" oldPrice="Rp 35.000" newPrice="Rp 21.000" imgSrc="/Frame 26 (2).png" />
        </div>
      </section>

      {/* ================= PELAYANAN KAMI ================= */}
      <section className="pt-24 pb-80 px-8 bg-[#fdfdfd] text-center relative z-10">
        <h2 className="text-[2.2rem] font-black text-black mb-3">Pelayanan Kami</h2>
        <p className="text-base font-semibold text-[#a52016] mb-16">Berbagai Pelayanan dan Fasilitas demi kenyamanan anda</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <ServiceCard title="Biji Kopi Terbaik" desc="Kami menggunakan biji kopi terbaik guna memberikan sensasi rasa yang bernilai" iconSrc="/Group (1).png" />
          <ServiceCard title="Karyawan Berpengalaman" desc="Karyawan terlatih siap melayani pesanan anda dengan baik" iconSrc="/BARISTA.png" />
          <ServiceCard title="Tempat Nyaman" desc="Suasana estetik modern & santai dengan tempat yang aman dan nyaman" iconSrc="/Group (2).png" />
          <ServiceCard title="Promo Terbaik" desc="Berbagai promo siap anda nikmati dan rasakan" iconSrc="/Food Icon Illustrations Kit.png" />
        </div>
      </section>

      {/* ================= KONTAK & FOOTER ================= */}
      {/* Background Section Full Solid Pink, tidak digradasi */}
      <div id="footer" className="relative bg-[#ff9c9c] pt-16 pb-8 px-4 md:px-8 overflow-visible">
        
        {/* Kotak Kontak Merah di Tengah */}
        <div className="relative max-w-[1000px] mx-auto bg-[#c40202] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-2xl z-10 mb-20 md:min-h-[280px] -mt-55">
          
          {/* Kiri: Ilustrasi Kotak Pos Placeholder */}
          <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0 relative">
             <div className="md:absolute md:-top-[300px] w-200 h-120 rounded-2xl flex flex-col items-center justify-center ">
                <img src="/ikon-pos-3d-dengan-kotak-surat 1.png" alt="image" className="w-full h-full object-contain" />
             </div>
             <div className="hidden md:block w-56 h-10"></div> 
          </div>

          {/* Kanan: Form Tanya */}
          <div className="w-full md:w-2/3 md:pl-12 text-white">
            <h3 className="text-sm font-bold mb-2 text-white/90">Punya Pertanyaan?</h3>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-snug">
              Kirimkan pertanyaan terbaik anda kepada pihak <span className="text-[#f4d03f]">DA CAFENTA</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="relative w-full">
                <div className="absolute left-1.0 top-1.0 w-[52px] h-[52px] bg-[#f4d03f] rounded-full flex items-center justify-center">
                  <img src="/ic_round-email.png" alt="Email Icon" className="w-8 h-8 text-white" />
                </div>
                <input 
                  type="text" 
                  placeholder="Pertanyaan" 
                  className="w-full pl-[70px] pr-6 py-[14px] rounded-full bg-white border-none focus:ring-4 focus:ring-[#f4d03f]/50 focus:outline-none text-black font-semibold shadow-inner text-base"
                />
              </div>
              <button className="w-full md:w-auto px-12 py-[14px] bg-[#f4d03f] text-white font-black rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap text-base shadow-lg">
                Kirim
              </button>
            </div>
            <p className="text-[11px] md:text-xs text-white/80 font-medium">
              Setiap pertanyaan anda akan menjadi peran agar kami melakukan improvisasi
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <footer className="text-center pt-8 pb-4 z-0 relative flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-6">
            {/* Placeholder D Footer */}
            <div className="w-16 h-16 flex items-center justify-center">
                <img src="/Group 2 1.png" alt="Icon" className="w-15 h-15 object-contain1 object-contain" />
            </div>
            <span className="text-base font-extrabold text-white tracking-[0.1em] mt-4">DE CAFENTA</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-[#6b1d1d] font-bold text-sm mb-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <p className="text-sm md:text-base">Durian Jangak, Kec. Pancur Batu, Kabupaten Deli Serdang, Sumatera Utara</p>
          </div>
          <p className="text-[#6b1d1d] font-black text-sm md:text-base">Buka 10:00 - 22:00 WIB</p>
        </footer>
      </div>

    </div>
  );
}

// ================= Komponen Bantuan (Reusable) ================= //

function PromoCard({ title, oldPrice, newPrice, imgSrc }: { title: string, oldPrice: string, newPrice: string, imgSrc: string }) {
  return (
    <div className="bg-white rounded-[32px] p-5 shadow-lg w-full max-w-[250px] mx-auto">
      
      {/* Image */}
      <div className="rounded-[20px] h-[200px] w-full overflow-hidden">
        <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="text-center mt-4">
        <h3 className="font-bold text-lg">{title}</h3>

        <p className="text-gray-400 line-through text-sm mt-1">
          {oldPrice}
        </p>

        <p className="text-red-700 font-bold text-xl mt-1">
          {newPrice}
        </p>
      </div>
    </div>
  );
}

function ServiceCard({ title, desc, iconSrc }: { title: string, desc: string, iconSrc: string }) {
  return (
    <div className="bg-[#fef9f9] border border-[#f4d4ce] rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
      {/* Icon Image */}
      <div className="w-25 h-25 rounded-[1.25rem] mb-6 flex items-center justify-center  p-1">
        <img src={iconSrc} alt={`${title} Icon`} className="w-full h-full object-contain" />
      </div>
      <h3 className="font-black text-[#a52016] text-lg mb-3">{title}</h3>
      <p className="text-sm font-semibold text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
