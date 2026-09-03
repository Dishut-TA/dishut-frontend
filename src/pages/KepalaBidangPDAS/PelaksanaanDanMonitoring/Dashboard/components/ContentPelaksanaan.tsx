import React from 'react';
import { HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineCamera, HiCheckCircle, HiOutlineEye } from 'react-icons/hi2';
import { PiPlant, PiLeaf } from 'react-icons/pi';
import SharedDokumentasi from './SharedDokumentasi';

const ContentPelaksanaan: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Hasil Pelaksanaan</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <PiPlant className="w-6 h-6 text-emerald-600 mb-2"/>
          <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Target Bibit</p>
          <h3 className="text-xl font-bold text-slate-900">25.000</h3>
          <p className="text-[9px] text-slate-400">Batang</p>
        </div>
        <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <PiLeaf className="w-6 h-6 text-emerald-600 mb-2"/>
          <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Realisasi Bibit</p>
          <h3 className="text-xl font-bold text-slate-900">23.100</h3>
          <p className="text-[9px] text-slate-400">Batang</p>
        </div>
        <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex gap-1 items-center mb-2"><HiOutlineArrowLeft className="w-4 h-4 text-emerald-600 rotate-90"/><HiOutlineArrowLeft className="w-4 h-4 text-red-500 -rotate-90"/></div>
          <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Selisih</p>
          <h3 className="text-xl font-bold text-red-600">-1.900</h3>
          <p className="text-[9px] text-slate-400">Batang</p>
        </div>
        <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <HiOutlineMapPin className="w-6 h-6 text-emerald-600 mb-2"/>
          <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Total Petak Ukur (PU)</p>
          <h3 className="text-xl font-bold text-slate-900">3</h3>
          <p className="text-[9px] text-slate-400">PU</p>
        </div>
        <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <HiOutlineCamera className="w-6 h-6 text-emerald-600 mb-2"/>
          <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Dokumentasi</p>
          <h3 className="text-xl font-bold text-slate-900">36</h3>
          <p className="text-[9px] text-slate-400">Foto</p>
        </div>
      </div>

      <h4 className="text-xs font-bold text-slate-900 mb-3">Rekap berdasarkan Jenis Tanaman</h4>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr><th className="py-2.5 px-4">Jenis Tanaman</th><th className="py-2.5 px-4">Jumlah (Tanaman)</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            <tr><td className="py-2.5 px-4">Rhizophora apiculata</td><td className="py-2.5 px-4">350</td></tr>
            <tr><td className="py-2.5 px-4">Avicennia marina</td><td className="py-2.5 px-4">100</td></tr>
            <tr><td className="py-2.5 px-4">Sonneratia alba</td><td className="py-2.5 px-4">52</td></tr>
            <tr className="bg-emerald-50/50 font-bold"><td className="py-3 px-4 text-emerald-700">Total</td><td className="py-3 px-4 text-emerald-700">502</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900">Daftar PU dan Rekap Realisasi</h3>
        <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"><HiOutlineMapPin className="w-3.5 h-3.5"/> Lihat Peta PU</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs">
          <thead className="bg-[#F8FAFC] text-[10px] text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 row-span-2">No.</th>
              <th className="py-3 px-4 row-span-2 text-left">Kode PU</th>
              <th className="py-3 px-4 row-span-2">Luas (Ha)</th>
              <th className="py-3 px-4 row-span-2">Target <span className="font-normal">(tanaman)</span></th>
              <th className="py-3 px-4 row-span-2">Realisasi <span className="font-normal">(tanaman)</span></th>
              <th className="py-3 px-4 row-span-2">Selisih</th>
              <th className="py-2 px-4 border-b border-slate-200 col-span-5 text-center" colSpan={5}>Status Kelengkapan</th>
              <th className="py-3 px-4 row-span-2">Aksi</th>
            </tr>
            <tr>
              <th className="py-2 px-2 text-[9px]">Poligon</th>
              <th className="py-2 px-2 text-[9px]">Tanaman</th>
              <th className="py-2 px-2 text-[9px]">Foto</th>
              <th className="py-2 px-2 text-[9px]">Koordinat</th>
              <th className="py-2 px-2 text-[9px]">Dokumentasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {[1,2,3,4,5].map((no) => (
              <tr key={no} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{no}</td>
                <td className="py-3 px-4 font-bold text-slate-800 text-left">PU-0{no}</td>
                <td className="py-3 px-4">0,5{no}</td>
                <td className="py-3 px-4">50</td>
                <td className="py-3 px-4">{no === 3 ? '52' : '50'}</td>
                <td className={`py-3 px-4 font-bold ${no === 3 ? 'text-emerald-600' : 'text-slate-600'}`}>{no === 3 ? '+2' : '0'}</td>
                {[1,2,3,4,5].map(i => <td key={i} className="py-3 px-2"><HiCheckCircle className="w-4 h-4 text-emerald-500 mx-auto"/></td>)}
                <td className="py-3 px-4"><button className="p-1.5 border border-slate-200 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer mx-auto block"><HiOutlineEye className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-center border-t border-slate-100">
         <div className="flex items-center gap-1">
           <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400">&lt;</button>
           <button className="w-7 h-7 flex items-center justify-center rounded bg-emerald-600 text-white font-bold text-xs">1</button>
           <button className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-slate-600">2</button>
           <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400">&gt;</button>
         </div>
      </div>
    </div>

    <SharedDokumentasi />
  </div>
);

export default ContentPelaksanaan;