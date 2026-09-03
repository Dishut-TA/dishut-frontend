import React from 'react';
import {
  HiOutlineDocumentText,
  HiOutlineCheckBadge,
  HiOutlinePresentationChartLine,
} from 'react-icons/hi2';

interface StatCardData {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
}

interface ProgramData {
  id: string;
  judulUsaha: string;
  skema: 'Investasi' | 'CSR' | 'APBD';
  status: string;
}

// --- MOCK DATA ---
const STAT_CARDS: StatCardData[] = [
  {
    id: 1,
    title: 'REHABILITASI APBD AKTIF',
    value: '1 Program',
    subtitle: 'Dukungan Mandat Dinas Kehutanan',
    icon: <HiOutlineDocumentText className="w-6 h-6" />,
    colorClass: 'text-[#185325] bg-[#DCECE0]',
  },
  {
    id: 2,
    title: 'PENGAJUAN CSR DIPROSES',
    value: '4 Pengajuan',
    subtitle: 'Penelaahan Dinas & Mitra CSR',
    icon: <HiOutlineCheckBadge className="w-6 h-6" />,
    colorClass: 'text-blue-600 bg-blue-100',
  },
  {
    id: 3,
    title: 'INVESTASI BERJALAN',
    value: '3 Proyek',
    subtitle: 'Pendanaan dari Publik',
    icon: <HiOutlinePresentationChartLine className="w-6 h-6" />,
    colorClass: 'text-rose-600 bg-rose-100',
  }
];

const MOCK_PROGRAMS: ProgramData[] = [
  {
    id: '#INV-001',
    judulUsaha: 'Pengadaan Ekowisata Kebun Stroberi',
    skema: 'Investasi',
    status: 'Aktif'
  },
  {
    id: 'CSR-001',
    judulUsaha: 'Rehabilitasi Lahan Kritis Hulu DAS Cimanuk',
    skema: 'CSR',
    status: 'Disetujui'
  }
];

const DashboardKTH: React.FC = () => {

  const getStatusBadge = (status: string) => {
    return (
      <span className="px-4 py-1.5 bg-[#f0f9f3] border border-[#C8E0CD] text-[#185325] rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm">
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Kelompok Tani Hutan (KTH)
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {STAT_CARDS.map((stat) => (
          <div key={stat.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-800 my-0.5">{stat.value}</span>
              <span className="text-[11px] font-medium text-primary mt-1">{stat.subtitle}</span>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${stat.colorClass}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <h2 className="text-base md:text-lg font-bold text-gray-800">
          Ringkasan Keikutsertaan Program Kelompok Anda
        </h2>
        <p className="text-sm text-gray-500">
          Daftar kemitraan kehutanan aktif yang sedang kelompok tani Anda laksanakan.
        </p>
      </div>

      <div className="overflow-x-auto w-full border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-175">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">ID</th>
              <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
              <th className="px-6 py-4 whitespace-nowrap">Skema</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_PROGRAMS.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {item.id}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                  {item.judulUsaha}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {item.skema}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}

            {MOCK_PROGRAMS.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                  Belum ada program yang diikutsertakan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DashboardKTH;