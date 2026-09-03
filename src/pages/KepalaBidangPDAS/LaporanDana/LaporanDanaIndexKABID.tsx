import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const LaporanDanaIndexKABID: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getLaporanDanasAPI();
        
        const grouped = response.reduce((acc: any, item: any) => {
          const key = item.nama_program || 'Program Tanpa Nama';
          
          if (!acc[key]) {
            acc[key] = {
              id: item.id,
              program_id: item.program_id,
              nama_program: item.nama_program,
              sumber_dana: item.sumber_dana,
              tahap: item.tahap,
              dana_disalurkan: Number(item.dana_disalurkan || 0),
              dana_direalisasikan: Number(item.dana_direalisasikan || 0),
              status: item.status, 
              created_at: item.created_at,
              allReports: [item] 
            };
          } else {
            acc[key].dana_disalurkan += Number(item.dana_disalurkan || 0);
            acc[key].dana_direalisasikan += Number(item.dana_direalisasikan || 0);
            acc[key].allReports.push(item);
            
            if (new Date(item.created_at) > new Date(acc[key].created_at)) {
              acc[key].status = item.status;
              acc[key].created_at = item.created_at;
              acc[key].tahap = item.tahap;
              acc[key].id = item.id; 
            }
          }
          return acc;
        }, {});

        const sortedData = Object.values(grouped).sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setData(sortedData);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat daftar laporan dana.");
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
    const baseStyle = "px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap inline-block";
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Menunggu Persetujuan':
        return <span className={`${baseStyle} bg-amber-100 text-amber-800`}>{status}</span>;
      case 'Terverifikasi':
        return <span className={`${baseStyle} bg-emerald-100 text-emerald-800 border border-emerald-200`}>{status}</span>;
      case 'Selesai':
      case 'Disetujui':
        return <span className={`${baseStyle} bg-emerald-600 text-white`}>{status}</span>;
      case 'Ditolak':
      case 'Revisi':
      case 'Perlu Revisi':
        return <span className={`${baseStyle} bg-red-100 text-red-700 border border-red-200`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status || 'Menunggu'}</span>;
    }
  };

  const filteredData = data.filter((item) => 
    item.nama_program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sumber_dana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <h1 className="text-xl md:text-[26px] font-bold text-gray-900">Laporan Dana</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari proyek.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-250">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID PROGRAM</th>
                <th className="px-6 py-4 whitespace-nowrap">NAMA PROGRAM</th>
                <th className="px-6 py-4 whitespace-nowrap">SUMBER DANA</th>
                <th className="px-6 py-4 whitespace-nowrap">TOTAL DISALURKAN</th>
                <th className="px-6 py-4 whitespace-nowrap">TOTAL REALISASI</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">STATUS</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mb-2"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const year = item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
                  const paddedId = String(item.program_id || item.id).padStart(3, '0');
                  const formattedId = `P-${item.sumber_dana}-${year}-${paddedId}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-900 whitespace-nowrap">
                        {formattedId}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-800 whitespace-nowrap">
                        {item.nama_program}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                        {item.sumber_dana}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_disalurkan)}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_direalisasikan)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 flex justify-center items-center">
                        <button 
                          title="Lihat Detail"
                          onClick={() => navigate(`/admin/kabid/rehabilitasi/laporan-dana/detail/${item.id}`, { state: { allReports: item.allReports } })}
                          className="p-1.5 text-gray-600 hover:text-[#185325] border border-transparent hover:border-[#185325] rounded-full transition-all cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada laporan dana yang tersedia.
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

export default LaporanDanaIndexKABID;