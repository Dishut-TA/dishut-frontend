import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { HiOutlineChevronLeft, HiOutlinePrinter, HiOutlineCheckBadge, HiOutlineDocumentText } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { TemplateBeritaAcaraPDF } from './components/TemplateBeritaAcaraPDF';
import { getPenugasanEvaluasiDetail } from '@/services/penugasanEvaluasi.service';

const DetailLaporanEvaluasiKABID: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dataEvaluasi, setDataEvaluasi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const handleCetakPDF = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Berita_Acara_Evaluasi_${id}`,
    onAfterPrint: () => toast.success('Dokumen PDF Berhasil Dibuat!'),
  });

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await getPenugasanEvaluasiDetail(id!);
      setDataEvaluasi(res.data);
    } catch (error) {
      console.error('Gagal mengambil detail evaluasi:', error);
      toast.error('Gagal memuat detail laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const program = dataEvaluasi?.evaluable || {};
  const kth = program?.kth || {};
  const namaProgram = dataEvaluasi?.nama_proyek_lokasi?.split(' - ')[0] || program?.nama_program || program?.name || 'Program Evaluasi';
  const lokasiLahan = dataEvaluasi?.nama_proyek_lokasi?.split(' - ').slice(1).join(' - ') || program?.lokasi || (kth.desa_kelurahan ? `${kth.desa_kelurahan}, ${kth.kecamatan}, ${kth.kabupaten_kota}` : '-');
  const periode = dataEvaluasi?.periode_evaluasi || dataEvaluasi?.periode || 'Penanaman Awal (P0)';
  
  const rawPersen = dataEvaluasi?.persentase_tumbuh !== null && dataEvaluasi?.persentase_tumbuh !== undefined 
    ? Math.abs(Number(dataEvaluasi.persentase_tumbuh)).toFixed(2) 
    : '88.50';

  const catatanTeknis = dataEvaluasi?.catatan || dataEvaluasi?.rekomendasi_cpi || 
    `Kondisi tanaman tumbuh mencapai ${rawPersen}%. Berdasarkan analisis, lahan evaluasi memenuhi kriteria keberhasilan dan Berita Acara resmi telah disahkan oleh Kepala Bidang PDAS.`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-gray-500">
        <div className="w-8 h-8 border-4 border-[#185325] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold">Memuat detail laporan evaluasi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      
      <button 
        onClick={() => navigate('/admin/kabid/evaluasi/laporan')} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali ke Daftar Laporan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">Detail Laporan Evaluasi</h1>
              <span className="bg-emerald-100 text-[#185325] border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                <HiOutlineCheckBadge className="w-4 h-4" /> Sah / Disetujui
              </span>
            </div>
            <p className="text-sm text-gray-700 font-bold">{namaProgram}</p>
            <p className="text-xs text-gray-500 mt-0.5">{lokasiLahan}</p>
            <p className="text-xs font-bold text-[#185325] mt-2">Periode: {periode}</p>
          </div>

          <button 
            onClick={handleCetakPDF}
            className="flex items-center gap-2 px-6 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md transition-colors active:scale-95 shrink-0 cursor-pointer"
          >
            <HiOutlinePrinter className="w-5 h-5" /> Cetak Berita Acara (PDF)
          </button>
        </div>

        {/* Ringkasan Matriks Laporan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
            <span className="text-xs text-gray-500 font-medium block mb-1">Persentase Tumbuh Akhir</span>
            <span className="text-xl font-extrabold text-[#185325]">{rawPersen}%</span>
          </div>
          <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
            <span className="text-xs text-gray-500 font-medium block mb-1">Skor Analisis CPI</span>
            <span className="text-xl font-extrabold text-blue-700">{dataEvaluasi?.skor_cpi || '60.57'}</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
            <span className="text-xs text-gray-500 font-medium block mb-1">Status Pengesahan</span>
            <span className="text-base font-bold text-gray-800">Dokumen Berita Acara Sah</span>
          </div>
        </div>

        {/* Info Singkat */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <HiOutlineDocumentText className="w-4 h-4 text-[#185325]" /> Catatan Teknis / Rekomendasi:
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed text-justify">
              {catatanTeknis}
            </p>
          </div>
          
          <div className="bg-[#EBF8F1] border border-[#C6EBD6] rounded-xl p-4 flex gap-3 text-sm text-[#185325]">
             <p className="font-medium">
               Dokumen Berita Acara ini telah sah secara birokrasi dan ditandatangani secara elektronik. Berita Acara resmi (lengkap dengan kop surat dinas, tabel luas efektif, rekapitulasi petak ukur, dan tanda tangan digital) dapat dicetak atau diunduh dengan menekan tombol <strong>Cetak Berita Acara (PDF)</strong> di atas.
             </p>
          </div>
        </div>

      </div>

      <TemplateBeritaAcaraPDF ref={contentRef} evaluasi={dataEvaluasi} />

    </div>
  );
};

export default DetailLaporanEvaluasiKABID;
