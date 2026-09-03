import React from 'react';
import type { StatusKegiatan } from '../PelaksanaanKegiatan';

interface StatusBadgeProps {
  status: StatusKegiatan;
}

const StatusBadgeKegiatan: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#F2C94C] text-gray-800 whitespace-nowrap">Pending</span>;
    case 'Terealisasi':
      return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#e2f1e6] text-[#185325] whitespace-nowrap border border-[#C8E0CD]">Terealisasi</span>;
    case 'Disalurkan':
      return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 whitespace-nowrap border border-blue-200">Disalurkan</span>;
    default:
      return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 whitespace-nowrap border border-gray-200">Terkumpul</span>;
  }
};

export default StatusBadgeKegiatan;