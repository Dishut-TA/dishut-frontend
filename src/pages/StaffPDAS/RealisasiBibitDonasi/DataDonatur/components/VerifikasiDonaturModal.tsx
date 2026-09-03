import type { DonaturData } from '@/utils/interface'; // Sesuaikan
import React, { useEffect } from 'react';
import { HiOutlineXMark, HiCheckCircle, HiXCircle } from 'react-icons/hi2';

interface VerifikasiDonaturModalProps {
  isOpen: boolean;
  onClose: () => void;
  donatur: DonaturData | null;
  onTerima?: () => void; 
  onTolak?: () => void; 
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

const VerifikasiDonaturModal: React.FC<VerifikasiDonaturModalProps> = ({ 
  isOpen, onClose, donatur, onTerima, onTolak
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !donatur) return null;

  const nominalTotal = donatur.rincianBibit?.reduce((acc, curr) => acc + (curr.jumlah * curr.hargaSatuan), 0) || 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Verifikasi Donasi</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
          
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase">Pemohon</span>
              <span className="text-sm font-bold text-gray-800">{donatur.namaDonatur}</span>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-xs font-bold text-gray-500 uppercase mb-1">Program</span>
              <span className="text-sm font-bold text-primary leading-tight">{donatur.program}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rincian Pembelian</h3>
            <div className="space-y-2">
              {donatur.rincianBibit?.map((bibit, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                   <div className="flex flex-col">
                     <span className="font-bold text-gray-800">{bibit.nama} <span className="text-gray-400 font-normal">({bibit.jumlah} pcs)</span></span>
                   </div>
                   <span className="font-bold text-gray-700">{formatRupiah(bibit.jumlah * bibit.hargaSatuan)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center bg-primary text-white p-4 rounded-xl mt-2 shadow-md">
               <span className="text-sm font-medium">Total Nominal Transfer:</span>
               <span className="text-xl font-medium">{formatRupiah(nominalTotal)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bukti Pembayaran</h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-2 flex justify-center items-center">
              {donatur.proof_url || donatur.receipt_path ? (
                <img 
                  src={donatur.proof_url || donatur.receipt_path || ''} 
                  alt="Bukti Pembayaran" 
                  className="max-w-full max-h-60 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <span className="text-sm text-gray-400 py-6">Bukti pembayaran tidak tersedia</span>
              )}
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 px-4">
            Pastikan bukti transfer telah sesuai dengan total nominal yang tertera di atas.
          </p>

          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <button 
              onClick={onTerima}
              className="flex justify-center items-center gap-2 w-full py-3.5 bg-primary hover:bg-[#123d1c] text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-primary/20 active:scale-95"
            >
              <HiCheckCircle className="w-5 h-5" /> Terima (Pembayaran Valid)
            </button>
            <button 
              onClick={onTolak}
              className="flex justify-center items-center gap-2 w-full py-3.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-sm font-semibold rounded-full transition-all active:scale-95"
            >
              <HiXCircle className="w-5 h-5" /> Tolak (Pembayaran Tidak Valid)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VerifikasiDonaturModal;