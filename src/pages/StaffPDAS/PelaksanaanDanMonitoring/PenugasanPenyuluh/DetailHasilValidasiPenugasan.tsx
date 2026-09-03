import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineMap,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineArrowDownTray,
  HiOutlineCamera,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiCheckCircle,
  HiOutlineMapPin
} from 'react-icons/hi2';

const DetailHasilValidasiPenugasan: React.FC = () => {
  const navigate = useNavigate();
  const isValid = true; 

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Hasil Validasi Lokasi</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isValid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {isValid ? 'Valid' : 'Tidak Valid'}
            </span>
          </div>
          <p className="text-sm text-gray-500">Berikut hasil validasi lokasi usulan rehabilitasi yang telah diverifikasi di lapangan.</p>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm shrink-0">
          <HiOutlineArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
        <h2 className="text-base font-bold text-gray-800 mb-6">Informasi Penugasan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2"><span className="text-gray-500">ID Referensi</span><span className="font-bold text-gray-800">LOC-2026-0012</span></div>
            <div className="grid grid-cols-2"><span className="text-gray-500">Lokasi Usulan</span><span className="font-bold text-gray-800">Blok Cibodas</span></div>
            <div className="grid grid-cols-2"><span className="text-gray-500">Sumber Lokasi</span><span className="font-bold text-gray-800">Analisis CPI</span></div>
            <div className="grid grid-cols-2"><span className="text-gray-500">CDK</span><span className="font-bold text-gray-800">Cimanuk</span></div>
            <div className="grid grid-cols-2"><span className="text-gray-500">Desa / Kecamatan</span><span className="font-bold text-gray-800">Desa Sukamaju / Kec. Rancabali</span></div>
            <div className="grid grid-cols-2"><span className="text-gray-500">Luas Usulan</span><span className="font-bold text-gray-800">12,5 Ha</span></div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 items-center">
              <span className="text-gray-500">Penyuluh Ditugaskan</span>
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineUser className="text-blue-600 w-4 h-4" strokeWidth={2} /> Ahmad Fauzi
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-gray-500">Tanggal Validasi</span>
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineCalendar className="text-gray-500 w-4 h-4" strokeWidth={2} /> 15 Jun 2026
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-gray-500">Tanggal Selesai Validasi</span>
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineCalendar className="text-gray-500 w-4 h-4" strokeWidth={2} /> 16 Jun 2026
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-gray-500">Batas Waktu</span>
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineCalendar className="text-gray-500 w-4 h-4" strokeWidth={2} /> 20 Jun 2026
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-gray-500">Status Penugasan</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Selesai Validasi
              </span>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-gray-500 block mb-2">Catatan Penugasan</span>
            <p className="font-semibold text-gray-800 leading-relaxed pr-4">
              Lakukan verifikasi koordinat, kondisi lahan, akses jalan, dan dokumentasi lapangan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
          <h2 className="text-base font-bold text-gray-800 mb-5">Ringkasan Hasil Validasi</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            
            <div className={`w-full sm:w-1/3 rounded-xl flex flex-col items-center justify-center p-6 text-center border shadow-sm ${isValid ? 'bg-[#F0FDF4] border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              {isValid ? (
                <HiOutlineCheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
              ) : (
                <HiOutlineXCircle className="w-12 h-12 text-red-500 mb-2" />
              )}
              <span className="text-[11px] text-gray-500 font-bold mb-1">Status Validasi</span>
              <span className={`text-2xl font-extrabold ${isValid ? 'text-emerald-600' : 'text-red-600'}`}>
                {isValid ? 'Valid' : 'Tidak Valid'}
              </span>
              <p className="text-[10px] text-gray-500 mt-3 leading-tight px-2">
                {isValid ? 'Lokasi memenuhi kriteria dan layak untuk program rehabilitasi.' : 'Lokasi tidak memenuhi kriteria dan tidak layak ditindaklanjuti.'}
              </p>
            </div>
            
            <div className="w-full sm:w-2/3 flex flex-col justify-center">
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="flex items-center gap-3 text-gray-600 text-sm font-medium"><HiOutlineShieldCheck className="w-5 h-5 text-gray-400" strokeWidth={1.5}/> Kesesuaian Lokasi</span>
                <span className={isValid ? "text-emerald-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>{isValid ? 'Sesuai' : 'Tidak Sesuai'}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="flex items-center gap-3 text-gray-600 text-sm font-medium"><HiOutlineMap className="w-5 h-5 text-gray-400" strokeWidth={1.5}/> Kondisi Lahan</span>
                <span className={isValid ? "text-emerald-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>{isValid ? 'Sesuai' : 'Tidak Memadai'}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="flex items-center gap-3 text-gray-600 text-sm font-medium"><HiOutlineTruck className="w-5 h-5 text-gray-400" strokeWidth={1.5}/> Aksesibilitas</span>
                <span className={isValid ? "text-emerald-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>{isValid ? 'Memadai' : 'Sulit Dijangkau'}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="flex items-center gap-3 text-gray-600 text-sm font-medium"><HiOutlineDocumentText className="w-5 h-5 text-gray-400" strokeWidth={1.5}/> Status Kepemilikan</span>
                <span className="text-emerald-600 font-bold text-sm">Aman / Tidak Konflik</span>
              </div>
              <div className="flex items-center justify-between pt-2.5">
                <span className="flex items-center gap-3 text-gray-600 text-sm font-medium"><HiOutlineClipboardDocumentCheck className="w-5 h-5 text-gray-400" strokeWidth={1.5}/> Rekomendasi</span>
                <span className={isValid ? "text-emerald-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>{isValid ? 'Layak Ditindaklanjuti' : 'Tidak Layak'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
          <h2 className="text-base font-bold text-gray-800 mb-5">Koordinat Lokasi Terverifikasi</h2>
          <div className="flex flex-col sm:flex-row gap-6 h-full">
            <div className="w-full sm:w-[60%] h-48 sm:h-full rounded-xl bg-[#EBF3FA] relative overflow-hidden border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                alt="Map" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <HiOutlineMapPin className="w-10 h-10 text-emerald-500 drop-shadow-md bg-white rounded-full p-1.5" strokeWidth={2.5}/>
              </div>
            </div>
            
            <div className="w-full sm:w-[40%] flex flex-col justify-center space-y-4">
              <div>
                <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">Lintang</p>
                <p className="text-sm font-bold text-gray-800">-7.182345°</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">Bujur</p>
                <p className="text-sm font-bold text-gray-800">107.543210°</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">Akurasi</p>
                <p className="text-sm font-bold text-gray-800">± 5 m</p>
              </div>
              <button className="mt-2 w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer">
                <HiOutlineMap className="w-4 h-4" /> Lihat di Peta
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
          <h2 className="text-base font-bold text-gray-800 mb-5">Dokumentasi Lapangan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop" alt="Dokumentasi 1" className="w-full h-24 object-cover rounded-xl border border-gray-200" />
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=300&h=200&fit=crop" alt="Dokumentasi 2" className="w-full h-24 object-cover rounded-xl border border-gray-200" />
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop" alt="Dokumentasi 3" className="w-full h-24 object-cover rounded-xl border border-gray-200 hidden sm:block" />
            <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=300&h=200&fit=crop" alt="Dokumentasi 4" className="w-full h-24 object-cover rounded-xl border border-gray-200 hidden sm:block" />
            
            <button className="flex flex-col items-center justify-center h-24 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer">
              <HiOutlineCamera className="w-6 h-6 mb-1 text-gray-400" />
              <span className="text-[11px] font-bold">Lihat Semua</span>
              <span className="text-[10px] text-gray-400">12 foto</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
          <h2 className="text-base font-bold text-gray-800 mb-5">Checklist Validasi</h2>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-24 flex items-center">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 w-full text-xs text-gray-800 font-bold">
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Koordinat lokasi</div>
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Status kepemilikan</div>
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Kondisi lahan</div>
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Aksesibilitas</div>
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Foto lokasi</div>
              <div className="flex items-center gap-2.5"><HiCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" /> Catatan lapangan</div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Catatan Hasil Validasi</h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-3xl">
            Lokasi berada di kawasan prioritas rehabilitasi. Lahan berupa lahan kritis dengan tutupan semak dan ilalang. Tidak terdapat konflik pemanfaatan lahan. Akses menuju lokasi dapat dilalui kendaraan roda dua.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-sm font-bold rounded-xl transition-colors cursor-pointer">
            <HiOutlinePencilSquare className="w-5 h-5" /> Ubah Penugasan
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer">
            <HiOutlineArrowDownTray className="w-5 h-5" /> Unduh Laporan
          </button>
        </div>
      </div>

    </div>
  );
};

export default DetailHasilValidasiPenugasan;