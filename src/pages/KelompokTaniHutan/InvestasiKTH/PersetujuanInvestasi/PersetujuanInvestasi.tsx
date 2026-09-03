
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';
import { getPersetujuanInvestorAPI } from '@/services/investasi.service';
import toast from 'react-hot-toast';

interface PersetujuanData {
  id: string;
  tanggal_bayar?: string;
  created_at?: string;
  program?: {
    nama_program: string;
  };
  status_persetujuan: string;
}

const PersetujuanInvestasi: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PersetujuanData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPersetujuanInvestorAPI();
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengambil data persetujuan.');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'DITERIMA':
        return <span className="px-4 py-1 bg-[#185325] text-white rounded-full text-[11px] font-bold shadow-sm">Diterima</span>;
      case 'DITOLAK':
        return <span className="px-4 py-1 bg-[#FF0000] text-white rounded-full text-[11px] font-bold shadow-sm">Ditolak</span>;
      case 'MENUNGGU':
        return <span className="px-4 py-1 bg-yellow-500 text-white rounded-full text-[11px] font-bold shadow-sm">Menunggu</span>;
      case 'MENUNGGU_REVISI':
        return <span className="px-4 py-1 bg-orange-500 text-white rounded-full text-[11px] font-bold shadow-sm">Menunggu Revisi</span>;
      default:
        return <span className="px-4 py-1 bg-gray-200 text-gray-500 rounded-full text-[11px] font-bold shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Persetujuan Investor
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Proyek</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-24">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">Belum ada pengajuan investasi.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.tanggal_bayar ? new Date(item.tanggal_bayar).toLocaleDateString('id-ID') : (item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {item.program?.nama_program || 'Program Tidak Ditemukan'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {renderStatusBadge(item.status_persetujuan)}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button 
                        title="Lihat Detail"
                        onClick={() => navigate(`/admin/kth/investasi/persetujuan/detail/${item.id}`)}
                        className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-full transition-colors"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PersetujuanInvestasi;