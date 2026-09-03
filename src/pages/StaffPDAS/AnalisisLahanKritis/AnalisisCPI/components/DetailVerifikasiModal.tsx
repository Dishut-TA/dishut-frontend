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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-6 pb-2">
          <p className="text-sm font-semibold text-gray-700">
            Ini harusnya detail verifikasi tapi blom dibikin
          </p>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kabupaten/Kota</label>
            <input type="text" readOnly value={data.kabupaten} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kecamatan</label>
            <input type="text" readOnly value={data.kecamatan} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Desa</label>
            <input type="text" readOnly value={data.desa} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Kekritisan</label>
            <input type="text" readOnly value={data.statusKekritisan} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Skor CPI</label>
            <input type="text" readOnly value={data.skorCPI} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Rekomendasi Intervensi</label>
            <input type="text" readOnly value={data.rekomendasi} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none" />
          </div>
          
          <button 
            type="button" 
            onClick={onClose} // Sesuai mockup, ini tombol submit tapi kita fungsikan tutup dulu
            className="w-full mt-4 bg-[#185325] hover:bg-[#123d1c] text-white py-3 rounded-full text-sm font-bold transition-colors active:scale-95 shadow-md"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailVerifikasiModal;