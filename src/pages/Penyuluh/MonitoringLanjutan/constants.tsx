import React from 'react';
import { 
  HiOutlineDocumentText, HiOutlinePlayCircle, HiOutlineClock, 
  HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineXCircle 
} from 'react-icons/hi2';

export type ViewMode = 'rekap' | 'table' | 'input' | 'edit';
export type MonitoringStatus = 'Siap Monitoring' | 'Berjalan' | 'Menunggu Evaluasi' | 'Tindak Lanjut' | 'Selesai' | 'Dihentikan';
export type TabStatus = 'Semua Program' | 'Siap Monitoring' | 'Dalam Monitoring' | 'Menunggu Evaluasi' | 'Tindak Lanjut' | 'Monitoring Selesai' | 'Dihentikan';

export interface MonitoringRow {
  id: string;
  idTanaman: string;
  jenisTanaman: string;
  koordinat: string;
  tinggiAwal: string;
  waktuPelaksanaan: string;
  fotoSebelum: boolean;
  fotoSesudah: boolean;
  waktuMonitoring: string | null;
  tinggiSaatMonitoring: string | null;
  kondisiTanaman: 'Sehat' | 'Perlu Perawatan' | 'Rusak Ringan' | 'Belum Disulam' | 'Sudah Disulam' | '-';
  status: 'Hidup' | 'Mati' | '-';
}

export interface ProgramMonitoring {
  id: string;
  nama: string;
  desaKec: string;
  periode: string;
  kth: string;
  lokasiKab: string;
  periodeAktif: string;
  statusText: string;
  statusSubText?: string;
  statusColorKey: string;
}

export const MOCK_DASHBOARD_DATA: Record<string, any> = {
  'PRG-2026-0030': { nama: 'Rehabilitasi Mangrove Tanjungpura', lokasi: 'Desa Tanjungpura, Kec. Karangampel,\nKab. Indramayu', periode: 'P1' },
  'PRG-2026-0012': { nama: 'Rehabilitasi Mangrove Eretan', lokasi: 'Desa Eretan, Kec. Kandanghaur,\nKab. Indramayu', periode: 'P1' },
  'PRG-2026-0007': { nama: 'Rehabilitasi Mangrove Karangsong', lokasi: 'Desa Karangsong, Kec. Indramayu,\nKab. Indramayu', periode: 'P1' },
  'PRG-2026-0018': { nama: 'Rehabilitasi Mangrove Kertasemaya', lokasi: 'Desa Kertasemaya, Kec. Kertasemaya,\nKab. Indramayu', periode: 'P2' },
  'PRG-2026-0021': { nama: 'Rehabilitasi Mangrove Pawidean', lokasi: 'Desa Pawidean, Kec. Juntinyuat,\nKab. Indramayu', periode: 'P3' },
};

