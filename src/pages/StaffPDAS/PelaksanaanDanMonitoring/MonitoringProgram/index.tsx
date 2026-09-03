import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowPath,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineMinusCircle,
  HiChevronLeft,
  HiChevronRight,
  HiEllipsisVertical
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';
import { getAllPenugasanAPI, hentikanPenugasanAPI } from '@/services/penugasan.service';
import toast from 'react-hot-toast';

// 6 status resmi untuk Monitoring Program Rehabilitasi
type MonitoringStatus =
  | 'Siap Monitoring'
  | 'Berjalan'
  | 'Menunggu Evaluasi'
  | 'Tindak Lanjut'
  | 'Selesai'
  | 'Dihentikan';

const ITEMS_PER_PAGE = 5;

// Menentukan status monitoring (6 kategori) dari data mentah Penugasan.
// - jenisKegiatan 'Pelaksanaan Penanaman' -> program siap/masih dalam proses ditugaskan monitoring
// - jenisKegiatan 'Monitoring' -> status Berjalan / Menunggu Evaluasi / Selesai mengikuti status asli
// - jenisKegiatan 'Tindak Lanjut' -> status Tindak Lanjut (sampai Selesai/Dihentikan)
const deriveMonitoringStatus = (p: any): MonitoringStatus => {
  if (p.status === 'Dihentikan') return 'Dihentikan';

  if (p.jenisKegiatan === 'Tindak Lanjut') {
    return p.status === 'Selesai' ? 'Selesai' : 'Tindak Lanjut';
  }

  if (p.jenisKegiatan === 'Monitoring') {
    if (p.status === 'Selesai') return 'Selesai';
    if (p.status === 'Menunggu Evaluasi' || p.status === 'Menunggu Verifikasi') return 'Menunggu Evaluasi';
    return 'Berjalan';
  }

  // jenisKegiatan 'Pelaksanaan Penanaman' (atau lainnya) -> belum masuk tahap Monitoring/Tindak Lanjut
  return 'Siap Monitoring';
};

