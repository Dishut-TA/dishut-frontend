import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlinePhoto,
  HiOutlineWrenchScrewdriver,
  HiOutlineSquares2X2,
  HiChevronDown
} from 'react-icons/hi2';
import { HiCheckCircle } from 'react-icons/hi';
import { PiPlant } from 'react-icons/pi';

const HasilMonitoringSelesai: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Ringkasan');

  const tabs = [
    { name: 'Ringkasan', icon: HiOutlineSquares2X2 },
    { name: 'Kondisi Tanaman', icon: PiPlant },
    { name: 'Geotag (Titik)', icon: HiOutlineMapPin },
    { name: 'Dokumentasi', icon: HiOutlinePhoto },
    { name: 'Catatan', icon: HiOutlineDocumentText },
    { name: 'Riwayat Monitoring', icon: HiOutlineWrenchScrewdriver },
  ];

  // HELPER COMPONENT: Baris Info Program (Responsive Anti-Tabrak)
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
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <h1 className="text-2xl font-bold text-gray-800">Hasil Monitoring Selesai</h1>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              <HiOutlinePrinter className="w-4 h-4" /> Cetak Laporan
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
              Aksi <HiChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
          <span className="font-bold text-gray-800 text-base md:text-lg wrap-break-words">Rehabilitasi Mangrove Karangsong</span>
          <span className="px-3 py-1 text-[11px] font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] rounded-full shrink-0">
            Monitoring Selesai
          </span>
        </div>
      </div>

      {/* 2. MAIN LAYOUT (KIRI: KONTEN, KANAN: SIDEBAR) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full min-w-0">
        
        {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
        <div className="w-full xl:w-[calc(100%-340px)] flex flex-col gap-6 min-w-0">
          
          {/* A. Card Informasi Program */}
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
                    <DataRow label="Sumber Dana" value="APBD" />
                    <DataRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu" />
                    <DataRow label="Luas Area" value="4,2 Ha" />
                  </div>
                  <div className="space-y-4">
                    <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                    <DataRow label="Tanggal Selesai" value="15 September 2026" />
                    <DataRow label="Target Tanam" value="2.500 Pohon" />
                    <DataRow label="Realisasi Tanam" value="2.500 Pohon" />
                    <DataRow label="Penyuluh" value="Ahmad Fauzi" />
                    <DataRow label="KTH" value="KTH Karangsong Lestari" />
                  </div>
                </div>
              </div>

              {/* Peta Mini */}
              <div className="w-full lg:w-55 h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0 group">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <HiOutlineMapPin className="w-8 h-8 text-red-500 drop-shadow-md relative z-10 m-auto" />
                <a href="#" className="absolute bottom-0 inset-x-0 bg-white p-2.5 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <HiOutlineMap className="w-3.5 h-3.5"/> Lihat di Peta
                </a>
              </div>

            </div>
          </div>

          {/* B. TABS NAVIGATION */}
          <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide gap-6 sm:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-1 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.name ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" /> {tab.name}
              </button>
            ))}
          </div>

          {/* C. Ringkasan Hasil Monitoring (6 Kotak Horizontal) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Ringkasan Hasil Monitoring</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-0 sm:divide-x divide-gray-100">
              
              <div className="flex flex-col gap-2 sm:px-4 first:pl-0">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 rounded-full border-4 border-emerald-500 flex items-center justify-center border-t-emerald-200"></div>
                  <span className="text-[9px] font-bold text-gray-500 leading-tight">Persentase Keberhasilan</span>
                </div>
                <div><p className="text-2xl font-bold text-gray-800">92%</p><p className="text-[10px] text-emerald-600 font-bold mt-0.5">Sangat Baik</p></div>
              </div>
              
              <div className="flex flex-col gap-2 sm:px-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><HiOutlineUserGroup className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Tanaman Hidup</span></div>
                <div><p className="text-2xl font-bold text-emerald-600">2.300</p><p className="text-[10px] text-gray-400 font-medium mt-0.5">(92%)</p></div>
              </div>

              <div className="flex flex-col gap-2 sm:px-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-orange-50 text-orange-500"><HiOutlineChartBar className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Tanaman Mati</span></div>
                <div><p className="text-2xl font-bold text-gray-800">200</p><p className="text-[10px] text-gray-400 font-medium mt-0.5">(8%)</p></div>
              </div>

              <div className="flex flex-col gap-2 sm:px-4 border-l-0 lg:border-l">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-blue-50 text-blue-500"><PiPlant className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Belum Tumbuh</span></div>
                <div><p className="text-2xl font-bold text-gray-800">0</p><p className="text-[10px] text-gray-400 font-medium mt-0.5">(0%)</p></div>
              </div>

              <div className="flex flex-col gap-2 sm:px-4">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-purple-50 text-purple-500"><HiOutlineMapPin className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Titik Geotag</span></div>
                <div><p className="text-2xl font-bold text-gray-800">18</p><p className="text-[10px] text-gray-400 font-medium mt-0.5">titik</p></div>
              </div>

              <div className="flex flex-col gap-2 sm:px-4 last:pr-0">
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600"><HiOutlinePhoto className="w-4 h-4"/></div><span className="text-[9px] font-bold text-gray-500 leading-tight">Jumlah Foto</span></div>
                <div><p className="text-2xl font-bold text-gray-800">64</p><p className="text-[10px] text-gray-400 font-medium mt-0.5">foto</p></div>
              </div>

            </div>
          </div>

          {/* D. Grid 2 Kolom (Grafik & Progress Bar) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Grafik Perkembangan 5 Periode */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-6">Grafik Perkembangan Tanaman</h2>
              <div className="flex-1 w-full relative min-h-55">
                <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible">
                  <line x1="20" y1="0" x2="320" y2="0" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="40" x2="320" y2="40" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="80" x2="320" y2="80" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="120" x2="320" y2="120" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="20" y1="160" x2="320" y2="160" stroke="#e5e7eb" strokeWidth="1.5"/>
                  
                  <text x="15" y="5" fontSize="8" fill="#9ca3af" textAnchor="end">100%</text>
                  <text x="15" y="45" fontSize="8" fill="#9ca3af" textAnchor="end">75%</text>
                  <text x="15" y="85" fontSize="8" fill="#9ca3af" textAnchor="end">50%</text>
                  <text x="15" y="125" fontSize="8" fill="#9ca3af" textAnchor="end">25%</text>
                  <text x="15" y="165" fontSize="8" fill="#9ca3af" textAnchor="end">0%</text>

                  {/* X Axis Labels (5 Periods) */}
                  <text x="50" y="175" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 1</text>
                  <text x="50" y="185" fontSize="7" fill="#6b7280" textAnchor="middle">10 Mei 2026</text>
                  
                  <text x="110" y="175" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 2</text>
                  <text x="110" y="185" fontSize="7" fill="#6b7280" textAnchor="middle">27 Mei 2026</text>
                  
                  <text x="170" y="175" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 3</text>
                  <text x="170" y="185" fontSize="7" fill="#6b7280" textAnchor="middle">10 Jul 2026</text>
                  
                  <text x="230" y="175" fontSize="7" fill="#6b7280" textAnchor="middle">Periode 4</text>
                  <text x="230" y="185" fontSize="7" fill="#6b7280" textAnchor="middle">25 Ags 2026</text>

                  <text x="290" y="175" fontSize="7" fill="#6b7280" textAnchor="middle" fontWeight="bold">Periode 5</text>
                  <text x="290" y="185" fontSize="7" fill="#6b7280" textAnchor="middle" fontWeight="bold">15 Sep 2026</text>

                  {/* Tanaman Hidup (Green) */}
                  <polyline points="50,88 110,61 170,45 230,24 290,13" fill="none" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="50" cy="88" r="3" fill="#10b981" />
                  <circle cx="110" cy="61" r="3" fill="#10b981" />
                  <circle cx="170" cy="45" r="3" fill="#10b981" />
                  <circle cx="230" cy="24" r="3" fill="#10b981" />
                  <circle cx="290" cy="13" r="3" fill="#10b981" />
                  <text x="50" y="80" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">45%</text>
                  <text x="110" y="53" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">62%</text>
                  <text x="170" y="37" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">72%</text>
                  <text x="230" y="16" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">85%</text>
                  <text x="290" y="5" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">92%</text>

                  {/* Tanaman Mati (Orange) */}
                  <polyline points="50,131 110,118 170,134 230,144 290,147" fill="none" stroke="#f97316" strokeWidth="1.5" />
                  <circle cx="50" cy="131" r="3" fill="#f97316" />
                  <circle cx="110" cy="118" r="3" fill="#f97316" />
                  <circle cx="170" cy="134" r="3" fill="#f97316" />
                  <circle cx="230" cy="144" r="3" fill="#f97316" />
                  <circle cx="290" cy="147" r="3" fill="#f97316" />
                  <text x="50" y="141" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">18%</text>
                  <text x="110" y="110" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">26%</text>
                  <text x="170" y="126" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">16%</text>
                  <text x="230" y="136" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">10%</text>
                  <text x="290" y="139" fontSize="8" fill="#f97316" textAnchor="middle" fontWeight="bold">8%</text>

                  {/* Belum Tumbuh (Blue) */}
                  <polyline points="50,126 110,141 170,141 230,152 290,160" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  <circle cx="50" cy="126" r="3" fill="#3b82f6" />
                  <circle cx="110" cy="141" r="3" fill="#3b82f6" />
                  <circle cx="170" cy="141" r="3" fill="#3b82f6" />
                  <circle cx="230" cy="152" r="3" fill="#3b82f6" />
                  <circle cx="290" cy="160" r="3" fill="#3b82f6" />
                  <text x="50" y="118" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">21%</text>
                  <text x="110" y="151" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">12%</text>
                  <text x="170" y="151" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">12%</text>
                  <text x="230" y="144" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">5%</text>
                  <text x="290" y="152" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">0%</text>
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-12 text-[10px] font-bold text-gray-600">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span> Tanaman Hidup</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span> Tanaman Mati</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span> Belum Tumbuh</div>
              </div>
            </div>

            {/* Target vs Realisasi */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full justify-between">
              <h2 className="text-sm font-bold text-gray-800 mb-6">Target vs Realisasi</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span className="text-gray-700">Target Tanam</span><span className="text-gray-500">2.500 Pohon</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2 flex items-center">
                    <div className="bg-emerald-600 h-2 rounded-full relative" style={{width: '100%'}}>
                      <span className="absolute -right-2 -top-5 text-[10px] font-bold text-emerald-700">100%</span>
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-100"/>
                
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span className="text-gray-700">Tanaman Hidup</span><span className="text-gray-500">2.300 Pohon (92%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '92%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span className="text-gray-700">Tanaman Mati</span><span className="text-gray-500">200 Pohon (8%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: '8%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span className="text-gray-700">Belum Tumbuh</span><span className="text-gray-500">0 Pohon (0%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-gray-300 h-2 rounded-full" style={{width: '0%'}}></div></div>
                </div>
              </div>
            </div>

          </div>

          {/* E. Riwayat Monitoring Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Riwayat Monitoring</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap mb-4">
                <thead className="text-gray-500 border-b border-gray-100 font-bold">
                  <tr>
                    <th className="py-3 pr-2">Periode</th>
                    <th className="py-3 pr-2">Tanggal Monitoring</th>
                    <th className="py-3 pr-2">Penyuluh</th>
                    <th className="py-3 pr-2 text-center">Persentase Hidup</th>
                    <th className="py-3 pr-2 text-center">Persentase Mati</th>
                    <th className="py-3 pr-2 text-center">Belum Tumbuh</th>
                    <th className="py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  <tr>
                    <td className="py-3 pr-2 font-bold text-gray-800">Periode 5</td>
                    <td className="py-3 pr-2 text-gray-600">15 Sep 2026</td>
                    <td className="py-3 pr-2 text-gray-800">Ahmad Fauzi</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">92%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">8%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">0%</td>
                    <td className="py-3 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold text-gray-800">Periode 4</td>
                    <td className="py-3 pr-2 text-gray-600">25 Ags 2026</td>
                    <td className="py-3 pr-2 text-gray-800">Ahmad Fauzi</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">85%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">10%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">5%</td>
                    <td className="py-3 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold text-gray-800">Periode 3</td>
                    <td className="py-3 pr-2 text-gray-600">10 Jul 2026</td>
                    <td className="py-3 pr-2 text-gray-800">Ahmad Fauzi</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">72%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">16%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">12%</td>
                    <td className="py-3 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold text-gray-800">Periode 2</td>
                    <td className="py-3 pr-2 text-gray-600">27 Mei 2026</td>
                    <td className="py-3 pr-2 text-gray-800">Ahmad Fauzi</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">62%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">20%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">18%</td>
                    <td className="py-3 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold text-gray-800">Periode 1</td>
                    <td className="py-3 pr-2 text-gray-600">10 Mei 2026</td>
                    <td className="py-3 pr-2 text-gray-800">Ahmad Fauzi</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">45%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">26%</td>
                    <td className="py-3 pr-2 text-center font-bold text-gray-800">29%</td>
                    <td className="py-3 text-center"><span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">Selesai</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Lihat semua riwayat <span className="text-lg leading-none">&rarr;</span></a>
          </div>

        </div>

        {/* ================= KOLOM KANAN (SIDEBAR) ================= */}
        <div className="w-full xl:w-85 flex flex-col gap-6 shrink-0 min-w-0">
          
          {/* Status Program */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center flex flex-col items-center justify-center">
            <h2 className="text-sm font-bold text-gray-800 mb-6 self-start w-full text-left">Status Program</h2>
            <HiCheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Monitoring Selesai</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Monitoring telah diselesaikan dan disetujui pada 15 September 2026
            </p>
            <p className="text-xs text-gray-500">Oleh <span className="font-bold text-gray-800">Staff PDAS - Ahmad Fauzi</span></p>
          </div>

          {/* Keputusan & Informasi Evaluasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-4">Keputusan Evaluasi</h2>
              <div className="bg-[#EBF8F1] border border-[#C6EBD6] rounded-xl p-5">
                <p className="text-lg font-bold text-[#185325] mb-2">Disetujui</p>
                <p className="text-xs text-[#185325] leading-relaxed opacity-90">
                  Hasil monitoring sesuai target dan tidak memerlukan tindak lanjut.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-4">Informasi Evaluasi</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2"><span className="w-24 text-gray-500">Tanggal Evaluasi</span><span className="text-gray-500">:</span><span className="font-bold text-gray-800 flex-1">15 September 2026</span></div>
                <div className="flex items-start gap-2"><span className="w-24 text-gray-500">Dievaluasi Oleh</span><span className="text-gray-500">:</span><span className="font-bold text-gray-800 flex-1">Ahmad Fauzi</span></div>
                <div className="flex items-start gap-2"><span className="w-24 text-gray-500">Jabatan</span><span className="text-gray-500">:</span><span className="font-bold text-gray-800 flex-1">Staff PDAS</span></div>
              </div>
            </div>
          </div>

          {/* Dokumentasi Terakhir */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Terakhir</h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="h-16 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
              <div className="h-16 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
              <div className="h-16 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80" alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform"/></div>
              <div className="h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-200 relative cursor-pointer hover:bg-gray-900 transition-colors">
                <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=200&q=80" alt="Foto" className="w-full h-full object-cover opacity-40"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white"><span className="text-sm font-bold">+60</span></div>
              </div>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-auto">Lihat semua dokumentasi <span className="text-base leading-none">&rarr;</span></a>
          </div>

          {/* Catatan Penyuluh Terakhir */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Catatan Penyuluh Terakhir</h2>
            <div className="flex gap-2 items-start mb-6">
              <span className="text-3xl text-emerald-500 leading-none font-serif mt-1">"</span>
              <p className="text-xs text-gray-600 leading-relaxed text-justify mt-2">
                Secara umum tanaman dalam kondisi baik dan menunjukkan pertumbuhan yang optimal.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[10px] text-gray-500 font-medium">
              <div className="flex items-center gap-2"><HiOutlineCalendarDays className="w-4 h-4"/> 15 September 2026 14:25 WIB</div>
              <div className="flex items-center gap-2"><HiOutlineUser className="w-4 h-4"/> <span><span className="font-bold text-gray-700">Ahmad Fauzi</span><br/>Penyuluh Penanggung Jawab</span></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HasilMonitoringSelesai;