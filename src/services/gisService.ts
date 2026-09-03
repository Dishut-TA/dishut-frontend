// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem("token")}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
});

export const uploadDataGIS = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sesi telah habis, silakan login kembali.");

    const response = await fetch(`${API_URL}/projects/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const responseText = await response.text();

    if (responseText.trim().startsWith('<')) {
      throw new Error('Gagal terhubung ke API: Server mengembalikan halaman HTML. Cek endpoint atau parameter payload.');
    }

    const responseData = JSON.parse(responseText);

    if (!response.ok) {
      let errorMessage = responseData?.message || 'Terjadi kesalahan saat mengunggah data.';
      if (responseData.errors) {
        const errorDetails = Object.values(responseData.errors).flat().join(', ');
        errorMessage = `${errorMessage} Detail: ${errorDetails}`;
      }

      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengunggah data GIS');
  }
};

export const getLatestProjectAPI = async () => {
  const res = await fetch(`${API_URL}/projects?status=completed&per_page=1`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil project terbaru");
  return res.json();
};

export const getTableCPIAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}/table`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil data tabel");
  return res.json();
};

export const getMapCPIAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}/map`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Gagal mengambil data peta");
  return res.json();
};

export const verifyZoneAPI = async (zoneId: string | number) => {
  const res = await fetch(`${API_URL}/zones/${zoneId}/verify`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status_kelayakan: 'Layak' })
  });
  if (!res.ok) throw new Error("Gagal memverifikasi zona");
  return res.json();
};