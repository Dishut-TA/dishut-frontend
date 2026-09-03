import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { createPermission } from '@/services/rbac.service';
import ConfirmAlert from '@/components/ConfirmAlert';
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPermissionModal: React.FC<AddPermissionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ nama: '', nama_penjaga: 'web' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const executeSubmit = async () => {
    setIsAlertOpen(false);
    setIsLoading(true);
    setError(null);
    const loadingId = ToastLoading("Menyimpan izin baru...");

    try {
      await createPermission(formData);
      ToastSuccess("Izin berhasil ditambahkan!", loadingId);
      onSuccess();
      onClose();
      setFormData({ nama: '', nama_penjaga: 'web' });
    } catch (err: any) {
      setError(err.message);
      ToastError(err.message || "Gagal menyimpan izin", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tambah Hak Akses</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl">{error}</div>}
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Nama Izin</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-[#185325]/20 focus:border-[#185325] text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Nama Penjaga (Guard)</label>
              <input
                type="text"
                value={formData.nama_penjaga}
                onChange={(e) => setFormData({...formData, nama_penjaga: e.target.value})}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-[#185325]/20 focus:border-[#185325] text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 rounded-xl hover:bg-slate-200">Batal</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#185325] rounded-xl hover:bg-[#123d1c]">
                Simpan Izin
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Simpan Hak Akses?"
        message={`Pastikan penulisan izin "${formData.nama}" sudah benar.`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default AddPermissionModal;