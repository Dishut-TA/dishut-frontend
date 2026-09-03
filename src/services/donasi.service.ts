import axios from "axios";

// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export const getDonationsAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/donations`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data donasi dari server.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const updateDonationStatusAPI = async (id: number | string, status: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/donations/${id}`, {
    seed_status: status 
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteDonationAPI = async (id: number | string) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/donations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};