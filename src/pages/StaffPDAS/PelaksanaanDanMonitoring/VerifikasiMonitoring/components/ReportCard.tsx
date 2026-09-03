import React from 'react';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { type Report } from '../data';

interface ReportCardProps {
  report: Report;
  isActive: boolean;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
        isActive 
          ? 'border-[#185325] shadow-md' 
          : 'border-transparent shadow-sm hover:border-[#89C78E]'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          report.status === 'Verified' ? 'bg-[#D5F0DE] text-[#185325]' : 'bg-[#FDE2D3] text-[#D85B1A]'
        }`}>
          {report.status}
        </span>
        <span className="text-xs text-gray-400 font-medium">{report.date}</span>
      </div>
      
      <h3 className="text-base font-bold text-gray-800 mb-1">{report.title}</h3>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <HiOutlineMapPin className="w-4 h-4 shrink-0" />
        {report.coordinates}
      </div>

      <div className="text-right">
        <span className="text-[11px] text-gray-400 font-medium">{report.groupName}</span>
      </div>
    </div>
  );
};

export default ReportCard;