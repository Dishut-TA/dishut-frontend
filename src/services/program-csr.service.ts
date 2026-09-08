const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getFormHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getProgramCsrsAPI = async () => {
  const res = await fetch(`${API_URL}/program-csrs`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil data Program CSR");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data; 
};

export const getDashboardCsrAPI = async () => {
  const res = await fetch(`${API_URL}/dashboard-csr`, { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil data Dashboard CSR");
  return json.data;
};

export const getProgramCsrByIdAPI = async (id: string | number) => {
  const res = await fetch(`${API_URL}/program-csrs/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil detail Program CSR");
  return await res.json();
};

export const createProgramCsrAPI = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/program-csrs`, {
    method: "POST",
    headers: getFormHeaders(), 
    body: formData,
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengajukan Program CSR");
  
  return json;
};

export const updateProgramCsrAPI = async (id: string | number, formData: FormData) => {
  formData.append('_method', 'PUT');

  const res = await fetch(`${API_URL}/program-csrs/${id}`, {
    method: "POST", 
    headers: getFormHeaders(),
    body: formData,
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal memperbarui pengajuan CSR");
  
  return json;
};

export const updateProgramCsrStatusAPI = async (id: string | number, payload: any) => {
  const res = await fetch(`${API_URL}/program-csrs/${id}`, {
    method: "PUT",
    headers: getHeaders(), 
    body: JSON.stringify(payload),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate pengajuan CSR");
  
  return json;
};

export const deleteProgramCsrAPI = async (id: string | number) => {
  const res = await fetch(`${API_URL}/program-csrs/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal menghapus pengajuan CSR");
  
  return json;
};

// ============================================================================
// Penghentian Pendanaan CSR (PRD Feature 7)
// ============================================================================

/**
 * Mencatat pendanaan mitra CSR atas sebuah program (tabel transaksi_csrs).
 * Baris inilah yang jadi bukti kepemilikan saat mitra ingin menghentikan
 * pendanaan. csr_id ditentukan backend dari token, bukan dari payload ini.
 */
export const catatPendanaanCsrAPI = async (payload: {
  program_csr_id: number | string;
  nominal: number;
  tanggal_pendanaan?: string;
  status?: "Menunggu Pembayaran" | "Dibayar";
}) => {
  const res = await fetch(`${API_URL}/transaksi-csrs`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mencatat pendanaan CSR");

  return json;
};

/**
 * Program CSR yang didanai oleh akun mitra CSR yang sedang login.
 * Kepemilikan divalidasi di backend lewat tabel transaksi_csrs.
 */
export const getProgramCsrSayaAPI = async () => {
  const res = await fetch(`${API_URL}/program-csrs/saya`, { headers: getHeaders() });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil program CSR Anda");

  return json.data;
};

export interface HasilEvaluasiCsr {
  program_csr_id: number;
  nama_program: string;
  status_program: string;
  ambang_batas_tumbuh: number;
  persentase_tumbuh_terakhir: number | null;
  di_bawah_ambang_batas: boolean;
  boleh_dihentikan: boolean;
  alasan_tidak_boleh: string | null;
  evaluasi: any | null;
  riwayat_evaluasi?: any[]; // Tambahan riwayat evaluasi periodik
  dokumentasi?: any[];
  penghentian: {
    alasan: string | null;
    dihentikan_at: string | null;
    dihentikan_by: number | null;
    persentase_tumbuh_terakhir: number | null;
  } | null;
}

export const getHasilEvaluasiCsrAPI = async (
  id: string | number
): Promise<HasilEvaluasiCsr> => {
  const res = await fetch(`${API_URL}/program-csrs/${id}/hasil-evaluasi`, {
    headers: getHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil hasil evaluasi program");

  return json.data;
};

export const hentikanPendanaanCsrAPI = async (
  id: string | number,
  alasan: string
) => {
  const res = await fetch(`${API_URL}/program-csrs/${id}/hentikan-pendanaan`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ alasan }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal menghentikan pendanaan program");

  return json;
};
