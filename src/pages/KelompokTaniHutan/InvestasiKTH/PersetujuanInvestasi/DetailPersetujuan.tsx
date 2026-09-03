import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getDetailPersetujuanInvestorAPI, updateStatusPersetujuanInvestorAPI } from '@/services/investasi.service';

const DetailPersetujuan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await getDetailPersetujuanInvestorAPI(id!);
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail persetujuan.');
    } finally {
      setLoading(false);
    }
  };

  const handleTolak = async () => {
    if (!id) return;
    try {
      await updateStatusPersetujuanInvestorAPI(id, 'DITOLAK');
      toast.error('Pengajuan Investasi Ditolak');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menolak pengajuan.');
    }
  };

  const handleTerima = async () => {
    if (!id) return;
    try {
      await updateStatusPersetujuanInvestorAPI(id, 'DITERIMA');
      toast.success('Pengajuan Investasi Diterima!');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menerima pengajuan.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Memuat...</div>;
  }

  if (!data) {
    return <div className="text-center py-12">Data tidak ditemukan.</div>;
  }

  const projectData = {
    title: data.program?.nama_program || 'Proyek Tidak Ditemukan',
    kth: data.program?.nama_kth || '-',
    targetFunding: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.program?.target_dana || 0),
    persentase: `${data.persentase_kepemilikan || 0}%`,
    tenggatWaktu: data.program?.batas_waktu_pengumpulan ? new Date(data.program.batas_waktu_pengumpulan).toLocaleDateString('id-ID') : '-',
    image: data.program?.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    deskripsi: data.program?.deskripsi || '-',
  };

  const investorData = {
    nama: data.nama || '-',
    email: data.email || '-',
    noTelepon: data.no_telp || '-',
    dokumen: data.dokumen_url ? 'Lihat Dokumen' : 'Tidak Ada Dokumen'
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] transition-colors self-start">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

        <h1 className="text-2xl font-bold text-gray-800">Detail Investasi</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-56 h-36 bg-gray-200 rounded-xl overflow-hidden shrink-0">
            <img src={projectData.image} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-2 text-sm w-full">
            <h2 className="text-xl font-bold text-gray-800">{projectData.title}</h2>
            <div className="grid grid-cols-[140px_auto] gap-y-2 mt-2 font-medium text-xs">
              <span className="text-gray-500">KTH</span> <span className="text-[#185325] font-bold">: {projectData.kth}</span>
              <span className="text-gray-500">Target Funding</span> <span className="text-[#185325] font-bold">: {projectData.targetFunding}</span>
              <span className="text-gray-500">Persentase Keuntungan</span> <span className="text-gray-800 font-bold">: {projectData.persentase}</span>
              <span className="text-gray-500">Tenggat Waktu</span> <span className="text-orange-500 font-bold">: {projectData.tenggatWaktu}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 leading-relaxed text-justify">{projectData.deskripsi}</p>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-2">Pembagian Keuntungan</h3>
          <p className="text-sm text-gray-500 text-justify leading-relaxed mb-4">{projectData.deskripsi}</p>
          <div className="text-sm font-bold text-gray-800 space-y-2">
            <div className="flex"><span className="w-24 text-gray-500 font-medium">KTH</span> <span>: 60%</span></div>
            <div className="flex"><span className="w-24 text-gray-500 font-medium">Investor</span> <span>: 40%</span></div>
          </div>
        </div>

        <div className="mb-8 border-b border-gray-100 pb-8">
          <h3 className="font-bold text-gray-800 mb-6">Milestone</h3>
          {[1, 2].map((num) => (
            <div key={num} className={`mb-6 last:mb-0 text-sm ${num !== 1 ? 'pt-6 border-t border-gray-50' : ''}`}>
              <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Nama Milestone</span> <span className="w-4 shrink-0">:</span> <span className="font-bold text-gray-800">Milestone {num}</span></div>
              <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Batas Milestone</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800">22/04/2024</span></div>
              <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Status</span> <span className="w-4 shrink-0">:</span> <span className="font-bold text-gray-500">Belum Dimulai ⏳</span></div>
              <div className="flex mb-1.5"><span className="w-36 shrink-0 text-gray-500">Dokumen Milestone</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800">-</span></div>
              <div className="flex"><span className="w-36 shrink-0 text-gray-500">Deskripsi</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-500 leading-relaxed text-justify">Lorem ipsum dolor sit amet consectetur. Faucibus faucibus urna nulla amet at nascetur...</span></div>
            </div>
          ))}
        </div>

        <div className="mb-8 border-b border-gray-100 pb-8">
          <h3 className="font-bold text-gray-800 mb-4">Dokumen Pendukung</h3>
          <div className="text-sm space-y-3">
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">Dokumen Perjanjian Investasi</span> <span className="w-4 shrink-0">:</span> <span className="font-bold underline text-gray-800 hover:text-[#185325] cursor-pointer">PerjanjianInvestor.pdf</span></div>
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">Dokumen Rencana Bisnis</span> <span className="w-4 shrink-0">:</span> <span className="font-bold underline text-gray-800 hover:text-[#185325] cursor-pointer">RencanaProyekPembangunanEkowisata.pdf</span></div>
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">Template Perjanjian Investor</span> <span className="w-4 shrink-0">:</span> <span className="font-bold underline text-gray-800 hover:text-[#185325] cursor-pointer">DokumenPerjanjian.pdf</span></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Informasi Calon Investor</h3>
          <div className="text-sm space-y-3">
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">Nama</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800 font-medium">{investorData.nama}</span></div>
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">Email</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800 font-medium">{investorData.email}</span></div>
            <div className="flex"><span className="w-56 shrink-0 text-gray-500">No Telepon</span> <span className="w-4 shrink-0">:</span> <span className="text-gray-800 font-medium">{investorData.noTelepon}</span></div>
            <div className="flex"><span className="w-56 shrink-0 text-[#FF4949] font-bold">Dokumen Proposal Investasi</span> <span className="w-4 shrink-0">:</span> {data.dokumen_url ? <a href={data.dokumen_url} target="_blank" rel="noreferrer" className="font-bold underline text-gray-800 hover:text-[#185325] cursor-pointer">{investorData.dokumen}</a> : <span className="font-bold text-gray-800">{investorData.dokumen}</span>}</div>
          </div>
        </div>

        <div className="mt-12">
          <label className="flex items-start gap-3 cursor-pointer group mb-6">
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input 
                type="checkbox" 
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#185325] checked:border-[#185325] transition-colors cursor-pointer"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
              Dengan menyetujui pengajuan investasi ini, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju dengan semua syarat dan ketentuan yang berlaku. Anda menyadari sepenuhnya bahwa keputusan ini dibuat berdasarkan informasi yang telah Anda terima dan pertimbangkan secara matang.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleTolak}
              disabled={!isAgreed || data.status_persetujuan !== 'MENUNGGU' && data.status_persetujuan !== 'MENUNGGU_REVISI'}
              className={`flex-1 py-3.5 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-sm ${isAgreed && (data.status_persetujuan === 'MENUNGGU' || data.status_persetujuan === 'MENUNGGU_REVISI') ? 'bg-[#FF0000] hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed opacity-70'}`}
            >
              Tolak Pengajuan Investasi
            </button>
            <button 
              onClick={handleTerima}
              disabled={!isAgreed || data.status_persetujuan !== 'MENUNGGU' && data.status_persetujuan !== 'MENUNGGU_REVISI'}
              className={`flex-1 py-3.5 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-sm ${isAgreed && (data.status_persetujuan === 'MENUNGGU' || data.status_persetujuan === 'MENUNGGU_REVISI') ? 'bg-[#185325] hover:bg-[#123d1c]' : 'bg-gray-300 cursor-not-allowed opacity-70'}`}
            >
              Terima Pengajuan Investasi
            </button>
          </div>
        </div>
    </div>
  );
};

export default DetailPersetujuan;