import { useEffect, useState } from 'react';
import { getPenugasanByIdAPI } from '@/services/penugasan.service';
import { centroidPolygon } from '@/utils/koordinat';

export interface StatsPenugasan {
  tanamanHidup: number;
  tanamanMati: number;
  targetTanam: number;
  persentaseHidup: number;
  countGeotag: number;
  countDokumentasi: number;
}

export interface DetailPenugasan {
  id: number | string;
  sourceId: string;
  programName: string;
  kth: string;
  luas: string;
  lokasi: string;
  sumberDana: string;
  penyuluh: string;
  tanggal_penugasan: string | null;
  batas_waktu: string | null;
  jenis_kegiatan: string | null;
  periode_monitoring: string;
  status: string | null;
  arahan: string | null;
  stats: StatsPenugasan;
  geotagList: { lat: number; lng: number; nama: string }[];
  petakUkurs: any[];
  dokumentasiList: any[];
  dokumentasiProgram: any[];
  pelaksanaan: any | null;
  riwayatMonitoring: any[];
  raw: any;
}

const KONDISI_HIDUP = ['hidup', 'sehat', 'baik'];
const KONDISI_MATI = ['mati', 'rusak', 'sakit'];

const gabung = (...bagian: any[]) => bagian.filter(Boolean).join(', ') || '-';

/**
 * Menormalkan respons GET /api/penugasan/{id} menjadi bentuk yang dipakai
 * halaman-halaman modul Pelaksanaan & Monitoring.
 *
 * Sebelumnya tiap halaman menyalin logika ini sendiri, atau justru memakai
 * data hardcoded. Dikumpulkan di satu tempat supaya bentuk datanya konsisten
 * dan penyesuaian API cukup dilakukan sekali.
 */
export const normalisasiPenugasan = (penugasan: any, sourceId: string): DetailPenugasan => {
  const source = penugasan?.penugasanable ?? {};
  const tipe: string = penugasan?.penugasanable_type ?? '';

  const zone = source.analysis_result_zone || source.analysisResultZone;
  const zoneLokasi = zone ? gabung(zone.desa, zone.kecamatan, zone.kabupaten) : '-';
  const zoneLuas = zone?.luas_ha ? `${zone.luas_ha} Ha` : '-';
  const zoneKth = zone?.nama_kelompok || '-';

  const kthObj = source?.kth || penugasan?.penyuluh?.kth;
  const kthLokasi = kthObj?.desa_kelurahan
    ? gabung(kthObj.desa_kelurahan, kthObj.kabupaten_kota)
    : '-';

  const pilih = (...kandidat: any[]) => kandidat.find((v) => v && v !== '-') ?? '-';

  const isDonasi = tipe.includes('DonationProgram');
  const isApbd = tipe.includes('ProgramApbd');
  const isCsr = tipe.includes('ProgramCsr');

  const programName = pilih(isDonasi ? source.name : source.nama_program, source.name, source.nama_program);
  const kth = pilih(kthObj?.nama, kthObj?.name, zoneKth);
  const luas = pilih(zoneLuas, source.target_luas_lahan ? `${source.target_luas_lahan} Ha` : null);
  const lokasi = pilih(isDonasi ? source.location : source.lokasi, source.lokasi, source.location, kthLokasi, zoneLokasi);

  let sumberDana = '-';
  if (isDonasi) sumberDana = 'Donasi';
  else if (isApbd) sumberDana = 'APBD';
  else if (isCsr) sumberDana = 'CSR';

  const petakUkurs: any[] = penugasan?.petak_ukurs || penugasan?.petakUkurs || [];

  let tanamanHidup = 0;
  let tanamanMati = 0;
  let targetTanam = 0;

  petakUkurs.forEach((pu: any) => {
    (pu.data_tanamans || pu.dataTanamans || []).forEach((t: any) => {
      const jumlah = t.jumlah || 0;
      targetTanam += jumlah;

      const kondisi = (t.kondisi_tanaman || '').toLowerCase();
      if (KONDISI_MATI.some((k) => kondisi.includes(k))) {
        tanamanMati += jumlah;
      } else {
        // Tanpa keterangan kondisi, tanaman dianggap hidup seperti perilaku sebelumnya.
        void KONDISI_HIDUP;
        tanamanHidup += jumlah;
      }
    });
  });

  const totalTanaman = tanamanHidup + tanamanMati;
  const persentaseHidup = totalTanaman > 0
    ? Number(((tanamanHidup / totalTanaman) * 100).toFixed(2))
    : 0;

  const geotagList = petakUkurs.reduce<{ lat: number; lng: number; nama: string }[]>((acc, pu: any) => {
    const pusat = centroidPolygon(pu?.polygon_data);
    if (!pusat) return acc;

    acc.push({
      lat: pusat[0],
      lng: pusat[1],
      nama: pu.nama || pu.nama_petak || `PU ${pu.id ?? ''}`.trim() || 'Petak Ukur',
    });
    return acc;
  }, []);

  const dokumentasiList = penugasan?.dokumentasi || [];

  return {
    id: penugasan?.id,
    sourceId,
    programName,
    kth,
    luas,
    lokasi,
    sumberDana,
    penyuluh: pilih(
      penugasan?.penyuluh?.username,
      penugasan?.penyuluh?.name,
      penugasan?.penyuluh?.nama_pengguna
    ),
    tanggal_penugasan: penugasan?.tanggal_penugasan ?? null,
    batas_waktu: penugasan?.batas_waktu ?? null,
    jenis_kegiatan: penugasan?.jenis_kegiatan ?? null,
    periode_monitoring: penugasan?.periode_monitoring || penugasan?.jenis_kegiatan || '-',
    status: penugasan?.status ?? null,
    arahan: penugasan?.arahan ?? null,
    stats: {
      tanamanHidup,
      tanamanMati,
      targetTanam,
      persentaseHidup,
      countGeotag: petakUkurs.length,
      countDokumentasi: dokumentasiList.length,
    },
    geotagList,
    petakUkurs,
    dokumentasiList,
    dokumentasiProgram: penugasan?.dokumentasi_program || [],
    pelaksanaan: penugasan?.pelaksanaan_penanaman || null,
    riwayatMonitoring: penugasan?.riwayat_monitoring || [],
    raw: penugasan,
  };
};

/**
 * Mengambil dan menormalkan detail penugasan berdasarkan id rute.
 */
export const useDetailPenugasan = (id?: string) => {
  const [data, setData] = useState<DetailPenugasan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dibatalkan = false;

    const ambil = async () => {
      if (!id) {
        setIsLoading(false);
        setError('ID penugasan tidak ditemukan pada alamat halaman.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await getPenugasanByIdAPI(id);
        const penugasan = res?.data;

        if (dibatalkan) return;

        if (!penugasan) {
          setData(null);
          setError('Data penugasan tidak ditemukan.');
          return;
        }

        setData(normalisasiPenugasan(penugasan, id));
      } catch (e: any) {
        if (dibatalkan) return;
        setData(null);
        setError(e?.message || 'Gagal memuat detail penugasan.');
      } finally {
        if (!dibatalkan) setIsLoading(false);
      }
    };

    ambil();

    return () => {
      dibatalkan = true;
    };
  }, [id]);

  return { data, isLoading, error };
};

export default useDetailPenugasan;
