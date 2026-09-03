const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

export const rehabilitasiService = {
  getValidZones: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rehabilitasi/valid-zones`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Gagal mengambil data zona valid');
    }
    return response.json();
  },

  submitRencana: async (zoneId: number, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rehabilitasi/submit/${zoneId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Gagal mensubmit rencana rehabilitasi');
    }
    return response.json();
  }
};
