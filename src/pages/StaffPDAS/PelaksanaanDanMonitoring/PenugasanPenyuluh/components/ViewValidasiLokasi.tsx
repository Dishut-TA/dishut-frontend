import { useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineCalendar, HiCheckCircle,
  HiOutlineUser, HiOutlineMap, HiOutlineCamera, HiOutlineShieldCheck, HiCheck,
  HiOutlinePencil, HiOutlineArrowDownTray
} from 'react-icons/hi2';
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

interface Props {
  status: string;
  activeId: string;
  data?: any;
}

export default function ViewValidasiLokasi({ status, activeId, data }: Props) {
  const navigate = useNavigate();

  const detail = data?.detail || {};
  const tanggalPenugasan = data?.tanggalPenugasan || '-';
  const penyuluhName = data?.penyuluh || '-';
  const lokasi = data?.lokasi || detail?.desa || '-';
  const wilayah = data?.wilayah || detail?.kabupaten || '-';
  const luasUsulan = detail?.luas_ha || 0;

  // Asumsi koordinat jika tersedia di tabel AnalysisResultZone
  const lat = detail?.latitude || -7.033;
  const lng = detail?.longitude || 107.522;
  const position: [number, number] = [lat, lng];

  const fieldValidation = detail?.field_validations?.[0] || null;

  // Resolve storage URL dari backend
  const STORAGE_URL = (import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api').replace('/api', '/storage');
  const resolveUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STORAGE_URL}/${url}`;
  };

  // Foto validasi lapangan dari field_validations
  const fotoValidasi = fieldValidation?.foto_lokasi_url ? [resolveUrl(fieldValidation.foto_lokasi_url)] : [];

  return (
    <div className="max-w-300 mx-auto space-y-6 animate-in fade-in duration-300">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Hasil Validasi Lokasi</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
              {status === 'Selesai' ? 'Valid' : 'Diproses'}
            </span>
          </div>
          <p className="text-sm text-gray-500">Berikut hasil validasi lokasi usulan rehabilitasi yang telah diverifikasi di lapangan.</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-6">Informasi Penugasan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">ID Referensi</span><span className="font-semibold text-gray-900 flex-1">{activeId || 'LOC-2026-0012'}</span></div>
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Lokasi Usulan</span><span className="font-semibold text-gray-900 flex-1">Blok {detail?.desa || 'Cibodas'}</span></div>
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Sumber Lokasi</span><span className="font-semibold text-gray-900 flex-1">Analisis CPI</span></div>
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Kabupaten/Kota</span><span className="font-semibold text-gray-900 flex-1">{wilayah}</span></div>
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Desa / Kecamatan</span><span className="font-semibold text-gray-900 flex-1">{lokasi}</span></div>
            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Luas Usulan</span><span className="font-semibold text-gray-900 flex-1">{luasUsulan} Ha</span></div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Penyuluh Ditugaskan</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineUser className="w-4 h-4 text-emerald-600" /> {penyuluhName}</span></div>
            <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Tanggal Penugasan</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4 text-emerald-600" /> {tanggalPenugasan !== '-' ? new Date(tanggalPenugasan).toLocaleDateString('id-ID') : '-'}</span></div>
            <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Status Penugasan</span><span className="font-semibold text-emerald-600 flex-1 flex items-center gap-2 bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-100"><HiCheckCircle className="w-4 h-4" /> {status}</span></div>
          </div>
          <div>
            <span className="block text-gray-500 text-sm mb-2">Catatan Penugasan</span>
            <p className="text-sm font-medium text-gray-900 leading-relaxed">Lakukan verifikasi koordinat, kondisi lahan, akses jalan, dan dokumentasi lapangan.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Ringkasan Hasil Validasi</h3>
          <div className="flex gap-6 items-stretch flex-1">
            <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 flex flex-col items-center justify-center text-center w-52 shrink-0">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-emerald-600 border border-emerald-100"><HiCheckCircle className="w-7 h-7" /></div>
              <p className="text-xs font-bold text-gray-600 mb-1">Status Validasi</p>
              <h4 className="text-3xl font-bold text-emerald-600 mb-3">{fieldValidation ? 'Selesai' : 'Diproses'}</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {fieldValidation ? 'Lokasi telah dikunjungi dan disurvei oleh penyuluh.' : 'Penyuluh belum memberikan laporan hasil validasi lapangan.'}
              </p>
            </div>
            <div className="flex-1 space-y-4 text-sm justify-center flex flex-col">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4 text-gray-400" /> Kesesuaian Lokasi</span><span className="font-bold text-emerald-600">{fieldValidation ? 'Sesuai' : 'Belum Ada'}</span></div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineMap className="w-4 h-4 text-gray-400" /> Kondisi Lahan</span><span className="font-bold text-emerald-600">{fieldValidation?.kondisi_lahan || 'Belum Ada'}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-gray-400" /> Status Verifikasi Kabid</span><span className="font-bold text-emerald-600">{fieldValidation?.status_verifikasi || 'Belum'}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Koordinat Lokasi Terverifikasi</h3>
          <div className="flex gap-6 items-center flex-1">
            <div className="w-2/3 h-full rounded-xl overflow-hidden relative border border-gray-200 min-h-50 z-0">
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', minHeight: '200px' }} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    Lokasi Validasi<br />{lokasi}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="w-1/3 flex flex-col gap-4 text-sm">
              <div><p className="text-gray-500 mb-1">Lintang</p><p className="font-bold text-gray-900">{lat.toFixed(6)}°</p></div>
              <div><p className="text-gray-500 mb-1">Bujur</p><p className="font-bold text-gray-900">{lng.toFixed(6)}°</p></div>
              <div><p className="text-gray-500 mb-1">Akurasi</p><p className="font-bold text-gray-900">± 5 m</p></div>
              <button className="mt-2 py-2 px-3 border border-emerald-600 text-emerald-700 font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer"><HiOutlineMap className="w-4 h-4" /> Buka Eksternal</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-6">Dokumentasi Lapangan</h3>
          {fotoValidasi.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {fotoValidasi.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={url!} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="aspect-square rounded-lg border border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-center p-2">
                <HiOutlineCamera className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-[10px] text-gray-400">{fotoValidasi.length} foto</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <HiOutlineCamera className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-400">Belum ada dokumentasi lapangan</p>
              <p className="text-xs text-gray-400 mt-1">Penyuluh belum mengunggah foto validasi lokasi</p>
            </div>
          )}
        </div>


      </div>

      {status === 'Selesai' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-6">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Catatan Hasil Validasi</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium max-w-3xl">
              Lokasi berada di kawasan prioritas rehabilitasi. Lahan berupa lahan kritis dengan tutupan semak dan ilalang.<br />
              Tidak terdapat konflik pemanfaatan lahan. Akses menuju lokasi dapat dilalui kendaraan roda dua.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 w-full md:w-auto">
          </div>
        </div>
      )}
    </div>
  );
}