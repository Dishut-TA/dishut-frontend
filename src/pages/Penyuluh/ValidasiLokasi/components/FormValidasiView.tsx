import React, { useState, useEffect } from 'react';
import {
  HiOutlineDocumentText, HiOutlineDocumentCheck, HiOutlineMapPin, HiOutlinePlus, HiXMark, HiOutlineArrowLeft, HiOutlinePaperAirplane, HiOutlineBars3BottomLeft, HiOutlineCalendar, HiOutlineUser, HiOutlineInformationCircle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { PageHeader, InfoItem, RadioStatus } from './SharedComponents';
import { getMapCPIAPI } from '@/services/gisService';

export const FormValidasiView = ({ data, navigate }: { data: any, navigate: any }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    koordinat: '',
    kesesuaian: 'Sesuai dengan penugasan',
    kondisiUmum: '',
    catatan: '',
    status: ''
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<{file: File, preview: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [koordinatAPI, setKoordinatAPI] = useState<string>('-');

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const projectId = data.raw_data?.penugasanable?.project_id || 1; // default to 1 if not found
        const mapData = await getMapCPIAPI(projectId);
        console.log(mapData)
        const feature = mapData.features.find((f: any) => Number(f.properties?.zone_id) === Number(data.zone_id));
        if (feature && feature.geometry?.coordinates) {
          let lng, lat;
          // Handle Polygon or MultiPolygon
          if (feature.geometry.type === 'MultiPolygon') {
             [lng, lat] = feature.geometry.coordinates[0][0][0];
          } else {
             [lng, lat] = feature.geometry.coordinates[0][0];
          }
          const coordStr = `${lat}, ${lng}`;
          setKoordinatAPI(coordStr);
          setFormData(prev => ({ ...prev, koordinat: coordStr }));
          return; // Berhenti jika berhasil
        }
      } catch (err) {
        console.error("Gagal mengambil data peta:", err);
      }

      // Fallback jika tidak ditemukan di API Peta
      const p = data.raw_data?.penugasanable || {};
      const fallbackLat = p.latitude || p.lat || p.centroid_lat;
      const fallbackLng = p.longitude || p.lng || p.lon || p.centroid_lng;
      
      if (fallbackLat && fallbackLng) {
        const coordStr = `${fallbackLat}, ${fallbackLng}`;
        setKoordinatAPI(coordStr);
        setFormData(prev => ({ ...prev, koordinat: coordStr }));
      }
    };
    if (data.zone_id) fetchMapData();
  }, [data]);

  const INFO_DATA = [
    { id: 1, icon: HiOutlineDocumentText, label: 'ID Penugasan', value: data.displayId || data.id },
    { id: 2, icon: HiOutlineBars3BottomLeft, label: 'Sumber Lokasi', value: data.sumber || '-', isBadge: true, badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 3, icon: HiOutlineMapPin, label: 'Lokasi Penugasan', value: data.lokasi || '-' },
    { id: 4, icon: HiOutlineMapPin, label: 'Titik Koordinat', value: koordinatAPI },
    { id: 5, icon: HiOutlineCalendar, label: 'Batas Waktu Validasi', value: data.batasWaktu || '-' },
    { id: 6, icon: HiOutlineUser, label: 'Penyuluh', value: data.raw_data?.penyuluh?.username || 'Penyuluh' },
    { id: 7, icon: HiOutlineInformationCircle, label: 'Status Saat Ini', value: data.status || 'Ditugaskan', isBadge: true, badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  ];

  const handleGetLocation = () => {
    if (!("geolocation" in navigator)) {
      return toast.error('Browser perangkat Anda tidak mendukung fitur GPS.');
    }
    setIsGettingLocation(true);
    const loadingToast = toast.loading('Mencari titik koordinat...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setFormData(prev => ({ ...prev, koordinat: `${lat}, ${lng}` }));
        toast.success('Titik koordinat berhasil didapatkan!', { id: loadingToast });
        setIsGettingLocation(false);
      },
      () => {
        toast.error('Gagal mendapatkan lokasi.', { id: loadingToast });
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.koordinat || !formData.kondisiUmum || !formData.status || !formData.tanggal) {
      toast.error('Mohon lengkapi semua kolom yang wajib diisi (*)');
      return;
    }

    setIsSubmitting(true);
    const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
    const token = localStorage.getItem("token");
    let userName = data.raw_data?.penyuluh?.username || 'Penyuluh';

    const payloadData = new FormData();
    payloadData.append('zone_id', data.zone_id ? String(data.zone_id) : '');
    payloadData.append('nama_lokasi', data.lokasi || '');
    payloadData.append('nama_penyuluh', userName || '');
    payloadData.append('kondisi_lahan', formData.kondisiUmum || '');
    payloadData.append('titik_koordinat_gps', formData.koordinat || '');
    payloadData.append('catatan_peninjauan', formData.catatan || '');
    payloadData.append('kendala_lapangan', formData.status === 'Tidak Sesuai' ? formData.kesesuaian : '');
    
    if (uploadedPhotos.length > 0) {
      payloadData.append('foto', uploadedPhotos[0].file);
    }

    try {
      const res = await fetch(`${API_URL}/field-validations`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: payloadData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Validation Error:", errorData);
        const errMsg = errorData.message || 'Gagal menyimpan data validasi.';
        throw new Error(errMsg);
      }

      toast.success('Data validasi lapangan berhasil dikirim!');
      navigate('/admin/penyuluh/validasi-lokasi');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal mengirim data validasi lapangan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setUploadedPhotos([{ file, preview }]); // Hanya satu foto sesuai foto_lokasi_url
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-325 mx-auto pb-12">
      <PageHeader />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6 w-full">

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
              <HiOutlineDocumentText className="w-5 h-5 text-[#008A4B]" /> Informasi Penugasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {INFO_DATA.map(info => <InfoItem key={info.id} {...info} />)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-sm font-bold text-[#008A4B] flex items-center gap-2">
                <HiOutlineDocumentCheck className="w-5 h-5" /> Hasil Validasi Lokasi
              </h2>
              <button type="button" onClick={handleGetLocation} disabled={isGettingLocation} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#008A4B] border border-[#008A4B] rounded-lg hover:bg-emerald-50 transition-colors shadow-sm disabled:opacity-50">
                <HiOutlineMapPin className="w-3.5 h-3.5" /> Ambil Lokasi (GPS)
              </button>
            </div>

            <form id="validasi-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Tanggal Validasi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-[#008A4B]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Catatan Validasi <span className="text-slate-400 font-normal">(Opsional)</span></label>
                  <textarea rows={4} value={formData.catatan} onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} placeholder="Tambahkan catatan pendukung..." className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-[#008A4B] resize-none leading-relaxed text-slate-700"></textarea>
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Koordinat Lokasi <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.koordinat} readOnly placeholder="Klik tombol GPS di atas..." className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Kondisi Umum Lokasi <span className="text-red-500">*</span></label>
                  <textarea value={formData.kondisiUmum} onChange={(e) => setFormData({ ...formData, kondisiUmum: e.target.value })} placeholder="Deskripsikan kondisi lapangan..." className="w-full h-[calc(100%-25px)] px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-[#008A4B] resize-none leading-relaxed text-slate-700"></textarea>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-3">Status Hasil Validasi <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <RadioStatus label="Sesuai" value="Sesuai" current={formData.status} onChange={(e: any) => setFormData({ ...formData, status: e.target.value })} />
                  <RadioStatus label="Tidak Sesuai" value="Tidak Sesuai" current={formData.status} onChange={(e: any) => setFormData({ ...formData, status: e.target.value })} />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-3">Upload Dokumentasi <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-4">
                  {uploadedPhotos.map((photoObj, idx) => (
                    <div key={idx} className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={photoObj.preview} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full text-white flex items-center justify-center transition-colors">
                        <HiXMark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {uploadedPhotos.length === 0 && (
                    <label className="flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-emerald-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-emerald-50/30">
                      <HiOutlinePlus className="w-6 h-6 text-emerald-600 mb-1" />
                      <span className="text-xs font-bold text-emerald-600">Tambah Foto</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-4">
            <button onClick={() => navigate(-1)} className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
              <HiOutlineArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
                <HiOutlineDocumentText className="w-4 h-4" /> Simpan Draft
              </button>
              <button type="submit" form="validasi-form" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-[#008A4B] text-white text-xs font-bold rounded-lg hover:bg-emerald-800 flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-70">
                <HiOutlinePaperAirplane className="w-4 h-4 transform -rotate-45 mb-1" /> {isSubmitting ? 'Mengirim...' : 'Kirim Hasil Validasi'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
