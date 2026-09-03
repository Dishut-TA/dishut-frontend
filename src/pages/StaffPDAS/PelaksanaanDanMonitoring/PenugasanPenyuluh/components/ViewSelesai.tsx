import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, HiOutlineMapPin, HiOutlineCalendar, HiCheckCircle, 
  HiOutlineUser, HiOutlineMap, HiOutlineCamera, HiOutlinePencil, 
  HiOutlineShieldCheck, HiCheck, HiOutlineArrowDownTray
} from 'react-icons/hi2';

export default function ViewSelesai() {
  const navigate = useNavigate();

  return (
    <div className="max-w-350 mx-auto space-y-6 animate-in fade-in duration-300">
      <HeaderSection navigate={navigate} />
      <InformasiPenugasan />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RingkasanHasil />
        <KoordinatLokasi />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DokumentasiLapangan />
        <ChecklistValidasi />
      </div>

      <CatatanDanAksi />
    </div>
  );
}

// --- SUB COMPONENTS ---

const HeaderSection = ({ navigate }: { navigate: any }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Hasil Validasi Lokasi</h1>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Valid</span>
      </div>
      <p className="text-sm text-gray-500">Berikut hasil validasi lokasi usulan rehabilitasi yang telah diverifikasi di lapangan.</p>
    </div>
    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0">
      <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Daftar
    </button>
  </div>
);

const InformasiPenugasan = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-base font-bold text-gray-900 mb-6">Informasi Penugasan</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">ID Referensi</span><span className="font-semibold text-gray-900 flex-1">LOC-2026-0012</span></div>
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Lokasi Usulan</span><span className="font-semibold text-gray-900 flex-1">Blok Cibodas</span></div>
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Sumber Lokasi</span><span className="font-semibold text-gray-900 flex-1">Analisis CPI</span></div>
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">CDK</span><span className="font-semibold text-gray-900 flex-1">Cimanuk</span></div>
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Desa / Kecamatan</span><span className="font-semibold text-gray-900 flex-1">Desa Sukamaju / Kec. Rancabali</span></div>
        <div className="flex justify-between items-start gap-4"><span className="text-gray-500 w-32 shrink-0">Luas Usulan</span><span className="font-semibold text-gray-900 flex-1">12,5 Ha</span></div>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Penyuluh Ditugaskan</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineUser className="w-4 h-4 text-emerald-600" /> Ahmad Fauzi</span></div>
        <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Tanggal Validasi</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4 text-emerald-600" /> 15 Jun 2026</span></div>
        <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Tanggal Selesai Validasi</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4 text-emerald-600" /> 16 Jun 2026</span></div>
        <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Batas Waktu</span><span className="font-semibold text-gray-900 flex-1 flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4 text-emerald-600" /> 20 Jun 2026</span></div>
        <div className="flex justify-between items-center gap-4"><span className="text-gray-500 w-36 shrink-0">Status Penugasan</span><span className="font-semibold text-emerald-600 flex-1 flex items-center gap-2 bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-100"><HiCheckCircle className="w-4 h-4" /> Selesai Validasi</span></div>
      </div>
      <div>
        <span className="block text-gray-500 text-sm mb-2">Catatan Penugasan</span>
        <p className="text-sm font-medium text-gray-900 leading-relaxed">Lakukan verifikasi koordinat, kondisi lahan, akses jalan, dan dokumentasi lapangan.</p>
      </div>
    </div>
  </div>
);

const RingkasanHasil = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
    <h3 className="text-base font-bold text-gray-900 mb-6">Ringkasan Hasil Validasi</h3>
    <div className="flex gap-6 items-stretch flex-1">
      <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 flex flex-col items-center justify-center text-center w-52 shrink-0">
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-emerald-600 border border-emerald-100"><HiCheckCircle className="w-7 h-7" /></div>
        <p className="text-xs font-bold text-gray-600 mb-1">Status Validasi</p>
        <h4 className="text-3xl font-bold text-emerald-600 mb-3">Valid</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">Lokasi memenuhi kriteria dan layak untuk program rehabilitasi.</p>
      </div>
      <div className="flex-1 space-y-4 text-sm justify-center flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4 text-gray-400"/> Kesesuaian Lokasi</span><span className="font-bold text-emerald-600">Sesuai</span></div>
        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineMap className="w-4 h-4 text-gray-400"/> Kondisi Lahan</span><span className="font-bold text-emerald-600">Sesuai</span></div>
        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineUser className="w-4 h-4 text-gray-400"/> Aksesibilitas</span><span className="font-bold text-emerald-600">Memadai</span></div>
        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-600 flex items-center gap-2"><HiOutlineShieldCheck className="w-4 h-4 text-gray-400"/> Status Kepemilikan</span><span className="font-bold text-emerald-600">Aman / Tidak Konflik</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-600 flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-gray-400"/> Rekomendasi</span><span className="font-bold text-emerald-600">Layak Ditindaklanjuti</span></div>
      </div>
    </div>
  </div>
);

