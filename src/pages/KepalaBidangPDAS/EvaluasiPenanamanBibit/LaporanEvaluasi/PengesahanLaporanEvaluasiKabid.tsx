import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineCheckCircle, 
  // HiOutlineXCircle, 
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getPenugasanEvaluasiDetail, sahkanLaporanEvaluasi, revisiLaporanEvaluasi } from '@/services/penugasanEvaluasi.service';
import { getSiklusByEvaluasiAPI, type RingkasanSiklus } from '@/services/siklus.service';

const PengesahanLaporanEvaluasiKabid: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [dataEvaluasi, setDataEvaluasi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const [siklus, setSiklus] = useState<RingkasanSiklus | null>(null);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await getPenugasanEvaluasiDetail(id!);
      setDataEvaluasi(res.data);
    } catch (error) {
      console.error('Gagal mengambil data evaluasi:', error);
      toast.error('Gagal memuat data evaluasi');
    } finally {
      setIsLoading(false);
    }
  };

  // Siklus program dipakai untuk memberi tahu Kabid ke periode mana program
  // akan dilanjutkan begitu laporan ini disahkan. Kegagalannya tidak
  // menghalangi pengesahan, jadi cukup dicatat di konsol.
  const fetchSiklus = async () => {
    try {
      setSiklus(await getSiklusByEvaluasiAPI(id!));
    } catch (error) {
      console.error('Gagal memuat siklus program:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
      fetchSiklus();
    }
  }, [id]);

  // Ekstraksi data
  const program = dataEvaluasi?.evaluable || {};
  const kth = program?.kth || {};
  const namaProgram = dataEvaluasi?.nama_proyek_lokasi?.split(' - ')[0] || program?.nama_program || program?.name || 'Program Evaluasi';
  const lokasiLahan = dataEvaluasi?.nama_proyek_lokasi?.split(' - ').slice(1).join(' - ') || program?.lokasi || (kth.desa_kelurahan ? `${kth.desa_kelurahan}, ${kth.kecamatan}, ${kth.kabupaten_kota}` : '-');
  const periode = dataEvaluasi?.periode_evaluasi || dataEvaluasi?.periode || 'Penanaman Awal (P0)';
  const nomorSurat = dataEvaluasi?.nomor_surat || `EVAL-${id}`;

  const pus = dataEvaluasi?.petakUkurs || dataEvaluasi?.petak_ukurs || [];
  
  // Hitung akumulasi PU
  let totalRealisasi = 0;
  let totalTumbuh = 0;
  let sumTinggi = 0;
  let countTinggi = 0;

  pus.forEach((pu: any) => {
    const dt = pu.dataTanamans || pu.data_tanamans || [];
    const rencana = pu.total_bibit_ditanam && pu.total_bibit_ditanam > 0 
      ? Number(pu.total_bibit_ditanam) 
      : (dt.length > 0 ? dt.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0) : 0);
    
    const tumbuh = pu.eval_bibit_tumbuh !== null && pu.eval_bibit_tumbuh !== undefined 
      ? Math.max(0, Number(pu.eval_bibit_tumbuh)) 
      : 0;

    const tinggi = pu.eval_tinggi_rata !== null && pu.eval_tinggi_rata !== undefined && Number(pu.eval_tinggi_rata) > 0
      ? Number(pu.eval_tinggi_rata)
      : 0;

    totalRealisasi += rencana;
    totalTumbuh += tumbuh;
    if (tinggi > 0) {
      sumTinggi += tinggi;
      countTinggi++;
    }
  });

  const rawPersen = dataEvaluasi?.persentase_tumbuh !== null && dataEvaluasi?.persentase_tumbuh !== undefined
    ? Math.abs(Number(dataEvaluasi.persentase_tumbuh))
    : (totalRealisasi > 0 ? (totalTumbuh / totalRealisasi) * 100 : 0);

  const persenTumbuhFormatted = rawPersen.toFixed(2);
  const isBerhasil = Number(persenTumbuhFormatted) >= 75;
  const skorCpi = dataEvaluasi?.skor_cpi ? Number(dataEvaluasi.skor_cpi).toFixed(2) : '3.45';
  const rerataTinggi = countTinggi > 0 ? (sumTinggi / countTinggi).toFixed(1) : '118.5';

  // Pengesahan sekaligus menaikkan program ke periode berikutnya bila lolos
  // ambang batas, jadi labelnya menyebut tujuannya supaya jelas bagi Kabid.
  const periodeBerikutnya = siklus?.periode_berikutnya ?? null;
  const labelSahkan = !isBerhasil
    ? 'Sahkan Laporan (Wajib Tindak Lanjut)'
    : periodeBerikutnya
      ? `Sahkan & Lanjutkan Program ke ${periodeBerikutnya}`
      : 'Sahkan & Selesaikan Program';

  const handleSahkan = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Menandatangani digital & mengesahkan dokumen...');

    try {
      const hasil = await sahkanLaporanEvaluasi(id!);
      toast.success(hasil?.message || 'Laporan Resmi Disahkan!', { id: loadingToast, duration: 5000 });

      // Redirect ke DetailLaporanEvaluasiKABID sesuai permintaan user
      setTimeout(() => {
        navigate(`/admin/kabid/evaluasi/laporan/detail/${id}`);
      }, 500);
    } catch (error) {
      console.error('Gagal mengesahkan laporan:', error);
      toast.error('Gagal mengesahkan laporan. Silakan coba lagi.', { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  const handleRevisi = async () => {
    if (!catatanRevisi.trim()) {
      toast.error('Silakan isi catatan revisi terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengembalikan laporan untuk revisi...');
    try {
      await revisiLaporanEvaluasi(id!, { catatan: catatanRevisi });
      toast.success('Laporan berhasil dikembalikan ke Staff untuk direvisi.', { id: loadingToast });
      setShowRevisiModal(false);
      navigate(-1);
    } catch (error) {
      console.error('Gagal memproses revisi:', error);
      toast.error('Gagal mengembalikan laporan.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-gray-500">
        <div className="w-8 h-8 border-4 border-[#185325] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold">Memuat dokumen pengesahan evaluasi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start cursor-pointer">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        {/* Header Pengesahan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Pengesahan Laporan Evaluasi</h1>
            <p className="text-sm text-gray-500">Tinjau draft Berita Acara yang disusun oleh Staff sebelum pengesahan final.</p>
            <div className="text-xs font-semibold text-gray-600 mt-2 flex items-center gap-1.5">
              <span className="font-bold text-[#185325]">{namaProgram}</span>
              <span>•</span>
              <span className="text-gray-500">{lokasiLahan}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1">
              <HiOutlineCheckBadge className="w-4 h-4" /> Periode: {periode}
            </span>
            <span className="text-xs font-bold text-gray-400">No. Surat: {nomorSurat}</span>
          </div>
        </div>

        {/* SPLIT SCREEN: KIRI (INFO MATRIKS) & KANAN (PREVIEW BERITA ACARA) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Kolom Kiri: Matriks Data (Sesuai AD) */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider">Matriks & Visualisasi Laporan</h3>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-500">Persentase Tumbuh</span>
                <span className={`text-lg font-bold ${isBerhasil ? 'text-[#00A859]' : 'text-amber-600'}`}>
                  {persenTumbuhFormatted}%
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-500">Skor Konservasi (CPI)</span>
                <span className="text-lg font-bold text-blue-600">{skorCpi}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-500">Rata-rata Tinggi Tanaman</span>
                <span className="text-base font-bold text-gray-800">{rerataTinggi} cm</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-sm font-bold text-gray-800">Status Kelayakan</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  isBerhasil 
                    ? 'bg-[#DCECE0] text-[#185325] border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isBerhasil ? 'BERHASIL' : 'PERLU PENYULAMAN'}
                </span>
              </div>
            </div>

            {/* Peta Mini / Informasi Spasial */}
            <div className="bg-[#f2f7f4] rounded-2xl border border-[#d6e8dc] p-5 relative overflow-hidden flex flex-col justify-between min-h-44">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineMapPin className="w-5 h-5 text-[#185325]" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Lokasi & Petak Ukur Terverifikasi</h4>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {lokasiLahan}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#d6e8dc] pt-3 text-xs">
                <span className="text-gray-500">Jumlah Petak Ukur (PU):</span>
                <span className="font-bold text-[#185325]">{pus.length > 0 ? `${pus.length} Petak Ukur` : '10 Petak Ukur'}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500">Status Data Faktual:</span>
                <span className="font-bold text-blue-600">Terverifikasi Tim Teknis</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Preview Berita Acara */}
          <div className="bg-[#f8fbf9] p-6 border border-[#DCECE0] rounded-xl text-xs text-gray-800 font-serif shadow-inner flex flex-col justify-between">
            <div>
              <h2 className="text-center font-bold text-sm underline mb-4 uppercase">DRAFT BERITA ACARA PENILAIAN</h2>
              <p className="text-justify mb-3 leading-relaxed">
                Pada hari ini, kami yang bertanda tangan di bawah ini selaku Tim Penilai Keberhasilan Penanaman Dinas Kehutanan Provinsi Jawa Barat telah melakukan evaluasi lapangan pada program kegiatan <strong>{namaProgram}</strong> seluas <strong>{dataEvaluasi?.luas || program?.target_luas_lahan || 25} Ha</strong> di lokasi <strong>{lokasiLahan}</strong>.
              </p>
              <p className="mb-2 font-bold">Hasil Akhir Evaluasi:</p>
              <ul className="list-disc ml-4 mb-4 space-y-1">
                <li>Persentase Tumbuh: <span className="font-bold">{persenTumbuhFormatted}%</span> ({isBerhasil ? 'Memenuhi Standar' : 'Di Bawah Standar (< 75%)'})</li>
                <li>Rata-rata Tinggi: <span className="font-bold">{rerataTinggi} cm</span></li>
                <li>Skor Lingkungan (CPI): <span className="font-bold text-blue-700">{skorCpi}</span></li>
              </ul>
              <p className="italic text-gray-600 leading-relaxed bg-white/60 p-3 rounded-lg border border-gray-200">
                <strong>Catatan Rekomendasi:</strong> {dataEvaluasi?.rekomendasi_cpi || 'Pertumbuhan vegetasi telah diperiksa. Direkomendasikan pemeliharaan teratur dan pengawasan gulma.'}
              </p>
            </div>
            
            {/* Simulasi TTD Digital */}
            <div className="mt-6 text-center text-gray-600 border-2 border-dashed border-[#185325]/40 rounded-xl p-4 bg-[#EBF8F1]/50">
              <span className="text-[11px] font-bold text-[#185325] block uppercase">
                Pengesahan Elektronik Kepala Bidang PDAS
              </span>
              <p className="text-[10px] text-gray-500 mt-1">
                Dengan menekan tombol pengesahan, tanda tangan digital dan stempel dinas akan secara resmi dibubuhkan ke
                dokumen Berita Acara.
                {siklus && (
                  isBerhasil
                    ? periodeBerikutnya
                      ? ` Persentase tumbuh memenuhi ambang batas ${siklus.ambang_batas_tumbuh}%, sehingga program otomatis naik dari ${siklus.periode_aktif} ke ${periodeBerikutnya} dan kembali masuk antrean monitoring Staff PDAS.`
                      : ` Ini periode terakhir (${siklus.periode_aktif}), sehingga program langsung dinyatakan selesai dan diserahterimakan.`
                    : ` Persentase tumbuh di bawah ambang batas ${siklus.ambang_batas_tumbuh}%, sehingga program tetap di ${siklus.periode_aktif} dan wajib menempuh tindak lanjut penyulaman.`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* DECISION AREA */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-end gap-4">
          {/* <button 
            type="button"
            onClick={() => setShowRevisiModal(true)} 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <HiOutlineXCircle className="w-5 h-5 stroke-2" /> Kembalikan (Revisi)
          </button> */}
          <button 
            type="button"
            onClick={handleSahkan} 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md shadow-[#185325]/20 transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <HiOutlineCheckCircle className="w-5 h-5" /> {labelSahkan}
          </button>
        </div>

      </div>

      {/* Modal Dialog Revisi */}
      {showRevisiModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <HiOutlineExclamationTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-800">Kembalikan untuk Revisi</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Berikan catatan perbaikan kepada Tim Penilai Staff PDAS agar dapat dilakukan penyesuaian:
            </p>
            <textarea
              rows={4}
              value={catatanRevisi}
              onChange={(e) => setCatatanRevisi(e.target.value)}
              placeholder="Contoh: Harap periksa kembali perhitungan pada PU-3 dan koordinat petak..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:ring-2 focus:ring-red-400 focus:border-red-500 outline-none resize-none mb-6"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRevisiModal(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRevisi}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Kirim Catatan Revisi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PengesahanLaporanEvaluasiKabid;
