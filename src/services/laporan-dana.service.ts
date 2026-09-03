const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getLaporanDanasAPI = async () => {
  const res = await fetch(`${API_URL}/laporan-danas`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil data laporan dana");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data;
};

export const getLaporanDanaByIdAPI = async (id: string | number) => {
  const res = await fetch(`${API_URL}/laporan-danas/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil detail laporan dana");
  return await res.json();
};

export const createLaporanDanaAPI = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/laporan-danas`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengirim laporan dana");
  return json;
};

export const updateStatusLaporanAPI = async (id: string | number, payload: { status: string; catatan?: string }) => {
  const res = await fetch(`${API_URL}/laporan-danas/${id}/status`, {
    method: "PUT",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate status laporan");
  return json;
};

export const updateLaporanDanaAPI = async (id: string | number, formData: FormData) => {
  formData.append('_method', 'PUT');

  const res = await fetch(`${API_URL}/laporan-danas/${id}`, {
    method: "POST",
    headers: getHeaders(), 
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate laporan dana");
  return json;
};