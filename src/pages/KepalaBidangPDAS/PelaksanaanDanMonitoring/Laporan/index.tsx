import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getAllPenugasanAPI } from '@/services/penugasan.service';
import { kunciProgram, waktuTerakhir } from '@/utils/programDashboard';

const PER_HALAMAN = 10;

const JENIS_PER_SUMBER: Record<string, 'Donasi' | 'APBD' | 'CSR'> = {
  'App\\Models\\DonationProgram': 'Donasi',
  'App\\Models\\ProgramApbd': 'APBD',
  'App\\Models\\ProgramCsr': 'CSR',
};

/**
 * Status penugasan yang berarti kegiatannya sudah tuntas dan laporannya
 * layak diarsipkan. Modul ini belum punya tabel laporan tersendiri, jadi
 * daftar laporan diturunkan dari penugasan yang sudah selesai.
 */
const STATUS_SELESAI = ['Selesai', 'Monitoring Selesai'];

interface BarisLaporan {
  rowKey: string;
  navId: number | null;
  idLaporan: string;
  jenisLaporan: string;
  jenisProgram: string;
  program: string;
  lokasi: string;
  penyuluh: string;
  tanggal: string;
  waktu: number;
}

const tanggalId = (nilai?: string | null) => {
  if (!nilai || nilai === '-') return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Kode laporan mengikuti pola pada rancangan: PLKS-2026-00034, MNT-2026-00027. */
const kodeLaporan = (jenisKegiatan: string, penugasanId: number, tanggal?: string | null) => {
  const awalan = jenisKegiatan.toLowerCase().includes('monitoring') ? 'MNT' : 'PLKS';
  const tahun = tanggal && !Number.isNaN(new Date(tanggal).getTime())
    ? new Date(tanggal).getFullYear()
    : new Date().getFullYear();
  return `${awalan}-${tahun}-${String(penugasanId).padStart(5, '0')}`;
};

const WARNA_PROGRAM: Record<string, string> = {
  Donasi: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  APBD: 'bg-blue-50 text-blue-700 border-blue-200',
  CSR: 'bg-purple-50 text-purple-700 border-purple-200',
};

const LaporanKabid: React.FC = () => {
  const navigate = useNavigate();
  const [penugasans, setPenugasans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cari, setCari] = useState('');
  const [filterProgram, setFilterProgram] = useState('Semua Program');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis');
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    const ambil = async () => {
      try {
        const res = await getAllPenugasanAPI();
        setPenugasans(res?.data || []);
      } catch {
        toast.error('Gagal memuat daftar laporan.');
      } finally {
        setIsLoading(false);
      }
    };
    ambil();
  }, []);

  const semua = useMemo<BarisLaporan[]>(() => {
    return penugasans
      .filter(
        (p: any) =>
          p &&
          JENIS_PER_SUMBER[p.source_type] &&
          p.penugasan_id &&
          STATUS_SELESAI.includes(p.status)
      )
      .map((p: any) => ({
        rowKey: p.row_key || `${kunciProgram(p)}_${p.penugasan_id}`,
        navId: p.penugasan_id,
        idLaporan: kodeLaporan(p.jenisKegiatan || '', p.penugasan_id, p.tanggalPenugasan),
        jenisLaporan: (p.jenisKegiatan || '').toLowerCase().includes('monitoring')
          ? 'Monitoring'
          : 'Pelaksanaan',
        jenisProgram: JENIS_PER_SUMBER[p.source_type],
        program: p.program || '-',
        lokasi: p.lokasi || p.wilayah || '-',
        penyuluh: p.penyuluh && p.penyuluh !== '-' ? p.penyuluh : '-',
        tanggal: tanggalId(p.batasWaktu || p.tanggalPenugasan || p.updated_at || p.created_at),
        waktu: waktuTerakhir(p),
      }))
      .sort((a, b) => b.waktu - a.waktu);
  }, [penugasans]);

  const terfilter = useMemo(() => {
    const q = cari.trim().toLowerCase();

    return semua.filter((b) => {
      if (filterProgram !== 'Semua Program' && b.jenisProgram !== filterProgram) return false;
      if (filterJenis !== 'Semua Jenis' && b.jenisLaporan !== filterJenis) return false;
      if (q) {
        const gabungan = `${b.idLaporan} ${b.program} ${b.penyuluh} ${b.lokasi}`.toLowerCase();
        if (!gabungan.includes(q)) return false;
      }
      return true;
    });
  }, [semua, cari, filterProgram, filterJenis]);

  useEffect(() => setHalaman(1), [cari, filterProgram, filterJenis]);

  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / PER_HALAMAN));
  const mulai = (halaman - 1) * PER_HALAMAN;
  const tampil = terfilter.slice(mulai, mulai + PER_HALAMAN);

  const ringkasan = useMemo(
    () => ({
      total: semua.length,
      pelaksanaan: semua.filter((b) => b.jenisLaporan === 'Pelaksanaan').length,
      monitoring: semua.filter((b) => b.jenisLaporan === 'Monitoring').length,
    }),
    [semua]
  );

  const reset = () => {
    setCari('');
    setFilterProgram('Semua Program');
    setFilterJenis('Semua Jenis');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Laporan</h1>
        <p className="text-sm text-slate-500 font-medium">
          Arsip laporan pelaksanaan dan monitoring yang telah selesai diverifikasi, siap ditinjau dan diunduh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Laporan', nilai: ringkasan.total, ket: 'Laporan tersimpan', Ikon: HiOutlineDocumentText, warna: 'bg-emerald-50 text-emerald-600' },
          { label: 'Laporan Pelaksanaan', nilai: ringkasan.pelaksanaan, ket: 'Kegiatan penanaman', Ikon: HiOutlineClipboardDocumentCheck, warna: 'bg-blue-50 text-blue-600' },
          { label: 'Laporan Monitoring', nilai: ringkasan.monitoring, ket: 'Hasil pemantauan', Ikon: HiOutlineCheckCircle, warna: 'bg-purple-50 text-purple-600' },
        ].map(({ label, nilai, ket, Ikon, warna }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${warna}`}>
              <Ikon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">{label}</p>
              <p className="text-2xl font-bold text-slate-900 leading-none">{nilai.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{ket}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">

        <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari ID laporan, program, lokasi, atau penyuluh..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Jenis Program</label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none cursor-pointer"
            >
              {['Semua Program', 'Donasi', 'APBD', 'CSR'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Jenis Laporan</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none cursor-pointer"
            >
              {['Semua Jenis', 'Pelaksanaan', 'Monitoring'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <button
            onClick={reset}
            className="px-5 py-2.5 border border-slate-300 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 shrink-0 h-fit cursor-pointer transition-colors"
          >
            <HiOutlineArrowPath className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="p-5 pb-2">
          <h3 className="font-bold text-slate-800">Daftar Laporan Selesai Diverifikasi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-[10px] font-bold text-slate-500 border-b border-slate-100 bg-slate-50/50 uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 pr-2">No</th>
                <th className="py-4 px-2">ID Laporan</th>
                <th className="py-4 px-2">Jenis Laporan</th>
                <th className="py-4 px-2 text-center">Jenis Program</th>
                <th className="py-4 px-2">Program</th>
                <th className="py-4 px-2">Lokasi</th>
                <th className="py-4 px-2">Penyuluh</th>
                <th className="py-4 px-2">Tanggal</th>
                <th className="py-4 pr-6 pl-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center text-slate-500 font-medium">Memuat daftar laporan...</td></tr>
              ) : tampil.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500 font-medium">
                    {semua.length === 0
                      ? 'Belum ada laporan yang selesai diverifikasi.'
                      : 'Tidak ada laporan yang cocok dengan filter.'}
                  </td>
                </tr>
              ) : tampil.map((row, idx) => (
                <tr key={row.rowKey} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-6 pr-2 font-medium text-slate-600">{mulai + idx + 1}</td>
                  <td className="py-4 px-2 font-bold text-slate-800">{row.idLaporan}</td>
                  <td className="py-4 px-2 font-medium text-slate-600">{row.jenisLaporan}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full ${WARNA_PROGRAM[row.jenisProgram] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {row.jenisProgram}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-bold text-slate-800 w-56 whitespace-normal leading-snug">{row.program}</td>
                  <td className="py-4 px-2 font-medium text-slate-600 w-48 whitespace-normal leading-snug">{row.lokasi}</td>
                  <td className="py-4 px-2 font-medium text-slate-600">{row.penyuluh}</td>
                  <td className="py-4 px-2 font-medium text-slate-600">{row.tanggal}</td>
                  <td className="py-4 pr-6 pl-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() =>
                          navigate(`/admin/kabid/monitoring/dashboard/detail/${row.navId}`, {
                            state: {
                              kategori: row.jenisLaporan === 'Monitoring' ? 'Monitoring' : 'Pelaksanaan',
                              status: 'Selesai',
                            },
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold border border-[#185325] text-[#185325] rounded-lg bg-white hover:bg-[#f0f9f3] transition-colors cursor-pointer"
                      >
                        <HiOutlineEye className="w-3.5 h-3.5" /> Lihat Laporan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 border-t border-slate-50">
          <span>
            Menampilkan {terfilter.length === 0 ? 0 : mulai + 1} - {Math.min(mulai + PER_HALAMAN, terfilter.length)} dari {terfilter.length} data
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHalaman((h) => Math.max(1, h - 1))}
              disabled={halaman === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setHalaman(n)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                  n === halaman ? 'bg-[#185325] text-white' : 'border border-slate-200 hover:bg-slate-50 font-medium'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))}
              disabled={halaman === totalHalaman}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LaporanKabid;
