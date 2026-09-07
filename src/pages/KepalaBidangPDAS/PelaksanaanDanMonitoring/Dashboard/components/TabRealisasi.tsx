const JUMLAH_TAMPIL = 5;

const angkaId = (nilai?: number | null) =>
  nilai === null || nilai === undefined ? '-' : Number(nilai).toLocaleString('id-ID');

const persenId = (nilai: number) => `${nilai.toFixed(1).replace('.', ',')}%`;

interface BarisRealisasi {
  key: string;
  program: string;
  lokasi: string;
  sumber: string;
  target: number;
  realisasi: number;
  persentase: number;
}

/**
 * Program dengan realisasi tertinggi.
 *
 * `programs` dari /api/penugasan/dashboard berisi satu entri per penugasan,
 * sehingga satu program bisa muncul berkali-kali. Baris digabung memakai
 * program_key sebelum diurutkan agar peringkatnya tidak ganda.
 */
export default function TableRealisasi({ programs }: { programs?: any[] }) {
  const daftar: BarisRealisasi[] = Array.isArray(programs)
    ? Object.values(
        programs.reduce((acc: Record<string, BarisRealisasi>, p: any) => {
          const key = p?.program_key || `${p?.nama_program}_${p?.sumber_dana}`;
          const target = Number(p?.target_bibit) || 0;
          const realisasi = Number(p?.realisasi_bibit) || 0;

          // Antar penugasan satu program, ambil angka terbesar sebagai wakil.
          const lama = acc[key];
          if (!lama || realisasi > lama.realisasi || target > lama.target) {
            acc[key] = {
              key,
              program: p?.nama_program || '-',
              lokasi: p?.lokasi || p?.wilayah || '-',
              sumber: p?.sumber_dana || '-',
              target: Math.max(target, lama?.target ?? 0),
              realisasi: Math.max(realisasi, lama?.realisasi ?? 0),
              persentase: 0,
            };
          }
          return acc;
        }, {})
      )
        .map((row) => ({
          ...row,
          persentase: row.target > 0 ? (row.realisasi / row.target) * 100 : 0,
        }))
        .sort((a, b) => b.persentase - a.persentase || b.realisasi - a.realisasi)
        .slice(0, JUMLAH_TAMPIL)
    : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Program dengan Realisasi Tertinggi</h3>
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
              <th className="py-3 px-2 text-right">Target (Pohon)</th>
              <th className="py-3 px-2 text-right">Realisasi (Pohon)</th>
              <th className="py-3 pl-2 text-right">Persentase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {daftar.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                  Belum ada program dengan data realisasi.
                </td>
              </tr>
            ) : (
              daftar.map((row, idx) => (
                <tr key={row.key} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-2 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-2 font-medium text-gray-900">{row.program}</td>
                  <td className="py-3 px-2 text-gray-600">{row.lokasi}</td>
                  <td className="py-3 px-2 text-gray-600">{row.sumber}</td>
                  <td className="py-3 px-2 text-right font-medium">{angkaId(row.target)}</td>
                  <td className="py-3 px-2 text-right font-medium">{angkaId(row.realisasi)}</td>
                  <td className="py-3 pl-2 text-right font-bold text-emerald-600">
                    {persenId(row.persentase)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua Program</a>
      </div>
    </div>
  );
}
