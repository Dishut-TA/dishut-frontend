import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineBars3BottomLeft,
  HiOutlineCalendar,
  HiOutlineInformationCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBookOpen,
  HiOutlineArrowPath,
  HiOutlinePlus,
  HiXMark,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

// 1. DATA & KONFIGURASI STATIS
const INFO_DATA = [
  { id: 1, icon: HiOutlineDocumentText, label: 'ID Program', value: 'PRG-2026-011' },
  { id: 2, icon: HiOutlineBars3BottomLeft, label: 'Sumber Lokasi', value: 'Dari Analisis CPI', isBadge: true, badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 3, icon: HiOutlineMapPin, label: 'Lokasi Penugasan', value: 'Desa Mandalakasih, Kec. Pameungpeuk, Kab. Garut' },
  { id: 4, icon: HiOutlineCalendar, label: 'Batas Waktu Validasi', value: '18 Juni 2026' },
  { id: 5, icon: HiOutlineUser, label: 'Penyuluh', value: 'Imas Rohmayati, S.P., M.P.' },
  { id: 6, icon: HiOutlineInformationCircle, label: 'Status Saat Ini', value: 'Perlu Validasi', isBadge: true, badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
];

const PANDUAN_LIST = [
  'Pastikan lokasi sesuai dengan penugasan.',
  'Isi koordinat dan kondisi lapangan.',
  'Unggah dokumentasi pendukung.',
  'Simpan hasil sebelum dikirim.'
];

const HISTORY_LIST = [
  { title: 'Penugasan diterima', time: '12 Juni 2026 14:30 WIB' },
  { title: 'Data lokasi ditinjau', time: '13 Juni 2026 09:10 WIB' }
];

// 2. MICRO COMPONENTS (Atoms & Molecules)
const PageHeader = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-1">Lakukanasdasdasd Validasi Lokasi</h1>
    <p className="text-sm text-gray-500">Lengkapi hasil validasi lokasi berdasarkan penugasan yang diberikan.</p>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, isBadge, badgeClass }: any) => (
  <div className="flex items-center gap-3">
    <Icon className="w-5 h-5 text-gray-400 shrink-0" />
    <div className="flex-1 flex items-center justify-between">
      <span className="text-sm text-gray-600 w-1/3">{label}</span>
      {isBadge ? (
        <div className="w-2/3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-md border ${badgeClass}`}>{value}</span>
        </div>
      ) : (
        <input type="text" readOnly value={value} className="w-2/3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none" />
      )}
    </div>
  </div>
);

const RadioStatus = ({ label, value, current, onChange }: any) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative flex items-center justify-center w-5 h-5">
      <input type="radio" name="statusValidasi" value={value} checked={current === value} onChange={onChange} className="peer opacity-0 absolute w-full h-full cursor-pointer" />
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-emerald-600"></div>
      <div className="absolute w-2.5 h-2.5 bg-emerald-600 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// 3. SIDEBAR COMPONENTS (Organisms)
