import React, { useState, useEffect } from "react";
import { deleteUser, getAllUsers } from "@/services/authService"; 
import type { UserProfile } from "@/utils/interface";
import AkunTable from "./components/AkunTable";
import AddAkunModal from "./components/AddAccountModal";
import EditAkunModal from "./components/EditAccountModal";
import ConfirmAlert from "@/components/ConfirmAlert";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

const DataPengguna: React.FC = () => {
  const [akunList, setAkunList] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: true,
    targetId: 0,
  });
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();
      setAkunList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const triggerDelete = (id: number, namaUser: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Hapus Pengguna?",
      message: `Apakah Anda yakin ingin menghapus akun "${namaUser}"? Semua data yang terkait dengan akun ini akan hilang.`,
      isDanger: true,
      targetId: id,
    });
  };

  const executeDelete = async () => {
    setIsAlertLoading(true);
    const loadingId = ToastLoading("Menghapus akun...");

    try {
      await deleteUser(alertConfig.targetId); 
      await fetchUsers(); 
      
      ToastSuccess("Akun berhasil dihapus!", loadingId);
      setAlertConfig({ ...alertConfig, isOpen: false });
    } catch (err: any) {
      ToastError(err.message || "Gagal menghapus akun", loadingId);
    } finally {
      setIsAlertLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Pengguna</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data pengguna sistem SIGAP</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[#185325] text-white text-sm font-semibold rounded-xl hover:bg-[#123d1c] shadow-lg shadow-[#185325]/30 transition-all active:scale-95"
        >
          + Tambah Akun Baru
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
          Error: {error}
        </div>
      )}

      <AkunTable
        data={akunList}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={(user) => triggerDelete(user.id, user.nama_pengguna)}
      />

      <AddAkunModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <EditAkunModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        userData={selectedUser}
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

export default DataPengguna;