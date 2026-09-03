import { TABLE_REALISASI_DATA } from '../data/mockData';

export default function TableRealisasi({}: { programs?: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Program dengan Realisasi Tertinggi</h3>
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
              <th className="py-3 px-2 text-right">Target (Pohon)</th>
              <th className="py-3 px-2 text-right">Realisasi (Pohon)</th>
              <th className="py-3 pl-2 text-right">Persentase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {TABLE_REALISASI_DATA.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50/50">
                <td className="py-3 pr-2 text-gray-500">{row.no}</td>
                <td className="py-3 px-2 font-medium text-gray-900">{row.program}</td>
                <td className="py-3 px-2 text-gray-600">{row.lokasi}</td>
                <td className="py-3 px-2 text-gray-600">{row.sumber}</td>
                <td className="py-3 px-2 text-right font-medium">{row.target}</td>
                <td className="py-3 px-2 text-right font-medium">{row.realisasi}</td>
                <td className="py-3 pl-2 text-right font-bold text-emerald-600">{row.persentase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua Program</a>
      </div>
    </div>
  );
}