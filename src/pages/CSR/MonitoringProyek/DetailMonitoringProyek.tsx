import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineCalendar } from 'react-icons/hi2';
import TimelineStep, { type StepData } from './components/TimelineStep';
import HasilEvaluasiCard from './components/HasilEvaluasiCard';
import HentikanPendanaanModal from './components/HentikanPendanaanModal';
import {
  getHasilEvaluasiCsrAPI,
  hentikanPendanaanCsrAPI,
  type HasilEvaluasiCsr,
} from '@/services/program-csr.service';

const DetailMonitoringProyek: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hasilEvaluasi, setHasilEvaluasi] = useState<HasilEvaluasiCsr | null>(null);
  const [isLoadingEvaluasi, setIsLoadingEvaluasi] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHasilEvaluasi = useCallback(async (programId: string) => {
    setIsLoadingEvaluasi(true);
    try {
      setHasilEvaluasi(await getHasilEvaluasiCsrAPI(programId));
    } catch (error: any) {
      setHasilEvaluasi(null);
      toast.error(error.message || 'Gagal memuat hasil evaluasi.');
    } finally {
      setIsLoadingEvaluasi(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchHasilEvaluasi(id);
  }, [id, fetchHasilEvaluasi]);

  const handleHentikan = async (alasan: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const res = await hentikanPendanaanCsrAPI(id, alasan);
      toast.success(res.message || 'Pendanaan berhasil dihentikan.');
      setIsModalOpen(false);
      await fetchHasilEvaluasi(id);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghentikan pendanaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage';

  const getTimelineData = (): StepData[] => {
    const docs = hasilEvaluasi?.dokumentasi || [];
    const getDoc = (types: string[]) => docs.find((d: any) => types.includes(d.jenis_dokumentasi));

    const step1Doc = getDoc(['Foto Sebelum']);
    const step2Doc = getDoc(['Proses Penanaman']);
    const step3Doc = getDoc(['Kondisi Lokasi']);
    const step4Doc = getDoc(['Partisipasi Masyarakat', 'Lainnya']);

    return [
      { 
        id: 1, 
        title: 'Tahap 1: Persiapan Lahan', 
        status: step1Doc ? 'Selesai' : 'Belum Mulai', 
        description: step1Doc?.keterangan || 'Menunggu dokumentasi persiapan lahan dari penyuluh.',
        photoUrl: step1Doc ? `${STORAGE_URL}/${step1Doc.file_path}` : undefined,
        date: step1Doc ? new Date(step1Doc.created_at).toLocaleDateString('id-ID') : undefined
      },
      { 
        id: 2, 
        title: 'Tahap 2: Pembibitan & Penanaman', 
        status: step2Doc ? 'Selesai' : 'Belum Mulai', 
        description: step2Doc?.keterangan || 'Menunggu dokumentasi proses penanaman dari penyuluh.',
        photoUrl: step2Doc ? `${STORAGE_URL}/${step2Doc.file_path}` : undefined,
        date: step2Doc ? new Date(step2Doc.created_at).toLocaleDateString('id-ID') : undefined
      },
      { 
        id: 3, 
        title: 'Tahap 3: Perawatan Pemeliharaan', 
        status: step3Doc ? 'Selesai' : 'Belum Mulai', 
        description: step3Doc?.keterangan || 'Menunggu dokumentasi perawatan dan pemeliharaan.',
        photoUrl: step3Doc ? `${STORAGE_URL}/${step3Doc.file_path}` : undefined,
        date: step3Doc ? new Date(step3Doc.created_at).toLocaleDateString('id-ID') : undefined
      },
      { 
        id: 4, 
        title: 'Tahap 4: Rehabilitasi Selesai', 
        status: step4Doc ? 'Selesai' : 'Belum Mulai', 
        description: step4Doc?.keterangan || 'Menunggu dokumentasi penyelesaian rehabilitasi.',
        photoUrl: step4Doc ? `${STORAGE_URL}/${step4Doc.file_path}` : undefined,
        date: step4Doc ? new Date(step4Doc.created_at).toLocaleDateString('id-ID') : undefined
      },
    ];
  };

  const timelineData = getTimelineData();
  const riwayatEvaluasi = hasilEvaluasi?.riwayat_evaluasi || [];

  return (
    <div className="flex flex-col w-full mx-auto pb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin/csr/monitoring-proyek')}
            className="flex items-center text-sm text-gray-500 hover:text-[#185325] transition-colors mb-2"
          >
            <HiArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Proyek
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Monitoring Proyek {hasilEvaluasi?.nama_program ? `- ${hasilEvaluasi.nama_program}` : ''}
          </h1>
        </div>
      </div>

      {isLoadingEvaluasi ? (
        <div className="flex justify-center items-center h-32 mb-6 text-[#185325] font-bold">
          <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span>
          Memuat detail proyek...
        </div>
      ) : hasilEvaluasi ? (
        <>
          <HasilEvaluasiCard hasil={hasilEvaluasi} onHentikan={() => setIsModalOpen(true)} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10 mb-6">
            <div className="mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineCalendar className="w-5 h-5 text-[#185325]" />
                Riwayat Evaluasi (Siklus Berkala)
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Daftar persentase tumbuh berdasarkan periode monitoring dari penyuluh.
              </p>
            </div>
            
            {riwayatEvaluasi.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Belum ada riwayat evaluasi berkala untuk program ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {riwayatEvaluasi.map((rev: any) => (
                  <div key={rev.id} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#185325] text-white font-bold text-sm px-3 py-1.5 rounded-full shrink-0">
                        {rev.periode_evaluasi ? rev.periode_evaluasi.toUpperCase() : 'P?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">
                          Evaluasi Periode {rev.periode_evaluasi || ''}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Dievaluasi pada: {new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mt-1">
                          Status: <span className="text-[#185325]">{rev.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Persentase Tumbuh</div>
                      <div className={`text-xl font-bold ${rev.persentase_tumbuh !== null && rev.persentase_tumbuh < (hasilEvaluasi.ambang_batas_tumbuh || 75) ? 'text-red-600' : 'text-[#185325]'}`}>
                        {rev.persentase_tumbuh !== null ? `${rev.persentase_tumbuh}%` : '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800">Timeline Tahapan Proyek Rehabilitasi</h2>
              <p className="text-sm text-gray-500 mt-1">
                Progress fisik reboisasi berdasarkan verifikasi laporan di sistem.
              </p>
            </div>

            <div className="flex flex-col">
              {timelineData.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  isLast={index === timelineData.length - 1}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-500">
          Gagal memuat detail proyek atau proyek tidak ditemukan.
        </div>
      )}

      <HentikanPendanaanModal
        isOpen={isModalOpen}
        namaProgram={hasilEvaluasi?.nama_program || ''}
        persentaseTumbuh={hasilEvaluasi?.persentase_tumbuh_terakhir ?? null}
        ambangBatas={hasilEvaluasi?.ambang_batas_tumbuh ?? 75}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleHentikan}
      />
    </div>
  );
};

export default DetailMonitoringProyek;
