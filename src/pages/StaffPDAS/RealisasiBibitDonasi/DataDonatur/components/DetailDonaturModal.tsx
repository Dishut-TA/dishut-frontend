import type { DonaturData, StatusType } from '@/utils/interface'; 
import React, { useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

interface DetailDonaturModalProps {
  isOpen: boolean;
  onClose: () => void;
  donatur: DonaturData | null;
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

const StatusBadgeModal = ({ status }: { status: StatusType }) => {
  const isPending = status === 'Menunggu Verifikasi';
  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${isPending ? 'bg-[#F2C94C] text-gray-800' : 'bg-[#e2f1e6] text-[#185325]'}`}>
      {status}
    </span>
  );
};

const DetailDonaturModal: React.FC<DetailDonaturModalProps> = ({ isOpen, onClose, donatur }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !donatur) return null;

  const tanggal = donatur.tanggalDonasi || "10 Mei 2026";
  const nominalTotal = donatur.rincianBibit?.reduce((acc, curr) => acc + (curr.jumlah * curr.hargaSatuan), 0) || 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex-none flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Detail Donasi</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ID Transaksi</h3>
              <p className="text-sm font-semibold text-gray-800">{donatur.idTransaksi}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Donasi</h3>
              <p className="text-sm font-semibold text-gray-800">{tanggal}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Donatur</h3>
              <p className="text-sm font-semibold text-gray-800">{donatur.namaDonatur}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h3>
              <div className="-ml-1"><StatusBadgeModal status={donatur.status} /></div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Program Tujuan</h3>
            <p className="text-sm font-bold text-[#185325]">{donatur.program}</p>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Rincian Pembelian Bibit</h3>
            </div>
            <div className="px-4 py-2 divide-y divide-gray-100">
              {donatur.rincianBibit?.map((bibit, index) => (
                <div key={index} className="py-3 flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Bibit {bibit.nama}</span>
                    <span className="text-xs text-gray-500">{bibit.jumlah} pcs x {formatRupiah(bibit.hargaSatuan)}</span>
                  </div>
                  <span className="font-bold text-gray-700">{formatRupiah(bibit.jumlah * bibit.hargaSatuan)}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#f0f9f3] px-4 py-3 border-t border-[#e2f1e6] flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#3A4D3F] font-semibold">Total Bibit:</span>
                <span className="font-bold text-[#185325]">{donatur.jumlahBibit} Pcs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#3A4D3F] font-semibold">Total Nominal:</span>
                <span className="font-bold text-[#185325] text-lg">{formatRupiah(nominalTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bukti Pembayaran</h3>
            {donatur.proof_url ? (
              <a 
                href={donatur.proof_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-40 bg-slate-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer group overflow-hidden relative"
              >
                <img 
                  src={donatur.proof_url} 
                  alt="Bukti Transfer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-lg">
                    Klik untuk memperbesar
                  </span>
                </div>
              </a>
            ) : (
              <div className="w-full h-24 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs italic">
                Tidak ada bukti transfer yang diunggah.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailDonaturModal;