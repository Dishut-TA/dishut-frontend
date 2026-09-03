import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdByIdAPI } from '@/services/program-apbd.service';
import { getProgramCsrByIdAPI } from '@/services/program-csr.service';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const DetailRiwayatRehabilitasiKABID: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [programData, setProgramData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const [tipePendanaan, dbId] = id.split('-'); 

        let progData;
        if (tipePendanaan === 'APBD') {
          const res = await getProgramApbdByIdAPI(dbId);
          progData = res.data || res.payload || res;
        } else {
          const res = await getProgramCsrByIdAPI(dbId);
          progData = res.data || res.payload || res;
        }

        setProgramData({
          ...progData,
          tipe_pendanaan: tipePendanaan, 
        });

        const allReports = await getLaporanDanasAPI();
        const filteredReports = allReports.filter((r: any) => 
          String(r.program_id) === String(dbId) && 
          r.sumber_dana?.toUpperCase() === tipePendanaan
        );

        filteredReports.sort((a: any, b: any) => a.id - b.id);
        setReports(filteredReports);

      } catch (error) {
        toast.error("Gagal memuat detail riwayat rehabilitasi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail riwayat...
      </div>
    );
  }

  if (!programData) {
    return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;
  }

  const danaDisalurkan = Number(programData.anggaran) || 0;
  const totalRealisasi = reports.reduce((sum, rep) => sum + Number(rep.dana_direalisasikan), 0);
  const sisaDana = danaDisalurkan - totalRealisasi;

  const isTahap1Selesai = reports.some(r => r.tahap?.includes('1'));
  const isTahap2Selesai = reports.some(r => r.tahap?.includes('2'));
  const isTahap3Selesai = reports.some(r => r.tahap?.includes('3'));

  const getTahapStatus = (isSelesai: boolean, isProgramDihentikan: boolean) => {
    if (isSelesai) return 'Selesai';
    if (isProgramDihentikan) return 'Dihentikan';
    return 'Belum Mulai';
  };

  const isDihentikan = programData.status?.toLowerCase().includes('dihentikan');

  const year = programData.created_at ? new Date(programData.created_at).getFullYear() : new Date().getFullYear();
  const paddedId = String(programData.id).padStart(3, '0');
  const formattedId = `P-${programData.tipe_pendanaan}-${year}-${paddedId}`;

  const renderStatusBadge = (status: string) => {
    const baseStyle = "px-4 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-block";
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Menunggu Persetujuan':
        return <span className={`${baseStyle} bg-amber-100 text-amber-800`}>{status}</span>;
      case 'Terverifikasi':
        return <span className={`${baseStyle} bg-emerald-100 text-emerald-800 border border-emerald-200`}>{status}</span>;
      case 'Selesai':
      case 'Disetujui':
        return <span className={`${baseStyle} bg-emerald-600 text-white`}>{status}</span>;
      case 'Aktif':
      case 'Berjalan':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`}>{status}</span>;
      case 'Ditolak':
      case 'Dihentikan':
      case 'Revisi':
        return <span className={`${baseStyle} bg-red-100 text-red-700 border border-red-200`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status || '-'}</span>;
    }
  };

  const InfoRow = ({ label, value, isStatus = false }: { label: string, value: string | number, isStatus?: boolean }) => (
    <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] mb-3 text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-500">:</span>
      {isStatus ? (
        <span className="flex-1">{renderStatusBadge(String(value))}</span>
      ) : (
        <span className="font-bold text-gray-800">{value}</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 text-gray-800 px-4 sm:px-0 animate-in fade-in duration-300">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#2E7D32] transition-colors cursor-pointer print:hidden"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
      </div>

      <div className="bg-[#FAFBF9] rounded-none sm:rounded-2xl shadow-none sm:shadow-sm border-0 sm:border border-gray-100 p-6 md:p-10 print:p-0 print:shadow-none print:bg-white text-gray-900">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">
          Laporan Riwayat Rehabilitasi
        </h1>

        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-4">Informasi Program</h3>
          <InfoRow label="ID Program" value={formattedId} />
          <InfoRow label="Nama Program" value={programData.nama_program} />
          <InfoRow label="Lokasi" value={programData.lokasi || 'Tidak ada data lokasi'} />
          <InfoRow label="KTH" value={programData.kth?.nama || 'KTH Rimba'} />
          <InfoRow label="Sumber Dana" value={programData.tipe_pendanaan} />
          <InfoRow label="Mitra" value={programData.tipe_pendanaan === 'APBD' ? 'Dinas Kehutanan Jabar' : (programData.rekomendasi_mitra || 'Mitra CSR')} />
          <InfoRow label="Luas Lahan" value={`${programData.target_luas_lahan || '-'} Ha`} />
          <InfoRow label="Dana Disalurkan" value={formatRupiah(danaDisalurkan)} />
          <InfoRow label="Dana Direalisasikan" value={formatRupiah(totalRealisasi)} />
          <InfoRow label="Sisa Dana" value={formatRupiah(sisaDana)} />
          <InfoRow label="Status" value={programData.status} isStatus />
        </div>

        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-4">Progress Tahapan</h3>
          <InfoRow label="Persiapan Lahan" value={getTahapStatus(isTahap1Selesai, isDihentikan)} isStatus />
          <InfoRow label="Pembibitan & Penanaman" value={getTahapStatus(isTahap2Selesai, isDihentikan)} isStatus />
          <InfoRow label="Perawatan & Pemeliharaan" value={getTahapStatus(isTahap3Selesai, isDihentikan)} isStatus />
        </div>

        {isDihentikan && (
          <div className="mb-10">
            <h3 className="text-base font-bold text-gray-800 mb-4">Alasan Program Dihentikan</h3>
            <p className="text-sm text-gray-700">{programData.catatan || 'Program tidak memenuhi kriteria kelanjutan rehabilitasi atau bermasalah dalam pelaporan.'}</p>
          </div>
        )}

        {reports.length > 0 ? reports.map((report) => (
          <div key={report.id} className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 mb-4 bg-gray-100/50 py-2 border-b border-gray-200">
              {report.tahap} - Rincian Pengeluaran
            </h3>
            <table className="w-full text-left text-sm mb-4">
              <thead className="border-y border-gray-200 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 font-semibold w-2/5">KEGIATAN</th>
                  <th className="py-3 font-semibold text-center">TANGGAL</th>
                  <th className="py-3 font-semibold text-right">NOMINAL</th>
                  <th className="py-3 font-semibold text-center">BUKTI TRANSAKSI</th>
                  <th className="py-3 font-semibold text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                {report.rincian?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4 font-bold text-gray-800">{item.kategori_kegiatan}</td>
                    <td className="py-4 text-center text-gray-600">{formatDate(report.tanggal_pengeluaran)}</td>
                    <td className="py-4 text-right text-gray-600">{formatRupiah(item.nominal)}</td>
                    <td className="py-4 text-center">
                      {item.bukti_transaksi_path ? (
                        <a 
                          href={`${STORAGE_BASE_URL}${item.bukti_transaksi_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#185325] underline hover:text-green-800 text-xs font-medium"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {renderStatusBadge(report.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <p className="text-sm text-gray-800 font-bold mb-1">Subtotal {report.tahap}</p>
            <p className="text-sm text-gray-600">{formatRupiah(report.dana_direalisasikan)}</p>
          </div>
        )) : (
          <div className="mb-10 text-center py-6 border border-gray-200 border-dashed rounded-xl text-gray-500 text-sm">
            Belum ada laporan pengeluaran dana yang tercatat untuk program ini.
          </div>
        )}

        {reports.length > 0 && (
          <div className="bg-[#DCECE0]/70 rounded-xl p-6 md:p-8 mt-10">
            <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-[#b2d6bc] pb-2">Rekapitulasi Total</h3>
            <div className="border-b border-[#b2d6bc] pb-4 mb-4">
              {reports.map((rep) => (
                <InfoRow key={`sum-${rep.id}`} label={rep.tahap} value={formatRupiah(rep.dana_direalisasikan)} />
              ))}
            </div>
            <InfoRow label="Total Realisasi" value={formatRupiah(totalRealisasi)} />
            
            <div className="flex justify-end mt-8 print:hidden">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-8 py-3 bg-[#185325] text-white font-bold rounded-full hover:bg-[#123d1c] transition-colors active:scale-95 shadow-sm text-sm cursor-pointer"
              >
                <HiPrinter className="w-5 h-5" /> Cetak Laporan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailRiwayatRehabilitasiKABID;