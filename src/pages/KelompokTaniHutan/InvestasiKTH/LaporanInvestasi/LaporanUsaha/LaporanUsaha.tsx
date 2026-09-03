import { useNavigate } from 'react-router-dom';
import { HiOutlineFunnel, HiOutlinePrinter, HiPlus } from 'react-icons/hi2';

const LaporanUsaha = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Usaha</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/kth/laporan-investasi/usaha/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-lg hover:bg-[#123d1c] transition-colors"
          >
            <HiPlus /> Buat Laporan Usaha
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
            <HiOutlineFunnel /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
            <HiOutlinePrinter /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 text-center">No</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Investasi</th>
              <th className="px-6 py-4">Dana Terpakai</th>
              <th className="px-6 py-4">Sisa Dana</th>
              <th className="px-6 py-4">Jumlah Investor</th>
              <th className="px-6 py-4">Total Dana Investasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 text-center text-sm text-gray-700">1</td>
              <td className="px-6 py-4 text-sm text-gray-700">24/08/2025</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-800">Investasi Ekowisata Kebun Stroberi</td>
              <td className="px-6 py-4 text-sm text-gray-700">Rp 27.000.000</td>
              <td className="px-6 py-4 text-sm text-gray-700">Rp 27.000.000</td>
              <td className="px-6 py-4 text-sm text-gray-700">-</td>
              <td className="px-6 py-4 text-sm text-gray-700">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanUsaha;