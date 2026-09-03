import React from 'react';
import { HiOutlineEye } from 'react-icons/hi2';
import { type Report } from '../data'; 

interface TableProps {
  reports: Report[];
  onViewDetail: (id: string | number) => void;
}

const MonitoringTable: React.FC<TableProps> = ({ reports, onViewDetail }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-200 text-sm text-left">
          <thead className="text-[#3A4D3F] bg-[#DCECE0]">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap">ID Laporan</th>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap">Tanggal</th>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap">Judul Kegiatan</th>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap">KTH Pelaksana</th>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap text-center">Status</th>
              <th className="px-4 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium text-gray-600">{report.id}</td>
                <td className="px-4 md:px-6 py-4 text-gray-500">{report.date}</td>
                <td className="px-4 md:px-6 py-4 font-bold text-gray-800">{report.title}</td>
                <td className="px-4 md:px-6 py-4 text-gray-600">{report.groupName}</td>
                <td className="px-4 md:px-6 py-4 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                    report.status === 'Verified' 
                      ? 'bg-[#D5F0DE] text-[#185325]' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-center">
                  <button 
                    onClick={() => onViewDetail(report.id)}
                    className="p-2 text-gray-400 rounded-lg hover:text-[#185325] hover:bg-[#DCECE0] hover:border-transparent transition-all cursor-pointer mx-auto flex items-center justify-center"
                    title="Lihat Detail"
                  >
                    <HiOutlineEye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringTable;