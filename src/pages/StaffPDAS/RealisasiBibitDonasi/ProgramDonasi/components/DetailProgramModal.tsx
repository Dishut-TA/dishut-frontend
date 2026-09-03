import type { ProgramData, StatusProgram } from '@/utils/interface';
import React, { useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

interface DetailProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramData | null;
}

const DetailProgramModal: React.FC<DetailProgramModalProps> = ({ 
  isOpen, 
  onClose, 
  program 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !program) return null;

  const getStatusStyle = (status: StatusProgram) => {
    switch (status) {
      case 'Aktif': return 'bg-[#2E7D32] text-white';
      case 'Selesai': return 'bg-gray-200 text-gray-600';
      case 'Menunggu Verifikasi': return 'bg-[#F2C94C] text-gray-800';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Detail Realisasi Program
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nama Program</h3>
              <p className="text-base font-bold text-gray-800">{program.nama}</p>
            </div>

            {program.description && (
              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Deskripsi Program</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lokasi</h3>
              <p className="text-sm font-medium text-gray-700">{program.lokasi}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h3>
              <span className={`inline-block px-4 py-1 text-[11px] font-bold rounded-full ${getStatusStyle(program.status)}`}>
                {program.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Rincian Realisasi Bibit</h3>
            <div className="flex flex-col gap-3">
              {program.jenisBibit && program.jenisBibit.length > 0 ? (
                program.jenisBibit.map((bibit, index) => {
                  const jumlah = Number(bibit.jumlah) || 0;
                  const terealisasi = Number(bibit.terealisasi) || 0;
                  const persentase = bibit.jumlah > 0 ? Math.round((bibit.terealisasi / bibit.jumlah) * 100) : 0;
                  
                  return (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">
                          {bibit.nama}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">
                            {formatNumber(terealisasi)} / {formatNumber(jumlah)}
                          </span>
                          <span className="bg-[#e2f1e6] text-[#185325] px-2 py-0.5 rounded text-[11px] font-bold">
                            {persentase}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar Visual */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#185325] h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${persentase}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="text-sm text-gray-400 italic">Belum ada jenis bibit yang ditentukan.</span>
              )}
            </div>
          </div>

        </div>

        {/* Footer Rangkuman */}
        <div className="flex-none bg-[#f0f9f3] p-6 border-t border-[#C8E0CD] flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex flex-col text-center md:text-left">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terkumpul</span>
             <span className="text-lg font-bold text-gray-700">{program.terkumpul} Bibit</span>
           </div>
           
           <div className="h-8 w-px bg-[#C8E0CD] hidden md:block"></div>
           
           <div className="flex flex-col text-center md:text-right">
             <span className="text-xs font-bold text-[#185325] uppercase tracking-wider">Total Terealisasi</span>
             <span className="text-2xl font-bold text-[#185325]">{program.totalTerealisasi} <span className="text-base font-bold">Bibit</span></span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DetailProgramModal;