import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineEllipsisVertical,
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

const TinjauHasilMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [evaluasi, setEvaluasi] = useState('sesuai'); 

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start text-xs sm:text-sm gap-1 sm:gap-2">
      <div className="flex items-center justify-between sm:w-32.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className="font-bold text-gray-800 wrap-wrap-break-words flex-1 min-w-0">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-28 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <h1 className="text-2xl font-bold text-gray-800">Tinjau Hasil Monitoring</h1>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              <HiOutlinePrinter className="w-4 h-4" /> Cetak Laporan
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
          <span className="px-3 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-full shrink-0">
            Dalam Monitoring
          </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start w-full min-w-0">
        <div className="w-full xl:w-[70%] flex flex-col gap-6 min-w-0">
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-w-0">
            <div className="flex flex-col lg:flex-row gap-8 items-start min-w-0">

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5 min-w-0 w-full">
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="ID Program" value="PRG-2026-0007" />
                  <DataRow label="Jenis Program" value="Rehabilitasi Mangrove" />
                  <DataRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu" />
                  <DataRow label="Luas Area" value="4,2 Ha" />
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="Sumber Dana" value="APBD" />
                  <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                  <DataRow label="Tanggal Selesai" value="15 September 2026" />
                  <DataRow label="Target Tanam" value="2.500 Pohon" />
                  <DataRow label="Realisasi Tanam" value="2.500 Pohon" />
                </div>
              </div>

            </div>
              <div className="w-full lg:w-55 h-40 bg-[#EBF3FA] mt-2 rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <HiOutlineMapPin className="w-8 h-8 text-red-500 drop-shadow-md relative z-10 m-auto" />
                <a href="#" className="absolute bottom-0 inset-x-0 bg-white p-2.5 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <HiOutlineMap className="w-3.5 h-3.5"/> Lihat di Peta
                </a>
              </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Ringkasan Hasil Monitoring (Periode 2 dari 4)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <div className="flex flex-col gap-2 border-r border-gray-100 last:border-0 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><HiOutlineChartBar className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Persentase Keberhasilan</span></div>
                <div><p className="text-2xl font-bold text-gray-800">62%</p><p className="text-[10px] text-gray-400 font-medium">dari target</p></div>
              </div>
              
              <div className="flex flex-col gap-2 border-r border-gray-100 last:border-0 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><HiOutlineUserGroup className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Tanaman Hidup</span></div>
                <div><p className="text-2xl font-bold text-gray-800">1.550</p><p className="text-[10px] text-gray-400 font-medium">(62%)</p></div>
              </div>

              <div className="flex flex-col gap-2 border-r border-gray-100 last:border-0 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-orange-50 text-orange-500"><HiOutlineChartBar className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Tanaman Mati</span></div>
                <div><p className="text-2xl font-bold text-gray-800">650</p><p className="text-[10px] text-gray-400 font-medium">(26%)</p></div>
              </div>

              <div className="flex flex-col gap-2 border-r border-gray-100 last:border-0 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-blue-50 text-blue-500"><PiPlant className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Belum Tumbuh</span></div>
                <div><p className="text-2xl font-bold text-gray-800">300</p><p className="text-[10px] text-gray-400 font-medium">(12%)</p></div>
              </div>

              <div className="flex flex-col gap-2 border-r border-gray-100 last:border-0 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-purple-50 text-purple-500"><HiOutlineMapPin className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Titik Geotag</span></div>
                <div><p className="text-2xl font-bold text-gray-800">18</p><p className="text-[10px] text-gray-400 font-medium">titik</p></div>
              </div>

              <div className="flex flex-col gap-2 pr-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600"><HiOutlineDocumentText className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Foto</span></div>
                <div><p className="text-2xl font-bold text-gray-800">42</p><p className="text-[10px] text-gray-400 font-medium">foto</p></div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Peta Lokasi Monitoring</h2>
              <div className="w-full h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative mb-4 flex-1 min-h-40">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <HiOutlineMapPin className="absolute top-[20%] left-[20%] w-6 h-6 text-gray-800 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute top-[30%] left-[40%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute top-[40%] right-[30%] w-6 h-6 text-orange-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute bottom-[20%] right-[40%] w-6 h-6 text-red-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute bottom-[40%] left-[10%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 mt-auto">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Baik</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Sedang</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Perlu Tindak Lanjut</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Foto</h2>
              <div className="grid grid-cols-4 gap-2 mb-4 flex-1">
                <div className="rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
                <div className="rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
                <div className="rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
                <div className="rounded-lg overflow-hidden bg-gray-800 border border-gray-200 relative cursor-pointer hover:bg-gray-900 transition-colors">
                  <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=200&q=80" alt="Foto" className="w-full h-full object-cover opacity-40"/>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white"><span className="text-lg font-bold">+38</span><span className="text-[9px] font-bold">Foto Lainnya</span></div>
                </div>
              </div>
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-auto">Lihat semua dokumentasi <span className="text-base leading-none">&rarr;</span></a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-6">Grafik Perkembangan Tanaman</h2>
              <div className="flex-1 w-full relative min-h-45">
                <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                  <line x1="20" y1="0" x2="300" y2="0" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="35" x2="300" y2="35" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="70" x2="300" y2="70" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="105" x2="300" y2="105" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="140" x2="300" y2="140" stroke="#e5e7eb" strokeWidth="1.5"/>
                  
                  <text x="15" y="5" fontSize="8" fill="#9ca3af" textAnchor="end">100%</text>
                  <text x="15" y="40" fontSize="8" fill="#9ca3af" textAnchor="end">75%</text>
                  <text x="15" y="75" fontSize="8" fill="#9ca3af" textAnchor="end">50%</text>
                  <text x="15" y="110" fontSize="8" fill="#9ca3af" textAnchor="end">25%</text>
                  <text x="15" y="145" fontSize="8" fill="#9ca3af" textAnchor="end">0%</text>

                  {/* X Axis Labels */}
                  <text x="60" y="155" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 1</text>
                  <text x="60" y="165" fontSize="7" fill="#6b7280" textAnchor="middle">10 Mei 2026</text>
                  <text x="140" y="155" fontSize="7" fill="#6b7280" textAnchor="middle" fontWeight="bold">Periode 2</text>
                  <text x="140" y="165" fontSize="7" fill="#6b7280" textAnchor="middle" fontWeight="bold">27 Mei 2026</text>
                  <text x="220" y="155" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 3</text>
                  <text x="220" y="165" fontSize="7" fill="#6b7280" textAnchor="middle">10 Jul 2026</text>
                  <text x="300" y="155" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 4</text>
                  <text x="300" y="165" fontSize="7" fill="#6b7280" textAnchor="middle">(Rencana)</text>

                  {/* Tanaman Hidup (Green) */}
                  <polyline points="60,75 140,55 220,40 300,20" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="68" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">45%</text>
                  <text x="140" y="48" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">62%</text>
                  <text x="220" y="33" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">70%</text>
                  <text x="300" y="13" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">80%</text>

                  {/* Tanaman Mati (Orange) */}
                  <polyline points="60,115 140,105 220,112 300,119" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="125" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">18%</text>
                  <text x="140" y="98" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">26%</text>
                  <text x="220" y="105" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">20%</text>
                  <text x="300" y="129" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">15%</text>

                  {/* Belum Tumbuh (Blue) */}
                  <polyline points="60,88 140,123 220,135 300,140" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="98" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">37%</text>
                  <text x="140" y="133" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">12%</text>
                  <text x="220" y="128" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">8%</text>
                  <text x="300" y="150" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">5%</text>
                </svg>
              </div>
              <div className="flex justify-center gap-4 mt-10 text-[9px] font-bold text-gray-600">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tanaman Hidup</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Tanaman Mati</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Belum Tumbuh</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Catatan Penyuluh</h2>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Secara umum tanaman dalam kondisi baik dan menunjukkan pertumbuhan yang optimal. Terdapat beberapa tanaman mati karena faktor pasang surut air laut tinggi.<br/>
                  Akan dilakukan penyulaman pada titik-titik yang tanaman nya mati.
                </p>
                <div className="flex flex-col gap-1.5 text-[10px] text-gray-500 font-medium">
                  <div className="flex items-center gap-2"><HiOutlineCalendarDays className="w-3.5 h-3.5"/> 27 Mei 2026 14:18 WIB</div>
                  <div className="flex items-center gap-2"><HiOutlineUser className="w-3.5 h-3.5"/> <span><span className="font-bold text-gray-700">Ahmad Fauzi</span><br/>Penyuluh Penanggung Jawab</span></div>
                </div>
              </div>

              <div className="mt-auto">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Riwayat Monitoring</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] whitespace-nowrap mb-3">
                    <thead className="text-gray-500 border-b border-gray-100 font-bold">
                      <tr><th className="py-2 pr-2">Periode</th><th className="py-2 pr-2">Tanggal Monitoring</th><th className="py-2 pr-2">Penyuluh</th><th className="py-2 pr-2 text-center">Persentase Hidup</th><th className="py-2 text-center">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      <tr><td className="py-2 pr-2 text-gray-800">Periode 2</td><td className="py-2 pr-2">27 Mei 2026</td><td className="py-2 pr-2">Ahmad Fauzi</td><td className="py-2 pr-2 text-center font-bold">62%</td><td className="py-2 text-center"><span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Dalam Monitoring</span></td></tr>
                      <tr><td className="py-2 pr-2 text-gray-800">Periode 1</td><td className="py-2 pr-2">10 Mei 2026</td><td className="py-2 pr-2">Ahmad Fauzi</td><td className="py-2 pr-2 text-center font-bold">45%</td><td className="py-2 text-center"><span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Selesai</span></td></tr>
                    </tbody>
                  </table>
                </div>
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat semua riwayat <span className="text-lg leading-none">&rarr;</span></a>
              </div>

            </div>

          </div>
        </div>

        <div className="w-full xl:w-[30%] flex flex-col shrink-0 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
            
            <h2 className="text-sm font-bold text-gray-800 mb-2">Evaluasi Hasil Monitoring</h2>
            <p className="text-[11px] text-gray-500 font-medium mb-6 leading-relaxed">
              Berdasarkan hasil monitoring pada periode ini, tentukan keputusan evaluasi.
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-3">Keputusan Evaluasi <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${evaluasi === 'sesuai' ? 'border-emerald-500 bg-[#F0FDF4]' : 'border-gray-200 hover:border-emerald-300'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="keputusan" value="sesuai" checked={evaluasi === 'sesuai'} onChange={() => setEvaluasi('sesuai')} className="mt-0.5 w-4 h-4 accent-emerald-600 cursor-pointer" />
                      <div>
                        <p className={`text-xs font-bold ${evaluasi === 'sesuai' ? 'text-emerald-700' : 'text-gray-800'}`}>Hasil Sesuai Target</p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-snug">Hasil monitoring sesuai dengan target dan tidak memerlukan tindak lanjut.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${evaluasi === 'tindak_lanjut' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="keputusan" value="tindak_lanjut" checked={evaluasi === 'tindak_lanjut'} onChange={() => setEvaluasi('tindak_lanjut')} className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer" />
                      <div>
                        <p className={`text-xs font-bold ${evaluasi === 'tindak_lanjut' ? 'text-orange-700' : 'text-gray-800'}`}>Perlu Tindak Lanjut</p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-snug">Diperlukan tindakan perbaikan / tindak lanjut untuk meningkatkan keberhasilan program.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Catatan Evaluasi <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea 
                    rows={5} 
                    className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none resize-none" 
                    placeholder="Tuliskan catatan evaluasi hasil monitoring, kelebihan, kekurangan, dan rekomendasi (jika ada)."
                  ></textarea>
                  <span className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-bold">0/500</span>
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Lampiran (Opsional)</label>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <HiOutlinePlus className="w-3.5 h-3.5"/> Unggah File
                  </button>
                  <span className="text-[10px] text-gray-400 font-medium">PDF, JPG, PNG (Maks. 5MB)</span>
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-4 flex gap-3 items-start">
                <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-800 mb-1">Informasi</p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">Keputusan evaluasi akan dikirimkan kepada penyuluh dan KTH setelah disimpan.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <div className="p-4 flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-4 px-4 sm:px-8">
         <button className="w-full sm:w-auto px-6 py-2.5 sm:py-3 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
           Kembali
         </button>
         <button className="w-full sm:w-auto px-6 py-2.5 sm:py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
           Simpan Draft
         </button>

         {evaluasi === 'tindak_lanjut' ? (
           <button onClick={() => navigate('/admin/staff/monitoring/monitoring-program/tindak-lanjut/1')} className="w-full sm:w-auto px-8 py-2.5 sm:py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 cursor-pointer shadow-sm transition-colors">
             Perlu Tindak Lanjut
           </button>
         ) : (
           <button onClick={() => navigate('/admin/staff/monitoring/monitoring-program/hasil/1')} className="w-full sm:w-auto px-8 py-2.5 sm:py-3 text-sm font-bold text-white bg-[#185325] rounded-xl hover:bg-[#123d1c] cursor-pointer shadow-sm transition-colors">
             Setujui Monitoring
           </button>
         )}
      </div>


    </div>
  );
};

export default TinjauHasilMonitoring;