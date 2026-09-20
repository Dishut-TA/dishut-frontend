// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  'Authorization': `Bearer ${getToken() ?? ''}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
});

const parseJsonResponse = async (response: Response, fallbackMessage: string) => {
  const responseText = await response.text();

  if (responseText.trim().startsWith('<')) {
    throw new Error('Gagal terhubung ke API: server mengembalikan halaman HTML. Cek endpoint API/backend.');
  }

  let responseData: any = {};
  if (responseText.trim()) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error(`${fallbackMessage} Respons server bukan JSON yang valid.`);
    }
  }

  if (!response.ok) {
    let errorMessage = responseData?.message || fallbackMessage;

    if (responseData?.error) {
      errorMessage = `${errorMessage} ${responseData.error}`;
    }

    if (responseData?.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage} Detail: ${errorDetails}`;
    }

    throw new Error(errorMessage);
  }

  return responseData;
};

const sendGISForm = async (url: string, formData: FormData, fallbackMessage: string) => {
  const token = getToken();
  if (!token) throw new Error("Sesi telah habis, silakan login kembali.");

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  return parseJsonResponse(response, fallbackMessage);
};

export const uploadDataGIS = async (formData: FormData) => {
  return sendGISForm(
    `${API_URL}/projects/upload`,
    formData,
    'Terjadi kesalahan saat mengunggah data GIS.'
  );
};

export const reanalyzeDataGIS = async (projectId: string | number, formData: FormData) => {
  return sendGISForm(
    `${API_URL}/projects/${projectId}/reanalyze`,
    formData,
    'Terjadi kesalahan saat memperbarui data peta.'
  );
};

export const getProjectsAPI = async (perPage = 15) => {
  const res = await fetch(`${API_URL}/projects?per_page=${perPage}`, { headers: getHeaders() });
  return parseJsonResponse(res, "Gagal mengambil riwayat project");
};

export const getLatestProjectAPI = async () => {
  const res = await fetch(`${API_URL}/projects?status=completed&per_page=1`, { headers: getHeaders() });
  return parseJsonResponse(res, "Gagal mengambil project terbaru");
};

export const getProjectAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}`, { headers: getHeaders() });
  return parseJsonResponse(res, "Gagal mengambil detail project");
};

export const getProjectEditDataAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}/edit-data`, {
    headers: getHeaders(),
    cache: 'no-store',
  });
  return parseJsonResponse(res, "Gagal mengambil data indikator project untuk diedit");
};

export const getTableCPIAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}/table`, { headers: getHeaders() });
  return parseJsonResponse(res, "Gagal mengambil data tabel");
};

export const getMapCPIAPI = async (projectId: string | number) => {
  const res = await fetch(`${API_URL}/projects/${projectId}/map`, { headers: getHeaders() });
  return parseJsonResponse(res, "Gagal mengambil data peta");
};

export const verifyZoneAPI = async (zoneId: string | number) => {
  const res = await fetch(`${API_URL}/zones/${zoneId}/verify`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status_kelayakan: 'Layak' })
  });
  return parseJsonResponse(res, "Gagal memverifikasi zona");
};
