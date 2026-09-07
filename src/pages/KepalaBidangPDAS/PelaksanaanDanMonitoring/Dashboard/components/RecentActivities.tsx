import { FiClock, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { HiOutlineClipboardDocumentCheck, HiOutlineDocumentChartBar } from 'react-icons/hi2';
import { kategoriKegiatan, waktuRelatif, waktuTerakhir } from '@/utils/programDashboard';

const JUMLAH_TAMPIL = 6;

/** Ikon dan warna kartu mengikuti kategori kegiatan serta status penugasan. */
const tampilanKartu = (jenisKegiatan?: string | null, status?: string | null) => {
  if ((status || '').toLowerCase().includes('dihentikan')) {
    return { icon: <FiFlag className="w-5 h-5 text-red-600" />, bg: 'bg-red-100' };
  }

  const kategori = kategoriKegiatan(jenisKegiatan);
  if (kategori === 'Monitoring') {
    return {
      icon: <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100',
    };
  }
  if (kategori === 'Validasi') {
    return { icon: <FiCheckCircle className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' };
  }
  return {
    icon: <HiOutlineDocumentChartBar className="w-5 h-5 text-blue-600" />,
    bg: 'bg-blue-100',
  };
};

/**
 * Aktivitas terbaru diturunkan dari penugasan, karena modul ini belum punya
 * tabel log aktivitas sendiri. Satu penugasan mewakili satu aktivitas, jadi
 * daftarnya sengaja tidak digabung per program.
 */
export default function RecentActivities({ activities }: { activities?: any[] }) {
  const daftar = Array.isArray(activities)
    ? [...activities].sort((a, b) => waktuTerakhir(b) - waktuTerakhir(a)).slice(0, JUMLAH_TAMPIL)
    : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 text-sm">Aktivitas Terbaru</h3>
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</a>
      </div>

      {daftar.length === 0 ? (
        <p className="text-[11px] text-gray-400 font-medium py-6 text-center">
          Belum ada aktivitas penugasan yang tercatat.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {daftar.map((act: any, index: number) => {
            const { icon, bg } = tampilanKartu(act.jenis_kegiatan, act.status);
            const judul = `${act.jenis_kegiatan || 'Kegiatan'} - ${act.nama_program || 'Program'}`;

            return (
              <div
                key={act.id ?? index}
                className="flex gap-3 shrink-0 w-72 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-snug mb-1 truncate" title={judul}>
                    {judul}
                  </p>
                  <p className="text-[10px] text-gray-500 mb-1 truncate">
                    Oleh {act.penyuluh && act.penyuluh !== '-' ? act.penyuluh : 'belum ada penyuluh'}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {waktuRelatif(act.updated_at || act.tanggal_penugasan || act.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
