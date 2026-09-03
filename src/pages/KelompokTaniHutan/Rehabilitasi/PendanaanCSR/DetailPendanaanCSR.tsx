import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft,
  HiOutlineUser,
  HiOutlineMapPin,
  HiOutlinePencilSquare
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI } from '@/services/program-csr.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const DetailPendanaanCSR: React.FC = () => {
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
        toast.error("Gagal memuat detail pengajuan CSR.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatRupiah = (angka: any) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
  };

  const displayStatus = data?.status === 'Ditolak' ? 'Perlu Revisi' : (data?.status || 'Menunggu Persetujuan');

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus.includes('tolak') || lowerStatus.includes('revisi')) return 'text-red-600';
    if (lowerStatus.includes('setuju')) return 'text-[#2E7D32]'; 
    return 'text-gray-500'; 
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail pengajuan...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const getFileName = (path: string) => {
    if (!path) return null;
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto text-gray-800 animate-in fade-in duration-300 bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" />
          Kembali
        </button>

        {data.status === 'Perlu Revisi' && (
          <button 
            onClick={() => navigate(`/admin/kth/rehabilitasi/pendanaan-csr/edit/${data.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-800 hover:bg-red-200 text-sm font-bold rounded-full transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <HiOutlinePencilSquare className="w-5 h-5" /> Revisi Pengajuan
          </button>
        )}
      </div>

      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-[#DCECE0] text-[#185325] text-xs font-bold rounded-md mb-4">
          CSR-{data.id}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Halaman Detail Pengajuan
        </h1>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Catatan Penolakan dari Staff (jika ada) */}
      {data.status === 'Ditolak' && data.catatan && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-red-800 mb-2">Catatan Evaluasi / Alasan Penolakan:</h3>
          <p className="text-sm text-red-700 leading-relaxed italic">{data.catatan}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 mb-10">
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Kelompok Tani Hutan Pengusul</p>
          <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <HiOutlineUser className="w-5 h-5 text-[#2E7D32]" />
            {data.kth?.nama || '-'}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Nama Ketua KTH</p>
          <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <HiOutlineUser className="w-5 h-5 text-[#2E7D32]" />
            {data.kth?.ketua || '-'}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">File Proposal</p>
          <div className="text-base font-bold text-gray-800">
            {data.proposal_file_path ? (
              <a 
                href={`${STORAGE_BASE_URL}${data.proposal_file_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="italic hover:underline hover:text-[#2E7D32] transition-colors"
              >
                {getFileName(data.proposal_file_path) || 'Lihat Proposal'}
              </a>
            ) : (
              <span className="text-gray-400 italic">Tidak ada file</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Lokasi Lahan Kegiatan</p>
          <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <HiOutlineMapPin className="w-5 h-5 text-[#2E7D32]" />
            {data.lokasi || (data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '-')}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Nama Program</p>
          <div className="text-base font-bold text-gray-800">
            {data.nama_program || '-'}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Alokasi Anggaran Diajukan</p>
          <div className="text-base font-bold text-gray-800">
            {formatRupiah(data.anggaran)}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Luas Lahan</p>
          <div className="text-base font-bold text-gray-800">
            {data.target_luas_lahan || 0} Ha
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Jenis Pohon</p>
          <div className="text-base font-bold text-gray-800">
            {data.jenis_tanaman || '-'}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Jumlah Bibit</p>
          <div className="text-base font-bold text-gray-800">
            {data.jumlah_bibit ? `${data.jumlah_bibit} Bibit` : '-'}
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      <div className="mb-10">
        <h3 className="text-base font-medium text-gray-600 mb-3">
          Rencana Kegiatan Rehabilitasi
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed text-justify max-w-4xl">
          {data.deskripsi_rencana || 'Tidak ada deskripsi rencana kegiatan.'}
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-base font-medium text-gray-600 mb-3">
          Status
        </h3>
        <p className={`text-sm font-semibold ${getStatusColor(displayStatus)}`}>
          {displayStatus}
        </p>
      </div>

    </div>
  );
};

export default DetailPendanaanCSR;