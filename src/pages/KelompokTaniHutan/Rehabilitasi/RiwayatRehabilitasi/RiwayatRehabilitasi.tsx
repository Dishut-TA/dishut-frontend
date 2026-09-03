import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineAdjustmentsHorizontal,
  HiOutlineEye
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdsAPI } from '@/services/program-apbd.service';
import { getProgramCsrsAPI } from '@/services/program-csr.service';

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

const getStatusStyle = (status: string) => {
  const lowerStatus = status?.toLowerCase() || '';
  if (lowerStatus.includes('selesai')) return 'text-[#2E7D32]'; // Hijau
  if (lowerStatus.includes('berjalan') || lowerStatus.includes('aktif')) return 'text-orange-500'; // Oren
  if (lowerStatus.includes('henti') || lowerStatus.includes('tolak')) return 'text-red-600'; // Merah
  return 'text-gray-600';
};

const RiwayatRehabilitasi: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayatPrograms = async () => {
      try {
        // Ambil data APBD dan CSR secara bersamaan
        const [apbdRes, csrRes] = await Promise.all([
          getProgramApbdsAPI(),
          getProgramCsrsAPI()
        ]);

        // Map data APBD agar seragam formatnya
        const mappedApbd = apbdRes.map((p: any) => ({
          uid: `APBD-${p.id}`,
          id: p.id,
          nama: p.nama_program,
          pendanaan: 'APBD',
          mitra: 'Dinas Kehutanan Jabar', // APBD tidak ada mitra swasta
          anggaran: p.anggaran,
          status: p.status
        }));

        // Map data CSR agar seragam formatnya
        const mappedCsr = csrRes.map((p: any) => ({
          uid: `CSR-${p.id}`,
          id: p.id,
          nama: p.nama_program,
          pendanaan: 'CSR',
          mitra: p.rekomendasi_mitra || 'Seluruh Mitra CSR',
          anggaran: p.anggaran,
          status: p.status
        }));

        // Gabungkan kedua data
        const combinedData = [...mappedApbd, ...mappedCsr];

        // Opsional: Filter hanya untuk program yang "Sah/Tembus" atau masuk ke dalam tahap riwayat pengerjaan
        const riwayatData = combinedData.filter(item => 
          ['Aktif', 'Berjalan', 'Selesai', 'Dihentikan', 'Ditolak KTH'].includes(item.status)
        );

        setData(riwayatData);
      } catch (error: any) {
        toast.error("Gagal memuat daftar riwayat rehabilitasi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayatPrograms();
  }, []);

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Riwayat Pendanaan Rehabilitasi
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari Program.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-all shadow-sm" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors border border-gray-300 shadow-sm cursor-pointer">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Program</th>
                <th className="px-6 py-4">Pendanaan</th>
                <th className="px-6 py-4">Mitra</th>
                <th className="px-6 py-4">Anggaran</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <span className="inline-block w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin"></span>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.uid}</td>
                    <td className="px-6 py-4 text-gray-700">{item.nama}</td>
                    <td className="px-6 py-4 text-gray-700">{item.pendanaan}</td>
                    <td className="px-6 py-4 text-gray-700">{item.mitra}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{formatRupiah(item.anggaran)}</td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span className={getStatusStyle(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center items-center">
                      <button 
                        onClick={() => navigate(`/admin/kth/rehabilitasi/riwayat/detail/${item.uid}`)}
                        className="text-gray-500 hover:text-[#185325] p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada riwayat program yang ditemukan.
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

export default RiwayatRehabilitasi;