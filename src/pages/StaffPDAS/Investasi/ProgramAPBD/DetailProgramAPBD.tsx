import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProgramApbdByIdAPI } from '@/services/program-apbd.service';
import { 
  HiOutlineChevronLeft,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineMapPin
} from 'react-icons/hi2';

const DetailProgramAPBD: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getProgramApbdByIdAPI(id);
          setData(res);
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail program.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 text-gray-800">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" />
          Kembali
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="mb-6">
          <span className="inline-block px-3 py-1.5 bg-[#DCECE0]/70 text-[#185325] text-xs font-bold rounded-md mb-4 uppercase tracking-wider">
            Detail Administrasi
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Detail Rancangan Rehabilitasi APBD
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
              {data.target_luas_lahan} Ha
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Lokasi Lahan (KTH)</p>
            <div className="flex items-center gap-2 text-base font-bold text-gray-800">
              <HiOutlineMapPin className="w-5 h-5 text-[#2E7D32]" />
              {data.kth?.desa_kelurahan ? `${data.kth.desa_kelurahan}, ${data.kth.kabupaten_kota}` : '-'}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Nama Program</p>
            <div className="text-base font-bold text-gray-800">
              {data.nama_program}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Anggaran APBD</p>
            <div className="text-base font-bold text-gray-800">
              {formatRupiah(data.anggaran)}
            </div>
          </div>
        </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">
              Rekomendasi Intervensi
            </span>
            <span className="text-gray-800 font-bold text-sm">
              {data.analysis_result_zone?.rekomendasi_intervensi || data.pilihan_intervensi || '-'}
            </span>
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

        <div className="mb-8 flex items-center gap-3">
          <h3 className="text-base font-bold text-gray-800">
            Status Terkini: 
          </h3>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
            data.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
            data.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {data.status}
          </span>
        </div>

        <hr className="border-gray-100" />
      </div>
      
    </div>
  );
};

export default DetailProgramAPBD;