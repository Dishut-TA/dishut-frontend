import React, { useState, useEffect } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DetailProgramModal from "./components/DetailProgramModal";
import ConfirmAlert from "@/components/ConfirmAlert"; 
import { getDonationProgramsAPI, deleteDonationProgramAPI } from "@/services/program-donasi.service";

export interface MappedProgramData {
  id: string;
  nama: string;
  lokasi: string;
  jenisBibit: {
    nama: string;
    jumlah: number;
    terealisasi: number;
  }[];
  terkumpul: string;
  totalTerealisasi: string;
  status: string;
}

const getStatusBadge = (status: string) => {
  const baseStyle = "px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap";

  switch (status.toLowerCase()) {
    case "active":
    case "aktif":
      return <span className={`${baseStyle} bg-[#2E7D32] text-white`}>Aktif</span>;
    case "selesai":
    case "completed":
      return <span className={`${baseStyle} bg-gray-200 text-gray-600`}>Selesai</span>;
    case "menunggu verifikasi":
    case "pending":
      return <span className={`${baseStyle} bg-[#F2C94C] text-gray-800`}>Menunggu Verifikasi</span>;
    case "ditolak":
    case "rejected":
      return <span className={`${baseStyle} bg-red-100 text-red-700`}>Ditolak</span>;
    default:
      return <span className={`${baseStyle} bg-gray-100 text-gray-600`}>{status}</span>;
  }
};

const ProgramDonasi: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<MappedProgramData | null>(null);
  const [programsData, setProgramsData] = useState<MappedProgramData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK CONFIRM ALERT DELETE ---
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<{ id: string; nama: string } | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const response = await getDonationProgramsAPI();
      
      const mappedData: MappedProgramData[] = response.payload.map((item: any) => {
        const mappedBibit = item.jenis_bibit && item.jenis_bibit.length > 0 
          ? item.jenis_bibit.map((bibit: any) => ({
              nama: bibit.nama || `Spek ID: ${bibit.id}`,
              jumlah: bibit.jumlah || 0,
              terealisasi: bibit.terealisasi || 0
            }))
          : []; 

        return {
          id: item.id.toString(),
          nama: item.name,
          description: item.description || '',
          lokasi: item.location,
          terkumpul: item.total_seeds_collected.toLocaleString('id-ID'),
          totalTerealisasi: item.total_seeds_realized.toLocaleString('id-ID'),
          status: item.status,
          jenisBibit: mappedBibit
        };
      });

      setProgramsData(mappedData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI MENGAMUNCULKAN ALERT ---
  const promptDelete = (id: string, nama: string) => {
    setProgramToDelete({ id, nama });
    setIsDeleteAlertOpen(true);
  };

  // --- FUNGSI EKSEKUSI DELETE DARI ALERT ---
  const executeDelete = async () => {
    if (!programToDelete) return;

    setIsDeleteLoading(true);
    try {
      await deleteDonationProgramAPI(programToDelete.id);
      toast.success('Program berhasil dihapus!');
      
      // Tutup modal dan reset state
      setIsDeleteAlertOpen(false);
      setProgramToDelete(null);
      
      fetchPrograms(); // Refresh data tabel
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus program.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const filteredData = programsData.filter(
    (program) =>
      program.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.lokasi.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenDetail = (program: MappedProgramData) => {
    setSelectedProgram(program);
  };

  const handleCloseDetail = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Data Program
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Membuka program dan menyesuaikan ketersediaan donasi bibit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari program/lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#DCECE0]/30 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-sm text-sm text-gray-700"
            />
          </div>

          <button
            onClick={() => navigate("/admin/staff/donasi/program/create")}
            className="bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
          >
            <HiOutlinePlus className="w-5 h-5" strokeWidth={2.5} />
            Buat Program
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Lokasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Jenis Bibit</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Terkumpul</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Terealisasi</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
                      <p className="text-sm font-bold text-gray-500">Memuat data program donasi...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((program) => (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {program.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {program.lokasi}
                    </td>

                    <td className="px-6 py-4 max-w-62.5">
                      <div className="flex flex-wrap gap-1.5">
                        {program.jenisBibit && program.jenisBibit.length > 0 ? (
                          program.jenisBibit.map((bibit, index) => (
                            <span key={index} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-[11px] font-medium whitespace-nowrap shadow-sm">
                              {bibit.nama}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">Belum ditentukan.</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-600 text-center whitespace-nowrap">
                      {program.terkumpul}
                    </td>
                    
                    <td className="px-6 py-4 text-sm font-bold text-[#185325] text-center whitespace-nowrap">
                      {program.totalTerealisasi}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(program.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(program)}
                          title="Lihat Detail"
                          className="p-1.5 text-gray-400 hover:text-[#2E7D32] transition-colors"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/staff/donasi/program/edit/${program.id}`)}
                          title="Edit Program"
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => promptDelete(program.id, program.nama)}
                          title="Hapus Program"
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Program tidak ditemukan.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {selectedProgram && (
        <DetailProgramModal
          isOpen={selectedProgram !== null}
          onClose={handleCloseDetail}
          program={selectedProgram as any} 
        />
      )}

      {/* IMPLEMENTASI CONFIRM ALERT UNTUK DELETE */}
      <ConfirmAlert
        isOpen={isDeleteAlertOpen}
        title="Hapus Program Donasi?"
        message={`Apakah Anda yakin ingin menghapus program "${programToDelete?.nama}"? Data yang terhapus tidak dapat dikembalikan.`}
        isDanger={true}
        confirmText="Ya, Hapus"
        isLoading={isDeleteLoading}
        onConfirm={executeDelete}
        onCancel={() => {
          setIsDeleteAlertOpen(false);
          setProgramToDelete(null);
        }}
      />
    </div>
  );
};

export default ProgramDonasi;