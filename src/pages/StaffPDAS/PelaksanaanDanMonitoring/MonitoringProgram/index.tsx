import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineUserPlus,
  HiOutlineCheck, // Ikon ceklis untuk status Ditugaskan
  HiChevronLeft,
  HiChevronRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentCheck,
  HiOutlineCalendar,
  HiOutlineFolder,
  HiOutlineSparkles,
  HiOutlineMinusCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { getAllPenugasanAPI } from '@/services/penugasan.service';
import toast from 'react-hot-toast';

// Status resmi Monitoring
type MonitoringStatus =
  | 'Semua'
  | 'Siap Monitoring'
  | 'Ditugaskan'
  | 'Berjalan'
  | 'Menunggu Evaluasi'
  | 'Tindak Lanjut'
  | 'Selesai'
  | 'Dihentikan';

const ITEMS_PER_PAGE = 5;

// Menentukan status monitoring dari data mentah Penugasan
const deriveMonitoringStatus = (p: any): string => {
  if (p.status === 'Dihentikan') return 'Dihentikan';

  if (p.jenisKegiatan === 'Tindak Lanjut') {
    return p.status === 'Selesai' ? 'Selesai' : 'Tindak Lanjut';
  }

  if (p.jenisKegiatan === 'Monitoring') {
    if (p.status === 'Selesai') return 'Selesai';
    if (p.status === 'Menunggu Evaluasi' || p.status === 'Menunggu Verifikasi') return 'Menunggu Evaluasi';
    if (p.status === 'Ditugaskan') return 'Ditugaskan';
    return 'Berjalan';
  }

  return 'Siap Monitoring';
};

// Helper Warna Khusus Badge Status di DALAM TABEL
const renderStatusBadge = (status: string) => {
  const statusNormalized = status?.trim()?.toLowerCase();

  switch (statusNormalized) {
    case 'siap monitoring':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-emerald-700 bg-emerald-50 border-emerald-200">
          Siap Monitoring
        </span>
      );
    case 'ditugaskan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-blue-700 bg-blue-50 border-blue-200">
          Ditugaskan
        </span>
      );
    case 'berjalan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-sky-700 bg-sky-50 border-sky-200">
          Berjalan
        </span>
      );
    case 'menunggu evaluasi':
    case 'menunggu verifikasi':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-amber-700 bg-amber-50 border-amber-200">
          Menunggu Evaluasi
        </span>
      );
    case 'tindak lanjut':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-purple-700 bg-purple-50 border-purple-200">
          Tindak Lanjut
        </span>
      );
    case 'selesai':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-emerald-700 bg-emerald-50 border-emerald-200">
          Selesai
        </span>
      );
    case 'dihentikan':
      return (
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full border text-red-700 bg-red-50 border-red-200">
          Dihentikan
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

// Helper Filter Jenis Program (Hanya APBD & CSR)
const filterByProgram = (itemProgram: string, selectedProgram: string): boolean => {
  if (selectedProgram === 'Semua Program') return true;
  return itemProgram.toLowerCase().trim() === selectedProgram.toLowerCase().trim();
};

// Helper parsing tanggal aman
const parseSafeDate = (dateString: any): Date | null => {
  if (!dateString || dateString === '-') return null;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const MonitoringProgram: React.FC = () => {
  const navigate = useNavigate();

  // ==== FILTER STATE ====
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<MonitoringStatus>('Semua');
  const [selectedProgram, setSelectedProgram] = useState<string>('Semua Program');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [penugasans, setPenugasans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPenugasan = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPenugasanAPI();
      console.log(res);

      setPenugasans(res.data || []);
    } catch (error) {
      console.error('Gagal mengambil data penugasan', error);
      toast.error('Gagal memuat data Monitoring Program Rehabilitasi dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenugasan();
  }, []);

  const formattedData = useMemo(() => {
    if (!Array.isArray(penugasans)) return [];

    return penugasans
      .filter((p: any) => p && p.jenisKegiatan !== 'Validasi Lokasi' && p.status !== 'Menunggu Penugasan')
      .map((p: any) => {
        let programName = '-';
        let location = '-';
        let kthName = '-';

        const detail = p.detail || {};

        if (p.source_type === 'App\\Models\\DonationProgram') {
          programName = detail.name || '-';
          location = detail.location || '-';
          kthName = detail.kth?.name || detail.kth?.nama || '-';
        } else if (p.source_type === 'App\\Models\\ProgramApbd' || p.source_type === 'App\\Models\\ProgramCsr') {
          programName = detail.nama_program || '-';
          location = detail.lokasi || '-';
          kthName = detail.kth?.nama || detail.kth?.name || '-';
        }

        const displayStatus = deriveMonitoringStatus(p);
        const periodeLabel = detail.periode_monitoring || 'P1';

        const rawDateStr = p.created_at || (p.tanggalPenugasan !== '-' ? p.tanggalPenugasan : null);
        const sortDate = parseSafeDate(rawDateStr);
        const batasWaktuDate = parseSafeDate(p.batasWaktu);

        return {
          id: p.penugasan_id || p.id || '-',
          rawId: p.penugasan_id || p.id,
          program: programName,
          lokasi: location,
          kth: kthName,
          periodeLabel,
          periodeDate: batasWaktuDate ? batasWaktuDate.toLocaleDateString('id-ID') : '-',
          status: displayStatus,
          ringkasanTitle: displayStatus,
          ringkasanDesc: p.jenisKegiatan || '-',
          tanggal: sortDate
            ? sortDate.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            : '-',
          waktu: sortDate
            ? sortDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            : '-',
          rawDate: sortDate,
          sortTime: sortDate ? sortDate.getTime() : 0,
        };
      })
      .sort((a, b) => b.sortTime - a.sortTime);
  }, [penugasans]);

  // LOGIKA FILTER PERIODE TANGGAL & SEARCH
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return formattedData.filter((item) => {
      const itemStatusNorm = item.status?.trim()?.toLowerCase() || '';
      const selectedStatusNorm = selectedStatus.toLowerCase();

      // 1. Filter Status Pill
      if (selectedStatus !== 'Semua') {
        if (selectedStatus === 'Selesai') {
          if (
            itemStatusNorm !== 'selesai' &&
            itemStatusNorm !== 'menunggu evaluasi' &&
            itemStatusNorm !== 'monitoring selesai'
          ) {
            return false;
          }
        } else if (itemStatusNorm !== selectedStatusNorm) {
          return false;
        }
      }

      // 2. Filter Jenis Program
      if (!filterByProgram(item.program, selectedProgram)) {
        return false;
      }

      // 3. Filter Rentang Periode Tanggal
      if (startDate || endDate) {
        if (!item.rawDate) return false;

        const itemTime = item.rawDate.getTime();

        if (startDate) {
          const start = parseSafeDate(startDate);
          if (start) {
            start.setHours(0, 0, 0, 0);
            if (itemTime < start.getTime()) return false;
          }
        }

        if (endDate) {
          const end = parseSafeDate(endDate);
          if (end) {
            end.setHours(23, 59, 59, 999);
            if (itemTime > end.getTime()) return false;
          }
        }
      }

      // 4. Search Query
      if (q) {
        const haystack = `${item.program} ${item.lokasi} ${item.kth} ${item.id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [formattedData, selectedStatus, selectedProgram, searchTerm, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedProgram, searchTerm, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-8 bg-[#f8faf9] min-h-screen font-sans text-slate-800">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Monitoring Program Rehabilitasi</h1>
        <p className="text-sm text-slate-500">
          Halaman ini digunakan untuk memantau progres program rehabilitasi P0-P4 dan hasil evaluasinya.
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
              placeholder="Cari ID program, lokasi, KTH..."
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
                <option value="Program APBD">Program APBD</option>
                <option value="Program CSR">Program CSR</option>
              </select>
              <HiOutlineFolder className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          {/* Date Picker Range (FILTER PERIODE) */}
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
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Semua'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineSparkles className="w-3.5 h-3.5 text-slate-400" />
            Semua
          </button>

          {/* Siap Monitoring -> HiOutlineUserPlus */}
          <button
            onClick={() => setSelectedStatus('Siap Monitoring')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Siap Monitoring'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineUserPlus className="w-3.5 h-3.5 text-emerald-600" />
            Siap Monitoring
          </button>

          {/* Ditugaskan -> HiOutlineCheck */}
          <button
            onClick={() => setSelectedStatus('Ditugaskan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Ditugaskan'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineCheck className="w-3.5 h-3.5 text-blue-600" />
            Ditugaskan
          </button>

          <button
            onClick={() => setSelectedStatus('Berjalan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Berjalan'
                ? 'bg-sky-50 text-sky-700 border border-sky-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineClock className="w-3.5 h-3.5 text-sky-600" />
            Berjalan
          </button>

          <button
            onClick={() => setSelectedStatus('Menunggu Evaluasi')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Menunggu Evaluasi'
                ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineDocumentCheck className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Evaluasi
          </button>

          <button
            onClick={() => setSelectedStatus('Tindak Lanjut')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Tindak Lanjut'
                ? 'bg-purple-50 text-purple-700 border border-purple-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineArrowPath className="w-3.5 h-3.5 text-purple-600" />
            Tindak Lanjut
          </button>

          <button
            onClick={() => setSelectedStatus('Selesai')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Selesai'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Selesai
          </button>

          <button
            onClick={() => setSelectedStatus('Dihentikan')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedStatus === 'Dihentikan'
                ? 'bg-red-50 text-red-700 border border-red-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <HiOutlineMinusCircle className="w-3.5 h-3.5 text-red-600" />
            Dihentikan
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
                  <th className="px-4 py-3.5 font-bold">LOKASI / KTH</th>
                  <th className="px-4 py-3.5 font-bold">PERIODE AKTIF</th>
                  <th className="px-4 py-3.5 font-bold">STATUS</th>
                  <th className="px-4 py-3.5 font-bold">RINGKASAN</th>
                  <th className="px-4 py-3.5 font-bold">TANGGAL TERAKHIR</th>
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
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      Tidak ada data yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900 mb-0.5">{row.program}</p>
                        <p className="text-[11px] text-slate-400">ID: {row.id}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 mb-0.5">{row.lokasi}</p>
                        <p className="text-[11px] text-slate-400">{row.kth}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 mb-0.5">{row.periodeLabel}</p>
                        <p className="text-[11px] text-slate-400">{row.periodeDate}</p>
                      </td>

                      {/* BADGE STATUS */}
                      <td className="px-4 py-3.5">
                        {renderStatusBadge(row.status)}
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 mb-0.5">{row.ringkasanTitle}</p>
                        <p className="text-[11px] text-slate-400">{row.ringkasanDesc}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 mb-0.5">{row.tanggal}</p>
                        <p className="text-[11px] text-slate-400">{row.waktu}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {row.status === 'Siap Monitoring' ? (
                          <button
                            onClick={() =>
                              navigate(`/admin/staff/monitoring/verifikasi/tugaskan/${row.id}`, {
                                state: { status: row.status, mode: 'tugaskan' },
                              })
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer transition-colors shadow-xs"
                          >
                            <HiOutlineUserPlus className="w-3.5 h-3.5" />
                            Tugaskan
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/admin/staff/monitoring/verifikasi/detail/${row.id}`, {
                                state: { status: row.status },
                              })
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <HiOutlineEye className="w-3.5 h-3.5" />
                            Lihat Progres
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
                  className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center cursor-pointer ${currentPage === page
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
    </div>
  );
};

export default MonitoringProgram;