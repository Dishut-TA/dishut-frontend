import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft,
  HiOutlineMapPin,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineCloud,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineArrowPath
} from 'react-icons/hi2';

const DetailVerifikasiPelaksanaan: React.FC = () => {
  const navigate = useNavigate();
  // const { id } = useParams();

  const data = {
    idLaporan: 'm2',
    judul: 'Penanaman Mangrove Pesisir (Tahap 2)',
    kth: 'Kelompok Tani Hutan Lestari',
    tglLaporan: '16/04/2026',
    status: 'Pending',
    target: '10.000',
    realisasi: '7.250',
    persentase: '72.5%',
    sisa: '2.750',
    lokasi: 'Desa Pusakamulya, Kec. Ciwaru, Kab. Kuningan',
    luas: '2,5 Ha',
    metode: 'Tugal',
    tglPelaksanaan: '10/04/2026 - 14/04/2026',
    personil: '18 Orang',
    cuaca: 'Cerah Berawan',
    kendala: 'Akses lokasi sulit saat pasang air laut tinggi'
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
        <div>
          <div className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
            Beranda <span className="text-gray-300">&gt;</span> Verifikasi Pelaksanaan <span className="text-gray-300">&gt;</span> <span className="text-gray-600">Detail Verifikasi</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi Pelaksanaan Kegiatan</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau progres, tinjau data lapangan, dan verifikasi kesesuaian dengan target dan rencana kegiatan.</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <HiOutlineArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">ID Laporan</p>
          <p className="text-sm font-bold text-gray-800">{data.idLaporan}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Judul Kegiatan</p>
          <p className="text-sm font-bold text-gray-800">{data.judul}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">KTH Pelaksana</p>
          <p className="text-sm font-bold text-gray-800">{data.kth}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tanggal Laporan</p>
          <p className="text-sm font-bold text-gray-800">{data.tglLaporan}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status Saat Ini</p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
            {data.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
              <HiOutlineCube className="w-5 h-5 text-gray-400" /> Ringkasan Target & Realisasi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-500 mb-1">Target Penanaman</p>
                <p className="text-2xl font-extrabold text-emerald-600">{data.target}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Bibit</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-500 mb-1">Realisasi Penanaman</p>
                <p className="text-2xl font-extrabold text-[#185325]">{data.realisasi}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Bibit</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-500 mb-1">Persentase Capaian</p>
                <p className="text-2xl font-extrabold text-blue-600">{data.persentase}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Dari Target</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-500 mb-1">Sisa Target</p>
                <p className="text-2xl font-extrabold text-orange-500">{data.sisa}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Bibit</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" /> Data Progres Lapangan
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineMapPin className="w-4 h-4 shrink-0" /> Lokasi Kegiatan
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800">{data.lokasi}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineCheckCircle className="w-4 h-4 shrink-0" /> Luas Area
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800">{data.luas}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineWrenchScrewdriver className="w-4 h-4 shrink-0" /> Metode Penanaman
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800">{data.metode}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineCalendar className="w-4 h-4 shrink-0" /> Tanggal Pelaksanaan
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800">{data.tglPelaksanaan}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineUsers className="w-4 h-4 shrink-0" /> Jumlah Personil
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800">{data.personil}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium">
                  <HiOutlineCloud className="w-4 h-4 shrink-0" /> Kondisi Cuaca
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800 flex items-center gap-2">
                   ⛅ {data.cuaca}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-1/2 sm:w-2/5 flex items-center gap-2 text-gray-500 font-medium pt-1">
                  <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" /> Kendala Utama
                </div>
                <div className="w-1/2 sm:w-3/5 font-bold text-gray-800 pt-1">{data.kendala}</div>
              </div>
            </div>
          </div>

        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-gray-400" /> Dokumentasi Lapangan
              </h2>
              <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                Lihat Semua
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80" alt="Dokumentasi 1" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
              <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=300&q=80" alt="Dokumentasi 2" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=80" alt="Dokumentasi 3" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HiOutlineArrowPath className="w-5 h-5 text-gray-400" /> Riwayat Verifikasi
            </h2>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              <div className="relative pl-6">
                <div className="absolute -left-4.25 top-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white">
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Laporan diterima</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">16/04/2026 09:15 WIB</p>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Sistem</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-4.25 top-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white">
                  <HiOutlineEye className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Dalam proses review oleh Staff PDAS</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">16/04/2026 09:20 WIB</p>
                  </div>
                  <span className="text-xs font-bold text-gray-800">Daffa Mahendra</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-3.25 top-1 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex justify-between items-start pt-0.5">
                  <h3 className="text-sm font-bold text-gray-400">Menunggu keputusan verifikasi</h3>
                  <span className="text-xs font-bold text-gray-400">-</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-2 w-full">
        <button className="px-6 py-3.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors cursor-pointer w-full sm:w-auto">
          ✕ Tolak Laporan
        </button>
        <button className="px-6 py-3.5 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 text-sm font-bold rounded-xl transition-colors cursor-pointer w-full sm:w-auto">
          ⟳ Minta Perbaikan / Tindak Lanjut
        </button>
        <button className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer w-full sm:w-auto">
          ✓ Verifikasi Pelaksanaan Sesuai Target
        </button>
      </div>

    </div>
  );
};

export default DetailVerifikasiPelaksanaan;