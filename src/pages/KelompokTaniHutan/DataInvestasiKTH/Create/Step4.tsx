import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineArrowLeft, HiCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createKthProgramAPI } from '@/services/investasi.service';
import type { InvestasiFormState } from './index';

interface StepProps {
  data: InvestasiFormState;
  onNext: () => void;
  onPrev?: () => void;
}

const Step4: React.FC<StepProps> = ({ data, onPrev }) => {
  const navigate = useNavigate();
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedMilestones = showAllMilestones ? data.milestones : data.milestones.slice(0, 2);
  const hasMoreMilestones = data.milestones.length > 2;

  const hitungPersentaseInvestor = (persentaseKTH: string) => {
    const kth = parseFloat(persentaseKTH) || 0;
    return `${100 - kth}%`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengirim pengajuan investasi...');

    try {
      const mappedDokumens = data.dokumen
        .filter((doc) => doc.file !== null)
        .map((doc: any) => ({
          tipe_dokumen: doc.name, 
          file_url: doc.file ? URL.createObjectURL(doc.file) : "https://example.com/default-doc.pdf"
        }));

      const payload = {
        gambar: data.coverFile ? URL.createObjectURL(data.coverFile) : "https://example.com/cover.jpg",
        nama_kth: data.namaKTH || "Nama KTH",
        nama_program: data.namaInvestasi,
        kategori_usaha: "Kehutanan",
        target_dana: Number(data.targetFunding.replace(/\D/g, '')) || 0,
        persentase_keuntungan: parseFloat(data.persentase) || 0,
        periode_kontrak_bulan: 12,
        batas_waktu_pengumpulan: data.batasWaktu,
        deskripsi: data.deskripsi,
        milestones: data.milestones.map(m => ({
          judul_milestone: m.nama,
          deskripsi: m.deskripsi || 'Deskripsi milestone',
          target_tanggal: m.batas
        })),
        dokumens: mappedDokumens.length > 0 ? mappedDokumens : [
          { tipe_dokumen: "Proposal", file_url: "https://example.com/proposal.pdf" }
        ]
      };

      await createKthProgramAPI(payload);
      toast.success('Program investasi berhasil diajukan!', { id: loadingToast });
      navigate('/admin/kth/investasi/data');
    } catch (error: any) {
      const errorPayload = error.response?.payload || error.payload;
      if (errorPayload && typeof errorPayload === 'object') {
        const firstKey = Object.keys(errorPayload)[0];
        const errorMessages = errorPayload[firstKey];
        const readableMsg = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
        toast.error(`Validasi Gagal: ${readableMsg}`, { id: loadingToast, duration: 5000 });
      } else {
        toast.error(error.message || 'Gagal mengajukan investasi.', { id: loadingToast });
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="animate-in fade-in duration-300 w-full mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">Review Pengajuan Investasi</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-56 h-36 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-gray-400 text-xs overflow-hidden border border-gray-200">
          {data.coverFile ? (
            <img src={URL.createObjectURL(data.coverFile)} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <span>Tidak ada cover</span>
          )}
        </div>
        <div className="flex flex-col justify-center gap-2 text-sm w-full">
          <h2 className="text-xl font-bold text-gray-800">{data.namaInvestasi || 'Proyek Pembangunan...'}</h2>
          <div className="grid grid-cols-[140px_auto] gap-y-2 mt-2 font-medium text-xs">
            <span className="text-gray-500">Nama KTH</span> 
            <span className="text-[#185325] font-bold">: {data.namaKTH || 'Rimba Nusantara'}</span>
            
            <span className="text-gray-500">Target Dana</span> 
            <span className="text-[#185325] font-bold">: Rp. {data.targetFunding || '0'}</span>
            
            <span className="text-gray-500">Persentase Keuntungan (KTH)</span> 
            <span className="text-gray-800 font-bold">: {data.persentase || '0'}%</span>
            
            <span className="text-gray-500">Batas Waktu</span> 
            <span className="text-orange-500 font-bold">: {data.batasWaktu || '-'}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wider">Deskripsi Proyek</h4>
        <p className="text-sm text-gray-600 leading-relaxed text-justify bg-gray-50 p-4 rounded-xl">
          {data.deskripsi || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-2">Pembagian Keuntungan</h3>
        <div className="text-sm font-bold text-gray-800 space-y-2 bg-gray-50 p-4 rounded-xl">
          <div className="flex"><span className="w-28 text-gray-500 font-medium">KTH</span> <span>: {data.persentase || '0'}%</span></div>
          <div className="flex"><span className="w-28 text-gray-500 font-medium">Investor</span> <span>: {hitungPersentaseInvestor(data.persentase)}</span></div>
        </div>
      </div>

      <div className="mb-8 border-b border-gray-100 pb-8">
        <h3 className="font-bold text-gray-800 mb-6">Milestone ({data.milestones.length})</h3>
        
        {displayedMilestones.map((m, idx) => (
          <div key={idx} className={`mb-6 last:mb-0 text-sm bg-gray-50 p-4 rounded-xl ${idx !== 0 ? 'mt-4' : ''}`}>
            <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Nama Milestone</span> <span className="w-4 shrink-0">:</span> <span className="font-bold text-gray-800">{m.nama}</span></div>
            <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Batas Milestone</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800">{m.batas}</span></div>
            <div className="flex"><span className="w-36 shrink-0 text-gray-500">Deskripsi</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-500 leading-relaxed text-justify">{m.deskripsi || '-'}</span></div>
          </div>
        ))}
        
        {hasMoreMilestones && (
          <button onClick={() => setShowAllMilestones(!showAllMilestones)} className="flex items-center justify-center gap-2 w-full mt-4 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
            {showAllMilestones ? 'Tutup Milestone' : 'Lihat Milestone Lainnya'} 
            {showAllMilestones ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="mb-12">
        <h3 className="font-bold text-gray-800 mb-4">Dokumen Pendukung ({data.dokumen.filter(d => d.file).length})</h3>
        <div className="text-sm space-y-3">
          {data.dokumen.map((doc, idx) => (
          <div key={idx} className="flex">
            <span className="w-56 shrink-0 text-gray-500">{doc.name}</span>
            <span className="w-4 shrink-0">:</span>
            <span className="font-bold text-gray-800 truncate">
              {doc.file ? doc.file.name : 'Belum diunggah'}
            </span>
          </div>
        ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button disabled={isSubmitting} onClick={onPrev} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-[#185325] text-[#185325] hover:bg-gray-50 text-sm font-bold rounded-full transition-colors cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        <button disabled={isSubmitting} onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-50">
          {isSubmitting ? 'Menyimpan...' : 'Simpan & Ajukan Investasi'} <HiCheck className="w-5 h-5 stroke-2" />
        </button>
      </div>
    </div>
  );
};

export default Step4;