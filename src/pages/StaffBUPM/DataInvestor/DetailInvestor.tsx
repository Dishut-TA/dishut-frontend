import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';

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

const DetailInvestor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  // USR-001 = Aktif | USR-002 = Selesai
  const isSelesai = id === 'USR-002';

  // --- MOCK DATA ---
  const detailData = {
    nama: 'Raisha Nabila',
    email: 'raisha@gmail.com',
    noTelepon: '081234567894',
    namaProyek: 'Ekowisata Kebun Stroberi',
    nilaiInvestasi: 'Rp 50.000.000',
    tanggalBergabung: '24 Agustus 2025',
    tanggalBerakhir: '24 Agustus 2028',
    status: isSelesai ? 'Selesai' : 'Aktif'
  };

  const riwayatKeuntungan = [
    { id: 1, periode: 'Jan - Juni 2025', nominal: 'Rp 8.500.000', status: 'Dibayar ✓' },
    { id: 2, periode: 'Juli - Des 2025', nominal: 'Rp 9.200.000', status: 'Dibayar ✓' },
    { id: 3, periode: 'Jan - Jun 2026', nominal: 'Rp 8.000.000', status: isSelesai ? 'Dibayar ✓' : 'Menunggu' },
  ];

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
            <InfoRow label="Nama Investor" value={detailData.nama} />
            <InfoRow label="Email" value={detailData.email} />
            <InfoRow label="No Telepon" value={detailData.noTelepon} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">Informasi Investasi</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="Nama Proyek" value={detailData.namaProyek} />
            <InfoRow label="Nilai Investasi" value={detailData.nilaiInvestasi} />
            <InfoRow label="Tanggal Bergabung" value={detailData.tanggalBergabung} />
            
            {isSelesai && (
              <InfoRow label="Tanggal Berakhir" value={detailData.tanggalBerakhir} />
            )}

            <InfoRow label="Status" value={detailData.status} valueColor="text-emerald-600" />
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
                {riwayatKeuntungan.map((item) => (
                  <tr key={item.id} className="border-b border-[#185325]/30 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 font-bold text-gray-700">{item.periode}</td>
                    <td className="py-4 px-2 font-bold text-gray-800">{item.nominal}</td>
                    <td className={`py-4 px-2 font-medium ${item.status.includes('Menunggu') ? 'text-gray-800' : 'text-gray-800'}`}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailInvestor;