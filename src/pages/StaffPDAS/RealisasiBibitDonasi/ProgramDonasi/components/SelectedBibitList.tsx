import React from 'react';
import { HiOutlineCurrencyDollar, HiOutlineTrash } from 'react-icons/hi2';

interface BibitItem {
  spec_id: number;
  bibit_nama: string;
  min_height: number;
  max_height: number;
  price: number;
}

interface SelectedBibitListProps {
  bibits: BibitItem[];
  onRemove: (spec_id: number) => void;
}

const formatRupiah = (angka: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const SelectedBibitList: React.FC<SelectedBibitListProps> = ({ bibits, onRemove }) => {
  if (bibits.length === 0) return null;

  return (
    <div className="pt-6 border-t border-slate-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-4">
        <label className="block text-base font-bold text-slate-800">2. Daftar Bibit Terpilih</label>
      </div>

      <div className="space-y-3">
        {bibits.map((item, index) => (
          <div key={item.spec_id} className="flex items-center justify-between bg-slate-50 p-4 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 font-bold text-xs">
                {index + 1}
              </span>
              <div>
                <div className="font-bold text-slate-800">{item.bibit_nama}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Spesifikasi Tinggi: {item.min_height}cm - {item.max_height}cm
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 justify-end">
                  <HiOutlineCurrencyDollar className="w-3 h-3" /> Harga Satuan
                </div>
                <div className="text-sm font-bold text-[#009262]">{formatRupiah(item.price)}</div>
              </div>

              <button 
                type="button"
                onClick={() => onRemove(item.spec_id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Hapus Bibit"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedBibitList;