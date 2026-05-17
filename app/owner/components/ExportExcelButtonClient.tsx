"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import * as XLSX from 'xlsx';

interface Props {
  report: any;
  type: 'pendapatan' | 'pesanan';
}

export default function ExportExcelButtonClient({ report, type }: Props) {
  const handleExport = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[report.month - 1] || report.month;

    // Menyusun data dalam satu sheet
    const aoa = [
      [`Laporan Rekapitulasi ${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}`],
      ['Bulan', `${monthName} ${report.year}`],
      [],
      ['RINGKASAN BULANAN'],
      [`Total ${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}`, type === 'pendapatan' ? report.totalRevenue : report.ordersCount],
      ['Total Cash', type === 'pendapatan' ? report.paymentBreakdown.cash : report.paymentCounts.cash],
      ['Total E-Wallet', type === 'pendapatan' ? report.paymentBreakdown.ewallet : report.paymentCounts.ewallet],
      [],
      ['RINCIAN HARIAN'],
      ['Tanggal', type === 'pendapatan' ? 'Pendapatan Total' : 'Total Pesanan', 'Cash', 'E-Wallet']
    ];

    report.fullMonthDailyBreakdown.forEach((d: any) => {
      aoa.push([
        `${d.day} ${monthName} ${report.year}`,
        type === 'pendapatan' ? d.totalRevenue : d.ordersCount,
        type === 'pendapatan' ? d.paymentBreakdown.cash : d.paymentCounts.cash,
        type === 'pendapatan' ? d.paymentBreakdown.ewallet : d.paymentCounts.ewallet
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi');

    const fileName = `Rekap_${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}_${monthName}_${report.year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
    >
      <Icon icon="mdi:printer" className="w-5 h-5 text-white" />
      Cetak Rekapitulasi
    </button>
  );
}
