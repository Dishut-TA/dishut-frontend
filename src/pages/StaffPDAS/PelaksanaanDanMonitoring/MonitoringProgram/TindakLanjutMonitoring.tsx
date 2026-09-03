import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineEllipsisVertical,
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineCloud,
  HiOutlineTrash,
  HiOutlineCalendarDays,
  HiOutlineDocumentText
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

const TindakLanjutMonitoring: React.FC = () => {
  const navigate = useNavigate();

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-[11px] sm:text-xs">
      <div className="flex items-center justify-between sm:w-32.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className="font-bold text-gray-800 wrap-break-words flex-1 min-w-0">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-28 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <h1 className="text-2xl font-bold text-gray-800">Tindak Lanjut Monitoring</h1>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              <HiOutlinePrinter className="w-4 h-4" /> Cetak
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              Aksi <HiOutlineEllipsisVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
          <span className="font-bold text-gray-800 text-base md:text-lg wrap-break-words">Rehabilitasi Mangrove Karangsong</span>
          <span className="px-3 py-1 text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-200 rounded-full shrink-0">
            Perlu Tindak Lanjut
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full min-w-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start min-w-0">
            
            <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0 w-full">
              <div className="w-12 h-12 rounded-full bg-[#EBF8F1] text-[#185325] flex items-center justify-center shrink-0">
                <PiPlant className="w-6 h-6" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 min-w-0">
                <div className="space-y-4">
                  <DataRow label="ID Program" value="PRG-2026-0007" />
                  <DataRow label="Jenis Program" value="Rehabilitasi Mangrove" />
                  <DataRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu" />
                  <DataRow label="Luas Area" value="4,2 Ha" />
                </div>
                <div className="space-y-4">
                  <DataRow label="Sumber Dana" value="APBD" />
                  <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                  <DataRow label="Tanggal Selesai" value="15 September 2026" />
                  <DataRow label="Target Tanam" value="2.500 Pohon" />
                  <DataRow label="Realisasi Tanam" value="2.500 Pohon" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-55 h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0 group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
              <HiOutlineMapPin className="w-8 h-8 text-red-500 drop-shadow-md relative z-10 m-auto" />
              <a href="#" className="absolute bottom-0 inset-x-0 bg-white p-2.5 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <HiOutlineMap className="w-3.5 h-3.5"/> Lihat di Peta
              </a>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1">Penetapan Tindak Lanjut</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-700 block mb-2">Jenis Tindak Lanjut <span className="text-red-500">*</span></label><select className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white cursor-pointer"><option>Perbaikan Penanaman</option></select></div>
                <div><label className="text-xs font-bold text-gray-700 block mb-2">Prioritas <span className="text-red-500">*</span></label><select className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white cursor-pointer"><option>Tinggi</option></select></div>
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2"><label className="text-xs font-bold text-gray-700 block mb-2">Target Penyelesaian <span className="text-red-500">*</span></label><input type="date" defaultValue="2026-06-25" className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none" /></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Periode Monitoring Ulang <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" value="26 Juli 2026" className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none" readOnly/>
                    <HiOutlineCalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Penyuluh Penanggung Jawab</label>
                  <input type="text" value="Ahmad Fauzi" className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium focus:outline-none" readOnly/>
                </div>
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-2">KTH Pelaksana</label>
                  <input type="text" value="KTH Karangsong Lestari" className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium focus:outline-none" readOnly/>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-0 lg:mt-11">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Arahan / Instruksi Perbaikan <span className="text-red-500">*</span></label>
                <textarea rows={6} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none leading-relaxed text-gray-700" defaultValue="Beberapa tanaman mati karena pasang surut air laut tinggi.&#10;&#10;Arahan perbaikan yang harus dilakukan:&#10;1. Lakukan penyulaman pada titik yang tanaman nya mati.&#10;2. Gunakan ajir untuk tanaman baru.&#10;3. Pastikan media tanam tidak terendam terlalu lama saat pasang.&#10;4. Perawatan dilakukan rutin setiap 2 minggu."></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Catatan Tambahan</label>
                <textarea rows={3} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none leading-relaxed text-gray-700" defaultValue="Koordinasi dengan KTH untuk penyediaan bibit tambahan dan ajir."></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-0 lg:mt-11">
              <label className="text-xs font-bold text-gray-700 block">Titik yang Perlu Perbaikan</label>
              <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">Pilih titik lokasi yang perlu dilakukan perbaikan / tindak lanjut.</p>
              
              <div className="flex items-center gap-3 px-1 mb-1">
                <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded cursor-pointer" />
                <span className="text-xs font-bold text-gray-700">Pilih Semua</span>
              </div>

              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-85 pr-2 custom-scrollbar">
                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"/>
                  <HiOutlineMapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Titik 3</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Sebagian tanaman mati</p>
                  </div>
                  <div className="text-[9px] text-gray-400 text-right shrink-0">6.363315° S<br/>108.283721° E</div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"/>
                  <HiOutlineMapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Titik 5</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Banyak tanaman mati</p>
                  </div>
                  <div className="text-[9px] text-gray-400 text-right shrink-0">6.363521° S<br/>108.284102° E</div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"/>
                  <HiOutlineMapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Titik 7</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Tanaman belum tumbuh</p>
                  </div>
                  <div className="text-[9px] text-gray-400 text-right shrink-0">6.364001° S<br/>108.283950° E</div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group opacity-60 hover:opacity-100">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"/>
                  <HiOutlineMapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Titik 11</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Pertumbuhan kurang optimal</p>
                  </div>
                  <div className="text-[9px] text-gray-400 text-right shrink-0">6.364512° S<br/>108.284301° E</div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group opacity-60 hover:opacity-100">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"/>
                  <HiOutlineMapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Titik 14</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Sebagian tanaman mati</p>
                  </div>
                  <div className="text-[9px] text-gray-400 text-right shrink-0">6.364889° S<br/>108.284789° E</div>
                </label>

              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Lampiran (Opsional)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer mb-4">
              <HiOutlineCloud className="w-8 h-8 text-blue-500 mb-3" />
              <p className="text-xs text-gray-600 mb-1">Drag & drop file di sini atau <span className="font-bold text-blue-600">klik untuk unggah</span></p>
              <p className="text-[10px] text-gray-400 font-medium">PDF, JPG, PNG (Maks. 5MB)</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-red-50 text-red-500 font-bold text-[9px] flex items-center justify-center rounded uppercase shrink-0 border border-red-100">PDF</div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">Arahan_Perbaikan_Mangrove.pdf</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">1.2 MB</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                <HiOutlineTrash className="w-5 h-5"/>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Pendukung <span className="font-medium text-gray-400">(Dari Monitoring Sebelumnya)</span></h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="h-28 rounded-xl overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/></div>
              <div className="h-28 rounded-xl overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=300&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/></div>
              <div className="h-28 rounded-xl overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/></div>
              <div className="h-28 rounded-xl overflow-hidden bg-gray-800 border border-gray-200 relative cursor-pointer hover:bg-gray-900 transition-colors">
                <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=300&q=80" alt="Foto" className="w-full h-full object-cover opacity-40"/>
                <div className="absolute inset-0 flex items-center justify-center text-white"><span className="text-2xl font-bold">+16</span></div>
              </div>
            </div>
            
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-auto">Lihat semua dokumentasi <span className="text-base leading-none">&rarr;</span></a>
          </div>

        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-4 z-50 px-4 sm:px-8">
         <button onClick={() => navigate(-1)} className="w-full sm:w-auto px-8 py-2.5 sm:py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
           Batal
         </button>
         <button className="w-full sm:w-auto px-8 py-2.5 sm:py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2">
           <HiOutlineDocumentText className="w-4 h-4"/> Simpan Draft
         </button>
         <button className="w-full sm:w-auto px-8 py-2.5 sm:py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 cursor-pointer shadow-sm transition-colors">
           Simpan & Kirim Arahan
         </button>
      </div>

    </div>
  );
};

export default TindakLanjutMonitoring;