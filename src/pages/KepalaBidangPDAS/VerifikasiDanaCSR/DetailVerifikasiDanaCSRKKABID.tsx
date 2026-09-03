import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const DetailVerifikasiDanaCSRKABID: React.FC = () => {
  const navigate = useNavigate();
//   const { id } = useParams(); buat nanti pas udah integrasi sama BE

  // Mock data untuk detail
  const detailData = {
    kthPengusul: 'KTH Rimba',
    mitraCSR: 'PT Bank Jabar Banten',
    proyek: 'Rehabilitasi Citarum',
    tahapan: 'Tahap 1',
    rincianAnggaran: [
      { kategori: 'Pengadaan Bibit', nominal: 'Rp 10.000.000' }
    ],
    summary: {
      totalPengeluaran: 'Rp 10.000.000',
      sisaSaldo: 'Rp 90.000.000',
      dokumenBukti: 'KwitansiTahap1.pdf',
      totalBibit: '150 Pohon'
    },
    catatanStaff: '"Berkas administrasi dan bukti kuitansi fisik telah diperiksa dan dinyatakan sesuai dengan target penanaman lapangan."'
  };

  const handleTolak = () => {
    toast.error('Berkas ditolak dan dikembalikan ke KTH.');
    navigate(-1);
  };

  const handleSetuju = () => {
    toast.success('Rekomendasi pencairan dana berhasil diterbitkan!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <span className="inline-block px-3 py-1 bg-[#DCECE0] text-[#185325] text-xs font-bold rounded-md mb-3">
            Verifikasi Laporan Keuangan
          </span>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Penggunaan Dana CSR
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10 pb-8 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Kelompok Tani Hutan Pengusul</p>
            <p className="text-sm font-bold text-gray-800">{detailData.kthPengusul}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Nama Mitra CSR Pendana</p>
            <p className="text-sm font-bold text-gray-800">{detailData.mitraCSR}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Proyek Rehabilitasi</p>
            <p className="text-sm font-bold text-gray-800">{detailData.proyek}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Tahapan Laporan</p>
            <p className="text-sm font-bold text-gray-800">{detailData.tahapan}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-gray-800 mb-4 text-base">Rincian Anggaran yang Dilaporkan KTH</h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl max-w-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#eff2ef] text-gray-600 font-semibold">
                <tr>
                  <th className="px-5 py-3">Kategori Pengeluaran</th>
                  <th className="px-5 py-3 text-right">Nominal Realisasi Lapangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailData.rincianAnggaran.map((item, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="px-5 py-4 text-gray-800">{item.kategori}</td>
                    <td className="px-5 py-4 text-right font-bold text-gray-800">{item.nominal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-10 pb-8 border-b border-gray-100 space-y-3">
          <div className="flex items-center text-sm">
            <span className="w-56 text-gray-500">Total Pengeluaran Tahap 1</span>
            <span className="font-bold text-gray-800">: {detailData.summary.totalPengeluaran}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-56 text-gray-500">Sisa Saldo Dana CSR</span>
            <span className="font-bold text-gray-800">: {detailData.summary.sisaSaldo}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-56 text-gray-500">Dokumen Bukti Pendukung</span>
            <span className="font-bold underline text-gray-800 cursor-pointer hover:text-[#185325]">
              : {detailData.summary.dokumenBukti}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-56 text-gray-500">Total Bibit Tertanam</span>
            <span className="font-bold text-gray-800">: {detailData.summary.totalBibit}</span>
          </div>
        </div>

        {/* Catatan Verifikasi */}
        <div className="mb-12 text-sm flex items-start gap-2">
          <span className="w-48 text-gray-500 shrink-0">Catatan Verifikasi Staff</span>
          <span className="text-gray-800 italic flex-1">
            : {detailData.catatanStaff}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8">
          <button 
            onClick={handleTolak}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            <HiOutlineXCircle className="w-5 h-5" /> Tolak / Kembalikan
          </button>
          
          <button 
            onClick={handleSetuju}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm"
          >
            <HiOutlineCheckCircle className="w-5 h-5" /> Setuju & Terbitkan Rekomendasi
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailVerifikasiDanaCSRKABID;