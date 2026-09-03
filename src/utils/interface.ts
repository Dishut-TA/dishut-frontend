export interface RegisterPayload {
  nama_pengguna: string;
  email: string;
  nip: string;
  kata_sandi: string;
  peran: string;
}

export interface LoginPayload {
  login: string; 
  kata_sandi: string;
}

export interface UpdateUserPayload {
  nama_pengguna: string;
  email: string;
  nip: string;
  kata_sandi?: string; 
  peran: string;
}

export interface PermissionType {
  id: number;
  nama: string;
  nama_penjaga: string;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface RoleType {
  id: number;
  nama: string;
  nama_penjaga: string;
  izin?: PermissionType[];
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface ProfilDetail {
  id: number;
  nip: string | null;
  no_telp: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  foto_profile: string | null;
}

export interface UserProfile {
  id: number;
  nama_pengguna: string;
  email: string;
  nip: string | null;
  peran: RoleType[];
  dibuat_pada: string;
  diperbarui_pada: string;
  profil?: ProfilDetail; 
  no_telp?: string | null;
  tanggal_lahir?: string | null;
  alamat?: string | null;
  foto_profile?: string | null;
}

export interface DetailBibitDana {
  nama: string;
  jumlah: number;
  hargaSatuan: number;
}

export type StatusType = 
  | 'Menunggu Verifikasi' 
  | 'Pending' 
  | 'Terealisasi' 
  | 'Disalurkan' 
  | 'Verified' 
  | 'Ditolak' 
  | string;

export interface DetailBibitDana {
  nama: string;
  jumlah: number;
  hargaSatuan: number;
}

export interface DonaturData {
  id: number;                     
  idTransaksi: string;            
  idDonasi: string;               
  namaDonatur: string;            
  program: string;                
  jumlahBibit: number;            
  status: StatusType;             
  rincianBibit: DetailBibitDana[];
  tanggalDonasi?: string;         
  receipt_path?: string | null;   
  certificate_path?: string | null; 
  proof_url: string;
}

export interface SeedSpecificationResponse {
  id: number;
  seed_id: number;
  min_height: number;
  max_height: number;
  stock: number;
  price: string;
}

export interface SeedResponse {
  id: number;
  kode: string;
  nama: string;
  jenis: string;
  kategori: string;
  deskripsi: string;
  status: string;
  specifications?: SeedSpecificationResponse[];
}

export interface DonorResponse {
  id: number;
  donor_name: string;
  address: string;
}

export interface DonationProgramResponse {
  id: number;
  name: string;
  location: string;
  status: string;
}

export interface DonationItemResponse {
  id: number;
  donation_program_id: number;
  donor_id: number;
  seed_id: number;
  seed_quantity: number;
  seed_status: string;
  receipt_path: string | null;
  certificate_path: string | null;
  created_at: string;
  updated_at: string;
  seed?: SeedResponse;
  donor?: DonorResponse;
  donation_program?: DonationProgramResponse;
}

export interface GetDonationsResponse {
  payload: DonationItemResponse[] | DonationItemResponse;
}

export type StatusProgram = 'Aktif' | 'Selesai' | 'Menunggu Verifikasi';

export interface DetailBibit {
  nama: string;
  jumlah: number;
  terealisasi: number; 
}

export interface ProgramData {
  id: string;
  nama: string;
  description?: string;
  lokasi: string;
  jenisBibit: DetailBibit[]; 
  terkumpul: string | number;
  totalTerealisasi: string | number; 
  status: StatusProgram;
}

export type StatusKegiatan = 'Terkumpul' | 'Disalurkan' | 'Terealisasi';
export type ModalType = 'preview' | 'rincian' | 'upload' | null;

export interface DetailBibitDana {
  nama: string;
  jumlah: number;
  hargaSatuan: number;
}

export interface KegiatanData {
  idTransaksi: string;
  program: string;
  jumlahBibit: number;
  status: StatusKegiatan;
  namaDonatur: string;
  rincianBibit: DetailBibitDana[];
}

export interface PetakUkur {
  blok: string;
  target: number;
  tumbuh: number;
  rerataTinggi: number;
  persentase: number;
  status: 'Memenuhi' | 'Tidak Memenuhi';
}

export interface EvaluasiProgramData {
  id: string;
  namaPerusahaan: string;
  lokasi: string;
  luasLahan: number;
  jenisTanaman: string[];
  tglEvaluasi: string;
  hasilAkhir: {
    persentaseTotal: number;
    rerataTinggiTotal: number;
    statusKelulusan: 'BERHASIL' | 'TIDAK BERHASIL';
  };
  timPenilai: {
    ketua: string;
    pendamping: string[];
  };
  rincianPU: PetakUkur[];
}

export interface Milestone {
  id?: string;
  program_id?: string;
  judul_milestone: string;
  deskripsi: string;
  target_tanggal: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DokumenInvestasi {
  id?: string;
  program_id?: string;
  tipe_dokumen: string;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramInvestasi {
  id: string;
  user_id: string;
  nama_program: string;
  kategori_usaha: string;
  target_dana: number;
  dana_terkumpul: number;
  persentase_terkumpul: number;
  persentase_keuntungan: number;
  periode_kontrak_bulan: number;
  batas_waktu_pengumpulan: string;
  deskripsi: string;
  status: string;
  created_at: string;
  milestones: Milestone[];
  dokumens: DokumenInvestasi[];
}

export interface CreateProgramInvestasiPayload {
  gambar?: string;
  nama_kth?: string;
  nama_program: string;
  kategori_usaha: string;
  target_dana: number;
  persentase_keuntungan: number;
  periode_kontrak_bulan: number;
  batas_waktu_pengumpulan: string;
  deskripsi: string;
  milestones: {
    judul_milestone: string;
    deskripsi: string;
    target_tanggal: string;
  }[];
  dokumens: {
    tipe_dokumen: string;
    file_url: string;
  }[];
}