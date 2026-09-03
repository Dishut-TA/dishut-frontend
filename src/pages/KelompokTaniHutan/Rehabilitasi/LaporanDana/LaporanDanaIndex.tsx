import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye, HiPlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const LaporanDanaIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLaporanDanasAPI();
        
        const grouped = res.reduce((acc: any, item: any) => {
          const key = item.nama_program || 'Program Tanpa Nama';
          
          if (!acc[key]) {
            acc[key] = {
              id: item.id,
              program_id: item.program_id,
              nama_program: item.nama_program,
              sumber_dana: item.sumber_dana,
              tahap: item.tahap,
              tahapanList: [item.tahap],
              dana_disalurkan: Number(item.dana_disalurkan || 0),
              dana_direalisasikan: Number(item.dana_direalisasikan || 0),
              status: item.status,
              created_at: item.created_at,
              allReports: [item] 
            };
          } else {
            acc[key].dana_disalurkan += Number(item.dana_disalurkan || 0);
            acc[key].dana_direalisasikan += Number(item.dana_direalisasikan || 0);
            acc[key].tahapanList.push(item.tahap);
            acc[key].allReports.push(item);
            
            if (new Date(item.created_at) > new Date(acc[key].created_at)) {
              acc[key].status = item.status;
              acc[key].tahap = item.tahap;
              acc[key].created_at = item.created_at;
              acc[key].id = item.id;
            }
          }
          return acc;
        }, {});

        const sortedData = Object.values(grouped).sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setGroupedData(sortedData);
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
      case 'Perlu Revisi':
        return <span className="px-4 py-1.5 bg-red-200 text-red-800 rounded-full text-[11px] font-bold whitespace-nowrap">Revisi</span>;
      default:
        return <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold whitespace-nowrap">{status}</span>;
    }
  };

  const filteredData = groupedData.filter(item => 
    item.nama_program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sumber_dana?.toLowerCase().includes(searchTerm.toLowerCase())
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
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#185325]"
            />
          </div>
          <button 
            onClick={() => navigate('/admin/kth/rehabilitasi/laporan-dana/create')}
            className="flex items-center gap-2 px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <HiPlus className="w-5 h-5" strokeWidth={2.5} /> Buat Laporan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Sumber Dana</th>
                <th className="px-6 py-4 whitespace-nowrap">Total Disalurkan</th>
                <th className="px-6 py-4 whitespace-nowrap">Total Direalisasikan</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Memuat data...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const year = item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
                  const paddedId = String(item.program_id || item.id).padStart(3, '0');
                  const formattedId = `P-${item.sumber_dana}-${year}-${paddedId}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        {formattedId}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.nama_program}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.sumber_dana}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatRupiah(item.dana_disalurkan)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatRupiah(item.dana_direalisasikan)}</td>
                      <td className="px-6 py-4 text-center">{renderStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 flex justify-center items-center">
                        <button 
                          title="Lihat Detail"
                          onClick={() => navigate(`/admin/kth/rehabilitasi/laporan-dana/detail/${item.id}`, { state: { allReports: item.allReports } })}
                          className="p-1.5 text-gray-600 hover:text-[#185325] border border-transparent hover:border-[#185325] rounded-full transition-all cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Belum ada laporan dana.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanDanaIndex;