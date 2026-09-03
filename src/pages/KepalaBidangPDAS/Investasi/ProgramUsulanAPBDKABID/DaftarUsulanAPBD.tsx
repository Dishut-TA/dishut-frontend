import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdsAPI } from '@/services/program-apbd.service';

const DaftarUsulanAPBD: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsulan = async () => {
      try {
        const response = await getProgramApbdsAPI();
        const sortedData = response.sort((a: any, b: any) => {
          const priority = (status: string) => {
            if (status === 'Menunggu Persetujuan') return 1;
            if (status === 'Aktif') return 2;
            return 3;
          };
          return priority(a.status) - priority(b.status);
        });
        setData(sortedData);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat data usulan program");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsulan();
  }, []);

  const formatRupiah = (angka: number) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
  };

  const filteredData = data.filter(item => 
    item.nama_program?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kth?.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case 'Aktif':
      case 'Berjalan':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`}>{status}</span>;
      case 'Ditolak':
      case 'Revisi':
        return <span className={`${baseStyle} bg-red-100 text-red-700 border border-red-200`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status || 'Menunggu'}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Data Usulan Program APBD
          </h1>
        </div>
        
        <div className="relative w-full sm:w-72">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari Program atau KTH..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID PROGRAM</th>
                <th className="px-6 py-4 whitespace-nowrap">NAMA PROGRAM</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH PENERIMA</th>
                <th className="px-6 py-4 whitespace-nowrap">LOKASI</th>
                <th className="px-6 py-4 whitespace-nowrap">ANGGARAN</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">STATUS</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">AKSI</th>
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
                filteredData.map((item) => {
                  const year = item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
                  const paddedId = String(item.id).padStart(3, '0');
                  const formattedId = `P-APBD-${year}-${paddedId}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">{formattedId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">{item.nama_program}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                        {item.kth?.nama || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {item.kth?.desa_kelurahan ? `${item.kth.desa_kelurahan}, ${item.kth.kabupaten_kota}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                        {formatRupiah(item.anggaran)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/admin/kabid/rehabilitasi/program-apbd/verifikasi/${item.id}`)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-full transition-colors cursor-pointer"
                        >
                          Periksa Berkas <HiOutlineArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada usulan program yang ditemukan.
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

export default DaftarUsulanAPBD;