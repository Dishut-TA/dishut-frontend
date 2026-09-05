import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineEye, HiOutlineMapPin } from 'react-icons/hi2';
import { getPenugasanEvaluasiList } from '@/services/penugasanEvaluasi.service';

const InisiasiPenugasanKABID: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dataPenugasan, setDataPenugasan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await getPenugasanEvaluasiList();
        setDataPenugasan(response.data || []);
      } catch (err) {
        console.error('Error loading penugasan:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredData = dataPenugasan.filter((item) => {
    const query = searchTerm.toLowerCase();
    const proyek = (item.nama_proyek_lokasi || '').toLowerCase();
    const jenis = (item.jenis_program || '').toLowerCase();
    const noSurat = (item.nomor_surat || '').toLowerCase();
    return proyek.includes(query) || jenis.includes(query) || noSurat.includes(query);
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inisiasi Penugasan Evaluasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data dasar proyek dan terbitkan surat penugasan Tim Penilai.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari proyek, lokasi, nomor surat..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors shadow-sm" 
            />
          </div>
          <button 
            onClick={() => navigate('/admin/kabid/evaluasi/penugasan/create')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-all duration-200 shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-2" /> Buat Penugasan Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Nama Proyek & Lokasi</th>
                <th className="px-6 py-4 text-center">Jenis Program</th>
                <th className="px-6 py-4 text-center">Luas (Ha)</th>
                <th className="px-6 py-4 text-center">Tahap Evaluasi</th>
                <th className="px-6 py-4 text-center">Status Penugasan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 font-medium animate-pulse">
                    Memuat data penugasan...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const id = item.id;
                  const isAssigned = item.status_penugasan === 'TELAH DITUGASKAN' || item.status_penugasan === 'Menunggu Pelaksanaan';
                  const isProcess = item.status_penugasan === 'DALAM PROSES EVALUASI' || item.status_penugasan === 'Sedang Berjalan';

                  return (
                    <tr key={id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-800 text-sm">{item.nama_proyek_lokasi?.split(' - ')[0] || item.nama_proyek_lokasi}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <HiOutlineMapPin className="w-3.5 h-3.5 text-[#185325]" />
                          <span>{item.nama_proyek_lokasi?.split(' - ')[1] || '-'}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-mono text-[11px]">{item.nomor_surat || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          item.jenis_program === 'APBD' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {item.jenis_program}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-sm font-semibold text-gray-700">
                        {item.luas} Ha
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6]">
                          {item.tahap_evaluasi}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isAssigned 
                            ? 'bg-emerald-50 text-[#185325] border border-emerald-200' 
                            : isProcess 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status_penugasan}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => navigate(`/admin/kabid/evaluasi/penugasan/detail/${id}`)}
                          title="Lihat Detail Penugasan"
                          className="p-2 text-gray-600 hover:text-[#185325] hover:bg-[#DCECE0] transition-colors rounded-full cursor-pointer inline-flex items-center justify-center"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                    Tidak ada data penugasan yang sesuai dengan pencarian.
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

export default InisiasiPenugasanKABID;