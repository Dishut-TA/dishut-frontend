import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllPenugasanAPI } from '@/services/penugasan.service';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineCalendar, 
  HiOutlineArrowPath,
  HiOutlineQrCode,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiEllipsisVertical
} from 'react-icons/hi2';

type BarisPelaporan = {
  rowKey: string;
  navId: number | string | null;
  id: string;
  nama: string;
  jenis: 'Donasi' | 'APBD' | 'CSR' | '-';
  tgl: string;
  realisasi: string;
  status: string;
};

const JENIS_PER_SUMBER: Record<string, BarisPelaporan['jenis']> = {
  'App\\Models\\DonationProgram': 'Donasi',
  'App\\Models\\ProgramApbd': 'APBD',
  'App\\Models\\ProgramCsr': 'CSR',
};

const tanggalId = (nilai?: string | null) => {
  if (!nilai || nilai === '-') return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Status laporan diturunkan dari status penugasan monitoring, karena modul ini
 * belum punya tabel laporan sendiri.
 */
const statusLaporan = (statusPenugasan?: string | null) => {
  const status = (statusPenugasan || '').toLowerCase();
  if (status.includes('dihentikan')) return 'Dihentikan';
  if (status.includes('selesai')) return 'Siap Dilaporkan';
  if (status.includes('menunggu')) return 'Menunggu Persetujuan';
  return 'Draft';
};

const PelaporanList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Semua Program');
  const [penugasans, setPenugasans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambil = async () => {
      try {
        const res = await getAllPenugasanAPI();
        setPenugasans(res?.data || []);
      } catch {
        toast.error('Gagal memuat daftar program untuk pelaporan.');
      } finally {
        setIsLoading(false);
      }
    };
    ambil();
  }, []);

  // Pelaporan hanya relevan untuk program berdana (Donasi/APBD/CSR) yang
  // penugasan monitoringnya sudah ada, bukan untuk baris Validasi Lokasi.
  const semuaBaris = useMemo<BarisPelaporan[]>(() => {
    return penugasans
      .filter((p: any) => p && JENIS_PER_SUMBER[p.source_type] && p.status !== 'Menunggu Penugasan')
      .map((p: any) => {
        const detail = p.detail || {};
        const jenis = JENIS_PER_SUMBER[p.source_type];
        const target = Number(detail.jumlah_bibit ?? detail.target_amount ?? detail.total_seeds_collected ?? 0);
        const realisasi = Number(detail.total_seeds_realized ?? 0);

        let ringkasan = 'Belum ada realisasi';
        if (target > 0) {
          const persen = ((realisasi / target) * 100).toFixed(1);
          ringkasan = `${realisasi.toLocaleString('id-ID')} / ${target.toLocaleString('id-ID')} bibit (${persen}%)`;
        }

        return {
          rowKey: p.row_key || `${p.source_type}_${p.original_id}_${p.penugasan_id ?? 'belum'}`,
          navId: p.penugasan_id ?? p.original_id ?? null,
          id: String(p.id ?? '-'),
          nama: p.program || '-',
          jenis,
          tgl: tanggalId(p.batasWaktu || p.tanggalPenugasan),
          realisasi: ringkasan,
          status: statusLaporan(p.status),
        };
      });
  }, [penugasans]);

  const dataTampil = useMemo(
    () => (activeTab === 'Semua Program' ? semuaBaris : semuaBaris.filter((b) => b.jenis === activeTab)),
    [semuaBaris, activeTab]
  );

  const ringkasanStatus = useMemo(() => ({
    total: semuaBaris.length,
    siap: semuaBaris.filter((b) => b.status === 'Siap Dilaporkan').length,
    menunggu: semuaBaris.filter((b) => b.status === 'Menunggu Persetujuan').length,
    disahkan: semuaBaris.filter((b) => b.status === 'Disahkan').length,
  }), [semuaBaris]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Siap Dilaporkan': return { badge: 'bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]', btn: 'text-emerald-700 border-emerald-500 hover:bg-emerald-50', label: 'Buat Laporan' };
      case 'Draft': return { badge: 'bg-orange-50 text-orange-600 border-orange-200', btn: 'text-orange-600 border-orange-400 hover:bg-orange-50', label: 'Lanjutkan' };
      case 'Menunggu Persetujuan': return { badge: 'bg-blue-50 text-blue-600 border-blue-200', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
      case 'Disahkan': return { badge: 'bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
      default: return { badge: 'bg-gray-100 text-gray-600 border-gray-200', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
    }
  };

  const handleActionClick = (item: BarisPelaporan) => {
    // Halaman detail me-resolve id lewat Penugasan::find(), jadi kirim id
    // numerik. Kode berformat seperti DON-2026-009 tidak bisa dicari backend.
    if (item.navId === null) {
      toast.error('Program ini belum punya penugasan, detail laporan belum tersedia.');
      return;
    }

    const tujuan = item.jenis === 'Donasi' ? 'donasi' : 'apbd';
    navigate(`/admin/staff/monitoring/pelaporan/${tujuan}/${item.navId}`, {
      state: { status: item.status, jenis: item.jenis },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Pelaporan Program</h1>
          <p className="text-sm text-gray-500 font-medium">Kelola laporan hasil pelaksanaan program berdasarkan data program yang tersedia.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <HiOutlineArrowPath className="w-4 h-4" /> Riwayat Laporan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineQrCode className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Total Program</p><p className="text-2xl font-bold text-gray-800 leading-none">{ringkasanStatus.total}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Seluruh program siap dipantau</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><HiOutlineUser className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Siap Dilaporkan</p><p className="text-2xl font-bold text-gray-800 leading-none">{ringkasanStatus.siap}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program dapat dibuatkan laporan</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><HiOutlineCalendarDays className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Menunggu Persetujuan</p><p className="text-2xl font-bold text-gray-800 leading-none">{ringkasanStatus.menunggu}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Laporan sedang diproses</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineCheckCircle className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Disahkan</p><p className="text-2xl font-bold text-gray-800 leading-none">{ringkasanStatus.disahkan}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Laporan telah disahkan</p></div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 px-6 gap-6 pt-4 scrollbar-hide">
          {['Semua Program', 'Donasi', 'APBD', 'CSR'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Cari program atau ID program..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] outline-none" />
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Jenis Program</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua</option></select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Status</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua</option></select>
          </div>
          <div className="w-full md:w-48 relative">
            <input type="text" placeholder="Pilih periode" className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none" />
            <HiOutlineCalendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="px-5 py-2.5 border border-gray-300 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 shrink-0 h-fit">
            <HiOutlineArrowPath className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Table */}
        <div className="p-5 border-b border-gray-50 pb-2">
          <h3 className="font-bold text-gray-800">Daftar Program Siap Dilaporkan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-[10px] font-bold text-gray-500 border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 pr-2">No</th>
                <th className="py-4 px-2 text-left">ID Program</th>
                <th className="py-4 px-2 text-left">Nama Program</th>
                <th className="py-4 px-2 text-center">Jenis Program</th>
                <th className="py-4 px-2 text-left">Tanggal Selesai</th>
                <th className="py-4 px-2 text-left">Realisasi Utama</th>
                <th className="py-4 px-2 text-center">Status Laporan</th>
                <th className="py-4 pr-6 pl-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">Memuat data program...</td>
                </tr>
              ) : dataTampil.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">Belum ada program yang siap dilaporkan.</td>
                </tr>
              ) : dataTampil.map((item, idx) => {
                const style = getStatusStyle(item.status);
                return (
                  <tr key={item.rowKey} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-6 pr-2 font-medium text-gray-600">{idx + 1}</td>
                    <td className="py-4 px-2 font-medium text-gray-600">{item.id}</td>
                    <td className="py-4 px-2 font-bold text-gray-800 w-56 whitespace-normal leading-snug">{item.nama}</td>
                    <td className="py-4 px-2 text-center font-medium text-gray-600">{item.jenis}</td>
                    <td className="py-4 px-2 font-medium text-gray-600">{item.tgl}</td>
                    <td className="py-4 px-2 font-medium text-gray-600 w-48 whitespace-normal leading-snug">{item.realisasi}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full ${style.badge}`}>{item.status}</span>
                    </td>
                    <td className="py-4 pr-6 pl-2">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleActionClick(item)} className={`px-4 py-1.5 text-[10px] font-bold border rounded-lg bg-white transition-colors ${style.btn}`}>
                          {style.label}
                        </button>
                        <button className="text-gray-400 hover:text-gray-700"><HiEllipsisVertical className="w-5 h-5"/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 flex justify-between items-center text-xs text-gray-500 border-t border-gray-50">
          <span>Menampilkan {dataTampil.length} dari {semuaBaris.length} data</span>
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none font-medium text-gray-700 bg-white cursor-pointer"><option>10 / halaman</option></select>
            <div className="flex gap-1">
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&lt;</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#185325] text-white font-bold">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">2</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">3</button>
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PelaporanList;