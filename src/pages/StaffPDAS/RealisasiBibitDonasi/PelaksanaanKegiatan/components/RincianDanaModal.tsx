import React, { useEffect } from 'react';
import { HiOutlineBanknotes, HiOutlineXMark } from 'react-icons/hi2';
import StatusBadgeKegiatan from './StatusBadgeKegiatan';
import type { KegiatanData } from '../PelaksanaanKegiatan';

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(number);
};

interface RincianDanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KegiatanData | null;
}

const RincianDanaModal: React.FC<RincianDanaModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const totalDana = data.rincianBibit?.reduce((acc, curr) => {
    const jumlah = Number(curr.jumlah) || 0;
    const harga = Number(curr.hargaSatuan) || 0;
    return acc + (jumlah * harga);
  }, 0) || 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Rincian Alokasi Dana</h2>
            <StatusBadgeKegiatan status={data.status} />
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-1">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Donatur</span>
              <span className="font-bold text-gray-800 text-base">{data.namaDonatur}</span>
            </div>

            <div className="bg-[#e2f1e6] rounded-xl p-4 border border-[#C8E0CD] flex flex-col gap-1">
              <span className="text-[#3A4D3F] text-xs font-bold uppercase tracking-wider">Jumlah Total</span>
              <span className="font-bold text-[#185325] text-base">{data.jumlahBibit} Bibit</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-sm">Alokasi Pembelanjaan Bibit (100%)</h3>
            </div>
            
            <div className="px-5 py-2">
              <div className="divide-y divide-gray-100">
                {data.rincianBibit?.map((bibit, index) => {
                  const jumlah = Number(bibit.jumlah) || 0;
                  const harga = Number(bibit.hargaSatuan) || 0;
                  const subTotal = jumlah * harga;

                  return (
                    <div key={index} className="py-3 flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">Bibit {bibit.nama}</span>
                        <span className="text-xs text-gray-500">{jumlah} x {formatRupiah(harga)}</span>
                      </div>
                      <span className="font-bold text-gray-700">{formatRupiah(subTotal)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#f0f9f3] px-5 py-4 border-t border-[#e2f1e6] flex justify-between items-center">
              <span className="text-sm font-bold text-[#185325]">Total Donasi Terkumpul:</span>
              <span className="text-lg font-bold text-[#185325]">{formatRupiah(totalDana)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100">
            <HiOutlineBanknotes className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium text-center">
              Dana dijamin tersalurkan 100% untuk program tanpa potongan biaya platform.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RincianDanaModal;