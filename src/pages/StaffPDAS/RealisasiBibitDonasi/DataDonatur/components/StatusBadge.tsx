import React from 'react';
import type { StatusType } from '@/utils/interface';

interface StatusBadgeProps {
  status: StatusType | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Pending':
        return 'bg-[#F2C94C] text-gray-800';
      case 'Terkumpul':
      case 'Terealisasi':
      case 'Disalurkan':
      case 'Verified':
        return 'bg-blue-100 text-blue-600';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${getStatusStyles()}`}>
      {status === 'Pending' ? 'Menunggu Verifikasi' : status}
    </span>
  );
};

export default StatusBadge;