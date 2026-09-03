import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import MilestoneSection from './components/MilestoneSection';
import RevisionModal from './components/RevisionModal';
import ApprovalModal from './components/ApprovalModal';
import toast from 'react-hot-toast';
import { verifyProgramBupmAPI } from '@/services/investasi.service'; 

const DetailInvestasiKABIDBUPM: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isValidasiMode = location.pathname.includes('/validasi');
  
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programFromState = location.state?.program;

  const docLabels = ['Dokumen Perjanjian Investasi', 'Dokumen Rencana Bisnis', 'Template Perjanjian Investor'];
  const defaultFileNames = ['Proposal_Bisnis.pdf', 'Proyeksi_Keuangan.pdf', 'Perizinan_Usaha.pdf'];

  const projectData = {
    id: programFromState?.id || '',
    title: programFromState?.nama_program || 'Proyek Pembangunan Ekowisata...',
    kth: programFromState?.user_id || 'KTH Cikole',
    targetFunding: programFromState ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(programFromState.target_dana) : 'Rp. 0',
    persentase: programFromState ? `${programFromState.persentase_keuntungan}%` : '40%',
    tenggatWaktu: programFromState ? new Date(programFromState.batas_waktu_pengumpulan).toLocaleDateString('id-ID') : '-',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    deskripsiUmum: programFromState?.deskripsi || 'Tidak ada deskripsi.',
    pembagianKeuntungan: {
      kth: programFromState ? `${programFromState.persentase_keuntungan}%` : '60%',
      investor: programFromState ? `${100 - programFromState.persentase_keuntungan}%` : '40%'
    },
    milestones: programFromState?.milestones?.map((m: any, i: number) => ({
      id: i + 1,
      nama: m.judul_milestone,
      batas: m.target_tanggal,
      status: m.status === 'COMPLETED' ? 'Tercapai' : 'Belum Dimulai',
      dokumen: '-',
      deskripsi: m.deskripsi
    })) || [],
    dokumen: programFromState?.dokumens?.map((_d: any, idx: number) => ({
      label: docLabels[idx] || 'Dokumen Pendukung',
      file: defaultFileNames[idx] || `Dokumen_${idx + 1}.pdf`
    })) || []
  };

  const handleRevisionSubmit = async (alasan: string) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengirim permintaan revisi...');
    try {
      await verifyProgramBupmAPI(projectData.id, {
        status: 'REVISION', 
        catatan_verifikasi: `Revisi dari Kabid BUPM: ${alasan}`
      });
      toast.success('Proposal dikembalikan untuk revisi.', { id: loadingToast });
      setShowRevisionModal(false);
      navigate('/admin/kabid/bupm/data-investasi');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim revisi.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovalSubmit = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Mempublikasikan investasi...');
    try {
      await verifyProgramBupmAPI(projectData.id, {
        status: 'ACTIVE', // Status akhir yang tayang di web publik
        catatan_verifikasi: 'Disetujui dan dipublikasikan oleh Kabid BUPM.' 
      });
      toast.success('Investasi berhasil di-publish ke publik!', { id: loadingToast });
      setShowApprovalModal(false);
      navigate('/admin/kabid/bupm/data-investasi');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mempublikasikan investasi.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline self-start cursor-pointer">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        {isValidasiMode ? 'Validasi Akhir Publikasi Investasi' : 'Detail Data Investasi'}
      </h1>
      
      {/* ... (Render projectData seperti image, deskripsi, persentase, milestone, dokumen sama persis dengan file sebelumnya) ... */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img src={projectData.image} alt="Project" className="w-full md:w-64 h-40 object-cover rounded-xl shadow-sm border border-gray-200" />
        <div className="flex flex-col justify-center gap-2 text-sm w-full">
          <h2 className="text-xl font-bold text-gray-800">{projectData.title}</h2>
          <div className="grid grid-cols-[160px_auto] gap-y-2 mt-2 font-medium">
            <span className="text-gray-500">Nama KTH</span>
            <span className="text-[#185325] font-bold">: {projectData.kth}</span>
            <span className="text-gray-500">Target Funding</span>
            <span className="text-[#185325] font-bold">: {projectData.targetFunding}</span>
            <span className="text-gray-500">Persentase Keuntungan</span>
            <span className="text-gray-800">: {projectData.persentase}</span>
            <span className="text-gray-500">Tenggat Waktu</span>
            <span className="text-orange-500 font-bold">: {projectData.tenggatWaktu}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wider">Deskripsi Proyek</h4>
        <p className="text-sm text-gray-600 leading-relaxed text-justify bg-gray-50 p-4 rounded-xl border border-gray-100">
          {projectData.deskripsiUmum}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-2">Pembagian Keuntungan</h3>
        <div className="text-sm font-bold text-gray-800 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex"><span className="w-28 text-gray-500 font-medium">KTH</span> <span>: {projectData.pembagianKeuntungan.kth}</span></div>
          <div className="flex"><span className="w-28 text-gray-500 font-medium">Investor</span> <span>: {projectData.pembagianKeuntungan.investor}</span></div>
        </div>
      </div>

      <MilestoneSection milestones={projectData.milestones} />

      <div className="mb-12">
        <h3 className="font-bold text-gray-800 mb-4">Dokumen Pendukung</h3>
        <div className="text-sm space-y-3">
          {projectData.dokumen.map((doc: any, idx: number) => (
            <div key={idx} className="flex">
              <span className="w-56 shrink-0 text-gray-500">{doc.label}</span>
              <span className="w-4 shrink-0">:</span>
              <span className="font-bold underline text-gray-800 cursor-pointer hover:text-[#185325]">
                {doc.file}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isValidasiMode && (
        <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8 mt-8">
          <button 
            disabled={isSubmitting}
            onClick={() => setShowRevisionModal(true)}
            className="flex-1 py-3.5 bg-[#FF0000] hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            Tolak dan Revisi
          </button>
          <button 
            disabled={isSubmitting}
            onClick={() => setShowApprovalModal(true)}
            className="flex-1 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            Publikasikan ke Publik (Aktif)
          </button>
        </div>
      )}

      {isValidasiMode && (
        <>
          <RevisionModal 
            isOpen={showRevisionModal} 
            onClose={() => setShowRevisionModal(false)} 
            onSubmit={handleRevisionSubmit} 
          />
          <ApprovalModal 
            isOpen={showApprovalModal} 
            onClose={() => setShowApprovalModal(false)} 
            onConfirm={handleApprovalSubmit} 
          />
        </>
      )}
    </div>
  );
};

export default DetailInvestasiKABIDBUPM;