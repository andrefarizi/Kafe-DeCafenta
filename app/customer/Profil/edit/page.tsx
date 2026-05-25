"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/customer/components/sidebar";
import {
  ChevronLeft,
  Mail,
  Phone,
  User,
  Check,
  X,
  Loader2,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProfileData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
};

export default function EditProfilPage() {
  const { status, update } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [validationErrors, setValidationErrors] = useState<{name?: string; phone?: string}>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/profile")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: ProfileData) => {
        setProfile(data);
        setEditName(data.name ?? "");
        setEditPhone(data.phone ?? "");
      })
      .catch((err) => showToast("error", `Gagal memuat profil: ${err.message}`));
  }, [status]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Upload Foto ── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setIsUploading(true);

    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal upload");
      setProfile((prev) => prev ? { ...prev, image: json.imageUrl } : prev);
      await update({ image: json.imageUrl });
      showToast("success", "Foto profil berhasil diperbarui!");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Gagal upload foto");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (validationErrors.name || validationErrors.phone) {
      showToast("error", "Mohon perbaiki kesalahan pada form sebelum menyimpan.");
      return;
    }
    if (!editName.trim()) {
      showToast("error", "Nama tidak boleh kosong");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan");
      await update({ name: editName });
      showToast("success", "Profil berhasil diperbarui!");
      setTimeout(() => {
        router.refresh();
        router.push("/customer/Profil");
      }, 1500);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || !profile) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#fff7ec] via-[#fff3d7] to-[#ffd93d]" style={{ fontFamily: "Poppins, sans-serif" }}>
        <Sidebar />
        <main className="w-full sm:flex-1 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#9b0000]" />
        </main>
      </div>
    );
  }

  const displayImage = previewImage ?? profile.image;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fff7ec] via-[#fff3d7] to-[#ffd93d]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <Check size={18} /> : <X size={18} />}
          {toast.msg}
        </div>
      )}

      <main className="w-full sm:flex-1 px-4 md:px-[48px] pt-6 md:pt-[30px] w-full max-w-full overflow-x-hidden">
        {/* HEADER */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/customer/Profil" className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-white text-[#9b0000] shadow-md">
            <ChevronLeft size={26} strokeWidth={3} />
          </Link>
          <h1 className="text-2xl md:text-[40px] font-semibold text-black">Edit Profil</h1>
        </div>

        {/* CARD */}
        <section className="mx-auto mt-6 md:mt-[42px] w-full max-w-[720px] rounded-3xl md:rounded-[30px] bg-[#f5e2d9]/80 pb-8 md:pb-[40px] shadow-md px-4 md:px-0">
          <div className="flex flex-col items-center pt-8 md:pt-[50px]">

            {/* FOTO */}
            <div className="relative">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[3px] border-[#9b0000] bg-white overflow-hidden">
                {displayImage ? (
                  <Image src={displayImage} alt="Foto Profil" width={180} height={180} className="h-full w-full object-cover rounded-full" unoptimized />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-5xl font-bold text-gray-500">
                      {profile.name?.charAt(0).toUpperCase() ?? <User size={80} />}
                    </span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <Loader2 size={32} className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#9b0000] text-white shadow-md hover:bg-[#7a0000] transition-colors disabled:opacity-60"
              >
                <Camera size={18} />
              </button>
            </div>

            {/* Ganti Foto */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-[10px] flex items-center gap-2 text-[16px] font-medium text-[#9b0000] hover:underline disabled:opacity-60"
            >
      
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />

            {/* FORM */}
            <div className="mt-[22px] flex flex-col gap-[16px] w-full items-center">

              {/* Nama */}
              <div className="w-full max-w-[600px] flex flex-col">
                <div className={`flex h-[52px] w-full items-center rounded-full border-[1.5px] bg-white overflow-hidden ${validationErrors.name ? 'border-red-500' : 'border-[#ffc400]'}`}>
                  <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${validationErrors.name ? 'bg-red-500' : 'bg-[#ffc400]'}`}>
                    <User size={22} color="white" fill="white" />
                  </div>
                  <div className="ml-[10px] leading-tight flex-1 pr-4">
                    <div className="text-[14px] font-semibold text-black">Nama</div>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/[^a-zA-Z\s']/.test(val)) {
                          setValidationErrors(prev => ({...prev, name: 'Nama hanya boleh huruf.'}));
                        } else {
                          setValidationErrors(prev => ({...prev, name: undefined}));
                        }
                        setEditName(val);
                      }}
                      className={`mt-[2px] text-[12px] w-full bg-transparent text-[#333] outline-none border-b ${validationErrors.name ? 'border-red-500' : 'border-[#ffc400]'}`}
                      placeholder="Masukkan nama"
                    />
                  </div>
                </div>
                {validationErrors.name && <span className="text-red-500 text-xs font-bold mt-1 ml-4">{validationErrors.name}</span>}
              </div>

              {/* Email (read-only) */}
              <div className="flex h-[52px] w-full max-w-[600px] items-center rounded-full border-[1.5px] border-[#ffc400] bg-white overflow-hidden">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#ffc400]">
                  <Mail size={22} color="white" />
                </div>
                <div className="ml-[10px] leading-tight">
                  <div className="text-[14px] font-semibold text-black">Email</div>
                  <div className="mt-[3px] text-[12px] font-normal text-[#555]">{profile.email}</div>
                </div>
              </div>

              {/* Nomor HP */}
              <div className="w-full max-w-[600px] flex flex-col">
                <div className={`flex h-[52px] w-full items-center rounded-full border-[1.5px] bg-white overflow-hidden ${validationErrors.phone ? 'border-red-500' : 'border-[#ffc400]'}`}>
                  <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${validationErrors.phone ? 'bg-red-500' : 'bg-[#ffc400]'}`}>
                    <Phone size={22} color="white" fill="white" />
                  </div>
                  <div className="ml-[10px] leading-tight flex-1 pr-4">
                    <div className="text-[14px] font-semibold text-black">Nomor Handphone</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== '' && !/^\d+$/.test(val)) {
                          setValidationErrors(prev => ({...prev, phone: 'Nomor Handphone hanya boleh berisi angka.'}));
                          return;
                        }
                        if (val.length > 0 && (val.length < 10 || val.length > 13)) {
                          setValidationErrors(prev => ({...prev, phone: 'Nomor Handphone harus 10–13 digit.'}));
                        } else {
                          setValidationErrors(prev => ({...prev, phone: undefined}));
                        }
                        setEditPhone(val);
                      }}
                      className={`mt-[2px] text-[12px] w-full bg-transparent text-[#333] outline-none border-b ${validationErrors.phone ? 'border-red-500' : 'border-[#ffc400]'}`}
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>
                {validationErrors.phone && <span className="text-red-500 text-xs font-bold mt-1 ml-4">{validationErrors.phone}</span>}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-[30px] flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/customer/Profil"
                className="h-[50px] w-[150px] rounded-[25px] border-2 border-[#9b0000] text-[#9b0000] text-[17px] font-semibold hover:bg-[#9b0000] hover:text-white transition-colors flex items-center justify-center"
              >
                Batal
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-[50px] w-[160px] rounded-[25px] bg-[#9b0000] text-white text-[17px] font-semibold hover:bg-[#7a0000] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Simpan...</> : <><Check size={18} /> Simpan</>}
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
