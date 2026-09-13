import type { DetailPenugasan } from '@/hooks/useDetailPenugasan';

/**
 * Helper laporan verifikasi PDF.
 *
 * Dipisahkan dari komponen dokumennya karena @react-pdf/renderer berat; berkas
 * ini hanya memuat fungsi murni, sedangkan dokumen dan mesin PDF-nya diimpor
 * secara dinamis saat tombol ditekan sehingga tidak ikut ke bundel awal.
 */

/** Nama laporan: Monitoring untuk penugasan monitoring, sisanya Pelaksanaan. */
export const jenisLaporanDari = (data: DetailPenugasan) =>
  (data.jenis_kegiatan || '').toLowerCase().includes('monitoring') ? 'Monitoring' : 'Pelaksanaan';

/** Kode laporan mengikuti pola pada rancangan: PLKS-2026-00034, MNT-2026-00027. */
export const kodeLaporanDari = (data: DetailPenugasan) => {
  const awalan = jenisLaporanDari(data) === 'Monitoring' ? 'MNT' : 'PLKS';
  const sumber = data.batas_waktu || data.tanggal_penugasan || data.raw?.created_at;
  const tahun =
    sumber && !Number.isNaN(new Date(sumber).getTime())
      ? new Date(sumber).getFullYear()
      : new Date().getFullYear();
  return `${awalan}-${tahun}-${String(data.id ?? 0).padStart(5, '0')}`;
};

/** Nama berkas unduhan, tanpa karakter yang bermasalah di Windows. */
export const namaBerkasLaporan = (data: DetailPenugasan) => {
  const program = (data.programName || 'Program')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .split(/\s+/)
    .join('_');
  return `${kodeLaporanDari(data)}_${program}.pdf`;
};

const buatBlob = async (data: DetailPenugasan) => {
  const [{ pdf }, { default: LaporanVerifikasiPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./LaporanVerifikasiPDF'),
  ]);

  return pdf(<LaporanVerifikasiPDF data={data} />).toBlob();
};

/** Mengunduh laporan sebagai berkas PDF. */
export const unduhLaporanPDF = async (data: DetailPenugasan) => {
  const url = URL.createObjectURL(await buatBlob(data));

  const tautan = document.createElement('a');
  tautan.href = url;
  tautan.download = namaBerkasLaporan(data);
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Membuka laporan pada tab baru untuk ditinjau sebelum diunduh. */
export const bukaLaporanPDF = async (data: DetailPenugasan) => {
  const url = URL.createObjectURL(await buatBlob(data));

  if (!window.open(url, '_blank')) {
    URL.revokeObjectURL(url);
    throw new Error('Tab baru diblokir peramban. Izinkan popup untuk meninjau laporan.');
  }

  // Objek URL dilepas belakangan supaya tab yang baru dibuka sempat memuatnya.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
