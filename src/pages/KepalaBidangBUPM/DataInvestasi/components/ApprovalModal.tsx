import React from 'react';
import { HiXMark } from 'react-icons/hi2';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-700">
          <HiXMark className="w-6 h-6" />
        </button>
        
        <div className="text-center mt-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#185325] mb-4">
            Apakah Anda Yakin Ingin Menyetujui Investasi Ini?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Investasi yang telah disetujui akan secara otomatis muncul di laman pengguna. <strong className="text-gray-700">Harap periksa secara teliti untuk memastikan bahwa seluruh informasi dan data yang dibuat telah sesuai.</strong> Pastikan semua dokumen dan persyaratan telah terpenuhi sebelum melakukan konfirmasi akhir.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              Periksa Kembali
            </button>
            <button 
              onClick={onConfirm}
              className="w-full sm:w-auto px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full transition-colors shadow-md"
            >
              Setujui Investasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;