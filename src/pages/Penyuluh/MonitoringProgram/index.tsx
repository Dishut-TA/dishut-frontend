import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMagnifyingGlass,
  HiOutlineCalendar,
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineDocumentMagnifyingGlass
} from 'react-icons/hi2';
import { getMyPenugasanAPI } from '@/services/penugasan.service';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Menunggu Penugasan': return { badge: 'text-emerald-700 bg-emerald-50', btn: 'text-emerald-700 border-emerald-500 hover:bg-emerald-50', action: 'Mulai Monitoring' };
    case 'Berjalan': return { badge: 'text-blue-700 bg-blue-50', btn: 'text-blue-700 border-blue-500 hover:bg-blue-50', action: 'Lihat Progres' };
    case 'Menunggu Verifikasi': return { badge: 'text-purple-700 bg-purple-50', btn: 'text-purple-700 border-purple-500 hover:bg-purple-50', action: 'Tinjau Hasil' };
    case 'Selesai': return { badge: 'text-emerald-700 bg-emerald-50', btn: 'text-emerald-700 border-emerald-500 hover:bg-emerald-50', action: 'Lihat Hasil' };
    default: return { badge: 'text-gray-700 bg-gray-50', btn: 'text-gray-700 border-gray-500 hover:bg-gray-50', action: 'Detail' };
  }
};

const Header = () => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Monitoring Program Rehabilitasi</h1>
      <p className="text-sm text-gray-500">Pantau dan kelola kegiatan rehabilitasi yang telah selesai dan siap untuk dimonitoring.</p>
    </div>
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
      <HiOutlineArrowPath className="w-4 h-4" /> Riwayat Monitoring
    </button>
  </div>
);

const SummaryRow = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100"><HiOutlineDocumentMagnifyingGlass className="w-6 h-6 text-emerald-600" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Siap Monitoring</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.siap}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Program menunggu penugasan</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100"><HiOutlineClock className="w-6 h-6 text-blue-600" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Dalam Monitoring</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.dalam}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Program dalam proses monitoring</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100"><HiOutlineCheckCircle className="w-6 h-6 text-purple-600" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Menunggu Evaluasi</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.evaluasi}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Menunggu hasil verifikasi</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100"><HiOutlineExclamationTriangle className="w-6 h-6 text-orange-500" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Perlu Tindak Lanjut</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.tindakLanjut}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Program butuh tindakan lanjut</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100"><HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Monitoring Selesai</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.selesai}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Selesai monitoring</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100"><HiOutlineChartBar className="w-6 h-6 text-orange-500" /></div></div>
      <div><p className="text-xs font-bold text-gray-500 mb-1">Total Program</p><h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3><p className="text-[10px] text-gray-400 mb-3 min-h-3.75">Total program monitoring</p></div>
    </div>
  </div>
);

