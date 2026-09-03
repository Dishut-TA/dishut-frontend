import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineUser, HiOutlineMapPin, HiOutlineCheckCircle } from 'react-icons/hi2';
import { HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI, updateProgramCsrStatusAPI } from '@/services/program-csr.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const VerifikasiCSR: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
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

  const handleAction = async (newStatus: string) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses persetujuan Kepala Bidang...');
    try {
      await updateProgramCsrStatusAPI(id!, { status: newStatus });
      toast.success(`Proposal diupdate menjadi: ${newStatus}`, { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses proposal.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (angka: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  const getFileName = (path: string) => path ? path.split('/').pop() : null;

  if (isLoading) return <div className="flex justify-center h-48 items-center text-[#185325] font-bold"><span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3 border-[#185325]"></span> Memuat...</div>;
  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const isTerverifikasiStaff = data.status === 'Terverifikasi'; 

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#DCECE0] text-[#185325] text-xs font-bold rounded-md mb-3">CSR-{data.id}</span>
          <h1 className="text-2xl font-bold text-gray-800">Lembar Validasi CSR (Kepala Bidang)</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">KTH Pengusul</span><div className="font-bold text-sm"><HiOutlineUser className="w-4 h-4 inline mr-1 text-gray-400" />{data.kth?.nama}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Ketua KTH</span><div className="font-bold text-sm"><HiOutlineUser className="w-4 h-4 inline mr-1 text-gray-400" />{data.kth?.ketua}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">File Proposal</span><div className="font-bold text-sm italic text-[#185325]"><a href={`${STORAGE_BASE_URL}${data.proposal_file_path}`} target="_blank" rel="noreferrer">{getFileName(data.proposal_file_path) || 'Lihat File'}</a></div></div>
          
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Lokasi</span><div className="font-bold text-sm"><HiOutlineMapPin className="w-4 h-4 inline mr-1 text-[#185325]" />{data.lokasi || (data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '')}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Nama Program</span><div className="font-bold text-sm">{data.nama_program}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Anggaran Diajukan</span><div className="font-bold text-sm">{formatRupiah(data.anggaran)}</div></div>

          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Luas Lahan</span><div className="font-bold text-sm">{data.target_luas_lahan} Ha</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Jenis Pohon</span><div className="font-bold text-sm">{data.jenis_tanaman}</div></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-gray-500">Jumlah Bibit</span><div className="font-bold text-sm">{data.jumlah_bibit} Bibit</div></div>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-1 gap-8 flex-1">
          <div><h1 className="font-semibold text-gray-800">Rencana Kegiatan</h1><p className="mt-2 text-sm text-slate-500 text-justify">{data.deskripsi_rencana || '-'}</p></div>
          <div><h1 className="font-semibold text-gray-800">Catatan Staff PDAS</h1><p className="mt-2 text-sm text-slate-500 text-justify">{data.catatan_staff || '-'}</p></div>
          <div><h1 className="font-semibold text-gray-800">Rekomendasi Mitra CSR</h1><p className="mt-2 text-sm text-[#185325] font-bold">{data.rekomendasi_mitra || '-'}</p></div>
          <div><h1 className="font-semibold text-gray-800">Rekomendasi Intervensi</h1><p className="mt-2 text-sm text-slate-500">{data.rekomendasi_intervensi || '-'}</p></div>
        </div>

        {isTerverifikasiStaff && (
          <div className="pt-10 mt-auto flex flex-col-reverse sm:flex-row justify-end items-center gap-4 border-t border-gray-100">
            <button disabled={isSubmitting} onClick={() => handleAction('Ditolak')} className="w-full sm:w-auto px-8 py-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-bold rounded-full hover:bg-gray-50 flex justify-center items-center gap-2"><HiOutlineX className="w-4 h-4" /> Tolak Proposal</button>
            <button disabled={isSubmitting} onClick={() => handleAction('Menunggu Persetujuan')} className="w-full sm:w-auto px-8 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] flex justify-center items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5" /> Rekomendasikan ke Mitra CSR</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifikasiCSR;