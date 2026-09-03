import { useState, useEffect } from 'react';
import MapMockup from './components/MapMockup';
import DonutChart from './components/DonutChart';
import TableBerjalan from './components/TableBerjalan';
import RecentActivities from './components/RecentActivities';
import DashboardFilters from './components/DashboardFilters';
import SummaryCards from './components/SummaryCards';
import TableRealisasi from './components/TabRealisasi';
import { getPenugasanDashboardAPI } from '@/services/penugasan.service';

export default function DashboardPelaksanaanMonitoringKabid() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getPenugasanDashboardAPI();
        setDashboardData(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="flex bg-gray-50 font-sans text-gray-800 w-full min-h-screen">
      <main className="flex-1 flex flex-col w-full p-4 lg:p-6">
          <DashboardFilters />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 font-medium">Memuat data dashboard...</div>
          ) : (
            <>
              <SummaryCards stats={dashboardData?.stats} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <MapMockup locations={dashboardData?.map_locations} />
                <DonutChart stats={dashboardData?.stats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TableRealisasi programs={dashboardData?.recent_programs} />
                <TableBerjalan programs={dashboardData?.recent_programs} />
              </div>

              <RecentActivities activities={dashboardData?.recent_programs} />
            </>
          )}

      </main>
    </div>
  );
}