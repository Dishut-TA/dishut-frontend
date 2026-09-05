import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineArrowPath } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { buatArahanTindakLanjut } from '@/services/penugasanEvaluasi.service';

interface SectionTindakLanjutProps {
  evalId: string;
  dataPetakUkur: any[];
  rekomendasiCpi: string; // <-- Menangkap props dari atas
  onCancel: () => void;
}

const SectionTindakLanjut: React.FC<SectionTindakLanjutProps> = ({ evalId, dataPetakUkur, rekomendasiCpi, onCancel }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [jenis, setJenis] = useState('Penyulaman (Replanting)');
  const [prioritas, setPrioritas] = useState('Tinggi (Segera)');
  const [batasWaktu, setBatasWaktu] = useState('');
  
  // Set default state textarea = rekomendasi dari Analisis CPI
  const [arahan, setArahan] = useState(rekomendasiCpi || '');

  // Opsi Arahan Lain (Bisa ditambahkan lebih banyak jika perlu)
  const handleGantiArahanStandar = () => {
    setArahan('Lakukan penyulaman (replanting) pada titik-titik petak ukur kritis menggunakan bibit yang sesuai spesifikasi. Bersihkan area sekitar dari gulma pengganggu.');
    toast.success('Beralih ke Template Arahan Standar');
  };

  const handleGantiArahanCPI = () => {
    setArahan(rekomendasiCpi);
    toast.success('Beralih ke Rekomendasi Analisis CPI');
  };

  const handleSubmit = async () => {
    if (!batasWaktu || !arahan) {
      return toast.error('Harap lengkapi Jadwal Pelaksanaan dan Arahan!');
    }

    setIsSubmitting(true);
    const loading = toast.loading('Mengirim Penugasan Tindak Lanjut ke Penyuluh...');

    try {
      const payload = { jenis_tindak_lanjut: jenis, prioritas, batas_waktu: batasWaktu, arahan };
      await buatArahanTindakLanjut(evalId, payload);
      
      toast.success('Arahan Tindak Lanjut berhasil dikirim ke Penyuluh!', { id: loading });
      navigate('/admin/staff/evaluasi/hasil'); 
    } catch (error) {
      toast.error('Gagal mengirim arahan tindak lanjut', { id: loading });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-200 shadow-lg p-6 lg:p-8 mt-8 animate-in slide-in-from-bottom-8 duration-500 scroll-mt-24" id="section-tindak-lanjut">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><HiOutlineDocumentText className="w-6 h-6" /></div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Formulir Arahan Tindak Lanjut</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tetapkan instruksi perbaikan untuk Petak Ukur yang tidak memenuhi standar tumbuh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Jenis Tindak Lanjut <span className="text-red-500">*</span></label>
              <select value={jenis} onChange={(e)=>setJenis(e.target.value)} className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none bg-white">
                <option value="Penyulaman (Replanting)">Penyulaman (Replanting)</option>
                <option value="Perawatan Ekstra">Perawatan Ekstra</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Prioritas <span className="text-red-500">*</span></label>
              <select value={prioritas} onChange={(e)=>setPrioritas(e.target.value)} className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none bg-white">
                <option value="Tinggi">Tinggi (Segera)</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-2">Batas Waktu Pelaksanaan <span className="text-red-500">*</span></label>
              <input value={batasWaktu} onChange={(e)=>setBatasWaktu(e.target.value)} type="date" className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none bg-white" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
              <label className="text-xs font-bold text-gray-700">Arahan / Instruksi Perbaikan <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <button 
                  onClick={handleGantiArahanCPI} 
                  className="text-[10px] flex items-center gap-1 font-bold text-[#185325] bg-[#EBF8F1] border border-[#C6EBD6] px-2 py-1 rounded cursor-pointer hover:bg-[#DCECE0] transition-colors"
                >
                  <HiOutlineArrowPath className="w-3 h-3" /> Rekomendasi CPI
                </button>
                <button 
                  onClick={handleGantiArahanStandar} 
                  className="text-[10px] flex items-center gap-1 font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Arahan Standar
                </button>
              </div>
            </div>
            <textarea 
              rows={5} 
              value={arahan} onChange={(e)=>setArahan(e.target.value)} 
              className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none resize-none leading-relaxed text-gray-700 bg-white" 
              placeholder="Tuliskan instruksi detail untuk Penyuluh di lapangan..."
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <label className="text-sm font-bold text-gray-800 block">Daftar Titik Penanaman</label>
          <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">Petak ukur yang otomatis dicentang berada di bawah standar kriteria (75%).</p>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-96 pr-2 custom-scrollbar">
            {dataPetakUkur.map((item, idx) => {
              const persen = item.rencana > 0 ? ((item.tumbuh / item.rencana) * 100).toFixed(2) : "0.00";
              const isKritis = parseFloat(persen) < 75;

              return (
                <label key={idx} className={`flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer ${isKritis ? 'border-orange-300 shadow-sm ring-1 ring-orange-100' : 'border-gray-200'}`}>
                  <input type="checkbox" defaultChecked={isKritis} className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-gray-800">{item.pu}</p>
                      <div className="text-[10px] text-right font-bold text-red-500">{persen}%</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-end items-center gap-3">
        <button onClick={onCancel} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">Batal</button>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-full cursor-pointer disabled:opacity-70 hover:bg-orange-600 shadow-md transition-all">
          {isSubmitting ? 'Mengirim...' : 'Kirim Arahan Tindak Lanjut'}
        </button>
      </div>
    </div>
  );
};
export default SectionTindakLanjut;