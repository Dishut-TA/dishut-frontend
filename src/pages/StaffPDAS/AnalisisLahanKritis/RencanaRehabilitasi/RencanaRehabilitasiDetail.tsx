import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineChevronLeft,
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineMapPin, 
  HiOutlineInformationCircle,
  HiOutlineUser
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { rehabilitasiService } from '@/services/rehabilitasi.service';

const RencanaRehabilitasiDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  // If no data, show not found
  if (!data) {
    return (
      <div className="w-full mx-auto p-8 text-center text-gray-500">
        Data tidak ditemukan. Silakan kembali ke halaman sebelumnya.
        <br/>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-[#008A4B] text-white rounded-lg">Kembali</button>
      </div>
    );
  }

  const validation = data.field_validations?.length > 0 ? data.field_validations[0] : null;
  const status = data.status_kelayakan;
  const lokasi = validation?.nama_lokasi || data.result?.project?.project_code || 'Lokasi tidak diketahui';

  const [luasLahanTotal, setLuasLahanTotal] = useState<number>(Number(data.luas_ha) || 0);
  const [panjangPU, setPanjangPU] = useState<number>(4); 
  const [lebarPU, setLebarPU] = useState<number>(5); 
  const [jumlahPU, ] = useState<number>(data.jumlah_pu || 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const luas1PU = (panjangPU * lebarPU) / 10000;

  const handleSimpan = async () => {
    try {
      setIsSubmitting(true);
      const loadingId = toast.loading('Menyimpan rencana rehabilitasi...');
      await rehabilitasiService.submitRencana(data.id, {
        luas_lahan_total: luasLahanTotal,
        panjang_pu: panjangPU,
        lebar_pu: lebarPU,
        jumlah_pu: jumlahPU
      });
      toast.success("Rencana rehabilitasi berhasil disimpan!", { id: loadingId });
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan rencana rehabilitasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parsing coordinates
  const coordParts = validation?.titik_koordinat_gps ? validation.titik_koordinat_gps.split(',') : [];
  const lat = coordParts[0]?.trim() || '-';
  const lng = coordParts[1]?.trim() || '-';

  return (
    <div className="flex flex-col gap-6 w-full mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#185325] transition-colors cursor-pointer mb-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detail Rencana Rehabilitasi</h1>
          <p className="text-sm text-gray-500 mt-1">{lokasi}</p>
        </div>
      </div>

      {/* CARD STATUS KELAYAKAN */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-full ${status === 'Layak' ? 'bg-emerald-100 text-emerald-600' : status === 'Tidak Layak' || status === 'Tidak Valid' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            {status === 'Layak' ? <HiOutlineCheckCircle className="w-10 h-10 stroke-2"/> : <HiOutlineXCircle className="w-10 h-10 stroke-2" />}
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status Validasi</p>
            <h2 className={`text-2xl md:text-3xl font-bold ${status === 'Layak' ? 'text-emerald-700' : status === 'Tidak Layak' || status === 'Tidak Valid' ? 'text-red-700' : 'text-amber-700'}`}>
              {status === 'Valid' ? 'Menunggu Lengkap' : status}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {status === 'Valid' ? 'Lokasi ini menunggu penyelesaian rencana rehabilitasi.' : `Lokasi ini ${status.toLowerCase()} untuk dilakukan rehabilitasi.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 md:border-l border-gray-200 md:pl-8 mt-4 md:mt-0">
          <div>
             <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Validasi</p>
             <p className="text-sm font-bold text-gray-800">{validation ? new Date(validation.created_at).toLocaleString('id-ID') : '-'}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
               <HiOutlineUser className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-medium mb-1">Divalidasi oleh</p>
               <p className="text-sm font-bold text-gray-800">{validation?.nama_penyuluh || '-'}</p>
               <p className="text-[11px] text-gray-500">Penyuluh Kehutanan</p>
             </div>
          </div>
        </div>
      </div>

      {/* GRID KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM 1: Informasi Lokasi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 text-[#185325]">
            <HiOutlineMapPin className="w-5 h-5 stroke-2"/>
            <h3 className="font-bold text-base">Informasi Lokasi</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex flex-col border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-xs mb-1">Nama Lokasi</span>
              <span className="font-bold text-gray-800">{lokasi}</span>
            </div>
            <div className="flex flex-col border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-xs mb-1">Rekomendasi Intervensi</span>
              <span className="font-bold text-gray-800">{data.rekomendasi_intervensi || '-'}</span>
            </div>
            <div className="flex flex-col border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-xs mb-1">Kondisi Lahan</span>
              <span className="font-bold text-gray-800">{validation?.kondisi_lahan || '-'}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
              <span className="text-gray-600 font-medium">Luas Lahan (Total)</span>
              <span className="font-bold text-[#185325]">{luasLahanTotal.toFixed(2).replace('.', ',')} Ha</span>
            </div>
          </div>
        </div>

        {/* KOLOM 2: Data Petak Ukur (HANYA MUNCUL JIKA STATUS VALID) */}
        {status === 'Valid' ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-green-700">
              <HiOutlineInformationCircle className="w-5 h-5 stroke-2"/>
              <h3 className="font-bold text-base">Data Petak Ukur</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Luas Lahan Total (Ha)</label>
                <input 
                  type="number"
                  disabled 
                  value={luasLahanTotal}
                  onChange={(e) => setLuasLahanTotal(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all"
                />
              </div>
              
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-50">
                <p className="text-xs font-bold text-green-800 mb-3">Dimensi 1 Petak Ukur</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Panjang (meter)</label>
                    <input 
                      type="number"
                      disabled
                      value={panjangPU}
                      onChange={(e) => setPanjangPU(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Lebar (meter)</label>
                    <input 
                      type="number" 
                      value={lebarPU}
                      onChange={(e) => setLebarPU(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Luas 1 Petak Ukur (Ha) <span className="text-green-500 italic font-normal">*Otomatis</span></label>
                <input 
                  type="text" 
                  value={luas1PU.toFixed(4).replace('.', ',')}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-gray-600 font-semibold cursor-not-allowed text-sm"
                />
              </div>

              <div className="bg-[#F3F4F6] p-5 rounded-xl text-center border border-gray-200 mt-6">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Jumlah Petak Ukur</p>
                <p className="text-4xl font-bold text-[#185325] my-2">{jumlahPU} <span className="text-xl">PU</span></p>
                <p className="text-[10px] text-gray-500 italic mt-2 bg-white px-2 py-1 rounded-md inline-block border border-gray-200">
                  Rumus: {luasLahanTotal} Ha ÷ {luas1PU.toFixed(4)} Ha
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-75">
            <HiOutlineInformationCircle className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm font-bold text-gray-600">Data Petak Ukur {status === 'Layak' ? 'Sudah Tersimpan' : 'Dibatalkan'}</p>
            <p className="text-xs text-gray-500 mt-1 max-w-50">{status === 'Layak' ? 'Data sudah disetujui untuk modul selanjutnya.' : `Karena lokasi ini dinilai ${status}, pembagian Petak Ukur tidak diperlukan.`}</p>
          </div>
        )}

        {/* KOLOM 3: Informasi Validasi & Koordinat */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-4 text-[#185325]">
              <HiOutlineCheckCircle className="w-5 h-5 stroke-2"/>
              <h3 className="font-bold text-base">Hasil Validasi Lapangan</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-500">Status Validasi</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">Valid</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-bold mb-3">Dokumentasi Lapangan</p>
              <div className="grid grid-cols-3 gap-2">
                {validation?.foto_lokasi_url ? (
                  <div className="aspect-square col-span-3 bg-gray-200 rounded-lg overflow-hidden relative">
                    <img src={validation.foto_lokasi_url} className="object-cover w-full h-full" alt="Dokumentasi" />
                  </div>
                ) : (
                  <>
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=200" className="object-cover w-full h-full" alt="Lahan 1" />
                    </div>
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=200" className="object-cover w-full h-full" alt="Lahan 2" />
                    </div>
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=200" className="object-cover w-full h-full" alt="Lahan 3" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-colors group-hover:bg-black/70">
                        <span className="text-white text-xs font-bold">+5 Foto</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-sm text-gray-800 mb-4">Koordinat Utama Lokasi</h3>
            <div className="flex gap-4">
               <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Latitude</p>
                 <p className="text-sm font-bold text-gray-800">{lat}</p>
               </div>
               <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Longitude</p>
                 <p className="text-sm font-bold text-gray-800">{lng}</p>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION BAWAH: RENCANA REHABILITASI (HANYA MUNCUL JIKA VALID) */}
      {status === 'Valid' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-2">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">Penyusunan Rencana Final</h3>
            <p className="text-sm text-gray-500 mt-1">Data berikut di-generate otomatis berdasarkan analisis sistem dan pengaturan di atas.</p>
          </div>
          
          <div className="p-6 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">KTH (Kelompok Tani Hutan)</label>
                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full shadow-xs text-gray-700 font-bold text-sm cursor-not-allowed">
                  {data.nama_kelompok || '-'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Rekomendasi Intervensi</label>
                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full shadow-xs text-gray-700 font-bold text-sm cursor-not-allowed">
                  {data.rekomendasi_intervensi || '-'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Jumlah Petak Ukur (PU)</label>
                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full shadow-xs text-[#185325] font-bold text-sm cursor-not-allowed text-center">
                  {jumlahPU > 0 ? `${String(jumlahPU).padStart(3, '0')}` : '-'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border-t border-gray-100 flex justify-end items-center gap-4">
             <p className="text-xs text-gray-400 hidden sm:block">Pastikan data petak ukur sudah sesuai sebelum disimpan.</p>
             <button 
                onClick={handleSimpan}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full shadow-sm transition-all active:scale-95 text-sm w-full sm:w-auto disabled:opacity-50"
             >
               Simpan Rencana Rehabilitasi
             </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RencanaRehabilitasiDetail;