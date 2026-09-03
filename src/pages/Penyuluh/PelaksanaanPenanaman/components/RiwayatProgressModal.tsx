import React from 'react';
import { HiOutlineXMark, HiOutlineDocumentText } from 'react-icons/hi2';

interface RiwayatData {
  id: string;
  tanggal: string;
  bibitDitanam: number;
  koordinat: string;
  kondisi: string;
  kendala: string;
}

interface RiwayatProgresModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaProgram: string;
  riwayat: RiwayatData[];
}

const RiwayatProgresModal: React.FC<RiwayatProgresModalProps> = ({ isOpen, onClose, namaProgram, riwayat }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-gray-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-[#f8fbf9]">
          <h2 className="text-lg font-bold text-gray-800">
            Riwayat Progres: <span className="text-[#185325]">{namaProgram}</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {riwayat.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <HiOutlineDocumentText className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Belum ada laporan progres yang dikirim.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {riwayat.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#185325]/30 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                    <span className="text-sm font-bold text-gray-800">Tanggal: {item.tanggal}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-0.5">Bibit Ditanam</p>
                      <p className="font-bold text-gray-800">{item.bibitDitanam}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Koordinat</p>
                      <p className="font-bold text-[#185325]">{item.koordinat}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 mb-0.5">Kondisi Lapangan</p>
                      <p className="font-medium text-gray-800">{item.kondisi}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 mb-0.5">Kendala</p>
                      <p className="font-medium text-gray-800">{item.kendala || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RiwayatProgresModal;