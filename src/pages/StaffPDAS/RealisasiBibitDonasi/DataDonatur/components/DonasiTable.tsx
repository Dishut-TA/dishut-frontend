import React from 'react';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2';
import StatusBadge from './StatusBadge';
import type { DonaturData } from '@/utils/interface';

interface DonasiTableProps {
  data: DonaturData[];
  isLoading: boolean;
  onVerify: (donatur: DonaturData) => void;
  onViewDetail: (donatur: DonaturData) => void;
  onDelete: (donatur: DonaturData) => void;
}

const DonasiTable: React.FC<DonasiTableProps> = ({ data, isLoading, onVerify, onViewDetail, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4 whitespace-nowrap">ID Donasi</th>
              <th className="px-6 py-4 whitespace-nowrap">Nama Donatur</th>
              <th className="px-6 py-4 whitespace-nowrap">Program</th>
              <th className="px-6 py-4 whitespace-nowrap">Jenis Bibit</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Jumlah</th>
              <th className="px-6 py-4 whitespace-nowrap">Status Bibit</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
                    <p className="text-sm font-bold text-gray-500">Memuat data donasi dari server...</p>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{row.idDonasi}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">{row.namaDonatur}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{row.program}</td>

                  <td className="px-6 py-4 max-w-50">
                    <div className="flex flex-wrap gap-1.5">
                      {row.rincianBibit?.map((bibit, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-[11px] font-medium whitespace-nowrap shadow-sm">
                          {bibit.nama}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-[#2E7D32] text-center whitespace-nowrap">
                    {row.jumlahBibit}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center gap-3">
                    {(row.status === 'Menunggu Verifikasi' || row.status === 'Pending') ? (
                      <button
                        onClick={() => onVerify(row)}
                        className="px-4 py-1.5 bg-[#185325] text-white text-xs font-bold rounded-full hover:bg-[#163f1f] transition-colors shadow-sm cursor-pointer"
                      >
                        Verifikasi Data
                      </button>
                    ) : (
                      <div className='gap-2 flex'>
                        <button
                          onClick={() => onViewDetail(row)}
                          title="Lihat Detail"
                          className="p-2 border border-gray-200 rounded-full text-gray-500 hover:text-[#2E7D32] hover:bg-green-50 transition-colors cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          title="Hapus"
                          className="p-2 border border-gray-200 rounded-full text-gray-500 hover:text-[#7d2e2e] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>

                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  Data donasi tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonasiTable;