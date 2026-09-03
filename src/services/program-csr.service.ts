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