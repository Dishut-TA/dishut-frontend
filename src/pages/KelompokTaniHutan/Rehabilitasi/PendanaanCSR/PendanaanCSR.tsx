import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

import { getProgramCsrsAPI, deleteProgramCsrAPI } from '@/services/program-csr.service';

const PendanaanCSR: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCsr = async () => {
      try {
        const response = await getProgramCsrsAPI();
        setData(response);
      } catch (error: any) {
        toast.error('Gagal memuat data pengajuan CSR.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCsr();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengajuan program CSR ini?')) {
      try {
        await deleteProgramCsrAPI(id);
        toast.success('Pengajuan CSR berhasil dihapus');
        setData(prev => prev.filter(item => item.id !== id));
      } catch (error: any) {
        toast.error(error.message || 'Gagal menghapus pengajuan CSR');
      }
    }
  };

  const formatRupiah = (angka: number) => {
    if (!angka) return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(angka));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
      case 'Selesai':
        return {
          className: 'bg-green-100 text-green-700',
          label: status,
        };

      case 'Menunggu Verifikasi':
        return {
          className: 'bg-blue-100 text-blue-700',
          label: status,
        };

      case 'Ditolak':
      case 'Perlu Revisi':
        return {
          className: 'bg-red-100 text-red-700 border border-red-200',
          label: status === 'Ditolak' ? 'Perlu Revisi' : status,
        };

      default:
        return {
          className: 'bg-orange-100 text-orange-700',
          label: status || 'Menunggu',
        };
    }
  };

  const filteredData = data.filter((item) =>
    item.nama_program
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Pengajuan Pendanaan CSR
          </h1>

          <p className="text-sm text-gray-500">
            Daftar usulan program rehabilitasi pendanaan mitra
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Proposal.."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none"
            />
          </div>

          <button onClick={() => navigate('/admin/kth/rehabilitasi/pendanaan-csr/create')}
            className="bg-[#185325] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#113d1b] transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} />
            Ajukan Pendanaan CSR
          </button>
        </div>
      </div>

      <div className="bg-[#E8F5E9] rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">
                  ID
                </th>
                <th className="px-6 py-4 whitespace-nowrap">
                  Judul Program
                </th>
                <th className="px-6 py-4 whitespace-nowrap">
                  Anggaran Diajukan
                </th>
                <th className="px-6 py-4 whitespace-nowrap text-center">
                  Status
                </th>
                <th className="px-6 py-4 whitespace-nowrap text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const statusBadge = getStatusBadge(item.status);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        P-CSR-{new Date(item.created_at).getFullYear()}-{String(item.id).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.nama_program}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#185325]">
                        {formatRupiah(item.anggaran)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold inline-block whitespace-nowrap ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/kth/rehabilitasi/pendanaan-csr/detail/${item.id}`
                              )
                            }
                            title="Lihat Detail"
                            className="p-1.5 text-gray-400 hover:text-[#185325] transition-colors cursor-pointer"
                          >
                            <HiOutlineEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/kth/rehabilitasi/pendanaan-csr/edit/${item.id}`
                              )
                            }
                            title="Edit"
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <HiOutlinePencilSquare className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Hapus"
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada usulan proposal CSR yang ditemukan.
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

export default PendanaanCSR;