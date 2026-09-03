import type { RoleType, PermissionType } from "@/utils/interface";

// const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_EXAMPLE;

const handleApiResponse = async (response: Response) => {
  const responseText = await response.text();
  if (responseText.trim().startsWith('<')) {
    throw new Error("Gagal terhubung ke API: Server mengembalikan halaman HTML.");
  }
  const responseData = JSON.parse(responseText);
  if (!response.ok || (responseData.code && responseData.code !== 200 && responseData.code !== 201)) {
    throw new Error(responseData?.message || 'Terjadi kesalahan pada sistem.');
  }
  return responseData;
};

export const getAllRoles = async (): Promise<RoleType[]> => {
  try {
    const response = await fetch(`${API_URL}/roles`, { method: 'GET' });
    const data = await handleApiResponse(response);
    return data.payload; 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil data daftar role');
  }
};

export const getRoleById = async (id: string | number): Promise<RoleType> => {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, { method: 'GET' });
    const data = await handleApiResponse(response);
    return data.payload;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil detail role');
  }
};

export const createRole = async (payload: { nama: string }) => {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menambahkan role baru');
  }
};

export const updateRole = async (id: string | number, payload: { nama: string }) => {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal memperbarui role');
  }
};

export const deleteRole = async (id: string | number) => {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, { method: 'DELETE' });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menghapus role');
  }
};

export const getAllPermissions = async (): Promise<PermissionType[]> => {
  try {
    const response = await fetch(`${API_URL}/permissions`, { method: 'GET' });
    const data = await handleApiResponse(response);
    return data.payload; 
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil data daftar permission');
  }
};

export const getPermissionById = async (id: string | number): Promise<PermissionType> => {
  try {
    const response = await fetch(`${API_URL}/permissions/${id}`, { method: 'GET' });
    const data = await handleApiResponse(response);
    return data.payload;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil detail permission');
  }
};

export const updatePermission = async (id: string | number, payload: { nama: string; nama_penjaga: string }) => {
  try {
    const response = await fetch(`${API_URL}/permissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal memperbarui permission');
  }
};

export const deletePermission = async (id: string | number) => {
  try {
    const response = await fetch(`${API_URL}/permissions/${id}`, { method: 'DELETE' });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menghapus permission');
  }
};

export const createPermission = async (payload: { nama: string; nama_penjaga: string }) => {
  try {
    const response = await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menambahkan permission baru');
  }
};

