import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { updatePermission } from "@/services/rbac.service";
import type { PermissionType } from "@/utils/interface";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";
import ConfirmAlert from "@/components/ConfirmAlert";

interface EditPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permissionData: PermissionType | null;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  permissionData,
}) => {
  const [formData, setFormData] = useState({ nama: "", nama_penjaga: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen && permissionData) {
      setFormData({
        nama: permissionData.nama,
        nama_penjaga: permissionData.nama_penjaga,
      });
      setError(null);
    }
  }, [isOpen, permissionData]);

  if (!isOpen || !permissionData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const executeSubmit = async () => {
    setIsAlertOpen(false);
    setIsLoading(true);
    setError(null);
    const loadingId = ToastLoading("Memperbarui izin...");

    try {
      await updatePermission(permissionData.id, formData);
      ToastSuccess("Izin berhasil diperbarui!", loadingId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      ToastError(err.message || "Gagal memperbarui izin", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Edit Hak Akses
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Nama Izin
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Nama Penjaga (Guard)
            </label>
            <input
              type="text"
              value={formData.nama_penjaga}
              onChange={(e) =>
                setFormData({ ...formData, nama_penjaga: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary"
            >
              {isLoading ? "Menyimpan..." : "Perbarui Izin"}
            </button>
          </div>
        </form>
      </div>
      <ConfirmAlert
        isOpen={isAlertOpen}
        title="Perbarui Peran?"
        message={`Simpan perubahan untuk peran "${permissionData.nama}"?`}
        isDanger={false}
        isLoading={isLoading}
        onConfirm={executeSubmit}
        onCancel={() => setIsAlertOpen(false)}
      />
    </div>
  );
};

export default EditPermissionModal;
