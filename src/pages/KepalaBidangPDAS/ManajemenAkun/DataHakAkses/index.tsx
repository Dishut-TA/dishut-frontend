import React, { useState, useEffect } from "react";
import { deletePermission, getAllPermissions } from "@/services/rbac.service";
import type { PermissionType } from "@/utils/interface";
import PermissionTable from "./components/PermissionTable";
import AddPermissionModal from "./components/AddPermissionModal";
import EditPermissionModal from "./components/EditPermissionModal";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";
import ConfirmAlert from "@/components/ConfirmAlert";

const DataHakAkses: React.FC = () => {
  const [permissionList, setPermissionList] = useState<PermissionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionType | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: false,
    targetId: 0,
  });
  const [isAlertLoading, setIsAlertLoading] = useState(false);
  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllPermissions();
      setPermissionList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleEdit = (permission: PermissionType) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const triggerDelete = (id: number, namaRole: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Hapus Peran?",
      message: `Apakah Anda yakin ingin menghapus peran "${namaRole}"? Data yang dihapus tidak dapat dikembalikan.`,
      isDanger: true,
      targetId: id,
    });
  };

  const executeDelete = async () => {
    setIsAlertLoading(true);
    const loadingId = ToastLoading("Menghapus data...");
    try {
      await deletePermission(alertConfig.targetId);
      await fetchPermissions();
      ToastSuccess("Data izin berhasil dihapus!", loadingId);
      setAlertConfig({ ...alertConfig, isOpen: false });
    } catch (err: any) {
      ToastError(err.message || "Gagal menghapus izin", loadingId);
    } finally {
      setIsAlertLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Hak Akses (Permission)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data izin spesifik untuk sistem SIGAP
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#185325] text-white text-sm font-medium rounded-md hover:bg-[#123d1c] transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#185325]"
        >
          + Tambah Izin Baru
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
          Error: {error}
        </div>
      )}

      <PermissionTable
        data={permissionList}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(permission) => triggerDelete(permission.id, permission.nama)}
      />
      <AddPermissionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPermissions}
      />
      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchPermissions}
        permissionData={selectedPermission}
      />

      <ConfirmAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        isDanger={alertConfig.isDanger}
        isLoading={isAlertLoading}
        onConfirm={executeDelete}
        onCancel={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
};

export default DataHakAkses;
