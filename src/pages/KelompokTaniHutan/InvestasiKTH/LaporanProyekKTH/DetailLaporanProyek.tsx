import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import { getLaporanProyekByIdAPI } from '@/services/investasi.service';
import toast from 'react-hot-toast';

type StatusLaporan = 'Menunggu Verifikasi' | 'Revisi' | 'Diverifikasi';

const InfoRow = ({
  label,
  value,
  valueColor = "text-gray-800",
  isItalic = false,
  isLink = false,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  isItalic?: boolean;
  isLink?: boolean;
}) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span 
      className={`font-medium ${valueColor} ${isItalic ? 'italic text-gray-600' : ''} ${isLink ? 'underline cursor-pointer hover:text-gray-600' : ''}`}
    >
      {value}
    </span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-base font-bold text-gray-800 mb-4 mt-8">{title}</h2>
);

const DetailLaporanProyekKTH: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getLaporanProyekByIdAPI(id);
        setData(res);
        
        if (res.status_verifikasi) {
           const mapStatus: any = {
             'PENDING': 'Menunggu Verifikasi',
             'REJECTED': 'Revisi',
             'VERIFIED': 'Diverifikasi'
           };
           setStatusLaporan(mapStatus[res.status_verifikasi] || 'Menunggu Verifikasi');
        }
      } catch (err: any) {
        toast.error(err.message || 'Gagal memuat detail laporan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const [statusLaporan, setStatusLaporan] = useState<StatusLaporan>('Menunggu Verifikasi');

  const getStatusDisplay = () => {
    if (statusLaporan === 'Menunggu Verifikasi') return { text: 'Menunggu Verifikasi', color: 'text-orange-500' };
    if (statusLaporan === 'Revisi') return { text: 'Revisi', color: 'text-red-500' };
    if (statusLaporan === 'Diverifikasi') return { text: 'Diverifikasi', color: 'text-emerald-600' };
    return { text: '', color: '' };
  };

  const statusDisplay = getStatusDisplay();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail laporan...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-300 relative">


      <div className="relative mb-10 flex items-center justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline"
        >
          <HiOutlineChevronLeft className="stroke-2" /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-8 md:mt-0">Detail Laporan Proyek</h1>
      </div>

      <div className="px-4 sm:px-0">
        <h2 className="text-base font-bold text-gray-800 mb-4">Informasi Laporan</h2>
        <div className="flex flex-col gap-3">
          <InfoRow label="Nama Investasi" value={data?.program?.nama_program || data?.program?.nama_program_investasi || data?.nama_program_investasi || "Ekowisata Kebun Stroberi"} />
          <InfoRow label="Periode Laporan" value={data?.created_at ? new Date(data.created_at).toLocaleDateString('id-ID') : "24 Agustus 2025"} />
          <InfoRow label="Status" value={statusDisplay.text} valueColor={statusDisplay.color} />
          
          {(statusLaporan === 'Revisi' || data?.status_verifikasi === 'REJECTED') && (
            <InfoRow 
              label="Catatan" 
              value={data?.catatan_verifikasi || "Dokumentasi milestone belum lengkap, mohon tambahkan foto terbaru."} 
              isItalic={true} 
            />
          )}
          {(statusLaporan === 'Diverifikasi' || data?.status_verifikasi === 'Diverifikasi') && (
            <InfoRow label="Catatan" value="-" />
          )}
        </div>

        <SectionTitle title="Informasi Milestone" />
        <div className="flex flex-col gap-3">
          <InfoRow label="Nama Milestone" value={data?.milestone?.judul_milestone || "Milestone 1"} />
          <InfoRow label="Batas Milestone" value={data?.milestone?.target_tanggal ? new Date(data.milestone.target_tanggal).toLocaleDateString('id-ID') : "22/04/2024"} />
          <InfoRow 
            label="Status" 
            value={
              <span className="flex items-center gap-1 text-emerald-600">
                Tercapai <span className="font-bold">✓</span>
              </span>
            } 
          />
          <InfoRow label="Dokumen Milestone" value={data?.milestone?.dokumens?.[0]?.file_url ? 'Dokumen_Milestone.pdf' : "RencanaProyekPembangunanEkowisata.pdf"} isLink={true} valueColor="text-gray-800" />
          <InfoRow 
            label="Deskripsi" 
            value={data?.deskripsi_kemajuan || "Lorem ipsum dolor sit amet consectetur. Faucibus faucibus urna nulla amet at nascetur."} 
            valueColor="text-gray-500 font-normal leading-relaxed text-justify"
          />
        </div>

        <SectionTitle title="Penggunaan Dana" />
        <div className="flex flex-col gap-3">
          <InfoRow label="Dana Terpakai" value={`Rp ${data?.dana_terpakai ? Number(data.dana_terpakai).toLocaleString('id-ID') : '27.000.000'}`} />
          <InfoRow label="Sisa Dana" value={`Rp ${data?.sisa_dana ? Number(data.sisa_dana).toLocaleString('id-ID') : '3.000.000'}`} />
        </div>

        <SectionTitle title="Dokumen Perkembangan" />
        <div className="flex flex-col gap-3">
          {data?.dokumens && data.dokumens.length > 0 ? (
            data.dokumens.map((dok: any, index: number) => (
              <span key={index} onClick={() => window.open(dok.file_url, '_blank')} className="text-sm text-gray-800 font-medium underline cursor-pointer hover:text-gray-600 w-fit">
                {`Dokumen_Pendukung_${index + 1}`}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-800 font-medium underline cursor-pointer hover:text-gray-600 w-fit">
              dokumen_pendukung.pdf
            </span>
          )}
        </div>
        
        {statusLaporan === 'Menunggu Verifikasi' && (
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <button className="flex-1 py-3.5 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors shadow-sm active:scale-95">
              Hapus Laporan
            </button>
            <button className="flex-1 py-3.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-sm active:scale-95">
              Edit Laporan
            </button>
          </div>
        )}

        {statusLaporan === 'Revisi' && (
          <div className="flex mt-12">
            <button className="w-full py-3.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-sm active:scale-95">
              Edit Laporan
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailLaporanProyekKTH;