import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlinePaperAirplane, HiOutlineDocumentDuplicate, HiOutlineCheckBadge } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CreateLaporanEvaluasiStaffPDAS: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [kesimpulanStaff, setKesimpulanStaff] = useState('');

  const autoData = {
    id: id || 'EVAL-001',
    proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
    periode: 'Pemeliharaan II (P2)', 
    lokasi: 'Hutan Lindung Desa Sudalarang, Kec. Sukawening, Kab. Garut (DAS Cimanuk)',
    hariTanggal: 'Jum\'at, 13 Maret 2026',
    luas: '29,78 Ha',
    jenisTanaman: 'Pinus, Akasia Mangium, Bungur, Mangga, Alpukat',
    persenTumbuh: '87,40%',
    tinggiRata: '123,20 cm',
    batasLulus: '75%',
    cpi: '3.45 (Prioritas Tinggi)', 
    statusSistem: 'BERHASIL'
  };

  const getTeksPeriode = (periode: string) => {
    if (periode.includes('P0')) return 'Tanaman Awal (P0)';
    if (periode.includes('P1')) return 'Pemeliharaan Tanaman Pertama (P1)';
    return 'Pemeliharaan Tanaman Kedua (P2)';
  };

  const handleAjukan = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Draft Berita Acara Evaluasi Berhasil Diajukan ke Kabid PDAS!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Draft Berita Acara Evaluasi</h1>
            <p className="text-sm text-gray-500">Sistem telah menyusun redaksi secara otomatis berdasarkan data GIS & Kalkulasi sebelumnya.</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1">
              <HiOutlineCheckBadge className="w-4 h-4" /> Periode: {autoData.periode}
            </span>
            <span className="text-xs font-bold text-gray-400">ID Laporan: {autoData.id}</span>
          </div>
        </div>

        <div className="bg-[#f8fbf9] p-8 border border-[#DCECE0] rounded-2xl text-sm text-gray-800 leading-relaxed font-serif shadow-sm mb-8 relative">
          
          <HiOutlineDocumentDuplicate className="absolute top-8 right-8 w-16 h-16 text-[#185325]/10" />

          <h2 className="text-center font-bold text-base underline mb-6 uppercase tracking-wide">
            BERITA ACARA PENILAIAN KEBERHASILAN PENANAMAN
          </h2>
          
          <p className="text-justify mb-4">
            Pada hari ini, <strong>{autoData.hariTanggal}</strong>, kami selaku Tim Penilai Keberhasilan Penanaman telah melakukan evaluasi lapangan pada program kegiatan <strong>{autoData.proyek}</strong> seluas <strong>{autoData.luas}</strong> di lokasi <strong>{autoData.lokasi}</strong>.
          </p>

          <p className="text-justify mb-2">
            Berdasarkan hasil pengolahan data spasial (WebGIS) dan perhitungan lapangan dengan jenis tanaman <strong>{autoData.jenisTanaman}</strong>, diperoleh hasil sebagai berikut:
          </p>
          
          <ul className="list-disc list-inside ml-4 mb-4 space-y-1.5">
            <li>Prosentase Keberhasilan Tumbuh: <span className="font-bold">{autoData.persenTumbuh}</span></li>
            <li>Rata-rata Tinggi Tanaman: <span className="font-bold">{autoData.tinggiRata}</span></li>
            <li>Skor Analisis CPI Lingkungan: <span className="font-bold text-blue-600">{autoData.cpi}</span></li>
          </ul>

          <p className="text-justify mb-4">
            Berdasarkan ketentuan Peraturan Menteri Lingkungan Hidup dan Kehutanan yang menyatakan bahwa keberhasilan tumbuh tanaman paling sedikit <strong>{autoData.batasLulus}</strong> dari tanaman awal setelah <strong>{getTeksPeriode(autoData.periode)}</strong>, maka pelaksanaan penanaman reboisasi pada lahan ini dinyatakan <span className="font-bold text-[#185325]">{autoData.statusSistem}</span>.
          </p>

          <p className="text-justify">
            Demikian Berita Acara Penilaian Keberhasilan Penanaman Rehabilitasi DAS ini dibuat untuk dapat dipergunakan sebagaimana mestinya dan diajukan pengesahannya kepada Kepala Bidang PDAS.
          </p>
        </div>

        <form onSubmit={handleAjukan}>
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-800 mb-2">Tambahkan Kesimpulan / Catatan Teknis (Opsional)</label>
            <textarea 
              rows={4}
              value={kesimpulanStaff}
              onChange={(e) => setKesimpulanStaff(e.target.value)}
              placeholder="Tambahkan catatan khusus lapangan jika ada..."
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] outline-none resize-none transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-6">
            <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md shadow-[#185325]/20 transition-colors flex items-center justify-center gap-2 active:scale-95">
              <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45 mb-1" /> Ajukan Laporan Evaluasi
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateLaporanEvaluasiStaffPDAS;