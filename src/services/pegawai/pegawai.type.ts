export interface PegawaiProfile {
  id: number;
  nip: string | null;
  no_telp: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  foto_profile: string | null;
}

export interface PegawaiResponse<T> {
  message: string;
  code: number;
  payload: T;
}

export interface UpdatePegawaiJsonPayload {
  nip?: string;
  no_telp?: string;
  tanggal_lahir?: string;
  alamat?: string;
}