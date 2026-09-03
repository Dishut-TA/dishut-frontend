import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheckBadge, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CreatePengesahanLaporanKabid: React.FC = () => {
  const navigate = useNavigate();

  const handleSahkan = () => {
    toast.success('Laporan dievaluasi dan Berita Acara Final berhasil diterbitkan!');
    navigate(-1);
  };

  const handleTolak = () => {
    toast.error('Laporan dikembalikan ke Tim Penilai untuk direvisi.');
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi & Pengesahan Laporan Evaluasi</h1>
        <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          Penilaian Keberhasilan Penanaman Rehabilitasi DAS PT. Jawa Satu Power (29.78 Ha)
        </p>

        {/* View Peta GIS (Placeholder) */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#185325] mb-3">Visualisasi Sebaran Geotagging Petak Ukur</h3>
          <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative border border-gray-300">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Peta GIS" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-white/90 text-sm font-bold px-4 py-2 rounded-lg text-gray-800 shadow-sm">Layer Peta WebGIS Dimuat...</span>
            </div>
          </div>
        </div>

        {/* Draft Berita Acara Content */}
        <div className="bg-[#f8fbf9] p-6 rounded-xl border border-[#DCECE0] mb-8 space-y-4 text-sm leading-relaxed text-gray-700">
          <h3 className="font-bold text-lg text-center text-gray-800 mb-4">DRAFT BERITA ACARA</h3>
          <p>Telah selesai melakukan tugas penilaian keberhasilan penanaman dalam rangka reboisasi pada lahan kompensasi PT. Jawa Satu Power...</p>
          <ul className="list-decimal list-inside ml-2 space-y-1">
            <li>Lokasi penanaman berada pada Kawasan hutan lindung, Desa Sudalarang.</li>
            <li>Luas kegiatan penanaman 29,78 Ha.</li>
            <li>Prosentase tumbuh tanaman sebesar <strong>87.40%</strong> dengan rerata ketinggian <strong>123.20 cm</strong>.</li>
          </ul>
          <p className="font-bold text-[#185325] mt-4">Kesimpulan: Dinyatakan BERHASIL.</p>
        </div>

        {/* Catatan Revisi */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Revisi (Jika Ditolak)</label>
          <textarea className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-[#185325] focus:border-[#185325]" rows={3} placeholder="Tulis catatan perbaikan untuk Staff PDAS..."></textarea>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-6">
          <button onClick={handleTolak} className="px-8 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
            <HiOutlineXMark className="w-5 h-5" /> Tolak & Kembalikan
          </button>
          <button onClick={handleSahkan} className="px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <HiOutlineCheckBadge className="w-5 h-5" /> Sahkan Laporan
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePengesahanLaporanKabid;