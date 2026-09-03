import React from 'react';
import { HiOutlineEye } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ui/ProgressBar';
import type { Activity, ActivityStatus } from '../index'; // Pastikan path import sesuai

interface ActivityTableProps {
  data: Activity[];
}

const getStatusBadge = (status: ActivityStatus) => {
  const baseStyle = 'px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap';

  switch (status) {
    case 'Menunggu Verifikasi':
      return <span className={`${baseStyle} bg-[#FDE68A] text-yellow-800`}>Menunggu Verifikasi</span>;
    case 'Siap Monitoring':
      return <span className={`${baseStyle} bg-blue-100 text-blue-800`}>Siap Monitoring</span>;
    case 'Berjalan':
      return <span className={`${baseStyle} bg-[#e8f5e9] text-[#2E7D32]`}>Berjalan</span>;
    case 'Selesai':
      return <span className={`${baseStyle} bg-gray-200 text-gray-600`}>Selesai</span>;
    case 'Bermasalah':
      return <span className={`${baseStyle} bg-red-50 text-red-600`}>Bermasalah</span>;
    default:
      return null;
  }
};

const ActivityTable: React.FC<ActivityTableProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 whitespace-nowrap">Kegiatan & Lokasi</th>
              <th className="px-6 py-4 whitespace-nowrap">Jadwal</th>
              <th className="px-6 py-4 whitespace-nowrap">Penanggung Jawab</th>
              <th className="px-6 py-4 whitespace-nowrap min-w-37.5">Progress</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((kegiatan) => (
                <tr key={kegiatan.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{kegiatan.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{kegiatan.location}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-700">{kegiatan.date}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{kegiatan.time}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {kegiatan.author}
                  </td>
                  <td className="px-6 py-4">
                    <ProgressBar progress={kegiatan.progress} status={kegiatan.status as any} />
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {getStatusBadge(kegiatan.status)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      title="Lihat Detail"
                      onClick={() => navigate(`/admin/staff/monitoring/kegiatan/detail/${kegiatan.id}`)}
                      className="p-1.5 text-gray-400 hover:text-[#2E7D32] transition-colors inline-flex justify-center cursor-pointer"
                    >
                      <HiOutlineEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Tidak ada kegiatan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;