const KoordinatLokasi = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
    <h3 className="text-base font-bold text-gray-900 mb-6">Koordinat Lokasi Terverifikasi</h3>
    <div className="flex gap-6 items-center flex-1">
      <div className="w-2/3 h-full rounded-xl overflow-hidden relative border border-gray-200 min-h-40">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" alt="Map view" className="w-full h-full object-cover"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-6 h-6 bg-emerald-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div></div>
      </div>
      <div className="w-1/3 flex flex-col gap-4 text-sm">
        <div><p className="text-gray-500 mb-1">Lintang</p><p className="font-bold text-gray-900">-7.182345°</p></div>
        <div><p className="text-gray-500 mb-1">Bujur</p><p className="font-bold text-gray-900">107.543210°</p></div>
        <div><p className="text-gray-500 mb-1">Akurasi</p><p className="font-bold text-gray-900">± 5 m</p></div>
        <button className="mt-2 py-2 px-3 border border-emerald-600 text-emerald-700 font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"><HiOutlineMap className="w-4 h-4" /> Lihat di Peta</button>
      </div>
    </div>
  </div>
);

const DokumentasiLapangan = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-base font-bold text-gray-900 mb-6">Dokumentasi Lapangan</h3>
    <div className="grid grid-cols-5 gap-3">
      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=200&auto=format&fit=crop" alt="Doc 1" className="w-full h-full object-cover" /></div>
      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=200&auto=format&fit=crop" alt="Doc 2" className="w-full h-full object-cover" /></div>
      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=200&auto=format&fit=crop" alt="Doc 3" className="w-full h-full object-cover" /></div>
      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop" alt="Doc 4" className="w-full h-full object-cover" /></div>
      <button className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors group">
        <HiOutlineCamera className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 mb-2" />
        <span className="text-xs font-bold text-gray-600 group-hover:text-emerald-600">Lihat Semua</span>
        <span className="text-[10px] text-gray-400">12 foto</span>
      </button>
    </div>
  </div>
);

const ChecklistValidasi = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
    <h3 className="text-base font-bold text-gray-900 mb-6">Checklist Validasi</h3>
    <div className="grid grid-cols-2 gap-y-4 gap-x-8 flex-1 content-center">
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Koordinat lokasi</span></div>
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Status kepemilikan</span></div>
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Kondisi lahan</span></div>
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Aksesibilitas</span></div>
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Foto lokasi</span></div>
      <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><HiCheck className="w-3.5 h-3.5 stroke-3"/></div><span className="text-sm font-medium text-gray-700">Catatan lapangan</span></div>
    </div>
  </div>
);

const CatatanDanAksi = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-end gap-6">
    <div className="flex-1">
      <h3 className="text-base font-bold text-gray-900 mb-3">Catatan Hasil Validasi</h3>
      <p className="text-sm text-gray-700 leading-relaxed max-w-3xl font-medium">Lokasi berada di kawasan prioritas rehabilitasi. Lahan berupa lahan kritis dengan tutupan semak dan ilalang. Tidak terdapat konflik pemanfaatan lahan. Akses menuju lokasi dapat dilalui kendaraan roda dua.</p>
    </div>
    <div className="flex gap-3 shrink-0 w-full md:w-auto">
      <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-emerald-600 text-emerald-700 text-sm font-bold rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"><HiOutlinePencil className="w-4 h-4" /> Ubah Penugasan</button>
      <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#1F7A4D] text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm"><HiOutlineArrowDownTray className="w-4 h-4" /> Unduh Laporan</button>
    </div>
  </div>
);