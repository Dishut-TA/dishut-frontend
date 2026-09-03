import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export interface ZonasiData {
  id: number;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
}

export const getZonasisAPI = async (): Promise<ZonasiData[]> => {
  const response = await axios.get(`${API_URL}/zonasis`, {
    headers: {
      'Accept': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  return response.data.data;
};

export const uploadZonasiAPI = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/zonasis/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      // Jika butuh token login, buka comment di bawah ini:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  
  return response.data;
};