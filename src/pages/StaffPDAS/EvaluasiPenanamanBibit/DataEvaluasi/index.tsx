import React, { useState } from 'react';
import { 
  HiOutlineEye, 
  HiOutlinePlus, 
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlineClipboardDocumentCheck
} from 'react-icons/hi2';
import DetailEvaluasiModal from './components/DetailEvaluasiModal';
import type { EvaluasiProgramData } from '@/utils/interface';
import { useNavigate } from 'react-router-dom';

const mockDataEvaluasi: EvaluasiProgramData[] = [
  {
    id: 'BA-JSP-001',
    namaPerusahaan: 'PT. Jawa Satu Power',
    lokasi: 'Hutan Lindung Desa Sudalarang, Kec. Sukawening, Kab. Garut, DAS Cimanuk',
    luasLahan: 29.78,
    jenisTanaman: ['Pinus', 'Akasia mangium', 'Bungur', 'Alpukat', 'Mangga'],
    tglEvaluasi: '13 Maret 2026',
    hasilAkhir: {
      persentaseTotal: 87.40,
      rerataTinggiTotal: 123.20,
      statusKelulusan: 'BERHASIL'
    },
    timPenilai: {
      ketua: 'Umar Nasir, S.Sos., M.Sc',
      pendamping: ['Bayu Bargono (Risk & Compliance Manager)', 'Like Ernawati (Environment Supervisor)']
    },
    rincianPU: [
      { blok: 'PU 1', target: 110, tumbuh: 69, rerataTinggi: 98.11, persentase: 62.73, status: 'Tidak Memenuhi' },
      { blok: 'PU 2', target: 110, tumbuh: 61, rerataTinggi: 88.68, persentase: 55.45, status: 'Tidak Memenuhi' },
      { blok: 'PU 3', target: 110, tumbuh: 113, rerataTinggi: 101.94, persentase: 102.73, status: 'Memenuhi' },
      { blok: 'PU 4', target: 63, tumbuh: 42, rerataTinggi: 111.55, persentase: 66.67, status: 'Tidak Memenuhi' },
      { blok: 'PU 5', target: 63, tumbuh: 59, rerataTinggi: 173.63, persentase: 93.65, status: 'Memenuhi' },
      { blok: 'PU 6', target: 63, tumbuh: 62, rerataTinggi: 105.23, persentase: 98.41, status: 'Memenuhi' },
      { blok: 'PU 7', target: 63, tumbuh: 68, rerataTinggi: 114.56, persentase: 107.94, status: 'Memenuhi' },
      { blok: 'PU 8', target: 110, tumbuh: 108, rerataTinggi: 103.42, persentase: 98.18, status: 'Memenuhi' },
      { blok: 'PU 9', target: 63, tumbuh: 67, rerataTinggi: 139.61, persentase: 106.35, status: 'Memenuhi' },
      { blok: 'PU 10', target: 64, tumbuh: 49, rerataTinggi: 90.58, persentase: 76.56, status: 'Memenuhi' },
    ]
  },
  // Tambahkan mock data program lain jika perlu...
];

const DataEvaluasi: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<EvaluasiProgramData | null>(null);

  const filteredData = mockDataEvaluasi.filter((item) =>
    item.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-block px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap";
    if (status === 'BERHASIL') {
      return <span className={`${baseClass} bg-[#e2f1e6] text-[#185325]`}>{status}</span>;
    }
    return <span className={`${baseClass} bg-red-50 text-red-600`}>{status}</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineClipboardDocumentCheck className="w-6 h-6 text-[#185325]" />
            <h1 className="text-2xl font-bold text-gray-800">
              Evaluasi Penanaman Berdasarkan Program
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Rekapitulasi Berita Acara Penilaian Keberhasilan Penanaman per Pemegang Izin.
          </p>
        </div>
        
        <button className="bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 whitespace-nowrap"
        onClick={() => navigate('/admin/staff/evaluasi/data/create')}>
          <HiOutlinePlus className="w-5 h-5" strokeWidth={2.5} />
          Input Berita Acara Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <HiOutlineMagnifyingGlass className="w-5 h-5" />
          </span>
          <input 
            type="text" 
            placeholder="Cari Perusahaan atau Lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all text-gray-700 placeholder-gray-400 shadow-sm"
          />
        </div>
        
        <div className="text-sm text-gray-600 font-medium">
          Ditemukan: <span className="font-bold text-[#185325]">{filteredData.length} Dokumen Evaluasi</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-225 text-sm text-left border-collapse">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Perusahaan / Pemegang Izin</th>
                <th className="px-6 py-4 whitespace-nowrap">Lokasi</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Jumlah PU</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Rerata Tumbuh</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Keputusan Akhir</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((data) => (
                  <tr key={data.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-800">{data.namaPerusahaan}</span>
                        <span className="text-gray-400 text-[11px] font-bold tracking-wider">{data.id} • {data.tglEvaluasi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-gray-600 text-sm truncate max-w-xs">{data.lokasi}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700 whitespace-nowrap">
                      {data.rincianPU.length} Petak
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#185325] whitespace-nowrap">
                      {data.hasilAkhir.persentaseTotal}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {getStatusBadge(data.hasilAkhir.statusKelulusan)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedProgram(data)}
                          title="Lihat Detail Petak Ukur"
                          className="p-1.5 text-gray-400 hover:text-[#185325] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button 
                          title="Hapus Data"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="p-4 bg-gray-50 rounded-full mb-3 border border-gray-100">
                        <HiOutlineClipboardDocumentCheck className="w-8 h-8 text-[#185325]" />
                      </div>
                      <p className="text-base font-bold text-gray-800">Tidak Ada Dokumen Evaluasi</p>
                      <p className="text-sm mt-1">
                        Belum ada Berita Acara yang diinput ke dalam sistem.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailEvaluasiModal 
        isOpen={selectedProgram !== null} 
        onClose={() => setSelectedProgram(null)} 
        data={selectedProgram} 
      />

    </div>
  );
}

export default DataEvaluasi;