const MonitoringProgram: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua Status' | MonitoringStatus>('Semua Status');
  const [currentPage, setCurrentPage] = useState(1);

  const [penugasans, setPenugasans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  const fetchPenugasan = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPenugasanAPI();
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
    return penugasans
      // Validasi Lokasi & yang belum ditugaskan sama sekali bukan bagian dari Monitoring Program Rehabilitasi
      .filter((p: any) => p.jenisKegiatan !== 'Validasi Lokasi' && p.status !== 'Menunggu Penugasan')
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
        const periodeLabel = detail.periode_monitoring || p.jenisKegiatan || '-';

        const sortDate = p.created_at
          ? new Date(p.created_at)
          : (p.tanggalPenugasan && p.tanggalPenugasan !== '-' ? new Date(p.tanggalPenugasan) : null);

        return {
          id: p.penugasan_id || p.id,
          rawId: p.penugasan_id || p.id,
          program: programName,
          lokasi: location,
          kth: kthName,
          periodeLabel,
          periodeDate: p.batasWaktu ? new Date(p.batasWaktu).toLocaleDateString('id-ID') : '-',
          status: displayStatus,
          ringkasanTitle: displayStatus,
          ringkasanDesc: p.jenisKegiatan,
          tanggal: p.tanggalPenugasan && p.tanggalPenugasan !== '-'
            ? new Date(p.tanggalPenugasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-',
          waktu: sortDate ? sortDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-',
          sortTime: sortDate ? sortDate.getTime() : 0,
          canHentikan: ['Berjalan', 'Menunggu Evaluasi', 'Tindak Lanjut'].includes(displayStatus),
        };
      })
      // Terbaru dahulu
      .sort((a, b) => b.sortTime - a.sortTime);
  }, [penugasans]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return formattedData.filter((item) => {
      if (statusFilter !== 'Semua Status' && item.status !== statusFilter) return false;
      if (q) {
        const haystack = `${item.program} ${item.lokasi} ${item.kth}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [formattedData, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    siap: formattedData.filter(d => d.status === 'Siap Monitoring').length,
    berjalan: formattedData.filter(d => d.status === 'Berjalan').length,
    evaluasi: formattedData.filter(d => d.status === 'Menunggu Evaluasi').length,
    tindakLanjut: formattedData.filter(d => d.status === 'Tindak Lanjut').length,
    selesai: formattedData.filter(d => d.status === 'Selesai').length,
    dihentikan: formattedData.filter(d => d.status === 'Dihentikan').length,
  }), [formattedData]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('Semua Status');
    setCurrentPage(1);
  };

  const handleHentikan = async (id: string | number) => {
    if (!window.confirm('Yakin ingin menghentikan program ini? Status akan berubah menjadi "Dihentikan".')) return;
    setProcessingId(id);
    setOpenMenuId(null);
    try {
      await hentikanPenugasanAPI(id);
      toast.success('Program berhasil dihentikan.');
      await fetchPenugasan();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghentikan program.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: MonitoringStatus) => {
    switch (status) {
      case 'Siap Monitoring':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>{status}
          </span>
        );
      case 'Berjalan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{status}
          </span>
        );
      case 'Menunggu Evaluasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{status}
          </span>
        );
      case 'Tindak Lanjut':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{status}
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{status}
          </span>
        );
      case 'Dihentikan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>{status}
          </span>
        );
    }
  };

  const STATUS_LIST: MonitoringStatus[] = ['Siap Monitoring', 'Berjalan', 'Menunggu Evaluasi', 'Tindak Lanjut', 'Selesai', 'Dihentikan'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto bg-[#F8FAFC] min-h-screen font-sans text-slate-800">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Monitoring Program Rehabilitasi</h1>
          <p className="text-sm text-slate-500">Halaman ini digunakan untuk memantau progres program rehabilitasi P0-P4 dan hasil evaluasinya.</p>
        </div>
      </div>

      {/* STAT CARDS - dari data API, bukan mockup */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <PiPlant className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Siap Monitoring</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.siap}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <HiOutlineClipboardDocumentList className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Berjalan</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.berjalan}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <HiOutlineClock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Menunggu Evaluasi</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.evaluasi}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <HiOutlineArrowPath className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Tindak Lanjut</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.tindakLanjut}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Selesai</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.selesai}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <HiOutlineMinusCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">Dihentikan</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{stats.dihentikan}</span>
              <span className="text-xs text-slate-500 font-normal">program</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="relative flex-1 min-w-50">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari program / lokasi / KTH"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-slate-700 placeholder:text-slate-400 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:flex gap-3 items-center">
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer"
            >
              <option>Semua Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 h-9.5"
          >
            <HiOutlineArrowPath className="w-4 h-4" /> Reset
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 bg-white border border-[#008A4B] text-[#008A4B] hover:bg-emerald-50 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 h-9.5"
          >
            <HiOutlineFunnel className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Daftar Program Monitoring</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-250">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Program</th>
                <th className="py-3.5 px-6 font-semibold">Lokasi / KTH</th>
                <th className="py-3.5 px-6 font-semibold">Periode Aktif</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Ringkasan</th>
                <th className="py-3.5 px-6 font-semibold">Tanggal Terakhir</th>
                <th className="py-3.5 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">Tidak ada data program yang cocok dengan filter.</td>
                </tr>
              ) : currentData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 mb-0.5">{row.program}</p>
                    <p className="text-xs text-slate-400">ID: {row.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800 mb-0.5">{row.lokasi}</p>
                    <p className="text-xs text-slate-400">{row.kth}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800 mb-0.5">{row.periodeLabel}</p>
                    <p className="text-xs text-slate-400">{row.periodeDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800 mb-0.5">{row.ringkasanTitle}</p>
                    <p className="text-xs text-slate-400">{row.ringkasanDesc}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800 mb-0.5">{row.tanggal}</p>
                    <p className="text-xs text-slate-400">{row.waktu}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2 relative">
                      <button
                        className="px-3 py-1.5 bg-white border border-[#008A4B] text-[#008A4B] hover:bg-emerald-50 text-xs font-semibold rounded-lg transition-colors"
                        onClick={() => navigate(`/admin/staff/monitoring/verifikasi/detail/${row.id}`, { state: { status: row.status } })}
                      >
                        Lihat Progres
                      </button>

                      {row.canHentikan && (
                        <>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <HiEllipsisVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === row.id && (
                            <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44">
                              <button
                                disabled={processingId === row.id}
                                onClick={() => handleHentikan(row.rawId)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                {processingId === row.id ? 'Memproses...' : 'Hentikan Program'}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION - maks 5 data teratas (terbaru) per halaman */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-sm text-slate-500">
          <span>
            {filteredData.length === 0
              ? 'Menampilkan 0 dari 0 data'
              : `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari ${filteredData.length} data`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  page === currentPage
                    ? 'bg-[#008A4B] text-white shadow-sm'
                    : 'border border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MonitoringProgram;