import React, { useState } from 'react';
import { HiXMark, HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface HentikanPendanaanModalProps {
  isOpen: boolean;
  namaProgram: string;
  persentaseTumbuh: number | null;
  ambangBatas: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (alasan: string) => void;
}

const HentikanPendanaanModal: React.FC<HentikanPendanaanModalProps> = ({
  isOpen,
  namaProgram,
  persentaseTumbuh,
  ambangBatas,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [alasan, setAlasan] = useState('');

  if (!isOpen) return null;

  const alasanValid = alasan.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative p-6 text-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-red-600">Hentikan Pendanaan</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 disabled:opacity-40"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 p-4 mb-5 bg-red-50 border border-red-100 rounded-xl">
            <HiOutlineExclamationTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div className="text-sm text-red-800 leading-relaxed">
              Hasil evaluasi <span className="font-bold">{namaProgram}</span> menunjukkan
              persentase tumbuh{' '}
              <span className="font-bold">
                {persentaseTumbuh !== null ? `${persentaseTumbuh}%` : '-'}
              </span>
              , di bawah ambang batas {ambangBatas}%. Menghentikan pendanaan juga akan
              menghentikan proses monitoring program ini dan tindakan ini tidak dapat
              dibatalkan dari halaman ini.
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alasan Penghentian <span className="text-red-600">*</span>
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Tulis alasan penghentian pendanaan (minimal 5 karakter)"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              Batal
            </button>
            <button
              onClick={() => onSubmit(alasan.trim())}
              disabled={!alasanValid || isSubmitting}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Hentikan Pendanaan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HentikanPendanaanModal;
