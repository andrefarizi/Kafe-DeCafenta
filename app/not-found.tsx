import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] font-sans">
      <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-8xl font-black text-[#8B1A1A]">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 font-medium">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <Link 
          href="/" 
          className="inline-block bg-[#8B1A1A] hover:bg-red-900 text-white font-bold py-3 px-8 rounded-xl transition-colors mt-4"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
