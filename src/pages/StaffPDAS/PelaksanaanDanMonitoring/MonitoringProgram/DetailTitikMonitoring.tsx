import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineEllipsisVertical,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineCloud,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineSquare2Stack,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineListBullet
} from 'react-icons/hi2';
import { PiPlant, PiDrop, PiBug, PiTrash, PiShovel, PiListChecks } from 'react-icons/pi';

const DetailTitikMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Detail');

  const tabs = [
    { name: 'Detail', icon: HiOutlineDocumentText },
    { name: 'Foto', icon: HiOutlinePhoto },
    { name: 'Kondisi Tanaman', icon: PiPlant },
    { name: 'Catatan', icon: HiOutlineListBullet }, // Using standard icon as placeholder
  ];

  // Helper untuk baris Informasi Lokasi
  const InfoRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">{icon} {value}</div>
    </div>
  );

  // Helper untuk grid Kondisi Tanaman
  const ConditionItem = ({ icon: Icon, label, value, isGreen = false }: { icon: any, label: string, value: string, isGreen?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-1 sm:gap-2">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="text-xs text-gray-600 font-medium">{label}</span>
      </div>
      <span className={`text-xs font-bold text-right ${isGreen ? 'text-emerald-600' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );

  // Helper untuk Sidebar Summary
  const SummaryRow = ({ label, value, valColor = "text-gray-800" }: { label: string, value: React.ReactNode, valColor?: string }) => (
    <div className="flex justify-between items-start gap-3 py-1.5">
      <span className="text-xs text-gray-600 font-medium">{label}</span>
      <span className={`text-xs font-bold text-right ${valColor}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500 font-medium">
          Monitoring Program <span className="mx-1">&gt;</span> Lihat Progres <span className="mx-1">&gt;</span> Detail Monitoring <span className="mx-1">&gt;</span> Detail Titik Monitoring
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <h1 className="text-2xl font-bold text-gray-800">Detail Titik Monitoring</h1>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none items-center justify-center flex gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm bg-white transition-colors">
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
          <span className="px-3 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-full shrink-0">
            Dalam Monitoring
          </span>
        </div>
      </div>

      {/* 2. TOP 5 CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><HiOutlineCalendarDays className="w-5 h-5" /></div>
          <div className="min-w-0"><p className="text-[10px] text-gray-500 font-medium truncate">Periode Monitoring</p><p className="text-xs font-bold text-gray-800 leading-snug">Periode 2 dari 4<br/>27 Mei 2026</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineMapPin className="w-5 h-5" /></div>
          <div className="min-w-0"><p className="text-[10px] text-gray-500 font-medium truncate">Titik Monitoring</p><p className="text-xs font-bold text-gray-800 leading-snug">Titik ke 7 dari 18</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><HiOutlineUser className="w-5 h-5" /></div>
          <div className="min-w-0"><p className="text-[10px] text-gray-500 font-medium truncate">Penyuluh</p><p className="text-xs font-bold text-gray-800 leading-snug">Ahmad Fauzi</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineUserGroup className="w-5 h-5" /></div>
          <div className="min-w-0"><p className="text-[10px] text-gray-500 font-medium truncate">KTH</p><p className="text-xs font-bold text-gray-800 leading-snug">KTH Karangsong Lestari</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 md:col-span-3 lg:col-span-1">
          <div className="w-10 h-10 rounded-full bg-[#EBF8F1] text-[#185325] flex items-center justify-center shrink-0"><HiOutlineCalendarDays className="w-5 h-5" /></div>
          <div className="min-w-0"><p className="text-[10px] text-gray-500 font-medium truncate">Status Titik</p><span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] rounded-full">Selesai</span></div>
        </div>
      </div>

      {/* 3. TABS */}
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

      {/* 4. MAIN CONTENT AREA */}
      <div className="flex flex-col xl:flex-row gap-6 w-full items-start min-w-0">
        
        {/* ================= KOLOM KIRI (UTAMA) ================= */}
        <div className="w-full xl:w-[70%] flex flex-col gap-6 min-w-0">
          
          {/* Card: Informasi Lokasi & Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6">Informasi Lokasi</h2>
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Data Lokasi */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <InfoRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu" />
                <InfoRow label="Koordinat" value="6.363421° S, 108.283721° E" />
                <InfoRow label="Ketinggian" value="2 mdpl" />
                <InfoRow label="Tanggal Monitoring" value="27 Mei 2026 14:18 WIB" />
                <InfoRow label="Metode Pengambilan Lokasi" value="GPS (Akurasi ± 3 meter)" />
                <InfoRow label="Cuaca Saat Monitoring" value={<><HiOutlineCloud className="text-blue-500 w-4 h-4"/> Cerah</>} />
              </div>
              
              {/* Interactive Map Area */}
              <div className="flex-1 min-h-62.5 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col group">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                
                {/* Mock Markers */}
                <HiOutlineMapPin className="absolute top-[20%] left-[20%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute top-[30%] left-[40%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute top-[40%] right-[30%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute bottom-[20%] right-[40%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                <HiOutlineMapPin className="absolute bottom-[40%] left-[10%] w-6 h-6 text-emerald-500 bg-white rounded-full p-1 drop-shadow" />
                
                {/* Active Marker */}
                <div className="absolute top-[45%] left-[55%] flex flex-col items-center">
                  <div className="w-8 h-8 text-orange-500 bg-white rounded-full flex items-center justify-center drop-shadow-lg z-10 border-2 border-orange-500">
                    <HiOutlineMapPin className="w-5 h-5" />
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden text-gray-600">
                    <button className="p-2 hover:bg-gray-50 border-b border-gray-100"><HiOutlinePlus/></button>
                    <button className="p-2 hover:bg-gray-50"><HiOutlineMinus/></button>
                  </div>
                  <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
                    <HiOutlineSquare2Stack/>
                  </button>
                </div>
                
                <div className="absolute bottom-3 left-3 z-10">
                  <a href="#" className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-blue-600 text-[11px] font-bold border border-gray-200 shadow-sm hover:bg-white transition-colors">
                    Lihat di Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Dokumentasi Foto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Foto</h2>
            
            <div className="flex gap-3 overflow-hidden scrollbar-hide snap-x">
              <div className="w-1/4 min-w-35 shrink-0 h-32 sm:h-40 rounded-xl overflow-hidden relative border border-gray-200 snap-start group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80" alt="Foto 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-6"><p className="text-white text-[10px] font-bold">Foto 1</p><p className="text-gray-300 text-[9px]">Arah Depan</p></div>
              </div>
              <div className="w-1/4 min-w-35 shrink-0 h-32 sm:h-40 rounded-xl overflow-hidden relative border border-gray-200 snap-start group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=300&q=80" alt="Foto 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-6"><p className="text-white text-[10px] font-bold">Foto 2</p><p className="text-gray-300 text-[9px]">Arah Kanan</p></div>
              </div>
              <div className="w-1/4 min-w-35 shrink-0 h-32 sm:h-40 rounded-xl overflow-hidden relative border border-gray-200 snap-start group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80" alt="Foto 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-6"><p className="text-white text-[10px] font-bold">Foto 3</p><p className="text-gray-300 text-[9px]">Arah Kiri</p></div>
              </div>
              <div className="w-1/4 min-w-35 shrink-0 h-32 sm:h-40 rounded-xl overflow-hidden relative border border-gray-200 snap-start group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=300&q=80" alt="Foto 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-6"><p className="text-white text-[10px] font-bold">Foto 4</p><p className="text-gray-300 text-[9px]">Arah Belakang</p></div>
              </div>
              <div className="w-1/4 min-w-35 shrink-0 h-32 sm:h-40 rounded-xl overflow-hidden relative border border-gray-800 bg-gray-900 flex items-center justify-center snap-start cursor-pointer hover:bg-black transition-colors">
                <div className="text-center"><p className="text-white text-lg font-bold">+ 4</p><p className="text-gray-400 text-[10px] font-medium mt-0.5">Foto Lainnya</p></div>
              </div>
            </div>

            {/* Navigation Arrows (Absolute) */}
            <button className="absolute left-3 top-1/2 mt-2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-white z-10"><HiChevronLeft/></button>
            <button className="absolute right-3 top-1/2 mt-2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-white z-10"><HiChevronRight/></button>
          </div>

          {/* Card: Kondisi Tanaman */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Kondisi Tanaman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              <ConditionItem icon={PiPlant} label="Kerapatan Tanaman" value="1.200 pohon/ha" />
              <ConditionItem icon={PiDrop} label="Media Tanam" value="Lumpur Berpasir" />
              <ConditionItem icon={PiShovel} label="Tindakan yang Dilakukan" value="Pemupukan" />
              <ConditionItem icon={HiOutlineCheckCircle} label="Kondisi Tanaman" value="Baik" isGreen />
              <ConditionItem icon={HiOutlineCloud} label="Genangan Air" value="Sedang" />
              <ConditionItem icon={PiListChecks} label="Rekomendasi Tindak Lanjut" value="Monitoring Rutin" />
              <ConditionItem icon={PiBug} label="Serangan Hama / Penyakit" value="Tidak Ada" />
              <ConditionItem icon={PiTrash} label="Sampah / Gulma" value="Sedikit" />
            </div>
          </div>

          {/* Card: Catatan Penyuluh */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Catatan Penyuluh</h2>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              Secara umum tanaman dalam kondisi baik dan menunjukkan pertumbuhan yang optimal. Beberapa tanaman mati karena faktor pasang surut air laut tinggi.
            </p>
          </div>

        </div>

        {/* ================= KOLOM KANAN (SIDEBAR) ================= */}
        <div className="w-full xl:w-[30%] flex flex-col gap-6 shrink-0 min-w-0">
          
          {/* Card: Ringkasan Monitoring Titik Ini */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Ringkasan Monitoring Titik Ini</h2>
            
            <div className="space-y-1 mb-4">
              <SummaryRow label="Jumlah Tanaman" value="100 Pohon" />
              <SummaryRow label="Jumlah Hidup" value="82 Pohon (82%)" valColor="text-emerald-600" />
              <SummaryRow label="Jumlah Mati" value="18 Pohon (18%)" valColor="text-orange-500" />
              <SummaryRow label="Persentase Hidup" value="82%" valColor="text-emerald-600" />
            </div>
            
            <hr className="border-gray-100 my-4" />
            
            <div className="space-y-1">
              <SummaryRow label="Tinggi Rata-rata" value="78 cm" />
              <SummaryRow label="Diameter Rata-rata" value="1,2 cm" />
              <SummaryRow label="Jenis Tanaman" value="Rhizophora mucronata" valColor="text-blue-600 font-medium" />
              <SummaryRow label="Umur Tanaman" value="3 Bulan" />
              <SummaryRow label="Kondisi Umum" value={<span className="px-2 py-0.5 bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] rounded-md text-[10px]">Baik</span>} />
            </div>
          </div>

          {/* Card: Riwayat Perubahan (Timeline) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6">Riwayat Perubahan</h2>
            
            <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pb-2">
              
              <div className="relative pl-6">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500">
                  <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Monitoring dilakukan</h3>
                  <p className="text-[10px] text-gray-500 mt-1">27 Mei 2026 14:18 WIB<br/>Oleh Ahmad Fauzi</p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500">
                  <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Hasil dikirim</h3>
                  <p className="text-[10px] text-gray-500 mt-1">27 Mei 2026 14:20 WIB<br/>Oleh Ahmad Fauzi</p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500">
                  <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Data diperbarui</h3>
                  <p className="text-[10px] text-gray-500 mt-1">27 Mei 2026 14:20 WIB<br/>Oleh Ahmad Fauzi</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default DetailTitikMonitoring;