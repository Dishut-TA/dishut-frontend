import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineDocumentArrowDown,
  HiOutlineMapPin,
  HiOutlineUsers
} from 'react-icons/hi2';

const DetailPenugasanEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data detail (sifatnya Read-Only untuk Staff)
  const detailData = {
    noSurat: 'ST.76/TKTRH/RRPKH/DAS.04.03/B/03/2026',
    tanggalSurat: '11 Maret 2026',
    program: 'Rehabilitasi DAS A.N SKK Migas - PT Pertamina EP',
    jenisProgram: 'CSR',
    lokasi: 'Kec. Kasokandel, Kab. Majalengka',
    periode: 'Penanaman Awal (P0)',
    tanggal_awal: '26 Feb 2026', 
    tanggal_akhir: '26 Feb 2027', 
    filePdf: 'Surat_Tugas_Evaluasi_Pertamina.pdf',
    statusTugas: 'MENUNGGU EVALUASI',
    tim: [
      { nama: 'Srie Resmita Dewi, SP., MP', peran: 'Ketua Tim', email: 'srie@pdas.go.id' },
      { nama: 'Andi Mansur, S.P', peran: 'Anggota Tim', email: 'andi@pdas.go.id' },
    ]
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Penugasan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] text-yellow-800 border border-yellow-200 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3">
              Tugas Baru Belum Dikerjakan
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detail Surat Tugas Evaluasi</h1>
            <p className="text-sm text-gray-500 mt-1">Harap tinjau dokumen ini sebelum melakukan kunjungan lapangan.</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500 font-medium">ID Penugasan</p>
            <p className="text-sm font-bold text-[#185325]">{id || 'ST-001'}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4 flex items-center gap-2">
            <HiOutlineDocumentArrowDown className="w-5 h-5" /> 1. Metadata Surat & Program
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 bg-[#f8fbf9] border border-[#DCECE0] rounded-2xl p-6">
            
            <div className="md:col-span-2 flex justify-between items-center border-b border-gray-200 pb-4 mb-2">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Download Lampiran Resmi</p>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors group">
                  <span className="bg-blue-100 p-1.5 rounded-md group-hover:bg-blue-200 transition-colors">
                    <HiOutlineDocumentArrowDown className="w-4 h-4 text-blue-700" />
                  </span>
                  {detailData.filePdf}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Nomor Surat Tugas</p>
              <p className="text-sm font-bold text-gray-800">{detailData.noSurat}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Diterbitkan</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggalSurat}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Program Rehabilitasi (Target Evaluasi)</p>
              <p className="text-base font-bold text-[#185325]">{detailData.program}</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mt-1.5">
                <HiOutlineMapPin className="w-4 h-4" /> {detailData.lokasi}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tahap / Periode Evaluasi</p>
              <p className="text-sm font-bold text-gray-800">{detailData.periode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pendanaan</p>
              <p className="text-sm font-bold text-gray-800">{detailData.jenisProgram}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Mulai Penugasan</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggal_awal}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Batas Waktu Penugasan</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggal_akhir}</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4 flex items-center gap-2">
            <HiOutlineUsers className="w-5 h-5" /> 2. Susunan Tim Lapangan
          </h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Nama Anggota</th>
                  <th className="px-5 py-3">Email Instansi</th>
                  <th className="px-5 py-3 text-center">Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailData.tim.map((anggota, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-800">{anggota.nama}</td>
                    <td className="px-5 py-4 text-gray-600">{anggota.email}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        anggota.peran === 'Ketua Tim' ? 'bg-[#DCECE0] text-[#185325] border border-[#C6EBD6]' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {anggota.peran}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-2xl border">
          <div className="text-left w-full md:w-auto">
            <h4 className="text-sm font-bold text-gray-800">Tugas sudah dibaca dan dipahami?</h4>
            <p className="text-xs text-gray-500 mt-1">Lanjutkan ke tahap perhitungan jika Anda sedang berada di lapangan.</p>
          </div>
          <button 
            onClick={() => navigate(`/admin/staff/evaluasi/hasil/detail/${id || 'EVAL-001'}`)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-md transition-colors active:scale-95 shrink-0"
          >
            Mulai Input Data Lapangan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailPenugasanEvaluasiStaff;