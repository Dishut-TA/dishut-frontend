import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye } from 'react-icons/hi2';
import { getDaftarPerhitunganEvaluasi } from '@/services/penugasanEvaluasi.service'; // <-- Import API Service

const PerhitunganHasilEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dataPerhitungan, setDataPerhitungan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDaftarPerhitunganEvaluasi();
        setDataPerhitungan(res.data || []);
      } catch (error) {
        console.error("Gagal mengambil data perhitungan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataPerhitungan.filter((item) =>
    (item.proyek || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.periode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.noSurat || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perhitungan Hasil Evaluasi</h1>
          <p className="text-sm text-gray-500 mt-1">Pilih penugasan periode tertentu untuk menghitung persentase tumbuh tanaman.</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari program atau periode (P1, P2)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none shadow-sm transition-all" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nama Program & No. Surat</th>
                <th className="px-6 py-4">Target Periode</th>
                <th className="px-6 py-4">Lokasi Lahan</th>
                <th className="px-6 py-4 text-center">Status Evaluasi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Memuat data perhitungan...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 mb-1">{item.proyek}</div>
                      <div className="text-xs font-semibold text-gray-500">{item.noSurat}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF8F1] border border-[#C6EBD6] text-[#185325]">
                        <span className="text-xs font-bold">{item.periode}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <span className="truncate max-w-50">{item.lokasi}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'SIAP DIHITUNG' 
                          ? 'bg-[#FEF3C7] text-yellow-800 border border-yellow-200' 
                          : 'bg-emerald-50 text-[#185325] border border-emerald-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 flex justify-center">
                      <button 
                        onClick={() => navigate(`/admin/staff/evaluasi/hasil/detail/${item.id}`)}
                        className={`flex items-center justify-center gap-2 px-2 py-2 text-xs font-bold text-[#185325] border border-[#185325] hover:bg-[#185325] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer ${
                          item.status === 'SIAP DIHITUNG' ? 'rounded-full' : 'rounded-full min-w-9'
                        }`}
                      >
                        {item.status === 'SIAP DIHITUNG' ? (
                          'Mulai Hitung'
                        ) : (
                          <HiOutlineEye className="w-4 h-4 stroke-2" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada penugasan evaluasi ditemukan.
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

export default PerhitunganHasilEvaluasiStaff;