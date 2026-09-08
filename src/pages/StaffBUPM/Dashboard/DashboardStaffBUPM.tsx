import React, { useState, useEffect } from 'react';
import { 
  HiOutlineDocumentPlus, 
  HiOutlineCheckBadge, 
  HiOutlineBuildingStorefront,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { getProgramBUPMAPI } from '../../../services/investasi.service';

const DashboardStaffBUPM: React.FC = () => {
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

  // Map statuses
  const pengajuanBaruCount = programs.filter(p => p.status === 'PENDING' || p.status === 'SUBMITTED').length;
  const sedangDiauditCount = programs.filter(p => p.status === 'REVIEW' || p.status === 'VERIFY' || p.status === 'AUDIT' || p.status === 'WAITING_APPROVAL').length;
  const aktifDiPublikCount = programs.filter(p => p.status === 'ACTIVE' || p.status === 'AKTIF').length;
  const STAT_CARDS = [
    {
      id: 1,
      title: 'PENGAJUAN BARU',
      value: isLoading ? '...' : `${pengajuanBaruCount} Berkas`,
      subtitle: 'Menunggu verifikasi administrasi',
      icon: <HiOutlineDocumentPlus className="w-6 h-6" />,
      colorClass: 'text-green-600 bg-green-100',
    },
    {
      id: 2,
      title: 'SEDANG DIAUDIT',
      value: isLoading ? '...' : `${sedangDiauditCount} Proyek`,
      subtitle: 'Dalam tinjauan Kepala BUPM',
      icon: <HiOutlineCheckBadge className="w-6 h-6" />,
      colorClass: 'text-blue-600 bg-blue-100',
    },
    {
      id: 3,
      title: 'AKTIF DI PUBLIK',
      value: isLoading ? '...' : `${aktifDiPublikCount} Proyek`,
      subtitle: 'Terbuka untuk pendanaan luar',
      icon: <HiOutlineBuildingStorefront className="w-6 h-6" />,
      colorClass: 'text-rose-600 bg-rose-100',
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Dashboard Operasional Staff
        </h1>
        <p className="text-sm text-gray-500">
          Pantau verifikasi dan progress program pengajuan investasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {STAT_CARDS.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <span className="font-bold uppercase mb-1">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-800 my-0.5">{stat.value}</span>
              <span className="text-xs font-medium text-primary mt-1">{stat.subtitle}</span>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${stat.colorClass}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-2">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-bold text-gray-800">Antrean Verifikasi Terbaru ({pengajuanBaruCount})</h2>
        </div>

        {pengajuanBaruCount === 0 ? (
          <div className="border border-gray-100 rounded-xl p-12 md:p-20 flex flex-col items-center justify-center text-center bg-gray-50/50">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
              <HiOutlineCheckCircle className="w-8 h-8 text-[#185325]" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Semua Proposal Bersih</h3>
            <p className="text-sm text-gray-500">
              Tidak ada antrean verifikasi teknis usaha saat ini.
            </p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/50">
             <p className="text-sm text-gray-600 text-center">Ada {pengajuanBaruCount} proposal baru yang menunggu verifikasi Anda.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardStaffBUPM;