import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMapPin, HiOutlinePencilSquare } from 'react-icons/hi2';

const DataEvaluasiIndex: React.FC = () => {
  const navigate = useNavigate();

  const [tugas] = useState([
    {
      id: 'ST-001',
      proyek: 'Rehabilitasi DAS A.N SKK Migas - PT Pertamina EP',
      lokasi: 'Kab. Majalengka',
      peran: 'Anggota',
      status: 'BELUM DIMULAI',
      progress: '0/17 Ha'
    },
    {
      id: 'ST-002',
      proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
      lokasi: 'Kab. Garut',
      peran: 'Ketua Tim',
      status: 'PROSES INPUT',
      progress: '10/17 PU'
    }
  ]);

  const getStatusStyle = (status: string) => {
    if (status === 'BELUM DIMULAI') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas Evaluasi Lapangan</h1>
        <p className="text-sm text-gray-500 mt-1">Pilih penugasan untuk mulai menginput data Petak Ukur (PU).</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Proyek & Lokasi</th>
              <th className="px-6 py-4 text-center">Peran Anda</th>
              <th className="px-6 py-4 text-center">Progres PU</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tugas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5">
                  <div className="font-bold text-gray-800">{item.proyek}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <HiOutlineMapPin className="w-3.5 h-3.5 text-[#185325]" /> {item.lokasi}
                  </div>
                </td>
                <td className="px-6 py-5 text-center text-sm font-semibold">{item.peran}</td>
                <td className="px-6 py-5 text-center text-sm font-bold text-[#185325]">{item.progress}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 flex justify-center">
                  <button 
                    onClick={() => navigate(`/admin/staff/evaluasi/data/create/${item.id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" /> Buka Form PU
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataEvaluasiIndex;