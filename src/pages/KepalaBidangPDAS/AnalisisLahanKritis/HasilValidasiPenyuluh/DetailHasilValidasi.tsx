import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineInformationCircle, HiOutlineDocumentText, HiOutlineClipboardDocumentCheck, HiOutlineXMark, HiOutlineCheck, HiOutlineShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { hasilValidasiService } from '@/services/hasilValidasi.service';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DetailHasilValidasi: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const [isVerifying, setIsVerifying] = useState(false);

  if (!data) {
    return (
      <div className="w-full mx-auto p-8 text-center text-gray-500">
        Data tidak ditemukan. Silakan kembali ke halaman sebelumnya.
        <br/>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-[#008A4B] text-white rounded-lg">Kembali</button>
      </div>
    );
  }

  const handleAction = async (action: 'Terima' | 'Tolak') => {
    try {
      setIsVerifying(true);
      const loadingId = toast.loading('Memproses verifikasi...');
      await hasilValidasiService.verify(data.id, action);
      toast.success(`Berhasil! Validasi telah di-${action.toLowerCase()}`, { id: loadingId });
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memverifikasi data.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isVerified = data.status_verifikasi !== 'Belum';

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Detail Hasil Validasi Lapangan</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[#185325] font-bold flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <HiOutlineInformationCircle className="w-5 h-5" /> Informasi Lokasi
            </h3>
            <div className="grid grid-cols-[150px_10px_1fr] gap-y-3 text-sm">
              <div className="text-gray-500 font-medium">Nama Lokasi</div><div>:</div><div className="font-bold text-gray-800">{data.nama_lokasi || '-'}</div>
              <div className="text-gray-500 font-medium">Sumber Lokasi</div><div>:</div><div className="font-medium text-gray-800">{data.sumber_lokasi || 'Analisis CPI'}</div>
              <div className="text-gray-500 font-medium">Penyuluh</div><div>:</div><div className="font-medium text-gray-800">{data.nama_penyuluh || '-'}</div>
              <div className="text-gray-500 font-medium">Tanggal Validasi</div><div>:</div><div className="font-medium text-gray-800">{new Date(data.created_at).toLocaleString('id-ID')}</div>
              <div className="text-gray-500 font-medium flex items-center">Status Sementara</div><div>:</div>
              <div><span className={`px-3 py-1 rounded-md text-xs font-bold ${data.status_verifikasi === 'Belum' ? 'bg-orange-100 text-orange-700' : (data.status_verifikasi === 'Terima' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}`}>
                {data.status_verifikasi === 'Belum' ? 'Belum Divalidasi' : (data.status_verifikasi === 'Terima' ? 'Data Diterima' : 'Data Ditolak')}
              </span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[#185325] font-bold flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <HiOutlineDocumentText className="w-5 h-5" /> Data Awal Lokasi
            </h3>
            <div className="grid grid-cols-[150px_10px_1fr] gap-y-3 text-sm">
              <div className="text-gray-500 font-medium">Koordinat awal</div><div>:</div><div className="font-medium text-gray-800">{data.titik_koordinat_gps || '-'}</div>
              <div className="text-gray-500 font-medium">Luas awal</div><div>:</div><div className="font-medium text-gray-800">{data.zone?.luas_ha ? `${data.zone.luas_ha} Ha` : '-'}</div>
              <div className="text-gray-500 font-medium">Status kekritisan</div><div>:</div><div className="font-medium text-gray-800">{data.zone?.status_lahan_kritis || 'Kritis'}</div>
              <div className="text-gray-500 font-medium">Rekomendasi</div><div>:</div><div className="font-medium text-gray-800">{data.zone?.rekomendasi_intervensi || 'Rehabilitasi Hutan dan Lahan'}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[#185325] font-bold flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <HiOutlineClipboardDocumentCheck className="w-5 h-5" /> Hasil Validasi Lapangan
            </h3>
            <div className="grid grid-cols-[150px_10px_1fr] gap-y-3 text-sm">
              <div className="text-gray-500 font-medium">Kondisi lahan</div><div>:</div><div className="font-medium text-gray-800">{data.kondisi_lahan || '-'}</div>
              <div className="text-gray-500 font-medium">Kondisi vegetasi</div><div>:</div><div className="font-medium text-gray-800">{data.kondisi_vegetasi || '-'}</div>
              <div className="text-gray-500 font-medium">Koordinat (rata-rata)</div><div>:</div><div className="font-medium text-gray-800">{data.titik_koordinat_gps || '-'}</div>
              <div className="text-gray-500 font-medium">Geotagging status</div><div>:</div>
              <div className="text-green-600 font-bold flex items-center gap-1">✓ Valid</div>
              <div className="text-gray-500 font-medium">Kendala lapangan</div><div>:</div><div className="font-medium text-gray-800">{data.kendala_lapangan || '-'}</div>
              <div className="text-gray-500 font-medium">Catatan peninjauan</div><div>:</div>
              <div className="font-medium text-gray-800 leading-relaxed">{data.catatan_peninjauan || '-'}</div>
            </div>
          </div>

        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-800 font-bold mb-4">Peta Lokasi</h3>
            <div className="w-full h-72 rounded-xl overflow-hidden relative border border-gray-200 z-0">
              {data.titik_koordinat_gps ? (() => {
                const parts = data.titik_koordinat_gps.split(',');
                const lat = parseFloat(parts[0]?.trim());
                const lng = parseFloat(parts[1]?.trim());
                if (!isNaN(lat) && !isNaN(lng)) {
                  return (
                    <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full" style={{ zIndex: 0 }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={[lat, lng]}>
                        <Popup>
                          Lokasi Validasi
                        </Popup>
                      </Marker>
                    </MapContainer>
                  );
                }
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <p className="text-sm">Koordinat tidak valid.</p>
                    <p className="text-xs font-mono mt-1">{data.titik_koordinat_gps}</p>
                  </div>
                );
              })() : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                  Tidak ada data koordinat.
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm z-10">
                {data.titik_koordinat_gps || '-'}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 font-bold">Dokumentasi Lapangan</h3>
              <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Lihat Semua</a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {data.foto_lokasi_url ? (
                <div className="h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 col-span-3">
                  <img src={data.foto_lokasi_url} alt="Dokumentasi 1" className="w-full h-full object-cover" />
                </div>
              ) : (
                <>
                  <div className="h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1418065460487-3e41a6c8e1e4?q=80&w=300&auto=format&fit=crop" alt="Doc 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=300&auto=format&fit=crop" alt="Doc 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop" alt="Doc 3" className="w-full h-full object-cover" />
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
      <div className="bg-white mt-6 rounded-2xl p-5 md:px-8 md:py-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-4 text-left w-full md:w-auto">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-full hidden sm:block">
            <HiOutlineShieldCheck className="w-6 h-6 stroke-2" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Keputusan Validasi</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Pastikan Anda telah memeriksa kesesuaian data lapangan secara menyeluruh sebelum mengambil keputusan.
            </p>
          </div>
        </div>

        {!isVerified ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => handleAction('Tolak')}
              disabled={isVerifying}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold text-sm rounded-full transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
            >
              <HiOutlineXMark className="w-4 h-4 stroke-2" /> Validasi Tidak Layak
            </button>
            <button
              onClick={() => handleAction('Terima')}
              disabled={isVerifying}
              className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50"
            >
              <HiOutlineCheck className="w-5 h-5 stroke-2" /> Validasi Layak
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-2">
            <div className="w-full sm:w-auto px-8 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-full flex items-center justify-center gap-2 border border-gray-200">
              {data.status_verifikasi === 'Terima' ? (
                <><HiOutlineCheck className="w-5 h-5 stroke-2 text-emerald-600" /> Validasi Layak (Diterima)</>
              ) : (
                <><HiOutlineXMark className="w-5 h-5 stroke-2 text-red-600" /> Validasi Tidak Layak (Ditolak)</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailHasilValidasi;