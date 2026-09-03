import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentArrowDown, HiOutlinePaperAirplane } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const DraftLaporanIndividu: React.FC = () => {
  const navigate = useNavigate();

  // Hasil perhitungan sistem berdasarkan input Petak Ukur (Sesuai AD 3 Perhitungan Hasil Evaluasi)
  const rekapEvaluasi = {
    totalRencana: 560,
    totalTumbuh: 562,
    persenTumbuh: 100.36, // Otomatis dihitung sistem
    kategori: 'Berhasil', // > 75%
  };

  const handleAjukan = () => {
    toast.success('Laporan berhasil diajukan ke Kepala Bidang PDAS!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
          Pratinjau Laporan Evaluasi Individu
        </h1>

        {/* Tabel Rekapitulasi Data PU */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#185325] mb-3">Rekapitulasi Persen Tumbuh Tanaman</h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fbf9] text-gray-600 font-semibold">
                <tr>
                  <th className="px-5 py-3">Petak Ukur</th>
                  <th className="px-5 py-3 text-center">Rencana (btg)</th>
                  <th className="px-5 py-3 text-center">Tumbuh (btg)</th>
                  <th className="px-5 py-3 text-center">% Tumbuh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-3 font-medium">PU I</td>
                  <td className="px-5 py-3 text-center">40</td>
                  <td className="px-5 py-3 text-center">40</td>
                  <td className="px-5 py-3 text-center font-bold text-[#185325]">100.00%</td>
                </tr>
                {/* Baris Total */}
                <tr className="bg-[#DCECE0] font-bold text-[#185325]">
                  <td className="px-5 py-3">Total Akumulasi</td>
                  <td className="px-5 py-3 text-center">{rekapEvaluasi.totalRencana}</td>
                  <td className="px-5 py-3 text-center">{rekapEvaluasi.totalTumbuh}</td>
                  <td className="px-5 py-3 text-center">{rekapEvaluasi.persenTumbuh}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kesimpulan Otomatis */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-sm">
          <p className="text-blue-800 leading-relaxed">
            Berdasarkan perhitungan sistem, persentase tumbuh tanaman mencapai <span className="font-bold">{rekapEvaluasi.persenTumbuh}%</span>. Mengacu pada peraturan batas minimal tumbuh (75%), maka pelaksanaan penanaman dinyatakan <span className="font-bold uppercase">{rekapEvaluasi.kategori}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-6">
          <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200">
            <HiOutlineDocumentArrowDown className="w-5 h-5" /> Download Dokumen PDF
          </button>
          <button onClick={handleAjukan} className="px-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45" /> Ajukan ke Kepala Bidang
          </button>
        </div>

      </div>
    </div>
  );
};

export default DraftLaporanIndividu;