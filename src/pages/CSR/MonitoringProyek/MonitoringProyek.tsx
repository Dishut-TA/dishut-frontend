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
          {mockTimelineData.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              isLast={index === mockTimelineData.length - 1}
            />
          ))}
        </div>
      </div>

      <HentikanPendanaanModal
        isOpen={isModalOpen}
        namaProgram={hasilEvaluasi?.nama_program || ''}
        persentaseTumbuh={hasilEvaluasi?.persentase_tumbuh ?? null}
        ambangBatas={hasilEvaluasi?.ambang_batas_tumbuh ?? 75}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleHentikan}
      />

    </div>
  );
};

export default MonitoringProyek;
