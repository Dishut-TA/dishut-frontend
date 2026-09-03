import React from 'react';
import { 
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineChartBar
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

const statCards = [
  { title: 'Siap Monitoring', value: '12', desc: 'Program siap dimonitoring', trend: '↑ 3 dari bulan lalu', icon: PiPlant, color: 'text-emerald-600', bg: 'bg-emerald-50', trendColor: 'text-emerald-600 bg-emerald-100/50' },
  { title: 'Dalam Monitoring', value: '8', desc: 'Program dalam proses', trend: '↑ 2 dari bulan lalu', icon: HiOutlineCalendarDays, color: 'text-blue-600', bg: 'bg-blue-50', trendColor: 'text-blue-600 bg-blue-100/50' },
  { title: 'Menunggu Evaluasi', value: '6', desc: 'Hasil monitoring menunggu evaluasi', trend: '↑ 1 dari bulan lalu', icon: HiOutlineClipboardDocumentCheck, color: 'text-purple-600', bg: 'bg-purple-50', trendColor: 'text-purple-600 bg-purple-100/50' },
  { title: 'Perlu Tindak Lanjut', value: '5', desc: 'Program perlu tindak lanjut', trend: '↑ 2 dari bulan lalu', icon: HiOutlineExclamationTriangle, color: 'text-orange-500', bg: 'bg-orange-50', trendColor: 'text-orange-600 bg-orange-100/50' },
  { title: 'Monitoring Selesai', value: '14', desc: 'Program monitoring selesai', trend: '↑ 5 dari bulan lalu', icon: HiOutlineCheckCircle, color: 'text-[#185325]', bg: 'bg-[#DCECE0]', trendColor: 'text-[#185325] bg-[#DCECE0]/50' },
  { title: 'Total Program', value: '45', desc: 'APBD/CSR yang dimonitoring', trend: null, icon: HiOutlineChartBar, color: 'text-amber-500', bg: 'bg-amber-50', trendColor: '' },
];

const MonitoringStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-gray-800 leading-tight">{stat.title}</p>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-800 mb-1">{stat.value}</div>
            <p className="text-[10px] text-gray-400 mb-3 line-clamp-1">{stat.desc}</p>
            {stat.trend && (
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${stat.trendColor}`}>
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonitoringStatCards;