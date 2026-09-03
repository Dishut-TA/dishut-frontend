import React from 'react';
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi2';

export interface Activity {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  progress: number;
  author: string;
  status: 'Berjalan' | 'Selesai' | 'Bermasalah';
}

const ActivityCard: React.FC<{ data: Activity }> = ({ data }) => {
  const badgeStyles = {
    Berjalan: 'bg-blue-100 text-blue-600',
    Selesai: 'bg-green-100 text-green-600',
    Bermasalah: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[data.status]}`}>
          {data.status}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{data.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <HiOutlineMapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{data.location}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <HiOutlineCalendar className="w-4 h-4" />
            {data.date}
          </div>
          <div className="flex items-center gap-1.5">
            <HiOutlineClock className="w-4 h-4" />
            {data.time}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mb-1.5">
          <span>Progress Kegiatan</span>
          <span>{data.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-[#185325] h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-right mt-2">
        <span className="text-[11px] text-gray-400 italic font-medium">
          Penyuluh: {data.author}
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;