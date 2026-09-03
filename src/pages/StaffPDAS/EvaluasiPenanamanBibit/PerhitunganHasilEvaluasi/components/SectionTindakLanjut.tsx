import React from 'react';
import { 
  HiOutlineMapPin, HiOutlineCloud, HiOutlineCalendarDays, HiOutlineDocumentText
} from 'react-icons/hi2';
import type { PetakUkur } from '../types';

interface SectionTindakLanjutProps {
  dataPetakUkur: PetakUkur[];
  onCancel: () => void;
  onSubmit: () => void;
}

const SectionTindakLanjut: React.FC<SectionTindakLanjutProps> = ({ dataPetakUkur, onCancel, onSubmit }) => {
  return (
    <div className="bg-white rounded-3xl border border-orange-200 shadow-lg p-6 lg:p-8 mt-8 animate-in slide-in-from-bottom-8 duration-500 scroll-mt-24" id="section-tindak-lanjut">
      
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
          <HiOutlineDocumentText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Formulir Arahan Tindak Lanjut</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tetapkan instruksi perbaikan untuk Petak Ukur yang tidak memenuhi standar tumbuh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        
        {/* KOLOM KIRI: FORM ARAHAN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Jenis Tindak Lanjut <span className="text-red-500">*</span></label>
              <select className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white cursor-pointer">
                <option>Penyulaman (Replanting)</option>
                <option>Perawatan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Prioritas <span className="text-red-500">*</span></label>
              <select className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white cursor-pointer">
                <option>Tinggi (Segera)</option>
                <option>Sedang</option>
                <option>Rendah</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-2">Target & Jadwal Monitoring Ulang <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white" />
                <div className="relative">
                  <input type="date" className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white" />
                  <HiOutlineCalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Arahan / Instruksi Perbaikan <span className="text-red-500">*</span></label>
            <textarea 
              rows={5} 
              className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none leading-relaxed text-gray-700 bg-white" 
              placeholder="Tuliskan instruksi detail untuk Penyuluh di lapangan..."
            ></textarea>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 mb-3">Lampiran Pendukung (Opsional)</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer bg-white">
              <HiOutlineCloud className="w-8 h-8 text-orange-500 mb-3" />
              <p className="text-xs text-gray-600 mb-1">Drag & drop file di sini atau <span className="font-bold text-orange-600">klik untuk unggah</span></p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: CHECKLIST TITIK PETAK UKUR */}
        <div className="flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <label className="text-sm font-bold text-gray-800 block">Daftar Titik Penanaman</label>
          <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">Centang area yang perlu tindak lanjut.</p>
          
          <div className="flex items-center gap-3 px-1 mb-3 pb-3 border-b border-gray-200">
            <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded cursor-pointer" />
            <span className="text-xs font-bold text-gray-700">Pilih Semua</span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-125 pr-2 custom-scrollbar">
            {dataPetakUkur.map((item, idx) => {
              const persen = item.rencana > 0 ? ((item.tumbuh / item.rencana) * 100).toFixed(2) : "0.00";
              const isKritis = parseFloat(persen) < 75;
              const bibitMati = item.rencana - item.tumbuh;

              return (
                <label key={idx} className={`flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-colors group ${
                  isKritis ? 'border-orange-300 shadow-sm ring-1 ring-orange-100' : 'border-gray-200 hover:bg-gray-50 opacity-70 hover:opacity-100'
                }`}>
                  <input 
                    type="checkbox" 
                    defaultChecked={isKritis} 
                    className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-0.5">
                          <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px] uppercase">{item.periode}</span>
                          {item.pu}
                        </p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 truncate"><HiOutlineMapPin className="w-3 h-3"/> {item.kondisiLahan}</p>
                      </div>
                      <div className="text-[10px] text-right">
                        Tumbuh: <span className={isKritis ? 'text-red-500 font-bold' : 'text-[#185325] font-bold'}>{persen}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 mt-2">
                      <p className="text-[10px] font-bold text-gray-700 truncate mb-1.5">{item.jenisBibit}</p>
                      <div className="grid grid-cols-3 gap-2 text-[9px] text-center font-medium">
                        <div className="bg-white border border-gray-200 rounded p-1">
                          <span className="text-gray-400 block mb-0.5">Rencana</span>
                          <span className="text-gray-700">{item.rencana}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-1">
                          <span className="text-gray-400 block mb-0.5">Hidup</span>
                          <span className="text-[#185325]">{item.tumbuh}</span>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded p-1">
                          <span className="text-red-400 block mb-0.5">Mati/Gagal</span>
                          <span className="text-red-600 font-bold">{bibitMati}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-end items-center gap-3">
        <button onClick={onCancel} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Batal</button>
        <button onClick={onSubmit} className="w-full sm:w-auto px-8 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all">Kirim Arahan Tindak Lanjut</button>
      </div>

    </div>
  );
};

export default SectionTindakLanjut;