import { HiOutlineClipboardDocumentCheck, HiOutlineDocumentChartBar } from 'react-icons/hi2';
import { FiCheckCircle, FiUsers, FiFlag } from 'react-icons/fi';

// TABLE_REALISASI_DATA dihapus: TableRealisasi kini memakai data dari
// /api/penugasan/dashboard.

export const TABLE_BERJALAN_DATA = [
  { no: 1, program: 'Rehabilitasi Lahan Desa Sukamaju', lokasi: 'Cipatat', sumber: 'Donasi', tahap: 'Pelaksanaan Penanaman', kategori: 'Pelaksanaan', progress: '83,00%', tanggal: '11 Mei 2025' },
  { no: 2, program: 'Rehabilitasi Lahan Rawa Ciberu', lokasi: 'Lembang', sumber: 'APBD', tahap: 'Monitoring Periode V', kategori: 'Monitoring', progress: '82,17%', tanggal: '10 Mei 2025' },
  { no: 3, program: 'Rehabilitasi Lahan Desa Rahmat', lokasi: 'Cisarua', sumber: 'Donasi', tahap: 'Monitoring Periode IV', kategori: 'Monitoring', progress: '76,50%', tanggal: '10 Mei 2025' },
  { no: 4, program: 'Program Hijauan Citarum Hulu', lokasi: 'Cikalongwetan', sumber: 'CSR', tahap: 'Pelaksanaan Penanaman', kategori: 'Pelaksanaan', progress: '75,60%', tanggal: '9 Mei 2025' },
  { no: 5, program: 'Rehabilitasi Lahan Desa Marina', lokasi: 'Rongga', sumber: 'APBD', tahap: 'Monitoring Periode III', kategori: 'Monitoring', progress: '69,90%', tanggal: '9 Mei 2025' },
];

export const ACTIVITIES = [
  { title: 'Verifikasi data penanaman - Desa Mandalawangi', user: 'Penyuluh Dedi Rahmat', time: '2 jam lalu', icon: <FiCheckCircle className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
  { title: 'Hasil monitoring periode V - Desa Sukamaju', user: 'Staff PDAS', time: '5 jam lalu', icon: <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100' },
  { title: 'Penugasan penyuluh baru - Desa Ciwaru', user: 'Kepala Bidang PDAS', time: '1 hari lalu', icon: <FiUsers className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-100' },
  { title: 'Input pemeliharaan - Desa Ciwaru', user: 'Penyuluh Rina Marlina', time: '1 hari lalu', icon: <HiOutlineDocumentChartBar className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100' },
  { title: 'Program selesai - Desa Rahmat', user: 'Staff PDAS', time: '2 hari lalu', icon: <FiFlag className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
];