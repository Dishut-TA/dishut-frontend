import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { DetailPenugasan } from '@/hooks/useDetailPenugasan';
import { rekapPetakUkur, barisTanaman } from '@/utils/programDashboard';
import { jenisLaporanDari, kodeLaporanDari } from './laporanVerifikasi';

/**
 * Laporan resmi verifikasi Pelaksanaan / Monitoring dalam bentuk PDF.
 *
 * Struktur mengikuti contoh laporan pada rancangan: sampul, ringkasan
 * verifikasi, sebaran titik, dokumentasi, lalu tabel hasil dan keputusan.
 *
 * Seluruh angka diturunkan dari respons GET /api/penugasan/{id}. Bagian yang
 * belum punya sumber data di basis data - grafik perkembangan antar periode -
 * sengaja tidak dibuat-buat; yang ditampilkan hanya riwayat penugasannya.
 */

const HIJAU = '#185325';
const ABU = '#6B7280';
const GARIS = '#D1D5DB';

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1F2937',
  },

  headerBar: {
    position: 'absolute',
    top: 22,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: HIJAU,
    paddingBottom: 6,
  },
  headerMerek: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: HIJAU, letterSpacing: 0.5 },
  headerJudul: { fontSize: 7.5, color: ABU },

  footer: {
    position: 'absolute',
    bottom: 22,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 5,
    fontSize: 7.5,
    color: '#9CA3AF',
  },

  // Sampul
  sampulKotak: { marginTop: 90, alignItems: 'center' },
  sampulLabel: { fontSize: 8, color: ABU, letterSpacing: 2, marginBottom: 10 },
  sampulJudul: { fontSize: 19, fontFamily: 'Helvetica-Bold', color: HIJAU, textAlign: 'center', lineHeight: 1.35 },
  sampulProgram: { fontSize: 12, marginTop: 10, textAlign: 'center', color: '#374151' },
  sampulPemisah: { width: 70, height: 3, backgroundColor: HIJAU, marginVertical: 20 },
  sampulTabel: { width: '82%', borderTopWidth: 1, borderTopColor: GARIS },
  sampulBaris: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 6 },
  sampulKunci: { width: '38%', color: ABU },
  sampulNilai: { width: '62%', fontFamily: 'Helvetica-Bold' },
  sampulCatatan: { marginTop: 34, fontSize: 8, color: ABU, textAlign: 'center', lineHeight: 1.5 },

  // Umum
  judulBagian: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: HIJAU, marginBottom: 8 },
  judulAnak: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 16, marginBottom: 6 },
  paragraf: { lineHeight: 1.5, textAlign: 'justify', color: '#374151', marginBottom: 12 },

  // Tabel
  tabel: { borderWidth: 1, borderColor: GARIS, borderRightWidth: 0, borderBottomWidth: 0 },
  baris: { flexDirection: 'row' },
  barisKepala: { backgroundColor: HIJAU },
  sel: {
    borderWidth: 1,
    borderColor: GARIS,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  selTeks: { fontSize: 7.5, color: '#374151' },
  selKepala: { fontSize: 7.5, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },
  selZebra: { backgroundColor: '#F8FAFC' },

  // Kartu ringkasan
  kartuBaris: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  kartu: {
    width: '31.5%',
    margin: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DCEBE1',
    backgroundColor: '#F3F9F5',
    borderRadius: 4,
  },
  kartuLabel: { fontSize: 7, color: ABU, marginBottom: 3 },
  kartuNilai: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: HIJAU },
  kartuSatuan: { fontSize: 7, color: ABU, marginTop: 2 },

  // Checklist
  ceklisBaris: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3.5 },
  ceklisTanda: { width: 8, height: 8, borderRadius: 2, marginRight: 8 },
  ceklisTeks: { flex: 1, fontSize: 8.5, color: '#374151' },
  ceklisStatus: { fontSize: 7.5, fontFamily: 'Helvetica-Bold' },

  // Keputusan
  keputusan: {
    borderWidth: 1,
    borderColor: '#DCEBE1',
    backgroundColor: '#F3F9F5',
    borderRadius: 4,
    padding: 12,
    marginBottom: 14,
  },
  keputusanStatus: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: HIJAU, marginBottom: 5 },
  keputusanTeks: { lineHeight: 1.5, color: '#374151' },

  // Riwayat
  riwayatBaris: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  riwayatWaktu: { width: '32%', fontSize: 8, color: ABU },
  riwayatIsi: { flex: 1, fontSize: 8, color: '#374151' },

  // Tanda tangan
  ttdBagian: { marginTop: 34, flexDirection: 'row', justifyContent: 'space-between' },
  ttdKotak: { width: '45%', alignItems: 'center' },
  ttdLabel: { fontSize: 8.5, color: '#374151', marginBottom: 3 },
  ttdRuang: { height: 52 },
  ttdNama: { fontSize: 9, fontFamily: 'Helvetica-Bold', textDecoration: 'underline' },

  kosong: { fontSize: 8.5, color: ABU, fontFamily: 'Helvetica-Oblique', paddingVertical: 8 },
});

