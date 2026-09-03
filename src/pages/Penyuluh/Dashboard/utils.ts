// Helper terpusat buat parsing & hitung data dashboard Penyuluh dari response /penugasan/me

export interface ProgramInfo {
  id: number;
  programName: string;
  jenisKegiatan: string;
  status: string;
  tanggal: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  kabupaten: string | null;
  kecamatan: string | null;
  desa: string | null;
  sourceType: string;
  detail: any;
  petakUkurs: any[];
}

export const parsePenugasan = (p: any): ProgramInfo => {
  const detail = p.detail || p.penugasanable || {};
  const sourceType = p.source_type || p.penugasanable_type || '';
  const petakUkurs = (p.petak_ukurs || p.petakUkurs || []) as any[];
  const kth = detail?.kth || null;

  let programName = '-';
  let kabupaten: string | null = null;
  let kecamatan: string | null = null;
  let desa: string | null = null;

  if (sourceType === 'App\\Models\\DonationProgram') {
    programName = detail.name || '-';
    kabupaten = kth?.kabupaten_kota || null;
    kecamatan = kth?.kecamatan || null;
    desa = kth?.desa_kelurahan || null;
  } else if (sourceType === 'App\\Models\\ProgramApbd' || sourceType === 'App\\Models\\ProgramCsr') {
    programName = detail.nama_program || '-';
    kabupaten = kth?.kabupaten_kota || null;
    kecamatan = kth?.kecamatan || null;
    desa = kth?.desa_kelurahan || null;
  } else if (sourceType === 'App\\Models\\AnalysisResultZone') {
    programName = 'Validasi Lahan Kritis';
    kabupaten = detail.kabupaten || null;
    kecamatan = detail.kecamatan || null;
    desa = detail.desa || null;
  }

  return {
    id: p.id,
    programName,
    jenisKegiatan: p.jenisKegiatan || p.jenis_kegiatan || '-',
    status: p.status,
    tanggal: p.tanggalPenugasan || p.tanggal_penugasan || null,
    createdAt: p.created_at || null,
    updatedAt: p.updated_at || null,
    kabupaten,
    kecamatan,
    desa,
    sourceType,
    detail,
    petakUkurs,
  };
};

// Gabung semua dataTanaman dari semua petak ukur milik satu penugasan
export const flattenDataTanaman = (petakUkurs: any[]) => {
  const rows: any[] = [];
  petakUkurs.forEach((pu) => {
    (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => rows.push(t));
  });
  return rows;
};

export interface ProgressResult {
  percent: number | null;
  label: string;
}

// Hitung progress dari data yang beneran ada. Kalau datanya belum cukup, percent: null (jangan dikarang).
export const computeProgress = (info: ProgramInfo): ProgressResult => {
  const { jenisKegiatan, sourceType, detail, petakUkurs } = info;

  if (jenisKegiatan === 'Validasi Lokasi') {
    const hasFieldValidation = Array.isArray(detail.field_validations) && detail.field_validations.length > 0;
    if (detail.status_kelayakan === 'Layak' || detail.status_kelayakan === 'Tidak Layak') {
      return { percent: 100, label: detail.status_kelayakan };
    }
    if (hasFieldValidation) return { percent: 60, label: 'Menunggu verifikasi Kabid' };
    return { percent: 20, label: 'Menunggu survei lapangan' };
  }

  if (jenisKegiatan === 'Pelaksanaan Penanaman') {
    if (sourceType === 'App\\Models\\DonationProgram') {
      const target = Number(detail.total_seeds_collected || 0);
      const realized = Number(detail.total_seeds_realized || 0);
      if (target > 0) {
        return { percent: Math.min(100, Math.round((realized / target) * 100)), label: `${realized}/${target} bibit` };
      }
      return { percent: null, label: 'Target bibit belum tersedia' };
    }
    const target = Number(detail.jumlah_bibit || 0);
    const realized = flattenDataTanaman(petakUkurs).reduce((sum, t) => sum + (t.jumlah || 0), 0);
    if (target > 0) {
      return { percent: Math.min(100, Math.round((realized / target) * 100)), label: `${realized}/${target} bibit` };
    }
    return { percent: null, label: 'Target bibit belum tersedia' };
  }

  if (jenisKegiatan === 'Monitoring Program') {
    const rows = flattenDataTanaman(petakUkurs);
    const total = rows.reduce((sum, t) => sum + (t.jumlah || 0), 0);
    if (total === 0) return { percent: null, label: 'Belum ada data monitoring' };
    const hidup = rows.reduce((sum, t) => {
      const kondisi = (t.kondisi_tanaman || '').toLowerCase();
      const isHidup = kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik');
      return sum + (isHidup ? (t.jumlah || 0) : 0);
    }, 0);
    return { percent: Math.round((hidup / total) * 100), label: `${hidup}/${total} tanaman hidup` };
  }

  return { percent: null, label: '-' };
};

// Format waktu relatif ("3 jam yang lalu")
export const formatRelativeTime = (dateStr: string | null): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 30) return `${diffDay} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Posisi bubble per kabupaten/kota (PERKIRAAN VISUAL letak geografis relatif di Jabar,
// bukan koordinat GPS presisi — dipakai murni buat tata letak kartu Sebaran Penugasan).
export const KABUPATEN_POSITIONS: Record<string, { x: number; y: number }> = {
  'Bekasi': { x: 78, y: 20 },
  'Kota Bekasi': { x: 80, y: 15 },
  'Karawang': { x: 62, y: 22 },
  'Purwakarta': { x: 55, y: 35 },
  'Subang': { x: 68, y: 40 },
  'Bandung Barat': { x: 45, y: 55 },
  'Bandung': { x: 50, y: 62 },
  'Kota Bandung': { x: 50, y: 60 },
  'Sumedang': { x: 62, y: 58 },
  'Cianjur': { x: 30, y: 55 },
  'Sukabumi': { x: 18, y: 60 },
  'Kota Sukabumi': { x: 20, y: 58 },
  'Bogor': { x: 25, y: 25 },
  'Kota Bogor': { x: 28, y: 22 },
  'Depok': { x: 40, y: 15 },
  'Garut': { x: 55, y: 75 },
  'Tasikmalaya': { x: 65, y: 80 },
  'Kota Tasikmalaya': { x: 68, y: 78 },
  'Ciamis': { x: 78, y: 78 },
  'Banjar': { x: 85, y: 80 },
  'Kuningan': { x: 85, y: 55 },
  'Cirebon': { x: 90, y: 40 },
  'Kota Cirebon': { x: 92, y: 38 },
  'Majalengka': { x: 78, y: 48 },
  'Indramayu': { x: 80, y: 25 },
  'Pangandaran': { x: 70, y: 90 },
};

export const getBubblePosition = (kabupaten: string | null): { x: number; y: number } => {
  if (!kabupaten) return { x: 50, y: 50 };
  const clean = kabupaten.replace(/^Kab\.?\s*/i, '').trim();
  return KABUPATEN_POSITIONS[clean] || KABUPATEN_POSITIONS[kabupaten] || { x: 50, y: 50 };
};