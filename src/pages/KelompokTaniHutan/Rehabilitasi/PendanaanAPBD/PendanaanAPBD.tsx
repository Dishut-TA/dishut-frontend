import React, { useState, useEffect } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProgramApbdsAPI } from "@/services/program-apbd.service";

const PendanaanAPBD: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const response = await getProgramApbdsAPI();
        setData(response);
      } catch (error: any) {
        toast.error("Gagal memuat daftar penugasan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  const formatRupiah = (angka: number) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(angka));
  };

  const filteredData = data.filter(
    (item) =>
      item.nama_program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kth?.desa_kelurahan
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Terverifikasi":
        return "bg-gray-200 text-gray-700";
      case "Aktif":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Ditolak":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Penugasan Program APBD
            </h1>
            <p className="text-sm text-gray-500">
              Daftar penugasan program rehabilitasi pendanaan APBD
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari Proposal.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-gray-400 rounded-lg text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Program</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Anggaran</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm text-gray-700">
                      P-APBD-{new Date(item.created_at).getFullYear()}-
                      {String(item.id).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {item.nama_program}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {item.kth?.desa_kelurahan
                        ? `${item.kth.desa_kelurahan}, ${item.kth.kabupaten_kota}`
                        : "-"}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-[#185325]">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(item.status)}`}
                      >
                        {item.status === "Terverifikasi"
                          ? "Menunggu Konfirmasi"
                          : item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 flex justify-center items-center h-full">
                      {item.status === "Terverifikasi" ? (
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/kth/rehabilitasi/pendanaan-apbd/detail/${item.id}`,
                            )
                          }
                          className="bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          Konfirmasi
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/kth/rehabilitasi/pendanaan-apbd/detail/${item.id}`,
                            )
                          }
                          className="text-gray-600 hover:text-[#185325] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Belum ada penugasan program APBD untuk Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendanaanAPBD;
