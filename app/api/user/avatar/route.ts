import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// POST /api/user/avatar — upload foto profil
// Body: FormData dengan field "file" (image)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  // Validasi tipe file
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." },
      { status: 400 }
    );
  }

  // Validasi ukuran file (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 2MB" },
      { status: 400 }
    );
  }

  try {
    // Nama file unik berdasarkan userId + timestamp
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `avatars/${session.user.id}-${Date.now()}.${ext}`;

    // Tulis file ke Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      // Jika butuh token manual: token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const imageUrl = blob.url;

    // Update user.image di database
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
      select: { id: true, image: true },
    });

    return NextResponse.json({ imageUrl: updated.image });
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah foto profil. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
