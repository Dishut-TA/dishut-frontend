import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineDocumentArrowDown,
  HiOutlineMapPin,
  HiOutlineUsers
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getPenugasanEvaluasiDetail, mulaiPenugasanEvaluasi } from '@/services/penugasanEvaluasi.service';

const DetailPenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false); 

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getPenugasanEvaluasiDetail(id!);
        setData(res.data || null);
      } catch (e) {
        console.error(e);
        toast.error('Gagal memuat detail penugasan.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleMulaiInput = async () => {
    const statusSaatIni = data?.status_penugasan || data?.status;

    if (statusSaatIni === 'Menunggu Pelaksanaan') {
      setIsStarting(true);
      const loadingToast = toast.loading('Menyiapkan formulir evaluasi...');
      try {
        await mulaiPenugasanEvaluasi(id!);
        toast.success('Status diubah menjadi Sedang Evaluasi!', { id: loadingToast });
        navigate(`/admin/staff/evaluasi/hasil`);
      } catch (error) {
        toast.error('Gagal memulai evaluasi. Coba lagi.', { id: loadingToast });
        setIsStarting(false);
      }
    } else {
      navigate(`/admin/staff/evaluasi/hasil`);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Memuat data...</div>;
  if (!data) return <div className="p-8 text-center text-sm text-gray-400">Data penugasan tidak ditemukan</div>;

  const statusTugas = data.status_penugasan || data.status || 'Menunggu Pelaksanaan';
  const isSelesai = statusTugas === 'Monitoring Selesai' || statusTugas === 'Selesai' || statusTugas === 'Selesai Evaluasi';
  const formattedTanggalSurat = data.tanggal_surat ? data.tanggal_surat.split('T')[0] : '-';
  const petakUkursData = data.petak_ukurs || data.petakUkurs || [];

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors cursor-pointer">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Penugasan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 border ${
              isSelesai ? 'bg-emerald-50 text-[#185325] border-emerald-200' : 'bg-[#FEF3C7] text-yellow-800 border-yellow-200'
            }`}>
              {statusTugas}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detail Surat Tugas Evaluasi</h1>
            <p className="text-sm text-gray-500 mt-1">Harap tinjau dokumen ini sebelum melakukan kunjungan lapangan.</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500 font-medium">ID Penugasan</p>
            <p className="text-sm font-bold text-[#185325]">TGS-{data.id}</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineDocumentArrowDown className="w-5 h-5" /> 1. Metadata Surat & Program
            </h3>
            {data.file_surat_tugas && (
              <button 
                onClick={() => window.open(data.file_surat_tugas, '_blank')}
                className="text-xs font-bold text-[#185325] hover:text-white hover:bg-[#185325] border border-[#185325] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlineDocumentArrowDown className="w-4 h-4" /> Buka PDF Surat Tugas
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 bg-[#f8fbf9] border border-[#DCECE0] rounded-2xl p-6">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Nomor Surat Tugas</p>
              <p className="text-sm font-bold text-gray-800">{data.nomor_surat || `TGS-${data.id}`}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Surat Tugas</p>
              <p className="text-sm font-bold text-gray-800">{formattedTanggalSurat}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Program Rehabilitasi (Target Evaluasi)</p>
              <p className="text-base font-bold text-[#185325]">{data.nama_proyek_lokasi?.split(' - ')[0] || '-'}</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mt-1.5">
                <HiOutlineMapPin className="w-4 h-4" /> {data.nama_proyek_lokasi?.split(' - ').slice(1).join(' - ') || '-'}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tahap / Periode Evaluasi</p>
              <p className="text-sm font-bold text-gray-800">{data.periode_evaluasi || data.tahap_evaluasi || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pendanaan</p>
              <p className="text-sm font-bold text-gray-800">{data.jenis_program || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Luas Usulan Lahan</p>
              <p className="text-sm font-bold text-gray-800">{data.luas ? `${data.luas} Ha` : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Target Bibit (Rencana Awal)</p>
              <p className="text-sm font-bold text-gray-800">
                {data.target_bibit ? `${Number(data.target_bibit).toLocaleString('id-ID')} Pohon` : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4 flex items-center gap-2">
            <HiOutlineUsers className="w-5 h-5" /> 2. Petak Ukur yang Akan Dievaluasi
          </h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3">Kode PU</th>
                  <th className="px-5 py-3">Bibit Ditanam (Riwayat Penanaman)</th>
                  <th className="px-5 py-3 text-center">Status Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {petakUkursData.map((pu: any) => {
                  const dataTanamans = pu.data_tanamans || pu.dataTanamans || [];
                  const totalBibit = pu.total_bibit_ditanam ?? dataTanamans.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0);
                  const isEvaluated = Boolean(pu.eval_at);

                  return (
                    <tr key={pu.id} className="hover:bg-gray-50 transition-colors ">
                      <td className="px-5 py-4 font-bold text-gray-800">{pu.nama}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium">
                        {totalBibit > 0 ? `${Number(totalBibit).toLocaleString('id-ID')} pohon` : `${dataTanamans.length} jenis tanaman`}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isEvaluated ? 'bg-[#DCECE0] text-[#185325] border border-[#C6EBD6]' : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          {isEvaluated ? 'Sudah Dievaluasi' : 'Belum Dievaluasi'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {petakUkursData.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-gray-400">Belum ada Petak Ukur pada penugasan pelaksanaan sebelumnya</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-2xl border">
          <div className="text-left w-full md:w-auto">
            <h4 className="text-sm font-bold text-gray-800">{isSelesai ? 'Evaluasi sudah diselesaikan' : 'Tugas sudah dibaca dan dipahami?'}</h4>
            <p className="text-xs text-gray-500 mt-1">{isSelesai ? 'Data evaluasi lapangan sudah tersimpan.' : 'Lanjutkan ke tahap perhitungan jika Anda sedang berada di lapangan.'}</p>
          </div>
          {!isSelesai && (
            <button 
              onClick={handleMulaiInput}
              disabled={isStarting}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md transition-colors active:scale-95 shrink-0 cursor-pointer disabled:opacity-70"
            >
              {isStarting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Memproses...</>
              ) : (
                statusTugas === 'Menunggu Pelaksanaan' ? 'Mulai Input Data Lapangan' : 'Lanjutkan Input Data Lapangan'
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailPenugasanEvaluasiStaff;