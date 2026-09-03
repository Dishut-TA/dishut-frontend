import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiPlus, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanKeuanganAPI, getKthProgramsAPI } from '@/services/investasi.service';

const LaporanKeuangan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resLaporan, resPrograms] = await Promise.all([
          getLaporanKeuanganAPI(),
          getKthProgramsAPI()
        ]);
        console.log(resLaporan);
        
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-500 font-bold';
      case 'VERIFIED': return 'text-emerald-600 font-bold';
      case 'REJECTED': return 'text-red-500 font-bold';
      default: return 'text-gray-700';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/admin/kth/laporan-investasi/keuangan/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-lg hover:bg-[#123d1c] transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <HiPlus className="w-4 h-4" /> Buat Laporan Keuangan
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex-1 sm:flex-none justify-center">
            <HiOutlineFunnel className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-h-75">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-16 text-center">No</th>
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4">Nama Proyek</th>
                <th className="px-6 py-4">Total Pendapatan</th>
                <th className="px-6 py-4">Total Pengeluaran</th>
                <th className="px-6 py-4">Laba Bersih</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Memuat data laporan keuangan...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Belum ada laporan keuangan.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4">
                      {item.periode_awal && item.periode_akhir 
                        ? `${new Date(item.periode_awal).toLocaleDateString('id-ID')} - ${new Date(item.periode_akhir).toLocaleDateString('id-ID')}` 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.program?.nama_program_investasi || item.program?.nama_program || programs.find(p => p.id === item.program_id)?.nama_program || programs.find(p => p.id === item.program_id)?.nama_program_investasi || '-'}
                    </td>
                    <td className="px-6 py-4">Rp {item.total_pendapatan?.toLocaleString('id-ID') || 0}</td>
                    <td className="px-6 py-4">Rp {item.total_pengeluaran?.toLocaleString('id-ID') || 0}</td>
                    <td className="px-6 py-4">Rp {item.laba_bersih?.toLocaleString('id-ID') || 0}</td>
                    <td className={`px-6 py-4 ${getStatusColor(item.status_verifikasi)}`}>{mapStatus(item.status_verifikasi)}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => {navigate(`/admin/kth/laporan-investasi/keuangan/detail/${item.id}`)}} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200">
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

export default LaporanKeuangan;