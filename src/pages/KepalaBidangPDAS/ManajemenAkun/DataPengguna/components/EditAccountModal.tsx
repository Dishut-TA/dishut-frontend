import React, { useState, useEffect, useRef } from "react";
import { 
  HiXMark, 
  HiOutlineCamera,
  HiOutlineTrash, 
  HiOutlineMagnifyingGlassPlus, 
  HiOutlineMagnifyingGlassMinus,
  HiOutlineArrowPath
} from "react-icons/hi2";
import { updateUser } from "@/services/authService";
import { getAllRoles } from "@/services/rbac.service";

import type { RoleType, UpdateUserPayload, UserProfile } from "@/utils/interface";
import ConfirmAlert from "@/components/ConfirmAlert";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";
import { updatePegawaiFormData } from "@/services/pegawai/pegawai.service";

interface EditAkunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userData: UserProfile | null;
}

const EditAkunModal: React.FC<EditAkunModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userData,
}) => {
  const [formData, setFormData] = useState<UpdateUserPayload>({
    nama_pengguna: "",
    email: "",
    nip: "",
    kata_sandi: "",
    peran: "",
  });
  
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // --- STATE UNTUK FOTO PROFILE (DRAG, DROP, ZOOM, PAN) ---
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // DEKLARASI FUNGSI DI ATAS useEffect
  // ==========================================
  const handleClearPhoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ==========================================
  // EFFECT HOOKS
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
          const data = await getAllRoles();
          setRoles(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        nama_pengguna: userData.nama_pengguna,
        email: userData.email,
        nip: userData.nip || "",
        kata_sandi: "",
        peran: userData.peran && userData.peran.length > 0 ? userData.peran[0].nama : "" 
      });
      
      // Mengambil foto dari object profil bersarang (fallback ke properti luar jika ada)
      const existingPhoto = userData.profil?.foto_profile || userData.foto_profile;
      setFotoPreview(existingPhoto || null);
      
      setFotoFile(null);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, userData]);

  if (!isOpen || !userData) return null;

  // ==========================================
  // HANDLERS FORM & FOTO
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      ToastError("Hanya file gambar yang diperbolehkan!");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // --- INTERAKSI ZOOM & PAN FOTO ---
  const handleZoomIn = (e: React.MouseEvent) => { e.preventDefault(); setScale(p => Math.min(p + 0.5, 4)); };
  const handleZoomOut = (e: React.MouseEvent) => { e.preventDefault(); setScale(p => Math.max(p - 0.5, 1)); };
  const handleResetZoom = (e: React.MouseEvent) => { e.preventDefault(); setScale(1); setPosition({ x: 0, y: 0 }); };
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) setScale(p => Math.min(p + 0.2, 4));
    else setScale(p => Math.max(p - 0.2, 1));
  };
  const startDrag = (clientX: number, clientY: number) => {
    setIsDraggingImg(true);
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };
  const onDrag = (clientX: number, clientY: number) => {
    if (!isDraggingImg) return;
    setPosition({ x: clientX - dragStart.current.x, y: clientY - dragStart.current.y });
  };
  const endDrag = () => setIsDraggingImg(false);

  const getCroppedImage = async (): Promise<File | null> => {
    if (!fotoPreview || !fotoFile) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = fotoPreview;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 112;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        const scaleCover = Math.max(size / img.width, size / img.height);
        const drawWidth = img.width * scaleCover;
        const drawHeight = img.height * scaleCover;

        ctx.clearRect(0, 0, size, size);
        ctx.translate(size / 2 + position.x, size / 2 + position.y);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          resolve(new File([blob], fotoFile.name, { type: fotoFile.type }));
        }, fotoFile.type);
      };
    });
  };

  // ==========================================
  // SUBMIT DATA
  // ==========================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const executeSubmit = async () => {
    setIsAlertOpen(false);
    setIsLoading(true);
    const loadingId = ToastLoading("Memperbarui data akun & profil...");

    try {
      // 1. UPDATE USER DATA (JSON)
      const userPayload: any = {
        nama_pengguna: formData.nama_pengguna,
        email: formData.email,
        peran: formData.peran,
      };
      if (formData.kata_sandi) {
        userPayload.kata_sandi = formData.kata_sandi;
      }
      
      await updateUser(userData.id, userPayload);
      
      // 2. UPDATE PROFIL DATA (FormData)
      const pegawaiFormData = new FormData();
      pegawaiFormData.append("nip", formData.nip || "");
      
      if (fotoFile) {
        const croppedFile = await getCroppedImage() || fotoFile;
        pegawaiFormData.append("foto_profile", croppedFile);
      }
      
      pegawaiFormData.append("_method", "PUT"); 

      await updatePegawaiFormData(userData.id, pegawaiFormData);

      ToastSuccess("Akun & Profil berhasil diperbarui!", loadingId);
      onSuccess();
      onClose();
    } catch (err: any) {
      ToastError(err.message || "Gagal memperbarui data", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
          
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-bold text-slate-800">Edit Pengguna</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center justify-center mb-4">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                onChange={handlePhotoChange} 
              />

              {!fotoPreview ? (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-28 h-28 rounded-full overflow-hidden border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragOver ? 'border-[#185325] bg-[#185325]/10 scale-105' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#185325]/50'
                  }`}
                >
                  <HiOutlineCamera className={`w-8 h-8 ${isDragOver ? 'text-[#185325]' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-bold mt-1 text-center px-2 ${isDragOver ? 'text-[#185325]' : 'text-slate-400'}`}>
                    Upload / Drop
                  </span>
                </div>
              ) : (
                <div className="relative group flex flex-col items-center">
                  <div 
                    className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 cursor-grab active:cursor-grabbing"
                    onWheel={handleWheel}
                    onMouseLeave={endDrag}
                    onMouseUp={endDrag}
                    onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
                    onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                  >
                    <img 
                      src={fotoPreview} 
                      alt="Preview" 
                      draggable={false}
                      className="w-full h-full object-contain"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDraggingImg ? 'none' : 'transform 0.1s ease-out' 
                      }}
                    />
                    
                    <button 
                      type="button" 
                      onClick={handleClearPhoto} 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Kontrol Zoom */}
                  <div className="flex items-center gap-2 mt-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                    <button type="button" onClick={handleZoomOut} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineMagnifyingGlassMinus className="w-4 h-4" /></button>
                    <button type="button" onClick={handleResetZoom} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineArrowPath className="w-4 h-4" /></button>
                    <button type="button" onClick={handleZoomIn} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineMagnifyingGlassPlus className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>

            {/* FIELD INPUT LAINNYA */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pengguna</label>
              <input
                type="text"
                name="nama_pengguna"
                value={formData.nama_pengguna}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIP</label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Peran (Role)</label>
              <select
                name="peran"
                value={formData.peran}
                onChange={handleChange}
                required
                disabled={isLoadingRoles}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] disabled:opacity-60 cursor-pointer"
              >
                <option value="" disabled>{isLoadingRoles ? "Memuat role..." : "Pilih peran akun"}</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.nama}>{role.nama.replace(/_/g, " ").toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Kata Sandi Baru <span className="font-normal text-slate-400">(Opsional)</span>
              </label>
              <input
                type="password"
                name="kata_sandi"
                value={formData.kata_sandi}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Kosongkan jika tidak diubah"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-[#144a18] shadow-lg shadow-[#185325]/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Perbarui Akun"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Perbarui Akun?"
        message={`Simpan perubahan untuk pengguna "${userData.nama_pengguna}"?`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default EditAkunModal;