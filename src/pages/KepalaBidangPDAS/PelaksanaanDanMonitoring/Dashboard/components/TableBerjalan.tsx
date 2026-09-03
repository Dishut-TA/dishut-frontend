import { useNavigate } from 'react-router-dom';
import { TABLE_BERJALAN_DATA } from '../data/mockData';

export default function TableBerjalan({ }: { programs?: any[] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Program Berjalan</h3>
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="border-b border-gray-100 text-gray-500 font-bold">
            <tr>
              <th className="py-3 pr-2">No</th>
              <th className="py-3 px-2">Program</th>
              <th className="py-3 px-2">Lokasi</th>
              <th className="py-3 px-2">Sumber</th>
              <th className="py-3 px-2">Tahap Kegiatan</th>
              <th className="py-3 px-2">Kategori</th>
              <th className="py-3 px-2 text-right">Progress Tahap</th>
              <th className="py-3 px-2 text-right">Terakhir Diperbarui</th>
              <th className="py-3 pl-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {TABLE_BERJALAN_DATA.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50/50">
                <td className="py-3 pr-2 text-gray-500">{row.no}</td>
                <td className="py-3 px-2 font-medium text-gray-900">{row.program}</td>
                <td className="py-3 px-2 text-gray-600">{row.lokasi}</td>
                <td className="py-3 px-2 text-gray-600">{row.sumber}</td>
                <td className="py-3 px-2 text-gray-600">{row.tahap}</td>
                <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold ${row.kategori === 'Pelaksanaan' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {row.kategori}
                    </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-bold text-gray-900">{row.progress}</span>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: row.progress.replace(',', '.')}}></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-[10px] text-gray-500">{row.tanggal}</td>
                <td className="py-3 pl-2 text-center">
                  <button 
                    onClick={() => navigate(`/admin/kabid/monitoring/dashboard/detail/${row.no}`, { state: { kategori: row.kategori, status: row.kategori === 'Pelaksanaan' ? 'Selesai' : 'Berjalan', periode: row.tahap.includes('V') ? 'Validasi' : 'P2' } })}
                    className="px-3 py-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua Program Berjalan</a>
      </div>
    </div>
  );
}