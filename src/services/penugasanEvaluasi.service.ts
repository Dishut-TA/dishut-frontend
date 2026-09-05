import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: any = {
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  return headers;
};

export const getPenugasanEvaluasiList = async () => {
  const res = await axios.get(`${API_URL}/penugasan-evaluasi`, { headers: getHeaders() });
  return res.data;
};

export const getProgramsReadyForEvaluasi = async () => {
  const res = await axios.get(`${API_URL}/penugasan-evaluasi/programs`, { headers: getHeaders() });
  return res.data;
};

export const getPenugasanEvaluasiDetail = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/penugasan-evaluasi/${id}`, { headers: getHeaders() });
  return res.data;
};

export const createPenugasanEvaluasi = async (formData: FormData) => {
  const res = await axios.post(`${API_URL}/penugasan-evaluasi`, formData, { headers: getHeaders(true) });
  return res.data;
};

export const mulaiPenugasanEvaluasi = async (id: string | number) => {
  const res = await axios.put(`${API_URL}/penugasan-evaluasi/${id}/mulai`, {}, { headers: getHeaders() });
  return res.data;
};

export const getDaftarPerhitunganEvaluasi = async () => {
  const res = await axios.get(`${API_URL}/penugasan-evaluasi-perhitungan`, { headers: getHeaders() });
  return res.data;
};

export const simpanDataFaktualLapangan = async (id: string | number, payload: any) => {
  const res = await axios.put(`${API_URL}/penugasan-evaluasi/${id}/faktual`, payload, { headers: getHeaders() });
  return res.data;
};

export const kalkulasiHasilEvaluasi = async (id: string | number, payload: any) => {
  const res = await axios.put(`${API_URL}/penugasan-evaluasi/${id}/kalkulasi`, payload, { headers: getHeaders() });
  return res.data;
};

export const buatArahanTindakLanjut = async (id: string | number, payload: any) => {
  const res = await axios.post(`${API_URL}/penugasan-evaluasi/${id}/tindak-lanjut`, payload, { headers: getHeaders() });
  return res.data;
};
