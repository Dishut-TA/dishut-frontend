import React from 'react';
import { HiOutlineDocumentText, HiOutlinePencilSquare } from 'react-icons/hi2';
import type { PetakUkur } from '../types';

interface TableDataPetakUkurProps {
  mockStatus: string;
  hasCalculated: boolean;
  dataPetakUkur: PetakUkur[];
  hitungPersenPerPU: (rencana: number, tumbuh: number) => string;
}

const TableDataPetakUkur: React.FC<TableDataPetakUkurProps> = ({
  mockStatus,
  hasCalculated,
  dataPetakUkur,
  hitungPersenPerPU
}) => {

  const groupedData = dataPetakUkur.reduce((acc, curr, originalIndex) => {
    if (!acc[curr.periode]) acc[curr.periode] = [];
    acc[curr.periode].push({ ...curr, originalIndex });
    return acc;
  }, {} as Record<string, (PetakUkur & { originalIndex: number })[]>);

  return (
    <div className="mb-8 animate-in fade-in duration-500">
      
      {/* Tabel 1: Data Modul Pelaksanaan & Monitoring */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5 text-gray-500" />
          {mockStatus === 'HASIL TERVALIDASI' ? 'Lampiran 1: Data Dasar Monitoring' : '1. Data Modul Pelaksanaan & Monitoring'}
        </h3>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm mb-8">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] font-bold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center border-r border-gray-200">Periode & PU</th>
              <th className="px-4 py-3 text-center">Rencana (Target Tanam)</th>
              <th className="px-4 py-3 text-center border-x border-gray-200">Realisasi Tumbuh (Monitoring)</th>
              <th className="px-4 py-3 text-center">Tinggi Rata-rata (Monitoring)</th>
              <th className="px-4 py-3 text-center border-l border-gray-200">Kondisi Lahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Object.entries(groupedData).map(([periode, items]) => {
              return items.map((item, _idx) => {
                const globalIndex = item.originalIndex;
                return (
                  <tr key={`mon-${globalIndex}`} className="hover:bg-[#EBF8F1]/30 transition-colors">
                    <td className="px-4 py-3 text-center align-middle border-r border-gray-200 bg-gray-50/30">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                            <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
                                {periode}
                            </span>
                            <span className="text-xs text-gray-600 font-bold">{item.pu}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-center bg-[#EBF8F1]/20 font-semibold text-gray-800">
                      {item.rencana} Pohon
                    </td>
                    <td className="px-4 py-3 text-center border-x border-gray-100 font-semibold text-gray-800 bg-[#EBF8F1]/20">
                      {item.monitoringTumbuh || '-'} Pohon
                    </td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium bg-[#EBF8F1]/20">
                      {item.rencanaTinggi} cm
                    </td>
                    <td className="px-4 py-3 text-center border-l border-gray-100 text-gray-700 bg-[#EBF8F1]/20">
                      {item.kondisiLahan || '-'}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* Tabel 2: Hasil Modul Evaluasi Lapangan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 mt-10">
        <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider flex items-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5 text-[#185325]" />
          {mockStatus === 'HASIL TERVALIDASI' ? 'Lampiran 2: Data Evaluasi' : '2. Hasil Modul Evaluasi Lapangan (Faktual)'}
        </h3>
        {!hasCalculated && (
          <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <HiOutlinePencilSquare className="w-4 h-4 shrink-0" /> Sesuaikan data realisasi jika terdapat perubahan faktual.
          </span>
        )}
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] font-bold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center border-r border-gray-200">Periode & PU</th>
              <th className="px-4 py-3 text-center">Tanaman Hidup (Faktual)</th>
              <th className="px-4 py-3 text-center border-x border-gray-200">% Tumbuh</th>
              <th className="px-4 py-3 text-center">Tinggi Rata-rata (Faktual)</th>
              <th className="px-4 py-3 border-l border-gray-200">Kondisi Lahan</th>
              <th className="px-4 py-3">Titik Koordinat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Object.entries(groupedData).map(([periode, items]) => {
              return items.map((item, _idx) => {
                const globalIndex = item.originalIndex;
                const persen = hitungPersenPerPU(item.rencana, item.tumbuh);
                const isLulus = parseFloat(persen) >= 75;

                return (
                  <tr key={`eval-${globalIndex}`} className="hover:bg-[#EBF8F1]/30 transition-colors">
                    <td className="px-4 py-3 text-center align-middle border-r border-gray-200 bg-gray-50/30">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                            <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
                                {periode}
                            </span>
                            <span className="text-xs text-gray-600 font-bold">{item.pu}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-center bg-[#EBF8F1]/20 font-semibold text-gray-800">
                      {item.tumbuh} Pohon
                    </td>
                    <td className="px-4 py-3 text-center border-x border-gray-100 bg-gray-50/30">
                      <span className={`font-bold ${isLulus ? 'text-[#00A859]' : 'text-red-500'}`}>{persen}%</span>
                    </td>
                    <td className="px-4 py-3 text-center bg-[#EBF8F1]/20 font-semibold text-gray-800">
                      {item.tinggi} cm
                    </td>
                    <td className="px-4 py-3 border-l border-gray-100 font-medium text-gray-700">
                      {item.kondisiLahan || '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {item.koordinat || '-'}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default TableDataPetakUkur;