import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className="bg-customWhite p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-shadow hover:shadow-md">
      <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-greyadmin font-medium mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-customBlack">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;