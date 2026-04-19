import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Banknote, Wallet } from 'lucide-react';

export default function DetailPesanan() {
  const [selectedMonth, setSelectedMonth] = useState('Januari');
  const [selectedDate, setSelectedDate] = useState(1);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dummy data disesuaikan dengan mockup
  const chartData = [
    { label: 'Tanggal 1 - 7', value: '705 Pesanan', height: '100%' },
    { label: 'Tanggal 8 - 14', value: '705 Pesanan', height: '100%' },
    { label: 'Tanggal 15 - 21', value: '705 Pesanan', height: '100%' },
    { label: 'Tanggal 22 - Akhir Bulan', value: '705 Pesanan', height: '100%' },
  ];

  // Menggunakan urutan angka yang logis untuk slider tanggal
  const dates = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex items-start mb-8">
        <button className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-1">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Total Pesanan</h1>
          <p className="text-sm text-[#8B1A1A] font-bold mt-1">Lihat Laporan Pesanan Secara Detail</p>
        </div>
      </div>

      {/* Filter Tahun */}
      <div className="mb-6">
        <button className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600">
          <span>Filter Tahun : <span className="font-bold text-black">2026</span></span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Bulan Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`py-3 px-4 rounded-md border text-sm font-bold transition-all ${
              selectedMonth === month
                ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                : 'bg-white text-black border-[#8B1A1A] hover:bg-red-50'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Ringkasan Bulan */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-black mb-6 text-left">Bulan {selectedMonth}</h2>
        <p className="text-sm font-bold text-black mb-2">Total Pesanan</p>
        <p className="text-4xl md:text-5xl font-extrabold text-[#8B1A1A] mb-8">2820 Pesanan</p>
        <hr className="border-t border-gray-400" />
      </div>

      {/* Grafik Pesanan */}
      <div className="mb-16">
        <h3 className="text-sm font-extrabold text-black mb-8">Grafik Pesanan</h3>
        
        <div className="relative pt-8">
          {/* Chart Container */}
          <div className="flex justify-between items-end h-64 border-b-2 border-black pb-0 gap-2 md:gap-4 px-2 md:px-8">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-full relative h-full justify-end">
                {/* Bar */}
                <div 
                  className="w-full bg-[#FFC700] relative group transition-all"
                  style={{ height: data.height }}
                >
                  {/* Value Text inside bar (top aligned) */}
                  <span className="absolute top-4 left-0 w-full text-center text-[10px] md:text-xs font-medium text-black px-1">
                    {data.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* X-Axis Labels */}
          <div className="flex justify-between mt-3 px-2 md:px-8">
            {chartData.map((data, index) => (
              <div key={index} className="text-center w-full">
                <p className="text-[10px] text-gray-600">Tanggal</p>
                <p className="text-xs font-bold text-black leading-tight mt-1">{data.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rincian Pesanan */}
      <div>
        <h3 className="text-sm font-extrabold text-black mb-4">Rincian Pesanan</h3>
        
        {/* Date Selector Slider */}
        <div className="flex overflow-x-auto space-x-3 pb-4 mb-6 scrollbar-hide">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-md border-2 transition-all ${
                selectedDate === date
                  ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white'
                  : 'bg-white border-[#8B1A1A] text-black hover:bg-red-50'
              }`}
            >
              <span className={`text-[10px] mb-1 ${selectedDate === date ? 'text-gray-200' : 'text-gray-600'}`}>
                Tanggal
              </span>
              <span className="text-2xl font-extrabold">{date}</span>
            </button>
          ))}
        </div>

        {/* Breakdown List */}
        <div className="space-y-6 px-2">
          {/* Cash */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Banknote size={20} className="text-black" />
              <span className="text-xs font-bold text-black">Total Pesanan Cash</span>
            </div>
            <span className="text-sm font-extrabold text-[#8B1A1A]">30 Pesanan</span>
          </div>

          {/* E-Wallet / Transfer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Wallet size={20} className="text-black" />
              <span className="text-xs font-bold text-black">Total Pesanan E-Wallet/Transfer</span>
            </div>
            <span className="text-sm font-extrabold text-[#8B1A1A]">50 Pesanan</span>
          </div>
        </div>
      </div>

    </div>
  );
}