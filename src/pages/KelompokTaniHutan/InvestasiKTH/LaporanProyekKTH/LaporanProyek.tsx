import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye, HiOutlinePlus } from 'react-icons/hi2';

import { getLaporanProyekAPI } from '@/services/investasi.service';
import toast from 'react-hot-toast';

const LaporanProyekIndexKTH: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setIsLoading(true);
        const res = await getLaporanProyekAPI();
        setData(res);
      } catch (err: any) {
        toast.error(err.message || 'Gagal memuat laporan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Laporan Proyek Investasi
        </h1>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/kth/laporan-investasi/laporan-proyek/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-lg transition-colors shadow-sm active:scale-95"
          >
            Buat Laporan Proyek <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
            <HiOutlineFunnel className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-32">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Proyek</th>
                <th className="px-6 py-4 whitespace-nowrap">Milestone</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-24">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Memuat laporan...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada laporan proyek.</td>
                </tr>
              ) : data.map((item: any, index: number) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.program?.nama_program || item.nama_program_investasi || 'Program Investasi'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                    {item.milestone?.judul_milestone || `Milestone ${item.milestone_id}`}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/kth/laporan-investasi/laporan-proyek/detail/${item.id}`)}
                      className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-full transition-colors"
                    >
                      <HiOutlineEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default LaporanProyekIndexKTH;