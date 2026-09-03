import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (alasan: string) => void;
}

const RevisionModal: React.FC<RevisionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [alasan, setAlasan] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative p-6 text-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#185325]">Buat Revisi</h2>
          <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-700">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Tulis keterangan perubahan"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] resize-none"
          />
          <button 
            onClick={() => onSubmit(alasan)}
            className="w-full mt-6 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-xl transition-colors"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;