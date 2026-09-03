import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight, HiOutlineXCircle, HiOutlineEye } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrsAPI } from '@/services/program-csr.service';

const ProgramCSRList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProgramCsrsAPI();
        setData(response);
      } catch (error: any) {
        toast.error("Gagal memuat data program CSR.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  };

  const filteredData = data.filter(item => 
    item.nama_program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kth?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status: string) => {
    const baseStyle = "px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap inline-block";
    
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Menunggu Persetujuan':
        return <span className={`${baseStyle} bg-amber-100 text-amber-800`}>{status}</span>;
      case 'Terverifikasi':
        return <span className={`${baseStyle} bg-emerald-100 text-emerald-800 border border-emerald-200`}>Terverifikasi</span>;
      case 'Selesai':
      case 'Disetujui':
        return <span className={`${baseStyle} bg-emerald-600 text-white`}>{status}</span>;
      case 'Mencari Mitra CSR':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800`}>Mencari Mitra CSR</span>;
      case 'Aktif':
      case 'Berjalan':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`}>{status}</span>;
      case 'Ditolak':
      case 'Perlu Revisi':
        return <span className={`${baseStyle} bg-red-100 text-red-700 border border-red-200`}>{status === 'Ditolak' ? 'Perlu Revisi' : status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Program CSR
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Pemeriksaan administratif usulan mandiri dari Kelompok Tani Hutan.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari Proposal..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all text-sm text-gray-700 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap">Anggaran Diajukan</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const year = item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
                  const paddedId = String(item.id).padStart(3, '0');
                  const formattedId = `P-CSR-${year}-${paddedId}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {formattedId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {item.nama_program}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.kth?.nama || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#185325] whitespace-nowrap">
                        {formatRupiah(item.anggaran)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 flex justify-center items-center whitespace-nowrap h-full min-h-16">
                        {item.status === 'Menunggu Verifikasi' ? (
                          <button 
                            onClick={() => navigate(`/admin/staff/rehabilitasi/program-csr/detail/${item.id}`)}
                            className="flex items-center gap-1.5 px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm cursor-pointer"
                          >
                            Tinjau Berkas <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
                          </button>
                        ) : (
                          <button 
                            title="Lihat Detail"
                            onClick={() => navigate(`/admin/staff/rehabilitasi/program-csr/detail/${item.id}`)}
                            className="p-1.5 text-gray-700 hover:text-[#185325] hover:bg-gray-200 border border-gray-400 rounded-full transition-colors cursor-pointer"
                          >
                            <HiOutlineEye className="w-4 h-4 stroke-2" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="p-3 bg-green-50 border border-green-100 rounded-full mb-4">
                        <HiOutlineXCircle className="w-10 h-10 text-[#185325]" />
                      </div>
                      <p className="text-lg font-bold text-gray-800 mb-1">Tidak ada Data!</p>
                      <p className="text-sm max-w-md mx-auto">
                        Belum ada berkas usulan kemitraan swasta (CSR) yang diajukan.
                      </p>
                    </div>
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

export default ProgramCSRList;