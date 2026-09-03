import React from 'react';
import { HiOutlineArrowTrendingUp, HiOutlineChevronRight } from 'react-icons/hi2';
import { parsePenugasan, computeProgress } from '../utils';

interface Props {
  penugasans: any[];
}

const STATUS_STYLES: Record<string, string> = {
  'Menunggu Verifikasi': 'bg-orange-50 text-orange-600',
  'Berjalan': 'bg-emerald-50 text-emerald-600',
  'Selesai': 'bg-blue-50 text-blue-600',
  'Dihentikan': 'bg-red-50 text-red-600',
};

const ProgressKegiatan: React.FC<Props> = ({ penugasans }) => {
  const items = penugasans
    .filter(p => p.status === 'Berjalan' || p.status === 'Menunggu Verifikasi')
    .map(p => {
      const info = parsePenugasan(p);
      return { ...info, progress: computeProgress(info) };
    })
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
        <HiOutlineArrowTrendingUp className="w-5 h-5 text-emerald-600" />
        <h3>Progress Kegiatan</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 flex-1 flex items-center justify-center">Belum ada kegiatan berjalan</p>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center mb-1.5 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{item.programName}</p>
                  <p className="text-[11px] text-gray-400">{item.jenisKegiatan}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
                  {item.status}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${item.progress.percent ?? 0}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {item.progress.percent !== null ? `${item.progress.percent}% — ${item.progress.label}` : item.progress.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <button className="text-emerald-600 text-xs font-bold flex items-center gap-1 mt-4 hover:underline w-fit">
        Lihat Semua Progress <HiOutlineChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ProgressKegiatan;