import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineCheckBadge,
  HiOutlineXCircle,
  HiOutlineExclamationTriangle,
  HiOutlinePhoto
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const DetailVerifikasiLapanganKabid: React.FC = () => {
  const navigate = useNavigate();
//   const { id } = useParams();
  const [showRevisi, setShowRevisi] = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState('');

  const infoTugas = {
    proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
    tim: 'Srie Resmita Dewi, SP., MP (Ketua Tim)',
    tanggalSubmit: '14 Juli 2026',
  };

  const dataPetakUkur = [
    { pu: 'PU-1', rencana: 110, tumbuh: 108, tinggi: 123.2, koordinat: '-6.21, 106.82', anomali: false },
    { pu: 'PU-2', rencana: 110, tumbuh: 100, tinggi: 120.5, koordinat: '-6.22, 106.83', anomali: false },
    { pu: 'PU-3', rencana: 63, tumbuh: 70, tinggi: 115.0, koordinat: '-6.23, 106.84', anomali: false },
    { pu: 'PU-4', rencana: 63, tumbuh: 60, tinggi: 45.0, koordinat: '-6.24, 106.85', anomali: true, catatanAnomali: 'Rata-rata tinggi tanaman sangat jauh di bawah standar.' },
  ];

  const hitungPersenPerPU = (rencana: number, tumbuh: number) => {
    if (rencana === 0) return "0.00";
    return ((tumbuh / rencana) * 100).toFixed(2);
  };

  const handleSetujui = () => {
    toast.success('Data Petak Ukur Disetujui! Dataset berhasil dikunci dan siap dihitung oleh Staff.');
    navigate(-1);
  };

  const handleKirimRevisi = () => {
    if (!catatanRevisi.trim()) {
      toast.error('Catatan revisi tidak boleh kosong!');
      return;
    }
    toast.success('Catatan revisi berhasil dikirim ke Tim Penilai (Staff PDAS).');
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Tinjauan Data Lapangan Petak Ukur</h1>
          <div className="bg-[#f8fbf9] border border-[#DCECE0] rounded-xl p-5 text-sm text-gray-700 space-y-2">
            <p><span className="font-semibold text-gray-500 inline-block w-32">Program</span>: <span className="font-bold text-[#185325]">{infoTugas.proyek}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Disubmit Oleh</span>: <span className="font-bold">{infoTugas.tim}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Tanggal Submit</span>: <span className="font-bold">{infoTugas.tanggalSubmit}</span></p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Ringkasan Data Lapangan</span>
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold border border-red-100 flex items-center gap-1">
              <HiOutlineExclamationTriangle className="w-3.5 h-3.5" /> 1 Anomali Terdeteksi Sistem
            </span>
          </h3>
          
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Petak Ukur</th>
                  <th className="px-5 py-3 text-center">Rencana (P0)</th>
                  <th className="px-5 py-3 text-center">Tumbuh</th>
                  <th className="px-5 py-3 text-center border-x border-gray-200">% Tumbuh PU</th>
                  <th className="px-5 py-3 text-center">Rata-rata Tinggi</th>
                  <th className="px-5 py-3">Koordinat GPS</th>
                  <th className="px-5 py-3 text-center">Foto Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPetakUkur.map((item, idx) => {
                  const persen = hitungPersenPerPU(item.rencana, item.tumbuh);
                  const isAnomali = item.anomali; // Murni mengambil state anomali dari data
                  const isLulus = parseFloat(persen) >= 75;
                  return (
                    <React.Fragment key={idx}>
                      <tr className={`hover:bg-gray-50 ${isAnomali ? 'bg-red-50/30' : ''}`}>
                        <td className="px-5 py-4 font-bold text-[#185325]">{item.pu}</td>
                        <td className="px-5 py-4 text-center">{item.rencana}</td>
                        <td className="px-5 py-4 text-center font-bold text-gray-800">{item.tumbuh}</td>
                        
                        <td className={`px-5 py-4 text-center border-x border-gray-100 font-bold ${isLulus ? 'text-[#00A859]' : 'text-red-500'}`}>
                          {persen}%
                        </td>

                        <td className={`px-5 py-4 text-center ${isAnomali ? 'text-red-600 font-bold' : ''}`}>{item.tinggi} cm</td>
                        <td className="px-5 py-4 text-xs text-gray-500 font-medium">{item.koordinat}</td>
                        <td className="px-5 py-4 flex justify-center">
                          <button title="Lihat Foto" className="text-primary hover:text-tertiary bg-greenAdmin cursor-pointer p-2 rounded-full transition-colors">
                            <HiOutlinePhoto className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                      {isAnomali && (
                        <tr className="bg-red-50 border-b border-red-100">
                          <td colSpan={7} className="px-5 py-2.5 text-xs text-red-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <HiOutlineExclamationTriangle className="w-4 h-4" /> 
                              <strong>Catatan Sistem:</strong> {item.catatanAnomali}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          {showRevisi && (
            <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
              <label className="block text-sm font-bold text-gray-800 mb-2">Catatan Revisi untuk Tim Penilai <span className="text-red-500">*</span></label>
              <textarea 
                rows={4}
                value={catatanRevisi}
                onChange={(e) => setCatatanRevisi(e.target.value)}
                placeholder="Tuliskan instruksi perbaikan..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-[#185325] resize-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowRevisi(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button onClick={handleKirimRevisi} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                  Kirim Catatan Revisi
                </button>
              </div>
            </div>
          )}

          {!showRevisi && (
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button 
                onClick={() => setShowRevisi(true)} 
                className="px-8 py-3.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <HiOutlineXCircle className="w-5 h-5 stroke-2" /> Minta Perbaikan (Kirim Revisi)
              </button>
              <button 
                onClick={handleSetujui} 
                className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineCheckBadge className="w-5 h-5" /> Setujui Data Lapangan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailVerifikasiLapanganKabid;