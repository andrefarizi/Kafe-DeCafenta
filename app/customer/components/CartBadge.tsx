"use client";

import React, { useEffect, useState } from "react";
import { getCustomerCart } from "@/src/controllers/cart-controller";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const items = await getCustomerCart();
      const total = items.reduce((sum, item) => sum + item.qty, 0);
      setCount(total);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCount();

    const handleUpdate = () => fetchCount();
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  if (count === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#8A0000]">
      {count > 99 ? "99+" : count}
    </div>
  );
}
