import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlineEye } from 'react-icons/hi2';

interface DataInvestor {
  id: string;
  no: number;
  investasi: string;
  namaInvestor: string;
  jumlahInvestasi: number;
}

const mockData: DataInvestor[] = [
  {
    id: 'USR-001',
    no: 1,
    investasi: 'Investasi Wisata Dieng',
    namaInvestor: 'Rakha Nabila',
    jumlahInvestasi: 250000000
  },
  {
    id: 'USR-002',
    no: 2,
    investasi: 'Investasi Wisata Museum Penyu',
    namaInvestor: 'Marisa',
    jumlahInvestasi: 250000000
  }
];

const DataInvestorIndexKABIDBUPM: React.FC = () => {
  const navigate = useNavigate();

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(angka);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Investor
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap text-center w-16">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Investor</th>
                <th className="px-6 py-4 whitespace-nowrap">Jumlah Investasi</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.investasi}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                    {item.namaInvestor}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#185325] whitespace-nowrap">
                    {formatRupiah(item.jumlahInvestasi)}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/kabid/bupm/data-investor/detail/${item.id}`)}
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

export default DataInvestorIndexKABIDBUPM;