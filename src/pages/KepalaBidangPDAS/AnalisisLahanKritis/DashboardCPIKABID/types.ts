export interface SummaryStats {
  totalLuas: string;
  totalKritis: string;
  totalSangatKritis: string;
  totalWilayahPrioritas: number;
  luasWilayahPrioritas: string;
  analisisTerakhir: string;
}

export interface CPIDataRow {
  id: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  statusLahan: 'Tidak Kritis' | 'Kritis' | 'Sangat Kritis';
  skorCPI: string;
  rekomendasi: string;
  statusVerifikasi: 'Belum Verifikasi' | 'Sudah Verifikasi' | 'Lunak' | '-';
}