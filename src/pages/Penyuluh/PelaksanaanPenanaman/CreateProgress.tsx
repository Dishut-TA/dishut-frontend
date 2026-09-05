import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiCheckCircle,
  HiChevronRight,
  HiOutlineEye,
} from 'react-icons/hi2';

// --- CUSTOM ICONS ---
const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 20.001c-1.25.687-2.78-.217-2.78-1.643V5.653z" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
  </svg>
);

// ==========================================
// 1. DATA MOCKUP LENGKAP
// ==========================================

// ==========================================
// 2. KOMPONEN HALAMAN DETAIL UTAMA
// ==========================================
import { useState, useEffect } from 'react';

const InputProgresPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${API_URL}/penugasan/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        const d = json.data;
        
        let programName = '-';
        let location = '-';
        let kth = '-';
        let targetBibit = '0';
        let totalPu = '-';
        let luasArea = '-';
        
        if (d.penugasanable_type === 'App\\Models\\DonationProgram') {
          programName = d.penugasanable?.name || '-';
          location = d.penugasanable?.location || '-';
          kth = d.penugasanable?.kth?.name || '-';
          targetBibit = d.penugasanable?.target_amount || '0';
          totalPu = (d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.jumlah_pu || '-';
          luasArea = (d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.luas_ha ? `${(d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.luas_ha} Ha` : '-';
        } else if (d.penugasanable_type === 'App\\Models\\ProgramApbd' || d.penugasanable_type === 'App\\Models\\ProgramCsr') {
          programName = d.penugasanable?.nama_program || '-';
          location = d.penugasanable?.lokasi || (d.penugasanable?.kth ? `${d.penugasanable.kth.desa_kelurahan}, ${d.penugasanable.kth.kabupaten_kota}` : '-');
          kth = d.penugasanable?.kth?.nama_kelompok || d.penugasanable?.kth?.nama || '-';
          targetBibit = d.penugasanable?.target_bibit || d.penugasanable?.jumlah_bibit || '0';
          totalPu = (d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.jumlah_pu || '-';
          luasArea = d.penugasanable?.target_luas_lahan ? `${d.penugasanable.target_luas_lahan} Ha` : ((d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.luas_ha ? `${(d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.luas_ha} Ha` : '-');
        }

        setData({
          id: d.id,
          status: d.status,
          idPenugasan: `TGS-${d.id}`,
          idProgram: d.penugasanable?.id ? `PRG-${d.penugasanable.id}` : '-',
          sumberLokasi: d.penugasanable_type.includes('Apbd') ? 'APBD' : d.penugasanable_type.includes('Csr') ? 'CSR' : 'Donasi',
          periodeMulai: d.tanggal_mulai ? new Date(d.tanggal_mulai).toLocaleDateString('id-ID') : '-',
          periodeSelesai: d.batas_waktu ? new Date(d.batas_waktu).toLocaleDateString('id-ID') : '-',
          namaProgram: programName,
          lokasi: location,
          penyuluh: d.penyuluh?.username || '-',
          kth: kth,
          targetBibit: targetBibit + ' bibit',
          luasArea: luasArea,
          rencanaKegiatan: d.jenis_kegiatan,
          totalPu: totalPu ? `${totalPu} PU` : '-',
          estimasiPerPu: '±50 bibit', // Mock
          hasilValidasi: 'Sesuai',
          tanggalValidasi: '-',
          koordinat: '-',
          kondisiUmum: '-',
          catatan: '-'
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPenugasan();
  }, [id]);

  // Helper Warna Status Badge Atas
  const getBadgeStyle = (status: string) => {
    if (status === 'Ditugaskan') return 'bg-yellow-50 text-yellow-600';
    if (status === 'Berjalan') return 'bg-blue-50 text-blue-600';
    if (status === 'Selesai') return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-50 text-slate-600';
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Data penugasan tidak ditemukan</div>;

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800">

      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Detail Penugasan Pelaksanaan</h1>
          <p className="text-sm text-slate-500">Periksa informasi penugasan dan hasil validasi lokasi sebelum memulai pelaksanaan kegiatan.</p>
        </div>

        {/* TOP BANNER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-5 px-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x divide-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-2">Status Penugasan</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(data.status)}`}>
                <HiCheckCircle className="w-4 h-4" /> {data.status}
              </span>
            </div>
            <div className="pl-6">
              <p className="text-xs text-slate-500 mb-2">ID Penugasan</p>
              <p className="text-base font-bold text-slate-900">{data.idPenugasan}</p>
            </div>
            <div className="pl-6">
              <p className="text-xs text-slate-500 mb-2">ID Program</p>
              <p className="text-base font-bold text-slate-900">{data.idProgram}</p>
            </div>
            <div className="pl-6">
              <p className="text-xs text-slate-500 mb-2">Sumber Lokasi</p>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-600">{data.sumberLokasi}</span>
            </div>
            <div className="pl-6">
              <p className="text-xs text-slate-500 mb-2">Periode Pelaksanaan</p>
              <p className="text-sm font-bold text-slate-900">{data.periodeMulai} – {data.periodeSelesai}</p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6">

          {/* KOLOM KIRI (Informasi Utama) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Informasi Penugasan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-6">
                <HiOutlineDocumentText className="w-5 h-5 text-[#008A4B]" /> Informasi Penugasan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Program</p>
                  <p className="text-sm font-bold text-slate-900">{data.namaProgram}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">KTH</p>
                  <p className="text-sm font-bold text-slate-900">{data.kth}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Rencana Kegiatan</p>
                  <p className="text-sm font-bold text-slate-900">{data.rencanaKegiatan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Lokasi Penugasan</p>
                  <p className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">{data.lokasi}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Target Bibit</p>
                  <p className="text-sm font-bold text-slate-900">{data.targetBibit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Total PU</p>
                  <p className="text-sm font-bold text-slate-900">{data.totalPu}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Penyuluh</p>
                  <p className="text-sm font-bold text-slate-900">{data.penyuluh}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Luas Area</p>
                  <p className="text-sm font-bold text-slate-900">{data.luasArea}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">Estimasi per PU</p>
                  <p className="text-sm font-bold text-slate-900">{data.estimasiPerPu}</p>
                </div>
              </div>
            </div>

            {/* Ringkasan Hasil Validasi Lokasi */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-6">
                <HiCheckCircle className="w-5 h-5 text-[#008A4B]" /> Ringkasan Hasil Validasi Lokasi
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-5">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-slate-500 mb-1 font-medium">Hasil Validasi</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                        <HiCheckCircle className="w-4 h-4" /> {data.hasilValidasi}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 font-medium">Tanggal Validasi</p>
                      <p className="text-sm font-bold text-slate-900 mt-1.5">{data.tanggalValidasi}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Koordinat Lokasi</p>
                    <p className="text-sm font-bold text-slate-900">{data.koordinat}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Kondisi Umum Lokasi</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {data.kondisiUmum}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Catatan Validasi</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {data.catatan}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-64 shrink-0">
                  <p className="text-xs text-slate-500 mb-2 font-medium">Dokumentasi Lokasi</p>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=150" alt="Dokumentasi 1" className="w-full h-20 object-cover rounded-md border border-slate-200" />
                    <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" alt="Dokumentasi 2" className="w-full h-20 object-cover rounded-md border border-slate-200" />
                    <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=150" alt="Dokumentasi 3" className="w-full h-20 object-cover rounded-md border border-slate-200" />
                  </div>
                  <button className="text-xs font-bold text-[#008A4B] hover:underline flex items-center gap-1">
                    Lihat semua foto (3) <HiChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex justify-end items-end gap-4 z-40 mt-6">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 rounded-full flex items-center gap-2 shadow-sm transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </button>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-center gap-3">
          {data.status === 'Ditugaskan' && (
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
                fetch(`${API_URL}/penugasan/${id}/mulai`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                }).then(() => {
                  navigate(`/admin/penyuluh/pelaksanaan-penanaman/input-data/${id}`);
                });
              }}
              className="px-6 py-2.5 bg-[#008A4B] text-white font-bold text-sm hover:bg-emerald-800 rounded-full w-full flex items-center gap-2 shadow-sm transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Mulai Pelaksanaan
            </button>
          )}

          {data.status === 'Berjalan' && (
            <button
              onClick={() =>
                navigate(`/admin/penyuluh/pelaksanaan-penanaman/input-data/${id}`)
              }
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 rounded-full w-full flex items-center gap-2 shadow-sm transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Lanjutkan Pelaksanaan
            </button>
          )}

          {data.status === 'Selesai' && (
            <button
              onClick={() =>
                navigate(`/admin/penyuluh/pelaksanaan-penanaman/input-data/${id}`)
              }
              className="px-6 py-2.5 bg-white border border-[#008A4B] text-[#008A4B] font-bold text-sm hover:bg-emerald-50 rounded-full flex items-center gap-2 shadow-sm transition-colors"
            >
              <HiOutlineEye className="w-4 h-4 stroke-2" />
              Lihat Detail Laporan
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default InputProgresPage;