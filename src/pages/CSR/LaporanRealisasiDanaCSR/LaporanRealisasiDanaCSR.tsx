import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const LaporanRealisasiDanaCSR: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getLaporanDanasAPI();
        
        const csrData = response.filter((item: any) => 
          item.sumber_dana && item.sumber_dana.toUpperCase() === 'CSR'
        );

        const groupedData = csrData.reduce((acc: any, curr: any) => {
          const progId = curr.program_id;
          
          if (!acc[progId]) {
            acc[progId] = {
              program_id: progId,
              nama_program: curr.nama_program,
              kth_nama: curr.kth?.nama || 'KTH Rimba', 
              dana_disalurkan: Number(curr.dana_disalurkan),
              dana_direalisasikan: 0,
              status: curr.status,
              latest_date: new Date(curr.created_at).getTime()
            };
          }

          acc[progId].dana_direalisasikan += Number(curr.dana_direalisasikan);
          
          if (new Date(curr.created_at).getTime() > acc[progId].latest_date) {
            acc[progId].status = curr.status;
            acc[progId].latest_date = new Date(curr.created_at).getTime();
          }

          return acc;
        }, {});

        setData(Object.values(groupedData));

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
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('menunggu')) {
      return <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap">{status}</span>;
    }
    if (statusLower.includes('revisi') || statusLower.includes('perbaikan')) {
      return <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap">{status}</span>;
    }
    return <span className="px-4 py-1.5 bg-[#DCECE0] text-[#185325] rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap">{status}</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 font-sans animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-[26px] font-bold text-gray-900">
          Laporan Realisasi Dana
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95 cursor-pointer">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-250">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Disalurkan</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Direalisasikan</th>
                <th className="px-6 py-4 whitespace-nowrap">Sisa Dana</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-24">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mb-2"></span>
                    <br />Memuat data...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => {
                  const sisaDana = Number(item.dana_disalurkan) - Number(item.dana_direalisasikan);
                  
                  return (
                    <tr key={item.program_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-700 whitespace-nowrap">
                        P-CSR-2026-{String(item.program_id).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-800 whitespace-nowrap">
                        {item.nama_program}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {item.kth_nama}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_disalurkan)}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_direalisasikan)}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(sisaDana)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                        <button 
                          title="Lihat Detail"
                          onClick={() => navigate(`/admin/csr/laporan-keuangan/detail/${item.program_id}`)}
                          className="p-1.5 text-gray-600 hover:text-[#185325] hover:bg-[#DCECE0] rounded-full transition-colors cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada laporan dana CSR yang tersedia.
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

export default LaporanRealisasiDanaCSR;