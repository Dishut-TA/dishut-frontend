import React from 'react';
import { HiOutlineDocumentText, HiOutlineCloudArrowUp, HiOutlinePhoto, HiOutlineEye } from 'react-icons/hi2';
import StatusBadgeKegiatan from './StatusBadgeKegiatan';
import type { KegiatanData, ModalType } from '../PelaksanaanKegiatan';

interface KegiatanTableProps {
  data: KegiatanData[];
  isLoading: boolean;
  onOpenModal: (type: ModalType, data: KegiatanData) => void;
}

const KegiatanTable: React.FC<KegiatanTableProps> = ({ data, isLoading, onOpenModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
              <th className="px-6 py-4 whitespace-nowrap">ID Donasi</th>
              <th className="px-6 py-4 whitespace-nowrap">Nama Donatur</th>
              <th className="px-6 py-4 whitespace-nowrap">Program</th>
              <th className="px-6 py-4 whitespace-nowrap">Jenis & Jumlah Bibit</th>
              <th className="px-6 py-4 whitespace-nowrap">Status Saat Ini</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Dokumen Administrasi</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Rincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
                    <p>Memuat data kegiatan...</p>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">{row.idDonasi}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{row.namaDonatur}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#185325] whitespace-nowrap">{row.program}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 max-w-50">
                      {row.rincianBibit.map((bibit, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-700">{bibit.nama}</span>
                          <span className="font-bold text-[#2E7D32]">{bibit.jumlah} Batang</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <StatusBadgeKegiatan status={row.status} />
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col items-center justify-center gap-2 w-full max-w-40 mx-auto">
                      {row.bastUrl ? (
                        <a href={row.bastUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-[#f0f9f3] border border-[#C8E0CD] hover:bg-[#e2f1e6] text-[#185325] text-[11px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
                          <HiOutlineDocumentText className="w-4 h-4" /> BAST Disimpan
                        </a>
                      ) : (
                        <button onClick={() => onOpenModal('uploadBAST', row)} className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-[#185325] hover:bg-[#123d1c] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
                          <HiOutlineCloudArrowUp className="w-4 h-4" /> Upload BAST
                        </button>
                      )}

                      {row.buktiTanamUrl ? (
                        <a href={row.buktiTanamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-[11px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
                          <HiOutlinePhoto className="w-4 h-4" /> Bukti Penanaman
                        </a>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-medium rounded-lg text-center leading-tight">
                          Menunggu integrasi tanam
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="flex items-center justify-center">
                      <button onClick={() => onOpenModal('rincian', row)} title="Lihat Rincian Dana" className="p-2 text-gray-400 hover:text-[#185325] hover:bg-[#f0f9f3] rounded-lg transition-colors cursor-pointer">
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">Belum ada data pelaksanaan kegiatan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KegiatanTable;