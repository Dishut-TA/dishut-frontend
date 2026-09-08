import React, { useState, useEffect } from 'react';
import { 
  HiOutlineBanknotes, 
  HiOutlineBuildingStorefront, 
  HiOutlineGlobeAsiaAustralia 
} from 'react-icons/hi2';
import ProfileBanner from './components/ProfileBanner';
import CSRStatCard from './components/CSRStatCard';
import ActiveProjectsEmpty from './components/ActiveProjectsEmpty';
import ActiveProjectsList from './components/ActiveProjectsList';
import { getDashboardCsrAPI } from '../../../services/program-csr.service';

const DashboardCSR: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardCsrAPI();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const userData = {
    companyName: dashboardData?.company_name || "Perusahaan CSR",
    email: dashboardData?.email || "csr@perusahaan.com"
  };
  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <ProfileBanner 
        companyName={userData.companyName} 
        email={userData.email} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <CSRStatCard 
          title="Total Dana Disalurkan"
          value={isLoading ? "..." : formatRupiah(dashboardData?.total_dana_disalurkan || 0)}
          subtitle="Bantuan Hibah Rehabilitasi Fisik"
          icon={<HiOutlineBanknotes className="w-6 h-6" />}
          iconBgColor="bg-[#DCECE0]"
          iconTextColor="text-[#185325]"
        />
        <CSRStatCard 
          title="KTH Binaan Dibantu"
          value={isLoading ? "..." : `${dashboardData?.kth_binaan_dibantu || 0} KTH`}
          subtitle="Mitra Mandiri di Lapangan"
          icon={<HiOutlineBuildingStorefront className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-700"
        />
        <CSRStatCard 
          title="Luas Rehabilitasi Hijau"
          value={isLoading ? "..." : `${dashboardData?.luas_rehabilitasi_hijau || 0} Hektar`}
          subtitle="Lahan Rakyat / Daerah Aliran Sungai"
          icon={<HiOutlineGlobeAsiaAustralia className="w-6 h-6" />}
          iconBgColor="bg-[#DCECE0]"
          iconTextColor="text-[#185325]"
        />
      </div>

      {isLoading ? (
        <div className="text-center p-8 text-gray-500">Memuat data proyek...</div>
      ) : dashboardData?.active_projects && dashboardData.active_projects.length > 0 ? (
        <ActiveProjectsList companyName={userData.companyName} projects={dashboardData.active_projects} />
      ) : (
        <ActiveProjectsEmpty companyName={userData.companyName} />
      )}

    </div>
  );
};

export default DashboardCSR;