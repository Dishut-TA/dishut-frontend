import React, { useState, useEffect } from 'react';
import SummaryCard from './components/SummaryCard'; 
import GrowthChart from './components/GrowthChart'; 
import { getKabidDashboardAPI } from '@/services/dashboard.service'; 

const DashboardProgramKabid: React.FC = () => {
  const [data, setData] = useState({
    total_donasi: 0,
    total_terealisasi: 0,
    chart_data: [],
    recent_reports: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getKabidDashboardAPI();
        setData(res);
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatRupiah = (num: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-slate-500">Memuat data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Dashboard Realisasi Bibit dan Donasi</h1>
        <p className="text-sm md:text-base text-slate-500">Ringkasan performa dan laporan realisasi penghijauan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <SummaryCard 
          title="Total Donasi Diterima" 
          value={formatRupiah(data.total_donasi)} 
          subtext="Transparansi Dana" 
        />
        <SummaryCard 
          title="Total Bibit Terealisasi" 
          value={data.total_terealisasi.toLocaleString('id-ID')} 
          subtext="Pohon Ditanam" 
        />
      </div>

      <GrowthChart data={data.chart_data} />
    </div>
  );
}

export default DashboardProgramKabid;