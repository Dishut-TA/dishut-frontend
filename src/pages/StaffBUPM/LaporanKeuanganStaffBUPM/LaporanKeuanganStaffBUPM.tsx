import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getLaporanKeuanganBUPMAPI, getKthProgramsAPI } from '@/services/investasi.service';

const LaporanKeuanganStaffBUPM: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resLaporan, resPrograms] = await Promise.all([
          getLaporanKeuanganBUPMAPI(),
          getKthProgramsAPI()
        ]);
        setData(resLaporan);
        setPrograms(resPrograms);
      } catch (err: any) {
        toast.error(err.message || 'Gagal memuat data laporan keuangan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-500 font-bold';
      case 'VERIFIED': return 'text-emerald-600 font-bold';
      case 'REJECTED': return 'text-red-500 font-bold';
      default: return 'text-gray-700 font-bold';
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Verifikasi';
      case 'VERIFIED': return 'Diverifikasi';
      case 'REJECTED': return 'Revisi';
      default: return status || 'Menunggu Verifikasi';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Laporan Keuangan
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
                <th className="px-6 py-4 whitespace-nowrap">Periode</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Laba Bersih</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Memuat data laporan keuangan...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada laporan keuangan.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.periode_awal && item.periode_akhir 
                        ? `${new Date(item.periode_awal).toLocaleDateString('id-ID')} - ${new Date(item.periode_akhir).toLocaleDateString('id-ID')}` 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {item.program?.nama_program_investasi || item.program?.nama_program || programs.find(p => p.id === item.program_id)?.nama_program || programs.find(p => p.id === item.program_id)?.nama_program_investasi || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      Rp {item.laba_bersih?.toLocaleString('id-ID') || 0}
                    </td>
                    <td className={`px-6 py-4 text-sm whitespace-nowrap ${getStatusStyle(item.status_verifikasi)}`}>
                      {mapStatus(item.status_verifikasi)}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button 
                        title="Lihat Detail"
                        onClick={() => navigate(`/admin/staff/bupm/laporan-keuangan/detail/${item.id}`)}
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

export default LaporanKeuanganStaffBUPM;