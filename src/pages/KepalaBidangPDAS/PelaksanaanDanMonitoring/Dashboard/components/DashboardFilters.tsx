import { HiOutlineCalendar, HiChevronDown, HiArrowPath } from 'react-icons/hi2';

export default function DashboardFilters() {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Ringkasan pelaksanaan Program Rehabilitasi DAS & Lahan.</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <HiOutlineCalendar className="w-4 h-4 text-gray-400" /> 01 Jan 2025 - 31 Mei 2025 <HiChevronDown className="w-4 h-4 text-gray-400 ml-2" />
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-48 justify-between">
            Semua Sumber Program <HiChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
          Data terakhir diperbarui: 11 Mei 2025 10:42 WIB <HiArrowPath className="w-3 h-3 cursor-pointer hover:text-gray-600" />
        </p>
      </div>
    </div>
  );
}