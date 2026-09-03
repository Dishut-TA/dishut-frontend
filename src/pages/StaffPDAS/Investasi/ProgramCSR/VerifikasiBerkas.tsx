import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, HiOutlineUser, HiOutlineMapPin, 
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBuildingOffice, 
  HiOutlineClipboardDocumentCheck, HiCheck, HiXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI, updateProgramCsrStatusAPI } from '@/services/program-csr.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const InfoItem = ({ label, value, icon, iconColor = "text-gray-400", isLink = false, href = "" }: any) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <div className={`flex items-center gap-2 text-sm text-gray-800 ${isLink ? 'italic hover:text-[#185325] hover:underline cursor-pointer font-medium' : 'font-bold'}`}>
      {icon && <span className={iconColor}>{icon}</span>}
      {isLink ? <a href={href} target="_blank" rel="noopener noreferrer">{value || 'Lihat File'}</a> : (value || '-')}
    </div>
  </div>
);

const VerifikasiBerkasCSR: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rekomendasiMitra, setRekomendasiMitra] = useState('');
  const [rekomendasiIntervensi, setRekomendasiIntervensi] = useState('');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getProgramCsrByIdAPI(id);
          const responseData = res.data || res.payload || res;
          setData(responseData);
          // Set initial form state jika data sudah ada (saat read-only)
          setRekomendasiMitra(responseData.rekomendasi_mitra || '');
          setRekomendasiIntervensi(responseData.rekomendasi_intervensi || '');
          setCatatan(responseData.catatan_staff || '');
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail pengajuan CSR.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent, isApproved: boolean) => {
    e.preventDefault();
    
    if (isApproved && (!rekomendasiMitra || !rekomendasiIntervensi)) {
      return toast.error('Silakan lengkapi form rekomendasi terlebih dahulu.');
    }
    if (!isApproved && !catatan) {
      return toast.error('Catatan/Alasan penolakan wajib diisi.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses verifikasi...');

    const payload = {
      status: isApproved ? 'Terverifikasi' : 'Perlu Revisi',
      catatan_staff: catatan,
      rekomendasi_mitra: rekomendasiMitra,
      rekomendasi_intervensi: rekomendasiIntervensi
    };

    try {
      await updateProgramCsrStatusAPI(id!, payload);
      toast.success(isApproved ? 'Berkas diteruskan ke Kepala PDAS!' : 'Berkas dikembalikan ke KTH.', { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses berkas.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (angka: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  const getFileName = (path: string) => path ? path.split('/').pop() : null;

  if (isLoading) return <div className="flex justify-center items-center h-48 text-[#185325] font-bold"><span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> Memuat...</div>;
  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const isMenungguVerifikasi = data.status === 'Menunggu Verifikasi';

  return (
    <div className="flex flex-col w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline self-start transition-colors cursor-pointer mb-6">
        <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="mb-10 border-b border-gray-100 pb-6">
          <span className="inline-block px-3 py-1.5 bg-[#EBF8F1] text-[#185325] text-[10px] font-bold rounded-md mb-3 border border-[#C6EBD6]">
            CSR-{data.id}
          </span>
          <h1 className="text-2xl font-bold text-gray-800">Lembar Verifikasi CSR</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8 pb-10 border-b border-gray-100">
          <InfoItem label="Kelompok Tani Hutan" value={data.kth?.nama} icon={<HiOutlineUser className="w-4 h-4" />} iconColor="text-[#185325]" />
          <InfoItem label="Nama Ketua KTH" value={data.kth?.ketua} icon={<HiOutlineUser className="w-4 h-4" />} />
          <InfoItem label="File Proposal" value={getFileName(data.proposal_file_path)} isLink href={`${STORAGE_BASE_URL}${data.proposal_file_path}`} />
          <InfoItem label="Lokasi Lahan" value={data.lokasi || (data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '')} icon={<HiOutlineMapPin className="w-4 h-4" />} iconColor="text-[#185325]" />
          <InfoItem label="Nama Program" value={data.nama_program} />
          <InfoItem label="Anggaran Diajukan" value={formatRupiah(data.anggaran)} />
          <InfoItem label="Luas Lahan" value={`${data.target_luas_lahan} Ha`} />
          <InfoItem label="Jenis Pohon" value={data.jenis_tanaman} />
          <InfoItem label="Jumlah Bibit" value={`${data.jumlah_bibit} Bibit`} />
        </div>

        <div className="pt-8 pb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Rencana Kegiatan Rehabilitasi</h3>
          <p className="text-sm text-gray-500 leading-relaxed text-justify">{data.deskripsi_rencana || '-'}</p>
        </div>

        {isMenungguVerifikasi ? (
          <form className="animate-in fade-in duration-300 border-t border-gray-100 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#185325] mb-2"><HiOutlineBuildingOffice className="w-5 h-5" /> Rekomendasikan Mitra CSR</label>
                <select value={rekomendasiMitra} onChange={(e) => setRekomendasiMitra(e.target.value)} className="w-full bg-white border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-700 outline-none">
                  <option value="" disabled>-- Pilih Rekomendasi Mitra --</option>
                  <option value="PT Pertamina (Persero)">PT Pertamina (Persero)</option>
                  <option value="Bank BJB">Bank BJB</option>
                  <option value="PT Indomaret">PT Indomaret</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#185325] mb-2"><HiOutlineClipboardDocumentCheck className="w-5 h-5" /> Rekomendasi Intervensi</label>
                <select value={rekomendasiIntervensi} onChange={(e) => setRekomendasiIntervensi(e.target.value)} className="w-full bg-white border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-700 outline-none">
                  <option value="" disabled>-- Pilih Rekomendasi Intervensi --</option>
                  <option value="Agroforesty">Agroforesty</option>
                  <option value="Silvopastura">Silvopastura</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-2">Catatan Staff PDAS</label>
              <textarea rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Ketik persetujuan administrasi atau rincian perbaikan jika dokumen ditolak..." className="w-full bg-white border border-gray-300 rounded-3xl px-4 py-3 text-sm text-gray-800 outline-none resize-none" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-6">
              <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting} className="px-8 py-3.5 bg-white border border-gray-300 text-gray-600 font-bold rounded-full hover:bg-gray-50 flex gap-2"><HiOutlineXCircle className="w-5 h-5" /> Tolak / Minta Revisi</button>
              <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting} className="px-8 py-3.5 bg-[#185325] text-white font-bold rounded-full hover:bg-[#123d1c] flex gap-2"><HiOutlineCheckCircle className="w-5 h-5" /> Setuju & Teruskan</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 border-t border-gray-100 pt-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-gray-800">Catatan Staff PDAS</h4>
              <p className="text-sm text-gray-500 text-justify leading-relaxed">{data.catatan_staff || '-'}</p>
            </div>
            {data.rekomendasi_mitra && (
              <>
                <div className="flex flex-col gap-1.5"><h4 className="text-sm font-bold text-gray-800">Rekomendasi Mitra CSR</h4><p className="text-sm text-gray-600">{data.rekomendasi_mitra}</p></div>
                <div className="flex flex-col gap-1.5"><h4 className="text-sm font-bold text-gray-800">Rekomendasi Intervensi</h4><p className="text-sm text-gray-600">{data.rekomendasi_intervensi}</p></div>
              </>
            )}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-bold text-gray-800">Status :</span>
              <div className={`flex items-center gap-1.5 text-sm font-bold ${data.status.includes('Ditolak') ? 'text-red-600' : 'text-[#185325]'}`}>
                {data.status} {data.status.includes('Ditolak') ? <HiXMark className="w-4 h-4" /> : <HiCheck className="w-4 h-4" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifikasiBerkasCSR;