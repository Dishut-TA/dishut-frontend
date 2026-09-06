import React, { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineUserPlus,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentCheck,
  HiOutlineCalendar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineFolder,
  HiOutlineSparkles,
  HiOutlineCheck,
} from 'react-icons/hi2';
import ModalBuatPenugasan from './components/CreatePenugasanModal';
import TugaskanModal from './components/TugaskanModal';
import { useNavigate } from 'react-router-dom';

type JenisKegiatan = 'Validasi Lokasi' | 'Pelaksanaan Penanaman';
type StatusPenugasan =
  | 'Semua'
  | 'Menunggu Penugasan'
  | 'Ditugaskan'
  | 'Berjalan'
  | 'Menunggu Verifikasi'
  | 'Selesai';

interface PenugasanData {
  id: string;
  program: string;
  lokasi: string;
  jenisKegiatan: JenisKegiatan;
  wilayah: string;
  rencanaPeriode: string;
  penyuluh: string;
  status: string;
  tanggalPenugasan: string;
  source_type?: string;
  penugasan_id?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 5;

// Custom Icon untuk Pelaksanaan Penanaman (Kecambah/Tanaman)
const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22V12M12 12C12 12 7 12 7 7C7 12 12 12 12 12ZM12 12C12 12 17 12 17 7C17 12 12 12 12 12Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 22H16" />
  </svg>
);

// Helper Badge Jenis Kegiatan
const renderJenisKegiatanBadge = (jenis: JenisKegiatan) => {
  if (jenis === 'Validasi Lokasi') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <HiOutlineMapPin className="w-3.5 h-3.5 text-blue-600" />
        Validasi Lokasi
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <SproutIcon className="w-3.5 h-3.5 text-emerald-600" />
      Pelaksanaan Penanaman
    </span>
  );
};

// Helper Warna Khusus Badge Status di DALAM TABEL (Disesuaikan)
const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'Menunggu Penugasan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-emerald-700 bg-emerald-50 border-emerald-200">
          Menunggu Penugasan
        </span>
      );
    case 'Ditugaskan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-blue-700 bg-blue-50 border-blue-200">
          Ditugaskan
        </span>
      );
    case 'Berjalan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-sky-700 bg-sky-50 border-sky-200">
          Berjalan
        </span>
      );
    case 'Menunggu Verifikasi':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-amber-700 bg-amber-50 border-amber-200">
          Menunggu Verifikasi
        </span>
      );
    case 'Selesai':
    case 'Menunggu Evaluasi':
    case 'Monitoring Selesai':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-emerald-700 bg-emerald-50 border-emerald-200">
          Selesai
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-slate-700 bg-slate-50 border-slate-200">
          {status}
        </span>
      );
  }
};

// Helper Filter Jenis Program
const filterByProgram = (itemProgram: string, selectedProgram: string): boolean => {
  if (selectedProgram === 'Semua Program') return true;
  return itemProgram.toLowerCase().trim() === selectedProgram.toLowerCase().trim();
};

const PenugasanPenyuluh: React.FC = () => {
  const [penugasanData, setPenugasanData] = useState<PenugasanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==== FILTER STATE ====
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusPenugasan>('Semua');
  const [selectedJenisKegiatan, setSelectedJenisKegiatan] = useState<string>('Semua Jenis Kegiatan');
  const [selectedProgram, setSelectedProgram] = useState<string>('Semua Program');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ==== MODAL STATE ====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTugaskanModalOpen, setIsTugaskanModalOpen] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState<PenugasanData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  // Fetch Data dari API
  useEffect(() => {
    const fetchPenugasan = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${API_URL}/penugasan`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });

        const json = await res.json();
        setPenugasanData(json.data || []);
      } catch (e) {
        console.error('Error fetching penugasan:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, [refreshKey]);

  // Handler Aksi
  const handleTugaskan = (item: PenugasanData) => {
    setSelectedPenugasan(item);
    setIsTugaskanModalOpen(true);
  };

  const handleBukaDetail = (item: PenugasanData) => {
    const targetId = item.penugasan_id || item.id;
    navigate(`/admin/staff/monitoring/penugasan-pelaksanaan/detail/${targetId}`, {
      state: { status: item.status, jenisKegiatan: item.jenisKegiatan, data: item },
    });
  };

  const handleVerifikasi = (item: PenugasanData) => {
    const targetId = item.penugasan_id || item.id;
    navigate(`/admin/staff/monitoring/penugasan-pelaksanaan/detail/${targetId}`, {
      state: { status: item.status, jenisKegiatan: item.jenisKegiatan, data: item, modeVerifikasi: true },
    });
  };

  // ==== LOGIKA FILTER & SEARCH ====
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return penugasanData.filter((item) => {
      // Hanya mengizinkan Validasi Lokasi & Pelaksanaan Penanaman
      const isKegiatanValid =
        item.jenisKegiatan === 'Validasi Lokasi' || item.jenisKegiatan === 'Pelaksanaan Penanaman';

      if (!isKegiatanValid) {
        return false;
      }

      // Filter Status Pill
      if (selectedStatus !== 'Semua') {
        if (selectedStatus === 'Selesai') {
          if (
            item.status !== 'Selesai' &&
            item.status !== 'Menunggu Evaluasi' &&
            item.status !== 'Monitoring Selesai'
          ) {
            return false;
          }
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }

      // Filter Jenis Kegiatan Dropdown
      if (selectedJenisKegiatan !== 'Semua Jenis Kegiatan' && item.jenisKegiatan !== selectedJenisKegiatan) {
        return false;
      }

      // Filter Jenis Program Dropdown
      if (!filterByProgram(item.program, selectedProgram)) {
        return false;
      }

      // Search Query
      if (q) {
        const haystack = `${item.program} ${item.lokasi} ${item.penyuluh} ${item.id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [penugasanData, selectedStatus, selectedJenisKegiatan, selectedProgram, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedJenisKegiatan, selectedProgram, searchTerm, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-8 bg-[#f8faf9] min-h-screen font-sans">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Penugasan Kegiatan</h1>
        <p className="text-sm text-slate-500">
          Kelola penugasan penyuluh untuk kegiatan validasi lokasi dan pelaksanaan penanaman.
        </p>
      </div>

      {/* CONTAINER UTAMA */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col gap-5">
        {/* BARIS SEARCH & DROPDOWN FILTER */}
        <div className="flex flex-col xl:flex-row items-center gap-3">
          {/* Input Cari */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari ID penugasan, program, lokasi, KTH..."
              className="w-full pl-4 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 placeholder:text-slate-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <HiOutlineMagnifyingGlass className="w-4 h-4" />
            </button>
          </div>

          {/* Dropdown Jenis Program */}
          <div className="w-full xl:w-56">
            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="Semua Program">Semua Program</option>
                <option value="Program Rehabilitasi">Program Rehabilitasi</option>
                <option value="Program APBD">Program APBD</option>
                <option value="Program CSR">Program CSR</option>
              </select>
              <HiOutlineFolder className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          {/* Dropdown Jenis Kegiatan */}
          <div className="w-full xl:w-56">
            <div className="relative">
              <select
                value={selectedJenisKegiatan}
                onChange={(e) => setSelectedJenisKegiatan(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="Semua Jenis Kegiatan">Semua Jenis Kegiatan</option>
                <option value="Validasi Lokasi">Validasi Lokasi</option>
                <option value="Pelaksanaan Penanaman">Pelaksanaan Penanaman</option>
              </select>
              {selectedJenisKegiatan === 'Validasi Lokasi' ? (
                <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none w-3.5 h-3.5" />
              ) : selectedJenisKegiatan === 'Pelaksanaan Penanaman' ? (
                <SproutIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none w-3.5 h-3.5" />
              ) : (
                <HiOutlineClipboardDocumentList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
              )}
            </div>
          </div>

          {/* Date Picker Range */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-white w-full xl:w-auto shrink-0 text-xs text-slate-500">
            <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="focus:outline-none bg-transparent cursor-pointer text-slate-600"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="focus:outline-none bg-transparent cursor-pointer text-slate-600"
            />
          </div>
        </div>

        {/* BUTTON PILL STATUS FILTER */}
        <div className="flex items-center gap-2 flex-wrap border-b border-slate-100 pb-4">
          <button
            onClick={() => setSelectedStatus('Semua')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Semua'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineSparkles className="w-3.5 h-3.5 text-slate-400" />
            Semua
          </button>

          {/* Menunggu Penugasan (Ikon & Teks Warna Hijau) */}
          <button
            onClick={() => setSelectedStatus('Menunggu Penugasan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Menunggu Penugasan'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineUserPlus className="w-3.5 h-3.5 text-emerald-600" />
            Menunggu Penugasan
          </button>

          <button
            onClick={() => setSelectedStatus('Ditugaskan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Ditugaskan'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineCheck className="w-3.5 h-3.5 text-blue-600" />
            Ditugaskan
          </button>

          <button
            onClick={() => setSelectedStatus('Berjalan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Berjalan'
                ? 'bg-sky-50 text-sky-700 border border-sky-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineClock className="w-3.5 h-3.5 text-sky-600" />
            Berjalan
          </button>

          {/* Menunggu Verifikasi (Ikon & Teks Warna Oranye) */}
          <button
            onClick={() => setSelectedStatus('Menunggu Verifikasi')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Menunggu Verifikasi'
                ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineDocumentCheck className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Verifikasi
          </button>

          <button
            onClick={() => setSelectedStatus('Selesai')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedStatus === 'Selesai'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Selesai
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
              <thead className="text-[11px] text-[#3A4D3F] bg-[#EAF2EC] font-bold tracking-wider uppercase">
                <tr>
                  <th className="px-4 py-3.5 text-center font-bold">NO</th>
                  <th className="px-4 py-3.5 font-bold">PROGRAM</th>
                  <th className="px-4 py-3.5 font-bold">LOKASI</th>
                  <th className="px-4 py-3.5 font-bold">JENIS KEGIATAN</th>
                  <th className="px-4 py-3.5 font-bold">WILAYAH</th>
                  <th className="px-4 py-3.5 font-bold">PENYULUH</th>
                  <th className="px-4 py-3.5 font-bold">STATUS</th>
                  <th className="px-4 py-3.5 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada data yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{item.program}</td>
                      <td className="px-4 py-3.5 text-slate-600">{item.lokasi}</td>
                      
                      {/* BADGE JENIS KEGIATAN */}
                      <td className="px-4 py-3.5">
                        {renderJenisKegiatanBadge(item.jenisKegiatan)}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">{item.wilayah}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{item.penyuluh || '-'}</td>
                      
                      {/* BADGE STATUS KHUSUS TABEL */}
                      <td className="px-4 py-3.5">
                        {renderStatusBadge(item.status)}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {item.status === 'Menunggu Penugasan' ? (
                          <button
                            onClick={() => handleTugaskan(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                          >
                            <HiOutlineUserPlus className="w-3.5 h-3.5" />
                            Tugaskan
                          </button>
                        ) : item.status === 'Menunggu Verifikasi' ? (
                          <button
                            onClick={() => handleVerifikasi(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 shadow-2xs cursor-pointer"
                          >
                            <HiOutlineClipboardDocumentCheck className="w-3.5 h-3.5" />
                            Verifikasi
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBukaDetail(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                          >
                            <HiOutlineEye className="w-3.5 h-3.5" />
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-3 border-t border-slate-100 bg-white">
            <span>
              Menampilkan {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <HiChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center cursor-pointer ${
                    currentPage === page
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-500'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <HiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalBuatPenugasan isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TugaskanModal
        isOpen={isTugaskanModalOpen}
        onClose={() => setIsTugaskanModalOpen(false)}
        data={selectedPenugasan}
        onSuccess={() => {
          setIsTugaskanModalOpen(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default PenugasanPenyuluh;