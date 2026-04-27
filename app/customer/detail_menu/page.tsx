'use client';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Star,
  Plus,
  Minus,
  X,
  FileText,
  CheckCircle2
} from 'lucide-react';

const ProductDetailPage = () => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState(""); // State untuk teks ulasan
  
  // State untuk Modal dan Toast
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showReviewToast, setShowReviewToast] = useState(false); 
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 20000;

  // Fungsi saat berhasil menambah pesanan
  const handleAddToCart = () => {
    setIsModalOpen(false);
    setIsSuccessOpen(true);
  };

  // Fungsi saat berhasil mengirim ulasan
  const handleSendReview = () => {
    if (selectedRating === 0) return; // Validasi minimal pilih rating

    setShowReviewToast(true);
    
    // 1. Reset input setelah kirim
    setSelectedRating(0);
    setReviewText(""); 
    
    // 3. Hilang otomatis setelah 3 detik
    setTimeout(() => setShowReviewToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <Sidebar activeMenu="menu" />

      <main className="flex-1 flex flex-col min-h-screen relative">
        
        <div className="sticky top-0 z-[40] w-full bg-[#F8F9FA]">
          <Topbar />
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button className={`p-1.5 bg-white rounded-md border border-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all`}>
                    <ChevronLeft size={20} strokeWidth={3} className="text-[#8B0000]" />
                </button>
                <h1 className="text-xl font-extrabold text-black tracking-tight">Menu De Cafenta</h1>
            </div>

            {/* KARTU PRODUK UTAMA */}
            <div className="bg-white rounded-[25px] p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-[220px] h-[210px] rounded-[20px] overflow-hidden shrink-0 shadow-sm">
                <img 
                  src="https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" 
                  alt="French Fries" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1 leading-tight break-all">Kentang Goreng</h2>
                  <p className="text-2xl font-bold text-[#8B0000] mb-5">Rp 20.000</p>
                  <div className="w-full h-[1.2px] bg-gray-600 mb-2"></div>
                  <p className="text-xs text-black leading-relaxed text-justify line-clamp-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setQuantity(1);
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-[#8B0000] text-white py-2.5 rounded-xl text-md font-bold hover:bg-[#6A0000] transition-all active:scale-[0.98] mt-4 shadow-md"
                >
                  Tambah Pesanan
                </button>
              </div>
            </div>

            {/* RINGKASAN ULASAN */}
            <div className="p-6 -mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black tracking-tight">
                  Ringkasan Ulasan (3rb ulasan)
                </h3>
                <button className="text-[#8B0000] font-bold hover:text-red-700 text-sm transition-colors shrink-0">
                  Lihat Semua
                </button>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-[#8B0000] rounded-3xl p-5 px-4 text-center border-2 border-[#FFF0F0] shrink-0">
                  <p className="bg-white rounded-xl p-2 px-4 text-[#8B0000] font-bold text-[15px] uppercase tracking-widest mb-4 -mt-3">
                    Rating
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    <Star size={18} fill="#FACD11" className="text-[#FACD11]" />
                    <span className="text-2xl font-black text-white leading-none">5.0</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 overflow-hidden">
                  <MiniReview 
                    name="Flins" 
                    date="31 Februari 2026" 
                    text="keren" 
                    rating="5.0" 
                    img="https://i.pinimg.com/736x/f5/2c/90/f52c90a4a29c43006c86b3b26ac12174.jpg" 
                  />
                  <MiniReview 
                    name="Andre wira pratama" 
                    date="31 Februari 2026" 
                    text="luar biasa yes yes yes" 
                    rating="5.0" 
                    img="https://i.pinimg.com/736x/54/c2/bc/54c2bcc1bcde783510c439b8aebf8b38.jpg" 
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN INPUT RATING */}
            <div className="bg-white rounded-[25px] p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 -mt-7">
              <h3 className="text-md font-bold text-black mb-2">Beri Rating tentang Produk ini</h3>
              <div className="w-full h-[1.2px] bg-gray-600 mb-4"></div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-gray-50 shadow-sm">
                  <img src="https://i.pinimg.com/736x/54/c2/bc/54c2bcc1bcde783510c439b8aebf8b38.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={22} 
                        className={`cursor-pointer transition-all duration-200 ${star <= (hoverRating || selectedRating) ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-200 fill-transparent'}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setSelectedRating(star)}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Berikan ulasan Anda..." 
                      className="w-full bg-[#F9FAFB] text-black placeholder:text-black rounded-xl p-4 text-xs focus:outline-none border border-gray-300 focus:border-gray-400 min-h-[80px] shadow-inner transition-all" 
                    />
                    <button 
                      onClick={handleSendReview}
                      className="bg-[#8B0000] text-white px-8 py-2 rounded-xl text-xs font-bold hover:bg-[#6A0000] transition-all active:scale-[0.95] shadow-md"
                    >
                      Kirim Ulasan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOAST NOTIFIKASI */}
        {showReviewToast && (
          <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden p-4 flex items-center gap-3 min-w-[280px] border border-gray-100">
              <div className="bg-green-100 p-1.5 rounded-full">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-800 leading-none mb-1">Berhasil!</p>
                <p className="text-[11px] text-gray-500 leading-none">Ulasan Anda telah terkirim.</p>
              </div>
              <button onClick={() => setShowReviewToast(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-progress-shrink w-full origin-left"></div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes progress-shrink {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }
          .animate-progress-shrink {
            animation: progress-shrink 3s linear forwards;
          }
        `}</style>

        {/* MODAL POPUP RINCIAN PEMBELIAN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-[#F8F9FA] w-full max-w-[450px] rounded-[30px] shadow-2xl border-2 border-[#8B0000] p-6 animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-2 -right-2 bg-[#8B0000] text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-colors z-10"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">Kentang Goreng</h2>
                <span className="text-xl font-bold text-[#8B0000]">Rp 20.000</span>
              </div>

              <div className="flex gap-4 mb-5">
                <div className="w-[110px] h-[100px] rounded-[15px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img src="https://i.pinimg.com/1200x/6e/b7/cd/6eb7cdd8e7877757354f1898211e946e.jpg" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                   <div className="flex items-center gap-1.5 mb-1">
                      <FileText size={14} className="text-black" />
                      <span className="font-bold text-black text-xs">Catatan (opsional)</span>
                   </div>
                   <textarea 
                    placeholder="Contoh: jangan pedas, ya"
                    className="w-full flex-1 bg-gray-300 rounded-xl p-3 text-black placeholder:text-gray-600 text-[11px] focus:outline-none border border-transparent min-h-[75px] resize-none shadow-inner"
                   />
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-400 mb-4"></div>

              <div className="flex justify-between items-center mb-5 px-1">
                <span className="text-sm font-bold text-black">Jumlah Pembelian</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(quantity + 1)} className="w-5 h-5 flex items-center justify-center bg-[#8B0000] text-white rounded shadow-sm active:scale-90">
                    <Plus size={12} strokeWidth={4} />
                  </button>
                  <span className="text-md font-black text-black w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-5 h-5 flex items-center justify-center border-2 border-[#8B0000] text-[#8B0000] rounded shadow-sm active:scale-90">
                    <Minus size={12} strokeWidth={4} />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#8B0000] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#6A0000] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.97]"
              >
                Tambah Pembelian - Rp {(pricePerItem * quantity).toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        )}

        {/* MODAL SUKSES DITAMBAHKAN */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsSuccessOpen(false)}></div>
            <div className="relative bg-white w-full max-w-[380px] rounded-[30px] shadow-2xl border-2 border-[#8B0000] p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="mb-4">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 35C25 32.2386 27.2386 30 30 30H70C72.7614 30 75 32.2386 75 35V75C75 80.5228 70.5228 85 65 85H35C29.4772 85 25 80.5228 25 75V35Z" fill="#E55050"/>
                  <path d="M25 35C25 32.2386 27.2386 30 30 30H70C72.7614 30 75 32.2386 75 35L70 42H30L25 35Z" fill="#C43D3D"/>
                  <circle cx="42" cy="55" r="4" fill="white"/>
                  <path d="M42 63V75" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M58 52V75" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M54 52H62" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M45 20C45 17.2386 47.2386 15 50 15C52.7614 15 55 17.2386 55 20V30H45V20Z" fill="#F3D0D0"/>
                  <path d="M40 30C40 25 45 22 50 22C55 22 60 25 60 30" stroke="#F3D0D0" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-black mb-2">Menu Sukses ditambahkan!</h2>
              <p className="text-xs font-medium text-black leading-relaxed mb-6 px-4">
                Selamat menu kamu telah berhasil ditambahkan silahkan periksa keranjang anda sekarang
              </p>
              <div className="w-full space-y-2.5">
                <button onClick={() => setIsSuccessOpen(false)} className="w-full bg-[#8B0000] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#6A0000] transition-all shadow-md active:scale-[0.98]">Periksa Keranjang</button>
                <button onClick={() => setIsSuccessOpen(false)} className="w-full bg-white text-[#8B0000] border-2 border-[#8B0000] py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-[0.98]">Lanjut Memesan</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MiniReview = ({ name, date, text, rating, img }: any) => (
  <div className="flex gap-3 items-start w-[280px] shrink-0">
    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-50 shadow-sm">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
          <h4 className="font-bold text-black text-xs truncate mr-2">{name}</h4>
          <div className="bg-[#8B0000] text-white px-1.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
            <Star size={8} fill="#FACD11" className="text-[#FACD11]" />
            <span className="text-[10px] font-black">{rating}</span>
          </div>
      </div>
      <p className="text-[9px] text-black font-medium mb-1 uppercase">{date}</p>
      <p className="text-[11px] text-black leading-tight font-semibold line-clamp-1">{text}</p>
    </div>
  </div>
);

export default ProductDetailPage;