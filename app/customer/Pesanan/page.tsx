"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/customer/components/sidebar";
import Topbar from "@/app/customer/components/topbar";
import { Loader2 } from "lucide-react";
import { getCustomerOrders } from "@/src/controllers/order-controller";

type Order = {
  id: string;
  orderCode: string;
  status: string;
  totalPrice: number;
  isPaid: boolean;
  orderType: string;
  itemCount: number;
  orderedAt: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  masuk:        { label: "Masuk",        color: "#D8A700" },
  dimasak:      { label: "Dimasak",      color: "#9B0000" },
  siap_diambil: { label: "Siap Diambil", color: "#0077D9" },
  selesai:      { label: "Selesai",      color: "#00C800" },
  dibatalkan:   { label: "Dibatalkan",   color: "#6B7280" },
};

export default function PesananPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getCustomerOrders();
      setOrders(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "semua" || o.status === filter;
    const matchSearch = search === "" || o.orderCode.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,"0")} : ${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const formatPrice = (p: number) => "Rp " + p.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex" style={{ fontFamily: "Poppins, sans-serif" }}>
      <Sidebar activeMenu="pesanan" />
      <div className="flex-1">
        <Topbar />
        <main className="px-[26px] pt-[28px]">
          <h1 className="mb-[30px] text-[40px] font-black text-black">Pesanan Saya</h1>

          <div className="mb-[34px] flex h-[76px] items-center rounded-full border-2 border-[#ffc400] bg-white">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#ffc400]">
              <span className="text-[40px] text-white">⌕</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Contoh : #DFC001"
              className="ml-4 text-[17px] font-medium text-[#444] bg-transparent outline-none flex-1"
            />
          </div>

          <div className="mb-[34px] flex items-center justify-center gap-[38px]">
            {[
              { key: "semua",       label: "Semua",       img: "/group 135.png" },
              { key: "masuk",       label: "Masuk",       img: "/Food Icon Illustrations Kit (1).png" },
              { key: "dimasak",     label: "Dimasak",     img: "/Food Icon Illustrations Kit (2).png" },
              { key: "siap_diambil",label: "Siap Diambil",img: "/Food Icon Illustrations Kit (3).png" },
              { key: "selesai",     label: "Selesai",     img: "/Food Icon Illustrations Kit (4).png" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex h-[56px] items-center justify-center gap-[13px] rounded-[22px] text-[18px] font-black px-6 ${
                  filter === tab.key ? "bg-[#9b0000] text-white" : "border-[3px] border-[#9b0000] bg-white text-black"
                }`}
              >
                <span className="flex h-[28px] w-[28px] items-center justify-center">
                  <Image src={tab.img} alt={tab.label} width={24} height={24} />
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20 text-[#9b0000]">
              <Loader2 className="animate-spin w-10 h-10" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">Tidak ada pesanan ditemukan.</div>
          ) : (
            <div>
              {filtered.map((order) => {
                const cfg = statusConfig[order.status] || { label: order.status, color: "#333" };
                return (
                  <div key={order.id} className="flex h-[84px] items-center border-b border-[#333]">
                    <div className="mr-[22px]">
                      <Image src="/material-symbols_order-approve-outline-rounded.png" alt="Pesanan" width={52} height={52} className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[23px] font-black text-[#9b0000]">#{order.orderCode}</div>
                      <div className="mt-1 text-[14px] text-black">Total {order.itemCount} Menu &nbsp;- {formatPrice(order.totalPrice)}</div>
                    </div>
                    <div className="mr-[22px] w-[160px] text-right">
                      <div className="text-[14px] font-extrabold" style={{ color: cfg.color }}>{cfg.label}</div>
                      <div className="mt-[6px] text-[12px] text-black">{formatDate(order.orderedAt)}</div>
                    </div>
                    <button
                      onClick={() => router.push(`/customer/detail_pesanan/cash?orderId=${order.id}`)}
                      className="h-[42px] w-[92px] rounded-md bg-[#9b0000] text-[13px] font-bold text-white hover:bg-[#7a0000] transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                );
              })}
            </div>
          )}

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

function PageBtn({ text, active, wide, small }: { text: string; active?: boolean; wide?: boolean; small?: boolean }) {
  return (
    <button className={`flex items-center justify-center h-[46px] rounded-md shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${wide ? "w-[155px] text-[15px] font-normal" : small ? "w-[48px] text-[22px] font-bold" : "w-[48px] text-[15px] font-bold"} ${active ? "bg-[#9b0000] text-white" : "bg-white text-[#9b0000]"}`}>
      {text}
    </button>
  );
}