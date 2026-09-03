import { HiOutlinePlus } from 'react-icons/hi2';

export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">Monitoring Program</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Monitoring Program Rehabilitasi</h1>
        <p className="text-sm text-slate-500">Halaman ini digunakan untuk memantau progres program rehabilitasi P0–P4 dan hasil evaluasinya.</p>
      </div>
      <button className="px-4 py-2.5 bg-[#008A4B] hover:bg-[#00753f] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0">
        <HiOutlinePlus className="w-4 h-4 stroke-[2.5]" /> Buat Penugasan Monitoring
      </button>
    </div>
  );
}