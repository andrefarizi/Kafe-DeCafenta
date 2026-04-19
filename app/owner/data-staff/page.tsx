import React from 'react';
import { Search, ChevronDown, Power, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Types ---
type StatusKerja = 'Aktif' | 'Nonaktif';

interface StaffData {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  status: StatusKerja;
}

// --- Dummy Data ---
const staffList: StaffData[] = [
  { id: 1, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Nonaktif' },
  { id: 2, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
  { id: 3, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
  { id: 4, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
  { id: 5, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
  { id: 6, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Nonaktif' },
  { id: 7, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
  { id: 8, nama: 'Wira Crypto', email: 'wira@gmail.com', telepon: '0842993292022', status: 'Aktif' },
];

export default function DaftarStaffKasir() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900">
      
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold mb-8 text-black">Daftar Staff Kasir</h1>

      {/* Main Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
        
        {/* Top Controls: Title, Search, Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-xl font-bold text-black">Semua Staff</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A1A] focus:outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <button className="flex items-center justify-between w-full sm:w-56 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <span>Urutkan berdasarkan : <span className="font-bold text-black">Aktif</span></span>
              <ChevronDown size={14} className="text-black" />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-4 font-medium text-gray-400 text-sm">Nama Staff Kasir</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Email</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">No Telepon</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Status Kerja</th>
                <th className="pb-4 font-medium text-gray-400 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-sm text-black">{staff.nama}</td>
                  <td className="py-4 text-sm text-black text-center">{staff.email}</td>
                  <td className="py-4 font-medium text-sm text-black text-center">{staff.telepon}</td>
                  
                  {/* Status Badge */}
                  <td className="py-4 text-center">
                    <span 
                      className={`inline-block px-4 py-1 rounded-md text-xs font-bold w-24 ${
                        staff.status === 'Aktif' 
                          ? 'bg-[#A7F3D0] text-[#047857]' 
                          : 'bg-[#FECACA] text-[#B91C1C]'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  
                  {/* Action Button */}
                  <td className="py-4 text-center">
                    <div className="flex justify-center">
                      <button 
                        className={`flex items-center justify-center space-x-2 w-32 py-1.5 rounded-md text-xs font-bold transition-colors ${
                          staff.status === 'Aktif'
                            ? 'bg-[#8B1A1A] text-white hover:bg-red-900'
                            : 'bg-white text-[#8B1A1A] border border-[#8B1A1A] hover:bg-red-50'
                        }`}
                      >
                        <Power size={14} />
                        <span>{staff.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Previous Arrow */}
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors">
            <ChevronLeft size={16} />
          </button>
          
          {/* Awal Button */}
          <button className="px-4 py-1.5 bg-gray-50 rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-red-50 transition-colors">
            Awal
          </button>
          
          {/* Page Numbers */}
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#8B1A1A] text-white font-bold text-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] font-bold text-sm hover:bg-red-50 transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] font-bold text-sm hover:bg-red-50 transition-colors">
            3
          </button>
          
          {/* Ellipsis */}
          <span className="w-8 h-8 flex items-center justify-center text-[#8B1A1A] font-bold">
            ...
          </span>
          
          {/* Akhir Button */}
          <button className="px-4 py-1.5 bg-gray-50 rounded-md text-xs font-bold text-[#8B1A1A] hover:bg-red-50 transition-colors">
            Akhir
          </button>
          
          {/* Next Arrow */}
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#8B1A1A] hover:bg-red-50 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}