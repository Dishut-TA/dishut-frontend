import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: 'Berjalan' | 'Selesai' | 'Bermasalah';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  const getBarColor = () => {
    if (progress === 100) return 'bg-[#2E7D32]';
    if (status === 'Bermasalah') return 'bg-red-500';
    return 'bg-[#009262]';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getBarColor()}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs font-bold text-gray-600 w-8">{progress}%</span>
    </div>
  );
};

export default ProgressBar;