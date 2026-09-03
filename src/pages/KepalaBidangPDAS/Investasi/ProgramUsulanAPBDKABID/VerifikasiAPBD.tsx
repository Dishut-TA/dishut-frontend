import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft,
  HiOutlineUser,
  HiOutlineMapPin,
  HiOutlineXMark,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdByIdAPI, updateProgramApbdStatusAPI } from '@/services/program-apbd.service';

const VerifikasiAPBD: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getProgramApbdByIdAPI(id);
          setData(res.data || res.payload || res);
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail program.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus: 'Terverifikasi' | 'Ditolak') => {
    if (!id) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading(`Memproses ${newStatus.toLowerCase()} program...`);
    
    try {
      await updateProgramApbdStatusAPI(id, newStatus);
      toast.success(`Program APBD berhasil ${newStatus.toLowerCase()}!`, { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || `Gagal ${newStatus.toLowerCase()} program.`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (angka: any) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail verifikasi...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  // Menambahkan 'Aktif' ke dalam daftar status yang membuat tombol aksi disembunyikan
  const isVerified = ['Terverifikasi', 'Ditolak', 'Aktif'].includes(data.status);

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col">
        <div className="mb-8">
          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md mb-3 ${
            data.status === 'Terverifikasi' || data.status === 'Aktif' ? 'bg-green-100 text-green-700' :
            data.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
            'bg-[#DCECE0] text-[#185325]'
          }`}>
            Status: {data.status || 'Menunggu Persetujuan'}
          </span>
          <h1 className="text-2xl font-bold text-gray-800">Lembar Sahkan APBD</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Kelompok Tani Hutan</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
              <HiOutlineUser className="w-4 h-4 text-gray-400" />
              {data.kth?.nama || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Nama Ketua KTH</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
              <HiOutlineUser className="w-4 h-4 text-gray-400" />
              {data.kth?.ketua || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Luas Lahan</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
              {data.target_luas_lahan || 0} Ha
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Lokasi Lahan</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
              <HiOutlineMapPin className="w-4 h-4 text-[#185325]" />
              {data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '-'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Nama Program</span>
            <div className="font-bold text-gray-800 text-sm">
              {data.nama_program || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Anggaran APBD</span>
            <div className="font-bold text-gray-800 text-sm">
              {formatRupiah(data.anggaran)}
            </div>
          </div>
        </div>

        <div className="pt-8 flex-1">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Rekomendasi Intervensi
          </label>
          <div className="relative text-sm text-gray-600 leading-relaxed text-justify">
            <p>{data.analysis_result_zone?.rekomendasi_intervensi || data.pilihan_intervensi || 'Tidak ada rekomendasi intervensi tersedia.'}</p>
          </div>
        </div>

        <div className="pt-8 flex-1">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Deskripsi Rencana Kegiatan
          </label>
          <div className="relative text-sm text-gray-600 leading-relaxed text-justify">
            <p>{data.deskripsi_rencana || 'Tidak ada deskripsi tersedia.'}</p>
          </div>
        </div>

        {!isVerified && (
          <div className="pt-8 mt-auto flex flex-col-reverse sm:flex-row justify-end items-center gap-4">
            <button 
              onClick={() => handleUpdateStatus('Ditolak')}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineXMark className="w-4 h-4" /> Tolak
            </button>
            <button 
              onClick={() => handleUpdateStatus('Terverifikasi')}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineCheckCircle className="w-5 h-5" /> Sahkan Program APBD
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifikasiAPBD;