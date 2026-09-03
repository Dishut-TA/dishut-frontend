import React from 'react';
import { 
  HiOutlineBanknotes, 
  HiOutlineBuildingStorefront, 
  HiOutlineGlobeAsiaAustralia 
} from 'react-icons/hi2';
import ProfileBanner from './components/ProfileBanner';
import CSRStatCard from './components/CSRStatCard';
import ActiveProjectsEmpty from './components/ActiveProjectsEmpty';

const DashboardCSR: React.FC = () => {
  const userData = {
    companyName: "PT. Bank Jabar Banten",
    email: "csr@bjb.co.id"
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
          value="Rp 0"
          subtitle="Bantuan Hibah Rehabilitasi Fisik"
          icon={<HiOutlineBanknotes className="w-6 h-6" />}
          iconBgColor="bg-[#DCECE0]"
          iconTextColor="text-[#185325]"
        />
        <CSRStatCard 
          title="KTH Binaan Dibantu"
          value="0 KTH"
          subtitle="Mitra Mandiri di Lapangan"
          icon={<HiOutlineBuildingStorefront className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-700"
        />
        <CSRStatCard 
          title="Luas Rehabilitasi Hijau"
          value="0 Hektar"
          subtitle="Lahan Rakyat / Daerah Aliran Sungai"
          icon={<HiOutlineGlobeAsiaAustralia className="w-6 h-6" />}
          iconBgColor="bg-[#DCECE0]"
          iconTextColor="text-[#185325]"
        />
      </div>
      <ActiveProjectsEmpty companyName={userData.companyName} />

    </div>
  );
};

export default DashboardCSR;