const SidebarKanan = () => (
  <div className="lg:col-span-1 space-y-6">
    {/* Ringkasan Status */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
        <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-emerald-600" />
        <h2>Ringkasan Status</h2>
      </div>
      <div className="relative pl-3">
        <div className="absolute left-4.25 top-2 bottom-6 w-0.5 bg-gray-200"></div>
        <div className="relative flex gap-4 mb-6">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">Penugasan Diterima</h4>
            <p className="text-xs text-gray-500 mt-0.5">12 Juni 2026 14:30 WIB</p>
          </div>
        </div>
        <div className="relative flex gap-4 mb-6">
          <div className="w-6 h-6 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shrink-0 z-10">
            <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-600">Validasi Sedang Dikerjakan</h4>
            <p className="text-xs text-gray-500 mt-0.5">Hari ini</p>
          </div>
        </div>
        <div className="relative flex gap-4">
          <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 shrink-0 z-10"></div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Menunggu Tinjauan Staff PDAS</h4>
            <p className="text-xs text-gray-400 mt-0.5">—</p>
          </div>
        </div>
      </div>
    </div>

    {/* Panduan Singkat */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-4">
        <HiOutlineBookOpen className="w-5 h-5 text-emerald-600" />
        <h2>Panduan Singkat</h2>
      </div>
      <ul className="space-y-3">
        {PANDUAN_LIST.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></div>
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Riwayat Update */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
        <HiOutlineArrowPath className="w-5 h-5 text-emerald-600" />
        <h2>Riwayat Update Terbaru</h2>
      </div>
      <div className="relative pl-2">
        <div className="absolute left-[11.5px] top-2 bottom-2 w-0.5 bg-emerald-100"></div>
        {HISTORY_LIST.map((item, idx) => (
          <div key={idx} className="relative flex gap-4 mb-5 last:mb-0">
            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-emerald-500 shrink-0 z-10 ring-4 ring-white"></div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">{item.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. MAIN COMPONENT (Pages)
const CreateValidasi: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tanggal: '',
    koordinat: '',
    kesesuaian: 'Sesuai dengan penugasan', 
    kondisiUmum: '',
    catatan: '',
    status: '' 
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleGetLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error('Browser perangkat Anda tidak mendukung fitur GPS.');
      return;
    }
    setIsGettingLocation(true);
    const loadingToast = toast.loading('Mencari titik koordinat...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setFormData(prev => ({ ...prev, koordinat: `${lat}, ${lng}` }));
        toast.success('Titik koordinat berhasil didapatkan!', { id: loadingToast });
        setIsGettingLocation(false);
      },
      () => {
        toast.error('Gagal mendapatkan lokasi.', { id: loadingToast });
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.koordinat || !formData.kondisiUmum || !formData.status || !formData.tanggal) {
      toast.error('Mohon lengkapi semua kolom yang wajib diisi (*)');
      return;
    }
    toast.success('Data validasi lapangan berhasil dikirim!');
    navigate(-1);
  };

  const removePhoto = (index: number) => setUploadedPhotos(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col w-full mx-auto pb-12 bg-[#f8faf9] min-h-screen">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* KOLOM KIRI (FORM) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Info Penugasan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
              <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" />
              <h2>Informasi Penugasan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {INFO_DATA.map(info => <InfoItem key={info.id} {...info} />)}
            </div>
          </div>

          {/* Form Interaktif */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
              <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-emerald-600" />
              <h2>Hasil Validasi Lokasi</h2>
            </div>

            <form id="validasi-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Validasi <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Koordinat Lokasi <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.koordinat} onChange={(e) => setFormData({...formData, koordinat: e.target.value})} placeholder="-7.214, 107.850" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    <button type="button" onClick={handleGetLocation} disabled={isGettingLocation} className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-emerald-500 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-50 shrink-0 disabled:opacity-50">
                      <HiOutlineMapPin className="w-4 h-4" /> Ambil
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kesesuaian Lokasi <span className="text-red-500">*</span></label>
                  <select value={formData.kesesuaian} onChange={(e) => setFormData({...formData, kesesuaian: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none bg-white">
                    <option value="Sesuai dengan penugasan">Sesuai dengan penugasan</option>
                    <option value="Sebagian sesuai">Sebagian sesuai</option>
                    <option value="Tidak sesuai">Tidak sesuai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kondisi Umum Lokasi <span className="text-red-500">*</span></label>
                  <textarea value={formData.kondisiUmum} onChange={(e) => setFormData({...formData, kondisiUmum: e.target.value})} placeholder="Deskripsikan kondisi..." className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Validasi</label>
                <textarea value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} placeholder="Tambahkan catatan pendukung..." className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Status Validasi <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <RadioStatus label="Sesuai" value="Sesuai" current={formData.status} onChange={(e: any) => setFormData({...formData, status: e.target.value})} />
                  <RadioStatus label="Tidak Sesuai" value="Tidak Sesuai" current={formData.status} onChange={(e: any) => setFormData({...formData, status: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Dokumentasi <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-4">
                  {uploadedPhotos.map((src, idx) => (
                    <div key={idx} className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={src} alt={`Upload ${idx+1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full text-white flex items-center justify-center transition-colors">
                        <HiXMark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-emerald-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-emerald-50/30">
                    <HiOutlinePlus className="w-6 h-6 text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-emerald-600">Tambah Foto</span>
                    <input type="file" className="hidden" accept="image/*" multiple />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Format: JPG, JPEG, PNG. Maks. 5MB per foto.</p>
              </div>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <SidebarKanan />
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
          ← Kembali
        </button>
        <button type="button" className="w-full sm:w-auto px-6 py-2.5 bg-white border border-emerald-500 text-emerald-600 text-sm font-bold rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5" /> Simpan Draft
        </button>
        <button type="submit" form="validasi-form" className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45 mb-1" /> Kirim Hasil Validasi
        </button>
      </div>

    </div>
  );
};

export default CreateValidasi;