export const MOCK_REKAP_DATA = [
  { pu: 'PU-01', total: 520, hidup: 460, pctHidup: 88, mati: 30, pctMati: 6, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:30' },
  { pu: 'PU-02', total: 510, hidup: 440, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:35' },
  { pu: 'PU-03', total: 500, hidup: 430, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:40' },
  { pu: 'PU-04', total: 500, hidup: 430, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:45' },
  { pu: 'PU-05', total: 500, hidup: 440, pctHidup: 88, mati: 30, pctMati: 6, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:50' },
];

export const MOCK_TABLE_DATA: MonitoringRow[] = [
  {
    id: '1', idTanaman: 'PRG26-0007-PU03-001', jenisTanaman: 'Rhizophora', koordinat: '6.841232° S\n107.564891° E',
    tinggiAwal: '15 cm', waktuPelaksanaan: '25 Mei 2026, 08:12', fotoSebelum: true, fotoSesudah: true,
    waktuMonitoring: '27 Mei 2026, 10:32', tinggiSaatMonitoring: '33 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
  },
  {
    id: '2', idTanaman: 'PRG26-0007-PU03-002', jenisTanaman: 'Avicennia', koordinat: '6.841315° S\n107.564905° E',
    tinggiAwal: '18 cm', waktuPelaksanaan: '25 Mei 2026, 08:13', fotoSebelum: true, fotoSesudah: true,
    waktuMonitoring: '27 Mei 2026, 10:33', tinggiSaatMonitoring: '27 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
  },
  {
    id: '3', idTanaman: 'PRG26-0007-PU03-003', jenisTanaman: 'Sonneratia', koordinat: '6.841401° S\n107.564910° E',
    tinggiAwal: '12 cm', waktuPelaksanaan: '25 Mei 2026, 08:14', fotoSebelum: true, fotoSesudah: false,
    waktuMonitoring: null, tinggiSaatMonitoring: '-', kondisiTanaman: 'Perlu Perawatan', status: 'Hidup',
  },
  {
    id: '4', idTanaman: 'PRG26-0007-PU03-004', jenisTanaman: 'Rhizophora', koordinat: '6.841487° S\n107.564830° E',
    tinggiAwal: '16 cm', waktuPelaksanaan: '25 Mei 2026, 08:15', fotoSebelum: true, fotoSesudah: true,
    waktuMonitoring: '27 Mei 2026, 10:35', tinggiSaatMonitoring: '29 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
  },
  {
    id: '5', idTanaman: 'PRG26-0007-PU03-005', jenisTanaman: 'Avicennia', koordinat: '6.841519° S\n107.564850° E',
    tinggiAwal: '17 cm', waktuPelaksanaan: '25 Mei 2026, 08:16', fotoSebelum: true, fotoSesudah: false,
    waktuMonitoring: null, tinggiSaatMonitoring: '-', kondisiTanaman: 'Rusak Ringan', status: 'Hidup',
  },
];

export const MOCK_DATA: ProgramMonitoring[] = [
  { id: 'PRG-2026-0030', nama: 'Rehabilitasi Mangrove Tanjungpura', desaKec: 'Desa Tanjungpura, Kec. Karangampel', periode: 'P1', kth: 'KTH Tani Maju', lokasiKab: 'Kab. Indramayu', periodeAktif: '10 Mei 2026 –\n12 Mei 2026', statusText: 'Siap Monitoring', statusSubText: 'Baru', statusColorKey: 'emerald' },
  { id: 'PRG-2026-0012', nama: 'Rehabilitasi Mangrove Eretan', desaKec: 'Desa Eretan, Kec. Kandanghaur', periode: 'P1', kth: 'KTH Mina Bahari', lokasiKab: 'Kab. Indramayu', periodeAktif: '27 Mei 2026 –\n12 Jun 2026', statusText: 'Dalam Monitoring', statusColorKey: 'blue' },
  { id: 'PRG-2026-0007', nama: 'Rehabilitasi Mangrove Karangsong', desaKec: 'Desa Karangsong, Kec. Indramayu', periode: 'P2', kth: 'KTH Karangsong Lestari', lokasiKab: 'Kab. Indramayu', periodeAktif: '10 Mei 2026 –\n12 Mei 2026', statusText: 'Dalam Monitoring', statusColorKey: 'blue' },
  { id: 'PRG-2026-0018', nama: 'Rehabilitasi Mangrove Kertasemaya', desaKec: 'Desa Kertasemaya, Kec. Kertasemaya', periode: 'P2', kth: 'KTH Bina Lestari', lokasiKab: 'Kab. Indramayu', periodeAktif: '10 Mei 2026 –\n12 Mei 2026', statusText: 'Menunggu Evaluasi', statusColorKey: 'orange' },
  { id: 'PRG-2026-0021', nama: 'Rehabilitasi Mangrove Pawidean', desaKec: 'Desa Pawidean, Kec. Juntinyuat', periode: 'P3', kth: 'KTH Lestari Jaya', lokasiKab: 'Kab. Indramayu', periodeAktif: '01 Jul 2026 –\n20 Jul 2026', statusText: 'Tindak Lanjut', statusColorKey: 'purple' },
  { id: 'PRG-2025-0099', nama: 'Rehabilitasi Mangrove Sukra', desaKec: 'Desa Sukra, Kec. Sukra', periode: '-', kth: 'KTH Sukra Bersama', lokasiKab: 'Kab. Indramayu', periodeAktif: '-', statusText: 'Monitoring Selesai', statusColorKey: 'green' },
  { id: 'PRG-2025-0071', nama: 'Rehabilitasi Mangrove Patrol', desaKec: 'Desa Patrol, Kec. Patrol', periode: '-', kth: 'KTH Hijau Lestari', lokasiKab: 'Kab. Indramayu', periodeAktif: '-', statusText: 'Dihentikan', statusColorKey: 'gray-dark' },
];

export const TABS: { label: TabStatus; icon: React.ReactNode; activeColor: string; inactiveIconColor: string }[] = [
  { label: 'Semua Program', icon: <HiOutlineDocumentText className="w-4 h-4" />, activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', inactiveIconColor: 'text-emerald-600' },
  { label: 'Siap Monitoring', icon: <HiOutlinePlayCircle className="w-4 h-4" />, activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', inactiveIconColor: 'text-emerald-500' },
  { label: 'Dalam Monitoring', icon: <HiOutlinePlayCircle className="w-4 h-4" />, activeColor: 'bg-blue-50 text-blue-700 border-blue-200', inactiveIconColor: 'text-blue-500' },
  { label: 'Menunggu Evaluasi', icon: <HiOutlineClock className="w-4 h-4" />, activeColor: 'bg-orange-50 text-orange-700 border-orange-200', inactiveIconColor: 'text-orange-500' },
  { label: 'Tindak Lanjut', icon: <HiOutlineExclamationCircle className="w-4 h-4" />, activeColor: 'bg-purple-50 text-purple-700 border-purple-200', inactiveIconColor: 'text-purple-500' },
  { label: 'Monitoring Selesai', icon: <HiOutlineCheckCircle className="w-4 h-4" />, activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', inactiveIconColor: 'text-emerald-500' },
  { label: 'Dihentikan', icon: <HiOutlineXCircle className="w-4 h-4" />, activeColor: 'bg-gray-100 text-gray-700 border-gray-300', inactiveIconColor: 'text-gray-500' },
];

export const getStatusBadgeStyles = (colorKey: string) => {
  switch (colorKey) {
    case 'blue': return 'text-blue-700 bg-blue-50 border border-blue-100';
    case 'orange': return 'text-orange-700 bg-orange-50 border border-orange-100';
    case 'purple': return 'text-purple-700 bg-purple-50 border border-purple-100';
    case 'emerald': return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
    case 'green': return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
    case 'gray-dark': return 'text-gray-700 bg-gray-100 border border-gray-200';
    case 'gray': default: return 'text-gray-600 bg-gray-50 border border-gray-200';
  }
};

export const getPeriodeBadge = (periode: string) => {
  if (periode === '-') return <span className="text-gray-400 font-bold">-</span>;
  let bg = 'bg-gray-100 text-gray-600';
  if (periode === 'P1') bg = 'bg-blue-50 text-blue-600 border border-blue-100';
  if (periode === 'P2') bg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
  if (periode === 'P3') bg = 'bg-purple-50 text-purple-600 border border-purple-100';
  if (periode === 'P4') bg = 'bg-emerald-50 text-emerald-600 border border-emerald-100'; 
  return <span className={`px-2 py-1 text-[11px] font-bold rounded-md ${bg}`}>{periode}</span>;
}