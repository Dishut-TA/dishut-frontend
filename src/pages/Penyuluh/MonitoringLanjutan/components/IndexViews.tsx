import { useState, useEffect } from 'react';
import {
  HiOutlineMagnifyingGlass, HiOutlineMapPin,
  HiChevronLeft, HiChevronRight, HiOutlineCalendar, HiChevronDown
} from 'react-icons/hi2';
import { getPeriodeBadge, getStatusBadgeStyles } from '../constants';

export const HeaderAndFilter = ({
  searchQuery,
  setSearchQuery,
  programFilter,
  setProgramFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  programFilter: string;
  setProgramFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}) => (
  <div className="flex flex-col gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Monitoring Program Rehabilitasi</h1>
      <p className="text-sm font-medium text-slate-500">
        Daftar seluruh program rehabilitasi mangrove yang sedang Anda dampingi.
      </p>
    </div>

    {/* Integrated Control Row: Search, Program Dropdown, and Date Range */}
    <div className="flex flex-col xl:flex-row items-center gap-3 w-full mt-2">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <input
          type="text"
          placeholder="Cari program, KTH, atau lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-5 pr-11 py-2.5 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 text-slate-700 shadow-sm"
        />
        <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>

      {/* Filter Jenis Program */}
      <div className="relative w-full xl:w-48 shrink-0">
        <div className="flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-1 focus-within:ring-emerald-500">
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
            <span className="text-[10px] text-slate-400 font-medium leading-none">Periode Monitoring</span>
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
  </div>
);

const mapStatus = (status: string | undefined) => {
  if (!status) return 'Siap Monitoring';
  if (['Menunggu', 'Menunggu Verifikasi', 'MENUNGGU', 'Pending', 'PENDING', 'WAITING', 'Waiting', 'Berjalan', 'BERJALAN', 'Sedang berjalan', 'Selesai'].includes(status)) {
    return 'Siap Monitoring';
  }
  return status;
};

