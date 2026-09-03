import React, { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const LaporanDanaIndexSTAFF: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLaporanDanasAPI();
        setData(response);
      } catch (error: any) {
        toast.error("Gagal memuat data laporan dana.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Terverifikasi':
        return <span className="px-4 py-1.5 bg-[#DCECE0] text-[#185325] rounded-full text-[11px] font-bold whitespace-nowrap">Terverifikasi</span>;
      case 'Menunggu Verifikasi':
        return <span className="px-4 py-1.5 bg-[#FDE68A] text-yellow-800 rounded-full text-[11px] font-bold whitespace-nowrap">Menunggu Verifikasi</span>;
      case 'Revisi':
        return <span className="px-4 py-1.5 bg-red-200 text-red-800 rounded-full text-[11px] font-bold whitespace-nowrap">Revisi</span>;
      default:
        return <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold whitespace-nowrap">{status}</span>;
    }
  };

  const filteredData = data.filter(item => 
    item.nama_program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sumber_dana?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Laporan Dana</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari proyek.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors border border-gray-300 shadow-sm cursor-pointer">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Tahap</th>
                <th className="px-6 py-4 whitespace-nowrap">Sumber Dana</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Disalurkan</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Direalisasikan</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      #{item.sumber_dana}-{item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.nama_program}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.tahap}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.sumber_dana}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {formatRupiah(item.dana_disalurkan)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {formatRupiah(item.dana_direalisasikan)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data laporan dana yang ditemukan.
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

export default LaporanDanaIndexSTAFF;