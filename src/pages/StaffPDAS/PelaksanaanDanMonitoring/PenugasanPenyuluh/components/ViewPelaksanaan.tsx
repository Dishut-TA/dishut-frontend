import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  HiOutlineMapPin, HiOutlineCalendar, HiOutlineCheckCircle, HiCheckCircle, 
  HiOutlineXMark, HiOutlineEye, HiOutlineInformationCircle, 
  HiOutlinePhoto, HiOutlineDocumentText, HiOutlineUser, HiOutlineUsers, 
  HiOutlineBriefcase, HiCheck, HiOutlineArrowLeft, HiOutlinePrinter
} from 'react-icons/hi2';
import { MOCK_TANAMAN } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ViewProps {
  status: string;
  activeId: string;
  data?: any;
}

export default function ViewPelaksanaan({ status, activeId, data }: ViewProps) {
  const navigate = useNavigate();
  const [selectedPU, setSelectedPU] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/api/penugasan/${activeId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Penugasan berhasil disetujui dan diselesaikan');
      navigate('/admin/staff/monitoring/monitoring-program', {
        state: { statusFilter: 'Siap Monitoring' }
      });
    } catch (error) {
      console.error('Error approving penugasan:', error);
      toast.error('Gagal menyetujui penugasan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOG UNTUK DEBUGGING
  console.log("=== DEBUG VIEW PELAKSANAAN ===");
  console.log("Status dari Prop:", status);
  console.log("Data dari Prop:", data);
  console.log("===============================");

  const getStatusInfo = () => {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('berjalan')) {
      return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'Berjalan', desc: 'Pelaksanaan sedang berlangsung' };
    }
    if (s.includes('selesai')) {
      return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'Selesai', desc: 'Pelaksanaan telah selesai diverifikasi' };
    }
    if (s.includes('menunggu verifikasi')) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'Menunggu Verifikasi', desc: 'Menunggu Pemeriksaan Tim Evaluasi' };
    }
    
    // Tampilkan raw status jika tidak ada yang cocok, bukan fallback ke Menunggu Verifikasi
    return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', text: status || 'Unknown', desc: 'Status tidak diketahui' };
  };

  const statusInfo = getStatusInfo();
  
  const targetKegiatan = data?.detail?.total_seeds_collected || data?.detail?.jumlah_bibit || 500;
  const rawJumlahPu = data?.detail?.analysis_result_zone?.jumlah_pu || data?.detail?.analysisResultZone?.jumlah_pu || 10;
  // Batasi jumlah PU agar tidak membuat browser crash (maksimal 50 untuk render Leaflet yang aman)
  const jumlahPu = Math.min(Math.max(Number(rawJumlahPu) || 10, 1), 50);
  
  const luasHa = data?.detail?.analysis_result_zone?.luas_ha || data?.detail?.analysisResultZone?.luas_ha || data?.detail?.target_luas_lahan || 10;
  
  const sourceType = data?.source_type || '';
  const sourceCode = sourceType.includes('DonationProgram') ? 'DNS' : sourceType.includes('ProgramApbd') ? 'APBD' : 'CSR';
  const tahunProgram = data?.detail?.start_date ? new Date(data.detail.start_date).getFullYear() : data?.detail?.tanggal_mulai ? new Date(data.detail.tanggal_mulai).getFullYear() : new Date().getFullYear();
  const formattedId = `P-${sourceCode}-${tahunProgram}-${activeId.toString().padStart(3, '0')}`;
  
  const kthName = data?.detail?.kth?.name || data?.detail?.kth?.nama || 'KTH Tidak Ditemukan';
  const penyuluhName = data?.penyuluh || 'Penyuluh Tidak Ditemukan';
  const programName = data?.program || 'Rehabilitasi Lahan';
  const lokasi = data?.lokasi || 'Lokasi Tidak Ditemukan';
  const startDate = data?.detail?.start_date || data?.detail?.tanggal_mulai || '18 Juni 2026';
  const endDate = data?.detail?.end_date || data?.detail?.tanggal_selesai || '03 Juli 2026';

  // Gunakan useMemo agar tidak membuat ulang array (dan koordinat Math.random baru) di setiap re-render, yang bisa memicu Leaflet re-render berlebihan (crash)
  const puList = useMemo(() => {
    return Array.from({ length: jumlahPu }).map((_, idx) => {
      const no = idx + 1;
      const kode = `PU-${no.toString().padStart(2, '0')}`;
      const target = Math.floor(targetKegiatan / jumlahPu) + (no === 1 ? targetKegiatan % jumlahPu : 0);
      const realisasi = target; 
      const selisih = realisasi - target;
      return {
        no,
        kode,
        luas: (luasHa / jumlahPu).toFixed(2),
        target,
        realisasi,
        selisih: selisih === 0 ? '0' : selisih > 0 ? `+${selisih}` : `${selisih}`,
        status: 'Sesuai',
        lat: -7.033 + (Math.random() * 0.01 - 0.005),
        lng: 107.522 + (Math.random() * 0.01 - 0.005)
      };
    });
  }, [jumlahPu, targetKegiatan, luasHa]);
  
  const selectedPUData = puList.find(p => p.kode === selectedPU);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Detail Hasil Pelaksanaan (PO)</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
              {statusInfo.text}
            </span>
          </div>
          <p className="text-sm text-gray-500">Berikut adalah data realisasi pelaksanaan penanaman yang dilaporkan oleh penyuluh.</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0 w-full md:w-48">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status Saat Ini</p>
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-xl font-bold uppercase ${statusInfo.color}`}>{statusInfo.text}</h2>
            {status === 'Berjalan' && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>}
            {status !== 'Berjalan' && <span className={`w-2.5 h-2.5 rounded-full ${status === 'Selesai' ? 'bg-emerald-500' : 'bg-yellow-400'}`}></span>}
          </div>
          <p className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.desc}</p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 w-full">
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineDocumentText className="w-4 h-4"/> <span className="text-xs font-bold">ID Program</span></div><p className="text-sm font-semibold text-gray-900">{formattedId}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineBriefcase className="w-4 h-4"/> <span className="text-xs font-bold">Program</span></div><p className="text-sm font-semibold text-gray-900">{programName}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineUsers className="w-4 h-4"/> <span className="text-xs font-bold">KTH</span></div><p className="text-sm font-semibold text-gray-900">{kthName}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineUser className="w-4 h-4"/> <span className="text-xs font-bold">Penyuluh</span></div><p className="text-sm font-semibold text-gray-900">{penyuluhName}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineMapPin className="w-4 h-4"/> <span className="text-xs font-bold">Lokasi</span></div><p className="text-sm font-semibold text-gray-900">{lokasi}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineCalendar className="w-4 h-4"/> <span className="text-xs font-bold">Periode Penanaman</span></div><p className="text-sm font-semibold text-gray-900">{startDate} - {endDate}</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineCheckCircle className="w-4 h-4"/> <span className="text-xs font-bold">Target PO</span></div><p className="text-sm font-semibold text-gray-900">{targetKegiatan} tanaman</p></div>
          <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineInformationCircle className="w-4 h-4"/> <span className="text-xs font-bold">Total PU</span></div><p className="text-sm font-semibold text-gray-900">{jumlahPu} PU</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-base font-bold text-gray-900">Ringkasan Progres Pelaksanaan PO</h3></div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="border border-emerald-100 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1"><HiOutlineCheckCircle className="w-3.5 h-3.5"/> Target</p><p className="text-2xl font-bold text-emerald-600 my-1">{targetKegiatan}</p></div>
              <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Realisasi</p><p className="text-2xl font-bold text-blue-600 my-1">{targetKegiatan}</p></div>
              <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Selisih</p><p className="text-2xl font-bold text-gray-800 my-1">0</p></div>
              <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Capaian</p><p className="text-2xl font-bold text-emerald-600 my-1 border-b-4 border-emerald-500 inline-block">100%</p></div>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-6">
              <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlineCheckCircle className="w-3 h-3 text-emerald-500"/> Selesai</p><p className="text-sm font-bold text-gray-900">{jumlahPu} / {jumlahPu}</p><p className="text-[9px] text-gray-400">PU</p></div>
              <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 mb-1">Belum Selesai</p><p className="text-sm font-bold text-gray-900">0 / {jumlahPu}</p><p className="text-[9px] text-gray-400">PU</p></div>
              <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlinePhoto className="w-3 h-3"/> Foto</p><p className="text-sm font-bold text-gray-900">{targetKegiatan} / {targetKegiatan}</p></div>
              <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlineMapPin className="w-3 h-3"/> Koordinat</p><p className="text-sm font-bold text-gray-900">{targetKegiatan} / {targetKegiatan}</p></div>
              <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 mb-1">Dokumentasi</p><p className="text-sm font-bold text-gray-900">8 / 8</p></div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs"><HiCheckCircle className="w-4 h-4"/> Kelengkapan Data</div>
                <span className="text-xs font-bold text-emerald-700">100%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Peta Sebaran PU</h3>
            <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div> Sesuai</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div> Perlu Perhatian</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Belum Sesuai</span>
            </div>
          </div>
          <div className="p-4 flex-1 relative">
            <div className="w-full h-full min-h-[300px] rounded-lg border border-gray-200 relative overflow-hidden z-0">
              <MapContainer center={[-7.033, 107.522]} zoom={12} style={{ height: '100%', width: '100%', minHeight: '300px' }} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {puList.map(pu => (
                  <Marker key={pu.kode} position={[pu.lat, pu.lng]}>
                    <Popup>
                      <b>{pu.kode}</b><br/>Target: {pu.target}<br/>Realisasi: {pu.realisasi}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${selectedPU ? 'xl:grid-cols-12' : 'xl:grid-cols-1'} gap-6 items-start transition-all duration-300`}>
        <div className={`${selectedPU ? 'xl:col-span-7' : 'w-full'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="text-base font-bold text-gray-900">Daftar PU & Rekap Realisasi</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="text-[11px] text-gray-900 font-bold border-b border-gray-100 bg-white">
                  <tr>
                    <th className="px-4 py-3 text-center">No.</th>
                    <th className="px-4 py-3">Kode PU</th>
                    <th className="px-4 py-3 text-center">Luas (Ha)</th>
                    <th className="px-4 py-3 text-center">Target</th>
                    <th className="px-4 py-3 text-center">Realisasi</th>
                    <th className="px-4 py-3 text-center">Selisih</th>
                    <th className="px-4 py-3 text-center">Status PU</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {puList.map((row) => (
                    <tr key={row.no} onClick={() => setSelectedPU(row.kode)} className={`transition-colors cursor-pointer ${selectedPU === row.kode ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-4 text-center text-xs">{row.no}</td>
                      <td className="px-4 py-4 font-semibold text-gray-900 text-xs">{row.kode}</td>
                      <td className="px-4 py-4 text-center font-medium text-xs">{row.luas}</td>
                      <td className="px-4 py-4 text-center text-xs">{row.target}</td>
                      <td className="px-4 py-4 text-center text-xs">{row.realisasi}</td>
                      <td className={`px-4 py-4 text-center font-bold text-xs ${row.selisih.toString().includes('+') ? 'text-emerald-600' : row.selisih.toString().includes('-') ? 'text-red-600' : 'text-gray-600'}`}>{row.selisih}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.status === 'Sesuai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedPU(row.kode); }} 
                          className="p-1.5 text-gray-400 hover:text-emerald-600 bg-white border border-gray-200 rounded hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
                        >
                          <HiOutlineEye className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedPU && (
          <div className="xl:col-span-5 relative">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full max-h-200">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3"><h3 className="text-base font-bold text-gray-900">Detail {selectedPU}</h3><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Sesuai</span></div>
                <button onClick={() => setSelectedPU(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer"><HiOutlineXMark className="w-5 h-5"/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Luas (Ha)</p><p className="text-lg font-bold text-gray-900 mt-1">{selectedPUData?.luas || 0}</p></div>
                  <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Target</p><p className="text-lg font-bold text-gray-900 mt-1">{selectedPUData?.target || 0}</p></div>
                  <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Realisasi</p><p className="text-lg font-bold text-gray-900 mt-1">{selectedPUData?.realisasi || 0}</p></div>
                  <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Selisih</p><p className={`text-lg font-bold mt-1 ${selectedPUData?.selisih?.toString().includes('-') ? 'text-red-600' : 'text-emerald-600'}`}>{selectedPUData?.selisih || 0}</p></div>
                </div>
                <div className="flex border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
                  <button className="px-4 py-2 text-xs font-bold border-b-2 transition-colors border-emerald-600 text-emerald-700">Data Tanaman ({selectedPUData?.realisasi || 0})</button>
                  <button className="px-4 py-2 text-xs font-bold border-b-2 transition-colors border-transparent text-gray-500">Dokumentasi</button>
                  <button className="px-4 py-2 text-xs font-bold border-b-2 transition-colors border-transparent text-gray-500">Informasi PU</button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><h4 className="text-sm font-bold text-gray-900">Data Tanaman</h4></div>
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-white text-[10px] text-gray-500 font-bold border-b border-gray-100">
                        <tr><th className="p-3 text-center w-8">No.</th><th className="p-3">Jenis Tanaman</th><th className="p-3 text-center">Tinggi</th><th className="p-3 text-center">Kondisi</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_TANAMAN.map(tanaman => (
                          <tr key={tanaman.no} className="hover:bg-gray-50">
                            <td className="p-3 text-center">{tanaman.no}</td>
                            <td className="p-3 font-medium text-gray-900">{tanaman.jenis}</td>
                            <td className="p-3 text-center">{tanaman.tinggi} cm</td>
                            <td className="p-3 text-center"><span className="font-bold text-emerald-600 text-[10px]">{tanaman.kondisi}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {status === 'Selesai' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Pelaksanaan Penanaman Selesai</h3>
            <p className="text-sm text-gray-500">Data pelaksanaan penanaman telah diverifikasi dan disetujui.</p>
          </div>
          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#008A4B] text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <HiOutlinePrinter className="w-4 h-4 stroke-2" /> Cetak Rekap
            </button>
          </div>
        </div>
      )}

      {status === 'Menunggu Verifikasi' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Hasil Pemeriksaan Staff PDAS</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
            <div className="md:col-span-3 space-y-4">
              <label className="block text-xs font-bold text-gray-900 mb-2">Status Pemeriksaan <span className="text-red-500">*</span></label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="radio" name="status_periksa" className="w-5 h-5 accent-emerald-600 cursor-pointer" defaultChecked />
                <div><p className="text-sm font-bold text-gray-900">Sesuai / Dapat Disetujui</p><p className="text-xs text-gray-500">Realisasi sesuai target dan data lengkap.</p></div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group mt-4">
                <input type="radio" name="status_periksa" className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                <div><p className="text-sm font-bold text-gray-900">Perlu Perbaikan</p><p className="text-xs text-gray-500">Masih terdapat kekurangan data.</p></div>
              </label>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-900 mb-2">Catatan Pemeriksaan</label>
              <textarea rows={4} placeholder="Tulis catatan..." className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 resize-none text-gray-700"></textarea>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-900 mb-3">Checklist Verifikasi</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><HiCheck className="w-3 h-3 text-white stroke-3"/></div><span className="text-[11px] font-bold text-gray-700">Seluruh PU terbentuk</span></div>
                <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><HiCheck className="w-3 h-3 text-white stroke-3"/></div><span className="text-[11px] font-bold text-gray-700">Realisasi tanaman sesuai</span></div>
              </div>
            </div>
            <div className="md:col-span-3 h-full">
              <div className="h-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-gray-500 mb-2">Data siap disetujui sebagai</p>
                <h3 className="text-xl font-bold text-emerald-700 mb-4">P0 SELESAI</h3>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-emerald-100 shadow-sm"><HiCheck className="w-6 h-6 text-emerald-300 stroke-3" /></div>
              </div>
            </div>
          </div>
          <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-4">
            <button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#1F7A4D] hover:bg-emerald-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <HiCheck className="w-4 h-4 stroke-3"/> {isSubmitting ? 'Memproses...' : 'Setujui & Selesaikan PO'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}