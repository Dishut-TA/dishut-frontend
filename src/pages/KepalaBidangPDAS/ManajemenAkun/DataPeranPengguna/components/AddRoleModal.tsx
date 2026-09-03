import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { createRole } from '@/services/rbac.service';
import ConfirmAlert from '@/components/ConfirmAlert';
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nama, setNama] = useState('');
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
    const loadingId = ToastLoading("Menyimpan peran baru...");

    try {
      await createRole({ nama });
      ToastSuccess("Peran berhasil ditambahkan!", loadingId);
      onSuccess();
      onClose();
      setNama('');
    } catch (err: any) {
      setError(err.message);
      ToastError(err.message || "Gagal menyimpan peran", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all">
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tambah Peran Baru</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Nama Peran (Role)</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all duration-200 text-slate-800 placeholder-slate-400"
                placeholder="Contoh: admin_keuangan"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#185325] rounded-xl hover:bg-[#123d1c] hover:shadow-lg transition-all duration-200 disabled:opacity-50">
                {isLoading ? 'Menyimpan...' : 'Simpan Peran'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Simpan Peran?"
        message={`Pastikan penulisan peran "${nama}" sudah benar.`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default AddRoleModal;