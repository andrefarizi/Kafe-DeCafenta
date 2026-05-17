import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const toProfileResponse = (user: { id: string; name: string | null; email: string; image: string | null } & { phone?: string | null }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  phone: user.phone ?? null,
});

// GET /api/user/profile — ambil data profil terbaru
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(toProfileResponse(user));
  } catch (err) {
    console.error("[GET /api/user/profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/user/profile — update name dan phone
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { name?: string; phone?: string; image?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, phone, image } = body;

    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }
    if (phone !== undefined && phone.trim().length > 20) {
      return NextResponse.json({ error: "Nomor HP terlalu panjang" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json(toProfileResponse(updated));
  } catch (err) {
    console.error("[PATCH /api/user/profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
