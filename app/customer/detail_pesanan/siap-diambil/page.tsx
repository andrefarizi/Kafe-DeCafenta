import React from 'react';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';
import {
    ChevronLeft,
    RotateCcw,
    ClipboardList,
    CookingPot,
    Package,
    Check,
    Copy
} from 'lucide-react';


const DetailPesanan = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
            <Sidebar activeMenu="pesanan" />
            <main className="flex-1 flex flex-col h-screen overflow-hidden text-left">
                <div className="flex-none">
                    <Topbar />
                </div>

                <div className="p-5 w-full overflow-y-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4 w-full">
                        <div className="flex items-center gap-3">
                            <button className="p-1 border rounded-md bg-white hover:bg-gray-50">
                                <ChevronLeft size={16} />
                            </button>
                            <div className="text-left">
                                <h1 className="text-xl font-bold text-black leading-tight">Detail Pesanan</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-semibold text-[#8A0000] text-xs">#DCF001</span>
                                    <span style={{ backgroundColor: '#0A7CC3' }} className="text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Siap Diambil</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8A0000] font-bold text-[10px] mt-6 font-sans">8 April 2026, 10.30</p>
                    </div>

                    {/* Status Tracker Card */}
                    <div className="bg-white rounded-lg border border-1 border-[#8A0000] p-6 mb-6 relative shadow-sm w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#8A0000] font-bold text-[12px]">Status Pesanan</h2>
                            <button className="flex items-center gap-1 bg-[#8A0000] text-white text-[9px] px-2 py-1 rounded-md">
                                <RotateCcw size={10} /> Refresh Status
                            </button>
                        </div>

                        <div className="relative flex justify-between px-0 mb-8 z-0">
                            {/* Garis Penghubung Utama*/}
                            <div
                                className="absolute top-[34px] -translate-y-1/2 h-2.5 bg-gray-300 z-[-1]"
                                style={{ left: '34px', right: '34px' }}></div>

                            <div
                                className="absolute top-[34px] -translate-y-1/2 h-2.5 z-[-1]"
                                style={{
                                    left: '34px',
                                    width: 'calc((100% - 68px) * 0.66)',
                                    background: 'linear-gradient(to right, #FFC700 0%, #8B1A1A 33%, #2563EB 66%)'
                                }}
                            ></div>

                            {/* Step 1: Masuk */}
                            <div className="flex flex-col items-center w-fit">
                                <div className="w-[68px] h-[68px] rounded-full border-[4px] border-[#FFC700] bg-white p-[3px] flex items-center justify-center z-10">
                                    <div className="w-full h-full rounded-full bg-[#FFC700] flex items-center justify-center">
                                        <ClipboardList size={26} className="text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <span className="text-sm md:text-base font-extrabold text-black mt-3">Masuk</span>
                            </div>

                            {/* Step 2: Dimasak */}
                            <div className="flex flex-col items-center w-fit">
                                <div className="w-[68px] h-[68px] rounded-full border-[4px] border-[#8B1A1A] bg-white p-[3px] flex items-center justify-center z-10">
                                    <div className="w-full h-full rounded-full bg-[#8B1A1A] flex items-center justify-center">
                                        <CookingPot size={26} className="text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <span className="text-sm md:text-base font-extrabold text-black mt-3">Dimasak</span>
                            </div>

                            {/* Step 3: Siap Diambil */}
                            <div className="flex flex-col items-center w-fit">
                                <div className="w-[68px] h-[68px] rounded-full border-[4px] border-[#2563EB] bg-white p-[3px] flex items-center justify-center z-10">
                                    <div className="w-full h-full rounded-full bg-[#2563EB] flex items-center justify-center">
                                        <Package size={26} className="text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <span className="text-sm md:text-base font-extrabold text-black mt-3 text-center whitespace-nowrap">Siap Diambil</span>
                            </div>

                            {/* Step 4: Selesai */}
                            <div className="flex flex-col items-center w-fit">
                                <div className="w-[68px] h-[68px] rounded-full border-[4px] border-gray-300 bg-white p-[3px] flex items-center justify-center z-10">
                                    <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                        <Check size={36} className="text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <span className="text-sm md:text-base font-extrabold text-black mt-3">Selesai</span>
                            </div>
                        </div>
                    </div>

                    {/* Pembayaran Section */}
                    <section className="mb-6 flex flex-col gap-5 w-full text-left">
                        <div className="space-y-4 text-left">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-black">Metode Pembayaran</h3>
                                <p className="text-xs text-gray-700 font-medium">Gopay</p>
                            </div>

                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-black">Tipe Pesanan</h3>
                                <p className="text-xs text-gray-700 font-medium">Makan Ditempat</p>
                            </div>
                        </div>

                        <div className="text-left">
                            <h3 className="text-sm font-bold text-black mb-2">Status Pembayaran</h3>
                            <span className="inline-block w-34 bg-[#22C55E] text-white text-[10px] pl-3 py-1 rounded-full text-left">
                                Sudah Dibayar
                            </span>
                        </div>
                    </section>

                    {/* Table Produk */}
                    <div className="overflow-x-auto mb-6 w-full text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="text-black border-b border-gray-200">
                                    <th className="pb-2 font-bold text-[11px] text-left">Produk</th>
                                    <th className="pb-2 font-bold text-[11px] text-center">Kategori</th>
                                    <th className="pb-2 font-bold text-[11px] text-center">Jumlah</th>
                                    <th className="pb-2 font-bold text-[11px] text-right">Harga</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <TableRow name="Nasi Goreng" category="Nasi" qty={1} price="Rp 20.000" note="Jangan pedas" img="/Rectangle 43.png" />
                                <TableRow name="Nasi Goreng" category="Mie" qty={1} price="Rp 20.000" note="Jangan pedas" img="/Rectangle 43.png" />
                                <TableRow name="Americano" category="Minuman" qty={1} price="Rp 20.000" note="Es nya dikit aja" img="/Rectangle 43 (1).png" />
                            </tbody>
                        </table>

                        <div className="border-t-1 border-black mt-4 pt-2 flex justify-end">
                            <h2 className="text-l font-bold text-[#8A0000]">Total 3 Menu : Rp 60.000</h2>
                        </div>

                        <div className="mt-6 flex flex-col items-end gap-2">
                            <span className="text-[12px] font-bold text-black">Cek Invoice</span>
                            <button className="flex items-center gap-4 bg-[#8A0000] text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-all shadow-md">
                                <ClipboardList size={18} />
                                <span className="text-[12px] font-bold">Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const TableRow = ({ name, category, qty, price, note, img }: any) => (
    <tr className="border-b border-gray-50">
        <td className="py-3">
            <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                    <img src={img} className="w-full h-full object-cover" alt={name} />
                </div>
                <div>
                    <p className="font-bold text-black text-[11px] leading-tight">{name}</p>
                    <p className="text-[9px] text-gray-500 italic">Catatan : {note}</p>
                </div>
            </div>
        </td>
        <td className="py-3 text-center font-bold text-black text-[11px]">{category}</td>
        <td className="py-3 text-center font-bold text-black text-[11px]">{qty}</td>
        <td className="py-3 text-right font-bold text-black text-[11px]">{price}</td>
    </tr>

);


export default DetailPesanan;