import React from 'react';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineCamera, HiOutlineInformationCircle } from 'react-icons/hi2';
import { PiPlant, PiTree } from 'react-icons/pi';
import SharedDokumentasi from './SharedDokumentasi';

interface Props {
  periode: string;
}

const ContentMonitoringBerjalan: React.FC<Props> = ({ periode }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h3 className="text-sm font-bold text-slate-900 mb-2">Ringkasan Hasil Monitoring</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Mulai</p><h4 className="text-sm font-bold text-slate-900">10 Januari 2024</h4></div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Selesai</p><h4 className="text-sm font-bold text-slate-900">31 Desember 2024</h4></div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><PiPlant className="w-5 h-5 text-emerald-600"/><p className="text-[10px] font-bold text-slate-600">Tanaman Hidup</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">23.100</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Batang</p><span className="text-[10px] font-bold text-emerald-600">↑ 1.250</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><PiTree className="w-5 h-5 text-orange-500"/><p className="text-[10px] font-bold text-slate-600">Tanaman Mati</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">1.900</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Batang</p><span className="text-[10px] font-bold text-red-500">↑ 160</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><div className="w-5 h-5 rounded-full border-[3px] border-emerald-500 border-r-transparent"></div><p className="text-[10px] font-bold text-slate-600">Persentase Hidup</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">92,40%</h3>
        <div><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded">Baik</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><HiOutlineMapPin className="w-5 h-5 text-purple-600"/><p className="text-[10px] font-bold text-slate-600">Total Petak Ukur (PU)</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">3</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">PU</p><span className="text-[10px] font-bold text-orange-500">↑ -0</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><HiOutlineCamera className="w-5 h-5 text-slate-600"/><p className="text-[10px] font-bold text-slate-600">Dokumentasi</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">36</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Foto</p><span className="text-[10px] font-bold text-orange-500">↑ 12</span></div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F0FDF4] text-slate-700 font-bold border-b border-emerald-100 text-[10px]">
            <tr><th className="py-3 px-4">Indikator</th><th className="py-3 px-4">Target (P0)</th><th className="py-3 px-4">Hasil P1</th><th className="py-3 px-4">Hasil {periode}</th><th className="py-3 px-4">Selisih Pn - Pn</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Total Tanaman</td><td className="py-3.5 px-4">25.000 Batang</td><td className="py-3.5 px-4">25.000 Batang</td><td className="py-3.5 px-4">25.000 Batang</td><td className="py-3.5 px-4 font-bold">0</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Total Petak Ukur (PU)</td><td className="py-3.5 px-4">3 PU</td><td className="py-3.5 px-4">3 PU</td><td className="py-3.5 px-4">3 PU</td><td className="py-3.5 px-4 font-bold">0</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Tanaman Hidup</td><td className="py-3.5 px-4">25.000 Batang</td><td className="py-3.5 px-4">21.850 Batang</td><td className="py-3.5 px-4">23.100 Batang</td><td className="py-3.5 px-4 font-bold">1.250</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Tanaman Mati</td><td className="py-3.5 px-4">-</td><td className="py-3.5 px-4">1.740 Batang</td><td className="py-3.5 px-4">1.900 Batang</td><td className="py-3.5 px-4 font-bold text-slate-800">160</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Tanaman Disulam</td><td className="py-3.5 px-4">-</td><td className="py-3.5 px-4">1.140 Batang</td><td className="py-3.5 px-4">600 Batang</td><td className="py-3.5 px-4 font-bold">-810</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Persentase Hidup</td><td className="py-3.5 px-4">100,00%</td><td className="py-3.5 px-4">87,40%</td><td className="py-3.5 px-4">92,40%</td><td className="py-3.5 px-4 font-bold text-slate-800">5,00%</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Dokumentasi</td><td className="py-3.5 px-4">48 Foto</td><td className="py-3.5 px-4">24 Foto</td><td className="py-3.5 px-4">36 Foto</td><td className="py-3.5 px-4 font-bold">12</td></tr>
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2 items-center text-[10px] text-slate-500 font-medium">
        <HiOutlineInformationCircle className="w-4 h-4 shrink-0" /> Penilaian kriteria berdasarkan capaian terhadap target (P0) dan perubahan dari periode sebelumnya.
      </div>
    </div>

    <SharedDokumentasi />
  </div>
);

export default ContentMonitoringBerjalan;