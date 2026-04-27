import type { Metadata } from 'next';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';

export const metadata: Metadata = {
  title: 'Kasir Panel — De Cafenta',
  description: 'Panel kasir De Cafenta',
};

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 bg-gray-50 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}