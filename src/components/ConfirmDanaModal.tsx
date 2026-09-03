import React from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

interface ConfirmDanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    namaProyek: string;
    pihakPendana: string;
    nominal: string;
  } | null;
}

const ConfirmDanaModal: React.FC<ConfirmDanaModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        <div className="p-8 pb-6">
          <h2 className="text-xl font-bold text-[#185325] mb-1">Pemberitahuan Penyaluran Dana CSR</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sistem mendeteksi adanya transfer masuk dari Mitra CSR Anda
          </p>

          <div className="space-y-3 text-sm mb-8">
            <div className="flex items-start">
              <span className="w-32 text-gray-600 font-medium shrink-0">Nama Proyek</span>
              <span className="w-4 text-gray-600">:</span>
              <span className="font-bold text-gray-800">{data.namaProyek}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600 font-medium shrink-0">Pihak Pendana</span>
              <span className="w-4 text-gray-600">:</span>
              <span className="font-bold text-gray-800">{data.pihakPendana}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600 font-medium shrink-0">Total Nominal</span>
              <span className="w-4 text-gray-600">:</span>
              <span className="font-bold text-gray-800">{data.nominal}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed text-justify mb-8">
            Silakan pastikan dana tersebut sudah masuk ke rekening bank kelompok Anda sebelum memulai pengerjaan fisik di lapangan.
          </p>

          <div className="flex justify-end">
            <button 
              onClick={onConfirm}
              className="px-8 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-sm"
            >
              Konfirmasi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDanaModal;