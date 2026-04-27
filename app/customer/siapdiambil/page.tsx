import React from 'react';
import Image from 'next/image';
import Sidebar from '@/app/customer/components/sidebar';
import Topbar from '@/app/customer/components/topbar';

export default function PesananSiapDiambilPage() {
  const orders = Array(4).fill(['Siap Diambil', '#0077D9']);

  return (
    <div
  className="min-h-screen bg-[#f4f7fb] flex"
  style={{ fontFamily: 'Poppins, sans-serif' }}
  >
      <Sidebar activeMenu="pesanan" />

      <div className="flex-1">
        <Topbar />

        <main className="px-[26px] pt-[28px]">
          <h1 className="mb-[30px] text-[40px] font-black text-black">
            Pesanan Saya
          </h1>

          <div className="mb-[34px] flex h-[76px] items-center rounded-full border-2 border-[#ffc400] bg-white">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#ffc400]">
              <span className="text-[40px] text-white">⌕</span>
            </div>
            <span className="ml-4 text-[17px] font-medium text-[#444]">
              Contoh : #DFC001
            </span>
          </div>

          <div className="mb-[34px] flex items-center justify-center gap-[38px]">
            <Tab icon={<Image src="/group 135.png" alt="Semua" width={24} height={24} />} text="Semua" width="w-[170px]" />
            <Tab icon={<Image src="/Food Icon Illustrations Kit (1).png" alt="Masuk" width={24} height={24} />} text="Masuk" width="w-[170px]" />
            <Tab icon={<Image src="/Food Icon Illustrations Kit (2).png" alt="Dimasak" width={24} height={24} />} text="Dimasak" width="w-[170px]" />
            <Tab active icon={<Image src="/Food Icon Illustrations Kit (3).png" alt="Siap Diambil" width={24} height={24} />} text="Siap Diambil" width="w-[190px]" />
            <Tab icon={<Image src="/Food Icon Illustrations Kit (4).png" alt="Selesai" width={24} height={24} />} text="Selesai" width="w-[170px]" />
          </div>

          <div>
            {orders.map(([status, color], i) => (
              <div key={i} className="flex h-[84px] items-center border-b border-[#333]">
                <div className="mr-[22px]">
                  <Image
                    src="/material-symbols_order-approve-outline-rounded.png"
                    alt="Pesanan"
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="text-[23px] font-black text-[#9b0000]">
                    #DCF001
                  </div>
                  <div className="mt-1 text-[14px] text-black">
                    Total 3 Menu&nbsp; - Rp 60.000
                  </div>
                </div>

                <div className="mr-[22px] w-[150px] text-right">
                  <div className="text-[14px] font-extrabold" style={{ color }}>
                    {status}
                  </div>
                  <div className="mt-[14px] text-[14px] text-black">
                    8 Apr 2026, 10 : 30
                  </div>
                </div>

                <button className="h-[42px] w-[92px] rounded-md bg-[#9b0000] text-[13px] font-bold text-white">
                  Detail
                </button>
              </div>
            ))}
          </div>

          <div className="mt-[70px] mb-10 flex w-full items-center justify-center gap-3">
            <PageBtn text="‹" small />
            <PageBtn text="Awal" wide />
            <PageBtn text="1" active />
            <PageBtn text="2" />
            <PageBtn text="3" />
            <PageBtn text="..." />
            <PageBtn text="Akhir" wide />
            <PageBtn text="›" small />
          </div>
        </main>
      </div>
    </div>
  );
}

function Tab({
  icon,
  text,
  active,
  width,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  width: string;
}) {
  return (
    <button
      className={`flex h-[56px] items-center justify-center gap-[13px] rounded-[22px] text-[18px] font-black ${width} ${
        active
          ? 'bg-[#9b0000] text-white'
          : 'border-[3px] border-[#9b0000] bg-white text-black'
      }`}
    >
      <span className="flex h-[28px] w-[28px] items-center justify-center">
        {icon}
      </span>
      <span>{text}</span>
    </button>
  );
}

function PageBtn({
  text,
  active,
  wide,
  small,
}: {
  text: string;
  active?: boolean;
  wide?: boolean;
  small?: boolean;
}) {
  return (
    <button
      className={`flex items-center justify-center h-[46px] rounded-md font-bold shadow-[0_4px_8px_rgba(0,0,0,0.18)]
      ${
        wide
          ? 'w-[155px] text-[15px]'
          : small
          ? 'w-[48px] text-[22px]'
          : 'w-[48px] text-[15px]'
      }
      ${
        active
          ? 'bg-[#9b0000] text-white'
          : 'bg-white text-[#9b0000]'
      }`}
    >
      {text}
    </button>
  );
}