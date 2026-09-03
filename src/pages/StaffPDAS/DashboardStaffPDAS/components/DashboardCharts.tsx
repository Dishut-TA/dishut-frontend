import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const dataWilayah = [
  { name: 'CDK I', capaian: 210000 }, { name: 'CDK II', capaian: 320000 },
  { name: 'CDK III', capaian: 410000 }, { name: 'CDK IV', capaian: 215000 },
  { name: 'CDK V', capaian: 310000 }, { name: 'CDK VI', capaian: 510000 },
];

const dataTahun = [
  { year: '2020', tren: 150000 }, { year: '2021', tren: 350000 },
  { year: '2022', tren: 420000 }, { year: '2023', tren: 550000 },
  { year: '2024', tren: 620000 }, { year: '2025', tren: 780000 },
];

export const ChartCapaianWilayah = () => (
  <div className="bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm h-87.5 flex flex-col">
    <h3 className="font-bold text-gray-800 mb-6">Capaian CDK Per Wilayah</h3>
    <div className="flex-1 w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataWilayah} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(val) => `${val / 1000}K`} />
          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Bar dataKey="capaian" fill="#2E7D32" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const ChartTrenTahunan = () => (
  <div className="bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm h-87.5 flex flex-col">
    <h3 className="font-bold text-gray-800 mb-6">Tren Capaian Penanaman</h3>
    <div className="flex-1 w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataTahun} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(val) => `${val / 1000}K`} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Line type="monotone" dataKey="tren" stroke="#0ea5e9" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);