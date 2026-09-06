import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendar,
  HiOutlineEye,
  HiChevronRight,
  HiChevronLeft,
  HiChevronDown,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDocumentCheck,
  HiOutlineMapPin
} from 'react-icons/hi2';
import { getMyPenugasanAPI } from '../../../services/penugasan.service';

interface TugasValidasi {
  id: string;
  displayId: string;
  sumber: string;
  lokasi: string;
  batasWaktu: string;
  sisaHari: string;
  sisaHariColor: string;
  status: string;
  zone_id: number;
  raw_data: any;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const calculateSisaHari = (batasWaktu: string) => {
  if (!batasWaktu) return { text: '', color: '' };
  const batas = new Date(batasWaktu);
  const sekarang = new Date();
  const selisihWaktu = batas.getTime() - sekarang.getTime();
  const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

  if (selisihHari < 0) return { text: '(Terlambat)', color: 'text-red-600' };
  if (selisihHari === 0) return { text: '(Hari ini)', color: 'text-orange-500' };
  if (selisihHari <= 3) return { text: `(${selisihHari} hari lagi)`, color: 'text-red-500' };
  if (selisihHari <= 7) return { text: `(${selisihHari} hari lagi)`, color: 'text-orange-500' };
  return { text: `(${selisihHari} hari lagi)`, color: 'text-emerald-500' };
};

const getSumberName = (type: string) => {
  if (type.includes('AnalysisResultZone')) return 'Analisis CPI';
  if (type.includes('ProgramApbd')) return 'Program APBD';
  if (type.includes('ProgramCsr')) return 'Proposal CSR';
  if (type.includes('DonationProgram')) return 'Program Donasi';
  return 'Lainnya';
};

const getLokasiString = (penugasanable: any) => {
  if (!penugasanable) return '-';
  if (penugasanable.desa && penugasanable.kecamatan && penugasanable.kabupaten) {
    return `Desa ${penugasanable.desa}, Kec. ${penugasanable.kecamatan}, Kab. ${penugasanable.kabupaten}`;
  }
  return penugasanable.lokasi || penugasanable.location || '-';
};

const SumberBadge = ({ text }: { text: string }) => {
  const isCPI = text === 'Analisis CPI';
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isCPI ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'}`}>
      {text}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Ditugaskan': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'Selesai': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'Menunggu': 'bg-slate-50 text-slate-600 border border-slate-200',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
};

const Header = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-slate-900 mb-1">Validasi Lokasi</h1>
    <p className="text-sm font-medium text-slate-500">
      Daftar penugasan validasi lokasi yang diberikan kepada Anda.
    </p>
  </div>
);

