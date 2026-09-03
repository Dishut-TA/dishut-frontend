import { HiOutlineChartPie } from 'react-icons/hi2';
import { PiPlant, PiTree, PiLeaf } from 'react-icons/pi';

interface SummaryCardsProps {
  stats: any;
  monStats: any;
  isLoading: boolean;
}

export default function SummaryCards({ stats, isLoading }: SummaryCardsProps) {
  const totalProgram = stats.total_program || 0;
  const berjalan = stats.berjalan || 0;
  const selesai = stats.selesai || 0;
  const totalTargetBibit = stats.total_target_bibit || 0;
  const totalRealisasiBibit = stats.total_realisasi_bibit || 0;
  const persentase = stats.persentase_realisasi || 0;

  const formatNumber = (n: number) => n.toLocaleString('id-ID');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col relative h-30">
        <div className="flex items-center w-full flex-1">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <PiLeaf className="w-6 h-6 text-green-700" />
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <p className="text-[11px] font-bold text-gray-600 mb-0.5">Total Program</p>
            <p className="text-3xl font-bold text-[#0f172a] leading-none">{isLoading ? '...' : formatNumber(totalProgram)}</p>
            <p className="text-[10px] text-gray-400 mt-1">Program</p>
          </div>
        </div>
        <div className="absolute bottom-3 left-5 text-[10px] font-medium text-gray-500 border-t border-gray-100 pt-2 w-[calc(100%-40px)] flex gap-2">
          <span>{berjalan} Berjalan</span> <span>•</span> <span>{selesai} Selesai</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center h-30">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
          <PiTree className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <p className="text-[11px] font-bold text-gray-600 mb-0.5">Total Target Tanaman</p>
          <p className="text-3xl font-bold text-[#0f172a] leading-none">{isLoading ? '...' : formatNumber(totalTargetBibit)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Pohon</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center h-30">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <PiPlant className="w-6 h-6 text-purple-700" />
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <p className="text-[11px] font-bold text-purple-800 mb-0.5">Total Realisasi Tanaman</p>
          <p className="text-3xl font-bold text-[#0f172a] leading-none">{isLoading ? '...' : formatNumber(totalRealisasiBibit)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Pohon</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center h-30">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <HiOutlineChartPie className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <p className="text-[11px] font-bold text-blue-800 mb-0.5">Persentase Realisasi</p>
          <p className="text-3xl font-bold text-[#0f172a] leading-none">{isLoading ? '...' : `${persentase}%`}</p>
          <p className="text-[10px] text-gray-400 mt-1">dari Target</p>
        </div>
      </div>
    </div>
  );
}