import React from 'react';
import { HiCheck } from 'react-icons/hi2';

export interface StepData {
  id: number;
  title: string;
  status: 'Selesai' | 'Belum Mulai' | 'Proses';
  description: string;
}

interface TimelineStepProps {
  step: StepData;
  isLast: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, isLast }) => {
  const isCompleted = step.status === 'Selesai';

  return (
    <div className="flex gap-4 md:gap-6 relative">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
          isCompleted ? 'bg-[#185325] text-white' : 'bg-gray-400 text-white'
        }`}>
          {isCompleted ? <HiCheck className="w-5 h-5" strokeWidth={3} /> : <span className="text-xs font-bold">{step.id}</span>}
        </div>
        
        {!isLast && (
          <div className="w-px h-full bg-gray-200 my-2"></div>
        )}
      </div>

      <div className={`flex-1 bg-gray-50 rounded-xl p-5 md:p-6 border border-gray-100 ${isLast ? '' : 'mb-8'}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-sm font-bold ${isCompleted ? 'text-[#185325]' : 'text-gray-800'}`}>
            {step.title}
          </h3>
          <span className={`px-4 py-1 text-[10px] font-bold rounded-full ${
            isCompleted ? 'bg-[#81C784] text-white' : 'bg-gray-400 text-white'
          }`}>
            {step.status}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-20 h-16 bg-gray-200 rounded-md"></div>
          <p className="text-xs text-gray-400 font-medium">
            {step.description || "Deskripsi Kegiatan"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default TimelineStep;