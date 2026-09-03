import type { PegawaiProfile, PegawaiResponse, UpdatePegawaiJsonPayload } from './pegawai.type';

// const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Sesi telah habis, silakan login kembali.');
  return token;
};

export const getAllPegawai = async (): Promise<PegawaiResponse<PegawaiProfile[]>> => {
  try {
    const response = await fetch(`${API_URL}/pegawais`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthHeaders()}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data pegawai');
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan pada server');
  }
};

export const getPegawaiById = async (id: string | number): Promise<PegawaiProfile[]> => {
  try {
    const response = await fetch(`${API_URL}/pegawais/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthHeaders()}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data pegawai');
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan pada server');
  }
};

export const updatePegawaiJson = async (
  id: number | string, 
  payload: UpdatePegawaiJsonPayload
): Promise<PegawaiResponse<PegawaiProfile>> => {
  try {
    const response = await fetch(`${API_URL}/pegawais/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthHeaders()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal memperbarui data pegawai');
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan saat memperbarui data');
  }
};

export const updatePegawaiFormData = async (
  id: number | string, 
  formData: FormData
): Promise<PegawaiResponse<PegawaiProfile>> => {
  try {
    const response = await fetch(`${API_URL}/pegawais/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthHeaders()}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal memperbarui data dan foto pegawai');
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan saat mengunggah form data');
  }
};