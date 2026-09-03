import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlineXCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdByIdAPI, updateProgramApbdStatusAPI } from '@/services/program-apbd.service';

const DetailPendanaanAPBD: React.FC = () => {
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
        toast.error("Gagal memuat detail penugasan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleKonfirmasi = async (action: 'Aktif' | 'Ditolak KTH') => {
    if (!id) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses konfirmasi Anda...');
    
    try {
      // Kita panggil API update status yang sama dengan milik Kabid
      await updateProgramApbdStatusAPI(id, action as any); 
      toast.success(`Program APBD berhasil direspons!`, { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || `Gagal merespons penugasan.`, { id: loadingToast });
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
        Memuat detail penugasan...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  // Tombol aksi hanya muncul jika status masih 'Disetujui' oleh Kabid (menunggu konfirmasi KTH)
  const isMenungguKonfirmasi = data.status === 'Terverifikasi';

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 text-gray-800 animate-in fade-in duration-300">
      
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" />
          Kembali
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col min-h-150">
        
        <div className="mb-6">
          <span className="inline-block px-3 py-1.5 bg-[#DCECE0]/70 text-[#185325] text-xs font-bold rounded-md mb-4 uppercase tracking-wider">
            Detail Administrasi
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Lembar Konfirmasi Program APBD
          </h1>
        </div>

        <hr className="border-gray-100 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">Kelompok Tani Hutan</p>
            <div className="flex items-center gap-2 text-base font-bold text-gray-800">
              <HiOutlineUserGroup className="w-5 h-5 text-[#2E7D32]" />
              {data.kth?.nama || '-'}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Nama Ketua KTH</p>
            <div className="flex items-center gap-2 text-base font-bold text-gray-800">
              <HiOutlineIdentification className="w-5 h-5 text-[#2E7D32]" />
              {data.kth?.ketua || '-'}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Target Luas Lahan</p>
            <div className="text-base font-bold text-gray-800">
              {data.target_luas_lahan || 0} Ha
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Lokasi Lahan</p>
            <div className="flex items-center gap-2 text-base font-bold text-gray-800">
              <HiOutlineMapPin className="w-5 h-5 text-[#2E7D32]" />
              {data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '-'}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Nama Program</p>
            <div className="text-base font-bold text-gray-800">
              {data.nama_program || '-'}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Anggaran APBD</p>
            <div className="text-base font-bold text-[#185325]">
              {formatRupiah(data.anggaran)}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Rekomendasi Intervensi</p>
            <div className="text-base font-bold text-gray-800">
              {data.analysis_result_zone?.rekomendasi_intervensi || data.pilihan_intervensi || '-'}
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Deskripsi Rencana Kegiatan
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed text-justify">
            {data.deskripsi_rencana || '-'}
          </p>
        </div>

        <hr className="border-gray-100 mb-8" />

        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Status Terkini
          </h3>
          <p className="text-sm text-gray-600">
            {isMenungguKonfirmasi 
              ? 'Program ini telah disahkan oleh Kepala Bidang PDAS. Harap konfirmasi kesanggupan KTH Anda untuk memulai program.' 
              : `Program ini berstatus: ${data.status}`
            }
          </p>
        </div>

        {/* Tombol Aksi hanya muncul saat KTH butuh mengkonfirmasi */}
        {isMenungguKonfirmasi && (
          <div className="flex items-center justify-end gap-4 mt-auto pt-4 border-t border-gray-100">
            <button 
              onClick={() => handleKonfirmasi('Ditolak KTH')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 text-gray-500 rounded-full font-semibold hover:bg-gray-50 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <HiOutlineXCircle className="w-5 h-5" />
              Tolak Penugasan
            </button>
            
            <button 
              onClick={() => handleKonfirmasi('Aktif')} 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#185325] text-white rounded-full font-semibold hover:bg-[#123d1c] transition-colors cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
            >
              <HiOutlineCheckCircle className="w-5 h-5" />
              Konfirmasi & Mulai
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailPendanaanAPBD;