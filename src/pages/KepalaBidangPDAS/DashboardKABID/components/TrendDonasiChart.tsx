import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendDonasiProps {
  data: any[];
  total: number;
  year: string;
}

const formatYAxis = (tickItem: number): string => {
  if (tickItem >= 1000000000) return `${(tickItem / 1000000000).toFixed(1)} M`;
  if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(0)} Jt`;

  return tickItem.toLocaleString('id-ID'); 
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formatted = val >= 1000000000 ? `${(val / 1000000000).toFixed(2)} M` : val >= 1000000 ? `${(val / 1000000).toFixed(2)} Jt` : val.toLocaleString('id-ID');
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-xl">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#0ea5e9]">Donasi: Rp {formatted}</p>
      </div>
    );
  }
  return null;
};

const TrendDonasiChart: React.FC<TrendDonasiProps> = ({ data, total, year }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Tren Donasi Terkumpul ({year})</h2>
        <p className="text-sm text-slate-500 mt-1">Perkembangan dana donasi yang terkumpul setiap bulan</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-end">
        <div className="w-full h-75 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ r: 4, stroke: '#0ea5e9', strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-64 bg-[#f0f9f3] border border-[#DCECE0] p-5 rounded-2xl shrink-0">
          <p className="text-sm font-semibold text-[#166534] mb-1">Total Donasi Terkumpul<br/>Tahun {year}</p>
          <p className="text-2xl font-bold text-[#14532d] mt-2">
            Rp {total >= 1000000000 ? `${(total / 1000000000).toFixed(2)} M` : total >= 1000000 ? `${(total / 1000000).toFixed(2)} Jt` : total.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendDonasiChart;