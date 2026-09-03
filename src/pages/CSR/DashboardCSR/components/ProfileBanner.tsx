import React from 'react';
import { HiOutlineBuildingOffice } from 'react-icons/hi2';

interface ProfileBannerProps {
  companyName: string;
  email: string;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ companyName, email }) => {
  return (
    <div className="bg-[#DCECE0] rounded-2xl p-5 md:p-6 flex items-center gap-5">
      <div className="bg-white p-3.5 rounded-full flex items-center justify-center shrink-0">
        <HiOutlineBuildingOffice className="w-6 h-6 text-[#185325]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-0.5">
          Mitra CSR Terdaftar &bull; {email}
        </p>
      </div>
    </div>
  );
};

export default ProfileBanner;