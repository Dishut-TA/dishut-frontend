import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const RingkasanStatus: React.FC = () => {
  const chartData = [
    { id: 0, value: 13, color: '#185325', label: 'Memenuhi' },
    { id: 1, value: 4, color: '#ef4444', label: 'Tidak Memenuhi' },
  ];

  return (
    <div className="flex flex-col gap-6 lg:col-span-1 h-full">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center flex-1">
        <h2 className="text-base font-bold text-gray-800 self-start mb-2">
          Ringkasan Kelulusan PU
        </h2>
        
        <div className="w-full flex justify-center items-center h-48 md:h-56 mb-4">
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 60,   
                outerRadius: 80,   
                paddingAngle: 2, 
                cornerRadius: 4,
              },
            ]}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            width={200}
            height={200}
            sx={{
              '& .MuiChartsLegend-root': {
                display: 'none',
              },
            }}
          />
        </div>

        {/* Custom Legend */}
        <div className="flex flex-col gap-2 w-full text-sm font-medium">
          <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-2 text-[#185325]">
               <span className="w-3 h-3 bg-[#185325] rounded-sm shrink-0"></span>
               Memenuhi (≥75%)
             </div>
             <span className="font-bold text-gray-800">13 PU</span>
          </div>
          <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-2 text-red-500">
               <span className="w-3 h-3 bg-red-500 rounded-sm shrink-0"></span>
               Tidak Memenuhi (&lt;75%)
             </div>
             <span className="font-bold text-gray-800">4 PU</span>
          </div>
        </div>
      </div>

      {/* Card: Legenda Peta */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 shrink-0">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          Legenda Peta (Status Kelulusan)
        </h2>
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#185325] rounded-full shrink-0"></span>
            Memenuhi Standar
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full shrink-0"></span>
            Tidak Memenuhi / Memerlukan Penyulaman
          </div>
        </div>
      </div>

    </div>
  );
};

export default RingkasanStatus;