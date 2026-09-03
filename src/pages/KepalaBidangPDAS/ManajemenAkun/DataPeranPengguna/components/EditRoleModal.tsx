import React, { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { updateRole } from '@/services/rbac.service';
import type { RoleType } from '@/utils/interface';
import ConfirmAlert from '@/components/ConfirmAlert';
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleData: RoleType | null;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onSuccess, roleData }) => {
  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen && roleData) {
      setNama(roleData.nama);
      setError(null);
    }
  }, [isOpen, roleData]);

  if (!isOpen || !roleData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const executeSubmit = async () => {
    setIsAlertOpen(false);
    setIsLoading(true);
    setError(null);
    const loadingId = ToastLoading("Memperbarui peran...");

    try {
      await updateRole(roleData.id, { nama });
      ToastSuccess("Peran berhasil diperbarui!", loadingId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      ToastError(err.message || "Gagal memperbarui peran", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Peran</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full">
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Nama Peran</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-[#185325]/20 focus:border-[#185325] text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 rounded-xl hover:bg-slate-200">Batal</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary">
                {isLoading ? 'Menyimpan...' : 'Perbarui Peran'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Perbarui Peran?"
        message={`Simpan perubahan untuk peran "${roleData.nama}"?`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default EditRoleModal;