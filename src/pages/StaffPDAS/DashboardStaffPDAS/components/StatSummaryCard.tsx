import React from 'react';

interface StatSummaryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
}

const StatSummaryCard: React.FC<StatSummaryCardProps> = ({ title, value, unit, icon, trend, isPositive }) => {
  return (
    <div className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-br from-[#DCECE0] to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#185325]">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? '+' : '-'}{trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
          {value} <span className="text-sm font-semibold text-gray-500">{unit}</span>
        </h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default StatSummaryCard;