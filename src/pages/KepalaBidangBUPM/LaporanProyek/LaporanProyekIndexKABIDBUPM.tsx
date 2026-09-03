import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';

interface LaporanProyekData {
  id: string;
  no: number;
  tanggal: string;
  investasi: string;
  milestone: string;
}

const mockData: LaporanProyekData[] = [
  {
    id: 'LPR-001',
    no: 1,
    tanggal: '15/02/2026',
    investasi: 'Investasi Ekowisata Pinus',
    milestone: 'Milestone 1',
  },
  {
    id: 'LPR-002',
    no: 2,
    tanggal: '15/02/2026',
    investasi: 'Investasi Ekowisata Pinus',
    milestone: 'Milestone 2',
  },
  {
    id: 'LPR-003',
    no: 3,
    tanggal: '15/02/2026',
    investasi: 'Investasi Ekowisata Pinus',
    milestone: 'Milestone 3',
  },
  {
    id: 'LPR-004',
    no: 4,
    tanggal: '15/02/2026',
    investasi: 'Investasi Ekowisata Pinus',
    milestone: 'Milestone 4',
  },
];

const LaporanProyekIndexKABIDBUPM: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Laporan Proyek Investasi
        </h1>
        
        <div className="flex items-center gap-3">
          {/* <button 
            onClick={() => navigate('/admin/staff/bupm/laporan-proyek/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-lg transition-colors shadow-sm active:scale-95"
          >
            Buat Laporan Proyek <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} />
          </button> */}
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
            <HiOutlineFunnel className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-32">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Milestone</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-24">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.investasi}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                    {item.milestone}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/kabid/bupm/laporan-proyek/detail/${item.id}`)}
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

export default LaporanProyekIndexKABIDBUPM;