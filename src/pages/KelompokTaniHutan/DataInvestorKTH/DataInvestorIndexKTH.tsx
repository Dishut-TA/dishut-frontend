import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';

interface DataInvestor {
  id: string;
  no: number;
  namaInvestor: string;
  nilaiInvestasi: string;
  tanggalBergabung: string;
  status: string;
}

const mockData: DataInvestor[] = [
  {
    id: 'INV-001',
    no: 1,
    namaInvestor: 'Raisha Nabila',
    nilaiInvestasi: 'Rp 50.000.000',
    tanggalBergabung: '24 Agustus 2025',
    status: 'Aktif'
  },
  {
    id: 'INV-002',
    no: 2,
    namaInvestor: 'Marva',
    nilaiInvestasi: 'Rp 50.000.000',
    tanggalBergabung: '24 Agustus 2025',
    status: 'Selesai'
  }
];

const DataInvestorIndexKTH: React.FC = () => {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Aktif': return 'text-emerald-600 font-bold';
      case 'Selesai': return 'text-emerald-600 font-bold';
      default: return 'text-gray-700 font-bold';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Investor
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full min-h-75">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investor</th>
                <th className="px-6 py-4 whitespace-nowrap">Nilai Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal Bergabung</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.namaInvestor}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {item.nilaiInvestasi}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {item.tanggalBergabung}
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/kth/investasi/investor/detail/${item.id}`)}
                      className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#DCECE0] rounded-lg transition-colors border border-transparent hover:border-[#185325]/20"
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

export default DataInvestorIndexKTH;