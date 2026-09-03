import React, { useState } from 'react';
import { HiOutlineCheckBadge, HiOutlineDocumentCheck, HiOutlineXMark, HiOutlineMapPin, HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockDrafBAP = [
  {
    id: 'BAP-001',
    namaPerusahaan: 'PT. Jawa Satu Power',
    lokasi: 'Hutan Lindung Desa Sudalarang, Kec. Sukawening',
    luasLahan: 29.78,
    jenisTanaman: ['Pinus', 'Akasia', 'Bungur', 'Alpukat', 'Mangga'],
    tglEvaluasi: '13 Maret 2026',
    hasilAkhir: { persentaseTotal: 87.40, rerataTinggiTotal: 123.20, statusKelulusan: 'BERHASIL' },
    timPenilai: { ketua: 'Umar Nasir, S.Sos., M.Sc', pendamping: ['Bayu Bargono', 'Like Ernawati'] },
    rincianPU: [
      { blok: 'PU 1', target: 110, tumbuh: 69, rerataTinggi: 98.11, persentase: 62.73, status: 'Tidak Memenuhi' },
      { blok: 'PU 3', target: 110, tumbuh: 113, rerataTinggi: 101.94, persentase: 102.73, status: 'Memenuhi' },
    ]
  }
];

const KabidVerifikasiBAP: React.FC = () => {
  const [data, setData] = useState(mockDrafBAP);
  const [selectedBAP, setSelectedBAP] = useState<any | null>(null);

  const handleApprove = () => {
    toast.success('Berita Acara berhasil disahkan dan PDF telah diterbitkan!');
    setSelectedBAP(null);
    setData([]);
  };

  const handleReject = () => {
    toast.error('Draf dikembalikan ke Staff untuk direvisi.');
    setSelectedBAP(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineCheckBadge className="w-6 h-6 text-[#185325]" />
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi & Pengesahan BAP</h1>
        </div>
        <p className="text-sm text-gray-500">Tinjau dan sahkan draf laporan Berita Acara yang disusun oleh Staff PDAS.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-225 text-sm text-left">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Perusahaan / Pemegang Izin</th>
                <th className="px-6 py-4">Lokasi & Tgl Evaluasi</th>
                <th className="px-6 py-4 text-center">Rerata Tumbuh</th>
                <th className="px-6 py-4 text-center">Keputusan Sistem</th>
                <th className="px-6 py-4 text-center">Aksi (Verifikasi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{item.namaPerusahaan}</span>
                        <span className="text-[11px] text-gray-400 font-bold uppercase">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="text-sm">{item.lokasi}</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">{item.tglEvaluasi}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#185325]">{item.hasilAkhir.persentaseTotal}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-4 py-1.5 bg-[#e2f1e6] text-[#185325] rounded-full text-[11px] font-bold">
                        {item.hasilAkhir.statusKelulusan}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <button 
                        onClick={() => setSelectedBAP(item)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm"
                      >
                        <HiOutlineCheckBadge className="w-4 h-4" /> Tinjau Laporan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-bold">Semua dokumen telah diverifikasi. Kotak masuk bersih!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL PENGESAHAN (Mirip Detail tapi ada tombol action) --- */}
      {selectedBAP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Verifikasi Berita Acara Penilaian</h2>
              <button onClick={() => setSelectedBAP(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><HiOutlineXMark className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/50">
              {/* Ringkasan & Hasil Akhir */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pemegang Izin</span>
                      <h3 className="text-lg font-bold text-[#185325]">{selectedBAP.namaPerusahaan}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1"><HiOutlineMapPin className="w-4 h-4" /><span className="text-xs font-bold uppercase">Lokasi & Luas</span></div>
                      <p className="text-sm font-medium text-gray-800">{selectedBAP.lokasi}</p>
                      <p className="text-sm font-bold text-[#2E7D32] mt-0.5">{selectedBAP.luasLahan} Ha</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1"><HiOutlineDocumentCheck className="w-4 h-4" /><span className="text-xs font-bold uppercase">Jenis Tanaman</span></div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedBAP.jenisTanaman.map((tanaman: string, idx: number) => <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-semibold rounded-md">{tanaman}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0f9f3] border border-[#C8E0CD] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider mb-2 text-[#185325]">Kesimpulan Sistem</span>
                  <h2 className="text-2xl font-bold mb-4 text-[#185325]">{selectedBAP.hasilAkhir.statusKelulusan}</h2>
                  <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-white/70 border border-white/50 p-2 rounded-lg"><span className="block text-[10px] text-gray-500 font-bold uppercase">Rerata Tumbuh</span><span className="font-bold text-gray-800 text-sm">{selectedBAP.hasilAkhir.persentaseTotal}%</span></div>
                    <div className="bg-white/70 border border-white/50 p-2 rounded-lg"><span className="block text-[10px] text-gray-500 font-bold uppercase">Rerata Tinggi</span><span className="font-bold text-gray-800 text-sm">{selectedBAP.hasilAkhir.rerataTinggiTotal} cm</span></div>
                  </div>
                </div>
              </div>

              {/* Action Verifikasi */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <p className="text-sm font-bold text-gray-600 text-center mb-6">Sebagai Kepala Bidang, apakah Anda menyetujui Laporan Berita Acara ini?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={handleReject} className="flex items-center gap-2 px-8 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-full transition-colors shadow-sm">
                    <HiOutlineArrowLeft className="w-5 h-5" /> Tolak & Kembalikan (Revisi)
                  </button>
                  <button onClick={handleApprove} className="flex items-center gap-2 px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-md shadow-[#185325]/20">
                    <HiOutlineCheckBadge className="w-5 h-5" /> Sahkan & Terbitkan PDF BAP
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KabidVerifikasiBAP;