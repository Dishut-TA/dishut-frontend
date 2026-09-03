import React, { useState, useEffect } from "react";
import { getAllRoles, deleteRole } from "@/services/rbac.service";
import type { RoleType } from "@/utils/interface";
import RoleTable from "./components/RoleTable";
import AddRoleModal from "./components/AddRoleModal";
import EditRoleModal from "./components/EditRoleModal";
import ConfirmAlert from "@/components/ConfirmAlert";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

const DataPeranPengguna: React.FC = () => {
  const [roleList, setRoleList] = useState<RoleType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: false,
    targetId: 0,
  });
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllRoles();
      setRoleList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEditClick = (role: RoleType) => {
    setSelectedRole(role);
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
      await deleteRole(alertConfig.targetId);
      await fetchRoles();
      ToastSuccess("Data peran berhasil dihapus!", loadingId);
      setAlertConfig({ ...alertConfig, isOpen: false });
    } catch (err: any) {
      ToastError(err.message || "Gagal menghapus peran", loadingId);
    } finally {
      setIsAlertLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Peran Pengguna (Role)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data peran dan hak akses sistem SIGAP
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#185325] text-white text-sm font-medium rounded-md hover:bg-[#123d1c] transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#185325]"
        >
          + Tambah Peran Baru
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
          Error: {error}
        </div>
      )}

      <RoleTable
        data={roleList}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={(role) => triggerDelete(role.id, role.nama)}
      />

      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRoles}
      />

      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchRoles}
        roleData={selectedRole}
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

export default DataPeranPengguna;
