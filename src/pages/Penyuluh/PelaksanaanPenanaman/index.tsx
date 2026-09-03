import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiChevronRight,
  HiOutlineMagnifyingGlass,
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineFunnel,
  HiOutlineArrowPath,
  HiChevronUpDown,
  HiOutlineDocumentText,
  HiOutlinePlayCircle
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

const HourglassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.322 3.322a1.25 1.25 0 0 0 .543 2.105l3.428.857a1.25 1.25 0 0 0 1.488-1.488l-.857-3.428a1.25 1.25 0 0 0-2.105-.543l-3.322 3.322a4.5 4.5 0 0 1 4.484-4.884Z" style={{display: 'none'}} />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" style={{display: 'none'}}/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 4.5h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2Z" style={{display: 'none'}}/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M6.75 18.75V21M17.25 18.75V21M10.125 10.125h3.75m-3.75 3.75h3.75M9 6.75h6M9 17.25h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 3h-15M19.5 21h-15M9 7.5l-3 4.5m9-4.5-3 4.5m-3 4.5 3 4.5" style={{display: 'none'}}/>
  </svg>
);

const LeafIcon = () => (
  <svg className="w-6 h-6 text-[#008A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" style={{display:'none'}} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21v-8m0 0a4 4 0 10-8 0v4a4 4 0 008 0zm0 0a4 4 0 118 0v4a4 4 0 01-8 0z" />
  </svg>
);

type StatusPelaksanaan = 'Ditugaskan' | 'Berjalan' | 'Selesai';
type TabPelaksanaan = 'Semua' | StatusPelaksanaan;

