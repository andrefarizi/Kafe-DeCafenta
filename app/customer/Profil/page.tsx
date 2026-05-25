import React from 'react';
import Image from 'next/image';
import Sidebar from '@/app/customer/components/sidebar';
import {
  ChevronLeft,
  Mail,
  Phone,
  SquarePen,
  User,
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import BackButton from './BackButton';

export default async function ProfilPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    phone: (user as { phone?: string | null }).phone ?? null,
  };

  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-[#fff7ec] via-[#fff3d7] to-[#ffd93d]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <Sidebar />

      <main className="w-full sm:flex-1 px-4 sm:px-8 md:px-12 pt-6 md:pt-8 pb-28 md:pb-8">
        {/* HEADER */}
        <div className="flex items-center gap-5">
          <BackButton />

          <h1 className="text-2xl md:text-[40px] font-semibold text-black">Profil</h1>
        </div>

        {/* CARD */}
        <section className="mx-auto mt-6 md:mt-[42px] w-full max-w-[720px] rounded-[30px] bg-[#f5e2d9]/80 pb-8 md:pb-[40px] shadow-md">
          <div className="flex flex-col items-center pt-[50px]">

            {/* FOTO */}
            <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[3px] border-[#9b0000] bg-white">
              <div className="h-[155px] w-[155px] overflow-hidden rounded-full flex items-center justify-center bg-gray-200">
                {userProfile.image ? (
                  <Image
                    src={userProfile.image}
                    alt="Foto Profil"
                    width={155}
                    height={155}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-500">
                    {userProfile.name?.charAt(0).toUpperCase() ?? <User size={80} className="text-gray-400" />}
                  </span>
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="mt-[22px] flex flex-col gap-[16px] w-full px-4 md:px-8 max-w-[640px]">
              <InfoField
                icon={<User size={22} color="white" fill="white" />}
                title="Nama"
                value={userProfile.name || "-"}
              />
              <InfoField
                icon={<Mail size={22} color="white" />}
                title="Email"
                value={userProfile.email}
              />
              <InfoField
                icon={<Phone size={22} color="white" fill="white" />}
                title="Nomor Handphone"
                value={userProfile.phone || "-"}
              />
            </div>

            {/* BUTTON */}
            <EditProfilButton />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Komponen terpisah agar bisa jadi Client di masa depan ── */

function InfoField({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | null;
}) {
  return (
    <div className="flex h-[52px] w-full items-center rounded-full border-[1.5px] border-[#ffc400] bg-white">

      {/* ICON */}
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffc400]">
        {icon}
      </div>

      {/* TEXT */}
      <div className="ml-[10px] leading-tight">
        <div className="text-[14px] font-semibold text-black">
          {title}
        </div>
        <div className="mt-[3px] text-[12px] font-normal text-[#555]">
          {value}
        </div>
      </div>
    </div>
  );
}

/* Tombol Edit Profile — menuju halaman edit profil */
function EditProfilButton() {
  return (
    <Link
      href="/customer/Profil/edit"
      className="mt-[30px] h-[50px] w-[320px] rounded-[25px] bg-[#9b0000] text-[17px] font-semibold text-white flex items-center justify-center hover:bg-[#7a0000] transition-colors"
    >
      Edit Profile
    </Link>
  );
}