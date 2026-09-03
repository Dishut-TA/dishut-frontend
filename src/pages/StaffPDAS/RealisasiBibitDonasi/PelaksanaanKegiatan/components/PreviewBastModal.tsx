import React, { useEffect } from 'react';
import { HiOutlineXMark, HiOutlinePrinter } from 'react-icons/hi2';

interface PreviewBastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreviewBastModal: React.FC<PreviewBastModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-150 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Preview Draft BAST</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary hover:bg-[#144a18] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <HiOutlinePrinter className="w-4 h-4" />
              Cetak PDF
            </button>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-center">
          <div className="w-full max-w-100 h-112.5 bg-[#D9D9D9] rounded shadow-sm border border-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">Area Dokumen PDF</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewBastModal;