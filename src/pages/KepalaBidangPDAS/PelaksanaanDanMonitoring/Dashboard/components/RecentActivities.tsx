import { FiClock } from 'react-icons/fi';
import { ACTIVITIES } from '../data/mockData';

export default function RecentActivities({ }: { activities?: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 text-sm">Aktivitas Terbaru</h3>
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {ACTIVITIES.map((act, index) => (
          <div key={index} className="flex gap-3 shrink-0 w-72 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.bg}`}>
                {act.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-snug mb-1">{act.title}</p>
                <p className="text-[10px] text-gray-500 mb-1">Oleh {act.user}</p>
                <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {act.time}</p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}