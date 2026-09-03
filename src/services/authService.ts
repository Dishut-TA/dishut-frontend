import type { LoginPayload, RegisterPayload, UpdateUserPayload, UserProfile } from "@/utils/interface";

//  const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

const handleApiResponse = async (response: Response) => {

  const responseText = await response.text();

  if (responseText.trim().startsWith('<')) {
    throw new Error(
      'Gagal terhubung ke API: Server mengembalikan halaman HTML.'
    );
  }

  const responseData = JSON.parse(responseText);

  if (!response.ok) {
    throw new Error(
      responseData?.message || 'Terjadi kesalahan pada sistem.'
    );
  }

  return responseData;
};

export const registerAccount = async (data: RegisterPayload) => {
  try {
    const payloadToSend = {
      ...data,
      peran: data.peran ? [data.peran] : []
    };
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadToSend),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mendaftar akun');
  }
};

export const loginAccount = async (data: LoginPayload) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response); 
  } catch (error: any) {
    throw new Error(error.message || 'Login gagal');
  }
};

export const updateUser = async (id: string | number, data: UpdateUserPayload) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal memperbarui data akun');
  }
};

export const deleteUser = async (id: string | number) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menghapus user');
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem("token")}` 
      },
    });

    const responseText = await response.text();
    
    if (responseText.trim().startsWith('<')) {
      throw new Error("Gagal terhubung ke API: Server mengembalikan halaman HTML.");
    }
    
    const responseData = JSON.parse(responseText);

    if (!response.ok || responseData.code !== 200) {
      throw new Error(responseData?.message || 'Gagal mengambil data seluruh pengguna.');
    }

    return responseData.payload;
  } catch (error: any) {
    throw new Error(error.message || 'Terjadi kesalahan pada sistem');
  }
};

export const getUserById = async (id: string | number): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem("token")}` // Buka jika butuh token
      },
    });

    const data = await handleApiResponse(response);
    if (data.payload && data.payload.user) {
      return data.payload.user;
    } else if (data.user) {
      return data.user;
    }
    return data.payload; 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil detail data pengguna');
  }
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sesi telah habis, silakan login kembali.");

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await handleApiResponse(response);
    return data.payload;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil data user');
  }
};

export const logoutAccount = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return; 
    
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Gagal melakukan logout di sisi server:", error);
  }
};