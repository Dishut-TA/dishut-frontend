import { 
  HiOutlineUsers, 
  HiOutlineClipboardDocumentList, 
  HiOutlineCalendarDays 
} from 'react-icons/hi2';

export const mockStats = [
  { title: 'Total Penyuluh', value: '24', desc: 'Penyuluh aktif', icon: HiOutlineUsers, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'Total Penugasan', value: '18', desc: 'Penugasan aktif', icon: HiOutlineClipboardDocumentList, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Penugasan Selesai', value: '12', desc: 'Selesai bulan ini', icon: HiOutlineCalendarDays, color: 'text-orange-500', bg: 'bg-orange-100' },
];

export const mockTableData = [
  { id: 1, penyuluh: 'Andi Permana', wilayah: 'DAS Cimanuk', lokasi: 'Hulu DAS Cimanuk', tanggal: '24/06/2025', periode: '20 Mei 2025', status: 'Berjalan' },
  { id: 2, penyuluh: 'Siti Nurhaliza', wilayah: 'DAS Citarum', lokasi: 'Hulu DAS Citarum', tanggal: '24/06/2025', periode: '20 Mei 2025', status: 'Berjalan' },
  { id: 3, penyuluh: 'Dedi Kurniawan', wilayah: 'DAS Ciujung', lokasi: 'Bandung', tanggal: '24/06/2025', periode: '20 Mei 2025', status: 'Selesai' },
  { id: 4, penyuluh: 'Rina Marlina', wilayah: 'DAS Ciliwung', lokasi: 'Bogor', tanggal: '23/06/2025', periode: '20 Mei 2025', status: 'Selesai' },
  { id: 5, penyuluh: 'Agus Setiawan', wilayah: 'DAS Citarum', lokasi: 'Purwakarta', tanggal: '23/06/2025', periode: '20 Mei 2025', status: 'Berjalan' },
  { id: 6, penyuluh: 'Budi Santoso', wilayah: 'DAS Ciujung', lokasi: 'Serang', tanggal: '22/06/2025', periode: '20 Mei 2025', status: 'Selesai' },
];