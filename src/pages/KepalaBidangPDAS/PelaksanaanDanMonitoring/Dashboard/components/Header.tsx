import { HiOutlineBars3, HiOutlineBell, HiOutlineGlobeAlt } from 'react-icons/hi2';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <HiOutlineBars3 className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer">
          <HiOutlineBell className="w-6 h-6 text-gray-500" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
            <HiOutlineGlobeAlt className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">Kepala Bidang PDAS</p>
            <p className="text-[11px] text-gray-500 leading-none">PDAS Citarum</p>
          </div>
        </div>
      </div>
    </header>
  );
}