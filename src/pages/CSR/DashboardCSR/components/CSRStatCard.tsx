import React from 'react';

interface CSRStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

const CSRStatCard: React.FC<CSRStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconTextColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 uppercase mb-1">
          {title}
        </span>
        <span className="text-2xl font-bold text-gray-800 my-0.5">{value}</span>
        <span className="text-xs font-medium text-primary mt-1">{subtitle}</span>
      </div>
      <div className={`p-3 rounded-xl ${iconBgColor} ${iconTextColor} shrink-0`}>
        {icon}
      </div>
    </div>
  );
};

export default CSRStatCard;