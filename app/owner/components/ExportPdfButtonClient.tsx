'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  report: any;
  type: 'pendapatan' | 'pesanan';
}

export default function ExportPdfButtonClient({ report, type }: Props) {
  const handleExport = () => {
    const doc = new jsPDF();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = months[report.month - 1] || report.month;

    // Judul
    doc.setFontSize(18);
    doc.text(`Laporan Rekapitulasi ${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}`, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Bulan: ${monthName} ${report.year}`, 14, 30);

    // Ringkasan Bulanan
    doc.setFontSize(14);
    doc.text('RINGKASAN BULANAN', 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Keterangan', 'Nilai']],
      body: [
        [`Total ${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}`, type === 'pendapatan' ? `Rp ${report.totalRevenue.toLocaleString('id-ID')}` : report.ordersCount],
        ['Total Cash', type === 'pendapatan' ? `Rp ${report.paymentBreakdown.cash.toLocaleString('id-ID')}` : report.paymentCounts.cash],
        ['Total E-Wallet', type === 'pendapatan' ? `Rp ${report.paymentBreakdown.ewallet.toLocaleString('id-ID')}` : report.paymentCounts.ewallet],
      ],
      theme: 'grid',
      headStyles: { fillColor: [139, 26, 26] }
    });

    // Rincian Harian
    doc.setFontSize(14);
    doc.text('RINCIAN HARIAN', 14, (doc as any).lastAutoTable.finalY + 15);

    const dailyData = report.fullMonthDailyBreakdown.map((d: any) => [
      `${d.day} ${monthName} ${report.year}`,
      type === 'pendapatan' ? `Rp ${d.totalRevenue.toLocaleString('id-ID')}` : d.ordersCount,
      type === 'pendapatan' ? `Rp ${d.paymentBreakdown.cash.toLocaleString('id-ID')}` : d.paymentCounts.cash,
      type === 'pendapatan' ? `Rp ${d.paymentBreakdown.ewallet.toLocaleString('id-ID')}` : d.paymentCounts.ewallet
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Tanggal', type === 'pendapatan' ? 'Pendapatan Total' : 'Total Pesanan', 'Cash', 'E-Wallet']],
      body: dailyData,
      theme: 'striped',
      headStyles: { fillColor: [139, 26, 26] }
    });

    const fileName = `Rekap_${type === 'pendapatan' ? 'Pendapatan' : 'Pesanan'}_${monthName}_${report.year}.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
    >
      <Icon icon="mdi:printer" className="w-5 h-5 text-white" />
      Cetak Rekapitulasi (PDF)
    </button>
  );
}
