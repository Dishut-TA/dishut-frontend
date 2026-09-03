import React from 'react';
import { HiOutlineEye } from 'react-icons/hi2';
import type { MappedBibitData } from '../IndexBibit';

interface BibitTableProps {
  data: MappedBibitData[];
  isLoading: boolean;
  onViewDetail: (id: string | number) => void;
}

const BibitTable: React.FC<BibitTableProps> = ({ data, isLoading, onViewDetail }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-[#DCECE0]/50 text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Kode Bibit</th>
              <th className="px-6 py-4">Nama Bibit</th>
              <th className="px-6 py-4">Tinggi Bibit</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Stok Bibit</th>
              <th className="px-6 py-4">Harga Satuan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
                    <p className="text-sm font-bold text-gray-500">Memuat data varian bibit...</p>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.kode}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{item.nama}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 max-w-xs truncate">{item.deskripsi}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{item.tinggiFormat}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.kategori.toLowerCase().includes("kehutanan") ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.totalStok} Batang</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#185325]">{item.hargaFormat}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <button
                      onClick={() => onViewDetail(item.id)}
                      className="p-2 text-gray-400 hover:text-[#185325] hover:bg-[#DCECE0] rounded-xl transition-all"
                      title="Lihat Detail"
                    >
                      <HiOutlineEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-sm font-bold text-gray-500">Tidak ada data bibit yang ditemukan.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BibitTable;