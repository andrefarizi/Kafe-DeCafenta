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

export default function ProfilPage() {
  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-[#fff7ec] via-[#fff3d7] to-[#ffd93d]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <Sidebar />

      <main className="flex-1 px-[48px] pt-[30px]">
        {/* HEADER */}
        <div className="flex items-center gap-5">
          <button className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-white text-[#9b0000] shadow-md">
            <ChevronLeft size={26} strokeWidth={3} />
          </button>

          <h1 className="text-[40px] font-semibold text-black">Profil</h1>
        </div>

        {/* CARD */}
        <section className="mx-auto mt-[42px] w-[720px] rounded-[30px] bg-[#f5e2d9]/80 pb-[40px] shadow-md">
          <div className="flex flex-col items-center pt-[50px]">
            
            {/* FOTO */}
            <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[3px] border-[#9b0000] bg-white">
              <div className="h-[155px] w-[155px] overflow-hidden rounded-full">
                <Image
                  src="/LOGOPROFIL.png"
                  alt="Foto Profil"
                  width={155}
                  height={155}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* GANTI FOTO */}
            <div className="mt-[10px] flex items-center gap-2 text-[16px] font-medium text-[#9b0000]">
              <span>Ganti Foto Profil</span>
              <SquarePen size={18} />
            </div>

            {/* FORM */}
            <div className="mt-[22px] flex flex-col gap-[16px]">
              <InfoField
                icon={<User size={22} color="white" fill="white" />}
                title="Nama"
                value="Andre Wira Pratama"
              />
              <InfoField
                icon={<Mail size={22} color="white" />}
                title="Email"
                value="pratama@gmail.com"
              />
              <InfoField
                icon={<Phone size={22} color="white" fill="white" />}
                title="Nomor Handphone"
                value="08123456789"
              />
            </div>

            {/* BUTTON */}
            <button className="mt-[30px] h-[50px] w-[320px] rounded-[25px] bg-[#9b0000] text-[17px] font-semibold text-white">
              Edit Profile
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* FIELD */
function InfoField({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex h-[52px] w-[600px] items-center rounded-full border-[1.5px] border-[#ffc400] bg-white">
      
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