import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

interface PerbandinganProps {
  data: any[];
  year: string;
}

const formatYAxis = (tickItem: number): string => {
  if (tickItem >= 1000000000) return `${(tickItem / 1000000000).toFixed(1)} M`;
  if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(0)} Jt`;

  return tickItem.toLocaleString('id-ID'); 
};

const renderCustomBarLabel = ({ x, y, width, value }: any) => {
  if (value === 0) return null;
  const formatted = value >= 1000000000 ? `${(value / 1000000000).toFixed(1)} M` : `${(value / 1000000).toFixed(0)} Jt`;
  return (
    <text x={x + width / 2} y={y - 10} fill="#334155" textAnchor="middle" fontSize={12} fontWeight="bold">
      Rp {formatted}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formatted = val >= 1000000000 ? `${(val / 1000000000).toFixed(2)} M` : val >= 1000000 ? `${(val / 1000000).toFixed(2)} Jt` : val.toLocaleString('id-ID');
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-xl">
        <p className="font-bold text-slate-700 mb-1">Sumber: {label}</p>
        <p className="text-sm font-semibold text-slate-600">Total: Rp {formatted}</p>
      </div>
    );
  }
  return null;
};

const PerbandinganPendanaanChart: React.FC<PerbandinganProps> = ({ data, year }) => {
  const totalDana = data.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (val: number) => totalDana > 0 ? Math.round((val / totalDana) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Perbandingan Sumber Pendanaan ({year})</h2>
        <p className="text-sm text-slate-500 mt-1">Perbandingan total pendanaan rehabilitasi berdasarkan sumber dana</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-end">
        <div className="w-full lg:w-2/3 h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }} barSize={60}>
              <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fontSize: 13, fontWeight: 500, fill: '#64748b' }} dy={10} />
              <YAxis 
                axisLine={true} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickFormatter={formatYAxis}
              />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="value" content={renderCustomBarLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#86efac]"></div>
                  <span className="text-xs font-bold text-slate-700">APBD</span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  Rp {data[0]?.value >= 1000000000 ? `${(data[0].value / 1000000000).toFixed(1)} M` : `${(data[0]?.value / 1000000).toFixed(0)} Jt`}
                </p>
              </div>
              <span className="text-sm font-bold text-[#185325]">{getPercentage(data[0]?.value)}%</span>
            </div>
            
            <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#85643a]"></div>
                  <span className="text-xs font-bold text-slate-700">CSR</span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  Rp {data[1]?.value >= 1000000000 ? `${(data[1].value / 1000000000).toFixed(1)} M` : `${(data[1]?.value / 1000000).toFixed(0)} Jt`}
                </p>
              </div>
              <span className="text-sm font-bold text-[#85643a]">{getPercentage(data[1]?.value)}%</span>
            </div>
          </div>

          <div className="bg-[#f0f9f3] border border-[#DCECE0] p-4 rounded-xl flex justify-between items-center mt-2">
            <span className="text-sm font-semibold text-[#185325]">Total Pendanaan</span>
            <span className="text-lg font-bold text-[#185325]">
              Rp {totalDana >= 1000000000 ? `${(totalDana / 1000000000).toFixed(2)} M` : totalDana >= 1000000 ? `${(totalDana / 1000000).toFixed(2)} Jt` : totalDana.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganPendanaanChart;