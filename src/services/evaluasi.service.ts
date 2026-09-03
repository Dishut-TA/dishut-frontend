const API_URL = import.meta.env.VITE_API_EXAMPLE;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==========================================
// A. DASHBOARD KEPALA BIDANG
// ==========================================
export const getDashboardKabidAPI = async () => {
  const response = await fetch(`${API_URL}/v1/evaluasi/dashboard`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

// ==========================================
// B. INISIASI PENUGASAN (KABID)
// ==========================================
export const getPenugasanKabidAPI = async () => {
  const response = await fetch(`${API_URL}/v1/evaluasi/penugasan/kabid`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload.data;
};

export const getDetailPenugasanKabidAPI = async (id_penugasan: string) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/penugasan/kabid/${id_penugasan}`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

export const getProgramsReadyAPI = async () => {
  const response = await fetch(`${API_URL}/v1/evaluasi/programs-ready`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

export const postPenugasanAPI = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/penugasan`, {
    method: 'POST',
    headers: getHeaders(true), // isFormData = true
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

// ==========================================
// C. PERHITUNGAN & TINDAK LANJUT (STAFF)
// ==========================================
export const getPenugasanStaffAPI = async () => {
  const response = await fetch(`${API_URL}/v1/evaluasi/penugasan/staff`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload.data;
};

export const getKalkulasiStaffAPI = async (idPenugasan: string) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/kalkulasi/${idPenugasan}`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

export const postKalkulasiStaffAPI = async (idPenugasan: string, data: any) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/kalkulasi/${idPenugasan}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

export const postTindakLanjutAPI = async (idEvaluasi: string, formData: FormData) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/tindak-lanjut/${idEvaluasi}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

// ==========================================
// D. LAPORAN & PENGESAHAN (KABID)
// ==========================================
export const getLaporanKabidAPI = async () => {
  const response = await fetch(`${API_URL}/v1/evaluasi/laporan`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload.data;
};

export const getDetailLaporanAPI = async (idLaporan: string) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/laporan/${idLaporan}`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};

export const putApproveLaporanAPI = async (idLaporan: string, data: any) => {
  const response = await fetch(`${API_URL}/v1/evaluasi/laporan/${idLaporan}/approve`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.payload;
};