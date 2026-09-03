export interface ActivityDetail {
  id: number;
  title: string;
  wilayahPrioritas: string;
  location: string;
  jenisProgram: "Program Donasi" | "Program APBD" | "Program CSR" | "Program Mandiri";
  subProgramName?: string;
  tipeIntervensi: string;
  kthPelaksana: string;
  jenisKegiatanFisik: string;
  targetLuas: number;
  targetBibit: number;
  jenisTanaman: string;
  estimasiAnggaran: number;
  sumberPendanaan: string;
  startDate: string;
  endDate: string;
  time: string;
  author: string;
  progress: number;
  status: "Berjalan" | "Selesai" | "Bermasalah";
  deskripsi: string;
  sdmTambahan: string;
  kebutuhanAlat: string;
  timelineLogs: { id: number; tanggal: string; pesan: string; oleh: string; }[];
}