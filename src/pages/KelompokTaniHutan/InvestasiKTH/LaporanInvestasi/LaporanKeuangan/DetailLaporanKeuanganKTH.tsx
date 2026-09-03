import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlinePrinter, HiOutlinePencil } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanKeuanganByIdAPI } from '@/services/investasi.service';

type StatusLaporan = 'Menunggu Verifikasi' | 'Diverifikasi' | 'Revisi';

const InfoRow = ({
  label,
  value,
  valueColor = "text-gray-800",
  isItalic = false
}: {
  label: string;
  value: string;
  valueColor?: string;
  isItalic?: boolean;
}) => (
  <div className="grid grid-cols-[200px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span className={`font-medium ${valueColor} ${isItalic ? 'italic' : ''}`}>{value}</span>
  </div>
);

const TransactionTable = ({
  title,
  data,
  total,
  isRevisi = false
}: {
  title: string;
  data: any[];
  total: string;
  isRevisi?: boolean;
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-base font-bold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-300 text-gray-800">
              <th className="py-3 px-2 font-medium">Tanggal</th>
              <th className="py-3 px-2 font-medium">Keterangan</th>
              <th className="py-3 px-2 font-medium">Nominal</th>
              <th className="py-3 px-2 font-medium">Dokumen</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              // Logika Merah khusus untuk state Revisi pada row Operasional
              const isError = isRevisi && row.keterangan === 'Operasional';
              const textColor = isError ? 'text-red-500' : 'text-gray-800';

              return (
                <tr key={idx} className={`border-b border-gray-200 ${textColor}`}>
                  <td className="py-3 px-2">{row.tanggal}</td>
                  <td className="py-3 px-2">{row.keterangan}</td>
                  <td className="py-3 px-2">Rp {Number(row.nominal || 0).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-2 italic text-emerald-600 underline">
                    <a href={row.dokumen} target="_blank" rel="noreferrer">
                      Lihat Bukti
                    </a>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-[#DCECE0] text-gray-800 font-bold">
              <td colSpan={2} className="py-3 px-2">Total</td>
              <td colSpan={2} className="py-3 px-2">{total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetailLaporanKeuanganKTH: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [statusLaporan, setStatusLaporan] = useState<StatusLaporan>('Menunggu Verifikasi');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getLaporanKeuanganByIdAPI(id);
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
        toast.error(err.message || 'Gagal memuat detail laporan keuangan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getStatusDisplay = () => {
    if (statusLaporan === 'Menunggu Verifikasi') return { text: 'Menunggu Verifikasi', color: 'text-orange-500' };
    if (statusLaporan === 'Diverifikasi') return { text: `Diverifikasi${data?.updated_at ? ` (${new Date(data.updated_at).toLocaleDateString('id-ID')})` : ''}`, color: 'text-emerald-600' };
    if (statusLaporan === 'Revisi') return { text: 'Revisi', color: 'text-red-500' };
    return { text: '', color: '' };
  };

  const statusDisplay = getStatusDisplay();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail laporan keuangan...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-300 relative">

      <div className="relative mb-12 flex items-center justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline"
        >
          <HiOutlineChevronLeft className="stroke-2" /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-8 md:mt-0">Detail Laporan Keuangan</h1>
      </div>

      <div className="px-4 sm:px-0">
        <h3 className="text-base font-bold text-gray-800 mb-4">Informasi Laporan</h3>
        <div className="flex flex-col gap-3">
          <InfoRow label="Nama Proyek" value={data?.program?.nama_program_investasi || data?.program?.nama_program || "Ekowisata Kebun Stroberi"} />
          <InfoRow label="Periode" value={data?.periode_awal && data?.periode_akhir ? `${new Date(data.periode_awal).toLocaleDateString('id-ID')} - ${new Date(data.periode_akhir).toLocaleDateString('id-ID')}` : "Januari - Juni 2025"} />
          <InfoRow label="Tanggal Submit" value={data?.created_at ? new Date(data.created_at).toLocaleDateString('id-ID') : "5 Juli 2025"} />
          <InfoRow label="Status" value={statusDisplay.text} valueColor={statusDisplay.color} />

          {statusLaporan === 'Revisi' && (
            <InfoRow
              label="Catatan"
              value={data?.catatan_verifikasi || "*Terdapat catatan revisi.*"}
              isItalic={true}
            />
          )}

          <div className="mt-4 flex flex-col gap-3">
            <InfoRow label="Total Pendapatan" value={`Rp ${data?.total_pendapatan?.toLocaleString('id-ID') || 0}`} />
            <InfoRow label="Total Pengeluaran" value={`Rp ${data?.total_pengeluaran?.toLocaleString('id-ID') || 0}`} />
            <InfoRow label="Laba Bersih" value={`Rp ${data?.laba_bersih?.toLocaleString('id-ID') || 0}`} />
          </div>
        </div>

        <TransactionTable
          title="Tabel Pendapatan"
          data={data?.rincian_pendapatan || []}
          total={`Rp ${data?.total_pendapatan?.toLocaleString('id-ID') || 0}`}
        />

        <TransactionTable
          title="Pengeluaran"
          data={data?.rincian_pengeluaran || []}
          total={`Rp ${data?.total_pengeluaran?.toLocaleString('id-ID') || 0}`}
          isRevisi={statusLaporan === 'Revisi'}  
        />

        <div className="bg-[#DCECE0] rounded-xl p-6 mt-10 max-w-2xl">
          <h3 className="text-base font-bold text-gray-800 mb-4">Ringkasan Pembagian Keuntungan</h3>
          <div className="flex flex-col gap-3">
            <InfoRow label="Laba Bersih" value={`Rp ${data?.laba_bersih?.toLocaleString('id-ID') || 0}`} />
            <InfoRow label="KTH (60%)" value={`Rp ${((data?.laba_bersih || 0) * 0.6).toLocaleString('id-ID')}`} />
            <InfoRow label="Investor (40%)" value={`Rp ${((data?.laba_bersih || 0) * 0.4).toLocaleString('id-ID')}`} />
          </div>
        </div>

        <div className="flex justify-end mt-12">
          {statusLaporan === 'Diverifikasi' && (
            <button className="flex items-center gap-2 px-8 py-3.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-md active:scale-95">
              <HiOutlinePrinter className="w-5 h-5" /> Cetak Laporan
            </button>
          )}
          {statusLaporan === 'Revisi' && (
            <button 
              onClick={() => navigate(`/admin/kth/laporan-investasi/keuangan/edit/${id}`)}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-md active:scale-95"
            >
              <HiOutlinePencil className="w-5 h-5" /> Edit Laporan
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailLaporanKeuanganKTH;