import React from 'react';
import type { SummaryStats } from '../types';
import { 
  HiOutlineShieldCheck, 
  HiOutlineMap, 
  HiOutlineExclamationTriangle, 
  HiOutlineCalendar 
} from 'react-icons/hi2';

interface SummaryCardsProps {
  stats: SummaryStats;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    { title: 'Total Luas Analisis', value: stats.totalLuas, icon: <HiOutlineShieldCheck className="w-5 h-5 text-green-500" />, bgIcon: 'bg-green-50 border-green-100' },
    { title: 'Total Wilayah Kritis', value: stats.totalKritis, icon: <HiOutlineMap className="w-5 h-5 text-blue-500" />, bgIcon: 'bg-blue-50 border-blue-100' },
    { title: 'Total Wilayah Sangat Kritis', value: stats.totalSangatKritis, icon: <HiOutlineMap className="w-5 h-5 text-green-500" />, bgIcon: 'bg-green-50 border-green-100' },
    { title: 'Total Wilayah Prioritas', value: stats.totalWilayahPrioritas, icon: <HiOutlineExclamationTriangle className="w-5 h-5 text-red-500" />, bgIcon: 'bg-red-50 border-red-100' },
    { title: 'Luas Wilayah Prioritas', value: stats.luasWilayahPrioritas, icon: <HiOutlineExclamationTriangle className="w-5 h-5 text-red-500" />, bgIcon: 'bg-red-50 border-red-100' },
    { title: 'Analisis Terakhir', value: stats.analisisTerakhir, icon: <HiOutlineCalendar className="w-5 h-5 text-red-500" />, bgIcon: 'bg-red-50 border-red-100' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">{card.title}</p>
            <h3 className="text-xl font-bold text-gray-800">{card.value}</h3>
          </div>
          <div className={`p-2 rounded-lg border ${card.bgIcon}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;