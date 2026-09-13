import React, { useState, useEffect } from 'react';
import {
  HiOutlineMap,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClock,
} from 'react-icons/hi2';
import { getProgramBUPMAPI } from '../../../services/investasi.service';

const DashboardKABIDBUPM: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getProgramBUPMAPI();
        setPrograms(data);
      } catch (error) {
        console.error("Gagal mengambil data program BUPM:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const totalProgram = programs.length;
  const programAktif = programs.filter(p => p.status === 'ACTIVE' || p.status === 'AKTIF').length;
  const totalInvestor = programs.reduce((sum, p) => sum + (p.jumlah_investor || 0), 0);
  const totalInvestasi = programs.reduce((sum, p) => sum + (p.dana_terkumpul || 0), 0);

  const programsWaitingApproval = programs.filter(p => p.status === 'WAITING_APPROVAL' || p.status === 'MENUNGGU_PERSETUJUAN' || p.status === 'REVIEW');

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };
  const STAT_CARDS = [
    {
      id: 1,
      title: 'Total Program',
      value: isLoading ? '...' : totalProgram.toString(),
      icon: <HiOutlineMap className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Program Aktif',
      value: isLoading ? '...' : programAktif.toString(),
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'Total Investor',
      value: isLoading ? '...' : totalInvestor.toString(),
      icon: <HiOutlineUsers className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'Total Investasi',
      value: isLoading ? '...' : formatRupiah(totalInvestasi),
      icon: <HiOutlineChartBar className="w-6 h-6" />,
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'AKTIF':
        return 'text-[#185325] font-bold';
      case 'WAITING_APPROVAL':
      case 'MENUNGGU_PERSETUJUAN':
      case 'REVIEW':
      case 'Menunggu Persetujuan':
        return 'text-gray-500 font-medium';
      default: return 'text-gray-700 font-medium';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Dashboard Eksekutif Kepala BUPM
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Pantau verifikasi dan progress program pengajuan investasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STAT_CARDS.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#EBF8F1] text-[#185325] rounded-xl flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-0.5">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-800 leading-none">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-800">
          <HiOutlineClock className="w-5 h-5 font-bold" strokeWidth={2} />
          <h2 className="text-lg font-bold">Menunggu Persetujuan Kepala ({programsWaitingApproval.length})</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto w-full min-h-62.5">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-center w-16">No</th>
                  <th className="px-6 py-5 text-center">Nama</th>
                  <th className="px-6 py-5 text-center">Target</th>
                  <th className="px-6 py-5 text-center">Tenggat Waktu</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Memuat data...</td>
                  </tr>
                ) : programsWaitingApproval.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada program yang menunggu persetujuan</td>
                  </tr>
                ) : (
                  programsWaitingApproval.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-700 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-800 text-center whitespace-nowrap">
                        {item.nama_program || item.judulUsaha || '-'}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-800 text-center whitespace-nowrap">
                        {formatRupiah(item.target_dana || 0)}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-800 text-center whitespace-nowrap">
                        {item.batas_waktu_pengumpulan ? new Date(item.batas_waktu_pengumpulan).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className={`px-6 py-5 text-sm text-center whitespace-nowrap ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </td>
                      <td className="px-6 py-5 flex justify-center whitespace-nowrap">
                        <button className="px-6 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95">
                          Setujui
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardKABIDBUPM;