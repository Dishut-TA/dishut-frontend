import React from 'react';
import { HiOutlineCloud, HiOutlineCalendarDays, HiOutlineArrowRight, HiXMark } from 'react-icons/hi2';
import type { InvestasiFormState } from './index';

interface StepProps {
  data: InvestasiFormState;
  updateData: React.Dispatch<React.SetStateAction<InvestasiFormState>>;
  onNext: () => void;
}

const Step1: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const handleTargetFundingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    updateData({ ...data, targetFunding: rawValue });
  };

  const formatDisplayRupiah = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(Number(value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateData({ ...data, coverFile: file });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Proyek</label>
        {data.coverFile ? (
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src={URL.createObjectURL(data.coverFile)} 
                alt="Preview" 
                className="w-12 h-12 object-cover rounded-xl border border-gray-200" 
              />
              <span className="text-xs font-medium text-gray-700 truncate">{data.coverFile.name}</span>
            </div>
            <button 
              onClick={() => updateData({ ...data, coverFile: null })}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-500 transition-colors">
            <HiOutlineCloud className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs font-semibold">Upload gambar cover</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>

      <Input label="Nama Investasi" name="namaInvestasi" placeholder="Masukan nama investasi" value={data.namaInvestasi} onChange={handleChange} />
      
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama KTH</label>
        <input 
          type="text" 
          value={data.namaKTH} 
          disabled 
          className="w-full px-4 py-3 text-sm bg-gray-100 border border-gray-300 rounded-full text-gray-600 font-semibold cursor-not-allowed outline-none" 
        />
      </div>
      
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Funding</label>
        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325]">
          <span className="pl-4 pr-2 text-sm font-bold text-gray-500 bg-gray-50/50 py-3">Rp.</span>
          <input 
            type="text" 
            placeholder="0" 
            value={formatDisplayRupiah(data.targetFunding)} 
            onChange={handleTargetFundingChange}
            className="w-full px-4 py-3 text-sm outline-none bg-transparent" 
          />
        </div>
      </div>

      <Input label="Persentase Keuntungan" name="persentase" placeholder="0" value={data.persentase} onChange={handleChange} suffix="%" type="number" />
      
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Batas Pengumpulan Dana</label>
        <div className="relative">
          <input type="date" name="batasWaktu" value={data.batasWaktu} onChange={handleChange} className="w-full pl-4 pr-10 py-3 text-sm border border-gray-300 rounded-full focus:ring-1 focus:ring-[#185325] outline-none" />
          <HiOutlineCalendarDays className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi</label>
        <textarea name="deskripsi" placeholder="Tulis keterangan investasi..." value={data.deskripsi} onChange={handleChange} className="w-full p-4 h-28 text-sm border border-gray-300 rounded-3xl focus:ring-1 focus:ring-[#185325] outline-none resize-none" />
      </div>

      <button onClick={onNext} className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors cursor-pointer">
        Selanjutnya <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
      </button>
    </div>
  );
};

const Input = ({ label, prefix, suffix, ...props }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
    <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325]">
      {prefix && <span className="pl-4 pr-2 text-sm font-bold text-gray-500 bg-gray-50/50 py-3">{prefix}</span>}
      <input className="w-full px-4 py-3 text-sm outline-none bg-transparent" {...props} />
      {suffix && <span className="pr-4 pl-2 text-sm font-bold text-gray-800 bg-gray-50/50 py-3">{suffix}</span>}
    </div>
  </div>
);

export default Step1;