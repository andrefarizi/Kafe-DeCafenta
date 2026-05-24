"use server";

import { prisma } from "@/lib/prisma";

export async function checkKasirStatus(email: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { staffDetail: true },
    });

    if (user && user.role === "KASIR" && user.staffDetail?.workStatus === "non_aktif") {
      return { isInactive: true };
    }
    return { isInactive: false };
  } catch (error) {
    console.error("Error checking kasir status:", error);
    return { isInactive: false };
  }
}
