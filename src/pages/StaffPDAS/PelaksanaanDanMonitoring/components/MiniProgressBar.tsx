import React from 'react';

interface MiniProgressBarProps {
  progress: number;
}

const MiniProgressBar: React.FC<MiniProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-700">{progress}%</span>
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
        <div 
          className="h-full bg-secondary rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MiniProgressBar;