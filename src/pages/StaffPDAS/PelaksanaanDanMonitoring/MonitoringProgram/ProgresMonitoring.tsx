import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineSquares2X2,
  HiOutlineArrowPath,
  HiOutlineMapPin,
  HiOutlinePhoto,
  HiOutlineWrenchScrewdriver,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlinePrinter,
  HiOutlineEllipsisVertical,
  HiOutlineCalendarDays,
  HiOutlineMap
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

const ProgresMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: HiOutlineSquares2X2 },
    { name: 'Monitoring', icon: HiOutlineArrowPath },
    { name: 'Geotag (Titik)', icon: HiOutlineMapPin },
    { name: 'Dokumentasi', icon: HiOutlinePhoto },
    { name: 'Kondisi Tanaman', icon: PiPlant },
    { name: 'Riwayat Perbaikan', icon: HiOutlineWrenchScrewdriver },
    { name: 'Laporan', icon: HiOutlineDocumentText },
  ];

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start text-xs sm:text-sm gap-1 sm:gap-2">
      <div className="flex items-center justify-between sm:w-32.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className="font-bold text-gray-800 wrap-break-words flex-1">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 mt-1">Progres Monitoring Program</h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
              <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
            </button>
            <span className="font-bold text-gray-800 text-lg wrap-break-words">Rehabilitasi Mangrove Karangsong</span>
            <span className="px-3 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-full shrink-0">
              Dalam Monitoring
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              <HiOutlinePrinter className="w-4 h-4" /> Cetak Laporan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              Aksi <HiOutlineEllipsisVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full min-w-0">
        <div className="w-full xl:w-[65%] flex flex-col min-w-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 h-full flex flex-col justify-center">
            <h2 className="text-sm font-bold text-gray-800 mb-6">Informasi Program</h2>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5 min-w-0">
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="ID Program" value="PRG-2026-0007" />
                  <DataRow label="Jenis Program" value="Rehabilitasi Mangrove" />
                  <DataRow label="Sumber Dana" value="APBD" />
                  <DataRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu" />
                  <DataRow label="Luas Area" value="4,2 Ha" />
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                  <DataRow label="Tanggal Selesai" value="15 September 2026" />
                  <DataRow label="Target Tanam" value="2.500 Pohon" />
                  <DataRow label="Realisasi Tanam" value="2.500 Pohon" />
                  <DataRow label="Penyuluh" value="Ahmad Fauzi" />
                  <DataRow label="KTH" value="KTH Karangsong Lestari" />
                </div>
              </div>

            </div>
              <div className="w-full lg:w-60 h-50 lg:h-45 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0 group">
                 <img 
                   src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" 
                   alt="Map" 
                   className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                 />
                 <HiOutlineMapPin className="w-10 h-10 text-red-500 drop-shadow-md relative z-10 m-auto" />
                 <a href="#" className="absolute bottom-0 inset-x-0 bg-white p-3 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                   <HiOutlineMap className="w-4 h-4"/> Lihat di Peta
                 </a>
              </div>
          </div>
        </div>

        <div className="w-full xl:w-[35%] bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Ringkasan Status</h2>
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <div className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center shadow-inner" 
                 style={{ background: 'conic-gradient(#10b981 0% 62%, #f97316 62% 88%, #3b82f6 88% 100%)' }}>
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-sm text-center">
                <span className="text-2xl font-bold text-gray-800 leading-none">62%</span>
                <span className="text-[8px] font-bold text-gray-400 mt-1 leading-tight">Persentase<br/>Keberhasilan</span>
              </div>
            </div>
            <div className="flex-1 space-y-3 text-xs font-bold text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span> Tanaman Hidup</div><span className="text-gray-800">1.550 (62%)</span></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span> Tanaman Mati</div><span className="text-gray-800">650 (26%)</span></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span> Belum Tumbuh</div><span className="text-gray-800">300 (12%)</span></div>
            </div>
          </div>
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-4 flex gap-3 items-start">
            <HiOutlineCalendarDays className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold mb-0.5">Status Program</p>
              <p className="text-sm font-bold text-emerald-700">Dalam Monitoring</p>
              <p className="text-[10px] text-gray-500 font-medium mt-1">Periode Monitoring ke-2 dari 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-2 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.name ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" /> {tab.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full items-start min-w-0">
        <div className="w-full xl:w-[65%] flex flex-col gap-6 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><HiOutlineMapPin className="w-5 h-5"/></div><p className="text-[11px] font-bold text-gray-600">Monitoring Selesai</p></div>
              <div><p className="text-2xl font-bold text-gray-800">2</p><p className="text-[10px] text-gray-400 font-medium mb-1">dari 4 Periode</p><a href="#" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"><HiOutlineCalendarDays className="w-3 h-3"/> Lihat Jadwal</a></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HiOutlineUserGroup className="w-5 h-5"/></div><p className="text-[11px] font-bold text-gray-600">Kunjungan Lapangan</p></div>
              <div><p className="text-2xl font-bold text-gray-800">2</p><p className="text-[10px] text-gray-400 font-medium">kali kunjungan</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><HiOutlinePhoto className="w-5 h-5"/></div><p className="text-[11px] font-bold text-gray-600">Foto Geotag</p></div>
              <div><p className="text-2xl font-bold text-gray-800">18</p><p className="text-[10px] text-gray-400 font-medium">foto</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><HiOutlineChartBar className="w-5 h-5"/></div><p className="text-[11px] font-bold text-gray-600 leading-tight">Persentase Keberhasilan</p></div>
              <div><p className="text-2xl font-bold text-gray-800">62<span className="text-lg">%</span></p><p className="text-[10px] text-gray-400 font-medium">dari target</p></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-6">Grafik Perkembangan Tanaman</h2>
              <div className="flex-1 w-full relative">
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

                  <text x="60" y="155" fontSize="8" fill="#6b7280" textAnchor="middle">Jul 2026</text>
                  <text x="140" y="155" fontSize="8" fill="#6b7280" textAnchor="middle">Ags 2026</text>
                  <text x="220" y="155" fontSize="8" fill="#6b7280" textAnchor="middle">Sep 2026</text>
                  <text x="300" y="155" fontSize="8" fill="#6b7280" textAnchor="middle">Okt 2026</text>

                  <polyline points="60,105 140,80 220,55 300,35" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="98" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">25%</text>
                  <text x="140" y="73" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">45%</text>
                  <text x="220" y="48" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">62%</text>
                  <text x="300" y="28" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">75%</text>

                  <polyline points="60,126 140,115 220,103 300,112" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="136" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">10%</text>
                  <text x="140" y="125" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">18%</text>
                  <text x="220" y="96" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">26%</text>
                  <text x="300" y="122" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">20%</text>

                  <polyline points="60,50 140,88 220,123 300,133" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="60" y="43" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">65%</text>
                  <text x="140" y="98" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">37%</text>
                  <text x="220" y="133" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">12%</text>
                  <text x="300" y="143" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">5%</text>
                </svg>
              </div>
              <div className="flex justify-center gap-4 mt-6 text-[9px] font-bold text-gray-600">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tanaman Hidup</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Tanaman Mati</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Belum Tumbuh</div>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <h2 className="text-sm font-bold text-gray-800 mb-6">Target vs Realisasi</h2>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700">Target Tanam</span><span className="text-emerald-700">2.500 (100%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-emerald-600 h-1.5 rounded-full" style={{width: '100%'}}></div></div>
                </div>
                <hr className="border-gray-100"/>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700">Tanaman Hidup</span><span className="text-gray-500">1.550 (62%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '62%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700">Tanaman Mati</span><span className="text-gray-500">650 (26%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full" style={{width: '26%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700">Belum Tumbuh</span><span className="text-gray-500">300 (12%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{width: '12%'}}></div></div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mt-6 flex gap-3 items-center">
                <HiOutlineInformationCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-gray-500 font-medium">Data terakhir diperbarui pada<br/><span className="font-bold text-gray-700">27 Mei 2026 14:20 WIB</span></p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Monitoring Terakhir</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-2">Periode</th>
                    <th className="py-3 px-2">Tanggal Monitoring</th>
                    <th className="py-3 px-2">Penyuluh</th>
                    <th className="py-3 px-2 text-center">Kunjungan</th>
                    <th className="py-3 px-2 text-center">Persentase Hidup</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="py-3 px-2 font-bold text-gray-800">Periode 2</td>
                    <td className="py-3 px-2 text-gray-600">27 Mei 2026</td>
                    <td className="py-3 px-2 text-gray-800 font-medium">Ahmad Fauzi</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">2</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">62%</td>
                    <td className="py-3 px-2 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">Selesai</span></td>
                    <td className="py-3 px-2 text-center">
                      <button onClick={() => navigate('/admin/staff/monitoring/monitoring-program/progres/1/titik/2')} className="px-3 py-1.5 border rounded-lg font-bold hover:bg-gray-50 text-gray-700 cursor-pointer shadow-sm transition-colors">Lihat Detail</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-bold text-gray-800">Periode 1</td>
                    <td className="py-3 px-2 text-gray-600">10 Mei 2026</td>
                    <td className="py-3 px-2 text-gray-800 font-medium">Ahmad Fauzi</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">1</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">45%</td>
                    <td className="py-3 px-2 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">Selesai</span></td>
                    <td className="py-3 px-2 text-center">
                      <button className="px-3 py-1.5 border rounded-lg font-bold hover:bg-gray-50 text-gray-700 cursor-pointer shadow-sm transition-colors">Lihat Detail</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat semua monitoring <span className="text-lg leading-none">&rarr;</span></a>
            </div>
          </div>

        </div>

        <div className="w-full xl:w-[35%] flex flex-col gap-6 shrink-0 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Monitoring Terbaru (Periode 2)</h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="relative rounded-lg overflow-hidden h-20 sm:h-24 bg-gray-100 border border-gray-200 group">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80" alt="Titik 5" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><HiOutlineMapPin/> Titik 5</div>
              </div>
              <div className="relative rounded-lg overflow-hidden h-20 sm:h-24 bg-gray-100 border border-gray-200 group">
                <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=200&q=80" alt="Titik 6" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><HiOutlineMapPin/> Titik 6</div>
              </div>
              <div className="relative rounded-lg overflow-hidden h-20 sm:h-24 bg-gray-100 border border-gray-200 group">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200&q=80" alt="Titik 7" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><HiOutlineMapPin/> Titik 7</div>
              </div>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat semua dokumentasi <span className="text-lg leading-none">&rarr;</span></a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Lokasi Titik Monitoring</h2>
            <div className="w-full h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative mb-4 flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50" />
               <HiOutlineMapPin className="absolute top-[25%] left-[20%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
               <HiOutlineMapPin className="absolute top-[40%] right-[30%] w-6 h-6 text-orange-500 bg-white rounded-full p-1 drop-shadow" />
               <HiOutlineMapPin className="absolute bottom-[20%] left-[50%] w-6 h-6 text-red-500 bg-white rounded-full p-1 drop-shadow" />
               <HiOutlineMapPin className="absolute bottom-[35%] right-[15%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 mb-4">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Baik</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Sedang</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Perlu Tindak Lanjut</div>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat Peta Selengkapnya <span className="text-lg leading-none">&rarr;</span></a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Aktivitas Terbaru</h2>
            <div className="space-y-4 mb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100"><HiOutlineMapPin className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 leading-snug wrap-break-words">Monitoring lapangan periode 2 telah diselesaikan</p>
                  <p className="text-[10px] text-gray-500">oleh Ahmad Fauzi</p>
                </div>
                <div className="text-[9px] text-gray-400 text-right shrink-0">27 Mei 2026<br/>14:20</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 border border-gray-200"><HiOutlinePhoto className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 leading-snug wrap-break-words">Data monitoring titik 6 diperbarui</p>
                  <p className="text-[10px] text-gray-500">oleh Ahmad Fauzi</p>
                </div>
                <div className="text-[9px] text-gray-400 text-right shrink-0">27 Mei 2026<br/>14:18</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100"><HiOutlinePhoto className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 leading-snug wrap-break-words">Foto geotag baru di titik 7</p>
                  <p className="text-[10px] text-gray-500">oleh Ahmad Fauzi</p>
                </div>
                <div className="text-[9px] text-gray-400 text-right shrink-0">27 Mei 2026<br/>14:15</div>
              </div>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat semua aktivitas <span className="text-lg leading-none">&rarr;</span></a>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProgresMonitoring;