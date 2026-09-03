import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';

export default function Filters() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
      <div className="relative flex-1 min-w-50">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari program / lokasi / KTH" 
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-slate-700 placeholder:text-slate-400 bg-white" 
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:flex gap-3 items-center">
        <div className="w-full lg:w-44">
          <label className="block text-[10px] font-medium text-slate-500 mb-1 lg:hidden">Status Monitoring</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer">
            <option>Semua Status</option>
          </select>
        </div>

        <div className="w-full lg:w-40">
          <label className="block text-[10px] font-medium text-slate-500 mb-1 lg:hidden">Periode</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer">
            <option>Semua Periode</option>
          </select>
        </div>

        <div className="w-full lg:w-44">
          <label className="block text-[10px] font-medium text-slate-500 mb-1 lg:hidden">Kabupaten</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer">
            <option>Semua Kabupaten</option>
          </select>
        </div>

        <div className="w-full lg:w-36">
          <label className="block text-[10px] font-medium text-slate-500 mb-1 lg:hidden">Tahun</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer">
            <option>Semua Tahun</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-white border border-[#008A4B] text-[#008A4B] hover:bg-emerald-50 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 h-9.5 mt-auto">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>
    </div>
  );
}