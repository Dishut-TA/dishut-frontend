import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';

const DetailLaporanDanaSTAFF: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // MOCK DATA DINAMIS (Berdasarkan ID dari file index)
  // 0 = Menunggu Verifikasi, 1 = Revisi, 2 = Terverifikasi (Hanya untuk keperluan testing UI)
  const data = useMemo(() => {
    let currentStatus = 'Terverifikasi';
    if (id === '0') currentStatus = 'Menunggu Verifikasi';
    if (id === '1') currentStatus = 'Revisi';

    return {
      namaProgram: 'Rehabilitasi Citarum',
      lokasi: 'Bandung Barat',
      tahap: 'Tahap 1',
      sumberDana: 'CSR',
      danaDisalurkan: 'Rp 100.000.000',
      totalDirealisasi: 'Rp 20.000.000',
      sisaDana: 'Rp 80.000.000',
      status: currentStatus,
      catatan: currentStatus === 'Revisi' ? 'Bukti transaksi tidak jelas, silakan foto kembali dan kirim ulang' : '-'
    };
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terverifikasi': return 'text-[#2E7D32]'; 
      case 'Menunggu Verifikasi': return 'text-yellow-600';
      case 'Revisi': return 'text-red-600'; 
      default: return 'text-gray-800';
    }
  };

  const InfoRow = ({ label, value, isStatus = false, isCatatan = false }: { label: string, value: string, isStatus?: boolean, isCatatan?: boolean }) => (
    <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] mb-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-500">:</span>
      <span className={`font-semibold 
        ${isStatus ? getStatusColor(value) : 'text-gray-800'} 
        ${isCatatan && value !== '-' ? 'italic text-gray-700' : ''}`
      }>
        {value}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12 px-4 sm:px-0">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#185325] transition-colors self-start cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">Halaman Detail</h1>
        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Informasi Program</h3>
          <InfoRow label="Nama Program" value={data.namaProgram} />
          <InfoRow label="Lokasi" value={data.lokasi} />
          <InfoRow label="Tahap" value={data.tahap} />
          <InfoRow label="Sumber Dana" value={data.sumberDana} />
          <InfoRow label="Dana Disalurkan" value={data.danaDisalurkan} />
          <InfoRow label="Total Direalisasi" value={data.totalDirealisasi} />
          <InfoRow label="Sisa Dana" value={data.sisaDana} />
          <InfoRow label="Status" value={data.status} isStatus />
          <InfoRow label="Catatan" value={data.catatan} isCatatan />
        </div>

        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Rincian Penggunaan Dana</h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm mb-4">
              <thead className="border-y border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 font-semibold px-2">KEGIATAN</th>
                  <th className="py-4 font-semibold text-center">TANGGAL</th>
                  <th className="py-4 font-semibold text-center">NOMINAL</th>
                  <th className="py-4 font-semibold text-center">BUKTI TRANSAKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2 text-gray-800 font-semibold">Pembersihan Lahan</td>
                  <td className="py-4 text-gray-600 text-center">01/01/2024</td>
                  <td className="py-4 text-gray-600 text-center">Rp. 8.000.000</td>
                  <td className="py-4 text-center">
                    <a href="#" className="text-gray-600 italic hover:text-[#185325] underline transition-colors">
                      invoice_pupuk.pdf
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Ringkasan Dana</h3>
          <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] mb-3 text-sm">
            <span className="text-gray-600">Dana Disalurkan</span>
            <span className="text-gray-600">:</span>
            <span className="text-gray-800">{data.danaDisalurkan}</span>
          </div>
          <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] mb-3 text-sm">
            <span className="text-gray-600">Total Realisasi</span>
            <span className="text-gray-600">:</span>
            <span className="text-gray-800">{data.totalDirealisasi}</span>
          </div>
          <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-sm">
            <span className="text-gray-600">Sisa Dana</span>
            <span className="text-gray-600">:</span>
            <span className="text-gray-800">{data.sisaDana}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailLaporanDanaSTAFF;