import React from 'react';
import type { CPIDataRow } from '../types';
import { HiOutlineEye } from 'react-icons/hi2';

interface CPITableProps {
  data: CPIDataRow[];
  onViewDetail: (row: CPIDataRow) => void;
}

const CPITable: React.FC<CPITableProps> = ({ data, onViewDetail }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-200 text-sm text-center whitespace-nowrap">
          <thead className="text-[#3A4D3F] bg-[#DCECE0]">
            <tr>
              <th className="px-4 py-4 font-bold">Kabupaten/Kota</th>
              <th className="px-4 py-4 font-bold">Kecamatan</th>
              <th className="px-4 py-4 font-bold">Desa</th>
              <th className="px-4 py-4 font-bold">Status Kekritisan</th>
              <th className="px-4 py-4 font-bold">Skor CPI</th>
              <th className="px-4 py-4 font-bold">Rekomendasi Intervensi</th>
              <th className="px-4 py-4 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, idx) => (
                // Di dalam CPITable.tsx bagian <tr> mapping:
<tr key={idx} className="hover:bg-gray-50/50 transition-colors">
  <td className="px-4 py-4 font-semibold text-gray-800">{row.kabupaten}</td>
  <td className="px-4 py-4 text-gray-600">{row.kecamatan}</td>
  <td className="px-4 py-4 text-gray-600">{row.desa}</td>
  <td className="px-4 py-4 font-bold">
    <span className={
      row.statusKekritisan.toLowerCase() === 'sangat kritis' ? 'text-red-500' :
      row.statusKekritisan.toLowerCase() === 'kritis' ? 'text-yellow-500' : 'text-green-600'
    }>
      {row.statusKekritisan}
    </span>
  </td>
  <td className="px-4 py-4 text-gray-800 font-medium">{row.skorCPI}</td>
  <td className="px-4 py-4 text-[#185325] font-bold text-left max-w-xs truncate" title={row.rekomendasi}>
    {row.rekomendasi}
  </td>
  <td className="px-4 py-4 flex justify-center">
    <button 
      onClick={() => onViewDetail(row)}
      className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#EBF8F1] rounded-full transition-colors active:scale-95 border border-gray-300"
    >
      <HiOutlineEye className="w-4 h-4 stroke-2" />
    </button>
  </td>
</tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Belum ada hasil analisis zonal. Silakan unggah data GIS.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CPITable;