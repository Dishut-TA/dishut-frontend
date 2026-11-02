export interface KthFormData {
  // Step 1: Wilayah & Legalitas Kelompok
  cdk: string;
  kabupaten_kota: string;
  kecamatan: string;
  desa_kelurahan: string;
  nomor_sk: string;

  // Step 2: Profil & Kelembagaan KTH
  nama_kelompok: string;
  nama_ketua: string;
  no_wa_ketua: string;
  jumlah_anggota: string;
  jenis_usaha: string;
  kelas_kth: string;
  alamat_sekretariat: string;

  // Step 3: Informasi Rekening Bank
  nama_bank: string;
  nomor_rekening: string;
  nama_pemilik_rekening: string;
}

export const CDK_OPTIONS = [
  'Cabang Dinas Kehutanan (CDK) 1',
  'Cabang Dinas Kehutanan (CDK) 2',
  'Cabang Dinas Kehutanan (CDK) 3',
  'Cabang Dinas Kehutanan (CDK) 4',
  'Cabang Dinas Kehutanan (CDK) 5',
  'Cabang Dinas Kehutanan (CDK) 6',
  'Cabang Dinas Kehutanan (CDK) 7',
  'Cabang Dinas Kehutanan (CDK) 8',
  'Cabang Dinas Kehutanan (CDK) 9',
];

export const JENIS_USAHA_OPTIONS = [
  'Agroforestri',
  'Silvopastura',
  'Silvofishery',
  'Hasil Hutan Bukan Kayu (HHBK)',
  'Jasa Lingkungan / Ekowisata',
  'Usaha Kayu Rakyat',
  'Budidaya Madu',
  'Pengolahan Hasil Hutan',
  'Lainnya',
];

export const KELAS_KTH_OPTIONS = [
  'Pemula',
  'Madya',
  'Utama',
  'Mandiri',
];

export const BANK_OPTIONS = [
  'Bank Rakyat Indonesia (BRI)',
  'Bank Mandiri',
  'Bank Central Asia (BCA)',
  'Bank Negara Indonesia (BNI)',
  'Bank BJB',
  'Bank Syariah Indonesia (BSI)',
  'Bank Tabungan Negara (BTN)',
  'Bank CIMB Niaga',
  'Bank Danamon',
  'Bank Permata',
];

export interface StepperStep {
  number: number;
  line1: string;
  line2: string;
}

export const KTH_STEPPER_STEPS: StepperStep[] = [
  {
    number: 1,
    line1: 'Wilayah & Legalitas',
    line2: 'Kelompok',
  },
  {
    number: 2,
    line1: 'Profil &',
    line2: 'Kelembagaan KTH',
  },
  {
    number: 3,
    line1: 'Informasi Rekening',
    line2: 'Bank',
  },
];
