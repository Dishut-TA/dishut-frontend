import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrsAPI } from '@/services/program-csr.service';

const RiwayatPendanaan: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const response = await getProgramCsrsAPI();
        // Filter program yang sudah masuk tahap Riwayat (misal: Disetujui, Selesai, Dihentikan)
        const historyData = response.filter((item: any) => 
          ['Disetujui', 'Selesai', 'Dihentikan'].includes(item.status)
        );
        setData(historyData);
      } catch (error: any) {
        toast.error("Gagal memuat data riwayat pendanaan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(Number(angka || 0));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
      case 'Disetujui':
        return <span className="px-4 py-1.5 bg-[#DCECE0] text-[#185325] text-[11px] font-bold rounded-full whitespace-nowrap">Selesai</span>;
      case 'Dihentikan':
        return <span className="px-4 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded-full whitespace-nowrap">Dihentikan</span>;
      default:
        return <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full whitespace-nowrap">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Riwayat Pendanaan</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors shadow-sm cursor-pointer">
          <HiOutlineFunnel className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap">Nominal Pendanaan</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm bg-white">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">
                        P-CSR-{new Date(item.created_at).getFullYear()}-{String(item.id).padStart(3, '0')}
                      </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.nama_program}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {item.kth?.nama || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button 
                        title="Lihat Detail"
                        onClick={() => navigate(`/admin/csr/riwayat-pendanaan/detail/${item.id}`)}
                        className="p-1.5 text-gray-700 hover:text-[#185325] hover:bg-gray-200 border border-gray-400 rounded-full transition-colors cursor-pointer"
                      >
                        <HiOutlineEye className="w-4 h-4 stroke-2" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm bg-white">
                    Belum ada riwayat pendanaan.
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

export default RiwayatPendanaan;