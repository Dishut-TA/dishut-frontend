const RADIUS = 40;
const KELILING = 2 * Math.PI * RADIUS;

const SUMBER = [
  { nama: 'Donasi', warna: '#16a34a', bulat: 'bg-emerald-600' },
  { nama: 'APBD', warna: '#0284c7', bulat: 'bg-blue-600' },
  { nama: 'CSR', warna: '#7e22ce', bulat: 'bg-purple-700' },
] as const;

const persenId = (nilai: number) => `${nilai.toFixed(1).replace('.', ',')}%`;

export default function DonutChart({ perSumberDana }: { perSumberDana?: Record<string, number> }) {
  const rekap = perSumberDana || {};
  const total = SUMBER.reduce((jumlah, s) => jumlah + (Number(rekap[s.nama]) || 0), 0);

  // Panjang busur dihitung dari proporsi tiap sumber, bukan angka tetap,
  // sehingga cincin tetap benar berapa pun komposisi programnya. Offset tiap
  // segmen adalah akumulasi bagian sebelumnya, dikumpulkan lewat reduce agar
  // tidak ada variabel luar yang dimutasi selama render.
  const segmen = SUMBER.reduce<
    { nama: string; warna: string; bulat: string; jumlah: number; bagian: number; panjang: number; offset: number }[]
  >((acc, s) => {
    const jumlah = Number(rekap[s.nama]) || 0;
    const bagian = total > 0 ? jumlah / total : 0;
    const mulai = acc.reduce((jml, x) => jml + x.bagian, 0);

    acc.push({
      ...s,
      jumlah,
      bagian,
      panjang: bagian * KELILING,
      offset: -mulai * KELILING,
    });
    return acc;
  }, []);

  return (
    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6 text-sm">Rekapitulasi Berdasarkan Sumber Program</h3>
      <div className="flex-1 flex flex-col justify-center gap-6">

        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r={RADIUS} fill="transparent" stroke="#f3f4f6" strokeWidth="20" />
            {segmen
              .filter((s) => s.bagian > 0)
              .map((s) => (
                <circle
                  key={s.nama}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="transparent"
                  stroke={s.warna}
                  strokeWidth="20"
                  strokeDasharray={`${s.panjang} ${KELILING - s.panjang}`}
                  strokeDashoffset={s.offset}
                />
              ))}
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {total.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] font-bold text-gray-500 mt-1">Program</p>
          </div>
        </div>

        <div className="space-y-3 px-4">
          {segmen.map((s) => (
            <div key={s.nama} className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${s.bulat} mt-0.5 shrink-0`}></div>
              <div>
                <p className="text-xs font-bold text-gray-900">{s.nama}</p>
                <p className="text-[10px] text-gray-500">
                  {s.jumlah.toLocaleString('id-ID')} Program ({persenId(s.bagian * 100)})
                </p>
              </div>
            </div>
          ))}
        </div>

        {total === 0 && (
          <p className="text-[11px] text-gray-400 font-medium text-center px-4">
            Belum ada program rehabilitasi yang tercatat.
          </p>
        )}

      </div>
    </div>
  );
}
