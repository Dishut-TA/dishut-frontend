import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePrinter, HiOutlineMapPin, HiOutlineCalendar } from 'react-icons/hi2';
import ContentPelaksanaan from './components/ContentPelaksanaan';
import ContentValidasiLokasi from './components/ContentValidasiLokasi';
import ContentMonitoringBerjalan from './components/ContentMonitoringBerjalan';
import ContentMonitoringSelesai from './components/ContentMonitoringSelesai';

type TabType = 'Validasi Lokasi' | 'Pelaksanaan' | 'Monitoring P1' | 'Monitoring P2' | 'Monitoring P3' | 'Monitoring P4';

export default function DetailProgramKabid() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKategori = location.state?.kategori || 'Pelaksanaan';
  const initialPeriode = location.state?.periode || 'P2';
  const defaultTab: TabType = initialKategori === 'Pelaksanaan' ? 'Pelaksanaan' : (initialPeriode === 'Validasi' ? 'Validasi Lokasi' : `Monitoring ${initialPeriode}` as TabType);
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const getStatus = () => {
    if (activeTab === 'Pelaksanaan' || activeTab === 'Monitoring P4') return 'Selesai';
    if (activeTab.includes('Monitoring')) return 'Berjalan';
    return 'Selesai';
  };
  const status = getStatus();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 w-full pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Detail Program Rehabilitasi</h1>
          <span className={`px-3 py-1 text-xs font-bold rounded-md border ${status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {status}
          </span>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-5">Informasi Utama Program</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4">
            <div><p className="text-[10px] font-semibold text-slate-500 mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">PRG-2024-015</p></div>
            <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Sumber Program</p><p className="text-xs font-bold text-slate-900">APBD / CSR / Donasi</p></div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Kategori</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${activeTab === 'Pelaksanaan' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                {activeTab.includes('Monitoring') ? 'Monitoring' : activeTab}
              </span>
            </div>
            <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Jenis Rehabilitasi</p><p className="text-xs font-bold text-slate-900">Rehabilitasi Hutan dan Lahan</p></div>
            <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Periode</p><p className="text-xs font-bold text-slate-900">{activeTab.includes('P') ? activeTab.split(' ')[1] : '-'}</p></div>
            
            <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900">Rehabilitasi DAS Cimanuk Hulu</p></div>
            <div className="col-span-1"><p className="text-[10px] font-semibold text-slate-500 mb-1">Sumber Lokasi</p><p className="text-xs font-bold text-slate-900">Analisis CPI / Proposal CSR</p></div>
            <div className="col-span-3"><p className="text-[10px] font-semibold text-slate-500 mb-1">Jenis Bibit</p><p className="text-xs font-bold text-slate-900 leading-snug">Rhizophora apiculata, Avicennia marina, Sonneratia alba</p></div>
          </div>
          <div className="col-span-1 border-l border-slate-100 pl-6 flex flex-col justify-start">
             <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Status</p><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>{status}</span></div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Lokasi</p><p className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><HiOutlineMapPin className="w-4 h-4 text-emerald-600"/> Kec. Cikajang, Kab. Garut, Jawa Barat</p></div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 mb-1">Progress</p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">{activeTab === 'Pelaksanaan' || activeTab === 'Monitoring P4' ? '100%' : '33%'}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: activeTab === 'Pelaksanaan' || activeTab === 'Monitoring P4' ? '100%' : '33%' }}></div></div>
            </div>
          </div>
          <div><p className="text-[10px] font-semibold text-slate-500 mb-1">Terakhir Diperbarui</p><p className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4 text-slate-400"/> 22 Mei 2026, 14:30 WIB</p></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Detail Informasi Kegiatan</h3>
        <div className="flex justify-between items-center border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {(['Validasi Lokasi', 'Pelaksanaan', 'Monitoring P1', 'Monitoring P2', 'Monitoring P3', 'Monitoring P4'] as TabType[]).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05)]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm mb-2 shrink-0 cursor-pointer">
            <HiOutlinePrinter className="w-4 h-4" /> Cetak Ringkasan
          </button>
        </div>
      </div>

      {activeTab === 'Pelaksanaan' && <ContentPelaksanaan />}
      {activeTab === 'Validasi Lokasi' && <ContentValidasiLokasi />}
      {activeTab.includes('Monitoring') && activeTab !== 'Monitoring P4' && <ContentMonitoringBerjalan periode={activeTab.split(' ')[1]} />}
      {activeTab === 'Monitoring P4' && <ContentMonitoringSelesai />}

    </div>
  );
}