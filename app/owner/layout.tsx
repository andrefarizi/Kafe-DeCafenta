import type { Metadata } from 'next';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';

export const metadata: Metadata = {
  title: 'Owner Panel — De Cafenta',
  description: 'Panel manajemen owner De Cafenta',
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar merah kiri */}
      <Sidebar />

      {/* Konten kanan */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar kuning */}
        <TopBar />

        {/* Halaman konten */}
        <main className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