const TABS: { label: TabPelaksanaan; icon: React.ReactNode; activeColor: string; inactiveIconColor: string }[] = [
  { label: 'Semua', icon: <HiOutlineDocumentText className="w-4 h-4" />, activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', inactiveIconColor: 'text-emerald-600' },
  { label: 'Ditugaskan', icon: <HiOutlinePlayCircle className="w-4 h-4" />, activeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200', inactiveIconColor: 'text-yellow-500' },
  { label: 'Berjalan', icon: <HiOutlineArrowPath className="w-4 h-4" />, activeColor: 'bg-blue-50 text-blue-700 border-blue-200', inactiveIconColor: 'text-blue-500' },
  { label: 'Selesai', icon: <HiOutlineCheckCircle className="w-4 h-4" />, activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', inactiveIconColor: 'text-emerald-500' },
];

interface ProgramData {
  id: string;
  idPenugasan: string;
  idProgram: string;
  namaProgram: string;
  lokasi: string;
  kth: string;
  targetKegiatan: string;
  targetBibit: string;
  totalPu: string;
  periodeMulai: string;
  periodeSelesai: string;
  sisaHari: string;
  sisaHariColor: string;
  progresPu: string;
  progresBibit: string;
  progresPercent: number;
  status: StatusPelaksanaan;
}

const StatusBadge = ({ status }: { status: StatusPelaksanaan }) => {
  const styles: Record<StatusPelaksanaan, string> = {
    'Ditugaskan': 'bg-yellow-50 text-yellow-600',
    'Berjalan': 'bg-blue-50 text-blue-600',
    'Selesai': 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded ${styles[status]}`}>
      {status}
    </span>
  );
};

const Header = () => (
  <div className="mb-6 flex gap-4 items-center">
    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
      <LeafIcon />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Pelaksanaan Kegiatan</h1>
      <p className="text-sm font-medium text-slate-500">
        Daftar penugasan kegiatan rehabilitasi yang diberikan kepada Anda.
      </p>
    </div>
  </div>
);

// FilterSection tetap sama persis (search + dropdown cosmetic) — dibiarkan, gak diganggu
const FilterSection = () => (
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <input 
        type="text" 
        placeholder="Cari ID penugasan, program, lokasi, KTH..." 
        className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border border-slate-200 rounded-full focus:outline-none focus:border-[#008A4B]" 
      />
      <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
    </div>
    <div className="relative w-full md:w-64">
      <div className="absolute left-10 top-1.5 text-[10px] font-medium text-slate-400">Periode Pelaksanaan</div>
      <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <select className="w-full pl-10 pr-8 pt-4 pb-1 text-sm font-semibold border border-slate-200 rounded-full appearance-none bg-white focus:outline-none focus:border-[#008A4B]">
        <option>Semua Periode</option>
      </select>
      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#008A4B] text-white text-sm font-semibold rounded-full hover:bg-emerald-800 transition-colors shadow-sm">
      <HiOutlineFunnel className="w-4 h-4" /> Filter
    </button>
  </div>
);

// KegiatanTable — logic isi tabel/kolom-nya SAMA PERSIS kayak sebelumnya, cuma nerima data yang sudah difilter dari parent
const KegiatanTable = ({ data, navigate }: { data: ProgramData[], navigate: any }) => (
  <div className="overflow-x-auto">
    <div className="px-5 py-4 border-b border-slate-100">
      <h3 className="text-sm font-bold text-slate-800">Daftar Penugasan Kegiatan</h3>
    </div>
    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
      <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
        <tr>
          <th className="px-5 py-4 font-bold">No</th>
          <th className="px-5 py-4 font-bold flex items-center gap-1 cursor-pointer hover:text-slate-900">ID Penugasan <HiChevronUpDown className="w-4 h-4 text-slate-400"/></th>
          <th className="px-5 py-4 font-bold">ID Program</th>
          <th className="px-5 py-4 font-bold">Program / Lokasi</th>
          <th className="px-5 py-4 font-bold">KTH</th>
          <th className="px-5 py-4 font-bold">Target Kegiatan</th>
          <th className="px-5 py-4 font-bold">Total PU</th>
          <th className="px-5 py-4 font-bold">Periode Pelaksanaan</th>
          <th className="px-5 py-4 font-bold">Progres</th>
          <th className="px-5 py-4 font-bold">Status</th>
          <th className="px-5 py-4 font-bold text-center">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={11} className="px-5 py-8 text-center text-slate-500">Tidak ada data untuk status ini.</td>
          </tr>
        ) : data.map((item, idx) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-4 font-medium text-slate-700">{idx + 1}</td>
            <td className="px-5 py-4 font-bold text-[#008A4B]">{item.idPenugasan}</td>
            <td className="px-5 py-4 text-xs font-medium text-slate-500">{item.idProgram}</td>
            <td className="px-5 py-4">
              <div className="text-xs font-bold text-slate-900 mb-1">{item.namaProgram}</div>
              <div className="text-[11px] text-slate-500 whitespace-pre-line leading-snug">{item.lokasi}</div>
            </td>
            <td className="px-5 py-4 text-xs font-medium text-slate-700">{item.kth}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <PiPlant className="w-4 h-4 text-[#008A4B]" /> {item.targetKegiatan}
              </div>
              <div className="text-[11px] text-slate-500">{item.targetBibit}</div>
            </td>
            <td className="px-5 py-4 text-xs font-medium text-slate-700">{item.totalPu}</td>
            <td className="px-5 py-4 text-[11px]">
              <div className="font-medium text-slate-700 mb-1">{item.periodeMulai} <br/> – {item.periodeSelesai}</div>
              {item.sisaHari && <div className={`font-bold ${item.sisaHariColor}`}>{item.sisaHari}</div>}
            </td>
            <td className="px-5 py-4">
              <div className="text-[10px] font-medium text-slate-700 mb-0.5">{item.progresPu}</div>
              <div className="text-[10px] text-slate-500 mb-1.5">{item.progresBibit}</div>
              <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#008A4B] h-1.5 rounded-full" style={{ width: `${item.progresPercent}%` }}></div>
              </div>
            </td>
            <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
            <td className="px-5 py-4 text-center">
              {item.status === 'Ditugaskan' && (
                <button 
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-2 w-40 px-4 py-2 text-xs font-bold text-white bg-primary rounded-full hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  Mulai Pelaksanaan <HiChevronRight className="w-3.5 h-3.5 stroke-2" />
                </button>
              )}
              {item.status === 'Berjalan' && (
                <button 
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-2 w-40 px-4 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-500 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Lanjutkan Pelaksanaan <HiChevronRight className="w-3.5 h-3.5 stroke-2" />
                </button>
              )}
              {item.status === 'Selesai' && (
                <button 
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-2 w-40 px-4 py-2 text-xs font-bold text-[#008A4B] bg-white border border-[#008A4B] rounded-full hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <HiOutlineEye className="w-4 h-4 stroke-2" /> Lihat Detail <HiChevronRight className="w-3.5 h-3.5 stroke-2" />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PelaksanaanPenanamanIndex: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabPelaksanaan>('Semua');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const { getMyPenugasanAPI } = await import('@/services/penugasan.service');
        const res = await getMyPenugasanAPI();
        const apiData = res.data || [];
        
        const pelaksanaanData = apiData
          .filter((p: any) => p.jenis_kegiatan === 'Pelaksanaan Penanaman' && p.status !== 'Menunggu Penugasan')
          .map((p: any) => {
            const detail = p.penugasanable || {};
            let programName = '-';
            let location = '-';
            let kth = '-';
            let targetBibit = '0';
            let totalPu = '-';

            if (p.penugasanable_type === 'App\\Models\\DonationProgram') {
              programName = detail.name || '-';
              location = detail.location || '-';
              kth = detail.kth?.name || '-';
              targetBibit = detail.target_amount || '0';
              totalPu = (detail.analysis_result_zone || detail.analysisResultZone)?.jumlah_pu || '-';
            } else if (p.penugasanable_type === 'App\\Models\\ProgramApbd' || p.penugasanable_type === 'App\\Models\\ProgramCsr') {
              programName = detail.nama_program || '-';
              location = detail.lokasi || (detail.kth ? `${detail.kth.desa_kelurahan}, ${detail.kth.kabupaten_kota}` : '-');
              kth = detail.kth?.nama || '-';
              targetBibit = detail.target_bibit || detail.jumlah_bibit || '0';
              totalPu = (detail.analysis_result_zone || detail.analysisResultZone)?.jumlah_pu || '-';
            }

            return {
              id: String(p.id),
              idPenugasan: `TGS-${p.id}`,
              idProgram: detail.id ? `PRG-${detail.id}` : '-',
              namaProgram: programName,
              lokasi: location,
              kth: kth,
              targetKegiatan: 'Pelaksanaan Penanaman',
              targetBibit: targetBibit + ' bibit',
              totalPu: totalPu !== '-' ? `${totalPu} PU` : '-',
              periodeMulai: p.tanggal_mulai ? new Date(p.tanggal_mulai).toLocaleDateString('id-ID') : '-',
              periodeSelesai: p.batas_waktu ? new Date(p.batas_waktu).toLocaleDateString('id-ID') : '-',
              sisaHari: '',
              sisaHariColor: '',
              progresPu: '0',
              progresBibit: '0',
              progresPercent: 0,
              status: p.status === 'Menunggu Verifikasi' ? 'Selesai' : (p.status as StatusPelaksanaan)
            };
          });

        setPrograms(pelaksanaanData);
      } catch (error) {
        console.error('Error fetching penugasan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  // Filter beneran, berdasarkan tab aktif
  const filteredPrograms = activeTab === 'Semua'
    ? programs
    : programs.filter((p) => p.status === activeTab);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-lg shrink-0 bg-orange-50 text-orange-500">
              <HiOutlineClipboardDocumentList className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{programs.length}</h3>
              <p className="text-sm font-bold text-slate-800">Total Penugasan</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-lg shrink-0 bg-blue-50 text-blue-500">
              <HourglassIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{programs.filter(d => d.status === 'Ditugaskan').length}</h3>
              <p className="text-sm font-bold text-slate-800">Ditugaskan</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-lg shrink-0 bg-purple-50 text-purple-600">
              <HiOutlineArrowPath className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{programs.filter(d => d.status === 'Berjalan').length}</h3>
              <p className="text-sm font-bold text-slate-800">Berjalan</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-lg shrink-0 bg-emerald-50 text-emerald-500">
              <HiOutlineCheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{programs.filter(d => d.status === 'Selesai').length}</h3>
              <p className="text-sm font-bold text-slate-800">Selesai</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5">
            <FilterSection />

            {/* Tabs — filter beneran, klik ganti activeTab lalu tabel ke-filter otomatis */}
            <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 custom-scrollbar-pelaksanaan">
              {TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors shrink-0
                    ${activeTab === tab.label
                      ? tab.activeColor
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={activeTab === tab.label ? '' : tab.inactiveIconColor}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading data penugasan...</div>
          ) : (
            <KegiatanTable data={filteredPrograms} navigate={navigate} />
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-pelaksanaan::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar-pelaksanaan::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-pelaksanaan::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar-pelaksanaan::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
      `}} />
    </div>
  );
};

export default PelaksanaanPenanamanIndex;