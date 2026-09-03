import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineBookOpen,
  HiChevronRight,
  HiCheck,
  HiOutlinePlayCircle,
  HiOutlineMap,
  HiPlus,
  HiMinus,
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlinePencil,
  HiOutlineArrowPath,
  HiCheckCircle,
  HiChevronDown
} from 'react-icons/hi2';

// ==========================================
// 1. DATA TYPES 
// ==========================================
export interface PenugasanDataType {
  id: string;
  status: string;
  idPenugasan: string;
  idProgram: string;
  sumberLokasi: string;
  periode: string;
  program: string;
  kth: string;
  rencanaKegiatan: string;
  jenisTanaman: string;
  lokasi: string;
  targetBibit: string;
  totalPu: number;
  targetPerPu: string;
  penyuluh: string;
  luasArea: string;
  estimasiPerPu: string;
}

const Step1DetailPenugasan = ({ penugasanData, onNext, navigate }: { penugasanData: PenugasanDataType, onNext: () => void, navigate: any }) => (
  <div className="flex flex-col gap-6 w-full mx-auto pb-24 bg-[#f8faf9] min-h-screen font-sans">
    {/* Header & Breadcrumb */}
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Penugasan Pelaksanaan</h1>
      <p className="text-sm text-gray-500">Periksa informasi penugasan dan hasil validasi lokasi sebelum memulai pelaksanaan kegiatan.</p>
    </div>

    {/* Top Banner */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
      <div>
        <p className="text-xs text-gray-500 mb-2">Status Penugasan</p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-md text-xs font-bold">
          <HiOutlineCheckCircle className="w-4 h-4" /> {penugasanData.status}
        </span>
      </div>
      <div className="pt-4 md:pt-0 md:pl-6">
        <p className="text-xs text-gray-500 mb-1">ID Penugasan</p>
        <p className="text-base font-bold text-gray-900">{penugasanData.idPenugasan}</p>
      </div>
      <div className="pt-4 md:pt-0 md:pl-6">
        <p className="text-xs text-gray-500 mb-1">ID Program</p>
        <p className="text-sm font-bold text-gray-900">{penugasanData.idProgram}</p>
      </div>
      <div className="pt-4 md:pt-0 md:pl-6">
        <p className="text-xs text-gray-500 mb-2">Sumber Lokasi</p>
        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-600">{penugasanData.sumberLokasi}</span>
      </div>
      <div className="pt-4 md:pt-0 md:pl-6 col-span-2 md:col-span-1">
        <p className="text-xs text-gray-500 mb-1">Periode Pelaksanaan</p>
        <p className="text-sm font-bold text-gray-900">{penugasanData.periode}</p>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Informasi Penugasan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
            <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" /> Informasi Penugasan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
            <div><p className="text-xs text-gray-500 mb-1">Program</p><p className="text-sm font-semibold text-gray-900">{penugasanData.program}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">KTH</p><p className="text-sm font-semibold text-gray-900">{penugasanData.kth}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Rencana Kegiatan</p><p className="text-sm font-semibold text-gray-900">{penugasanData.rencanaKegiatan}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Lokasi Penugasan</p><p className="text-sm font-semibold text-gray-900 whitespace-pre-line leading-relaxed">{penugasanData.lokasi}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Target Bibit</p><p className="text-sm font-semibold text-gray-900">{penugasanData.targetBibit}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Total PU</p><p className="text-sm font-semibold text-gray-900">{penugasanData.totalPu} PU</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Penyuluh</p><p className="text-sm font-semibold text-gray-900">{penugasanData.penyuluh}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Luas Area</p><p className="text-sm font-semibold text-gray-900">{penugasanData.luasArea}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Estimasi per PU</p><p className="text-sm font-semibold text-gray-900">{penugasanData.estimasiPerPu}</p></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-6">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" /> Ringkasan Target
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500 flex items-center gap-2"><HiOutlineDocumentText className="w-4 h-4"/> Total PU</span>
              <span className="text-sm font-bold text-gray-900">{penugasanData.totalPu}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500 flex items-center gap-2"><span className="text-lg leading-none shrink-0">🌱</span> Target Bibit</span>
              <span className="text-sm font-bold text-gray-900">{penugasanData.targetBibit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4"/> Deadline</span>
              <span className="text-sm font-bold text-gray-900">03 Jul 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 px-6 z-40">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
        <button onClick={() => {
          // Call API to update status to 'Berjalan'
          const token = localStorage.getItem('token');
          const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
          fetch(`${API_URL}/penugasan/${penugasanData.id}/mulai`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(() => onNext());
        }} className="w-full px-8 py-2.5 bg-[#168a53] text-white text-sm font-bold rounded-full hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          <HiOutlinePlayCircle className="w-5 h-5" /> Mulai Pelaksanaan
        </button>
      </div>
    </div>
  </div>
);

// ==========================================
// 3. KOMPONEN: LANGKAH 2 (Poligon PU)
// ==========================================
const Step2PoligonPU = ({ penugasanData, onNext, onPrev }: { penugasanData: PenugasanDataType, onNext: () => void, onPrev: () => void, navigate: any }) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [puList, setPuList] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPU = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${API_URL}/penugasan/${penugasanData.id}/petak-ukur`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        const data = json.data || [];
        
        // Merge fetched data with placeholders
        const updatedList = Array.from({ length: penugasanData.totalPu }, (_, i) => {
          if (data[i]) {
            return { id: i + 1, status: data[i].status, luas: `${data[i].luas} ha` };
          }
          return {
            id: i + 1,
            status: isDrawingMode && i === data.length ? 'Sedang Dibuat' : 'Belum Dibuat',
            luas: isDrawingMode && i === data.length ? '0.18 ha' : '-',
          };
        });
        setPuList(updatedList);
      } catch (e) { console.error(e); }
    };
    fetchPU();
  }, [penugasanData.id, isDrawingMode]);

  const handleSavePU = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const createdPuCount = puList.filter(p => p.status === 'Selesai').length;
      await fetch(`${API_URL}/petak-ukur`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          penugasan_id: penugasanData.id,
          nama: `PU ${createdPuCount + 1}`,
          luas: 0.18,
          polygon_data: [
            {"lat": -7.214, "lng": 107.850},
            {"lat": -7.215, "lng": 107.850}
          ]
        })
      });
      setIsDrawingMode(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto pb-24 bg-[#f8faf9] min-h-screen font-sans">
      
      {/* HEADER & STEPPER */}
      <div className="bg-white border-b border-gray-200 rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 shrink-0">
              <HiOutlineMap className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-900">Pembentukan Area Penanaman (PU)</h1>
             <p className="text-xs text-gray-500 mt-1">Bagi lokasi kegiatan menjadi beberapa Petak Ukur (PU) sesuai jumlah yang telah ditentukan.</p>
           </div>
        </div>

        {/* Stepper Status */}
        <div className="flex flex-nowrap items-center justify-between gap-4 overflow-x-auto pb-2">
          {/* Step 1 */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#168a53] text-white flex items-center justify-center font-bold shadow-sm">
              <HiCheck className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Informasi Penugasan</p>
              <p className="text-xs font-semibold text-emerald-600">Selesai</p>
            </div>
          </div>
          <HiChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
          
          {/* Step 2 (Active) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#168a53] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-emerald-50">2</div>
            <div>
              <p className="text-sm font-bold text-gray-900">Pembentukan Poligon PU</p>
              <p className="text-xs font-semibold text-emerald-600">Sedang dikerjakan</p>
            </div>
          </div>
          <HiChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
          
          {/* Step 3 */}
          <div className="flex items-center gap-3 shrink-0 opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">3</div>
            <div>
              <p className="text-sm font-bold text-gray-600">Input Tanaman per PU</p>
              <p className="text-xs text-gray-400">Belum dimulai</p>
            </div>
          </div>
          <HiChevronRight className="w-5 h-5 text-gray-300 shrink-0 opacity-50" />
          
          {/* Step 4 */}
          <div className="flex items-center gap-3 shrink-0 opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">4</div>
            <div>
              <p className="text-sm font-bold text-gray-600">Review & Kirim</p>
              <p className="text-xs text-gray-400">Belum dimulai</p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI (Info & Ringkasan) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Informasi Kegiatan</h3>
              <HiOutlineInformationCircle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">ID Penugasan</span><span className="col-span-2 font-semibold text-emerald-700">{penugasanData.idPenugasan}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">ID Program</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.idProgram}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Program</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.program}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Lokasi</span><span className="col-span-2 font-semibold text-gray-800 whitespace-pre-line">{penugasanData.lokasi}</span></div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100"><span className="text-gray-500">KTH</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.kth}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Jenis Kegiatan</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.rencanaKegiatan}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Jenis Tanaman</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.jenisTanaman}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Target Bibit</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.targetBibit}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Jumlah PU</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.totalPu} PU</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Target per PU</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.targetPerPu}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Periode</span><span className="col-span-2 font-semibold text-gray-800">{penugasanData.periode}<br/><span className="text-red-500 font-bold">(1 hari lagi)</span></span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Ringkasan PU</h3>
              <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2.5 text-xs font-semibold mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Total PU</span><span className="text-gray-800">12</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PU Selesai</span><span className="text-emerald-600">0</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PU Dalam Proses</span><span className="text-orange-500">{isDrawingMode ? '1' : '0'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PU Belum Dibuat</span><span className="text-blue-600">{isDrawingMode ? '11' : '12'}</span></div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
               <div className="flex justify-between"><span className="text-gray-500">Luas Total (Target)</span><span className="font-bold text-gray-900">2,40 ha</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Luas Terpetakan</span><span className="font-bold text-emerald-600">{isDrawingMode ? '0,18 ha' : '0 ha'}</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Persentase</span><span className="font-bold text-emerald-600">{isDrawingMode ? '8%' : '0%'}</span></div>
               <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full transition-all" style={{width: isDrawingMode ? '8%' : '0%'}}></div>
               </div>
            </div>
          </div>
        </div>

        {/* KOLOM TENGAH (PETA) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-gray-900 text-sm">Peta Lokasi Kegiatan</h3>
               <HiOutlineMap className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Map Area Mockup */}
            <div className="h-112.5 relative bg-gray-800 w-full">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Map View" className="w-full h-full object-cover opacity-80" />
              
              {/* Map Controls */}
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <div className="bg-white rounded-md shadow-lg flex flex-col overflow-hidden text-gray-700">
                  <button className="p-2 border-b border-gray-100 hover:bg-gray-50 font-bold"><HiPlus className="w-4 h-4"/></button>
                  <button className="p-2 hover:bg-gray-50 font-bold"><HiMinus className="w-4 h-4"/></button>
                </div>
                <button className="bg-white p-2.5 rounded-md shadow-lg hover:bg-gray-50 text-gray-700"><HiOutlineMapPin className="w-4 h-4"/></button>
                <button className="bg-white p-2.5 rounded-md shadow-lg hover:bg-gray-50 text-gray-700"><HiOutlineBookOpen className="w-4 h-4"/></button>
              </div>

              {/* Dynamic Map Content */}
              {!isDrawingMode ? (
                // State: Belum ada poligon
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm text-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                      <HiOutlineMap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Belum ada PU dibuat</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Silakan buat PU pertama dengan menggambar poligon pada peta.</p>
                    <p className="text-[10px] text-gray-400">Setelah disimpan, Anda dapat membuat PU berikutnya.</p>
                  </div>
                  <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow font-bold text-xs text-gray-700 flex items-center gap-2 hover:bg-gray-50">
                    <HiOutlineArrowPath className="w-4 h-4"/> Reset Peta
                  </button>
                </div>
              ) : (
                // State: Sedang Menggambar (Drawing Mode)
                <div className="absolute inset-0">
                  {/* Mockup SVG Polygon */}
                  <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <polygon points="40,30 70,40 60,70 30,60" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
                     {/* Vertices */}
                     <circle cx="40" cy="30" r="1.5" fill="white" stroke="#10b981" strokeWidth="0.5" />
                     <circle cx="70" cy="40" r="1.5" fill="white" stroke="#10b981" strokeWidth="0.5" />
                     <circle cx="60" cy="70" r="1.5" fill="white" stroke="#10b981" strokeWidth="0.5" />
                     <circle cx="30" cy="60" r="1.5" fill="white" stroke="#10b981" strokeWidth="0.5" />
                  </svg>
                  
                  {/* Tooltip Active */}
                  <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur text-white px-4 py-3 rounded-lg flex items-center gap-3 z-20 shadow-lg border border-gray-700">
                     <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                     <div className="text-xs">
                       <p className="font-bold mb-0.5">Klik titik berikutnya</p>
                       <p className="text-gray-300">untuk melanjutkan poligon</p>
                     </div>
                  </div>

                  {/* Center Info */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                     <div className="bg-gray-900/80 backdrop-blur text-white px-4 py-2 rounded-lg text-center shadow-lg border border-gray-700">
                       <p className="font-bold text-sm">PU 1</p>
                       <p className="text-[10px] text-orange-400 font-bold mb-1">Sedang dibuat</p>
                       <p className="text-[10px] text-gray-300">Perkiraan luas: 0,18 ha</p>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 z-20 flex gap-3">
                     <button onClick={() => setIsDrawingMode(false)} className="bg-white px-4 py-2 rounded-lg shadow font-bold text-xs text-gray-700 hover:bg-gray-50 border border-gray-200">
                       Batalkan PU
                     </button>
                     <button onClick={handleSavePU} disabled={isSaving} className="bg-[#168a53] text-white px-4 py-2 rounded-lg shadow font-bold text-xs hover:bg-emerald-700 disabled:opacity-50">
                       {isSaving ? 'Menyimpan...' : 'Simpan PU'}
                     </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Panduan Gambar */}
            <div className="p-5 bg-white border-t border-gray-100">
              <h4 className="font-bold text-gray-800 text-xs mb-4">Cara Menggambar Poligon</h4>
              <div className="grid grid-cols-5 gap-3 text-center">
                 <div className="flex flex-col items-center">
                   <div className="w-full h-12 bg-gray-100 rounded mb-2 border border-emerald-500 overflow-hidden relative">
                      <div className="absolute inset-0 bg-green-900/20"></div>
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full border border-emerald-500 -translate-x-1/2 -translate-y-1/2"></div>
                   </div>
                   <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold text-emerald-600 mr-1">1</span> Klik pada peta untuk menambahkan titik awal</p>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-full h-12 bg-gray-100 rounded mb-2 border border-gray-200 overflow-hidden relative">
                      <div className="absolute inset-0 bg-green-900/20"></div>
                      <svg className="absolute inset-0 w-full h-full"><line x1="20%" y1="50%" x2="80%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="2,2"/></svg>
                      <div className="absolute top-1/2 left-[20%] w-2 h-2 bg-white rounded-full border border-emerald-500 -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 left-[80%] w-2 h-2 bg-white rounded-full border border-emerald-500 -translate-x-1/2 -translate-y-1/2"></div>
                   </div>
                   <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold text-emerald-600 mr-1">2</span> Klik titik berikutnya untuk membentuk sisi poligon</p>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-full h-12 bg-gray-100 rounded mb-2 border border-gray-200 overflow-hidden relative">
                     <div className="absolute inset-0 bg-green-900/20"></div>
                      <svg className="absolute inset-0 w-full h-full"><path d="M 20 24 L 60 24 L 40 40" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2"/></svg>
                   </div>
                   <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold text-emerald-600 mr-1">3</span> Minimal 3 titik untuk membentuk poligon</p>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-full h-12 bg-gray-100 rounded mb-2 border border-gray-200 overflow-hidden relative">
                     <div className="absolute inset-0 bg-green-900/20"></div>
                      <svg className="absolute inset-0 w-full h-full"><path d="M 20 24 L 60 24 L 40 40 Z" fill="rgba(16,185,129,0.3)" stroke="white" strokeWidth="1" strokeDasharray="2,2"/></svg>
                   </div>
                   <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold text-emerald-600 mr-1">4</span> Klik titik awal untuk menutup poligon</p>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-full h-12 bg-gray-100 rounded mb-2 border border-gray-200 overflow-hidden relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-green-900/20"></div>
                     <svg className="absolute inset-0 w-full h-full"><path d="M 20 24 L 60 24 L 40 40 Z" fill="rgba(16,185,129,0.5)" stroke="white" strokeWidth="1" /></svg>
                     <HiCheckCircle className="w-5 h-5 text-white absolute bottom-1 right-1 drop-shadow" />
                   </div>
                   <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold text-emerald-600 mr-1">5</span> Simpan PU yang telah dibuat</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (Daftar PU) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Tombol Tambah PU - memicu mode gambar */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDrawingMode(true)}
              className="flex-1 bg-white border border-emerald-500 text-emerald-600 font-bold text-sm py-2.5 rounded-lg hover:bg-emerald-50 flex items-center justify-center gap-2"
            >
              <HiPlus className="w-4 h-4"/> Tambah PU
            </button>
            <button className="bg-white border border-gray-200 text-gray-500 px-3 rounded-lg hover:bg-gray-50">
              <HiChevronDown className="w-4 h-4"/>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-130">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">Daftar PU ({penugasanData.totalPu})</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {puList.map((pu) => (
                <div key={pu.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <HiOutlineEllipsisVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                    <span className="font-bold text-xs text-gray-700 w-8">PU {pu.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pu.status === 'Sedang Dibuat' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                      {pu.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-700 w-12 text-right">{pu.luas}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {pu.status === 'Sedang Dibuat' && <HiOutlinePencil className="w-3.5 h-3.5 text-gray-400 hover:text-emerald-600 cursor-pointer" />}
                       <HiOutlineEllipsisVertical className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100">
               <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                 <HiOutlineCalendar className="w-4 h-4" /> Lihat Ringkasan Semua PU
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 px-6 z-40">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-black">
          <button 
            onClick={onPrev} 
            className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <HiOutlineArrowLeft className="w-4 h-4" strokeWidth={2} /> Kembali
          </button>
          
            <button className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 flex items-center justify-center gap-2">
              <HiOutlineDocumentText className="w-4 h-4" /> Simpan & Keluar
            </button>
            <button 
              onClick={onNext}
              className={`w-full px-8 py-2.5 text-white text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${isDrawingMode ? 'bg-[#168a53] hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Lanjutkan ke Input Tanaman <HiChevronRight className="w-4 h-4" />
            </button>
        </div>
        {!isDrawingMode && (
           <p className="text-center text-[10px] text-red-500 font-medium mt-2 md:absolute md:right-6 md:bottom-2">
             Selesaikan minimal 1 PU untuk melanjutkan
           </p>
        )}
      </div>
    </div>
  );
};

const MulaiKegiatan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<PenugasanDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${API_URL}/penugasan/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        const p = json.data;
        const detail = p.penugasanable || {};
        
        let programName = '-';
        let location = '-';
        let kth = '-';
        let targetBibit = '0';
        let totalPu = 1;
        let luasArea = '-';

        if (p.penugasanable_type === 'App\\Models\\DonationProgram') {
          programName = detail.name || '-';
          location = detail.location || '-';
          kth = detail.kth?.name || '-';
          targetBibit = detail.target_amount || '0';
          totalPu = detail.analysis_result_zone?.jumlah_pu || 1;
          luasArea = detail.analysis_result_zone?.luas_ha ? `${detail.analysis_result_zone.luas_ha} Ha` : '-';
        } else if (p.penugasanable_type === 'App\\Models\\ProgramApbd' || p.penugasanable_type === 'App\\Models\\ProgramCsr') {
          programName = detail.nama_program || '-';
          location = detail.lokasi || (detail.kth ? `${detail.kth.desa_kelurahan}, ${detail.kth.kabupaten_kota}` : '-');
          kth = detail.kth?.nama || '-';
          targetBibit = detail.target_bibit || detail.jumlah_bibit || '0';
          totalPu = detail.analysis_result_zone?.jumlah_pu || 1;
          luasArea = detail.target_luas_lahan ? `${detail.target_luas_lahan} Ha` : '-';
        }

        setData({
          id: String(p.id),
          status: p.status,
          idPenugasan: `TGS-${p.id}`,
          idProgram: detail.id ? `PRG-${detail.id}` : '-',
          sumberLokasi: p.penugasanable_type.includes('Apbd') ? 'APBD' : (p.penugasanable_type.includes('Csr') ? 'CSR' : 'Donasi'),
          periode: `${p.tanggal_mulai ? new Date(p.tanggal_mulai).toLocaleDateString('id-ID') : '-'} - ${p.batas_waktu ? new Date(p.batas_waktu).toLocaleDateString('id-ID') : '-'}`,
          program: programName,
          kth: kth,
          rencanaKegiatan: p.jenis_kegiatan,
          jenisTanaman: 'Campuran', // Simplification, could be mapped if needed
          lokasi: location,
          targetBibit: `${targetBibit} bibit`,
          totalPu: totalPu,
          targetPerPu: `${Math.round(parseInt(targetBibit) / totalPu)} bibit`,
          penyuluh: p.penyuluh ? (p.penyuluh.username || p.penyuluh.name) : '-',
          luasArea: luasArea,
          estimasiPerPu: `±${Math.round(parseInt(targetBibit) / totalPu)} bibit`,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen">Data Penugasan Tidak Ditemukan</div>;
  }

  return (
    <>
      {currentStep === 1 && (
        <Step1DetailPenugasan 
          penugasanData={data}
          navigate={navigate} 
          onNext={() => setCurrentStep(2)} 
        />
      )}
      
      {currentStep === 2 && (
        <Step2PoligonPU 
          penugasanData={data}
          navigate={navigate}
          onPrev={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)} 
        />
      )}

      {currentStep > 2 && (
         <div className="flex items-center justify-center min-h-screen bg-gray-50 flex-col gap-4">
            <h1 className="text-xl font-bold text-gray-500">Langkah {currentStep} (Belum Diimplementasikan)</h1>
            <button onClick={() => setCurrentStep(2)} className="px-4 py-2 bg-emerald-600 text-white rounded font-bold">Kembali ke Langkah 2</button>
         </div>
      )}
    </>
  );
};

export default MulaiKegiatan;