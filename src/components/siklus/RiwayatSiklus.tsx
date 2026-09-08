import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowTrendingUp,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineClock,
  HiOutlineForward,
} from 'react-icons/hi2';
import {
  getSiklusByPenugasanAPI,
  naikkanPeriodeAPI,
  type RingkasanSiklus,
} from '@/services/siklus.service';

/**
 * Riwayat siklus rehabilitasi P0-P4 untuk satu program.
 *
 * Menampilkan timeline periode, grafik perkembangan tanaman hidup antar
 * periode, dan - bila diizinkan - pemicu manual kenaikan periode.
 *
 * Seluruh angka berasal dari tabel hasil_monitoring_petaks di backend, yaitu
 * pengukuran yang dibekukan tiap periode. Periode yang belum pernah diukur
 * tidak digambar supaya grafik tidak menunjukkan titik nol palsu.
 */

interface Props {
  /** Id penugasan yang sedang dibuka; programnya diresolusi di backend. */
  penugasanId?: number | string;
  /** Menampilkan tombol naikkan periode. Hanya untuk Kepala Bidang PDAS. */
  bolehNaikkanPeriode?: boolean;
  className?: string;
}

const SEMUA_PERIODE = ['P0', 'P1', 'P2', 'P3', 'P4'];

const WARNA_STATUS: Record<string, string> = {
  'Pelaksanaan': 'bg-slate-50 text-slate-700 border-slate-200',
  'Siap Monitoring': 'bg-blue-50 text-blue-700 border-blue-200',
  'Menunggu Evaluasi': 'bg-amber-50 text-amber-700 border-amber-200',
  'Tindak Lanjut': 'bg-orange-50 text-orange-700 border-orange-200',
  'Selesai Monitoring': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Selesai & Diserahterimakan': 'bg-emerald-600 text-white border-emerald-700',
};

const tanggalSingkat = (nilai?: string | null) => {
  if (!nilai) return null;
  const t = new Date(nilai);
  if (Number.isNaN(t.getTime())) return null;
  return t.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const RiwayatSiklus: React.FC<Props> = ({ penugasanId, bolehNaikkanPeriode = false, className = '' }) => {
  const [siklus, setSiklus] = useState<RingkasanSiklus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sedangNaikkan, setSedangNaikkan] = useState(false);

  const muat = useCallback(async () => {
    if (!penugasanId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setSiklus(await getSiklusByPenugasanAPI(penugasanId));
    } catch (e: any) {
      setSiklus(null);
      setError(e?.message || 'Gagal memuat riwayat siklus.');
    } finally {
      setIsLoading(false);
    }
  }, [penugasanId]);

  useEffect(() => {
    muat();
  }, [muat]);

  const naikkan = async () => {
    if (!siklus?.program_alias || sedangNaikkan) return;

    setSedangNaikkan(true);
    try {
      const hasil = await naikkanPeriodeAPI(siklus.program_alias, siklus.program_id);
      toast.success(hasil?.message || 'Periode berhasil dinaikkan.');
      await muat();
    } catch (e: any) {
      toast.error(e?.message || 'Gagal menaikkan periode.');
    } finally {
      setSedangNaikkan(false);
    }
  };

  // Grafik hanya memakai periode yang persentasenya diketahui; periode yang
  // belum diukur dilewati agar kurvanya tidak jatuh ke nol.
  const dataGrafik = useMemo(
    () =>
      (siklus?.riwayat ?? [])
        .filter((p) => p.persentase_tumbuh !== null)
        .map((p) => ({
          periode: p.periode,
          persentase: p.persentase_tumbuh as number,
          hidup: p.bibit_tumbuh,
          mati: p.bibit_mati,
        })),
    [siklus]
  );

  const indeksAktif = SEMUA_PERIODE.indexOf(siklus?.periode_aktif ?? 'P0');

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
        <p className="text-xs text-slate-500 font-medium">Memuat riwayat siklus...</p>
      </div>
    );
  }

  if (error || !siklus) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
        <p className="text-xs text-slate-500 font-medium">{error || 'Riwayat siklus tidak tersedia.'}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineArrowTrendingUp className="w-4 h-4 text-emerald-600" />
            Siklus Rehabilitasi P0 &ndash; P4
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Ambang batas keberhasilan {siklus.ambang_batas_tumbuh}% tiap periode. Program dinyatakan tuntas setelah
            evaluasi {siklus.periode_terakhir} terpenuhi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-[10px] font-bold border rounded-full ${WARNA_STATUS[siklus.status_siklus] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {siklus.status_siklus}
          </span>

          {bolehNaikkanPeriode && (
            <button
              onClick={naikkan}
              disabled={!siklus.bisa_naik_periode || sedangNaikkan}
              title={siklus.alasan_tidak_bisa_naik ?? 'Menaikkan program ke periode monitoring berikutnya'}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold rounded-lg bg-[#185325] text-white hover:bg-[#124019] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HiOutlineForward className="w-3.5 h-3.5" />
              {sedangNaikkan ? 'Memproses...' : 'Simulasikan Setahun ke Depan'}
            </button>
          )}
        </div>
      </div>

      {bolehNaikkanPeriode && siklus.alasan_tidak_bisa_naik && (
        <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-6">
          {siklus.alasan_tidak_bisa_naik}
        </p>
      )}

      {/* Timeline periode */}
      <div className="flex items-center mb-8 overflow-x-auto pb-1">
        {SEMUA_PERIODE.map((periode, i) => {
          const data = siklus.riwayat.find((r) => r.periode === periode);
          const aktif = periode === siklus.periode_aktif;
          const lewat = i < indeksAktif;

          const warna = data?.lolos_ambang_batas === false
            ? 'bg-orange-500 border-orange-500 text-white'
            : lewat || (aktif && data?.lolos_ambang_batas)
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : aktif
                ? 'bg-white border-emerald-600 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-400';

          return (
            <React.Fragment key={periode}>
              <div className="flex flex-col items-center shrink-0 w-24">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${warna}`}>
                  {periode}
                </div>
                <p className={`text-[10px] font-bold mt-2 ${aktif ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {periode === 'P0' ? 'Penanaman' : `Monitoring`}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {data?.persentase_tumbuh !== null && data?.persentase_tumbuh !== undefined
                    ? `${data.persentase_tumbuh}%`
                    : '—'}
                </p>
              </div>
              {i < SEMUA_PERIODE.length - 1 && (
                <div className={`h-0.5 flex-1 min-w-6 ${i < indeksAktif ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Grafik perkembangan */}
      <h4 className="text-xs font-bold text-slate-800 mb-3">Grafik Perkembangan Persentase Hidup</h4>
      {dataGrafik.length === 0 ? (
        <p className="text-[11px] text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-6 text-center mb-6">
          Belum ada periode yang diukur. Grafik muncul setelah laporan monitoring pertama dikirim.
        </p>
      ) : (
        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataGrafik} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="periode" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#E2E8F0' }}
                formatter={(nilai) => `${nilai}%`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine
                y={siklus.ambang_batas_tumbuh}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{ value: `Ambang ${siklus.ambang_batas_tumbuh}%`, fontSize: 10, fill: '#DC2626', position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="persentase"
                name="Persentase Hidup"
                stroke="#185325"
                strokeWidth={2}
                dot={{ r: 4, fill: '#185325' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Rincian per periode */}
      <h4 className="text-xs font-bold text-slate-800 mb-3">Rincian per Periode</h4>
      {siklus.riwayat.length === 0 ? (
        <p className="text-[11px] text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-6 text-center">
          Program ini belum menempuh periode monitoring apa pun.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Periode</th>
                <th className="py-2.5 px-3">Petak</th>
                <th className="py-2.5 px-3">Tanaman Hidup</th>
                <th className="py-2.5 px-3">Tanaman Mati</th>
                <th className="py-2.5 px-3">Persentase</th>
                <th className="py-2.5 px-3">Diukur</th>
                <th className="py-2.5 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {siklus.riwayat.map((p) => (
                <tr key={p.periode} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-slate-800">{p.label}</td>
                  <td className="py-2.5 px-3">{p.jumlah_petak.toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3">{p.bibit_tumbuh.toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3">{p.bibit_mati.toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3">
                    {p.persentase_tumbuh === null ? (
                      <span className="text-slate-400">Belum diukur</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 font-bold ${p.lolos_ambang_batas ? 'text-emerald-700' : 'text-orange-700'}`}>
                        {p.lolos_ambang_batas ? (
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />
                        )}
                        {p.persentase_tumbuh}%
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{tanggalSingkat(p.diukur_at) ?? '—'}</td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {p.ada_tindak_lanjut && (
                      <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded font-bold text-[9px]">
                        <HiOutlineClock className="w-3 h-3" /> Tindak Lanjut
                      </span>
                    )}
                    {p.status_evaluasi && (
                      <span className="ml-1.5 text-[10px]">{p.status_evaluasi}</span>
                    )}
                    {!p.ada_tindak_lanjut && !p.status_evaluasi && '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {siklus.siklus_terakhir_at && (
        <p className="text-[10px] text-slate-400 font-medium mt-4">
          Siklus berjalan terakhir dinyatakan tuntas pada {tanggalSingkat(siklus.siklus_terakhir_at)}. Kenaikan periode
          otomatis dijalankan penjadwal server satu tahun setelahnya.
        </p>
      )}
    </div>
  );
};

export default RiwayatSiklus;
