import React from 'react';
import { HiXMark } from 'react-icons/hi2';
import type { CPIDataRow } from '../types';

interface DetailVerifikasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CPIDataRow | null;
}

const DetailVerifikasiModal: React.FC<DetailVerifikasiModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Detail Analisis CPI</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-all">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-medium text-gray-500 mb-1">Kabupaten/Kota</span>
              <span className="block text-sm font-semibold text-gray-800">{data.kabupaten}</span>
            </div>
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-medium text-gray-500 mb-1">Kecamatan</span>
              <span className="block text-sm font-semibold text-gray-800">{data.kecamatan}</span>
            </div>
            <div className="col-span-2 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-medium text-gray-500 mb-1">Desa</span>
              <span className="block text-sm font-semibold text-gray-800">{data.desa}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <span className="block text-xs font-medium text-amber-700 mb-1">Status Kekritisan</span>
              <span className="block text-sm font-bold text-amber-900">{data.statusKekritisan}</span>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="block text-xs font-medium text-blue-700 mb-1">Skor CPI</span>
              <span className="block text-sm font-bold text-blue-900">{data.skorCPI}</span>
            </div>
          </div>

          <div className="bg-[#185325]/5 p-4 rounded-xl border border-[#185325]/20">
            <span className="block text-xs font-medium text-[#185325] mb-1">Rekomendasi Intervensi</span>
            <span className="block text-sm font-semibold text-gray-800 whitespace-normal leading-relaxed">{data.rekomendasi}</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <span className="block text-xs font-bold text-emerald-800 mb-2">Rekomendasi Tanaman Rehabilitasi</span>
            {data.rekomendasiTanaman.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.rekomendasiTanaman.map((plant) => (
                  <span key={plant} className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs font-semibold text-emerald-800">
                    {plant}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">Belum tersedia.</span>
            )}

            {data.rekomendasiTanamanRule && (
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">Rule:</span> {data.rekomendasiTanamanRule.code || '-'} {data.rekomendasiTanamanRule.wilayah ? `• ${data.rekomendasiTanamanRule.wilayah}` : ''}</p>
                {data.rekomendasiTanamanRule.kategori && <p><span className="font-semibold">Kategori:</span> {data.rekomendasiTanamanRule.kategori}</p>}
                {data.rekomendasiTanamanRule.fungsi_rhl && <p><span className="font-semibold">Fungsi RHL:</span> {data.rekomendasiTanamanRule.fungsi_rhl}</p>}
              </div>
            )}

            {data.rekomendasiTanamanAlasan && (
              <p className="mt-3 pt-3 border-t border-emerald-100 text-xs leading-relaxed text-gray-600">
                <span className="font-semibold text-gray-700">Dasar rule:</span> {data.rekomendasiTanamanAlasan}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVerifikasiModal;
