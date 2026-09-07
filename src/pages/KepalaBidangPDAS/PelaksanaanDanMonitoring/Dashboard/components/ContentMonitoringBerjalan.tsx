import React from 'react';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineCamera, HiOutlineInformationCircle } from 'react-icons/hi2';
import { PiPlant, PiTree } from 'react-icons/pi';
import SharedDokumentasi from './SharedDokumentasi';

interface Props {
  periode: string;
}

const angka = (v?: number | null) => (v === null || v === undefined ? '-' : Number(v).toLocaleString('id-ID'));

const tanggalId = (nilai?: string | null) => {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ContentMonitoringBerjalan: React.FC<Props & { data?: any }> = ({ periode, data }) => {
  const hidup = data?.stats?.tanamanHidup ?? 0;
  const mati = data?.stats?.tanamanMati ?? 0;
  const target = data?.stats?.targetTanam ?? 0;
  const totalPu = data?.stats?.countGeotag ?? 0;
  const foto = (data?.dokumentasiProgram || data?.dokumentasiList || []).length;
  const persenHidup = target > 0 ? ((hidup / target) * 100).toFixed(2).replace('.', ',') : '0,00';

  return (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h3 className="text-sm font-bold text-slate-900 mb-2">Ringkasan Hasil Monitoring</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Mulai</p><h4 className="text-sm font-bold text-slate-900">{tanggalId(data?.tanggal_penugasan)}</h4></div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Selesai</p><h4 className="text-sm font-bold text-slate-900">{tanggalId(data?.batas_waktu)}</h4></div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><PiPlant className="w-5 h-5 text-emerald-600"/><p className="text-[10px] font-bold text-slate-600">Tanaman Hidup</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{angka(hidup)}</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Batang</p><span className="text-[10px] font-bold text-slate-300" title="Perbandingan antar periode belum tersimpan">-</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><PiTree className="w-5 h-5 text-orange-500"/><p className="text-[10px] font-bold text-slate-600">Tanaman Mati</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{angka(mati)}</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Batang</p><span className="text-[10px] font-bold text-slate-300" title="Perbandingan antar periode belum tersimpan">-</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><div className="w-5 h-5 rounded-full border-[3px] border-emerald-500 border-r-transparent"></div><p className="text-[10px] font-bold text-slate-600">Persentase Hidup</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{persenHidup}%</h3>
        <div><span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${Number(persenHidup.replace(',', '.')) >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{Number(persenHidup.replace(',', '.')) >= 75 ? 'Baik' : 'Perlu Perhatian'}</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><HiOutlineMapPin className="w-5 h-5 text-purple-600"/><p className="text-[10px] font-bold text-slate-600">Total Petak Ukur (PU)</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{angka(totalPu)}</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">PU</p><span className="text-[10px] font-bold text-slate-300" title="Perbandingan antar periode belum tersimpan">-</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
        <div className="flex items-center gap-2 mb-2"><HiOutlineCamera className="w-5 h-5 text-slate-600"/><p className="text-[10px] font-bold text-slate-600">Dokumentasi</p></div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{angka(foto)}</h3>
        <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400">Foto</p><span className="text-[10px] font-bold text-slate-300" title="Perbandingan antar periode belum tersimpan">-</span></div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F0FDF4] text-slate-700 font-bold border-b border-emerald-100 text-[10px]">
            <tr><th className="py-3 px-4">Indikator</th><th className="py-3 px-4">Target (P0)</th><th className="py-3 px-4">Hasil P1</th><th className="py-3 px-4">Hasil {periode}</th><th className="py-3 px-4">Selisih Pn - Pn</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Total Tanaman</td><td className="py-3.5 px-4">{angka(target)} Batang</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{angka(hidup + mati)} Batang</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Total Petak Ukur (PU)</td><td className="py-3.5 px-4">{angka(totalPu)} PU</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{angka(totalPu)} PU</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Tanaman Hidup</td><td className="py-3.5 px-4">{angka(target)} Batang</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{angka(hidup)} Batang</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Tanaman Mati</td><td className="py-3.5 px-4">-</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{angka(mati)} Batang</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Persentase Hidup</td><td className="py-3.5 px-4">100,00%</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{persenHidup}%</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
            <tr><td className="py-3.5 px-4 font-bold text-slate-800">Dokumentasi</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4 text-slate-400">-</td><td className="py-3.5 px-4">{angka(foto)} Foto</td><td className="py-3.5 px-4 text-slate-400">-</td></tr>
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2 items-center text-[10px] text-slate-500 font-medium">
        <HiOutlineInformationCircle className="w-4 h-4 shrink-0" /> Penilaian kriteria berdasarkan capaian terhadap target (P0) dan perubahan dari periode sebelumnya.
      </div>
    </div>

    <SharedDokumentasi dokumentasi={data?.dokumentasiProgram || data?.dokumentasiList} />
  </div>
  );
};

export default ContentMonitoringBerjalan;