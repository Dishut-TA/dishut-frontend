import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ViewValidasiLokasi from './components/ViewValidasiLokasi';
import ViewPelaksanaan from './components/ViewPelaksanaan';

const DetailPenugasan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Fix: Just use location.state directly if available, fallback to session storage
  const [stateData, setStateData] = useState<any>(() => {
    if (location.state?.data) {
      return location.state;
    }
    try {
      const saved = sessionStorage.getItem(`penugasan_detail_${id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    if (location.state?.data) {
      try {
        sessionStorage.setItem(`penugasan_detail_${id}`, JSON.stringify(location.state));
        setStateData(location.state);
      } catch (e) {
        console.error("Gagal menyimpan state ke sessionStorage", e);
      }
    }
  }, [location.state, id]);

  const status = stateData?.status || location.state?.status || 'Menunggu Verifikasi';
  const jenisKegiatan = stateData?.jenisKegiatan || location.state?.jenisKegiatan || 'Pelaksanaan Penanaman';
  const data = stateData?.data || location.state?.data;

  // LOG UNTUK DEBUGGING
  console.log("=== DEBUG DETAIL PENUGASAN ===");
  console.log("ID dari URL:", id);
  console.log("location.state:", location.state);
  console.log("stateData (cache):", stateData);
  console.log("Status Akhir:", status);
  console.log("Jenis Kegiatan:", jenisKegiatan);
  console.log("Data Item:", data);
  console.log("==============================");

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-12 font-sans text-gray-800">
      
      {jenisKegiatan === 'Validasi Lokasi' ? (
        <ViewValidasiLokasi status={status} activeId={id || ''} data={data} />
      ) : (
        <ViewPelaksanaan status={status} activeId={id || ''} data={data} />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </div>
  );
};

export default DetailPenugasan;