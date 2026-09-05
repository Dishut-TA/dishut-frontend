import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye } from 'react-icons/hi2';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

const PenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/evaluasi`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProgramName = (item: any) => {
    const p = item.penugasanable;
    return p?.name || p?.nama_program || '-';
  };
  const getLokasi = (item: any) => {
    const p = item.penugasanable;
    return p?.location || p?.lokasi || (p?.kth ? `${p.kth.desa_kelurahan || p.kth.name || ''}` : '-');
  };

  const filteredData = data.filter((item) =>
    getProgramName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLokasi(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Penugasan Evaluasi Saya
          </h1>
          <p className="text-sm text-gray-500 mt-1">Daftar Surat Tugas lapangan yang diterbitkan oleh Kepala Bidang.</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari program atau lokasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] outline-none shadow-sm transition-colors" 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Nama Program & Lokasi</th>
                <th className="px-6 py-4">Periode Evaluasi</th>
                <th className="px-6 py-4">Peran Anda</th>
                <th className="px-6 py-4 text-center">Status Tugas</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">Memuat data...</td></tr>
              )}
              {!isLoading && filteredData.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">Belum ada penugasan evaluasi</td></tr>
              )}
              {filteredData.map((item) => {
                const isPending = item.status === 'Menunggu Evaluasi';
                const isSelesai = item.status === 'Monitoring Selesai';
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800">{getProgramName(item)}</div>
                      <div className="text-xs text-gray-500 mt-1">{getLokasi(item)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-[#185325] bg-[#EBF8F1] border border-[#C6EBD6] px-3 py-1 rounded-full whitespace-nowrap">
                        {item.periode_monitoring || '-'}
                      </span>
                      <div className="text-[10px] text-gray-400 font-medium mt-2">Mulai: {item.tanggal_penugasan ? new Date(item.tanggal_penugasan).toLocaleDateString('id-ID') : '-'}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                      {item.penyuluh?.name || '-'}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPending ? 'bg-[#FEF3C7] text-yellow-800 border border-yellow-200' :
                        isSelesai ? 'bg-emerald-50 text-[#185325] border border-emerald-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex justify-center">
                      <button 
                        onClick={() => navigate(`/admin/staff/evaluasi/penugasan/detail/${item.id}`)}
                        title="Baca Surat Tugas"
                        className="flex items-center cursor-pointer gap-2 px-2 py-2 text-gray-700 hover:text-[#185325] hover:bg-gray-50 transition-colors rounded-full text-xs font-bold active:scale-95"
                      >
                        <HiOutlineEye className="w-5 h-5" /> 
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenugasanEvaluasiStaff;