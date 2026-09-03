import React from 'react';

interface DashboardHeaderProps {
  periode: string;
  setPeriode: (val: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ periode, setPeriode }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Analisis CPI</h1>
        <p className="text-sm text-gray-500 mt-1">Pantau dan verifikasi hasil analisis lahan kritis secara spasial.</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Periode Analisis</label>
        <select 
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[#185325] focus:border-[#185325] block p-2.5 shadow-sm outline-none cursor-pointer"
        >
          <option value="2021-2026">2021-2026</option>
          <option value="2026-2031">2026-2031</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardHeader;