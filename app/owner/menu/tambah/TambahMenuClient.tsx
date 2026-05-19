'use client';

import React, { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, CheckCircle2, AlertCircle, ImagePlus, X } from 'lucide-react';
import { createMenu } from '@/src/controllers/menu-controller';

interface Category { id: string; name: string; }
interface Props { categories: Category[]; }

const MAX_DESC = 300;
const MAX_NAME = 100;
// Hanya izinkan huruf (termasuk huruf Indonesia), angka, spasi, dan tanda hubung
const NAME_ALLOWED_REGEX = /^[a-zA-Z0-9àáâãäåæçèéêëìíîïðñòóôõöùúûüýÿĀāĂăĄąĆćĊċČčĎďĒēĔĕĖėĘęĚěĞğĠġĢģĤĥĪīĬĭĮįİıĶķĹĺĻļĽľŁłŃńŅņŇňŌōŎŏŐőŔŕŖŗŘřŚśŞşŠšŢţŤťŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž \-]*$/;

export default function TambahMenuClient({ categories }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Field states
  const [name, setName]           = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [price, setPrice]         = useState('');
  const [description, setDesc]    = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // UI states
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [showModal, setShowModal] = useState(false);

  /* ─── Validasi client-side ─── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())         e.name = 'Nama menu wajib diisi.';
    else if (name.length > MAX_NAME) e.name = `Maksimal ${MAX_NAME} karakter.`;
    if (!categoryId)          e.categoryId = 'Pilih salah satu kategori.';
    const p = Number(price);
    if (!price)               e.price = 'Harga wajib diisi.';
    else if (isNaN(p) || p <= 0) e.price = 'Harga harus berupa angka lebih dari 0.';
    else if (p > 10_000_000)  e.price = 'Harga terlalu besar (maks 10.000.000).';
    if (description.length > MAX_DESC) e.description = `Maks ${MAX_DESC} karakter. Sekarang ${description.length}.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─── Handle image pick ─── */
  const handleImage = (file: File | undefined) => {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Format tidak didukung. Gunakan PNG, JPG, atau SVG.' }));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Ukuran file maksimal 4 MB (Batas Server).' }));
      return;
    }
    setErrors(prev => { const e = { ...prev }; delete e.image; return e; });
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ─── Handle drag & drop ─── */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImage(e.dataTransfer.files[0]);
  };

  /* ─── Format harga dengan titik ribuan saat display ─── */
  const formatDisplayPrice = (val: string) => {
    const num = val.replace(/\D/g, '');
    return num ? Number(num).toLocaleString('id-ID') : '';
  };

  /* ─── Submit ─── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('categoryId', categoryId);
    fd.append('price', price.replace(/\D/g, ''));
    fd.append('description', description.trim());
    if (imageFile) fd.append('image', imageFile);

    startTransition(async () => {
      try {
        const result = await createMenu(fd);
        if (result.success) {
          setShowModal(true);
        } else {
          setServerError(result.message);
        }
      } catch (err: any) {
        console.error("Server Action Error:", err);
        setServerError(`Gagal mengirim data ke server: ${err.message || 'Unknown error'}. (Catatan: Jika Anda mengunggah gambar, pastikan ukuran file tidak terlalu besar, maksimal ~4MB untuk server Vercel).`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => router.push('/owner/menu')}
          className="mr-4 p-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Kembali ke Manajemen Menu"
        >
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">Tambah Menu</h1>
      </div>

      {/* Server Error Banner */}
      {serverError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-300 text-red-700 rounded-xl px-5 py-3.5 mb-6 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-10 bg-white shadow-sm mb-12">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

          {/* ── Upload Gambar ── */}
          <div>
            <label className="block text-lg font-extrabold text-black mb-1">
              Gambar Menu
              <span className="text-gray-400 text-sm font-normal ml-2">(Opsional, maks 4 MB)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Format yang didukung: PNG, JPG, SVG, WEBP</p>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`w-full h-56 bg-[#F8F9FA] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative
                ${errors.image ? 'border-red-400' : 'border-gray-300 hover:border-[#8B1A1A]'}`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview menu" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    aria-label="Hapus gambar"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus size={36} className="text-gray-400 mb-3" />
                  <h3 className="text-base font-extrabold text-black mb-1 text-center">Tarik gambar ke sini atau klik untuk memilih</h3>
                  <p className="text-xs text-gray-400 text-center">PNG, JPG, SVG, WEBP hingga 4 MB</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0])}
            />
            {errors.image && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.image}</p>}
          </div>

          {/* ── Nama Menu ── */}
          <div>
            <label htmlFor="menu-name" className="block text-lg font-extrabold text-black mb-1">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Gunakan huruf dan angka saja. Simbol seperti koma, titik dua, tanda seru, dll. tidak diperbolehkan.
            </p>
            <input
              id="menu-name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                const raw = e.target.value;
                // Blokir karakter yang tidak diizinkan
                if (!NAME_ALLOWED_REGEX.test(raw)) {
                  setErrors(prev => ({
                    ...prev,
                    name: 'Nama tidak boleh mengandung simbol seperti koma, titik dua, tanda tanya, dsb.'
                  }));
                  // Hanya ambil karakter yang valid
                  const filtered = raw.replace(/[^a-zA-Z0-9àáâãäåæçèéêëìíîïðñòóôõöùúûüýÿ \-]/g, '');
                  setName(filtered);
                  return;
                }
                setName(raw);
                if (errors.name) setErrors(prev => { const x = {...prev}; delete x.name; return x; });
              }}
              placeholder="Contoh: Ayam Penyet Sambal Bawang"
              maxLength={MAX_NAME}
              className={`w-full bg-gray-100 border rounded-xl px-5 py-3.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
                ${errors.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#8B1A1A]'}`}
            />
            <div className="flex justify-between mt-1.5">
              {errors.name
                ? <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>
                : <p className="text-xs text-gray-400">Huruf, angka, spasi, dan tanda hubung (-) diizinkan</p>}
              <p className="text-xs text-gray-400 ml-auto">{name.length}/{MAX_NAME}</p>
            </div>
          </div>

          {/* ── Kategori ── */}
          <div>
            <label htmlFor="menu-category" className="block text-lg font-extrabold text-black mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Pilih kategori yang paling sesuai dengan jenis menu.</p>
            <div className="relative">
              <select
                id="menu-category"
                name="categoryId"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.categoryId) setErrors(prev => { const x = {...prev}; delete x.categoryId; return x; });
                }}
                className={`w-full bg-gray-100 border rounded-xl px-5 py-3.5 text-sm text-black font-semibold appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer
                  ${errors.categoryId ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#8B1A1A]'}`}
              >
                <option value="" disabled>Pilih kategori menu</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-500" strokeWidth={2.5} />
              </div>
            </div>
            {errors.categoryId && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.categoryId}</p>}
          </div>

          {/* ── Harga ── */}
          <div>
            <label htmlFor="menu-price" className="block text-lg font-extrabold text-black mb-1">
              Harga Menu <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Masukkan harga dalam satuan Rupiah, hanya angka.</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-5 flex items-center text-sm font-bold text-gray-500 pointer-events-none">Rp</span>
              <input
                id="menu-price"
                type="text"
                name="price"
                value={formatDisplayPrice(price)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setPrice(raw);
                  if (errors.price) setErrors(prev => { const x = {...prev}; delete x.price; return x; });
                }}
                placeholder="Contoh: 25.000"
                inputMode="numeric"
                className={`w-full bg-gray-100 border rounded-xl pl-12 pr-5 py-3.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
                  ${errors.price ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#8B1A1A]'}`}
              />
            </div>
            {errors.price && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.price}</p>}
          </div>

          {/* ── Deskripsi ── */}
          <div>
            <label htmlFor="menu-desc" className="block text-lg font-extrabold text-black mb-1">
              Deskripsi Menu
              <span className="text-gray-400 text-sm font-normal ml-2">(Opsional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Jelaskan bahan atau keunikan menu ini secara singkat.</p>
            <textarea
              id="menu-desc"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDesc(e.target.value);
                if (errors.description) setErrors(prev => { const x = {...prev}; delete x.description; return x; });
              }}
              placeholder="Contoh: Ayam goreng renyah disajikan dengan sambal bawang khas dan lalapan segar"
              maxLength={MAX_DESC + 10}
              className={`w-full bg-gray-100 border rounded-xl px-5 py-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none
                ${errors.description ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#8B1A1A]'}`}
            />
            <div className="flex justify-between mt-1.5">
              {errors.description
                ? <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>
                : <span />}
              <p className={`text-xs ml-auto ${description.length > MAX_DESC ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                {description.length}/{MAX_DESC}
              </p>
            </div>
          </div>

          {/* ── Keterangan Wajib ── */}
          <p className="text-xs text-gray-400"><span className="text-red-500">*</span> Kolom wajib diisi</p>

          {/* ── Submit ── */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-12 bg-[#8B1A1A] hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Menyimpan...
                </>
              ) : 'Simpan Menu'}
            </button>
          </div>

        </form>
      </div>

      {/* ── Modal Berhasil ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[3px] border-[#8B1A1A] rounded-[2rem] w-full max-w-sm p-8 flex flex-col items-center text-center shadow-2xl">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-3" strokeWidth={1.5} />
            <img src="/Group (6).png" alt="Sukses" className="w-20 h-20 object-contain mb-4" />
            <h2 className="text-2xl font-extrabold text-black leading-tight mb-2">
              Menu Berhasil<br />Ditambahkan!
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-8">
              Menu baru sudah tersedia di daftar manajemen menu.
            </p>
            <button
              onClick={() => router.push('/owner/menu')}
              className="w-full bg-[#8B1A1A] hover:bg-red-900 text-white font-extrabold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Kembali ke Manajemen Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
