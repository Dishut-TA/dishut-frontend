import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const HasilValidasiPenyuluh: React.FC = () => {
  const navigate = useNavigate();

  const mockData = [
    { id: 1, lokasi: 'Hulu DAS Sungai Mamberamo', sumber: 'Analisis CPI', penyuluh: 'Siti Nurhaliza', tanggal: '20 Mei 2025 10:23', status: 'Data Diterima' },
    { id: 2, lokasi: 'Bukit Harapan Jaya', sumber: 'Proposal CSR', penyuluh: 'Budi Santoso', tanggal: '19 Mei 2025 16:45', status: 'Perlu Ditinjau' },
    { id: 3, lokasi: 'Lereng Gunung Nusa Indah', sumber: 'Analisis CPI', penyuluh: 'Andi Wijaya', tanggal: '19 Mei 2025 09:12', status: 'Lengkap' },
    { id: 4, lokasi: 'DAS Way Seputih Hulu', sumber: 'Analisis CPI', penyuluh: 'Rina Marlina', tanggal: '18 Mei 2025 14:30', status: 'Perlu Perbaikan' },
    { id: 5, lokasi: 'Bukit Sumber Makmur', sumber: 'Proposal CSR', penyuluh: 'Agus Setiawan', tanggal: '17 Mei 2025 11:05', status: 'Data Diterima' },
    { id: 6, lokasi: 'Hutan Lindung Sungai Batu', sumber: 'Analisis CPI', penyuluh: 'Siti Nurhaliza', tanggal: '16 Mei 2025 13:20', status: 'Lengkap' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Data Diterima': return 'bg-emerald-100 text-emerald-700';
      case 'Lengkap': return 'bg-green-100 text-green-700';
      case 'Perlu Ditinjau': return 'bg-orange-100 text-orange-700';
      case 'Perlu Perbaikan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Hasil Validasi Penyuluh</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan tinjau hasil verifikasi lapangan dari para penyuluh.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-2/3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Sumber Lokasi</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua Sumber</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Penyuluh</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua CDK</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua Status</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full lg:w-1/3">
            <div className="relative w-full">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Cari nama lokasi..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325]" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2">
                Reset
              </button>
              <button className="px-6 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0]/50 text-[#3A4D3F] text-xs font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Lokasi</th>
                <th className="px-6 py-4">Sumber Lokasi</th>
                <th className="px-6 py-4">Penyuluh</th>
                <th className="px-6 py-4">Tanggal Kirim</th>
                <th className="px-6 py-4 text-center">Status Data</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.lokasi}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.sumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.penyuluh}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/admin/staff/monitoring/hasil-validasi-lokasi/detail/${item.id}`)}
                      className="px-4 py-1.5 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-lg transition-colors"
                    >
                      Detail
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/staff/monitoring/hasil-validasi-lokasi/proses/${item.id}`)}
                      className="px-4 py-1.5 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Validasi
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

export default HasilValidasiPenyuluh;