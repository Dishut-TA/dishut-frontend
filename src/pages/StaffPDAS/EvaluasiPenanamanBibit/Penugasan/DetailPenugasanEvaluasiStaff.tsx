import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineDocumentArrowDown,
  HiOutlineMapPin,
  HiOutlineUsers
} from 'react-icons/hi2';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

const DetailPenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/evaluasi/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        setData(json.data || null);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Memuat data...</div>;
  if (!data) return <div className="p-8 text-center text-sm text-gray-400">Data penugasan tidak ditemukan</div>;

  const program = data.penugasanable;
  const programName = program?.name || program?.nama_program || '-';
  const lokasi = program?.location || program?.lokasi || '-';
  const jenisProgram = data.penugasanable_type?.split('\\').pop() || '-';
  const isSelesai = data.status === 'Monitoring Selesai';

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Penugasan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 border ${
              isSelesai ? 'bg-emerald-50 text-[#185325] border-emerald-200' : 'bg-[#FEF3C7] text-yellow-800 border-yellow-200'
            }`}>
              {data.status}
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
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4 flex items-center gap-2">
            <HiOutlineDocumentArrowDown className="w-5 h-5" /> 1. Metadata Surat & Program
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 bg-[#f8fbf9] border border-[#DCECE0] rounded-2xl p-6">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Nomor Penugasan</p>
              <p className="text-sm font-bold text-gray-800">TGS-{data.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Penugasan</p>
              <p className="text-sm font-bold text-gray-800">{data.tanggal_penugasan ? new Date(data.tanggal_penugasan).toLocaleDateString('id-ID') : '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Program Rehabilitasi (Target Evaluasi)</p>
              <p className="text-base font-bold text-[#185325]">{programName}</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mt-1.5">
                <HiOutlineMapPin className="w-4 h-4" /> {lokasi}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tahap / Periode Evaluasi</p>
              <p className="text-sm font-bold text-gray-800">{data.periode_monitoring || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pendanaan</p>
              <p className="text-sm font-bold text-gray-800">{jenisProgram}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Mulai Penugasan</p>
              <p className="text-sm font-bold text-gray-800">{data.tanggal_mulai ? new Date(data.tanggal_mulai).toLocaleDateString('id-ID') : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Batas Waktu Penugasan</p>
              <p className="text-sm font-bold text-gray-800">{data.batas_waktu ? new Date(data.batas_waktu).toLocaleDateString('id-ID') : '-'}</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4 flex items-center gap-2">
            <HiOutlineUsers className="w-5 h-5" /> 2. Petak Ukur yang Akan Dievaluasi
          </h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Kode PU</th>
                  <th className="px-5 py-3">Bibit Ditanam (Rencana)</th>
                  <th className="px-5 py-3 text-center">Status Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data.petakUkurs || []).map((pu: any) => (
                  <tr key={pu.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-800">{pu.nama}</td>
                    <td className="px-5 py-4 text-gray-600">{pu.dataTanamans?.length || 0} tanaman</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pu.eval_at ? 'bg-[#DCECE0] text-[#185325] border border-[#C6EBD6]' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {pu.eval_at ? 'Sudah Dievaluasi' : 'Belum Dievaluasi'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(data.petakUkurs || []).length === 0 && (
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
              onClick={() => navigate(`/admin/staff/evaluasi/data/create/${id}`)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md transition-colors active:scale-95 shrink-0"
            >
              Mulai Input Data Lapangan
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailPenugasanEvaluasiStaff;