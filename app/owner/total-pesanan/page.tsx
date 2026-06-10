import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, Banknote, Wallet } from 'lucide-react';
import { getOwnerMonthlyReport } from '@/src/controllers/owner-controller';
import DateCarouselClient from '../components/DateCarouselClient';
import YearDropdownClient from '../components/YearDropdownClient';
import ExportPdfButtonClient from '../components/ExportPdfButtonClient';

interface Props { searchParams?: Promise<{ month?: string; day?: string; year?: string }> }

export default async function DetailPesanan(props: Props) {
  const searchParams = await props.searchParams;
  const monthParam = searchParams?.month ? Number(searchParams.month) : undefined;
  const yearParam = searchParams?.year ? Number(searchParams.year) : undefined;
  const dayParam = searchParams?.day ? Number(searchParams.day) : undefined;
  const report = await getOwnerMonthlyReport({ month: monthParam, year: yearParam, day: dayParam });

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = report.daysInMonth ?? 31;
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const selectedMonth = months[(report.month ?? 1) - 1];
  const selectedDay = searchParams?.day ? Number(searchParams.day) : undefined;
  const activeYear = yearParam ?? report.year;

  const maxCount = Math.max(...(report.weeklyRevenue.map((w) => w.count)), 1);
  const chartData = report.weeklyRevenue.map((w) => ({ label: w.label, value: `${w.count} Pesanan`, height: `${Math.max(12, Math.round((w.count / maxCount) * 100))}%` }));
  const selectedDate = 1;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-gray-900 pb-24 md:pb-8">
      
      {/* Header Section */}
      <div className="flex items-start mb-8">
        <Link href="/owner/beranda" className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-1 inline-flex items-center">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Total Pesanan</h1>
          <p className="text-sm text-[#8B1A1A] font-bold mt-1">Lihat Laporan Pesanan Secara Detail</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex items-center justify-end w-full gap-4">
        <ExportPdfButtonClient report={report} type="pesanan" />
        <YearDropdownClient currentYear={report.year} month={report.month ?? 1} />
      </div>

      {/* Bulan Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        {months.map((month, idx) => (
          <Link
            key={month}
            href={`/owner/total-pesanan?month=${idx + 1}&year=${activeYear}`}
            className={`py-3 px-4 rounded-md border text-sm font-bold transition-all ${
              selectedMonth === month
                ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                : 'bg-white text-black border-[#8B1A1A] hover:bg-red-50'
            }`}
          >
            {month}
          </Link>
        ))}
      </div>



      {/* Ringkasan Bulan */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-black mb-6 text-left">Bulan {selectedMonth}</h2>
        <p className="text-sm font-bold text-black mb-2">Total Pesanan</p>
        <p className="text-4xl md:text-5xl font-extrabold text-[#8B1A1A] mb-8">{report.ordersCount} Pesanan</p>
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
        
        {/* Date Selector Slider (client) */}
        <div className="mb-6">
          <DateCarouselClient basePath="/owner/total-pesanan" month={report.month ?? 1} year={report.year} daysInMonth={daysInMonth} initialDay={selectedDay} />
        </div>

        {/* Breakdown List */}
        <div className="space-y-6 px-2">
          {/* Cash */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Banknote size={20} className="text-black" />
              <span className="text-xs font-bold text-black">Total Pesanan Cash</span>
            </div>
            <span className="text-sm font-extrabold text-[#8B1A1A]">{report.dailyBreakdown?.paymentCounts?.cash ?? report.paymentCounts?.cash ?? 0} Pesanan</span>
          </div>

          {/* E-Wallet / Transfer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Wallet size={20} className="text-black" />
              <span className="text-xs font-bold text-black">Total Pesanan E-Wallet/Transfer</span>
            </div>
            <span className="text-sm font-extrabold text-[#8B1A1A]">{report.dailyBreakdown?.paymentCounts?.ewallet ?? report.paymentCounts?.ewallet ?? 0} Pesanan</span>
          </div>
        </div>
      </div>

    </div>
  );
}