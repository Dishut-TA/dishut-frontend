// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export interface KthPayload {
  cdk: string;
  kabupaten_kota: string;
  kecamatan: string;
  desa_kelurahan: string;
  nama: string;
  ketua: string;
  jenis_usaha: string;
}

export interface KthResponseData extends KthPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export const getKthsAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/kths`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const res = await response.json();
    if (!response.ok) throw new Error(res.message || 'Gagal mengambil data KTH');
    
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.payload && Array.isArray(res.payload)) return res.payload;
    
    return []; 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const createKthAPI = async (payload: KthPayload) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/kths`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal menyimpan data KTH');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const updateKthAPI = async (id: string | number, payload: KthPayload) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/kths/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal memperbarui data KTH');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const deleteKthAPI = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/kths/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal menghapus data KTH');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const importKthExcelAPI = async (file: File) => {
  try {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/kths/import`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengimpor file Excel');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};