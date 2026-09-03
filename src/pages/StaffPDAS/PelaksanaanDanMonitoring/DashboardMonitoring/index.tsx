import React, { useState, useEffect } from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import SummaryCards from './components/SummaryCards';
import MapMockup from './components/MapMockup';
import DonutChart from './components/DonutChart';
import BarChart from './components/BarChart';
import TableRealisasi from './components/TableRealisasi';
import TableBerjalan from './components/TableBerjalant';
import { getPenugasanDashboardAPI, getMonitoringDashboardAPI } from '@/services/penugasan.service';

const DashboardMonitoring: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [penugasanRes, monitoringRes] = await Promise.all([
        getPenugasanDashboardAPI(),
        getMonitoringDashboardAPI()
      ]);
      setDashboardData(penugasanRes);
      setMonitoringData(monitoringRes);
      setLastUpdate(new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB');
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = dashboardData?.stats || {};
  const programs = dashboardData?.programs || [];
  const perWilayah = dashboardData?.per_wilayah || {};
  const mapMarkers = monitoringData?.map_markers || [];
  const monStats = monitoringData?.stats || {};

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] font-sans text-gray-800">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Dashboard Pelaksanaan dan Monitoring</h2>
          <p className="text-sm text-gray-500">Ringkasan pelaksanaan Program Rehabilitasi DAS & Lahan.</p>
        </div>
        <div className="flex flex-col items-end pt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            Data terakhir diperbarui: {lastUpdate || '-'} 
            <HiOutlineArrowPath onClick={fetchData} className="w-4 h-4 cursor-pointer hover:text-gray-700 transition-colors" />
          </p>
        </div>
      </div>

      <SummaryCards stats={stats} monStats={monStats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MapMockup markers={mapMarkers} />
        <DonutChart stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChart perWilayah={perWilayah} />
        <TableRealisasi programs={programs} />
      </div>

      <TableBerjalan programs={programs} />
      
    </div>
  );
}

export default DashboardMonitoring;