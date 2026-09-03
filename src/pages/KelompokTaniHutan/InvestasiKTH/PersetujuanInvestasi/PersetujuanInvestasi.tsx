import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';

interface PersetujuanData {
  id: string;
  no: number;
  tanggal: string;
  investasi: string;
  status: 'Menunggu Persetujuan (Revisi)' | 'Menunggu Persetujuan' | 'Diterima' | 'Ditolak';
}

const mockData: PersetujuanData[] = [
  { id: 'PRS-001', no: 1, tanggal: '24/08/2025', investasi: 'Investasi Ekowisata Kebun Stroberi', status: 'Menunggu Persetujuan (Revisi)' },
  { id: 'PRS-002', no: 2, tanggal: '24/08/2025', investasi: 'Investasi Ekowisata Kebun Stroberi', status: 'Menunggu Persetujuan' },
  { id: 'PRS-003', no: 3, tanggal: '24/08/2025', investasi: 'Investasi Ekowisata Kebun Stroberi', status: 'Diterima' },
  { id: 'PRS-004', no: 4, tanggal: '24/08/2025', investasi: 'Investasi Ekowisata Kebun Stroberi', status: 'Ditolak' },
];

const PersetujuanInvestasi: React.FC = () => {
  const navigate = useNavigate();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Diterima':
        return <span className="px-4 py-1 bg-[#185325] text-white rounded-full text-[11px] font-bold shadow-sm">Diterima</span>;
      case 'Ditolak':
        return <span className="px-4 py-1 bg-[#FF0000] text-white rounded-full text-[11px] font-bold shadow-sm">Ditolak</span>;
      default:
        return <span className="px-4 py-1 bg-gray-200 text-gray-500 rounded-full text-[11px] font-bold shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Persetujuan Investor
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Proyek</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-24">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.investasi}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/kth/investasi/persetujuan/detail/${item.id}`)}
                      className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-full transition-colors"
                    >
                      <HiOutlineEye className="w-5 h-5" />
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

export default PersetujuanInvestasi;