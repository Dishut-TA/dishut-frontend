import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineMagnifyingGlass,
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlinePlayCircle,
  HiOutlineArrowPath,
  HiOutlineMapPin
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

type StatusPelaksanaan = 'Ditugaskan' | 'Berjalan' | 'Selesai';
type TabPelaksanaan = 'Semua' | StatusPelaksanaan;

interface ProgramData {
  id: string;
  idPenugasan: string;
  idProgram: string;
  namaProgram: string;
  sumberProgram: string;
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
  raw_data: any;
}

const StatusBadge = ({ status }: { status: StatusPelaksanaan }) => {
  const styles: Record<StatusPelaksanaan, string> = {
    'Ditugaskan': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'Berjalan': 'bg-blue-50 text-blue-600 border border-blue-200',
    'Selesai': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

const Header = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-slate-900 mb-1">Pelaksanaan Kegiatan</h1>
    <p className="text-sm font-medium text-slate-500">
      Daftar penugasan kegiatan rehabilitasi yang diberikan kepada Anda.
    </p>
  </div>
);

const FilterSection = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  programFilter,
  setProgramFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: TabPelaksanaan;
  setStatusFilter: (val: TabPelaksanaan) => void;
  programFilter: string;
  setProgramFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}) => {
  const statusTabs: { id: TabPelaksanaan; label: string; icon: React.ReactNode }[] = [
    { id: 'Semua', label: 'Semua', icon: <HiOutlineDocumentText className="w-4 h-4" /> },
    { id: 'Ditugaskan', label: 'Ditugaskan', icon: <HiOutlinePlayCircle className="w-4 h-4 text-yellow-500" /> },
    { id: 'Berjalan', label: 'Berjalan', icon: <HiOutlineArrowPath className="w-4 h-4 text-blue-500" /> },
    { id: 'Selesai', label: 'Selesai', icon: <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" /> },
  ];

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Top Controls: Search Bar, Filter Program, & Combined Date Range Field */}
      <div className="flex flex-col xl:flex-row items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Cari ID penugasan, program, lokasi, KTH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-11 py-2.5 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 text-slate-700 shadow-sm"
          />
          <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>

        {/* Filter Jenis Program */}
        <div className="relative w-full xl:w-48 shrink-0">
          <div className="flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <HiOutlineMapPin className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] text-slate-400 font-medium leading-none">Jenis Program</span>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="Semua">Semua Program</option>
                <option value="Program APBD">Program APBD</option>
                <option value="Proposal CSR">Proposal CSR</option>
                <option value="Program Donasi">Program Donasi</option>
              </select>
            </div>
            <HiChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Combined Date Range Field */}
        <div className="relative w-full xl:w-auto shrink-0">
          <div className="flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-1 focus-within:ring-emerald-500">
            <HiOutlineCalendar className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] text-slate-400 font-medium leading-none">Periode Pelaksanaan</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer p-0 border-none"
                />
                <span className="text-xs font-semibold text-slate-400">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer p-0 border-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const KegiatanTable = ({ data, startIndex, navigate }: { data: ProgramData[], startIndex: number, navigate: any }) => (
  <div className="w-full overflow-x-auto">
    <div className="px-5 py-3.5 border-b border-slate-100 bg-white">
      <h3 className="text-sm font-bold text-slate-800">Daftar Penugasan Kegiatan</h3>
    </div>
    <table className="w-full text-left text-xs text-slate-600 border-collapse">
      <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
        <tr>
          <th className="px-3 py-3.5 text-center w-12 font-bold">No</th>
          <th className="px-3 py-3.5 w-28 font-bold whitespace-nowrap">ID Penugasan</th>
          <th className="px-3 py-3.5 w-24 font-bold whitespace-nowrap">ID Program</th>
          <th className="px-4 py-3.5 min-w-[200px] font-bold">Program / Lokasi</th>
          <th className="px-3 py-3.5 w-28 font-bold">KTH</th>
          <th className="px-3 py-3.5 min-w-[160px] font-bold">Target Kegiatan</th>
          <th className="px-3 py-3.5 w-20 text-center font-bold whitespace-nowrap">Total PU</th>
          <th className="px-3 py-3.5 font-bold whitespace-nowrap">Periode Pelaksanaan</th>
          {/* <th className="px-3 py-3.5 font-bold">Progres</th> */}
          <th className="px-3 py-3.5 w-28 text-center font-bold">Status</th>
          <th className="px-4 py-3.5 w-36 text-center font-bold">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {data.length === 0 ? (
          <tr>
            <td colSpan={10} className="px-4 py-8 text-center text-slate-500 font-medium">
              Tidak ada data penugasan kegiatan.
            </td>
          </tr>
        ) : data.map((item, idx) => (
          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors align-middle">
            <td className="px-3 py-3.5 font-medium text-center text-slate-700">{startIndex + idx + 1}</td>
            <td className="px-3 py-3.5 font-bold text-[#008A4B] whitespace-nowrap">{item.idPenugasan}</td>
            <td className="px-3 py-3.5 text-[11px] font-medium text-slate-500 whitespace-nowrap">{item.idProgram}</td>
            <td className="px-4 py-3.5">
              <div className="font-bold text-slate-900 text-xs mb-0.5 max-w-xs">{item.namaProgram}</div>
              <div className="text-[11px] text-slate-500 leading-snug max-w-xs">{item.lokasi}</div>
            </td>
            <td className="px-3 py-3.5 text-xs font-medium text-slate-700">{item.kth}</td>
            <td className="px-3 py-3.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-0.5 text-xs">
                <PiPlant className="w-4 h-4 text-[#008A4B] shrink-0" /> 
                <span>{item.targetKegiatan}</span>
              </div>
              <div className="text-[11px] text-slate-500">{item.targetBibit}</div>
            </td>
            <td className="px-3 py-3.5 text-xs font-semibold text-slate-700 text-center whitespace-nowrap">{item.totalPu}</td>
            <td className="px-3 py-3.5 text-xs font-medium text-slate-700 whitespace-nowrap">
              {item.periodeMulai} – {item.periodeSelesai}
              {item.sisaHari && <span className={`ml-2 font-bold ${item.sisaHariColor}`}>{item.sisaHari}</span>}
            </td>
            {/* <td className="px-3 py-3.5">
              <div className="text-[10px] font-medium text-slate-700 mb-0.5">{item.progresPu}</div>
              <div className="text-[10px] text-slate-500 mb-1.5">{item.progresBibit}</div>
              <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#008A4B] h-1.5 rounded-full" style={{ width: `${item.progresPercent}%` }}></div>
              </div>
            </td> */}
            <td className="px-3 py-3.5 text-center">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-3.5 text-center">
              {item.status === 'Ditugaskan' && (
                <button
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-1.5 w-full max-w-[140px] px-3 py-1.5 text-xs font-bold text-white bg-[#008A4B] rounded-full hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Mulai Pelaksanaan <HiChevronRight className="w-3.5 h-3.5 stroke-2" />
                </button>
              )}
              {item.status === 'Berjalan' && (
                <button
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-1.5 w-full max-w-[140px] px-3 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-500 rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Lanjutkan <HiChevronRight className="w-3.5 h-3.5 stroke-2" />
                </button>
              )}
              {item.status === 'Selesai' && (
                <button
                  onClick={() => navigate(`/admin/penyuluh/pelaksanaan-penanaman/create/${item.id}`)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-[#008A4B] bg-white border border-[#008A4B] rounded-full hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <HiOutlineEye className="w-4 h-4 stroke-2" /> Lihat Detail
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({
  totalData,
  currentPage,
  totalPages,
  onPageChange
}: {
  totalData: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const startItem = totalData === 0 ? 0 : (currentPage - 1) * 5 + 1;
  const endItem = Math.min(currentPage * 5, totalData);

  return (
    <div className="flex items-center justify-between text-xs text-slate-500 px-5 py-3.5 border-t border-slate-100 bg-white">
      <span className="font-medium">
        Menampilkan {startItem} - {endItem} dari {totalData} data
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === page
                ? 'border border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PelaksanaanPenanamanIndex: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabPelaksanaan>('Semua');
  const [programFilter, setProgramFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
            let sumber = 'Program APBD';

            if (p.penugasanable_type === 'App\\Models\\DonationProgram') {
              programName = detail.name || '-';
              location = detail.location || '-';
              kth = detail.kth?.name || '-';
              targetBibit = detail.target_amount || '0';
              totalPu = (detail.analysis_result_zone || detail.analysisResultZone)?.jumlah_pu || '-';
              sumber = 'Program Donasi';
            } else if (p.penugasanable_type === 'App\\Models\\ProgramApbd') {
              programName = detail.nama_program || '-';
              location = detail.lokasi || (detail.kth ? `${detail.kth.desa_kelurahan}, ${detail.kth.kabupaten_kota}` : '-');
              kth = detail.kth?.nama || '-';
              targetBibit = detail.target_bibit || detail.jumlah_bibit || '0';
              totalPu = (detail.analysis_result_zone || detail.analysisResultZone)?.jumlah_pu || '-';
              sumber = 'Program APBD';
            } else if (p.penugasanable_type === 'App\\Models\\ProgramCsr') {
              programName = detail.nama_program || '-';
              location = detail.lokasi || (detail.kth ? `${detail.kth.desa_kelurahan}, ${detail.kth.kabupaten_kota}` : '-');
              kth = detail.kth?.nama || '-';
              targetBibit = detail.target_bibit || detail.jumlah_bibit || '0';
              totalPu = (detail.analysis_result_zone || detail.analysisResultZone)?.jumlah_pu || '-';
              sumber = 'Proposal CSR';
            }

            return {
              id: String(p.id),
              idPenugasan: `TGS-${p.id}`,
              idProgram: detail.id ? `PRG-${detail.id}` : '-',
              namaProgram: programName,
              sumberProgram: sumber,
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
              status: p.status === 'Menunggu Verifikasi' ? 'Selesai' : (p.status as StatusPelaksanaan),
              raw_data: p
            };
          });

        setPrograms(pelaksanaanData.reverse());
      } catch (error) {
        console.error('Error fetching penugasan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  // Filter Logic
  const filteredPrograms = programs.filter(item => {
    const matchSearch = item.idPenugasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kth.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'Semua' ? true : item.status === statusFilter;
    const matchProgram = programFilter === 'Semua' ? true : item.sumberProgram === programFilter;

    // Date Range Logic
    let matchDate = true;
    if (item.raw_data.tanggal_mulai || item.raw_data.batas_waktu) {
      const itemStartDate = item.raw_data.tanggal_mulai ? new Date(item.raw_data.tanggal_mulai).toISOString().split('T')[0] : '';
      const itemEndDate = item.raw_data.batas_waktu ? new Date(item.raw_data.batas_waktu).toISOString().split('T')[0] : '';

      if (startDate && itemStartDate && itemStartDate < startDate) matchDate = false;
      if (endDate && itemEndDate && itemEndDate > endDate) matchDate = false;
    }

    return matchSearch && matchStatus && matchProgram && matchDate;
  });

  // Reset ke halaman 1 ketika opsi filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, programFilter, startDate, endDate]);

  // Pagination Logic (Max 5 items per page)
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full mx-auto pb-12 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <Header />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-4">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Memuat data penugasan...</div>
          ) : (
            <>
              <KegiatanTable data={paginatedData} startIndex={startIndex} navigate={navigate} />
              <Pagination
                totalData={filteredPrograms.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PelaksanaanPenanamanIndex;