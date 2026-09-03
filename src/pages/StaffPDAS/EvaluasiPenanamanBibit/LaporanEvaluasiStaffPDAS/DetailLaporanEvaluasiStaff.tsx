import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
// import { TemplateBeritaAcaraPDF } from './components/TemplateBeritaAcaraPDF';
import { HiOutlineChevronLeft, HiOutlinePrinter, HiOutlineCheckBadge } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const DetailLaporanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const contentRef = useRef<HTMLDivElement>(null);

  const handleCetakPDF = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Berita_Acara_Evaluasi_${id}`,
    onAfterPrint: () => toast.success('Dokumen berhasil disiapkan!'),
  });

  const dataLaporan = {
    proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
    status: 'DISETUJUI KABID',
    catatanStaff: 'Kondisi tanaman tumbuh sangat baik (91.65%), namun karena berada di zona dengan Skor CPI Tinggi (3.45), lahan ini memerlukan intervensi pemeliharaan ketat.'
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">Detail Laporan Evaluasi</h1>
              {dataLaporan.status === 'DISETUJUI KABID' && (
                <span className="bg-emerald-100 text-[#185325] border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                  <HiOutlineCheckBadge className="w-4 h-4" /> Sah / Disetujui
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">{dataLaporan.proyek}</p>
          </div>

          {dataLaporan.status === 'DISETUJUI KABID' && (
            <button 
              onClick={handleCetakPDF}
              className="flex items-center gap-2 px-6 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md transition-colors active:scale-95 shrink-0"
            >
              <HiOutlinePrinter className="w-5 h-5" /> Cetak Berita Acara (PDF)
            </button>
          )}
        </div>

        {/* Info Singkat Laporan di Layar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Catatan Teknis Staff:</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed text-justify">
              {dataLaporan.catatanStaff}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
             <p className="font-medium">
               Dokumen Berita Acara resmi (lengkap dengan persentase tumbuh, dan form tanda tangan) dapat dilihat dengan menekan tombol <strong>Cetak Berita Acara</strong> di atas.
             </p>
          </div>
        </div>

      </div>

      {/* <TemplateBeritaAcaraPDF ref={contentRef} /> */}

    </div>
  );
};

export default DetailLaporanEvaluasiStaff;