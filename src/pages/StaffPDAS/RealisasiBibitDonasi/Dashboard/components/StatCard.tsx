import React from "react";

export interface StatData {
  id: number;
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

interface StatCardProps {
  data: StatData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const Icon = data.icon;
  
  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div className={`w-12 h-12 rounded-lg ${data.bgColor} flex items-center justify-center mb-4 transition-colors`}>
        <Icon className={`w-7 h-7 ${data.iconColor}`} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{data.value}</h3>
        <p className="text-sm font-medium text-gray-500">{data.label}</p>
      </div>
    </div>
  );
};

export default StatCard;