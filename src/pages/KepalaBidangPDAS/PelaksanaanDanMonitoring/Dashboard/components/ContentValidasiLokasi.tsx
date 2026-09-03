import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi2';
import SharedDokumentasi from './SharedDokumentasi';

const ContentValidasiLokasi: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h3 className="text-sm font-bold text-slate-900 mb-2">Ringkasan Hasil Validasi Lokasi</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-500"><HiOutlineCalendar className="w-4 h-4"/><span className="text-[10px] font-semibold">Tanggal Mulai</span></div>
            <h4 className="text-sm font-bold text-slate-900">10 Januari 2024</h4>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-500"><HiOutlineCalendar className="w-4 h-4"/><span className="text-[10px] font-semibold">Tanggal Selesai</span></div>
            <h4 className="text-sm font-bold text-slate-900">31 Desember 2024</h4>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h4 className="text-xs font-bold text-slate-900 mb-4">Detail Validasi Lokasi</h4>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Lokasi</span><span className="font-semibold text-slate-900">Kec. Cikajang, Kab. Garut, Jawa Barat</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Hasil Validasi</span><span><span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">SESUAI</span></span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Tanggal Validasi</span><span className="font-semibold text-slate-900">10 Januari 2024</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Validator</span><span className="font-semibold text-slate-900">Siti Nurhayati (Penyuluh Kehutanan)</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Luas Target</span><span className="font-semibold text-slate-900">125,50 Ha</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Luas Hasil Validasi</span><span className="font-semibold text-slate-900">125,50 Ha</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Koordinat (Longitude, Latitude)</span><span className="font-semibold text-slate-900">107.996123, -7.248765</span></div>
            <div className="grid grid-cols-[120px_1fr] items-start"><span className="text-slate-500">Keterangan</span><span className="font-semibold text-slate-900 leading-relaxed">Lokasi sesuai dengan SK penetapan dan kondisi lapangan.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
        <h4 className="text-xs font-bold text-slate-900 mb-4">Lokasi (Peta)</h4>
        <div className="w-full flex-1 rounded-lg relative overflow-hidden border border-slate-200 min-h-62.5 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')] bg-cover bg-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-48 h-48 overflow-visible opacity-90 drop-shadow-md">
              <polygon points="10,50 30,20 70,30 90,70 60,90 20,80" fill="rgba(16, 185, 129, 0.4)" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="10" cy="50" r="3" fill="white" />
              <circle cx="30" cy="20" r="3" fill="white" />
              <circle cx="70" cy="30" r="3" fill="white" />
              <circle cx="90" cy="70" r="3" fill="white" />
              <circle cx="60" cy="90" r="3" fill="white" />
              <circle cx="20" cy="80" r="3" fill="white" />
            </svg>
          </div>
        </div>
      </div>

    </div>

    <SharedDokumentasi />
  </div>
);

export default ContentValidasiLokasi;