const FilterSection = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sumberFilter,
  setSumberFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sumberFilter: string;
  setSumberFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}) => {
  const statusTabs = [
    { id: 'Semua', label: 'Semua', icon: <HiOutlineDocumentCheck className="w-4 h-4" /> },
    { id: 'Ditugaskan', label: 'Ditugaskan', icon: <HiOutlineClipboardDocumentCheck className="w-4 h-4 text-yellow-500" /> },
    { id: 'Selesai', label: 'Selesai', icon: <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" /> },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6 mt-2">
      {/* Top Controls: Search Bar, Sumber Lokasi, & Combined Date Range Field */}
      <div className="flex flex-col xl:flex-row items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Cari ID penugasan, lokasi, desa, CDK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-11 py-2.5 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 text-slate-700 shadow-sm"
          />
          <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>

        {/* Filter Sumber Lokasi */}
        <div className="relative w-full xl:w-48 shrink-0">
          <div className="flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <HiOutlineMapPin className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] text-slate-400 font-medium leading-none">Sumber Lokasi</span>
              <select
                value={sumberFilter}
                onChange={(e) => setSumberFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="Semua">Semua Sumber</option>
                <option value="Analisis CPI">Analisis CPI</option>
                <option value="Proposal CSR">Proposal CSR</option>
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
              <span className="text-[10px] text-slate-400 font-medium leading-none">Periode Penugasan</span>
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

const ValidasiTable = ({ data, startIndex, navigate }: { data: TugasValidasi[], startIndex: number, navigate: any }) => (
  <div className="overflow-x-auto">
    <div className="px-4 py-3 border-b border-slate-100">
      <h3 className="text-sm font-bold text-slate-800">Daftar Validasi Lokasi</h3>
    </div>
    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
      <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
        <tr>
          <th className="px-4 py-4 font-bold">No</th>
          <th className="px-4 py-4 font-bold">ID Penugasan</th>
          <th className="px-4 py-4 font-bold">Sumber Lokasi</th>
          <th className="px-4 py-4 font-bold">Lokasi</th>
          <th className="px-4 py-4 font-bold">Batas Waktu Validasi</th>
          <th className="px-4 py-4 font-bold">Status</th>
          <th className="px-4 py-4 font-bold text-center">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
              Tidak ada data penugasan validasi.
            </td>
          </tr>
        ) : (
          data.map((item, idx) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-4 text-center font-medium">{startIndex + idx + 1}</td>
              <td className="px-4 py-4 font-semibold text-[#008A4B]">{item.displayId}</td>
              <td className="px-4 py-4"><SumberBadge text={item.sumber} /></td>
              <td className="px-4 py-4">
                <div className="max-w-xs whitespace-normal font-medium text-slate-800 leading-relaxed">
                  {item.lokasi}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-800">{item.batasWaktu}</div>
                <div className={`text-xs font-semibold mt-0.5 ${item.sisaHariColor}`}>{item.sisaHari}</div>
              </td>
              <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-4 text-center">
                {(item.status === 'Ditugaskan' || item.status === 'Menunggu') && (
                  <button
                    onClick={() => navigate(`/admin/penyuluh/validasi-lokasi/detail/${item.id}`, { state: { data: item, status: item.status } })}
                    className="inline-flex items-center justify-between w-36 px-4 py-2 text-xs font-bold text-white bg-[#008A4B] rounded-full hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                  >
                    Mulai Validasi <HiChevronRight className="w-4 h-4 stroke-2" />
                  </button>
                )}
                {item.status === 'Selesai' && (
                  <button
                    onClick={() => navigate(`/admin/penyuluh/validasi-lokasi/detail/${item.id}`, { state: { data: item, status: item.status } })}
                    className="inline-flex items-center justify-center gap-1.5 w-36 px-4 py-2 text-xs font-bold text-[#008A4B] bg-white border border-[#008A4B] rounded-full hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <HiOutlineEye className="w-4 h-4 stroke-2" /> Lihat Detail
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
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
    <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-4 border-t border-slate-100">
      <span className="font-medium">
        Menampilkan {startItem} - {endItem} dari {totalData} data
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
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
          className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ValidasiLokasi: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TugasValidasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sumberFilter, setSumberFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyPenugasanAPI();
        if (res.data) {
          const validasi = res.data.filter((item: any) => item.jenis_kegiatan === 'Validasi Lokasi');

          const mappedData: TugasValidasi[] = validasi.map((item: any) => {
            const sisa = calculateSisaHari(item.batas_waktu);

            const status = item.status || 'Ditugaskan';

            return {
              id: item.id.toString(),
              displayId: 'TGS-' + String(item.id).padStart(3, '0'),
              sumber: getSumberName(item.penugasanable_type),
              lokasi: getLokasiString(item.penugasanable),
              batasWaktu: formatDate(item.batas_waktu),
              sisaHari: sisa.text,
              sisaHariColor: sisa.color,
              status: status,
              zone_id: item.penugasanable_id,
              raw_data: item
            };
          });

          // Mengurutkan tugas terbaru agar berada di paling atas
          setData(mappedData.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch penugasan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredData = data.filter(item => {
    const matchSearch = item.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'Semua' ? true : item.status === statusFilter;

    const matchSumber = sumberFilter === 'Semua' ? true : item.sumber === sumberFilter;

    // Date Range Logic
    let matchDate = true;
    if (item.raw_data.batas_waktu) {
      const itemDate = new Date(item.raw_data.batas_waktu).toISOString().split('T')[0];
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;
    }

    return matchSearch && matchStatus && matchSumber && matchDate;
  });

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sumberFilter, startDate, endDate]);

  // Pagination Logic (Max 5 items per page)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full mx-auto pb-12 bg-[#F8FAFC] min-h-screen font-sans">
      <Header />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-4">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sumberFilter={sumberFilter}
          setSumberFilter={setSumberFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="border border-slate-200 rounded-lg overflow-hidden mt-2">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Memuat data penugasan...</div>
          ) : (
            <>
              <ValidasiTable data={paginatedData} startIndex={startIndex} navigate={navigate} />
              <Pagination 
                totalData={filteredData.length} 
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

export default ValidasiLokasi;