import React from 'react';

// --- ICONS (Menggunakan SVG Sederhana agar mirip desain) ---
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6a1713]">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LogoutIcon = () => (
  <img 
    src="/mingcute_power-fill.png" 
    alt="logout icon" 
    width={16} 
    height={16} 
    className="text-[#6a1713]"
  />
);

const UserAvatarIcon = () => (
  <img 
    src="/Vector (5).png" 
    alt="user avatar icon" 
    width={46} 
    height={46} 
    className="text-[#6a1713]"
  />
);

const BellIcon = () => (
  <img 
    src="/fluent_service-bell-16-filled.png" 
    alt="bell icon" 
    width={46} 
    height={46} 
    className="text-[#6a1713]"
  />
);

const ReceiptIcon = () => (
  <img 
    src="/material-symbols_order-approve-outline-rounded (1).png" 
    alt="receipt icon" 
    width={36} 
    height={36} 
    className="text-[#6a1713]"
  />
);


// --- MAIN COMPONENT ---
export default function DashboardKasir() {
  return (
    <div className="min-h-screen bg-white text-black font-sans pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 border border-[#6a1713] rounded-md shadow-sm">
            <HomeIcon />
          </div>
          <span className="font-semibold text-[#6a1713]">Dashboard Kasir</span>
        </div>

        {/* Profile Card */}
        <div className="border-2 border-[#6a1713] rounded-xl p-4 flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <UserAvatarIcon />
            <div>
              <h2 className="font-bold text-lg">Nama Kasir</h2>
              <p className="text-[#6a1713] text-sm font-medium">#Nomorkasir</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#FFC7C7] px-4 py-2 rounded-md border border-[#6a1713] text-[#6a1713] font-medium text-sm hover:bg-[#ebd5d4] transition">
            <LogoutIcon />
            Logout
          </button>
        </div>

        {/* Pesanan Ditempat Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">Pesanan ditempat</h1>
          <p className="text-[#6a1713] text-sm mb-4">Catat pesanan pelanggan anda secara langsung dengan mudah</p>
          
          <div className="border-2 border-[#6a1713] rounded-xl p-5">
            {/* Action Card */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <BellIcon />
                <h3 className="font-bold text-lg">Catat Sekarang</h3>
              </div>
              <button className="flex items-center gap-2 text-[#6a1713] text-sm">
                Selengkapnya 
                <span className="border border-[#6a1713] rounded-full w-5 h-5 flex items-center justify-center text-xs">&gt;</span>
              </button>
            </div>

            <hr className="border-t-2 border-black mb-4" />
            <h4 className="font-bold text-[#6a1713] mb-4">Pesanan Terakhir</h4>

            {/* Table Header */}
            <div className="bg-[#FFC7C7] rounded-md py-3 px-4 flex justify-between text-sm font-bold mb-4">
              <div className="w-1/3">Nama Pelanggan</div>
              <div className="w-1/3 text-center">Jumlah Pesanan</div>
              <div className="w-1/3 text-right">Harga</div>
            </div>

            {/* Table Row */}
            <div className="flex justify-between items-center py-3 px-4 border-b-2 border-gray-300">
              <div className="w-1/3 flex items-center gap-3">
                <ReceiptIcon />
                <div>
                  <p className="font-bold">Andre Ganteng</p>
                  <p className="text-[#6a1713] text-xs font-semibold">#DCF001</p>
                </div>
              </div>
              <div className="w-1/3 text-center text-sm font-medium">1 Menu</div>
              <div className="w-1/3 text-right text-sm font-medium">Rp 20.000</div>
            </div>
          </div>
        </div>

        {/* Daftar Pesanan Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">Daftar Pesanan</h1>
          <p className="text-[#6a1713] text-sm mb-4">Daftar-daftar pesanan terakhir yang masuk</p>

          <div className="border-2 border-[#6a1713] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#6a1713]">Status Pesanan</h3>
              <button className="flex items-center gap-2 text-[#6a1713] text-sm">
                Selengkapnya
                <span className="border border-[#6a1713] rounded-full w-5 h-5 flex items-center justify-center text-xs">&gt;</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
              <button className="bg-[#6a1713] text-white px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                 <img src="/Group 135.png" alt="Semua" className="w-5 h-5 object-contain invert brightness-0" /> Semua
              </button>
              <button className="border border-[#6a1713] text-[#6a1713] px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                 <img src="/Food Icon Illustrations Kit (1).png" alt="Masuk" className="w-5 h-5 object-contain" /> Masuk
              </button>
              <button className="border border-[#6a1713] text-[#6a1713] px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                 <img src="/Food Icon Illustrations Kit (2).png" alt="Dimasak" className="w-5 h-5 object-contain" /> Dimasak
              </button>
              <button className="border border-[#6a1713] text-[#6a1713] px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                 <img src="/Food Icon Illustrations Kit (3).png" alt="Siap Diambil" className="w-5 h-5 object-contain" /> Siap Diambil
              </button>
              <button className="border border-[#6a1713] text-[#6a1713] px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                 <img src="/Food Icon Illustrations Kit (4).png" alt="Selesai" className="w-5 h-5 object-contain" /> Selesai
              </button>
            </div>

            {/* Table Header */}
            <div className="bg-[#FFC7C7] rounded-md py-3 px-4 flex justify-between text-sm font-bold mb-4">
              <div className="w-1/3">Nama Pelanggan</div>
              <div className="w-1/3 text-center">Jumlah Pesanan</div>
              <div className="w-1/3 text-right">Harga</div>
            </div>

            {/* Table Rows */}
            <div className="flex justify-between items-center py-3 px-4 border-b-2 border-gray-300 mb-2">
              <div className="w-1/3 flex items-center gap-3">
                <ReceiptIcon />
                <div>
                  <p className="font-bold">Andre Ganteng</p>
                  <p className="text-[#6a1713] text-xs font-semibold">#DCF001</p>
                </div>
              </div>
              <div className="w-1/3 text-center text-sm font-medium">1 Menu</div>
              <div className="w-1/3 text-right text-sm font-medium">Rp 20.000</div>
            </div>

            <div className="flex justify-between items-center py-3 px-4 border-b-2 border-gray-300">
              <div className="w-1/3 flex items-center gap-3">
                <ReceiptIcon />
                <div>
                  <p className="font-bold">Andre Ganteng</p>
                  <p className="text-[#6a1713] text-xs font-semibold">#DCF001</p>
                </div>
              </div>
              <div className="w-1/3 text-center text-sm font-medium">1 Menu</div>
              <div className="w-1/3 text-right text-sm font-medium">Rp 20.000</div>
            </div>
          </div>
        </div>

        {/* Ketersediaan Meja Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Ketersediaan Meja</h1>
          
          <div className="bg-white border border-red-200 rounded-2xl p-6 relative">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              
              {/* Meja Cards */}
              {[
                { id: 1, code: '#MJ01', status: 'Tersedia' },
                { id: 2, code: '#MJ02', status: 'Dipakai' },
                { id: 3, code: '#MJ03', status: 'Tersedia' },
                { id: 4, code: '#MJ04', status: 'Tersedia' },
                { id: 5, code: '#MJ05', status: 'Dipakai' },
                { id: 6, code: '#MJ06', status: 'Tersedia' },
              ].map((meja) => (
                <div key={meja.id} className="bg-white border-2 border-[#8A0000] rounded-xl p-4 flex flex-col justify-between h-28">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">Meja {meja.id}</h3>
                    <span className="text-[#6a1713] text-xs font-bold">{meja.code}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 mb-1">Status</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${meja.status === 'Tersedia' ? 'bg-[#5cb85c]' : 'bg-[#c9302c]'}`}>
                      {meja.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 text-[#6a1713] text-sm">
                Selengkapnya
                <span className="border border-[#6a1713] rounded-full w-5 h-5 flex items-center justify-center text-xs">&gt;</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}