import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineCheckCircle, HiOutlinePencil } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanaByIdAPI, updateStatusLaporanAPI } from '@/services/laporan-dana.service';

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const DetailVerifikasiLaporanDanaSTAFF: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [data, setData] = useState<any>(null);
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await getLaporanDanaByIdAPI(id);
          setData(res);
          setCatatan(res.catatan || '');
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail verifikasi laporan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAction = async (status: string) => {
    if (status === 'Revisi' && !catatan.trim()) {
      return toast.error('Harap isi catatan verifikasi sebelum meminta revisi.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses status laporan...');
    try {
      await updateStatusLaporanAPI(id!, { status, catatan });
      toast.success(status === 'Terverifikasi' ? 'Laporan dana berhasil diverifikasi!' : 'Berkas dikembalikan untuk direvisi.', { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui status laporan.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val || 0));
  };

  const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] mb-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-500">:</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail verifikasi...
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const isMenunggu = data.status === 'Menunggu Verifikasi';

  const year = data.created_at ? new Date(data.created_at).getFullYear() : new Date().getFullYear();
  const paddedId = String(data.program_id || data.id).padStart(3, '0');
  const formattedId = `P-${data.sumber_dana}-${year}-${paddedId}`;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 px-4 sm:px-0 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800 inline-block pb-1">
            Detail Verifikasi {formattedId}
          </h1>
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 text-base">
            Informasi Program
          </h3>
          <InfoRow label="Nama Program" value={data.nama_program} />
          <InfoRow label="Tahap" value={data.tahap} />
          <InfoRow label="Sumber Dana" value={data.sumber_dana} />
          <InfoRow label="Dana Disalurkan" value={formatRupiah(data.dana_disalurkan)} />
          <InfoRow label="Total Realisasi" value={formatRupiah(data.dana_direalisasikan)} />
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 text-base">
            Rincian Penggunaan Dana
          </h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm mb-4 border-b border-gray-200">
              <thead className="border-y border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 font-semibold px-2 w-1/3">KEGIATAN</th>
                  <th className="py-4 font-semibold text-center w-1/4">NOMINAL</th>
                  <th className="py-4 font-semibold text-center">BUKTI TRANSAKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.rincian?.map((rin: any) => (
                  <tr key={rin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2 text-gray-800 font-bold">{rin.kategori_kegiatan}</td>
                    <td className="py-4 text-gray-800 text-center">{formatRupiah(rin.nominal)}</td>
                    <td className="py-4 text-center">
                      {rin.bukti_transaksi_path ? (
                        <a 
                          href={`${STORAGE_URL}${rin.bukti_transaksi_path}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#185325] underline hover:text-[#113d1c] font-semibold transition-colors"
                        >
                          Lihat Bukti Nota
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isMenunggu ? (
          <div className="animate-in fade-in duration-300 mt-12 pt-6 border-t border-gray-100">
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                Catatan Verifikasi / Alasan Revisi
              </h3>
              <div className="relative">
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Bukti nota kurang jelas atau nominal tidak sesuai..."
                  maxLength={200}
                  className="w-full h-28 p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] resize-none text-gray-700 bg-white"
                />
                <div className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-medium">
                  {catatan.length}/200
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8">
              <button 
                disabled={isSubmitting}
                onClick={() => handleAction('Revisi')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <HiOutlinePencil className="w-4 h-4" /> Minta Revisi
              </button>
              
              <button 
                disabled={isSubmitting}
                onClick={() => handleAction('Terverifikasi')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <HiOutlineCheckCircle className="w-5 h-5" /> Verifikasi
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-3 pt-6 border-t border-gray-100 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-800 text-base">Status :</span>
              <span className={`font-bold text-base ${data.status === 'Terverifikasi' ? 'text-[#185325]' : 'text-red-600'}`}>
                {data.status}
              </span>
            </div>
            {data.catatan && (
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">Catatan Staff: </span> 
                <span className="italic">{data.catatan}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailVerifikasiLaporanDanaSTAFF;