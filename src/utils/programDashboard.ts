/**
 * Bantuan bersama untuk komponen dashboard Pelaksanaan & Monitoring.
 *
 * `programs` pada /api/penugasan/dashboard berisi satu entri per penugasan,
 * sehingga satu program dapat muncul berkali-kali. Semua helper di sini
 * berangkat dari kenyataan itu.
 */

/** Status penugasan yang sudah selesai, jadi bukan lagi "berjalan". */
export const STATUS_FINAL = ['Selesai', 'Monitoring Selesai', 'Dihentikan', 'Menunggu Penugasan'];

export const kunciProgram = (p: any) =>
  p?.program_key || `${p?.nama_program ?? '-'}_${p?.sumber_dana ?? '-'}`;

/** Kategori tampilan berdasarkan jenis kegiatan penugasan. */
export const kategoriKegiatan = (jenisKegiatan?: string | null) => {
  const jenis = (jenisKegiatan || '').toLowerCase();
  if (jenis.includes('monitoring') || jenis.includes('tindak lanjut')) return 'Monitoring';
  if (jenis.includes('validasi')) return 'Validasi';
  return 'Pelaksanaan';
};

export const persenRealisasi = (p: any) => {
  const target = Number(p?.target_bibit) || 0;
  const realisasi = Number(p?.realisasi_bibit) || 0;
  return target > 0 ? (realisasi / target) * 100 : 0;
};

/** Waktu terakhir penugasan bergerak; tanggal_penugasan boleh kosong. */
export const waktuTerakhir = (p: any): number => {
  const kandidat = [p?.updated_at, p?.tanggal_penugasan, p?.created_at];
  for (const nilai of kandidat) {
    if (!nilai) continue;
    const waktu = new Date(nilai).getTime();
    if (!Number.isNaN(waktu)) return waktu;
  }
  return 0;
};

export const tanggalSingkat = (nilai?: string | null) => {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Jarak waktu dalam bahasa Indonesia, mis. "2 jam lalu". */
export const waktuRelatif = (nilai?: string | null) => {
  if (!nilai) return '-';
  const waktu = new Date(nilai).getTime();
  if (Number.isNaN(waktu)) return '-';

  const detik = Math.floor((Date.now() - waktu) / 1000);
  if (detik < 60) return 'baru saja';

  const satuan: [number, string][] = [
    [60, 'menit'],
    [3600, 'jam'],
    [86400, 'hari'],
    [2592000, 'bulan'],
  ];

  let hasil = `${Math.floor(detik / 2592000)} bulan lalu`;
  for (let i = 0; i < satuan.length; i++) {
    const [ambang, nama] = satuan[i];
    const berikut = satuan[i + 1]?.[0];
    if (!berikut || detik < berikut) {
      hasil = `${Math.floor(detik / ambang)} ${nama} lalu`;
      break;
    }
  }
  return hasil;
};

/**
 * Menggabungkan entri per penugasan menjadi satu baris per program,
 * memakai penugasan dengan pergerakan terakhir sebagai wakil.
 */
export const ringkasPerProgram = (programs?: any[]): any[] => {
  if (!Array.isArray(programs)) return [];

  const peta = programs.reduce((acc: Record<string, any>, p: any) => {
    const kunci = kunciProgram(p);
    const lama = acc[kunci];
    if (!lama || waktuTerakhir(p) >= waktuTerakhir(lama)) acc[kunci] = p;
    return acc;
  }, {});

  return Object.values(peta);
};
