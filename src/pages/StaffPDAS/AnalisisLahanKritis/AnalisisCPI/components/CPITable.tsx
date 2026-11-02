import React, { useState, useEffect } from 'react';
import type { CPIDataRow } from '../types';
import { HiOutlineEye, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface CPITableProps {
  data: CPIDataRow[];
  onViewDetail: (row: CPIDataRow) => void;
}

const ITEMS_PER_PAGE = 5;

const CPITable: React.FC<CPITableProps> = ({ data, onViewDetail }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset ke halaman 1 saat data berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-250 text-sm text-center whitespace-nowrap">
          <thead className="text-[#3A4D3F] bg-[#DCECE0]">
            <tr>
              <th className="px-4 py-4 font-bold">Kabupaten/Kota</th>
              <th className="px-4 py-4 font-bold">Kecamatan</th>
              <th className="px-4 py-4 font-bold">Desa</th>
              <th className="px-4 py-4 font-bold">Status Kekritisan</th>
              <th className="px-4 py-4 font-bold">Skor CPI</th>
              <th className="px-4 py-4 font-bold">Rekomendasi Intervensi</th>
              <th className="px-4 py-4 font-bold">Rekomendasi Tanaman</th>
              <th className="px-4 py-4 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={row.id ?? (startIndex + idx)} className="hover:bg-gray-50/50 transition-colors">
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
                  <td
                    className="px-4 py-4 text-emerald-800 font-semibold text-left max-w-xs truncate"
                    title={row.rekomendasiTanaman.length ? row.rekomendasiTanaman.join(', ') : 'Belum tersedia'}
                  >
                    {row.rekomendasiTanaman.length ? row.rekomendasiTanaman.join(', ') : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onViewDetail(row)}
                      className="p-1.5 text-gray-500 hover:text-[#185325] hover:bg-[#EBF8F1] rounded-full transition-colors active:scale-95 border border-gray-300"
                      title="Lihat detail"
                    >
                      <HiOutlineEye className="w-4 h-4 stroke-2" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Belum ada hasil analisis zonal. Silakan input data indikator GIS.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 px-6 py-4 border-t border-gray-100 bg-white gap-3">
        <div>
          Menampilkan <span className="font-bold text-gray-700">{data.length === 0 ? 0 : startIndex + 1}</span> -{' '}
          <span className="font-bold text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, data.length)}</span> dari{' '}
          <span className="font-bold text-gray-700">{data.length}</span> data
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((page, i) =>
            typeof page === 'number' ? (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'border border-[#185325] bg-[#EBF8F1] text-[#185325]'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
                ...
              </span>
            )
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CPITable;
