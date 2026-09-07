import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectSelector, { type ProjectOption } from './components/ProjectSelector';
import TimelineStep, { type StepData } from './components/TimelineStep';
import HasilEvaluasiCard from './components/HasilEvaluasiCard';
import HentikanPendanaanModal from './components/HentikanPendanaanModal';
import {
  getProgramCsrSayaAPI,
  getHasilEvaluasiCsrAPI,
  hentikanPendanaanCsrAPI,
  type HasilEvaluasiCsr,
} from '@/services/program-csr.service';

// Status program yang sudah masuk tahap pendanaan, jadi layak dimonitor.
const STATUS_DIMONITOR = ['Disetujui', 'Menunggu Pembayaran', 'Berjalan', 'Selesai', 'Dihentikan'];

const mockTimelineData: StepData[] = [
  { id: 1, title: 'Tahap 1: Persiapan Lahan', status: 'Selesai', description: 'Deskripsi Kegiatan' },
  { id: 2, title: 'Tahap 2: Pembibitan & Penanaman', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
  { id: 3, title: 'Tahap 3: Perawatan Pemeliharaan', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
  { id: 4, title: 'Tahap 4: Rehabilitasi Selesai', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
];

const MonitoringProyek: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [hasilEvaluasi, setHasilEvaluasi] = useState<HasilEvaluasiCsr | null>(null);
  const [isLoadingEvaluasi, setIsLoadingEvaluasi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    // Hanya program yang didanai akun ini; kepemilikan divalidasi backend.
    const fetchProjects = async () => {
      try {
        const response = await getProgramCsrSayaAPI();
        console.log(response);
        
        const list = (response || []).filter((item: any) => STATUS_DIMONITOR.includes(item.status));
        setProjects(list);
        if (list.length > 0) setSelectedProject(String(list[0].id));
      } catch (error: any) {
        setProjectError(error.message || 'Gagal memuat daftar proyek rehabilitasi.');
        toast.error(error.message || 'Gagal memuat daftar proyek rehabilitasi.');
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchHasilEvaluasi = useCallback(async (programId: string) => {
    if (!programId) {
      setHasilEvaluasi(null);
      return;
    }

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
    fetchHasilEvaluasi(selectedProject);
  }, [selectedProject, fetchHasilEvaluasi]);

  const handleHentikan = async (alasan: string) => {
    setIsSubmitting(true);
    try {
      const res = await hentikanPendanaanCsrAPI(selectedProject, alasan);
      toast.success(res.message || 'Pendanaan berhasil dihentikan.');
      setIsModalOpen(false);
      setProjects((prev) =>
        prev.map((p) => (String(p.id) === selectedProject ? { ...p, status: 'Dihentikan' } : p))
      );
      await fetchHasilEvaluasi(selectedProject);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghentikan pendanaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span>
        Memuat proyek rehabilitasi...
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-sm text-gray-600">{projectError}</p>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col w-full mx-auto pb-12">

      <ProjectSelector
        projects={projects}
        selectedProject={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      />

      {isLoadingEvaluasi ? (
        <div className="flex justify-center items-center h-32 mb-6 text-[#185325] font-bold">
          <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span>
          Memuat hasil evaluasi...
        </div>
      ) : hasilEvaluasi ? (
        <HasilEvaluasiCard hasil={hasilEvaluasi} onHentikan={() => setIsModalOpen(true)} />
      ) : null}

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

export default MonitoringProyek;
