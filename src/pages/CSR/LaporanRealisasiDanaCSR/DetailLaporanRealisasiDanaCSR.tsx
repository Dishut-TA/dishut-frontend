import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';

const STORAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const DetailLaporanKeuangan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const allReports = await getLaporanDanasAPI();
          const programReports = allReports.filter((r: any) => 
            String(r.program_id) === String(id) && 
            r.sumber_dana?.toUpperCase() === 'CSR'
          );
          
          programReports.sort((a: any, b: any) => a.id - b.id);
          
          setReports(programReports);
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail laporan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
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
      <div className="flex justify-center items-center h-48 text-[#185325]">
        <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3 border-[#185325]"></span> Memuat...
      </div>
    );
  }

  if (reports.length === 0) {
    return <div className="text-center text-gray-500 py-10">Data laporan tidak ditemukan.</div>;
  }

  const baseData = reports[0];
  const danaDisalurkan = Number(baseData.dana_disalurkan);
  
  const totalRealisasi = reports.reduce((sum, rep) => sum + Number(rep.dana_direalisasikan), 0);
  const sisaDana = danaDisalurkan - totalRealisasi;

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12 w-full font-sans animate-in fade-in duration-300">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors print:hidden cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-[#FAFBF9] rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border border-gray-100 p-4 sm:p-8 md:p-12 print:p-0 print:shadow-none print:bg-white text-gray-900">
        
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
          Detail Realisasi Penggunaan Dana
        </h1>

        <div className="mb-10">
          <h3 className="font-bold text-gray-900 mb-4 text-base">Informasi Program</h3>
          <div className="grid grid-cols-[140px_10px_1fr] md:grid-cols-[180px_10px_1fr] gap-y-3 text-sm">
            <span className="text-gray-600">Nama Program</span><span>:</span><span className="font-bold">{baseData.nama_program}</span>
            <span className="text-gray-600">Lokasi</span><span>:</span><span className="font-bold">Bandung Barat</span>
            <span className="text-gray-600">KTH</span><span>:</span><span className="font-bold">KTH Rimba</span>
            <span className="text-gray-600">Dana Disalurkan</span><span>:</span><span className="font-bold">{formatRupiah(danaDisalurkan)}</span>
            <span className="text-gray-600">Dana Direalisasi</span><span>:</span><span className="font-bold">{formatRupiah(totalRealisasi)}</span>
            <span className="text-gray-600">Sisa Dana</span><span>:</span><span className="font-bold">{formatRupiah(sisaDana)}</span>
          </div>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-sm bg-[#F4F6F4] px-4 py-2.5 border-l-4 border-[#185325]">
              {report.tahap} - Rincian Pengeluaran
            </h3>
            
            <table className="w-full text-left text-sm mb-4">
              <thead className="text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
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
                    <td className="py-4 text-center text-gray-700">{formatDate(report.tanggal_pengeluaran)}</td>
                    <td className="py-4 text-right text-gray-800">{formatRupiah(item.nominal)}</td>
                    <td className="py-4 text-center">
                      {item.bukti_transaksi_path ? (
                        <a 
                          href={`${STORAGE_BASE_URL}${item.bukti_transaksi_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#185325] underline hover:text-green-800 font-medium text-xs"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 text-center text-gray-800">✓</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 pb-2 border-b border-gray-100 border-dashed">
              <p className="font-bold text-gray-900 text-sm">Subtotal {report.tahap}</p>
              <p className="font-medium text-gray-800">{formatRupiah(report.dana_direalisasikan)}</p>
            </div>
          </div>
        ))}

        <div className="bg-[#DCECE0] rounded-xl p-6 md:p-8 mt-12 mb-8 border border-[#b2d6bc]">
          <h3 className="font-bold text-gray-900 mb-6 text-base border-b border-[#a9c9b3] pb-3">Ringkasan</h3>
          
          <div className="grid grid-cols-[140px_10px_1fr] md:grid-cols-[160px_10px_1fr] gap-y-3 text-sm">
            <span className="text-gray-700">Dana Disalurkan</span><span>:</span><span className="font-bold text-gray-900">{formatRupiah(danaDisalurkan)}</span>
            
            {reports.map(rep => (
              <React.Fragment key={`sum-${rep.id}`}>
                 <span className="text-gray-700">{rep.tahap}</span><span>:</span><span className="font-medium text-gray-800">{formatRupiah(rep.dana_direalisasikan)}</span>
              </React.Fragment>
            ))}
            
            <div className="col-span-3 h-3 border-b border-[#a9c9b3] mb-1"></div>
            
            <span className="text-gray-900 font-bold">Total Realisasi</span><span className="font-bold text-gray-900">:</span><span className="font-bold text-gray-900">{formatRupiah(totalRealisasi)}</span>
            <span className="text-gray-900 font-bold">Sisa Dana</span><span className="font-bold text-gray-900">:</span><span className="font-bold text-gray-900">{formatRupiah(sisaDana)}</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            <HiPrinter className="w-5 h-5" /> Cetak Laporan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailLaporanKeuangan;