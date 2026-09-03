import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlinePencilSquare } from 'react-icons/hi2';

const PenugasanEvaluasiSTAFFPDAS: React.FC = () => {
  const navigate = useNavigate();

  const mockData = [
    {
      id: 'ST-002',
      noSurat: 'ST.76/TKTRH/DAS.04/2026',
      proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
      peran: 'Ketua Tim',
      progress: '0/15 Petak Ukur',
      status: 'BELUM DIMULAI',
    },
    {
      id: 'ST-003',
      noSurat: 'ST.12/TKTRH/DAS.04/2026',
      proyek: 'Rehabilitasi DAS PT Pertamina EP',
      peran: 'Anggota',
      progress: '10/10 Petak Ukur',
      status: 'DATA EVALUASI TERVALIDASI',
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas Evaluasi Lapangan</h1>
          <p className="text-sm text-gray-500 mt-1">Pilih penugasan aktif untuk mulai menginput data Petak Ukur (PU).</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Cari surat tugas..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] focus:border-[#185325]" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Informasi Penugasan</th>
                <th className="px-6 py-4 text-center">Peran Anda</th>
                <th className="px-6 py-4 text-center">Progres Input</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-800">{item.proyek}</div>
                    <div className="text-xs font-semibold text-[#185325] mt-1">{item.noSurat}</div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-semibold text-gray-600">{item.peran}</td>
                  <td className="px-6 py-5 text-center text-sm font-bold text-[#185325]">{item.progress}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status.includes('TERVALIDASI') ? 'bg-[#DCECE0] text-[#185325]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {item.status !== 'DATA EVALUASI TERVALIDASI' ? (
                      <button onClick={() => navigate(`/admin/staff/evaluasi/penugasan/create/${item.id}`)} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-full transition-colors shadow-sm">
                        <HiOutlinePencilSquare className="w-4 h-4" /> Input Data Evaluasi
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold italic">Terkunci</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenugasanEvaluasiSTAFFPDAS;