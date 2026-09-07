import { useNavigate } from 'react-router-dom';
import {
  STATUS_FINAL,
  kategoriKegiatan,
  persenRealisasi,
  ringkasPerProgram,
  tanggalSingkat,
  waktuTerakhir,
} from '@/utils/programDashboard';

const JUMLAH_TAMPIL = 5;

const persenId = (nilai: number) => `${nilai.toFixed(2).replace('.', ',')}%`;

/**
 * Program yang penugasannya masih berjalan.
 *
 * Satu program bisa punya beberapa penugasan sekaligus, jadi baris digabung
 * dan penugasan dengan pergerakan terakhir dipakai sebagai wakil tahapnya.
 */
export default function TableBerjalan({ programs }: { programs?: any[] }) {
  const navigate = useNavigate();

  const berjalan = Array.isArray(programs)
    ? programs.filter((p: any) => p && !STATUS_FINAL.includes(p.status))
    : [];

  const baris = ringkasPerProgram(berjalan)
    .sort((a, b) => waktuTerakhir(b) - waktuTerakhir(a))
    .slice(0, JUMLAH_TAMPIL);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Program Berjalan</h3>
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="border-b border-gray-100 text-gray-500 font-bold">
            <tr>
              <th className="py-3 pr-2">No</th>
              <th className="py-3 px-2">Program</th>
              <th className="py-3 px-2">Lokasi</th>
              <th className="py-3 px-2">Sumber</th>
              <th className="py-3 px-2">Tahap Kegiatan</th>
              <th className="py-3 px-2">Kategori</th>
              <th className="py-3 px-2 text-right">Progress Tahap</th>
              <th className="py-3 px-2 text-right">Terakhir Diperbarui</th>
              <th className="py-3 pl-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {baris.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-400 font-medium">
                  Belum ada program yang sedang berjalan.
                </td>
              </tr>
            ) : (
              baris.map((row: any, idx: number) => {
                const kategori = kategoriKegiatan(row.jenis_kegiatan);
                const progress = persenRealisasi(row);
                const tahap = row.periode_monitoring
                  ? `${row.jenis_kegiatan} ${row.periode_monitoring}`
                  : row.jenis_kegiatan || '-';

                return (
                  <tr key={row.program_key || idx} className="hover:bg-gray-50/50">
                    <td className="py-3 pr-2 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{row.nama_program || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{row.lokasi || row.wilayah || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{row.sumber_dana || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{tahap}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded-sm text-[10px] font-bold ${
                          kategori === 'Pelaksanaan'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {kategori}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-gray-900">{persenId(progress)}</span>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-[10px] text-gray-500">
                      {tanggalSingkat(row.updated_at || row.tanggal_penugasan)}
                    </td>
                    <td className="py-3 pl-2 text-center">
                      <button
                        onClick={() =>
                          navigate(`/admin/kabid/monitoring/dashboard/detail/${row.id}`, {
                            state: {
                              kategori,
                              status: row.status,
                              periode: row.periode_monitoring || '-',
                            },
                          })
                        }
                        className="px-3 py-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua Program Berjalan</a>
      </div>
    </div>
  );
}