export const DataTable = ({
  navigate,
  data = [],
  isLoading = false,
  activeTab = 'Semua Program',
  searchQuery = '',
  programFilter = 'Semua',
  startDate = '',
  endDate = '',
}: {
  navigate: any;
  data?: any[];
  isLoading?: boolean;
  activeTab?: string;
  searchQuery?: string;
  programFilter?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatData = (item: any) => {
    const source = item.penugasanable;
    let nama = '-';
    let lokasiKab = '-';
    let desaKec = '-';
    let kth = '-';
    let jenisProgram = 'Program APBD';

    const zone = source?.analysis_result_zone || source?.analysisResultZone;
    const zoneLokasi = zone ? [zone.desa, zone.kecamatan, zone.kabupaten].filter(Boolean).join(', ') : '-';
    const zoneKth = zone?.nama_kelompok || '-';

    const kthObj = source?.kth || item.penyuluh?.kth;
    const kthLokasi = kthObj && kthObj.desa_kelurahan ? [kthObj.desa_kelurahan, kthObj.kabupaten_kota].filter(Boolean).join(', ') : '-';

    if (item.penugasanable_type === 'App\\Models\\DonationProgram') {
      nama = source?.name || source?.nama_program || '-';
      lokasiKab = source?.location || source?.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      desaKec = source?.location || source?.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      kth = kthObj?.name || kthObj?.nama || (zoneKth !== '-' ? zoneKth : '-');
      jenisProgram = 'Program Donasi';
    } else if (item.penugasanable_type === 'App\\Models\\ProgramApbd') {
      nama = source?.nama_program || source?.name || '-';
      lokasiKab = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      desaKec = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      kth = kthObj?.nama || kthObj?.name || (zoneKth !== '-' ? zoneKth : '-');
      jenisProgram = 'Program APBD';
    } else if (item.penugasanable_type === 'App\\Models\\ProgramCsr') {
      nama = source?.nama_program || source?.name || '-';
      lokasiKab = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      desaKec = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      kth = kthObj?.nama || kthObj?.name || (zoneKth !== '-' ? zoneKth : '-');
      jenisProgram = 'Proposal CSR';
    }

    // Jika jenis_kegiatan adalah 'Tindak Lanjut', badge selalu "Tindak Lanjut"
    // terlepas dari nilai status di DB (mis. 'Menunggu Evaluasi')
    let statusText = item.jenis_kegiatan === 'Tindak Lanjut'
      ? 'Tindak Lanjut'
      : mapStatus(item.status);
    let statusColorKey = 'siap';
    let statusSubText = '';

    if (statusText === 'Dalam Monitoring') {
      statusColorKey = 'berjalan';
    } else if (statusText === 'Menunggu Evaluasi') {
      statusColorKey = 'evaluasi';
    } else if (statusText === 'Monitoring Selesai') {
      statusColorKey = 'selesai';
    } else if (statusText === 'Tindak Lanjut') {
      statusColorKey = 'tindaklanjut';
    } else if (statusText === 'Dihentikan') {
      statusColorKey = 'dihentikan';
    } else if (statusText === 'Siap Monitoring') {
      statusColorKey = 'siap';
    }

    return {
      id: item.id,
      nama,
      desaKec,
      periode: item.periode_monitoring || 'P1',
      kth,
      lokasiKab,
      periodeAktif: `Target: ${item.batas_waktu || '-'}`,
      statusText,
      statusColorKey,
      statusSubText,
      jenisProgram,
      rawBatasWaktu: item.batas_waktu,
    };
  };

  // Filter Data
  const filteredData = data.map(formatData).filter((item) => {
    // Tab Filter
    let matchTab = false;
    if (activeTab === 'Semua Program') matchTab = true;
    else if (activeTab === 'Siap Monitoring' && item.statusText === 'Siap Monitoring') matchTab = true;
    else if (activeTab === 'Dalam Monitoring' && item.statusText === 'Dalam Monitoring') matchTab = true;
    else if (activeTab === 'Menunggu Evaluasi' && item.statusText === 'Menunggu Evaluasi') matchTab = true;
    else if (activeTab === 'Tindak Lanjut' && item.statusText === 'Tindak Lanjut') matchTab = true;
    else if (activeTab === 'Monitoring Selesai' && item.statusText === 'Monitoring Selesai') matchTab = true;
    else if (activeTab === 'Dihentikan' && item.statusText === 'Dihentikan') matchTab = true;

    // Search Query
    const matchSearch =
      item.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasiKab.toLowerCase().includes(searchQuery.toLowerCase());

    // Jenis Program
    const matchProgram = programFilter === 'Semua' ? true : item.jenisProgram === programFilter;

    // Date Range
    let matchDate = true;
    if (item.rawBatasWaktu) {
      const itemDate = new Date(item.rawBatasWaktu).toISOString().split('T')[0];
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;
    }

    return matchTab && matchSearch && matchProgram && matchDate;
  });

  // Reset page ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, programFilter, startDate, endDate]);

  // Pagination (Maksimal 5 data)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const startItem = filteredData.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
          <thead className="text-xs text-[#3A4D3F] bg-[#DCECE0] font-bold tracking-wider uppercase">
            <tr>
              <th className="px-4 py-4 text-center font-bold">No</th>
              <th className="px-4 py-4 font-bold">ID Program</th>
              <th className="px-4 py-4 font-bold">Nama Program</th>
              <th className="px-4 py-4 text-center font-bold">Periode Aktif</th>
              <th className="px-4 py-4 font-bold">KTH</th>
              <th className="px-4 py-4 font-bold">Lokasi</th>
              <th className="px-4 py-4 font-bold">Target</th>
              <th className="px-4 py-4 font-bold">Status Program</th>
              <th className="px-4 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500 font-medium">
                  Memuat data...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-slate-700 text-xs">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-4 font-bold text-[#008A4B] text-xs">{item.id}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900 text-xs mb-1">{item.nama}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" /> {item.desaKec}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{getPeriodeBadge(item.periode)}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-700">{item.kth}</td>
                  <td className="px-4 py-4 text-xs text-slate-700">{item.lokasiKab}</td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-600 whitespace-pre-line leading-relaxed">
                    {item.periodeAktif}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusBadgeStyles(item.statusColorKey)}`}
                      >
                        {item.statusText}
                      </span>
                      {item.statusSubText && (
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 ml-1">
                          {item.statusSubText === 'Baru' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                          {item.statusSubText}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.statusText === 'Siap Monitoring' ? (
                      <button
                        onClick={() =>
                          navigate(`/admin/penyuluh/monitoring-lanjutan/form/${item.id}`, {
                            state: { status: item.statusText },
                          })
                        }
                        className="inline-flex items-center justify-between w-36 px-4 py-2 text-xs font-bold text-white bg-[#008A4B] rounded-full hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                      >
                        Mulai Monitoring <HiChevronRight className="w-4 h-4 stroke-2" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/admin/penyuluh/monitoring-lanjutan/form/${item.id}`, {
                            state: { status: item.statusText },
                          })
                        }
                        className="px-4 py-1.5 text-xs font-bold text-[#008A4B] border border-[#008A4B] bg-white rounded-full hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Tampil 5 per halaman) */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-4 border-t border-slate-100 bg-white">
        <span className="font-medium">
          Menampilkan {startItem} - {endItem} dari {filteredData.length} data
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BottomBanner = () => (
  <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#f0f9f3] border border-[#DCECE0] rounded-xl p-4">
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs italic">
        i
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-0.5">Keterangan Status Program</h4>
        <p className="text-xs text-slate-600 leading-snug">
          Status program menunjukkan tahapan pelaksanaan rehabilitasi mangrove sesuai periode monitoring yang sedang berjalan.
        </p>
      </div>
    </div>
  </div>
);