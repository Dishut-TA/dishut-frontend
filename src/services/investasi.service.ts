import type { CreateProgramInvestasiPayload, ProgramInvestasi } from "@/utils/interface";

const API_URL = import.meta.env.VITE_API_INVEST_URL;

export const getKthProgramsAPI = async (): Promise<ProgramInvestasi[]> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1'; 

  const response = await fetch(`${API_URL}/kth/programs`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Gagal memuat data investasi KTH.');
  }

  // Mengambil data baik bentuk array langsung maupun terbungkus dalam paginasi (payload.data)
  const payload = result.payload;
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
};

export const createKthProgramAPI = async (payloadData: CreateProgramInvestasiPayload): Promise<ProgramInvestasi> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/programs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payloadData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengajukan program investasi.');
  }

  return result.payload;
};

export const verifyProgramBupmAPI = async (id: string, payload: { status: string, catatan_verifikasi: string }) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1'; // Sesuai Dummy Auth

  const response = await fetch(`${API_URL}/bupm/programs/${id}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Gagal memverifikasi program investasi.');
  }

  return result.payload;
};

export const getKthWalletAPI = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/wallet`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Gagal memuat saldo dompet KTH.');
  }

  return result.payload;
};

export const getLaporanProyekByIdAPI = async (id: string) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-proyek/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat detail laporan proyek.');
  
  return result.payload;
};

export const getLaporanProyekAPI = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-proyek`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat laporan proyek.');
  
  if (Array.isArray(result.payload)) return result.payload;
  if (result.payload && Array.isArray(result.payload.data)) return result.payload.data;
  return [];
};

export const createLaporanProyekAPI = async (payload: any) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-proyek`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal membuat laporan proyek.');
  return result.payload;
};

export const getLaporanKeuanganByIdAPI = async (id: string) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-keuangan/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat detail laporan keuangan.');
  
  return result.payload;
};

export const getLaporanKeuanganAPI = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-keuangan`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat daftar laporan keuangan.');
  
  if (Array.isArray(result.payload)) return result.payload;
  if (Array.isArray(result.payload)) return result.payload;
  if (result.payload && Array.isArray(result.payload.data)) return result.payload.data;
  return [];
};

export const createLaporanKeuanganAPI = async (payload: any) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-keuangan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal membuat laporan keuangan.');
  return result.payload;
};

export const updateLaporanKeuanganAPI = async (id: string, payload: any) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/kth/laporan-keuangan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memperbarui laporan keuangan.');
  return result.payload;
};

export const getLaporanKeuanganBUPMAPI = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/bupm/laporan-keuangan`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat daftar laporan keuangan BUPM.');
  
  if (Array.isArray(result.payload)) return result.payload;
  if (result.payload && Array.isArray(result.payload.data)) return result.payload.data;
  return [];
};

export const getLaporanKeuanganBUPMByIdAPI = async (id: string) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/bupm/laporan-keuangan/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memuat detail laporan keuangan BUPM.');
  
  return result.payload;
};

export const verifyLaporanKeuanganBUPMAPI = async (id: string, payload: any) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id') || '1';

  const response = await fetch(`${API_URL}/bupm/laporan-keuangan/${id}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-Id': userId,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal memverifikasi laporan keuangan.');
  return result.payload;
};