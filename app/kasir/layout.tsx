import type { Metadata } from 'next';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';

export const metadata: Metadata = {
  title: 'Kasir Panel — De Cafenta',
  description: 'Panel kasir De Cafenta',
};

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function KasirLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { staffDetail: true },
    });

    if (user?.role === "KASIR" && user.staffDetail?.workStatus === "non_aktif") {
      redirect("/login");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="w-full sm:flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}