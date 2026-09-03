import React from 'react';
import { HiOutlineCamera, HiOutlineCalendar, HiOutlineMapPin, HiOutlineInformationCircle } from 'react-icons/hi2';

const SharedDokumentasi: React.FC = () => {
  const images = [
    { title: 'Lokasi Rehabilitasi', src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=300&auto=format&fit=crop' },
    { title: 'Distribusi Bibit', src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=300&auto=format&fit=crop' },
    { title: 'Pengukuran Petak Ukur', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=300&auto=format&fit=crop' },
    { title: 'Pelaksanaan Penanaman', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop' },
    { title: 'Monitoring', src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300&auto=format&fit=crop', isMap: true },
    { title: 'Pemeliharaan', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900">Dokumentasi</h3>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
          <HiOutlineCamera className="w-3 h-3"/> Total 36 Foto
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {images.map((img, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-4/3 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer">
              <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              {img.isMap && <div className="absolute inset-0 flex items-center justify-center"><HiOutlineMapPin className="w-6 h-6 text-red-500 drop-shadow-md"/></div>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">{img.title}</p>
              <p className="text-[9px] text-slate-500 flex items-center gap-1"><HiOutlineCalendar className="w-2.5 h-2.5"/> 22 Mei 2026</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2 items-center text-[10px] text-slate-500 font-medium rounded-b-xl mt-4">
        <HiOutlineInformationCircle className="w-4 h-4 shrink-0" /> Penilaian kriteria berdasarkan capaian terhadap target (P0) dan perubahan dari periode sebelumnya.
      </div>
    </div>
  );
};

export default SharedDokumentasi;