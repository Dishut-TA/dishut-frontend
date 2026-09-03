import React from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineClock, HiOutlineUserPlus, HiOutlineDocumentText, HiOutlineCalendar } from 'react-icons/hi2';
import { PiPlant, PiLeaf, PiTree } from 'react-icons/pi';
import type { ProgramData } from '../types';

interface ReadOnlyViewProps {
  activeId: string;
  activeProgram: ProgramData;
  programStatus: string;
  navigate: NavigateFunction;
}

export const ReadOnlyView: React.FC<ReadOnlyViewProps> = ({
  activeId,
  activeProgram,
  programStatus,
  navigate
}) => {
  const anyProgram = activeProgram as any;

  const petakUkurs = (anyProgram?.petak_ukurs || anyProgram?.petakUkurs || []) as any[];
  const dokumentasiList = (anyProgram?.dokumentasi || []) as any[];
  const penyuluhName = anyProgram?.penyuluh?.username || anyProgram?.penyuluh?.name || anyProgram?.penyuluh?.nama || '-';

  // Ambil data program & KTH langsung dari objek penugasanable (sama seperti logika di halaman list),
  // karena formatted_data dari backend kadang belum lengkap/tertukar field-nya.
  const source = anyProgram?.penugasanable;
  const kthObj = source?.kth || anyProgram?.penyuluh?.kth;

  const namaProgram = source?.nama_program || source?.name || activeProgram.nama || '-';
  const namaKth = kthObj?.nama || kthObj?.name || '-';
  const ketuaKth = kthObj?.ketua || '-';

  let totalTanaman = 0;
  let tanamanHidup = 0;
  let tanamanMati = 0;
  let luasArea = 0;

  petakUkurs.forEach((pu: any) => {
    luasArea += Number(pu.luas || 0);
    (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => {
      totalTanaman += t.jumlah || 0;
      const kondisi = (t.kondisi_tanaman || '').toLowerCase();
      if (kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik')) {
        tanamanHidup += t.jumlah || 0;
      } else if (kondisi.includes('mati') || kondisi.includes('rusak') || kondisi.includes('sakit')) {
        tanamanMati += t.jumlah || 0;
      }
    });
  });

  const pctHidup = totalTanaman > 0 ? ((tanamanHidup / totalTanaman) * 100).toFixed(2) : null;
  const tanggalMonitoring = anyProgram?.tanggal_mulai || anyProgram?.batas_waktu || null;

  const formatTanggal = (d: string | null) => {
    if (!d) return 'Belum tersedia';
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans w-full pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold text-slate-900">Detail Hasil Monitoring {activeProgram.periode || ''}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${programStatus === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
              {programStatus}
            </span>
          </div>
          <p className="text-sm text-slate-500">Halaman ini hanya menampilkan hasil monitoring. Proses evaluasi dilakukan oleh Tim Evaluasi pada modul evaluasi.</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900">{namaProgram}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">KTH</p><p className="text-xs font-bold text-slate-900">{namaKth}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Ketua KTH</p><p className="text-xs font-bold text-slate-900">{ketuaKth}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">{activeId}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Penyuluh</p><p className="text-xs font-bold text-slate-900">{penyuluhName}</p></div>
              <div className="hidden md:block"></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Jenis Program</p><p className="text-xs font-bold text-slate-900">{anyProgram?.jenis_kegiatan || 'Belum tersedia'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Periode Monitoring</p><p className="text-xs font-bold text-slate-900">{activeProgram.periode || '-'}</p></div>
              <div className="hidden md:block"></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Lokasi</p><p className="text-xs font-bold text-slate-900 leading-snug whitespace-pre-line">{activeProgram.lokasi || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring</p><p className="text-xs font-bold text-slate-900">{formatTanggal(tanggalMonitoring)}</p></div>
              <div className="hidden md:block"></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Luas Area</p><p className="text-xs font-bold text-slate-900">{luasArea > 0 ? `${luasArea.toLocaleString('id-ID')} Ha` : 'Belum tersedia'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Sumber Dana</p><p className="text-xs font-bold text-slate-900">{activeProgram.sumber_dana || '-'}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Hasil Monitoring {activeProgram.periode || ''}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2"><PiPlant className="w-4 h-4"/></div>
                 <p className="text-[9px] text-slate-500 font-semibold leading-tight mb-1">Persentase Keberhasilan</p>
                 <h3 className="text-xl font-bold text-slate-900">{pctHidup !== null ? `${pctHidup}%` : '-'}</h3>
                 {pctHidup !== null && (
                   <span className={`text-[9px] px-2 py-0.5 rounded font-bold mt-1.5 ${Number(pctHidup) >= 75 ? 'text-emerald-700 bg-emerald-100' : Number(pctHidup) >= 50 ? 'text-orange-700 bg-orange-100' : 'text-red-700 bg-red-100'}`}>
                     {Number(pctHidup) >= 75 ? 'Baik' : Number(pctHidup) >= 50 ? 'Cukup' : 'Perlu Perhatian'}
                   </span>
                 )}
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-2"><PiLeaf className="w-4 h-4"/></div>
                 <p className="text-[9px] text-slate-500 font-semibold leading-tight mb-1">Jumlah Tanaman Hidup</p>
                 <h3 className="text-xl font-bold text-slate-900">{tanamanHidup.toLocaleString('id-ID')}</h3>
                 <p className="text-[9px] text-slate-400 mt-0.5">Batang</p>
              </div>
              <div className="border border-orange-100 bg-orange-50/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                 <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2"><PiTree className="w-4 h-4"/></div>
                 <p className="text-[9px] text-slate-500 font-semibold leading-tight mb-1">Jumlah Tanaman Mati</p>
                 <h3 className="text-xl font-bold text-slate-900">{tanamanMati.toLocaleString('id-ID')}</h3>
                 <p className="text-[9px] text-slate-400 mt-0.5">Batang</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-2"><HiOutlineMapPin className="w-4 h-4"/></div>
                 <p className="text-[9px] text-slate-500 font-semibold leading-tight mb-1">Jumlah Titik Petak Ukur</p>
                 <h3 className="text-xl font-bold text-slate-900">{petakUkurs.length}</h3>
                 <p className="text-[9px] text-slate-400 mt-0.5">PU</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mb-2"><HiOutlineDocumentText className="w-4 h-4"/></div>
                 <p className="text-[9px] text-slate-500 font-semibold leading-tight mb-1">Dokumentasi</p>
                 <h3 className="text-xl font-bold text-slate-900">{dokumentasiList.length}</h3>
                 <p className="text-[9px] text-slate-400 mt-0.5">Foto</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Data Hasil Monitoring {activeProgram.periode || ''}</h3>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[10px] text-slate-500 font-bold border-b border-slate-200">
                  <tr><th className="py-3 px-4">Indikator</th><th className="py-3 px-4">Jumlah</th><th className="py-3 px-4">Persentase</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="py-3.5 px-4 text-slate-800">Total Tanaman Tercatat</td><td className="py-3.5 px-4">{totalTanaman.toLocaleString('id-ID')} Batang</td><td className="py-3.5 px-4">100%</td></tr>
                  <tr><td className="py-3.5 px-4 text-slate-800">Tanaman Hidup</td><td className="py-3.5 px-4">{tanamanHidup.toLocaleString('id-ID')} Batang</td><td className="py-3.5 px-4">{pctHidup !== null ? `${pctHidup}%` : '-'}</td></tr>
                  <tr><td className="py-3.5 px-4 text-slate-800">Tanaman Mati</td><td className="py-3.5 px-4">{tanamanMati.toLocaleString('id-ID')} Batang</td><td className="py-3.5 px-4">{totalTanaman > 0 ? `${((tanamanMati / totalTanaman) * 100).toFixed(2)}%` : '-'}</td></tr>
                  <tr><td className="py-3.5 px-4 text-slate-800">Dokumentasi</td><td className="py-3.5 px-4">{dokumentasiList.length} Foto</td><td className="py-3.5 px-4">-</td></tr>
                </tbody>
              </table>
              <p className="text-[10px] text-slate-400 px-4 py-3">Perbandingan terhadap data baseline (P0) belum tersedia karena sistem belum mencatat riwayat per periode.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-sm font-bold text-slate-900 mb-4">Dokumentasi Foto</h3>
             {dokumentasiList.length > 0 ? (
               <>
                 <div className="grid grid-cols-4 gap-2 mb-3">
                   {dokumentasiList.slice(0, 8).map((doc: any, i: number) => (
                     <div key={doc.id || i} className="bg-slate-200 rounded-lg h-16 bg-cover bg-center border border-slate-200" style={{ backgroundImage: doc.file_path ? `url(${doc.file_path})` : undefined }}></div>
                   ))}
                 </div>
                 <p className="text-[11px] text-slate-500">{dokumentasiList.length} foto dokumentasi tersimpan untuk program ini.</p>
               </>
             ) : (
               <p className="text-[11px] text-slate-400">Belum ada dokumentasi foto yang diunggah untuk program ini.</p>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-bold text-slate-900 mb-3">Catatan Penyuluh</h3>
               <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                 Belum tersedia. Sistem saat ini belum menyediakan fitur catatan naratif dari penyuluh pada tahap monitoring.
               </p>
               <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                 <HiOutlineDocumentText className="w-6 h-6 text-slate-300 shrink-0" />
                 <div className="flex-1">
                   <p className="text-[11px] font-bold text-slate-400 leading-tight mb-0.5">Laporan PDF belum tersedia</p>
                 </div>
               </div>
             </div>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Monitoring</h3>
               <table className="w-full text-left text-[11px]">
                 <thead className="bg-[#F8FAFC] text-slate-500 font-bold border-b border-slate-200">
                   <tr><th className="py-2.5 px-3">Periode</th><th className="py-2.5 px-3">Tanggal Monitoring</th><th className="py-2.5 px-3">Penyuluh</th><th className="py-2.5 px-3">Persentase</th><th className="py-2.5 px-3">Status</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                   <tr><td className="py-3 px-3 font-bold text-slate-900">{activeProgram.periode || '-'}</td><td className="py-3 px-3 font-bold text-slate-900">{formatTanggal(tanggalMonitoring)}</td><td className="py-3 px-3 font-bold text-slate-900">{penyuluhName}</td><td className="py-3 px-3 font-bold text-slate-900">{pctHidup !== null ? `${pctHidup}%` : '-'}</td><td className="py-3 px-3"><span className="text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 font-bold text-[9px] whitespace-nowrap">{programStatus}</span></td></tr>
                 </tbody>
               </table>
               <p className="text-[10px] text-slate-400 mt-3">Riwayat periode sebelumnya belum tersedia karena sistem belum mencatat histori monitoring per periode.</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-500 mb-5 text-left border-b border-slate-100 pb-3 w-full">Status Program</h3>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 mb-4 ${programStatus === 'Selesai' ? 'bg-emerald-50' : 'bg-orange-50'}`}>
               <HiOutlineClock className={`w-8 h-8 ${programStatus === 'Selesai' ? 'text-emerald-500' : 'text-orange-500'}`} />
            </div>
            <h2 className={`text-xl font-bold mb-3 leading-none ${programStatus === 'Selesai' ? 'text-emerald-600' : 'text-orange-600'}`}>{programStatus}</h2>
            <p className="text-[11px] text-slate-500 leading-relaxed px-2">
              {programStatus === 'Selesai'
                ? 'Hasil monitoring telah dievaluasi dan program dinyatakan selesai untuk periode ini.'
                : 'Hasil monitoring telah dikirim dan sedang menunggu proses evaluasi oleh Tim Evaluasi.'}
            </p>
          </div>

          <div className="bg-[#F0F6FF] rounded-xl shadow-sm border border-[#BFDBFE] p-5">
             <div className="flex items-start gap-3">
               <HiOutlineUserPlus className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <div>
                 <h3 className="text-sm font-bold text-blue-900 mb-1.5">Informasi Lanjutan</h3>
                 <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                   Tindak lanjut program akan ditentukan pada modul evaluasi oleh Staff PDAS Tim Evaluasi.
                 </p>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Ringkasan Status</h3>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4"/> Periode</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{activeProgram.periode || '-'}</span></div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineUserPlus className="w-4 h-4"/> KTH</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{namaKth}</span></div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineUserPlus className="w-4 h-4"/> Ketua KTH</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{ketuaKth}</span></div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineUserPlus className="w-4 h-4"/> Penyuluh</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{penyuluhName}</span></div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4"/> Lokasi</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{activeProgram.lokasi || '-'}</span></div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start"><span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4"/> Luas Area</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{luasArea > 0 ? `${luasArea.toLocaleString('id-ID')} Ha` : 'Belum tersedia'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Timeline Program</h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="flex gap-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${programStatus === 'Selesai' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                  {programStatus === 'Selesai'
                    ? <HiOutlineArrowLeft className="w-4 h-4 text-white rotate-180 stroke-2" />
                    : <HiOutlineClock className="w-4 h-4 text-white stroke-2" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-[11px] font-bold text-slate-900">{activeProgram.periode || '-'} - Monitoring</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${programStatus === 'Selesai' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-orange-700 bg-orange-50 border-orange-200'}`}>{programStatus}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{formatTanggal(tanggalMonitoring)}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pl-10">Riwayat timeline periode lain (sebelum/sesudah {activeProgram.periode || 'periode ini'}) belum tersedia karena sistem belum mencatat histori per periode secara lengkap.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};