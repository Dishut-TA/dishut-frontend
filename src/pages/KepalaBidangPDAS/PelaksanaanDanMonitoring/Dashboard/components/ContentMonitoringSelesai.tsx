import React from 'react';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineCamera, HiArrowRight, HiArrowTrendingUp } from 'react-icons/hi2';
import { PiPlant, PiTree } from 'react-icons/pi';
import SharedDokumentasi from './SharedDokumentasi';

const ContentMonitoringSelesai: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h3 className="text-sm font-bold text-slate-900 mb-2">Ringkasan Hasil Monitoring</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Monitoring Awal</p><h4 className="text-sm font-bold text-slate-900">10 Mei 2026</h4></div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Tanggal Monitoring Akhir</p><h4 className="text-sm font-bold text-slate-900">12 Mei 2027</h4></div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
        <HiOutlineCalendar className="w-5 h-5 text-slate-400"/>
        <div><p className="text-[10px] font-semibold text-slate-500 mb-0.5">Total Durasi Monitoring</p><h4 className="text-sm font-bold text-slate-900">12 Bulan</h4></div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
         <PiPlant className="w-6 h-6 text-emerald-600 mb-3"/>
         <p className="text-[10px] font-semibold text-slate-500 mb-1">Tanaman Hidup</p>
         <h3 className="text-2xl font-bold text-slate-900 mb-2">16.820 <span className="text-[10px] font-normal text-slate-400">Batang</span></h3>
         <p className="text-[10px] font-bold text-emerald-600">94,55% dari P0</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
         <PiTree className="w-6 h-6 text-orange-500 mb-3"/>
         <p className="text-[10px] font-semibold text-slate-500 mb-1">Tanaman Mati</p>
         <h3 className="text-2xl font-bold text-slate-900 mb-2">910 <span className="text-[10px] font-normal text-slate-400">Batang</span></h3>
         <p className="text-[10px] font-bold text-red-500">5,7% dari P0</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
         <HiOutlineMapPin className="w-6 h-6 text-blue-500 mb-3"/>
         <p className="text-[10px] font-semibold text-slate-500 mb-1">Titik Geotag</p>
         <h3 className="text-2xl font-bold text-slate-900 mb-2">118 <span className="text-[10px] font-normal text-slate-400">Titik</span></h3>
         <p className="text-[10px] font-bold text-emerald-600">100% tervalidasi</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
         <HiOutlineCamera className="w-6 h-6 text-purple-500 mb-3"/>
         <p className="text-[10px] font-semibold text-slate-500 mb-1">Dokumentasi</p>
         <h3 className="text-2xl font-bold text-slate-900 mb-2">42 <span className="text-[10px] font-normal text-slate-400">Foto</span></h3>
         <p className="text-[10px] font-bold text-emerald-600">100% lengkap</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Perkembangan Persentase Hidup (P0 - P4)</h3>
        <div className="flex-1 bg-linear-to-b from-emerald-50/50 to-white border-x border-t border-slate-100 rounded-t-xl relative min-h-40">
          <div className="absolute left-2 top-0 bottom-6 flex flex-col justify-between text-[8px] font-medium text-slate-400 py-2">
            <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
          </div>
          <div className="absolute left-10 right-6 top-4 bottom-10 flex justify-between items-end h-25">
            <div className="flex flex-col items-center gap-1 w-full"><span className="text-[9px] font-bold text-slate-800 absolute top-1">93,33%</span><div className="w-2.5 h-2.5 rounded-full bg-emerald-600 z-10 border-2 border-white shadow-sm absolute top-4"></div></div>
            <div className="flex flex-col items-center gap-1 w-full"><span className="text-[9px] font-bold text-slate-800 absolute -top-1">94,20%</span><div className="w-2.5 h-2.5 rounded-full bg-emerald-600 z-10 border-2 border-white shadow-sm absolute top-0"></div></div>
            <div className="flex flex-col items-center gap-1 w-full"><span className="text-[9px] font-bold text-slate-800 absolute top-2">92,01%</span><div className="w-2.5 h-2.5 rounded-full bg-emerald-600 z-10 border-2 border-white shadow-sm absolute top-6"></div></div>
            <div className="flex flex-col items-center gap-1 w-full"><span className="text-[9px] font-bold text-slate-800 absolute top-0.5">93,37%</span><div className="w-2.5 h-2.5 rounded-full bg-emerald-600 z-10 border-2 border-white shadow-sm absolute top-3"></div></div>
            <div className="flex flex-col items-center gap-1 w-full"><span className="text-[9px] font-bold text-slate-800 absolute -top-2">94,55%</span><div className="w-2.5 h-2.5 rounded-full bg-emerald-600 z-10 border-2 border-white shadow-sm absolute -top-1"></div></div>
          </div>
          <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-emerald-500 z-0 opacity-50"></div>
          
          <div className="absolute left-10 right-6 bottom-2 flex justify-between text-center text-[9px] font-semibold text-slate-500">
            <div><p className="text-slate-800">P0</p><p className="text-[7px] font-normal">10 Mei 2026</p></div>
            <div><p className="text-slate-800">P1</p><p className="text-[7px] font-normal">12 Jun 2026</p></div>
            <div><p className="text-slate-800">P2</p><p className="text-[7px] font-normal">12 Mei 2026</p></div>
            <div><p className="text-slate-800">P3</p><p className="text-[7px] font-normal">22 Jul 2026</p></div>
            <div><p className="text-slate-800">P4</p><p className="text-[7px] font-normal">12 Mei 2027</p></div>
          </div>
        </div>
        <div className="text-center mt-3 flex items-center justify-center gap-1.5 text-[9px] font-semibold text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Persentase Hidup
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Perbandingan Awal dan Akhir</h3>
        <div className="flex items-center gap-4 mb-6 flex-1">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-medium text-slate-500 mb-2">Kondisi Awal (P0)</p>
            <h4 className="text-lg font-bold text-slate-900 mb-1">13.860 <span className="text-[9px] font-normal text-slate-500">batang</span></h4>
            <p className="text-[10px] text-slate-500 mb-3">Tanaman Hidup</p>
            <div className="flex justify-between items-end">
              <span className="text-xl font-bold text-emerald-600">93,33%</span>
              <PiPlant className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
             <HiArrowRight className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex-1 bg-white border border-emerald-200 rounded-xl p-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
             <p className="text-[10px] font-medium text-slate-500 mb-2">Kondisi Akhir (P4)</p>
             <h4 className="text-lg font-bold text-slate-900 mb-1">16.820 <span className="text-[9px] font-normal text-slate-500">batang</span></h4>
             <p className="text-[10px] text-slate-500 mb-3">Tanaman Hidup</p>
             <div className="flex justify-between items-end relative z-10">
               <span className="text-xl font-bold text-emerald-600">94,55%</span>
             </div>
             <PiPlant className="w-16 h-16 text-emerald-100 absolute -bottom-2 -right-2 opacity-60 z-0" />
          </div>
        </div>
        <div className="bg-[#f0fdf4] rounded-lg p-3.5 flex items-center gap-3">
          <HiArrowTrendingUp className="w-5 h-5 text-emerald-600 shrink-0"/>
          <div>
            <p className="text-[10px] text-slate-600 font-medium mb-0.5">Peningkatan Tanaman Hidup</p>
            <p className="text-sm font-bold text-emerald-700">+ 2.960 batang (+1,22%)</p>
          </div>
        </div>
      </div>
    </div>

    <SharedDokumentasi />
  </div>
);

export default ContentMonitoringSelesai;