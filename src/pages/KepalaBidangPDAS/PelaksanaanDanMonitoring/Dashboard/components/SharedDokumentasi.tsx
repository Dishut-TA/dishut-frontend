import React from 'react';
import { HiOutlineCamera, HiOutlineCalendar, HiOutlineMapPin, HiOutlineInformationCircle } from 'react-icons/hi2';

const STORAGE_BASE_URL = (import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage').replace(/\/$/, '');

const tanggalId = (nilai?: string | null) => {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const SharedDokumentasi: React.FC<{ dokumentasi?: any[] }> = ({ dokumentasi }) => {
  const images = (Array.isArray(dokumentasi) ? dokumentasi : []).map((d: any) => ({
    title: d.jenis_dokumentasi || d.keterangan || 'Dokumentasi',
    src: `${STORAGE_BASE_URL}/${d.file_path}`,
    tanggal: tanggalId(d.created_at),
    isMap: false,
  }));



  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900">Dokumentasi</h3>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
          <HiOutlineCamera className="w-3 h-3"/> Total {images.length} Foto
        </span>
      </div>
      {images.length === 0 ? (
        <p className="text-[11px] text-slate-400 font-medium py-6 text-center">
          Belum ada dokumentasi lapangan yang diunggah penyuluh.
        </p>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {images.map((img, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-4/3 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer">
              <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              {img.isMap && <div className="absolute inset-0 flex items-center justify-center"><HiOutlineMapPin className="w-6 h-6 text-red-500 drop-shadow-md"/></div>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">{img.title}</p>
              <p className="text-[9px] text-slate-500 flex items-center gap-1"><HiOutlineCalendar className="w-2.5 h-2.5"/> {img.tanggal}</p>
            </div>
          </div>
        ))}
      </div>
      )}
      <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2 items-center text-[10px] text-slate-500 font-medium rounded-b-xl mt-4">
        <HiOutlineInformationCircle className="w-4 h-4 shrink-0" /> Penilaian kriteria berdasarkan capaian terhadap target (P0) dan perubahan dari periode sebelumnya.
      </div>
    </div>
  );
};

export default SharedDokumentasi;