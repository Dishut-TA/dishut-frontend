import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtext: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtext }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center">
      <p className="text-sm font-semibold text-slate-500 mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs font-bold text-[#009262] mt-2">{subtext}</p>
    </div>
  );
};

export default SummaryCard;