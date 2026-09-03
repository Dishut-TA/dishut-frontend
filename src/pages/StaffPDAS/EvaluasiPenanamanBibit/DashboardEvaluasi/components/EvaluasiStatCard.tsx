import React from 'react';

interface EvaluasiStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  theme: 'blue' | 'green' | 'indigo' | 'red';
}

const EvaluasiStatCard: React.FC<EvaluasiStatCardProps> = ({ title, value, icon, theme }) => {
  const themeStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-[#009262] border-green-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    red: 'bg-red-50 text-red-500 border-red-100',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 transition-shadow hover:shadow-md">
      <div className={`p-3 rounded-xl border ${themeStyles[theme]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs md:text-sm text-gray-500 font-medium mb-0.5">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default EvaluasiStatCard;