import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineChevronLeft, HiOutlineUser, HiOutlineMapPin, HiOutlineXMark, HiOutlineCheckCircle, HiOutlineArrowRight } from "react-icons/hi2";
import toast from "react-hot-toast";
import { getProgramCsrByIdAPI, updateProgramCsrStatusAPI } from '@/services/program-csr.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const DetailTinjauProposal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [data, setData] = useState<any>(null);
  const [tanggapan, setTanggapan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getProgramCsrByIdAPI(id);
          setData(res.data || res.payload || res);
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail proposal.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAction = async (isApproved: boolean) => {
    if (!tanggapan.trim()) {
      return toast.error("Harap isi tanggapan resmi perusahaan.");
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengirim tanggapan perusahaan...');
    try {
      // PERBAIKAN ALUR: Jika disetujui, statusnya 'Menunggu Pembayaran' bukan langsung 'Selesai'
      const newStatus = isApproved ? 'Menunggu Pembayaran' : 'Ditolak';
      await updateProgramCsrStatusAPI(id!, { status: newStatus, tanggapan_perusahaan: tanggapan });
      
      toast.success(isApproved ? 'Proposal Disetujui! Lanjutkan ke pembayaran.' : 'Proposal Ditolak.', { id: loadingToast });
      
      if (isApproved) {
        navigate(`/admin/csr/pendanaan/${id}`);
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim tanggapan.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (angka: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  const getFileName = (path: string) => path ? path.split('/').pop() : null;

  if (isLoading) return <div className="flex justify-center items-center h-48 text-[#185325]"><span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3 border-[#185325]"></span> Memuat...</div>;
  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const isMenungguMitra = data.status === 'Menunggu Persetujuan';
  const isMenungguPembayaran = data.status === 'Menunggu Pembayaran';

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#DCECE0] text-[#185325] text-xs font-bold rounded-md mb-3">P-CSR-{new Date(data.created_at).getFullYear()}-{String(data.id).padStart(3, '0')}</span>
          <h1 className="text-2xl font-bold text-gray-800 uppercase">Tinjau Pengajuan CSR</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">KTH Pengusul</span><div className="font-bold text-sm"><HiOutlineUser className="w-4 h-4 inline mr-1" />{data.kth?.nama}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Nama Ketua KTH</span><div className="font-bold text-sm"><HiOutlineUser className="w-4 h-4 inline mr-1" />{data.kth?.ketua}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">File Proposal</span><div className="font-bold text-sm italic text-[#185325]"><a href={`${STORAGE_BASE_URL}${data.proposal_file_path}`} target="_blank" rel="noreferrer">{getFileName(data.proposal_file_path) || 'Lihat File'}</a></div></div>
          
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Lokasi Lahan</span><div className="font-bold text-sm"><HiOutlineMapPin className="w-4 h-4 inline mr-1 text-[#185325]" />{data.lokasi || (data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '')}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Nama Program</span><div className="font-bold text-sm">{data.nama_program}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Alokasi Anggaran</span><div className="font-bold text-sm">{formatRupiah(data.anggaran)}</div></div>

          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Luas Lahan</span><div className="font-bold text-sm">{data.target_luas_lahan} Ha</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Jenis Pohon</span><div className="font-bold text-sm">{data.jenis_tanaman}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Jumlah Bibit</span><div className="font-bold text-sm">{data.jumlah_bibit} Bibit</div></div>
        </div>

        <div className="pt-8 pb-8 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Rencana Kegiatan</h3>
          <p className="text-sm text-gray-500 text-justify">{data.deskripsi_rencana || '-'}</p>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div><h1 className="text-sm font-bold text-gray-800 mb-2">Rekomendasi Intervensi Dinas</h1><p className="text-sm text-slate-500">{data.rekomendasi_intervensi || '-'}</p></div>
          <div><h1 className="text-sm font-bold text-[#185325] mb-2">Kepada Yth:</h1><p className="text-sm font-bold text-[#185325]">{data.rekomendasi_mitra || 'Seluruh Mitra CSR'}</p></div>
        </div>

        {isMenungguMitra ? (
          <div className="pt-4 flex-1">
            <label className="block text-sm font-bold text-gray-800 mb-3">Tanggapan Resmi Perusahaan <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea value={tanggapan} onChange={(e) => setTanggapan(e.target.value)} placeholder="Tuliskan tanggapan atau catatan persetujuan pendanaan CSR di sini..." maxLength={500} className="w-full h-32 p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] transition-colors resize-none" />
              <div className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-medium">{tanggapan.length}/500</div>
            </div>
            
            <div className="pt-8 flex flex-col-reverse sm:flex-row justify-end items-center gap-4">
              <button disabled={isSubmitting} onClick={() => handleAction(false)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors"><HiOutlineXMark className="w-4 h-4" /> Tolak Proposal</button>
              <button disabled={isSubmitting} onClick={() => handleAction(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-sm"><HiOutlineCheckCircle className="w-5 h-5" /> Setuju Pendanaan</button>
            </div>
          </div>
        ) : (
          <div className="pt-4 flex-1 border-t border-gray-100">
             <h1 className="text-sm font-bold text-gray-800 mb-2">Tanggapan Resmi Perusahaan Anda</h1>
             <p className="text-sm text-gray-500 text-justify mb-6">{data.tanggapan_perusahaan || '-'}</p>
             
             <div className="flex items-center gap-4">
               <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block ${data.status.includes('Ditolak') ? 'bg-red-100 text-red-600' : isMenungguPembayaran ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                 Status: {data.status}
               </span>

               {isMenungguPembayaran && (
                 <button 
                   onClick={() => navigate(`/admin/csr/pendanaan/${data.id}`)}
                   className="flex items-center gap-2 px-5 py-1.5 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm"
                 >
                   Lanjutkan Pembayaran <HiOutlineArrowRight className="w-4 h-4" />
                 </button>
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DetailTinjauProposal;