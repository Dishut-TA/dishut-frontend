import React, { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlineMapPin, HiOutlineCamera, HiOutlineArrowLeft, HiOutlinePaperAirplane, HiOutlineInformationCircle } from 'react-icons/hi2';
import { PiPlant, PiTree, PiLeaf } from 'react-icons/pi';
import type { ProgramData, ViewMode } from '../types';
import PetaPetakUkur from '@/components/maps/PetaPetakUkur';

interface RekapViewProps {
  activeId: string;
  activeProgram: ProgramData;
  isTindakLanjut: boolean;
  setViewMode: (mode: ViewMode) => void;
  setSelectedPuId: (id: any) => void;
  navigate: NavigateFunction;
}

export const RekapView: React.FC<RekapViewProps> = ({
  activeId,
  activeProgram,
  isTindakLanjut,
  setViewMode,
  setSelectedPuId,
  navigate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const petakUkurs = (activeProgram?.petak_ukurs || activeProgram?.petakUkurs || []) as any[];
  
  // const isAllComplete = petakUkurs.every((pu: any) => {
  //   let puTotal = 0;
  //   let puBelum = 0;
  //   (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => {
  //     puTotal += t.jumlah || 0;
  //     const kondisi = t.kondisi_tanaman?.toLowerCase() || '';
  //     if (!kondisi.includes('hidup') && !kondisi.includes('sehat') && !kondisi.includes('baik') && !kondisi.includes('mati') && !kondisi.includes('rusak') && !kondisi.includes('sakit')) {
  //       puBelum += t.jumlah || 0;
  //     }
  //   });
  //   return puBelum === 0 && puTotal > 0;
  // });

  // Hitung total keseluruhan
  let totalTanaman = 0;
  let tanamanHidup = 0;
  let tanamanMati = 0;
  let belumMonitoring = 0;

  // Untuk Tindak Lanjut: hitung titik perlu disulam dari hasil evaluasi PU
  // (total_bibit_ditanam - eval_bibit_tumbuh = yang mati/perlu disulam)
  let totalPerlDisulam = 0;   // titik mati berdasarkan evaluasi
  let totalSudahDisulam = 0;  // akan diisi dari data penyulaman tindak lanjut
  let totalBibitSulam = 0;    // sama dengan totalPerlDisulam (kebutuhan bibit)

  petakUkurs.forEach((pu: any) => {
    if (isTindakLanjut) {
      // Pada Tindak Lanjut, semua data tanaman yang dikirimkan backend 
      // adalah bibit yang perlu disulam. Kita tidak perlu filter "mati" lagi.
      const dataTL = pu.dataTanamans || pu.data_tanamans || [];

      dataTL.forEach((t: any) => {
        const kondisi = (t.kondisi_tanaman || '').toLowerCase();

        totalPerlDisulam += 1; // atau t.jumlah jika menghitung pohon
        totalBibitSulam += Number(t.penyulaman_jumlah) || t.jumlah || 1;
        if (kondisi.includes('sudah disulam') || t.status_penyulaman === 'Sudah Disulam') {
          totalSudahDisulam += 1;
        }
      });
    } else {
      (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => {
        totalTanaman += t.jumlah || 0;
        const kondisi = t.kondisi_tanaman?.toLowerCase() || '';
        if (kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik')) {
          tanamanHidup += t.jumlah || 0;
        } else if (kondisi.includes('mati') || kondisi.includes('rusak') || kondisi.includes('sakit')) {
          tanamanMati += t.jumlah || 0;
        } else {
          belumMonitoring += t.jumlah || 0;
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
          Review & Kirim Hasil {isTindakLanjut ? `Penyulaman` : `Monitoring`}
        </h1>
        <p className="text-sm text-slate-500">
          Berikut adalah hasil {isTindakLanjut ? 'tindak lanjut penyulaman' : `monitoring ${activeProgram.periode}`} yang telah Anda input, dikelompokkan per Petak Ukur (PU) sebelum dikirim.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">ID Program</p>
            <p className="text-sm font-bold text-slate-900">{activeId}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">Nama Program</p>
            <p className="text-sm font-bold text-slate-900">{activeProgram.nama || activeProgram.nama_program || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">Sumber Dana</p>
            <p className="text-sm font-bold text-slate-900">{activeProgram.sumber_dana || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">Periode Monitoring</p>
            <p className="text-sm font-bold text-slate-900">{isTindakLanjut ? `Tindak Lanjut ${activeProgram.periode}` : `${activeProgram.periode}`}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">Lokasi</p>
            <p className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">{activeProgram.lokasi || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1">Ketua KTH</p>
            <p className="text-sm font-bold text-slate-900">{activeProgram.kth || '-'}</p>
          </div>
          <div className="col-span-2 md:col-span-3">
            <p className="text-[10px] text-slate-500 font-medium mb-1">Tanggal Monitoring</p>
            <p className="text-sm font-bold text-slate-900">27 Mei 2026</p>
          </div>
        </div>
        <div className="w-full md:w-[320px] h-32 rounded-lg overflow-hidden border border-slate-200 shrink-0">
          <PetaPetakUkur
            petakUkurs={(activeProgram as any)?.petak_ukurs || (activeProgram as any)?.petakUkurs}
            emptyMessage="Batas petak ukur belum digambar."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-[#0F172A] mb-4">Ringkasan {isTindakLanjut ? `Penyulaman ${activeProgram.periode}` : `Monitoring ${activeProgram.periode}`} (Per PU)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-2 md:mb-0"><HiOutlineMapPin className="w-5 h-5" /></div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Total PU</p>
              <h3 className="text-xl font-bold text-slate-900">{petakUkurs.length}</h3>
            </div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-2 md:mb-0">
              <PiPlant className="w-5 h-5" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Total Titik Perlu Disulam' : 'Total Tanaman'}</p>
              <h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? totalPerlDisulam : totalTanaman}</h3>
            </div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-2 md:mb-0">
              <PiTree className="w-5 h-5" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}</p>
              <h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? totalSudahDisulam : tanamanHidup}</h3>
            </div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mb-2 md:mb-0">
              <PiLeaf className="w-5 h-5" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Belum Disulam' : 'Mati'}</p>
              <h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? Math.max(totalPerlDisulam - totalSudahDisulam, 0) : tanamanMati}</h3>
            </div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-2 md:mb-0">
              <PiPlant className="w-5 h-5" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Total Bibit Sulam' : 'Perlu Perawatan / Belum Monitoring'}</p>
              <h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? totalBibitSulam : belumMonitoring}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Rekap {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} per PU</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-center text-xs">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4 text-left">PU</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Titik Perlu Disulam' : 'Jumlah Tanaman'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Belum Disulam' : 'Mati'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Bibit Sulam' : 'Perlu Perawatan'}</th>
                {!isTindakLanjut && <th className="py-3 px-4">Foto</th>}
                <th className="py-3 px-4">Status Kelengkapan</th>
                <th className="py-3 px-4">Update Terakhir</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {petakUkurs.map((pu: any, idx: number) => {
                let puTotal = 0;
                let puHidup = 0;
                let puMati = 0;
                let puBelum = 0;

                // Untuk Tindak Lanjut: hitung dari data evaluasi petak ukur
                let puPerlDisulam = 0;
                let puSudahDisulam = 0;
                let puBibitSulam = 0;

                if (isTindakLanjut) {
                  // Sama seperti perhitungan total: semua titik di sini adalah yang perlu disulam
                  (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => {
                    const kondisi = (t.kondisi_tanaman || '').toLowerCase();

                    puPerlDisulam += 1;
                    puBibitSulam += Number(t.penyulaman_jumlah) || t.jumlah || 1;
                    if (kondisi.includes('sudah disulam') || t.status_penyulaman === 'Sudah Disulam') {
                      puSudahDisulam += 1;
                    }
                  });
                } else {
                  (pu.dataTanamans || pu.data_tanamans || []).forEach((t: any) => {
                    puTotal += t.jumlah || 0;
                    const kondisi = t.kondisi_tanaman?.toLowerCase() || '';
                    if (kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik')) {
                      puHidup += t.jumlah || 0;
                    } else if (kondisi.includes('mati') || kondisi.includes('rusak') || kondisi.includes('sakit')) {
                      puMati += t.jumlah || 0;
                    } else {
                      puBelum += t.jumlah || 0;
                    }
                  });
                }

                const pctHidup = puTotal > 0 ? Math.round((puHidup / puTotal) * 100) : 0;
                const pctMati = puTotal > 0 ? Math.round((puMati / puTotal) * 100) : 0;
                const pctBelum = puTotal > 0 ? Math.round((puBelum / puTotal) * 100) : 0;
                const puStatus = isTindakLanjut
                  ? (puSudahDisulam >= puPerlDisulam && puPerlDisulam > 0 ? 'Lengkap' : 'Belum Lengkap')
                  : (puBelum === 0 && puTotal > 0 ? 'Lengkap' : 'Belum Lengkap');

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-left font-bold text-slate-700">{pu.nama || `PU-${idx + 1}`}</td>
                    <td className={`py-3 px-4 font-bold ${isTindakLanjut ? 'text-red-500' : ''}`}>{isTindakLanjut ? puPerlDisulam : puTotal}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{isTindakLanjut ? puSudahDisulam : `${puHidup} (${pctHidup}%)`}</td>
                    <td className={`py-3 px-4 font-bold ${isTindakLanjut ? 'text-orange-500' : 'text-red-500'}`}>{isTindakLanjut ? Math.max(puPerlDisulam - puSudahDisulam, 0) : `${puMati} (${pctMati}%)`}</td>
                    <td className={`py-3 px-4 font-bold ${isTindakLanjut ? 'text-blue-600' : 'text-orange-500'}`}>{isTindakLanjut ? `${puBibitSulam} bibit` : `${puBelum} (${pctBelum}%)`}</td>
                    {!isTindakLanjut && <td className="py-3 px-4 text-slate-600 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> -</td>}
                    <td className="py-3 px-4">
                      <span className={`${puStatus === 'Lengkap' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'} border px-2.5 py-1 rounded-full font-bold text-[10px]`}>{puStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">-</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedPuId(pu.id || idx);
                          setViewMode('table');
                        }}
                        className="px-4 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded-full font-bold hover:bg-emerald-50 transition-colors text-xs cursor-pointer"
                      >
                        Tambah Data
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50/50 font-bold border-t-2 border-slate-200">
                <td className="py-4 px-4 text-left text-blue-700">Total</td>
                <td className={`py-4 px-4 font-bold ${isTindakLanjut ? 'text-red-500' : 'text-blue-700'}`}>{isTindakLanjut ? totalPerlDisulam : totalTanaman}</td>
                <td className="py-4 px-4 text-emerald-600">{isTindakLanjut ? totalSudahDisulam : `${tanamanHidup} (${totalTanaman > 0 ? Math.round((tanamanHidup / totalTanaman) * 100) : 0}%)`}</td>
                <td className={`py-4 px-4 font-bold ${isTindakLanjut ? 'text-orange-500' : 'text-red-500'}`}>{isTindakLanjut ? Math.max(totalPerlDisulam - totalSudahDisulam, 0) : `${tanamanMati} (${totalTanaman > 0 ? Math.round((tanamanMati / totalTanaman) * 100) : 0}%)`}</td>
                <td className={`py-4 px-4 font-bold ${isTindakLanjut ? 'text-blue-600' : 'text-orange-500'}`}>{isTindakLanjut ? `${totalBibitSulam} bibit` : `${belumMonitoring} (${totalTanaman > 0 ? Math.round((belumMonitoring / totalTanaman) * 100) : 0}%)`}</td>
                {!isTindakLanjut && <td className="py-4 px-4 text-blue-700 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> -</td>}
                <td className="py-4 px-4 text-slate-400">-</td>
                <td className="py-4 px-4 text-slate-400">-</td>
                <td className="py-4 px-4 text-slate-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-4 rounded-lg flex items-center gap-3 text-sm text-emerald-800 font-medium mb-8">
        <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        Klik "Tambah Data" pada baris PU yang ingin Anda lengkapi untuk membuka halaman {isTindakLanjut ? 'input hasil penyulaman' : 'Input Hasil Monitoring'}.
      </div>

      <div className="flex justify-between items-center z-40">
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer hover:bg-slate-50">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        {(activeProgram as any)?.status !== 'Monitoring Selesai' && (activeProgram as any)?.status !== 'Dihentikan' && (
          <button
            disabled={isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const token = localStorage.getItem('token');
                const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
                await axios.post(`${API_URL}/penugasan/${activeId}/${isTindakLanjut ? 'submit-tindak-lanjut' : 'submit-monitoring'}`, {}, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                toast.success(`Hasil ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'} berhasil dikirim!`);
                navigate('/admin/penyuluh/monitoring-lanjutan');
              } catch (err) {
                console.error(err);
                toast.error('Gagal mengirim hasil monitoring.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            className={`px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors ${!isSubmitting ? 'bg-[#008A4B] text-white hover:bg-emerald-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45" /> {isSubmitting ? 'Mengirim...' : `Kirim Hasil ${isTindakLanjut ? `Penyulaman ${activeProgram.periode}` : `Monitoring ${activeProgram.periode}`}`}
          </button>
        )}
        {(activeProgram as any)?.status === 'Monitoring Selesai' && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm font-bold text-emerald-700">
            <HiOutlineInformationCircle className="w-4 h-4" /> Monitoring Selesai
          </div>
        )}
        {(activeProgram as any)?.status === 'Dihentikan' && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 rounded-full text-sm font-bold text-red-700">
            <HiOutlineInformationCircle className="w-4 h-4" /> Program Dihentikan
          </div>
        )}
      </div>
    </div>
  );
};