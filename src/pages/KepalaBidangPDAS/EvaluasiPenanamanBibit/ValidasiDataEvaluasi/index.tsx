import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineClipboardDocumentCheck, HiOutlineExclamationTriangle, HiCheckCircle } from 'react-icons/hi2';

const ValidasiDataEvaluasiKABID: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const mockData = [
    {
      id: 'ST-002',
      proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
      timPenilai: 'Srie Resmita (Ketua Tim)',
      totalPU: 15,
      status: 'PERLU VERIFIKASI',
      anomali: false,
    },
    {
      id: 'ST-003',
      proyek: 'Rehabilitasi DAS PT Pertamina EP',
      timPenilai: 'Andi Mansur (Ketua Tim)',
      totalPU: 10,
      status: 'TERDAPAT ANOMALI',
      anomali: true,
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi Data Lapangan</h1>
          <p className="text-sm text-gray-500 mt-1">Tinjau dan validasi data Petak Ukur (PU) yang telah diinput Tim Penilai.</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari program evaluasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] outline-none shadow-sm" 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Nama Program & Tim</th>
                <th className="px-6 py-4 text-center">Total PU</th>
                <th className="px-6 py-4 text-center">Peringatan Sistem</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-800">{item.proyek}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-1">Disubmit oleh: <span className="text-[#185325]">{item.timPenilai}</span></div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-bold text-gray-700">{item.totalPU} Petak</td>
                  <td className="px-6 py-5 text-center">
                    {item.anomali ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100">
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5" /> Anomali Terdeteksi
                      </span>
                    ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100">
                        <HiCheckCircle className="w-3.5 h-3.5" /> Tidak ada Anomali
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-yellow-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 mx-auto text-center">
                    <button 
                      onClick={() => navigate(`/admin/kabid/evaluasi/validasi-evaluasi/detail/${item.id}`)}
                      className="flex items-center justify-center cursor-pointer gap-1.5 px-4 py-2 border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-lg transition-colors"
                    >
                      <HiOutlineClipboardDocumentCheck className="w-4 h-4" /> Tinjau Data
                    </button>
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

export default ValidasiDataEvaluasiKABID;