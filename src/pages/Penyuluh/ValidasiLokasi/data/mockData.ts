import { 
  HiOutlineDocumentText, HiOutlineBars3BottomLeft, HiOutlineMapPin, 
  HiOutlineCalendar, HiOutlineUser, HiOutlineInformationCircle 
} from 'react-icons/hi2';

export interface ValidasiData {
  id: string;
  idProgram: string;
  status: 'Ditugaskan' | 'Sedang Divalidasi' | 'Selesai';
  sumberLokasi: string;
  lokasi: string;
  batasWaktu: string;
  penyuluh: string;
  petugasPenugasan: string;
  hasilValidasi?: 'Sesuai' | 'Tidak Sesuai' | '-';
  tanggalValidasi?: string;
  lintang?: string;
  bujur?: string;
  kesesuaian?: string;
  kondisiUmum?: string;
  catatan?: string;
  foto?: string[];
  waktuPenugasan?: string;
  waktuValidasiMulai?: string;
  waktuValidasiKirim?: string;
  waktuValidasiSelesai?: string;
}

export const INFO_DATA = [
  { id: 1, icon: HiOutlineDocumentText, label: 'ID Program', value: 'PRG-2026-011' },
  { id: 2, icon: HiOutlineBars3BottomLeft, label: 'Sumber Lokasi', value: 'Dari Analisis CPI', isBadge: true, badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 3, icon: HiOutlineMapPin, label: 'Lokasi Penugasan', value: 'Desa Mandalakasih, Kec. Pameungpeuk, Kab. Garut' },
  { id: 4, icon: HiOutlineCalendar, label: 'Batas Waktu Validasi', value: '18 Juni 2026' },
  { id: 5, icon: HiOutlineUser, label: 'Penyuluh', value: 'Imas Rohmayati, S.P., M.P.' },
  { id: 6, icon: HiOutlineInformationCircle, label: 'Status Saat Ini', value: 'Perlu Validasi', isBadge: true, badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
];

export const PANDUAN_LIST = [
  'Pastikan lokasi sesuai dengan penugasan.',
  'Isi koordinat dan kondisi lapangan.',
  'Unggah dokumentasi pendukung.',
  'Simpan hasil sebelum dikirim.'
];

export const HISTORY_LIST = [
  { title: 'Penugasan diterima', time: '12 Juni 2026 14:30 WIB' },
  { title: 'Data lokasi ditinjau', time: '13 Juni 2026 09:10 WIB' }
];

export const mockDatabase: Record<string, ValidasiData> = {
  'TGS-2026-011': {
    id: 'TGS-2026-011', idProgram: 'PRG-2026-011', status: 'Sedang Divalidasi', 
    sumberLokasi: 'Analisis CPI', lokasi: 'Desa Mandalakasih, Kec. Pameungpeuk, Kab. Garut',
    batasWaktu: '18 Juni 2026', penyuluh: 'Imas Rohmayati, S.P., M.P.', petugasPenugasan: 'Staff PDAS',
    waktuPenugasan: '12 Juni 2026 14:30 WIB', waktuValidasiMulai: '15 Juni 2026 08:20 WIB',
  },
  'TGS-2026-012': {
    id: 'TGS-2026-012', idProgram: 'PRG-2026-012', status: 'Sedang Divalidasi',
    sumberLokasi: 'Proposal CSR', lokasi: 'Desa Mekarjaya, Kec. Cikajang, Kab. Garut',
    batasWaktu: '20 Juni 2026', penyuluh: 'Imas Rohmayati, S.P., M.P.', petugasPenugasan: 'Staff PDAS',
    waktuPenugasan: '14 Juni 2026 09:00 WIB', waktuValidasiMulai: '16 Juni 2026 10:00 WIB',
  },
  'TGS-2026-009': {
    id: 'TGS-2026-009', idProgram: 'PRG-2026-009', status: 'Selesai', hasilValidasi: 'Sesuai',
    sumberLokasi: 'Analisis CPI', lokasi: 'Desa Cisurupan, Kec. Pamulihan, Kab. Garut',
    batasWaktu: '22 Juni 2026', penyuluh: 'Imas Rohmayati, S.P., M.P.', petugasPenugasan: 'Staff PDAS',
    tanggalValidasi: '22 Juni 2026', lintang: '-7.7245678', bujur: '107.8501234', kesesuaian: 'Sesuai dengan penugasan',
    kondisiUmum: 'Lokasi berada di sempadan sungai dengan vegetasi dominan semak dan beberapa pohon perintis. Lahan relatif datar dengan kemiringan ringan. Tidak terdapat aktivitas yang mengganggu kawasan.',
    catatan: 'Lokasi sesuai dengan koordinat penugasan dan batas areal yang ditentukan. Akses menuju lokasi baik dan layak untuk pelaksanaan kegiatan penanaman. Vegetasi sekitar mendukung keberhasilan rehabilitasi.',
    foto: [
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=200',
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=200',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=200'
    ],
    waktuPenugasan: '12 Juni 2026, 14:30 WIB', waktuValidasiMulai: '15 Juni 2026, 08:20 WIB',
    waktuValidasiKirim: '22 Juni 2026, 10:15 WIB', waktuValidasiSelesai: '22 Juni 2026, 10:16 WIB',
  },
  'TGS-2026-010': {
    id: 'TGS-2026-010', idProgram: 'PRG-2026-010', status: 'Selesai', hasilValidasi: 'Tidak Sesuai',
    sumberLokasi: 'Analisis CPI', lokasi: 'Desa Cihawuk, Kec. Kertasari, Kab. Bandung',
    batasWaktu: '25 Juni 2026', penyuluh: 'Imas Rohmayati, S.P., M.P.', petugasPenugasan: 'Staff PDAS',
    tanggalValidasi: '24 Juni 2026', lintang: '-7.8245678', bujur: '107.9501234', kesesuaian: 'Tidak Sesuai',
    kondisiUmum: 'Lokasi telah berubah menjadi area pemukiman padat dan lahan garapan aktif warga. Tidak ada ruang kosong yang memadai untuk penanaman.',
    catatan: 'Disarankan untuk mencari lokasi alternatif di desa sekitar karena lahan ini sudah tidak memungkinkan untuk program rehabilitasi.',
    foto: [
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=200'
    ],
    waktuPenugasan: '15 Juni 2026, 09:30 WIB', waktuValidasiMulai: '18 Juni 2026, 08:20 WIB',
    waktuValidasiKirim: '24 Juni 2026, 11:15 WIB', waktuValidasiSelesai: '24 Juni 2026, 11:16 WIB',
  },
};