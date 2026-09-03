import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineMapPin, HiOutlineUser, HiOutlineInformationCircle } from 'react-icons/hi2';
import { PiLeafFill } from 'react-icons/pi';
import { getPenugasanByIdAPI } from '@/services/penugasan.service';

const DetailPenugasanPenyulaman: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getPenugasanByIdAPI(id);
        setData(res?.data ?? null);
      } catch (err: any) {
        console.error('Gagal mengambil detail penugasan:', err);
        setError(err.message || 'Gagal mengambil detail penugasan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-10 text-center text-sm text-gray-500">Memuat detail penugasan...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center text-sm text-red-500">
        {error || 'Data penugasan tidak ditemukan.'}
        <div className="mt-4">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:bg-gray-50">
            <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      </div>
    );
  }

  const formatted = data.formatted_data || {};
  const namaProgram = formatted.nama_program || '-';
  const lokasi = formatted.lokasi || '-';
  const status = data.status || '-';
  const periode = data.tanggal_mulai && data.batas_waktu
    ? `${new Date(data.tanggal_mulai).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} - ${new Date(data.batas_waktu).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
    : '-';
  const penyuluh = data.penyuluh?.username || data.penyuluh?.nama_pengguna || '-';
  const arahan = data.arahan || 'Penyulaman dilakukan untuk mengganti tanaman yang tidak tumbuh atau rusak agar target tanaman dapat tercapai.';

  const source = data.penugasanable;
  let jenisTanaman = '-';
  if (source?.seeds?.length) {
    jenisTanaman = source.seeds.map((s: any) => s.name).filter(Boolean).join(', ');
  } else if (source?.jenis_tanaman) {
    jenisTanaman = source.jenis_tanaman;
  }
  const targetBibit = source?.total_seeds_collected ?? source?.jumlah_bibit ?? null;

  return (
    <div className="w-full mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Penugasan Penyulaman</h1>
        <p className="text-sm text-gray-500">Informasi lengkap penugasan kegiatan penyulaman yang diberikan kepada KTH.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 border border-[#FEF08A]">
            <PiLeafFill className="w-8 h-8 text-[#D97706]" />
          </div>
          <div>
            <div className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] border border-[#FEF08A] text-[10px] font-bold rounded mb-2 inline-block uppercase tracking-wider">
              Penyulaman
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{namaProgram}</h2>
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <HiOutlineMapPin className="w-3.5 h-3.5" /> {lokasi}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 border-l border-gray-100 pl-8">
          <div>
            <p className="text-[10px] font-medium text-gray-500 mb-1">Status Program</p>
            <span className="px-3 py-1 bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] text-xs font-bold rounded-lg inline-block mt-1">
              {status}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 mb-2 flex items-center gap-1.5">
              <HiOutlineCalendar className="w-3.5 h-3.5" /> Periode Program
            </p>
            <p className="text-xs font-bold text-gray-900">{periode}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 mb-2 flex items-center gap-1.5">
              <HiOutlineUser className="w-3.5 h-3.5" /> Penyuluh
            </p>
            <p className="text-xs font-bold text-gray-900">{penyuluh}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <PiLeafFill className="w-5 h-5 text-[#D97706]" /> Informasi Penyulaman
          </h3>
          <p className="text-xs text-gray-500 mt-1 ml-7">Berikut adalah informasi jenis tanaman dan jumlah yang perlu disulam.</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase">Jenis Tanaman</p>
              <p className="text-sm font-bold text-gray-900">{jenisTanaman}</p>
            </div>
            <div className="border border-[#FEF08A] bg-[#FEF3C7]/40 rounded-xl p-4">
              <p className="text-[10px] font-bold text-[#D97706] mb-1 uppercase">Target Penyulaman</p>
              <p className="text-sm font-bold text-[#D97706]">{targetBibit !== null ? `${targetBibit} Pohon` : '-'}</p>
            </div>
          </div>

          <div className="bg-[#FEF3C7]/40 border border-[#FEF08A] p-4 rounded-lg flex items-start gap-3">
            <HiOutlineInformationCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#D97706] mb-1">Alasan / Arahan Penyulaman</p>
              <p className="text-[11px] text-[#B45309] font-medium leading-relaxed">{arahan}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
          <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
    </div>
  );
};

export default DetailPenugasanPenyulaman;