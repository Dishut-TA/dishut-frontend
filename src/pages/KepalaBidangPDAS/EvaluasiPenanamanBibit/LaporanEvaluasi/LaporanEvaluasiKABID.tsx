import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineCheckBadge, HiOutlineEye } from 'react-icons/hi2';

const LaporanEvaluasiKABID: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const mockData = [
    {
      id: 'EVAL-002',
      proyek: 'Rehabilitasi DAS PT Pertamina EP',
      periode: 'Penanaman Awal (P0)',
      tim: 'Srie Resmita Dkk',
      status: 'MENUNGGU PENGESAHAN',
    },
    {
      id: 'EVAL-003',
      proyek: 'Rehabilitasi Lahan Kritis PT. Telkom',
      periode: 'Pemeliharaan I (P1)',
      tim: 'Andi Mansur Dkk',
      status: 'DISETUJUI',
    }
  ];

  const filteredData = mockData.filter((item) =>
    item.proyek.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.periode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengesahan Laporan Evaluasi</h1>
          <p className="text-sm text-gray-500 mt-1">Review Berita Acara dari Tim Penilai dan terbitkan dokumen final (PDF).</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari laporan atau periode..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:ring-[#185325] outline-none shadow-sm" 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Nama Program Rehabilitasi</th>
                <th className="px-6 py-4 text-center">Periode Evaluasi</th>
                <th className="px-6 py-4 text-center">Tim Penyusun</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => {
                const isPending = item.status === 'MENUNGGU PENGESAHAN';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-gray-800 whitespace-nowrap">{item.proyek}</td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="text-xs font-bold text-[#185325] bg-[#EBF8F1] border border-[#C6EBD6] px-3 py-1 rounded-full">
                        {item.periode}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-gray-600 whitespace-nowrap">{item.tim}</td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPending ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-[#185325] border border-emerald-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex justify-center whitespace-nowrap">
                      {isPending ? (
                        <button 
                          onClick={() => navigate(`/admin/kabid/evaluasi/laporan/pengesahan/${item.id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95"
                        >
                          <HiOutlineCheckBadge className="w-4 h-4" /> Tinjau
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/admin/kabid/evaluasi/laporan/detail/${item.id}`)}
                          className="flex items-center gap-1.5 px-2 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-[#185325] text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                      )}
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

export default LaporanEvaluasiKABID;