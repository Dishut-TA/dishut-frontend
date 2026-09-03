import React, { useState, useEffect, useRef } from "react";
import { 
  HiXMark, 
  HiOutlineCamera, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlassPlus, 
  HiOutlineMagnifyingGlassMinus,
  HiOutlineArrowPath
} from "react-icons/hi2";

import { registerAccount } from "@/services/authService";
import { updatePegawaiFormData } from "@/services/pegawai/pegawai.service"; 
import { getAllRoles } from "@/services/rbac.service";

import type { RegisterPayload, RoleType } from "@/utils/interface";
import ConfirmAlert from "@/components/ConfirmAlert";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

interface AddAkunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAkunModal: React.FC<AddAkunModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RegisterPayload>({
    nama_pengguna: "", email: "", nip: "", kata_sandi: "", peran: "",
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
  // DEKLARASI FUNGSI RESET DI ATAS useEffect
  // ==========================================
  const handleClearPhoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData({ nama_pengguna: "", email: "", nip: "", kata_sandi: "", peran: "" });
    handleClearPhoto();
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
    } else {
      // Reset state saat modal ditutup
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- HANDLER FOTO PROFILE ---
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // --- SUBMIT DATA ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const executeSubmit = async () => {
    setIsAlertOpen(false);
    setIsLoading(true);
    const loadingId = ToastLoading("Menyimpan akun & profil baru...");

    try {
      // 1. HIT API REGISTER
      const authResponse = await registerAccount(formData);
      
      // Mengambil ID user baru (Sesuaikan 'payload.id' jika backend Anda mengembalikan struktur berbeda)
      const newUserId = authResponse?.payload?.id || authResponse?.id;

      // 2. HIT API UPDATE FOTO (Jika ada foto yang diunggah & ID berhasil didapatkan)
      if (fotoFile && newUserId) {
        const pegawaiFormData = new FormData();
        pegawaiFormData.append("nip", formData.nip || ""); 
        pegawaiFormData.append("foto_profile", fotoFile);
        pegawaiFormData.append("_method", "PUT"); 
        
        await updatePegawaiFormData(newUserId, pegawaiFormData);
      }

      ToastSuccess("Akun & Profil berhasil ditambahkan!", loadingId);
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      ToastError(err.message || "Gagal menyimpan akun", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
          
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-bold text-slate-800">Tambah Akun Baru</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
            
            {/* AREA UPLOAD FOTO PROFILE (DRAG, DROP, PREVIEW) */}
            <div className="flex flex-col items-center justify-center mb-4">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                onChange={handleFileChange} 
              />

              {!fotoPreview ? (
                // State Kosong (Drag & Drop Area)
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
                // State Preview (Zoomable & Pannable)
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
                      className="w-full h-full object-cover"
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

                  <div className="flex items-center gap-2 mt-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                    <button type="button" onClick={handleZoomOut} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineMagnifyingGlassMinus className="w-4 h-4" /></button>
                    <button type="button" onClick={handleResetZoom} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineArrowPath className="w-4 h-4" /></button>
                    <button type="button" onClick={handleZoomIn} className="p-1 text-slate-500 hover:text-[#185325] transition-colors"><HiOutlineMagnifyingGlassPlus className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>

            {/* FORM INPUT DATA AKUN */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pengguna <span className="text-red-500">*</span></label>
              <input type="text" name="nama_pengguna" value={formData.nama_pengguna} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" placeholder="budi_santoso" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" placeholder="budi.santoso@contoh.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIP</label>
              <input type="text" name="nip" value={formData.nip} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" placeholder="198505152010011023" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Peran (Role) <span className="text-red-500">*</span></label>
              <select name="peran" value={formData.peran} onChange={handleChange} required disabled={isLoadingRoles} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] disabled:opacity-60 cursor-pointer">
                <option value="" disabled>{isLoadingRoles ? "Memuat role..." : "Pilih peran akun"}</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.nama}>{role.nama.replace(/_/g, " ").toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kata Sandi <span className="text-red-500">*</span></label>
              <input type="password" name="kata_sandi" value={formData.kata_sandi} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" placeholder="Masukkan kata sandi" />
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100 shrink-0">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition-all">Batal</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#185325] rounded-xl hover:bg-[#123d1c] shadow-lg shadow-[#185325]/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-30">
                {isLoading ? "Memproses..." : "Simpan Akun"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Simpan Akun?"
        message={`Apakah data untuk pengguna "${formData.nama_pengguna}" sudah benar?`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default AddAkunModal;