const FiltersAndTabs = () => (
  <div className="mb-6">
    <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap">
      {['Semua', 'Siap Monitoring', 'Dalam Monitoring', 'Menunggu Evaluasi', 'Perlu Tindak Lanjut', 'Monitoring Selesai'].map((tab, i) => (
        <button key={i} className={`pb-3 text-sm font-bold transition-colors border-b-2 ${i === 0 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          {tab}
        </button>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="relative md:col-span-1">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Cari program..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
      </div>
      <div><select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"><option>Semua</option></select></div>
      <div><select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"><option>Semua</option></select></div>
      <div><select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"><option>Semua</option></select></div>
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <input type="text" placeholder="Pilih periode" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
          <HiOutlineCalendar className="absolute right-3 bottom-2.5 w-4 h-4 text-gray-400" />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-sm font-bold text-gray-700 shrink-0">
          <HiOutlineArrowPath className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  </div>
);

const DataTable = ({ navigate, data, isLoading }: { navigate: any, data: any[], isLoading: boolean }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
      <thead className="text-[11px] text-[#3A4D3F] bg-[#DCECE0] border-y border-gray-100 font-bold uppercase tracking-wider">
        <tr>
          <th className="px-4 py-4">No</th>
          <th className="px-4 py-4">ID Program</th>
          <th className="px-4 py-4">Nama Program</th>
          <th className="px-4 py-4">Lokasi Program</th>
          <th className="px-4 py-4">Sumber Dana</th>
          <th className="px-4 py-4">Tanggal Selesai</th>
          <th className="px-4 py-4">Status</th>
          <th className="px-4 py-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {isLoading ? (
          <tr><td colSpan={8} className="py-8 text-center">Memuat...</td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={8} className="py-8 text-center">Belum ada program monitoring</td></tr>
        ) : data.map((item, idx) => {
          const style = getStatusStyles(item.status);
          return (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-4 text-xs">{idx + 1}</td>
              <td className="px-4 py-4 font-bold text-gray-700 text-xs">PRG-{item.id}</td>
              <td className="px-4 py-4 font-bold text-gray-800 text-xs w-48 whitespace-normal leading-snug">{item.nama}</td>
              <td className="px-4 py-4 text-xs w-40 whitespace-normal leading-snug">{item.lokasi}</td>
              <td className="px-4 py-4 text-xs">{item.sumberDana}</td>
              <td className="px-4 py-4 text-xs font-medium">{item.tanggalSelesai}</td>
              <td className="px-4 py-4">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${style?.badge}`}>{item.status}</span>
              </td>
              <td className="px-4 py-4">
                <div onClick={() => navigate(`/admin/penyuluh/monitoring-program/detail/${item.id}`)} className="cursor-pointer inline-block">
                  <button className="px-3 py-1.5 text-[11px] font-bold rounded-md border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm">
                    {style.action}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const RightSidebar = ({ stats }: { stats: any }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-6">Ringkasan Status Program</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0 rounded-full border-12 border-gray-100" style={{
           background: 'conic-gradient(#059669 0% 31%, #2563eb 31% 49%, #9333ea 49% 62%, #f97316 62% 73%, #10b981 73% 100%)'
        }}>
          <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 font-bold">Total</span>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-[10px] font-medium text-gray-600">
          <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-600"></div> Siap Monitoring</span> <span>{stats.siap}</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Dalam Monitoring</span> <span>{stats.dalam}</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Menunggu Evaluasi</span> <span>{stats.evaluasi}</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Perlu Tindak Lanjut</span> <span>{stats.tindakLanjut}</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Monitoring Selesai</span> <span>{stats.selesai}</span></div>
        </div>
      </div>
    </div>
  </div>
);

const MonitoringProgramRehabilitasi: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const res = await getMyPenugasanAPI();
        const apiData = res.data || [];

        // NOTE: endpoint /penugasan/me (myPenugasan()) mengembalikan model
        // Penugasan MENTAH (snake_case + relasi polymorphic "penugasanable"),
        // BUKAN format hasil olahan seperti di endpoint index().
        // Jadi field yang dipakai harus: jenis_kegiatan, penugasanable_type,
        // penugasanable, dan batas_waktu — BUKAN jenisKegiatan/detail/source_type/batasWaktu.
        const monitoringData = apiData
          .filter((p: any) => p.jenis_kegiatan === 'Monitoring')
          .map((p: any) => {
            const detail = p.penugasanable || {};
            let programName = '-';
            let location = '-';
            let sumber = '-';

            if (p.penugasanable_type === 'App\\Models\\DonationProgram') {
              programName = detail.name || '-';
              location = detail.location || '-';
              sumber = 'Donasi';
            } else if (
              p.penugasanable_type === 'App\\Models\\ProgramApbd' ||
              p.penugasanable_type === 'App\\Models\\ProgramCsr'
            ) {
              programName = detail.nama_program || '-';
              location = detail.lokasi || '-';
              sumber = p.penugasanable_type.includes('Apbd') ? 'APBD' : 'CSR';
            }

            return {
              id: String(p.id),
              nama: programName,
              lokasi: location,
              sumberDana: sumber,
              tanggalSelesai: p.batas_waktu
                ? new Date(p.batas_waktu).toLocaleDateString('id-ID')
                : '-',
              status: p.status,
            };
          });

        setPrograms(monitoringData);
      } catch (error) {
        console.error('Failed to fetch penugasan', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  const stats = {
    siap: programs.filter(p => p.status === 'Menunggu Penugasan').length,
    dalam: programs.filter(p => p.status === 'Berjalan').length,
    evaluasi: programs.filter(p => p.status === 'Menunggu Verifikasi').length,
    tindakLanjut: 0,
    selesai: programs.filter(p => p.status === 'Selesai').length,
    total: programs.length
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-12 w-full max-w-[1600px] mx-auto">
      <Header />
      <SummaryRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <FiltersAndTabs />
          <DataTable navigate={navigate} data={programs} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-4">
          <RightSidebar stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default MonitoringProgramRehabilitasi;