import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getDetailDataInvestorBUPMAPI } from '@/services/investasi.service';

const InfoRow = ({ 
  label, 
  value, 
  valueColor = "text-gray-800" 
}: { 
  label: string, 
  value: string, 
  valueColor?: string 
}) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span className={`font-bold ${valueColor}`}>{value}</span>
  </div>
);

const DetailInvestorKABIDBUPM: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await getDetailDataInvestorBUPMAPI(id!);
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail data investor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Memuat...</div>;
  if (!data) return <div className="text-center py-12">Data tidak ditemukan.</div>;

  const isSelesai = data.status_pendanaan === 'COMPLETED';

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(angka);
  };

  return (
    <div className="flex flex-col w-full mx-auto pb-12 animate-in fade-in duration-300">
      <div className="relative mb-10 flex items-center justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline"
        >
          <HiOutlineChevronLeft className="stroke-2" /> Kembali
        </button>
      </div>

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
            
            {data.tanggal_berakhir && (
              <InfoRow label="Tanggal Berakhir" value={new Date(data.tanggal_berakhir).toLocaleDateString('id-ID')} />
            )}

            <InfoRow label="Status" value={data.status_pembayaran || '-'} valueColor={data.status_pembayaran === 'PENDING' ? 'text-orange-500' : 'text-emerald-600'} />
            
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
                <tr className="border-b-2 border-[#185325]">
                  <th className="py-3 px-2 font-bold text-[#185325]">Periode</th>
                  <th className="py-3 px-2 font-bold text-[#185325]">Nominal</th>
                  <th className="py-3 px-2 font-bold text-[#185325]">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data.riwayat_keuntungan && data.riwayat_keuntungan.length > 0) ? (
                  data.riwayat_keuntungan.map((item: any) => (
                    <tr key={item.id} className="border-b border-[#185325]/30 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-2 font-bold text-gray-700">{item.periode}</td>
                      <td className="py-4 px-2 font-bold text-gray-800">{formatRupiah(item.nominal)}</td>
                      <td className={`py-4 px-2 font-medium ${item.status?.includes('Menunggu') ? 'text-orange-600' : 'text-emerald-600'}`}>
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

export default DetailInvestorKABIDBUPM;