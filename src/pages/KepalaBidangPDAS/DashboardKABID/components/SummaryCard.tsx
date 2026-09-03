import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, iconBgColor, iconTextColor }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[#185325]">{value}</h3>
      </div>
    </div>
  );
};

export default SummaryCard;