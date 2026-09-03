const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getProgramApbdsAPI = async () => {
  const res = await fetch(`${API_URL}/program-apbds`, { 
    headers: getHeaders() 
  });
  if (!res.ok) throw new Error("Gagal mengambil data Program APBD");
  
  const data = await res.json();
  return Array.isArray(data) ? data : data.data; 
};

export const getProgramApbdByIdAPI = async (id: string | number) => {
  const res = await fetch(`${API_URL}/program-apbds/${id}`, { 
    headers: getHeaders() 
  });
  if (!res.ok) throw new Error("Gagal mengambil detail Program APBD");
  
  return await res.json();
};

export const createProgramApbdAPI = async (payload: any) => {
  const res = await fetch(`${API_URL}/program-apbds`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal membuat Program APBD");
  
  return json;
};

export const updateProgramApbdStatusAPI = async (id: string | number, status: 'Terverifikasi' | 'Ditolak' | 'Menunggu Persetujuan' | 'Selesai') => {
  const res = await fetch(`${API_URL}/program-apbds/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate status Program APBD");
  
  return json;
};

export const updateProgramApbdAPI = async (id: string | number, payload: any) => {
  const res = await fetch(`${API_URL}/program-apbds/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate Program APBD");
  
  return json;
};

export const deleteProgramApbdAPI = async (id: string | number) => {
  const res = await fetch(`${API_URL}/program-apbds/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal menghapus Program APBD");
  
  return json;
};