// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export const exportLaporanAPI = async (payload: any) => {
  try {
    const token = localStorage.getItem('token'); 
    
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengekspor laporan.');
    }

    return await response.blob(); 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};