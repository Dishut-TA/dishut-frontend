const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getMyPenugasanAPI = async () => {
  const response = await fetch(`${API_URL}/penugasan/me`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getMyKthPenugasanAPI = async () => {
  const response = await fetch(`${API_URL}/penugasan/kth-saya`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getAllPenugasanAPI = async () => {
  const response = await fetch(`${API_URL}/penugasan`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getPenugasanDashboardAPI = async () => {
  const response = await fetch(`${API_URL}/penugasan/dashboard`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getMonitoringDashboardAPI = async () => {
  const response = await fetch(`${API_URL}/monitoring/dashboard`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getPenugasanByIdAPI = async (id: string | number) => {
  const response = await fetch(`${API_URL}/penugasan/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const hentikanPenugasanAPI = async (id: string | number, alasan?: string) => {
  const response = await fetch(`${API_URL}/penugasan/${id}/hentikan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ alasan }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const storeMonitoringAPI = async (id: string | number, data: any) => {
  const response = await fetch(`${API_URL}/penugasan/${id}/tugaskan-monitoring`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
