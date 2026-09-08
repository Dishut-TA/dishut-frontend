const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/** Satu periode pada siklus rehabilitasi P0-P4. */
export interface PeriodeSiklus {
  periode: string;
  label: string;
  jumlah_petak: number;
  rencana_tanaman: number;
  bibit_tumbuh: number;
  bibit_mati: number;
  persentase_tumbuh: number | null;
  lolos_ambang_batas: boolean | null;
  status_evaluasi: string | null;
  tanggal_evaluasi: string | null;
  ada_tindak_lanjut: boolean;
  diukur_at: string | null;
}

export interface RingkasanSiklus {
  program_id: number;
  program_type: string;
  /** Alias pendek untuk URL: apbd, csr, atau donasi. */
  program_alias: string | null;
  nama_program: string;
  sumber_dana: string;
  periode_aktif: string;
  status_siklus: string;
  siklus_terakhir_at: string | null;
  periode_terakhir: string;
  ambang_batas_tumbuh: number;
  bisa_naik_periode: boolean;
  alasan_tidak_bisa_naik: string | null;
  riwayat: PeriodeSiklus[];
}

const bacaJson = async (response: Response) => {
  const isi = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(isi?.message || `HTTP error! status: ${response.status}`);
  }

  return isi;
};

/** Ringkasan siklus lewat id penugasan, dipakai halaman detail. */
export const getSiklusByPenugasanAPI = async (penugasanId: number | string): Promise<RingkasanSiklus> => {
  const response = await fetch(`${API_URL}/penugasan/${penugasanId}/siklus`, { headers: getHeaders() });
  const isi = await bacaJson(response);
  return isi.data;
};

/** Ringkasan siklus lewat tipe dan id program (apbd, csr, donasi). */
export const getSiklusProgramAPI = async (tipe: string, id: number | string): Promise<RingkasanSiklus> => {
  const response = await fetch(`${API_URL}/program-siklus/${tipe}/${id}`, { headers: getHeaders() });
  const isi = await bacaJson(response);
  return isi.data;
};

/**
 * Menaikkan program ke periode berikutnya secara manual.
 *
 * Di produksi kenaikan dijalankan penjadwal harian di server; pemicu ini
 * dipakai Kepala Bidang PDAS ketika siklus perlu dijalankan lebih awal.
 */
export const naikkanPeriodeAPI = async (tipe: string, id: number | string) => {
  const response = await fetch(`${API_URL}/program-siklus/${tipe}/${id}/naikkan`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return bacaJson(response);
};
