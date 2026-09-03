import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye, HiOutlineCheckBadge } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getKthProgramsAPI } from '@/services/investasi.service'; 
import type { ProgramInvestasi } from '@/utils/interface'; // Sesuaikan lokasi import jika berbeda

const DataInvestasi: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProgramInvestasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getKthProgramsAPI();
        setData(result);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat data investasi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(Number(angka || 0));
  };

  const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'WAITING_STAFF_VERIFICATION':
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold whitespace-nowrap">Menunggu Persetujuan</span>;

    case 'WAITING_HEAD_APPROVAL':
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold whitespace-nowrap">Menunggu Persetujuan Kepala</span>;

    case 'REVISION':
    case 'REJECTED':
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold whitespace-nowrap">Revisi</span>;

    case 'ACTIVE':
    case 'APPROVED':
      return <span className="px-3 py-1 bg-[#DCECE0] text-[#185325] rounded-full text-xs font-bold whitespace-nowrap">Aktif</span>;

    case 'COMPLETED':
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold whitespace-nowrap">Selesai</span>;

    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold whitespace-nowrap">{status}</span>;
  }
};

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Investasi (BUPM)
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95 cursor-pointer">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Target</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Tenggat Waktu</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">Memuat data investasi...</td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">{item.nama_program}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">{formatRupiah(item.target_dana)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center whitespace-nowrap">
                      {new Date(item.batas_waktu_pengumpulan).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      {item.status === 'WAITING_STAFF_VERIFICATION' ? (
                        <button 
                          onClick={() => navigate(`/admin/staff/bupm/data-investasi/konfirmasi/${item.id}`, { state: { program: item } })}
                          className="flex items-center gap-1.5 px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm cursor-pointer"
                        >
                          <HiOutlineCheckBadge className="w-4 h-4" /> Konfirmasi
                        </button>
                      ) : (
                        <button 
                          title="Lihat Detail"
                          onClick={() => navigate(`/admin/staff/bupm/data-investasi/detail/${item.id}`, { state: { program: item } })}
                          className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-full transition-colors cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">Belum ada data investasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataInvestasi;