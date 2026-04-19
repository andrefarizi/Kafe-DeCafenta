import React from 'react';
import { 
  ChevronLeft, 
  ClipboardList, 
  CookingPot, 
  Package, 
  Check,
  FileText
} from 'lucide-react';

// --- Types ---
interface ProductOrder {
  id: number;
  name: string;
  note: string;
  category: string;
  qty: number;
  price: string;
  image: string;
}

// --- Dummy Data ---
const products: ProductOrder[] = [
  {
    id: 1,
    name: 'Nasi Goreng',
    note: 'Catatan : Jangan pedas',
    category: 'Nasi',
    qty: 1,
    price: 'Rp 20.000',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Nasi Goreng',
    note: 'Catatan : Jangan pedas',
    category: 'Mie', 
    qty: 1,
    price: 'Rp 20.000',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Americano',
    note: 'Catatan : Es nya dikit aja',
    category: 'Minuman',
    qty: 1,
    price: 'Rp 20.000',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80'
  }
];

export default function DetailPesananSiapDiambil() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Detail Pesanan</h1>
      </div>

      {/* Customer Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 flex items-center mb-6">
        {/* Custom Avatar Icon */}
        <div className="w-14 h-14 bg-[#8B1A1A] rounded-full flex items-center justify-center relative overflow-hidden mr-4 shadow-sm">
           <div className="w-10 h-10 bg-white rounded-full absolute -bottom-2 flex justify-center">
              <div className="absolute top-2 w-full flex justify-center space-x-3">
                <div className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full"></div>
              </div>
              <div className="absolute top-5 w-3 h-1.5 border-b-2 border-[#8B1A1A] rounded-b-full"></div>
           </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Nama Pelanggan</p>
          <p className="text-lg font-extrabold text-[#8B1A1A]">Andre Ganteng</p>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Kode Pesanan</p>
          <p className="text-lg font-extrabold text-[#8B1A1A]">#DCF001</p>
          <p className="text-xs font-bold text-[#8B1A1A] mt-1">8 April 2026, 10.30</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[10px] text-gray-500 font-medium mb-1">Status</p>
          {/* Badge Status Siap Diambil */}
          <span className="bg-[#2563EB] text-white font-extrabold text-sm px-4 py-1 rounded-sm shadow-sm">
            Siap Diambil
          </span>
        </div>
      </div>

      {/* Status Timeline Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 mb-8 relative">
        <h3 className="text-sm font-extrabold text-[#8B1A1A] mb-8">Status Pesanan</h3>
        
        {/* Tracker */}
        <div className="relative flex justify-between items-center px-4 md:px-12 mb-8 z-0">
          
          {/* Background Connecting Lines Wrapper */}
          <div className="absolute left-10 right-10 md:left-16 md:right-16 top-1/2 -translate-y-1/2 h-2 flex -z-10">
            {/* Masuk -> Dimasak (Yellow to Red) */}
            <div className="h-full w-1/3 bg-gradient-to-r from-[#FFC700] to-[#8B1A1A]"></div>
            {/* Dimasak -> Siap Diambil (Red to Blue) */}
            <div className="h-full w-1/3 bg-gradient-to-r from-[#8B1A1A] to-[#2563EB]"></div>
            {/* Siap Diambil -> Selesai (Gray) */}
            <div className="h-full w-1/3 bg-gray-300"></div>
          </div>
          
          {/* Step 1: Masuk */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-14 h-14 rounded-full border-4 border-[#FFC700] bg-white flex items-center justify-center mb-2 z-10">
              <ClipboardList size={24} className="text-[#FFC700]" />
            </div>
            <span className="text-xs font-extrabold text-black">Masuk</span>
          </div>

          {/* Step 2: Dimasak */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-14 h-14 rounded-full border-4 border-[#8B1A1A] bg-white flex items-center justify-center mb-2 z-10">
              <CookingPot size={24} className="text-[#8B1A1A]" />
            </div>
            <span className="text-xs font-bold text-black">Dimasak</span>
          </div>

          {/* Step 3: Siap Diambil (Active State) */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-14 h-14 rounded-full border-4 border-[#2563EB] bg-white flex items-center justify-center mb-2 z-10">
              <Package size={24} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-bold text-black">Siap Diambil</span>
          </div>

          {/* Step 4: Selesai */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-2 z-10 border-4 border-white shadow-sm">
              <Check size={32} className="text-white stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-black">Selesai</span>
          </div>
        </div>

        {/* Change Status Button */}
        <div className="flex justify-end mt-4">
          <button className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2.5 px-6 rounded-md transition-colors">
            Ubah Status - <span className="font-extrabold">Selesai</span>
          </button>
        </div>
      </div>

      {/* General Information */}
      <div className="mb-10 space-y-5">
        <div>
          <h4 className="text-sm font-extrabold text-black mb-0.5">Metode Pembayaran</h4>
          <p className="text-xs font-medium text-black">Gopay</p>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-black mb-0.5">Tipe Pesanan</h4>
          <p className="text-xs font-medium text-black">Makan Ditempat</p>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-black mb-1">Status Pembayaran</h4>
          <span className="inline-block bg-[#22C55E] text-white text-[10px] font-bold px-4 py-1 rounded-full">
            Sudah Dibayar
          </span>
        </div>
      </div>

      {/* Product List Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-4 font-extrabold text-black text-sm w-2/5">Produk</th>
              <th className="pb-4 font-extrabold text-black text-sm text-center w-1/5">Kategori</th>
              <th className="pb-4 font-extrabold text-black text-sm text-center w-1/5">Jumlah</th>
              <th className="pb-4 font-extrabold text-black text-sm text-right w-1/5">Harga</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td className="py-4 flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100"
                  />
                  <div>
                    <p className="font-extrabold text-black text-sm">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium italic mt-0.5">{item.note}</p>
                  </div>
                </td>
                <td className="py-4 text-center font-extrabold text-black text-sm">
                  {item.category}
                </td>
                <td className="py-4 text-center font-medium text-black text-sm">
                  {item.qty}
                </td>
                <td className="py-4 text-right font-medium text-black text-sm">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div className="border-t border-gray-400 pt-4 mb-8 flex justify-end">
        <p className="text-xl font-extrabold text-[#8B1A1A]">Total 3 Menu : Rp 60.000</p>
      </div>

      {/* Invoice Section */}
      <div className="flex flex-col items-end mb-8">
        <p className="text-sm font-extrabold text-black mb-2">Cek Invoice</p>
        <button className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-6 py-2 rounded-md transition-colors shadow-sm">
          <FileText size={16} />
          <span className="text-xs font-bold">Invoice</span>
        </button>
      </div>

      {/* Cancel Button */}
      <button className="w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-4 rounded-md transition-colors shadow-sm">
        Batalkan Pesanan
      </button>

    </div>
  );
}