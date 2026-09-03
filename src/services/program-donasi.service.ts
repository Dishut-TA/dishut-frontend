import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export interface DonationProgramPayload {
  analysis_result_id: number | null;
  kth_id: number;
  seed_specification_id: number;
  name: string;
  description?: string;
  location: string;
  total_seeds_collected: number;
  total_seeds_realized: number;
  status: string;
  jenis_bibit?: string[];
}

export interface DonationProgramResponseData {
  id: number;
  analysis_result_id: number | null;
  kth_id: number;
  seed_specification_id: number | null;
  name: string;
  description: string | null; 
  location: string;
  total_seeds_collected: number;
  total_seeds_realized: number;
  status: string;
  image_url: string | null;
  jenis_bibit?: any[];
  created_at: string;
  updated_at: string;
}

export interface GetDonationProgramsResponse {
  payload: DonationProgramResponseData[];
}

export const createDonationProgramAPI = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/donation-programs`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData, 
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan saat membuat program.');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

// PERBAIKAN: Gunakan FormData & POST dengan _method=PUT agar Laravel bisa menerima file gambar
export const updateDonationProgramAPI = async (id: string | number, formData: FormData) => {
  try {
    const token = localStorage.getItem('token'); 
    formData.append('_method', 'PUT'); // Trik Laravel untuk update form-data

    const response = await fetch(`${API_URL}/donation-programs/${id}`, {
      method: 'POST', // Tetap POST, tapi di-override oleh _method di atas
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan saat memperbarui program.');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const getDonationProgramsAPI = async (): Promise<GetDonationProgramsResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/donation-programs`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data program donasi dari server.');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const getDonationProgramByIdAPI = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/donation-programs/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil detail program.');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const deleteDonationProgramAPI = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/donation-programs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus program.');
  }
};