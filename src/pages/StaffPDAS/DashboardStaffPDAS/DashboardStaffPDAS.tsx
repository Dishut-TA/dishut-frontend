import React from 'react';
import { 
  HiOutlineGlobeAsiaAustralia, 
  HiOutlineChartPie, 
  HiOutlineCheckBadge, 
  HiOutlineFunnel 
} from 'react-icons/hi2';
import StatSummaryCard from './components/StatSummaryCard';
import { ChartCapaianWilayah, ChartTrenTahunan } from './components/DashboardCharts';
import { PetaDanTabel } from './components/PetaDanTabel';

const DashboardStaffPDAS: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 min-h-screen bg-slate-50/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full sm:w-auto">
            <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
            <select className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none w-full">
              <option>Semua Wilayah CDK</option>
              <option>CDK Wilayah I</option>
              <option>CDK Wilayah II</option>
            </select>
          </div>
          <select className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-sm font-semibold text-gray-700 focus:outline-none w-full sm:w-auto">
            <option>Tahun 2026</option>
            <option>Tahun 2025</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatSummaryCard 
          title="Lokasi Kritis Tertangani" value="1.345" unit="Lokasi"
          icon={<HiOutlineGlobeAsiaAustralia className="w-6 h-6" />}
          trend="12%" isPositive={true}
        />
        <StatSummaryCard 
          title="Total Target Penanaman" value="2,5M" unit="Bibit"
          icon={<HiOutlineChartPie className="w-6 h-6" />}
        />
        <StatSummaryCard 
          title="Tingkat Keberhasilan (Evaluasi)" value="82,4" unit="%"
          icon={<HiOutlineCheckBadge className="w-6 h-6" />}
          trend="2.1%" isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCapaianWilayah />
        <ChartTrenTahunan />
      </div>

      <PetaDanTabel />
    </div>
  );
};

export default DashboardStaffPDAS;