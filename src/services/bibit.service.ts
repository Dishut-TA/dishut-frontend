// const API_URL = import.meta.env.VITE_API_MASTER_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

export interface BibitPayload {
  kode: string;
  nama: string;
  jenis: string;
  kategori: string;
  deskripsi: string;
  status: string;
}

export interface BibitResponseData {
  id: number;
  kode: string;
  nama: string;
  jenis: string;
  kategori: string;
  deskripsi: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetBibitsResponse {
  payload: BibitResponseData[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SeedSpecificationPayload {
  seed_id: number;
  min_height: number;
  max_height: number;
  stock: number;
  price: number;
}

export interface SeedSpecResponseData {
  id: number;
  seed_id: number;
  min_height: number;
  max_height: number;
  stock: number;
  price: string;
}

export interface GetSeedSpecsResponse {
  payload: SeedSpecResponseData[];
}

export const createBibitAPI = async (payload: BibitPayload) => {
  try {
    const token = localStorage.getItem('token'); 
    
    const response = await fetch(`${API_URL}/bibits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat menyimpan data bibit.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const updateBibitAPI = async (id: string | number, payload: BibitPayload) => {
  try {
    const token = localStorage.getItem('token'); 
    
    const response = await fetch(`${API_URL}/bibits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat memperbarui data bibit.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const createSeedSpecificationAPI = async (payload: SeedSpecificationPayload) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${API_URL}/seed-specifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat menyimpan spesifikasi bibit.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server saat menyimpan spesifikasi.');
  }
};

export const updateSeedSpecificationAPI = async (id: string | number, payload: SeedSpecificationPayload) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${API_URL}/seed-specifications/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat memperbarui spesifikasi bibit.');
    }
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server saat memperbarui spesifikasi.');
  }
};

export const getBibitsAPI = async (page: number = 1): Promise<GetBibitsResponse> => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/bibits?page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data bibit dari server.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};

export const getSeedSpecificationsAPI = async (): Promise<GetSeedSpecsResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/seed-specifications`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil data spesifikasi.');
  }
};

export const getBibitByIdAPI = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/bibits/${id}/detail`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail master bibit.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal terhubung ke server.');
  }
};