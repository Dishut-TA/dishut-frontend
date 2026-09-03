export type ViewMode = 'rekap' | 'table' | 'input' | 'edit';

export type MonitoringStatus = 'Siap Monitoring' | 'Berjalan' | 'Menunggu Evaluasi' | 'Tindak Lanjut' | 'Selesai' | 'Dihentikan';

export interface MonitoringRow {
  id: string;
  idTanaman: string;
  jenisTanaman: string;
  koordinat: string;
  tinggiAwal: string;
  waktuPelaksanaan: string;
  fotoSebelum: boolean;
  fotoSesudah: boolean;
  waktuMonitoring: string | null;
  tinggiSaatMonitoring: string | null;
  kondisiTanaman: 'Sehat' | 'Perlu Perawatan' | 'Rusak Ringan' | 'Belum Disulam' | 'Sudah Disulam' | '-';
  status: 'Hidup' | 'Mati' | '-';
}

export interface ProgramData {
  nama: string;
  lokasi: string;
  periode: string;
  sumber_dana: string;
  petak_ukurs: string;
  petakUkurs: string;
  kth: string;
  penyuluh: {
    name: string;
  }
  nama_program: string;
}

export interface RekapRow {
  pu: string;
  total: number;
  hidup: number;
  pctHidup: number;
  mati: number;
  pctMati: number;
  rawat: number;
  pctRawat: number;
  foto: number;
  status: string;
  update: string;
}