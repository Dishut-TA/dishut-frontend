import type { EvaluasiProgramData } from '@/utils/interface';
import React, { useEffect } from 'react';
import { HiOutlineXMark, HiOutlineMapPin, HiOutlineDocumentCheck, HiOutlineUserGroup } from 'react-icons/hi2';

interface DetailEvaluasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvaluasiProgramData | null;
}

const DetailEvaluasiModal: React.FC<DetailEvaluasiModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isLulus = data.hasilAkhir.statusKelulusan === 'BERHASIL';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Evaluasi Penanaman</h2>
            <p className="text-sm text-gray-500 mt-1">Berita Acara Penilaian Keberhasilan Penanaman</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pemegang Izin / Perusahaan</span>
                  <h3 className="text-lg font-bold text-[#185325]">{data.namaPerusahaan}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal Penilaian</span>
                  <p className="text-sm font-semibold text-gray-800">{data.tglEvaluasi}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Lokasi & Luas</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{data.lokasi}</p>
                  <p className="text-sm font-bold text-[#2E7D32] mt-0.5">{data.luasLahan} Ha</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <HiOutlineDocumentCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Jenis Tanaman</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.jenisTanaman.map((tanaman, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-semibold rounded-md">
                        {tanaman}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border shadow-sm flex flex-col justify-center items-center text-center ${isLulus ? 'bg-[#f0f9f3] border-[#C8E0CD]' : 'bg-red-50 border-red-100'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${isLulus ? 'text-[#185325]' : 'text-red-600'}`}>
                Kesimpulan Akhir
              </span>
              <h2 className={`text-2xl font-bold mb-4 ${isLulus ? 'text-[#185325]' : 'text-red-600'}`}>
                {data.hasilAkhir.statusKelulusan}
              </h2>
              <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                <div className="bg-white/70 border border-white/50 p-2 rounded-lg">
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rerata Tumbuh</span>
                  <span className="font-bold text-gray-800 text-sm">{data.hasilAkhir.persentaseTotal}%</span>
                </div>
                <div className="bg-white/70 border border-white/50 p-2 rounded-lg">
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rerata Tinggi</span>
                  <span className="font-bold text-gray-800 text-sm">{data.hasilAkhir.rerataTinggiTotal} cm</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Rincian Data Petak Ukur (PU)</h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                Total: {data.rincianPU.length} PU
              </span>
            </div>
            
            <div className="overflow-x-auto max-h-87.5 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-175">
                <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Petak Ukur</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center">Realisasi/Target</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center">Tanaman Hidup</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center">Rerata Tinggi</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center">% Tumbuh</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.rincianPU.map((pu, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">{pu.blok}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600 whitespace-nowrap">{pu.target} btg</td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-[#185325] whitespace-nowrap">{pu.tumbuh} btg</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600 whitespace-nowrap">{pu.rerataTinggi} cm</td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-gray-800 whitespace-nowrap">{pu.persentase}%</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                          pu.status === 'Memenuhi' ? 'bg-[#e2f1e6] text-[#185325]' : 'bg-red-50 text-red-600'
                        }`}>
                          {pu.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Informasi Tim Penilai */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineUserGroup className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-800">Susunan Tim Penilai</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ketua Tim (BPDAS)</span>
                <p className="font-semibold text-gray-800">{data.timPenilai.ketua}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pendamping (Perusahaan)</span>
                <ul className="space-y-1">
                  {data.timPenilai.pendamping.map((nama, idx) => (
                    <li key={idx} className="font-semibold text-gray-800 flex items-start gap-2">
                      <span className="text-gray-400">•</span> {nama}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailEvaluasiModal;