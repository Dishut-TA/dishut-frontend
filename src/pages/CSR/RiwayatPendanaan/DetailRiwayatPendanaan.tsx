import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineUser, 
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { HiCheck, HiX } from 'react-icons/hi'; 
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI } from '@/services/program-csr.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const DetailRiwayatPendanaan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getProgramCsrByIdAPI(id);
          setData(res.data || res.payload || res);
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail riwayat.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatRupiah = (angka: any) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(Number(angka || 0));
  };

  const getFileName = (path: string) => path ? path.split('/').pop() : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail riwayat...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const statusText = data.status === 'Disetujui' ? 'Selesai' : data.status;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 px-4 sm:px-0 animate-in fade-in duration-300">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="mb-8 border-b border-gray-100 pb-8">
          <span className="inline-block px-3 py-1 bg-[#DCECE0] text-[#185325] text-xs font-bold rounded mb-3">
            {`P-CSR-${new Date(data.created_at).getFullYear()}-${String(data.id).padStart(3, '0')}`}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Riwayat Program Pendanaan</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Kelompok Tani Hutan Pengusul</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm md:text-base">
              <HiOutlineUser className="w-5 h-5 text-[#185325]" />
              {data.kth?.nama || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Nama Ketua KTH</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm md:text-base">
              <HiOutlineUser className="w-5 h-5 text-[#185325]" />
              {data.kth?.ketua || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">File Proposal</span>
            <div className="font-bold text-sm md:text-base italic text-primary">
              {data.proposal_file_path ? (
                <a href={`${STORAGE_BASE_URL}${data.proposal_file_path}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {getFileName(data.proposal_file_path)}
                </a>
              ) : '-'}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Lokasi Lahan Kegiatan</span>
            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm md:text-base">
              <HiOutlineMapPin className="w-5 h-5 text-[#185325]" />
              {data.lokasi || (data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '-')}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Nama Program</span>
            <div className="font-bold text-gray-800 text-sm md:text-base">
              {data.nama_program || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Alokasi Anggaran Diajukan</span>
            <div className="font-bold text-gray-800 text-sm md:text-base">
              {formatRupiah(data.anggaran)}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Luas Lahan</span>
            <div className="font-bold text-gray-800 text-sm md:text-base">
              {data.target_luas_lahan || 0} Ha
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Jenis Pohon</span>
            <div className="font-bold text-gray-800 text-sm md:text-base">
              {data.jenis_tanaman || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600">Jumlah Bibit</span>
            <div className="font-bold text-gray-800 text-sm md:text-base">
              {data.jumlah_bibit ? `${data.jumlah_bibit} Bibit` : '-'}
            </div>
          </div>
        </div>

        <div className="pt-8 pb-8">
          <h3 className="text-sm md:text-base font-medium text-gray-600 mb-3">
            Rencana Kegiatan Rehabilitasi
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed text-justify">
            {data.deskripsi_rencana || '-'}
          </p>
        </div>

        <div className="pt-8 pb-8">
          <h3 className="text-sm md:text-base font-medium text-gray-600 mb-3">
            Rekomendasi Intervensi
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed text-justify">
            {data.rekomendasi_intervensi || '-'}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm md:text-base font-medium text-gray-800">Status :</span>
          {statusText === 'Selesai' ? (
            <div className="flex items-center gap-1.5 text-[#185325] font-bold text-sm md:text-base">
              Selesai <HiCheck className="w-5 h-5 stroke-[2px]" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm md:text-base">
              {statusText} <HiX className="w-5 h-5 stroke-[2px]" />
            </div>
          )}
        </div>

        {statusText === 'Dihentikan' && (
          <div className="mt-8 pt-4">
            <h3 className="text-sm md:text-base font-medium text-gray-600 mb-2">
              Catatan
            </h3>
            <p className="text-sm text-gray-800 italic font-medium">
              {data.tanggapan_perusahaan || data.catatan_staff || 'Tidak ada catatan.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailRiwayatPendanaan;