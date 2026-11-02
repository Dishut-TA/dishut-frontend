import React from 'react';
import type { CPIDataRow } from '../types';

interface CPITableProps {
  data: CPIDataRow[];
}

const CPITable: React.FC<CPITableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-[#3A4D3F] bg-[#DCECE0] font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">ID Polygon/Lokasi</th>
              <th className="px-6 py-4">Wilayah CDK</th>
              <th className="px-6 py-4">Kabupaten/Kota</th>
              <th className="px-6 py-4">Kecamatan</th>
              <th className="px-6 py-4">Desa/Kelurahan</th>
              <th className="px-6 py-4">Nama DAS</th>
              <th className="px-6 py-4">Luas Indikatif Lahan (Ha)</th>
              <th className="px-6 py-4 text-center">Status Kekritisan</th>
              <th className="px-6 py-4 text-center">Skor CPI</th>
              <th className="px-6 py-4 text-center">Rekomendasi Tanaman</th>
              <th className="px-6 py-4 text-center">Rekomendasi Intervensi</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">Belum Ada</td>
                <td className="px-6 py-4 font-semibold text-gray-800">Belum Ada</td>
                <td className="px-6 py-4 font-semibold text-gray-800">Belum Ada</td>
                <td className="px-6 py-4 text-gray-600">{row.kabupaten}</td>
                <td className="px-6 py-4 text-gray-600">{row.kecamatan}</td>
                <td className="px-6 py-4 text-gray-600">{row.desa}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">Belum Ada</td>
                <td className="px-6 py-4 font-semibold text-gray-800">Belum Ada</td>
                <td className="px-6 py-4 text-center font-bold">
                  <span className={
                    row.statusLahan === 'Sangat Kritis' ? 'text-red-500' :
                    row.statusLahan === 'Kritis' ? 'text-yellow-500' : 'text-green-600'
                  }>
                    {row.statusLahan}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-gray-800 font-medium">{row.skorCPI}</td>
                <td className="px-6 py-4 text-center text-[#185325] font-bold truncate max-w-50" title={row.rekomendasi}>
                  {row.rekomendasi}
                </td>
                <td className="px-6 py-4 text-center text-[#185325] font-bold truncate max-w-50" title={row.rekomendasi}>
                  {row.statusVerifikasi}
                </td>
                <td><button className='px-2 py-1 bg-[#185325] flex text-center items-center justify-center m-auto text-white rounded-md'>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CPITable;