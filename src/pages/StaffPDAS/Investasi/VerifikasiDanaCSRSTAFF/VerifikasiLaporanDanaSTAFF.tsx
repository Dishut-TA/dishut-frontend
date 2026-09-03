import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const VerifikasiLaporanDanaSTAFF: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await getLaporanDanasAPI();
        setData(response);
      } catch (error: any) {
        toast.error("Gagal memuat data verifikasi laporan dana.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#FDE68A] text-yellow-800">Menunggu Verifikasi</span>;
      case 'Terverifikasi':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#DCECE0] text-[#185325]">Terverifikasi</span>;
      case 'Revisi':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-red-200 text-red-800">Revisi</span>;
      default:
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const filteredData = data.filter(item => 
    item.nama_program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Verifikasi Laporan Dana
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari Proyek.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#185325] transition-all text-sm text-gray-700 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors border border-gray-300 shadow-sm cursor-pointer">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                <th className="px-6 py-4 whitespace-nowrap">ID Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Tahap</th>
                <th className="px-6 py-4 whitespace-nowrap">Sumber Dana</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Disalurkan</th>
                <th className="px-6 py-4 whitespace-nowrap">Dana Direalisasikan</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const year = item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
                  const paddedId = String(item.program_id || item.id).padStart(3, '0');
                  const formattedId = `P-${item.sumber_dana}-${year}-${paddedId}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                        {formattedId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item.nama_program}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item.tahap}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item.sumber_dana}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_disalurkan)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.dana_direalisasikan)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                        {/* URL Navigasi tetap merujuk ke ID tabel agar gampang dipanggil di useEffect page detail */}
                        <button 
                          onClick={() => navigate(`/admin/staff/rehabilitasi/verifikasi-dana/detail/${item.id}`)}
                          className="p-1.5 text-gray-600 hover:text-[#185325] border border-transparent hover:border-[#185325] rounded-full transition-all cursor-pointer"
                          title="Tinjau Laporan"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada laporan dana yang perlu diverifikasi.
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

export default VerifikasiLaporanDanaSTAFF;