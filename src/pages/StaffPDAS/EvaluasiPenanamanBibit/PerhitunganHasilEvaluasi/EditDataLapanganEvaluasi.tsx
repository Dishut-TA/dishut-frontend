import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineDocumentText } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import type { PetakUkur } from './types';

const EditDataLapanganEvaluasi: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state?.dataPetakUkur as PetakUkur[];
  
  const [dataPetakUkur, setDataPetakUkur] = useState<PetakUkur[]>(stateData || []);
  const [isSaving, setIsSaving] = useState(false);

  // If no data is passed, handle gracefully
  if (!dataPetakUkur || dataPetakUkur.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-gray-500 mb-4">Tidak ada data untuk diedit.</p>
        <button onClick={() => navigate(-1)} className="text-[#185325] underline font-medium">Kembali</button>
      </div>
    );
  }

  const handleEdit = <K extends keyof PetakUkur>(index: number, field: K, value: PetakUkur[K]) => {
    const newData = [...dataPetakUkur];
    newData[index][field] = value;
    setDataPetakUkur(newData);
  };

  const handleGetLocation = (idx: number) => {
    const loadingToast = toast.loading('Sedang mencari titik koordinat...');
    setTimeout(() => {
        handleEdit(idx, 'koordinat', `-6.25, 106.86`);
        toast.success('Titik koordinat berhasil diperbarui!', { id: loadingToast });
    }, 1000);
  };



  const handleSave = () => {
      setIsSaving(true);
      const loadingToast = toast.loading('Menyimpan Data Faktual Lapangan...');
      setTimeout(() => {
          setIsSaving(false);
          toast.success('Data Faktual Lapangan berhasil disimpan!', { id: loadingToast });
          // Note: Hardcoded ID 1 for now due to mock data
          navigate('/admin/staff/evaluasi/hasil/detail/1', { 
              state: { 
                  updatedData: dataPetakUkur,
                  isDataFilled: true 
              },
              replace: true
          });
      }, 1500);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-24 animate-in fade-in duration-300 relative">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali ke Detail Perhitungan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Form Evaluasi Faktual Lapangan</h1>
            <p className="text-sm text-gray-500">Sesuaikan data realisasi lapangan (tumbuh, tinggi, kondisi lahan) dengan keadaan faktual dari hasil evaluasi terbaru.</p>
        </div>
        
        {/* Tabel 1: Data Modul Pelaksanaan & Monitoring (Read-Only) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5 text-gray-500" />
                1. Referensi: Data Modul Pelaksanaan & Monitoring
            </h3>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm mb-10">
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-[#DCECE0] text-[#3A4D3F] font-bold border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-center border-r border-gray-200">Periode & PU</th>
                        <th className="px-4 py-3 text-center">Rencana (Target Tanam)</th>
                        <th className="px-4 py-3 text-center border-x border-gray-200">Realisasi Tumbuh (Monitoring)</th>
                        <th className="px-4 py-3 text-center">Tinggi Rata-rata (Monitoring)</th>
                        <th className="px-4 py-3 text-center border-l border-gray-200">Kondisi Lahan</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {dataPetakUkur.map((item, idx) => (
                        <tr key={`mon-${idx}`} className="hover:bg-[#EBF8F1]/30 transition-colors">
                            <td className="px-4 py-3 text-center align-middle border-r border-gray-200 bg-gray-50/30">
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                    <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
                                        {item.periode}
                                    </span>
                                    <span className="text-xs text-gray-600 font-bold">{item.pu}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center bg-[#EBF8F1]/20 font-semibold text-gray-800">
                                {item.rencana} Pohon
                            </td>
                            <td className="px-4 py-3 text-center border-x border-gray-100 font-semibold text-gray-800 bg-[#EBF8F1]/20">
                                {item.monitoringTumbuh || '-'} Pohon
                            </td>
                            <td className="px-4 py-3 text-center text-gray-800 font-medium bg-[#EBF8F1]/20">
                                {item.rencanaTinggi} cm
                            </td>
                            <td className="px-4 py-3 text-center border-l border-gray-100 text-gray-700 bg-[#EBF8F1]/20">
                                {item.kondisiLahan || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Tabel 2: Form Evaluasi Faktual Lapangan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5 text-[#185325]" />
                2. Form Modul Evaluasi Lapangan (Faktual)
            </h3>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm mb-8">
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-[#DCECE0] text-[#3A4D3F] font-bold border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-center border-r border-gray-200">Periode & PU</th>
                        <th className="px-4 py-3 text-center">Tanaman Hidup (Faktual) <span className="text-red-500">*</span></th>
                        <th className="px-4 py-3 text-center border-x border-gray-200">Tinggi Rata-rata (Faktual) <span className="text-red-500">*</span></th>
                        <th className="px-4 py-3">Kondisi Lahan <span className="text-red-500">*</span></th> 
                        <th className="px-4 py-3">Titik Koordinat <span className="text-red-500">*</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {dataPetakUkur.map((item, idx) => (
                        <tr key={`eval-${idx}`} className="hover:bg-[#EBF8F1]/20 transition-colors">
                            <td className="px-4 py-3 text-center align-middle border-r border-gray-200 bg-gray-50/30">
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                    <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
                                        {item.periode}
                                    </span>
                                    <span className="text-xs text-gray-600 font-bold">{item.pu}</span>
                                </div>
                            </td>
                            
                            <td className="px-4 py-2 text-center bg-[#EBF8F1]/10">
                                <input 
                                    type="number" 
                                    value={item.tumbuh}
                                    onChange={(e) => handleEdit(idx, 'tumbuh', Number(e.target.value))}
                                    className="w-24 text-center py-2 px-3 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] focus:outline-none transition-colors"
                                    placeholder="Jml"
                                />
                            </td>
                            
                            <td className="px-4 py-2 text-center border-x border-gray-100 bg-[#EBF8F1]/10">
                                <input 
                                    type="number"
                                    step="0.1"
                                    value={item.tinggi}
                                    onChange={(e) => handleEdit(idx, 'tinggi', Number(e.target.value))}
                                    className="w-24 text-center py-2 px-3 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] focus:outline-none transition-colors"
                                    placeholder="cm"
                                />
                            </td>

                            <td className="px-4 py-2 bg-[#EBF8F1]/10">
                                <select
                                    value={item.kondisiLahan}
                                    onChange={(e) => handleEdit(idx, 'kondisiLahan', e.target.value)}
                                    className="w-48 py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] focus:outline-none transition-colors text-gray-700"
                                >
                                    <option value="Baik / Normal">Baik / Normal</option>
                                    <option value="Banyak Gulma">Banyak Gulma</option>
                                    <option value="Kering / Gersang">Kering / Gersang</option>
                                    <option value="Tergenang Air">Tergenang Air</option>
                                    <option value="Berbatu">Berbatu</option>
                                    <option value="Rawan Longsor">Rawan Longsor</option>
                                </select>
                            </td>
                            
                            <td className="px-4 py-2 bg-[#EBF8F1]/10">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text"
                                        value={item.koordinat}
                                        onChange={(e) => handleEdit(idx, 'koordinat', e.target.value)}
                                        placeholder="-6.123, 106.123"
                                        className="w-40 py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] focus:outline-none transition-colors text-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleGetLocation(idx)}
                                        className="p-2 bg-[#185325] text-white rounded-lg hover:bg-[#123d1c] transition-colors active:scale-95"
                                        title="Dapatkan Lokasi Saat Ini"
                                    >
                                        <HiOutlineMapPin className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-md flex items-center gap-2 disabled:opacity-75"
            >
                {isSaving ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                    <>
                        <HiOutlineCheckCircle className="w-5 h-5" />
                        Simpan Data Faktual
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditDataLapanganEvaluasi;
