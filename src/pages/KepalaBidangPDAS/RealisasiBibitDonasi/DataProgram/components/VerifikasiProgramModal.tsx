import type { ProgramData } from '@/utils/interface';
import React, { useEffect } from 'react';
import { HiOutlineXMark, HiCheckCircle, HiXCircle } from 'react-icons/hi2';

interface VerifikasiProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramData | null;
  onSetuju: (id: string) => void;
  onTolak: (id: string) => void;
}

const VerifikasiProgramModal: React.FC<VerifikasiProgramModalProps> = ({ 
  isOpen, onClose, program, onSetuju, onTolak 
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Verifikasi Program</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Validasi pengajuan program <span className="font-bold text-gray-900">"{program.nama}"</span>:
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 space-y-3">
            {program.description && (
              <div className="flex flex-col gap-1 text-sm border-b border-gray-200 pb-3 mb-1">
                <span className="text-gray-500 font-semibold">Deskripsi Program</span>
                <span className="text-gray-800 leading-relaxed">{program.description}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Lokasi Penanaman</span>
              <span className="text-gray-800 font-bold">{program.lokasi}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Bibit Terkumpul</span>
              <span className="text-[#009262] font-bold">{program.terkumpul} Bibit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Bibit Terealisasi</span>
              <span className="text-[#185325] font-bold">{program.totalTerealisasi} Bibit</span>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <span className="block text-xs font-bold text-gray-500 uppercase mb-2">Jenis Bibit Disetujui</span>
              <div className="flex flex-wrap gap-1.5">
                 {program.jenisBibit?.map((bibit: any, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold shadow-sm">
                      {bibit.nama || bibit}
                    </span>
                 ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onSetuju(program.id)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#009262] hover:bg-[#007a52] text-white text-sm font-bold rounded-full transition-all shadow-md shadow-[#009262]/20 active:scale-95 cursor-pointer"
            >
              <HiCheckCircle className="w-5 h-5" />
              Setujui (Program Sesuai Ketentuan)
            </button>

            <button 
              onClick={() => onTolak(program.id)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-sm font-bold rounded-full transition-all active:scale-95 cursor-pointer"
            >
              <HiXCircle className="w-5 h-5" />
              Tolak (Program Tidak Sesuai Ketentuan)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifikasiProgramModal;