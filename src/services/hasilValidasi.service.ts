const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

export const hasilValidasiService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/field-validations`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Gagal mengambil data validasi lapangan');
    }
    return response.json();
  },

  verify: async (id: number, status: 'Terima' | 'Tolak') => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/field-validations/${id}/verify`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status_verifikasi: status })
    });
    if (!response.ok) {
      throw new Error('Gagal memverifikasi data validasi lapangan');
    }
    return response.json();
  }
};
