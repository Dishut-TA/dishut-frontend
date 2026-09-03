import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramApbdByIdAPI } from '@/services/program-apbd.service';
import { getProgramCsrByIdAPI } from '@/services/program-csr.service';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

const DetailRiwayatRehabilitasi: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [laporanDanas, setLaporanDanas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailAndLaporan = async () => {
      try {
        if (!id) return;

        const [source, sourceId] = id.split('-'); 
        let rawData = null;

        // 1. Fetch Master Program (APBD / CSR)
        if (source === 'APBD') {
          const res = await getProgramApbdByIdAPI(sourceId);
          rawData = res.data || res.payload || res;
          
          setData({
            id: id,
            nama: rawData.nama_program,
            lokasi: rawData.kth?.desa_kelurahan ? `${rawData.kth.desa_kelurahan}, ${rawData.kth.kabupaten_kota}` : '-',
            kth: rawData.kth?.nama,
            pilihan_intervensi: rawData.pilihan_intervensi || 'Agroforesty',
            sumberDana: 'APBD',
            mitra: 'Dinas Kehutanan Jabar',
            luasLahan: `${rawData.target_luas_lahan} Ha`,
            danaDisalurkan: rawData.anggaran,
            status: rawData.status,
            catatan: rawData.catatan_staff || ''
          });
        } else if (source === 'CSR') {
          const res = await getProgramCsrByIdAPI(sourceId);
          rawData = res.data || res.payload || res;
          
          setData({
            id: id,
            nama: rawData.nama_program,
            lokasi: rawData.lokasi || (rawData.kth?.desa_kelurahan ? `${rawData.kth.desa_kelurahan}, ${rawData.kth.kabupaten_kota}` : '-'),
            kth: rawData.kth?.nama,
            pilihan_intervensi: rawData.rekomendasi_intervensi || 'Agroforesty',
            sumberDana: 'CSR',
            mitra: rawData.rekomendasi_mitra || 'Seluruh Mitra CSR',
            luasLahan: `${rawData.target_luas_lahan} Ha`,
            danaDisalurkan: rawData.anggaran,
            status: rawData.status,
            catatan: rawData.catatan_staff || rawData.tanggapan_perusahaan || 'Program tidak memenuhi target rehabilitasi sesuai ketentuan'
          });
        }

        // 2. Fetch Laporan Dana Terkait
        const laporanRes = await getLaporanDanasAPI();
        
        // Filter laporan yang sesuai dengan ID program dan Sumber Dana saat ini
        const relatedLaporan = laporanRes.filter((l: any) => 
          l.sumber_dana === source && String(l.program_id) === String(sourceId)
        );
        
        // Urutkan laporan berdasarkan ID (atau tanggal_pengeluaran) agar terstruktur
        const sortedLaporan = relatedLaporan.sort((a: any, b: any) => a.id - b.id);
        setLaporanDanas(sortedLaporan);

      } catch (error: any) {
        toast.error("Gagal memuat detail riwayat dan laporan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailAndLaporan();
  }, [id]);

  const InfoRow = ({ label, value, isStatus = false }: { label: string, value: string, isStatus?: boolean }) => {
    let textColor = 'text-gray-800';
    if (isStatus) {
      const lower = value.toLowerCase();
      if (lower.includes('selesai')) textColor = 'text-[#2E7D32]';
      else if (lower.includes('berjalan') || lower.includes('aktif')) textColor = 'text-orange-500';
      else if (lower.includes('henti') || lower.includes('tolak')) textColor = 'text-red-600';
    }

    return (
      <div className="flex items-start mb-4 text-sm">
        <span className="w-48 md:w-56 shrink-0 text-gray-600">{label}</span>
        <span className="w-8 shrink-0 text-gray-600 text-center">:</span>
        <span className={`flex-1 font-semibold ${textColor}`}>{value || '-'}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail riwayat...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  // Hitung total dana direalisasikan dari Laporan yang berstatus "Terverifikasi" atau "Menunggu Verifikasi"
  const totalRealisasi = laporanDanas
    .filter((l: any) => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status))
    .reduce((sum: number, l: any) => sum + Number(l.dana_direalisasikan), 0);

  const sisaDana = Number(data.danaDisalurkan) - totalRealisasi;

  const isSelesai = data.status === 'Selesai';
  const isDihentikan = data.status.toLowerCase().includes('henti') || data.status.toLowerCase().includes('tolak');

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 text-gray-800 px-4 sm:px-0 animate-in fade-in duration-300">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-bold hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-10">
          {isSelesai ? 'Laporan Riwayat Pendanaan Rehabilitasi' : 'Halaman Detail Program'}
        </h1>

        {/* SECTION: INFORMASI PROGRAM */}
        <div className="mb-10">
          <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">Informasi Program</h3>
          <InfoRow label="ID Program" value={data.id} />
          <InfoRow label="Nama Program" value={data.nama} />
          <InfoRow label="Lokasi" value={data.lokasi} />
          <InfoRow label="KTH Pengusul" value={data.kth} />
          <InfoRow label="Rekomendasi Intervensi" value={data.pilihan_intervensi} />
          <InfoRow label="Sumber Dana" value={data.sumberDana} />
          <InfoRow label="Mitra CSR" value={data.mitra} />
          <InfoRow label="Luas Lahan" value={data.luasLahan} />
          <InfoRow label="Dana Disalurkan" value={formatRupiah(data.danaDisalurkan)} />
          <InfoRow label="Dana Direalisasikan" value={formatRupiah(totalRealisasi)} />
          <InfoRow label="Sisa Dana" value={formatRupiah(sisaDana)} />
          <InfoRow label="Status" value={data.status} isStatus />
        </div>

        {/* SECTION: TABEL LAPORAN (Dinamis dari Database) */}
        {laporanDanas.length > 0 ? (
          <div className="mb-10">
            <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">Rincian Penggunaan Dana per Tahap</h3>
            
            {laporanDanas.map((laporan: any, _index: number) => (
              <div key={laporan.id} className="mb-10 border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                <h4 className="text-sm font-bold text-gray-800 mb-4">
                  {laporan.tahap} - Dilaporkan pada {new Date(laporan.tanggal_pengeluaran).toLocaleDateString('id-ID')}
                </h4>
                
                <table className="w-full text-left text-sm mb-4">
                  <thead className="border-y border-gray-300 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="py-3 font-bold px-2 w-1/3">KEGIATAN</th>
                      <th className="py-3 font-bold w-1/4">STATUS NOTA</th>
                      <th className="py-3 font-bold text-right w-1/4">NOMINAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-300">
                    {laporan.rincian?.map((rin: any) => (
                      <tr key={rin.id}>
                        <td className="py-4 px-2 text-gray-800 font-semibold">{rin.kategori_kegiatan}</td>
                        <td className="py-4 text-gray-600">
                          {rin.bukti_transaksi_path ? (
                            <a href={`${STORAGE_URL}${rin.bukti_transaksi_path}`} target="_blank" rel="noreferrer" className="text-[#185325] underline italic font-medium hover:text-[#113d1c]">
                              Lihat Nota
                            </a>
                          ) : '-'}
                        </td>
                        <td className="py-4 text-gray-800 font-medium text-right">{formatRupiah(rin.nominal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center px-2">
                  <p className="text-sm font-semibold text-gray-600 mb-2 md:mb-0">
                    Status Laporan: <span className={laporan.status === 'Terverifikasi' ? 'text-[#2E7D32]' : laporan.status === 'Revisi' ? 'text-red-600' : 'text-orange-500'}>{laporan.status}</span>
                  </p>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Subtotal {laporan.tahap}</p>
                    <p className="text-base text-[#185325] font-bold">{formatRupiah(laporan.dana_direalisasikan)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="mb-10">
             <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">Rincian Penggunaan Dana</h3>
             <p className="text-sm text-gray-500 italic">Belum ada laporan dana yang diajukan untuk program ini.</p>
           </div>
        )}

        {isDihentikan && (
          <div className="mb-10">
            <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Alasan Program Dihentikan</h3>
            <p className="text-sm text-gray-700">{data.catatan}</p>
          </div>
        )}

        <div className="bg-[#EBF8F1] rounded-xl p-6 md:p-8 mt-12 border border-[#C6EBD6]">
          <h3 className="text-sm font-bold text-gray-800 mb-6 border-b border-gray-300 pb-3">Rekapitulasi Keseluruhan</h3>
          
          <div className="space-y-4 mb-6 border-b border-gray-300 pb-6">
            {laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).length > 0 ? (
              laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).map((l: any, idx: number) => (
                <div key={idx} className="flex items-start text-sm">
                  <span className="w-32 md:w-40 text-gray-700">{l.tahap}</span>
                  <span className="w-6 text-gray-700">:</span>
                  <span className="text-gray-800 font-semibold">{formatRupiah(l.dana_direalisasikan)}</span>
                </div>
              ))
            ) : (
               <p className="text-sm text-gray-500 italic">Belum ada data realisasi valid.</p>
            )}
          </div>

          <div className="flex items-start text-sm">
            <span className="w-32 md:w-40 font-bold text-gray-800">Total Realisasi</span>
            <span className="w-6 font-bold text-gray-800">:</span>
            <span className="font-bold text-[#185325] text-base">{formatRupiah(totalRealisasi)}</span>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-3 bg-[#185325] text-white font-bold rounded-full hover:bg-[#123d1c] transition-colors active:scale-95 shadow-sm text-sm cursor-pointer"
          >
            <HiPrinter className="w-5 h-5" /> Cetak Laporan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailRiwayatRehabilitasi;