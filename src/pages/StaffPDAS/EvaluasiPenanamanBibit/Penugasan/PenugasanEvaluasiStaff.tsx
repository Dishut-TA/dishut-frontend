import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineEye } from 'react-icons/hi2';

const PenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Data yang ditarik khusus untuk Staff yang sedang login
  const mockData = [
    {
      id: 'ST-001',
      proyek: 'Rehabilitasi DAS A.N SKK Migas - PT Pertamina EP',
      lokasi: 'Kec. Kasokandel, Kab. Majalengka',
      periode: 'Penanaman Awal (P0)',
      peran: 'Ketua Tim',
      tanggalMulai: '26 Feb 2026',
      status: 'MENUNGGU EVALUASI',
    },
    {
      id: 'ST-002',
      proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
      lokasi: 'Desa Sudalarang, Kab. Garut',
      periode: 'Pemeliharaan II (P2)',
      peran: 'Anggota Tim',
      tanggalMulai: '11 Mar 2026',
      status: 'EVALUASI SELESAI',
    }
  ];

  const filteredData = mockData.filter((item) =>
    item.proyek.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredData.map((item) => {
                const isPending = item.status === 'MENUNGGU EVALUASI';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800">{item.proyek}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.lokasi}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-[#185325] bg-[#EBF8F1] border border-[#C6EBD6] px-3 py-1 rounded-full whitespace-nowrap">
                        {item.periode}
                      </span>
                      <div className="text-[10px] text-gray-400 font-medium mt-2">Mulai: {item.tanggalMulai}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                      {item.peran}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPending ? 'bg-[#FEF3C7] text-yellow-800 border border-yellow-200' : 'bg-emerald-50 text-[#185325] border border-emerald-200'
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