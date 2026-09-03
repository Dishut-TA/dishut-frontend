import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getDetailPersetujuanInvestorAPI } from '@/services/investasi.service';

// --- HELPER COMPONENT ---
// Membantu merapikan layout baris informasi dengan titik dua (:) sejajar
const InfoRow = ({ label, value, valueColor = "text-gray-800" }: { label: string, value: string, valueColor?: string }) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span className={`font-bold ${valueColor}`}>{value}</span>
  </div>
);

const DetailInvestorKTH: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await getDetailPersetujuanInvestorAPI(id!);
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail data investor.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(angka);
  };

  if (loading) return <div className="text-center py-12">Memuat...</div>;
  if (!data) return <div className="text-center py-12">Data tidak ditemukan.</div>;

  return (
    <div className="flex flex-col w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-primary hover:underline self-start mb-6"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col gap-10">
        
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Detail Data Investor</h1>

        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">Informasi Investor</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="Nama Investor" value={data.nama || '-'} />
            <InfoRow label="Email" value={data.email || '-'} />
            <InfoRow label="No Telepon" value={data.no_telp || '-'} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">Informasi Investasi</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="Nama Proyek" value={data.program?.nama_program_investasi || data.program?.nama_program || '-'} />
            <InfoRow label="Nilai Investasi" value={formatRupiah(data.nominal_pendanaan || 0)} />
            <InfoRow label="Tanggal Bergabung" value={data.created_at ? new Date(data.created_at).toLocaleDateString('id-ID') : '-'} />
            <InfoRow label="Status" value={data.status_pembayaran || data.status_persetujuan || '-'} valueColor="text-emerald-600" />
            
            {data.dokumen_url && (
              <InfoRow 
                label="Bukti Transfer" 
                value={<a href={data.dokumen_url} target="_blank" rel="noreferrer" className="underline text-emerald-600 hover:text-emerald-700">Lihat Bukti</a> as any}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-base font-bold text-gray-800">Riwayat Pembagian Keuntungan</h2>
          
          <div className="overflow-x-auto max-w-2xl">
            <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="py-3 px-2 font-bold text-primary">Periode</th>
                  <th className="py-3 px-2 font-bold text-primary">Nominal</th>
                  <th className="py-3 px-2 font-bold text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data.riwayat_keuntungan && data.riwayat_keuntungan.length > 0) ? (
                  data.riwayat_keuntungan.map((item: any) => (
                    <tr key={item.id} className="border-b border-primary/40 hover:bg-gray-50/50">
                      <td className="py-4 px-2 font-medium text-gray-800">{item.periode}</td>
                      <td className="py-4 px-2 font-bold text-gray-800">{formatRupiah(item.nominal)}</td>
                      <td className="py-4 px-2 font-medium text-gray-800">
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 px-2 text-center text-gray-500 italic">Belum ada riwayat pembagian keuntungan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailInvestorKTH;