import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye } from 'react-icons/hi2';
import { getPenugasanEvaluasiList } from '@/services/penugasanEvaluasi.service';

const PenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPenugasanEvaluasiList();
        setData(res.data || []);
        console.log(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    (item.nama_proyek_lokasi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.nomor_surat || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                const isPending = item.status_penugasan === 'Menunggu Evaluasi' || item.status_penugasan === 'TELAH DITUGASKAN';
                const isSelesai = item.status_penugasan === 'Monitoring Selesai' || item.status_penugasan === 'Selesai';
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800">{item.nama_proyek_lokasi?.split(' - ')[0] || item.nama_proyek_lokasi || '-'}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.nama_proyek_lokasi?.split(' - ')[1] || '-'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-[#185325] bg-[#EBF8F1] border border-[#C6EBD6] px-3 py-1 rounded-full whitespace-nowrap">
                        {item.tahap_evaluasi || '-'}
                      </span>
                      <div className="text-[10px] text-gray-400 font-medium mt-2">Mulai: {item.tanggal_surat || '-'}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                      {item.tim?.length > 0 ? (
                        <div className="flex flex-col gap-1 text-xs">
                          {item.tim.map((t: any) => (
                            <span key={t.id_user || Math.random()}>{t.user?.nama_pengguna || t.user?.username || 'Staff'} ({t.peran})</span>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPending ? 'bg-[#FEF3C7] text-yellow-800 border border-yellow-200' :
                        isSelesai ? 'bg-emerald-50 text-[#185325] border border-emerald-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.status_penugasan}
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