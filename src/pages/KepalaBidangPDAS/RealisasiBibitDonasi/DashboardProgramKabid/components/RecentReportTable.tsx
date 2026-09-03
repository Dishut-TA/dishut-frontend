import React from 'react';

interface Report {
  id: number;
  title: string;
  date: string;
  author: string;
}

interface RecentReportsTableProps {
  reports: Report[];
}

const RecentReportsTable: React.FC<RecentReportsTableProps> = ({ reports }) => {
  return (
    <div className="mt-4">
      <h3 className="text-base font-bold text-gray-800 mb-4">Laporan Terbaru</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4 whitespace-nowrap">Laporan</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 whitespace-nowrap">Penyusun</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* 3. Gunakan 'reports' hasil lemparan props, dan pastikan tidak undefined (pakai ?.) */}
              {reports?.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {report.author}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2E7D32] cursor-pointer hover:underline text-center whitespace-nowrap">
                    Lihat Laporan
                  </td>
                </tr>
              ))}
              {(!reports || reports.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 italic">
                    Belum ada laporan terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentReportsTable;