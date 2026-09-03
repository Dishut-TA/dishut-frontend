// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export const getStaffDonasiDashboardAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data dashboard.');
    }

    return data.data; 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const getKabidDashboardAPI = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/dashboard-kabid`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Gagal mengambil data dashboard kabid");
  const result = await response.json();
  return result.data;
};

export const getDashboardKabidPDASAPI = async (year: string) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/kabid?year=${year}`);
    const result = await response.json();
    return result.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal memuat data dashboard');
  }
};