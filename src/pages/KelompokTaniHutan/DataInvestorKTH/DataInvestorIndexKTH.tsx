import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getPersetujuanInvestorAPI } from '@/services/investasi.service';

const DataInvestorIndexKTH: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // You can pass status_persetujuan filter if you only want active ones, 
      // but assuming we show all for Data Investor.
      const response = await getPersetujuanInvestorAPI();
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data investor.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(angka);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Aktif': return 'text-emerald-600 font-bold';
      case 'Selesai': return 'text-emerald-600 font-bold';
      default: return 'text-gray-700 font-bold';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Investor
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full min-h-75">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investor</th>
                <th className="px-6 py-4 whitespace-nowrap">Nilai Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal Bergabung</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Belum ada data investor.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {item.nama || item.investor?.name || item.investor?.nama || '- (Tidak Ada Data)'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {formatRupiah(item.nominal_pendanaan || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className={`px-6 py-4 text-sm whitespace-nowrap ${getStatusStyle(item.status_pembayaran || item.status_persetujuan || '')}`}>
                      {item.status_pembayaran || item.status_persetujuan || '-'}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button 
                        title="Lihat Detail"
                        onClick={() => navigate(`/admin/kth/investasi/investor/detail/${item.id}`)}
                        className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-lg transition-colors border border-transparent hover:border-[#185325]/20"
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

export default DataInvestorIndexKTH;