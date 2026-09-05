import React, { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineArrowPath,
  HiOutlineFunnel,
  HiOutlineUserPlus,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import ModalBuatPenugasan from './components/CreatePenugasanModal';
import TugaskanModal from './components/TugaskanModal';
import { useNavigate } from 'react-router-dom';

type JenisKegiatan = 'Validasi Lokasi' | 'Pelaksanaan Penanaman';
type StatusPenugasan = 'Menunggu Penugasan' | 'Ditugaskan' | 'Berjalan' | 'Menunggu Verifikasi' | 'Selesai' | 'Menunggu Evaluasi' | 'Monitoring Selesai' | 'Tindak Lanjut';

const normalizeStatus = (status: StatusPenugasan) =>
  status === 'Menunggu Evaluasi' ? 'Selesai' : status;

interface PenugasanData {
  id: string;
  program: string;
  lokasi: string;
  jenisKegiatan: JenisKegiatan;
  wilayah: string;
  rencanaPeriode: string;
  penyuluh: string;
  status: StatusPenugasan;
  tanggalPenugasan: string;
  source_type: string;
  penugasan_id?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 5;

const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 12 7 12 7 7C7 12 12 12 12 12ZM12 12C12 12 17 12 17 7C17 12 12 12 12 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 22H16" />
  </svg>
);

const PenugasanPenyuluh: React.FC = () => {
  const [penugasanData, setPenugasanData] = useState<PenugasanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTugaskanModalOpen, setIsTugaskanModalOpen] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState<PenugasanData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ==== FILTER STATE ====
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('Semua Wilayah');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterPenyuluh, setFilterPenyuluh] = useState('Semua Penyuluh');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPenugasan = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${API_URL}/penugasan`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const json = await res.json();
        setPenugasanData(json.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, [refreshKey]);

  const navigate = useNavigate();

  const getStatusStyle = (status: StatusPenugasan) => {
    switch (status) {
      case 'Menunggu Penugasan': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Ditugaskan': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Berjalan': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Menunggu Verifikasi': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Selesai': return 'bg-green-50 text-green-600 border-green-100';
      case 'Menunggu Evaluasi': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Monitoring Selesai': return 'bg-green-50 text-green-600 border-green-100';
      case 'Tindak Lanjut': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTugaskan = (item: PenugasanData) => {
    setSelectedPenugasan(item);
    setIsTugaskanModalOpen(true);
  };

  // Hardcode di frontend: status Menunggu Evaluasi langsung dianggap selesai
  const handleSelesaikanEvaluasi = async (item: PenugasanData) => {
    const targetId = item.penugasan_id || item.id;
    const confirmed = window.confirm('Tandai penugasan ini sebagai Selesai?');
    if (!confirmed) return;

    setPenugasanData(prev => prev.map(p =>
      (p.penugasan_id || p.id) === targetId ? { ...p, status: 'Selesai' as StatusPenugasan } : p
    ));
  };

  // Navigasi ke Halaman Detail sambil MENGIRIMKAN STATUS
  const handleBukaDetail = (item: PenugasanData) => {
    const targetId = item.penugasan_id || item.id;
    navigate(`/admin/staff/monitoring/penugasan-pelaksanaan/detail/${targetId}`, {
      state: {
        status: item.status,
        jenisKegiatan: item.jenisKegiatan,
        data: item
      }
    });
  };

  // ==== OPSI FILTER DINAMIS (diambil dari data API, bukan hardcode) ====
  const wilayahOptions = useMemo(() => {
    const set = new Set(penugasanData.map((d) => d.wilayah).filter((w) => w && w !== '-'));
    return Array.from(set).sort();
  }, [penugasanData]);

  const statusOptions = useMemo(() => {
    const set = new Set(penugasanData.map((d) => normalizeStatus(d.status)).filter(Boolean));
    return Array.from(set).sort();
  }, [penugasanData]);

  const penyuluhOptions = useMemo(() => {
    const set = new Set(penugasanData.map((d) => d.penyuluh).filter((p) => p && p !== '-'));
    return Array.from(set).sort();
  }, [penugasanData]);

  // ==== APPLY TAB + FILTER + SORT (terbaru dahulu) ====
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let result = penugasanData.filter((item) => {
      const resolvedStatus = normalizeStatus(item.status);

      if (activeTab !== 'Semua' && item.jenisKegiatan !== activeTab) return false;
      if (filterWilayah !== 'Semua Wilayah' && item.wilayah !== filterWilayah) return false;
      if (filterStatus !== 'Semua Status' && resolvedStatus !== filterStatus) return false;
      if (filterPenyuluh !== 'Semua Penyuluh' && item.penyuluh !== filterPenyuluh) return false;

      if (q) {
        const haystack = `${item.program} ${item.lokasi} ${item.penyuluh}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    // Sort terbaru: pakai created_at bila ada, fallback ke tanggalPenugasan
    result = result.slice().sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.tanggalPenugasan && a.tanggalPenugasan !== '-' ? new Date(a.tanggalPenugasan).getTime() : 0);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.tanggalPenugasan && b.tanggalPenugasan !== '-' ? new Date(b.tanggalPenugasan).getTime() : 0);
      return dateB - dateA;
    });

    return result;
  }, [penugasanData, activeTab, searchTerm, filterWilayah, filterStatus, filterPenyuluh]);

  // Reset ke halaman 1 setiap kali filter/tab berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterWilayah, filterStatus, filterPenyuluh]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleReset = () => {
    setSearchTerm('');
    setFilterWilayah('Semua Wilayah');
    setFilterStatus('Semua Status');
    setFilterPenyuluh('Semua Penyuluh');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-8 bg-[#f8faf9] min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Penugasan Kegiatan</h1>
          <p className="text-sm text-gray-500">Kelola penugasan penyuluh untuk kegiatan validasi lokasi dan pelaksanaan penanaman.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

        {/* TABS */}
        <div className="flex gap-6 px-6 border-b border-gray-100 pt-4 overflow-x-auto whitespace-nowrap">
          {['Semua', 'Validasi Lokasi', 'Pelaksanaan Penanaman'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer ${activeTab === tab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="p-5 flex flex-col xl:flex-row gap-4 border-b border-gray-100 items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full xl:flex-1">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari program, lokasi, atau penyuluh..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={filterWilayah}
              onChange={(e) => setFilterWilayah(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white appearance-none cursor-pointer"
            >
              <option>Semua Wilayah</option>
              {wilayahOptions.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white appearance-none cursor-pointer"
            >
              <option>Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={filterPenyuluh}
              onChange={(e) => setFilterPenyuluh(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white appearance-none cursor-pointer"
            >
              <option>Semua Penyuluh</option>
              {penyuluhOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <HiOutlineArrowPath className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <HiOutlineFunnel className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-gray-600 min-w-250 xl:min-w-full">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">No</th>
                <th className="px-4 py-4 whitespace-nowrap">Program</th>
                <th className="px-4 py-4 whitespace-nowrap">Lokasi</th>
                <th className="px-4 py-4 whitespace-nowrap">Jenis Kegiatan</th>
                <th className="px-4 py-4 whitespace-nowrap">Wilayah</th>
                <th className="px-4 py-4 whitespace-nowrap">Rencana/Periode</th>
                <th className="px-4 py-4 whitespace-nowrap">Penyuluh</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-4 whitespace-nowrap">Tanggal Penugasan</th>
                <th className="px-4 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">Tidak ada data yang cocok dengan filter.</td>
                </tr>
              ) : paginatedData.map((item, index) => {
                const resolvedStatus = normalizeStatus(item.status);

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="px-4 py-4 text-gray-900 font-medium min-w-45 leading-snug">{item.program}</td>
                    <td className="px-4 py-4 text-xs min-w-40 leading-snug text-gray-600">{item.lokasi}</td>
                    <td className="px-4 py-4">
                      {item.jenisKegiatan === 'Validasi Lokasi' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                          <HiOutlineMapPin className="w-3.5 h-3.5" /> Validasi Lokasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                          <SproutIcon className="w-3.5 h-3.5" /> Pelaksanaan Penanaman
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs whitespace-nowrap">{item.wilayah}</td>
                    <td className="px-4 py-4 text-xs whitespace-pre-line text-gray-500 leading-snug min-w-30">{item.rencanaPeriode}</td>
                    <td className="px-4 py-4 text-xs font-medium text-gray-700 whitespace-nowrap">{item.penyuluh}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${getStatusStyle(resolvedStatus)}`}>
                        {resolvedStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">{item.tanggalPenugasan}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                        {item.status === 'Menunggu Penugasan' && (
                          <button
                            onClick={() => handleTugaskan(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008A4B] hover:bg-emerald-800 text-white text-[11px] font-bold rounded-full transition-colors shadow-sm cursor-pointer"
                          >
                            <HiOutlineUserPlus className="w-3.5 h-3.5" /> Tugaskan
                          </button>
                        )}

                        {(item.status === 'Berjalan' || item.status === 'Menunggu Verifikasi' || resolvedStatus === 'Selesai' || item.status === 'Ditugaskan') && (
                          <button
                            onClick={() => handleBukaDetail(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-full transition-colors shadow-sm cursor-pointer"
                          >
                            <HiOutlineEye className="w-3.5 h-3.5" /> Detail
                          </button>
                        )}

                        {(item.status === 'Monitoring Selesai' || item.status === 'Tindak Lanjut') && (
                          <button
                            onClick={() => handleBukaDetail(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-full transition-colors shadow-sm cursor-pointer"
                          >
                            <HiOutlineEye className="w-3.5 h-3.5" /> Detail
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION - maks 5 data teratas (terbaru) per halaman */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-sm text-gray-500">
          <span>
            {filteredData.length === 0
              ? 'Menampilkan 0 dari 0 data'
              : `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari ${filteredData.length} data`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
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
          setRefreshKey(prev => prev + 1);
        }}
      />

    </div>
  );
};

export default PenugasanPenyuluh;