const tanggalPanjang = (nilai?: string | null) => {
  if (!nilai) return '-';
  const t = new Date(nilai);
  if (Number.isNaN(t.getTime())) return '-';
  return t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const tanggalJam = (nilai?: string | null) => {
  if (!nilai) return '-';
  const t = new Date(nilai);
  if (Number.isNaN(t.getTime())) return '-';
  const tgl = t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const jam = t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tgl}, ${jam} WIB`;
};

const angka = (n: number) => (Number.isFinite(n) ? n : 0).toLocaleString('id-ID');

const Kepala = ({ judul }: { judul: string }) => (
  <View style={styles.headerBar} fixed>
    <Text style={styles.headerMerek}>SIGAP JABAR</Text>
    <Text style={styles.headerJudul}>{judul}</Text>
  </View>
);

const Kaki = () => (
  <View style={styles.footer} fixed>
    <Text>Dokumen otomatis dari SIGAP JABAR</Text>
    <Text render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
  </View>
);

interface Props {
  data: DetailPenugasan;
}

/** Bentuk minimum yang dipakai laporan dari relasi riwayat_monitoring. */
interface BarisRiwayat {
  id?: number;
  jenis_kegiatan?: string | null;
  periode_monitoring?: string | null;
  batas_waktu?: string | null;
  status?: string | null;
}

/** Bentuk minimum yang dipakai laporan dari dokumentasi_penugasans. */
interface BarisDokumentasi {
  id?: number;
  jenis_dokumentasi?: string | null;
  keterangan?: string | null;
  created_at?: string | null;
  penugasan?: { jenis_kegiatan?: string | null } | null;
}

const LaporanVerifikasiPDF = ({ data }: Props) => {
  const jenisLaporan = jenisLaporanDari(data);
  const judulRingkas = `Laporan Verifikasi ${jenisLaporan} - Program ${data.sumberDana}`;
  const dicetak = new Date().toISOString();

  const rekap = rekapPetakUkur(data.petakUkurs);
  const tanaman = barisTanaman(data.petakUkurs);

  const totalHidup = rekap.reduce((a, r) => a + r.hidup, 0);
  const totalMati = rekap.reduce((a, r) => a + r.mati, 0);
  const totalRawat = rekap.reduce((a, r) => a + r.rawat, 0);
  const totalTanaman = totalHidup + totalMati + totalRawat;
  const keberhasilan = totalTanaman > 0 ? Math.round((totalHidup / totalTanaman) * 100) : 0;

  const dokumentasi: BarisDokumentasi[] = data.dokumentasiProgram.length
    ? data.dokumentasiProgram
    : data.dokumentasiList;
  const riwayat: BarisRiwayat[] = data.riwayatMonitoring;

  const ceklis = [
    { teks: 'Data lokasi program lengkap', lulus: Boolean(data.lokasi && data.lokasi !== '-') },
    { teks: 'Penyuluh penanggung jawab tercatat', lulus: Boolean(data.penyuluh && data.penyuluh !== '-') },
    { teks: 'Titik petak ukur dan koordinat geotag tersedia', lulus: data.geotagList.length > 0 },
    { teks: 'Dokumentasi foto lapangan tersedia', lulus: dokumentasi.length > 0 },
    { teks: 'Data tanaman per titik terekam', lulus: tanaman.length > 0 },
    {
      teks: 'Kondisi dan status tanaman terisi',
      lulus: tanaman.some((t) => t.kondisiTanaman && t.kondisiTanaman !== '-'),
    },
    { teks: 'Catatan atau arahan penyuluh tersedia', lulus: Boolean(data.arahan && data.arahan.trim()) },
  ];
  const ceklisLulus = ceklis.filter((c) => c.lulus).length;

  const infoSampul: [string, string][] = [
    ['ID Laporan', kodeLaporanDari(data)],
    ['Jenis Laporan', jenisLaporan],
    ['Jenis Program', data.sumberDana],
    ['Lokasi', data.lokasi],
    ['Penyuluh', data.penyuluh],
    ['Periode', data.periode_monitoring || '-'],
    ['Tanggal Penugasan', tanggalPanjang(data.tanggal_penugasan)],
    ['Batas Waktu', tanggalPanjang(data.batas_waktu)],
    ['Status', data.status || '-'],
  ];

  const rincianProgram: [string, string][] = [
    ['Nama Program', data.programName],
    ['Kelompok Tani Hutan', data.kth],
    ['Luas Lahan', data.luas],
    ['Sumber Dana', data.sumberDana],
    ['Jenis Kegiatan', data.jenis_kegiatan || '-'],
    ['Jumlah Petak Ukur', `${angka(data.petakUkurs.length)} petak`],
    ['Terakhir Diperbarui', tanggalJam(data.raw?.updated_at)],
  ];

  const ringkas = [
    { label: 'Keberhasilan Tumbuh', nilai: `${keberhasilan}%`, satuan: 'dari total tanaman terdata' },
    { label: 'Tanaman Hidup', nilai: angka(totalHidup), satuan: 'batang' },
    { label: 'Tanaman Mati', nilai: angka(totalMati), satuan: 'batang' },
    { label: 'Perlu Perawatan', nilai: angka(totalRawat), satuan: 'batang' },
    { label: 'Titik Geotag', nilai: angka(data.geotagList.length), satuan: 'titik petak ukur' },
    { label: 'Dokumentasi', nilai: angka(dokumentasi.length), satuan: 'berkas foto' },
  ];

  return (
    <Document
      title={`${judulRingkas} - ${data.programName}`}
      author="SIGAP JABAR"
      subject={`Laporan verifikasi ${jenisLaporan.toLowerCase()} program rehabilitasi hutan dan lahan`}
    >
      {/* ============ SAMPUL ============ */}
      <Page size="A4" style={styles.page}>
        <Kepala judul={judulRingkas} />

        <View style={styles.sampulKotak}>
          <Text style={styles.sampulLabel}>LAPORAN RESMI</Text>
          <Text style={styles.sampulJudul}>
            VERIFIKASI {jenisLaporan.toUpperCase()}
            {"\n"}PROGRAM {data.sumberDana.toUpperCase()}
          </Text>
          <Text style={styles.sampulProgram}>{data.programName}</Text>
          <View style={styles.sampulPemisah} />

          <View style={styles.sampulTabel}>
            {infoSampul.map(([kunci, nilai]) => (
              <View style={styles.sampulBaris} key={kunci}>
                <Text style={styles.sampulKunci}>{kunci}</Text>
                <Text style={styles.sampulNilai}>{nilai || '-'}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sampulCatatan}>
            Disusun otomatis oleh Sistem Informasi SIGAP JABAR
            {"\n"}Dicetak pada {tanggalJam(dicetak)}
          </Text>
        </View>

        <Kaki />
      </Page>

      {/* ============ 1. RINGKASAN VERIFIKASI ============ */}
      <Page size="A4" style={styles.page}>
        <Kepala judul={judulRingkas} />

        <Text style={styles.judulBagian}>1. Ringkasan Verifikasi</Text>
        <Text style={styles.paragraf}>
          Laporan ini memuat hasil kegiatan {jenisLaporan.toLowerCase()} pada program {data.programName} yang
          dilaksanakan di {data.lokasi} bersama {data.kth}. Kegiatan dikerjakan oleh penyuluh {data.penyuluh} dengan
          status penugasan {data.status || 'tidak tercatat'}. Seluruh angka pada laporan ini dihimpun dari data petak
          ukur dan data tanaman yang direkam petugas di lapangan.
        </Text>

        <View style={styles.tabel}>
          {rincianProgram.map(([kunci, nilai], i) => (
            <View style={styles.baris} key={kunci}>
              <View style={[styles.sel, { width: '32%' }, i % 2 === 1 ? styles.selZebra : {}]}>
                <Text style={styles.selTeks}>{kunci}</Text>
              </View>
              <View style={[styles.sel, { width: '68%' }, i % 2 === 1 ? styles.selZebra : {}]}>
                <Text style={styles.selTeks}>{nilai || '-'}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.judulAnak}>Ringkasan Hasil {jenisLaporan}</Text>
        <View style={styles.kartuBaris}>
          {ringkas.map((k) => (
            <View style={styles.kartu} key={k.label}>
              <Text style={styles.kartuLabel}>{k.label}</Text>
              <Text style={styles.kartuNilai}>{k.nilai}</Text>
              <Text style={styles.kartuSatuan}>{k.satuan}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.judulAnak}>
          Checklist Verifikasi ({ceklisLulus} dari {ceklis.length} terpenuhi)
        </Text>
        {ceklis.map((c) => (
          <View style={styles.ceklisBaris} key={c.teks}>
            <View style={[styles.ceklisTanda, { backgroundColor: c.lulus ? HIJAU : '#E5E7EB' }]} />
            <Text style={styles.ceklisTeks}>{c.teks}</Text>
            <Text style={[styles.ceklisStatus, { color: c.lulus ? HIJAU : '#B45309' }]}>
              {c.lulus ? 'Terpenuhi' : 'Belum Terpenuhi'}
            </Text>
          </View>
        ))}

        <Kaki />
      </Page>

      {/* ============ 2. SEBARAN TITIK ============ */}
      <Page size="A4" style={styles.page}>
        <Kepala judul={judulRingkas} />

        <Text style={styles.judulBagian}>2. Sebaran Titik dan Perkembangan Tanaman</Text>
        <Text style={styles.paragraf}>
          Titik berikut merupakan pusat tiap petak ukur yang dihitung dari poligon lahan pada basis data. Koordinat
          ditulis dalam derajat desimal, lintang lalu bujur.
        </Text>

        {rekap.length === 0 ? (
          <Text style={styles.kosong}>Belum ada petak ukur yang terdata pada penugasan ini.</Text>
        ) : (
          <View style={styles.tabel}>
            <View style={[styles.baris, styles.barisKepala]}>
              <View style={[styles.sel, { width: '6%' }]}>
                <Text style={styles.selKepala}>No</Text>
              </View>
              <View style={[styles.sel, { width: '22%' }]}>
                <Text style={styles.selKepala}>Petak Ukur</Text>
              </View>
              <View style={[styles.sel, { width: '24%' }]}>
                <Text style={styles.selKepala}>Koordinat Pusat</Text>
              </View>
              <View style={[styles.sel, { width: '12%' }]}>
                <Text style={styles.selKepala}>Total</Text>
              </View>
              <View style={[styles.sel, { width: '12%' }]}>
                <Text style={styles.selKepala}>Hidup</Text>
              </View>
              <View style={[styles.sel, { width: '12%' }]}>
                <Text style={styles.selKepala}>Mati</Text>
              </View>
              <View style={[styles.sel, { width: '12%' }]}>
                <Text style={styles.selKepala}>Perawatan</Text>
              </View>
            </View>
            {rekap.map((r, i) => {
              const titik = data.geotagList[i];
              const zebra = i % 2 === 1 ? styles.selZebra : {};
              return (
                <View style={styles.baris} key={`${r.pu}-${i}`} wrap={false}>
                  <View style={[styles.sel, { width: '6%' }, zebra]}>
                    <Text style={styles.selTeks}>{i + 1}</Text>
                  </View>
                  <View style={[styles.sel, { width: '22%' }, zebra]}>
                    <Text style={styles.selTeks}>{r.pu}</Text>
                  </View>
                  <View style={[styles.sel, { width: '24%' }, zebra]}>
                    <Text style={styles.selTeks}>
                      {titik ? `${titik.lat.toFixed(6)}, ${titik.lng.toFixed(6)}` : 'Poligon belum terisi'}
                    </Text>
                  </View>
                  <View style={[styles.sel, { width: '12%' }, zebra]}>
                    <Text style={styles.selTeks}>{angka(r.total)}</Text>
                  </View>
                  <View style={[styles.sel, { width: '12%' }, zebra]}>
                    <Text style={styles.selTeks}>
                      {angka(r.hidup)} ({r.pctHidup}%)
                    </Text>
                  </View>
                  <View style={[styles.sel, { width: '12%' }, zebra]}>
                    <Text style={styles.selTeks}>
                      {angka(r.mati)} ({r.pctMati}%)
                    </Text>
                  </View>
                  <View style={[styles.sel, { width: '12%' }, zebra]}>
                    <Text style={styles.selTeks}>
                      {angka(r.rawat)} ({r.pctRawat}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.judulAnak}>Riwayat Penugasan Monitoring Program</Text>
        {riwayat.length === 0 ? (
          <Text style={styles.kosong}>Belum ada penugasan monitoring lanjutan pada program ini.</Text>
        ) : (
          <View style={styles.tabel}>
            <View style={[styles.baris, styles.barisKepala]}>
              <View style={[styles.sel, { width: '8%' }]}>
                <Text style={styles.selKepala}>No</Text>
              </View>
              <View style={[styles.sel, { width: '24%' }]}>
                <Text style={styles.selKepala}>Kegiatan</Text>
              </View>
              <View style={[styles.sel, { width: '18%' }]}>
                <Text style={styles.selKepala}>Periode</Text>
              </View>
              <View style={[styles.sel, { width: '24%' }]}>
                <Text style={styles.selKepala}>Batas Waktu</Text>
              </View>
              <View style={[styles.sel, { width: '26%' }]}>
                <Text style={styles.selKepala}>Status</Text>
              </View>
            </View>
            {riwayat.map((r, i) => {
              const zebra = i % 2 === 1 ? styles.selZebra : {};
              return (
                <View style={styles.baris} key={r.id ?? i} wrap={false}>
                  <View style={[styles.sel, { width: '8%' }, zebra]}>
                    <Text style={styles.selTeks}>{i + 1}</Text>
                  </View>
                  <View style={[styles.sel, { width: '24%' }, zebra]}>
                    <Text style={styles.selTeks}>{r.jenis_kegiatan || '-'}</Text>
                  </View>
                  <View style={[styles.sel, { width: '18%' }, zebra]}>
                    <Text style={styles.selTeks}>{r.periode_monitoring || '-'}</Text>
                  </View>
                  <View style={[styles.sel, { width: '24%' }, zebra]}>
                    <Text style={styles.selTeks}>{tanggalPanjang(r.batas_waktu)}</Text>
                  </View>
                  <View style={[styles.sel, { width: '26%' }, zebra]}>
                    <Text style={styles.selTeks}>{r.status || '-'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Kaki />
      </Page>

      {/* ============ 3. DOKUMENTASI ============ */}
      <Page size="A4" style={styles.page}>
        <Kepala judul={judulRingkas} />

        <Text style={styles.judulBagian}>3. Dokumentasi Kegiatan</Text>
        <Text style={styles.paragraf}>
          Berkas foto tersimpan pada sistem dan dapat dibuka melalui halaman detail program. Daftar berikut mencatat
          identitas tiap berkas beserta waktu unggahnya.
        </Text>

        {dokumentasi.length === 0 ? (
          <Text style={styles.kosong}>Belum ada dokumentasi yang diunggah untuk program ini.</Text>
        ) : (
          <View style={styles.tabel}>
            <View style={[styles.baris, styles.barisKepala]}>
              <View style={[styles.sel, { width: '7%' }]}>
                <Text style={styles.selKepala}>No</Text>
              </View>
              <View style={[styles.sel, { width: '22%' }]}>
                <Text style={styles.selKepala}>Jenis</Text>
              </View>
              <View style={[styles.sel, { width: '34%' }]}>
                <Text style={styles.selKepala}>Keterangan</Text>
              </View>
              <View style={[styles.sel, { width: '19%' }]}>
                <Text style={styles.selKepala}>Tahap</Text>
              </View>
              <View style={[styles.sel, { width: '18%' }]}>
                <Text style={styles.selKepala}>Diunggah</Text>
              </View>
            </View>
            {dokumentasi.map((d, i) => {
              const zebra = i % 2 === 1 ? styles.selZebra : {};
              return (
                <View style={styles.baris} key={d.id ?? i} wrap={false}>
                  <View style={[styles.sel, { width: '7%' }, zebra]}>
                    <Text style={styles.selTeks}>{i + 1}</Text>
                  </View>
                  <View style={[styles.sel, { width: '22%' }, zebra]}>
                    <Text style={styles.selTeks}>{d.jenis_dokumentasi || '-'}</Text>
                  </View>
                  <View style={[styles.sel, { width: '34%' }, zebra]}>
                    <Text style={styles.selTeks}>{d.keterangan || '-'}</Text>
                  </View>
                  <View style={[styles.sel, { width: '19%' }, zebra]}>
                    <Text style={styles.selTeks}>
                      {d.penugasan?.jenis_kegiatan || data.jenis_kegiatan || '-'}
                    </Text>
                  </View>
                  <View style={[styles.sel, { width: '18%' }, zebra]}>
                    <Text style={styles.selTeks}>{tanggalPanjang(d.created_at)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.judulAnak}>Catatan dan Arahan Penyuluh</Text>
        <Text style={styles.paragraf}>
          {data.arahan && data.arahan.trim()
            ? data.arahan
            : 'Tidak ada catatan yang dituliskan pada penugasan ini.'}
        </Text>

        <Kaki />
      </Page>

      {/* ============ 4. TABEL HASIL + 5. KEPUTUSAN ============ */}
      <Page size="A4" style={styles.page}>
        <Kepala judul={judulRingkas} />

        <Text style={styles.judulBagian}>4. Tabel Hasil {jenisLaporan}</Text>

        {tanaman.length === 0 ? (
          <Text style={styles.kosong}>Belum ada data tanaman yang direkam pada petak ukur program ini.</Text>
        ) : (
          <View style={styles.tabel}>
            <View style={[styles.baris, styles.barisKepala]}>
              <View style={[styles.sel, { width: '5%' }]}>
                <Text style={styles.selKepala}>No</Text>
              </View>
              <View style={[styles.sel, { width: '15%' }]}>
                <Text style={styles.selKepala}>ID Tanaman</Text>
              </View>
              <View style={[styles.sel, { width: '21%' }]}>
                <Text style={styles.selKepala}>Jenis Tanaman</Text>
              </View>
              <View style={[styles.sel, { width: '21%' }]}>
                <Text style={styles.selKepala}>Koordinat</Text>
              </View>
              <View style={[styles.sel, { width: '10%' }]}>
                <Text style={styles.selKepala}>Tinggi Awal</Text>
              </View>
              <View style={[styles.sel, { width: '10%' }]}>
                <Text style={styles.selKepala}>Tinggi Monitoring</Text>
              </View>
              <View style={[styles.sel, { width: '10%' }]}>
                <Text style={styles.selKepala}>Kondisi</Text>
              </View>
              <View style={[styles.sel, { width: '8%' }]}>
                <Text style={styles.selKepala}>Status</Text>
              </View>
            </View>
            {tanaman.map((t, i) => {
              const zebra = i % 2 === 1 ? styles.selZebra : {};
              return (
                <View style={styles.baris} key={t.id ?? i} wrap={false}>
                  <View style={[styles.sel, { width: '5%' }, zebra]}>
                    <Text style={styles.selTeks}>{i + 1}</Text>
                  </View>
                  <View style={[styles.sel, { width: '15%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.idTanaman}</Text>
                  </View>
                  <View style={[styles.sel, { width: '21%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.jenisTanaman}</Text>
                  </View>
                  <View style={[styles.sel, { width: '21%' }, zebra]}>
                    <Text style={styles.selTeks}>{String(t.koordinat).split("\n").join(', ')}</Text>
                  </View>
                  <View style={[styles.sel, { width: '10%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.tinggiAwal}</Text>
                  </View>
                  <View style={[styles.sel, { width: '10%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.tinggiSaatMonitoring}</Text>
                  </View>
                  <View style={[styles.sel, { width: '10%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.kondisiTanaman}</Text>
                  </View>
                  <View style={[styles.sel, { width: '8%' }, zebra]}>
                    <Text style={styles.selTeks}>{t.status}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={[styles.judulBagian, { marginTop: 22 }]}>5. Keputusan Verifikasi</Text>
        <View style={styles.keputusan}>
          <Text style={styles.keputusanStatus}>STATUS: {(data.status || 'Belum Ditetapkan').toUpperCase()}</Text>
          <Text style={styles.keputusanTeks}>
            Berdasarkan pemeriksaan terhadap laporan {jenisLaporan.toLowerCase()} program {data.sumberDana}, tercatat{' '}
            {angka(totalTanaman)} batang tanaman pada {angka(data.petakUkurs.length)} petak ukur dengan tingkat
            keberhasilan tumbuh {keberhasilan}%. Sebanyak {ceklisLulus} dari {ceklis.length} butir checklist verifikasi
            terpenuhi.
          </Text>
        </View>

        <Text style={styles.judulAnak}>Riwayat Laporan</Text>
        <View style={styles.riwayatBaris}>
          <Text style={styles.riwayatWaktu}>{tanggalJam(data.raw?.created_at)}</Text>
          <Text style={styles.riwayatIsi}>Penugasan dibuat dan dikirim ke penyuluh</Text>
        </View>
        <View style={styles.riwayatBaris}>
          <Text style={styles.riwayatWaktu}>{tanggalPanjang(data.batas_waktu)}</Text>
          <Text style={styles.riwayatIsi}>Batas waktu penyelesaian kegiatan</Text>
        </View>
        <View style={styles.riwayatBaris}>
          <Text style={styles.riwayatWaktu}>{tanggalJam(data.raw?.updated_at)}</Text>
          <Text style={styles.riwayatIsi}>Pembaruan terakhir status menjadi {data.status || '-'}</Text>
        </View>

        <View style={styles.ttdBagian}>
          <View style={styles.ttdKotak}>
            <Text style={styles.ttdLabel}>Penyuluh Pendamping,</Text>
            <View style={styles.ttdRuang} />
            <Text style={styles.ttdNama}>{data.penyuluh}</Text>
          </View>
          <View style={styles.ttdKotak}>
            <Text style={styles.ttdLabel}>Bandung, {tanggalPanjang(dicetak)}</Text>
            <Text style={styles.ttdLabel}>Kepala Bidang PDAS,</Text>
            <View style={styles.ttdRuang} />
            <Text style={styles.ttdNama}>Kepala Bidang PDAS</Text>
          </View>
        </View>

        <Kaki />
      </Page>
    </Document>
  );
};

export default LaporanVerifikasiPDF;
