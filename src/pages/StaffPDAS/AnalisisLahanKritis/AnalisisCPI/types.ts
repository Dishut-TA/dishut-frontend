export interface PlantRecommendationRuleSummary {
  id?: number;
  code?: string | null;
  wilayah?: string | null;
  kategori?: string | null;
  fungsi_rhl?: string | null;
}

export interface CPIDataRow {
  id?: string | number;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  statusKekritisan: string;
  skorCPI: string;
  rekomendasi: string;
  rekomendasiTanaman: string[];
  rekomendasiTanamanAlasan?: string | null;
  rekomendasiTanamanRule?: PlantRecommendationRuleSummary | null;
  statusKelayakan: string;
  namaKth: string;
  ketuaKth: string;
  cdk?: string;
  luas?: string | number;
  latitude?: string | number;
  longitude?: string | number;
}
