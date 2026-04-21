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
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=150&q=80' // Placeholder Nasi Goreng
  },
  {
    id: 2,
    name: 'Nasi Goreng',
    note: 'Catatan : Jangan pedas',
    category: 'Mie', // Mengikuti persis seperti di gambar mockup
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
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80' // Placeholder Kopi
  }
];

export default function DetailPesanan() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button aria-label="Kembali" title="Kembali" className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Detail Pesanan</h1>
      </div>

      {/* Customer Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 flex items-center mb-6">
        {/* Custom Avatar Icon (Replicating the red smiley) */}
        <div className="w-14 h-14 bg-[#8B1A1A] rounded-full flex items-center justify-center relative overflow-hidden mr-4 shadow-sm">
           <div className="w-10 h-10 bg-white rounded-full absolute -bottom-2 flex justify-center">
              {/* Eyes */}
              <div className="absolute top-2 w-full flex justify-center space-x-3">
                <div className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full"></div>
              </div>
              {/* Mouth */}
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
          <span className="bg-[#FFC700] text-black font-extrabold text-sm px-4 py-1 rounded-sm shadow-sm">
            Masuk
          </span>
        </div>
      </div>

      {/* Status Timeline Card */}
      <div className="border border-[#8B1A1A] rounded-2xl p-6 mb-8 relative">
        <h3 className="text-sm font-extrabold text-[#8B1A1A] mb-8">Status Pesanan</h3>
        
        {/* Tracker */}
        <div className="relative flex justify-between px-2 md:px-8 mb-8 z-0">
          {/* Connecting Line (Background) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[34px] -translate-y-1/2 h-2.5 bg-gray-300 z-[-1]"></div>
          
          {/* Step 1: Masuk (Active) */}
        <div className="flex flex-col items-center w-1/4">
          <div className="w-[68px] h-[68px] rounded-full border-[4px] border-[#FFC700] bg-white p-[3px] flex items-center justify-center z-10">
            <div className="w-full h-full rounded-full bg-[#FFC700] flex items-center justify-center">
              <ClipboardList size={26} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-sm md:text-base font-extrabold text-black mt-3">Masuk</span>
        </div>

          {/* Step 2: Dimasak (Inactive) */}
        <div className="flex flex-col items-center w-1/4">
          <div className="w-[68px] h-[68px] rounded-full border-[4px] border-gray-300 bg-white p-[3px] flex items-center justify-center z-10">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <CookingPot size={26} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-sm md:text-base font-extrabold text-black mt-3">Dimasak</span>
        </div>

          {/* Step 3: Siap Diambil (Inactive) */}
        <div className="flex flex-col items-center w-1/4">
          <div className="w-[68px] h-[68px] rounded-full border-[4px] border-gray-300 bg-white p-[3px] flex items-center justify-center z-10">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <Package size={26} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-sm md:text-base font-extrabold text-black mt-3 text-center whitespace-nowrap">Siap Diambil</span>
        </div>

          {/* Step 4: Selesai */}
          <div className="flex flex-col items-center w-1/4">
          {/* Status Selesai tidak memakai efek double ring di gambar, hanya solid gray dengan border putih tebal */}
          <div className="w-[68px] h-[68px] rounded-full bg-gray-300 border-[6px] border-white flex items-center justify-center z-10">
            <Check size={36} className="text-white stroke-[4]" />
          </div>
          <span className="text-sm md:text-base font-extrabold text-black mt-3">Selesai</span>
        </div>
        </div>


        {/* Change Status Button */}
        <div className="flex justify-end mt-4">
          <button className="bg-[#8B1A1A] hover:bg-red-900 text-white text-[10px] font-bold py-2.5 px-6 rounded-md transition-colors">
            Ubah Status - <span className="font-extrabold">Dimasak</span>
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