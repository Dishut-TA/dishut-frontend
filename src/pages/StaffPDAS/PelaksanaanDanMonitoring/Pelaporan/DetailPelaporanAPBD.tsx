import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineCheckCircle,
  HiOutlineCloud,
  HiChevronRight,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import { PiPlant, PiFileText, PiSquaresFour } from 'react-icons/pi';

const DetailPelaporanAPBD: React.FC = () => {
  const location = useLocation();
  // Simulasi Status: Jika dari tabel diklik "Disahkan", maka masuk mode Disahkan (Gambar 3).
  // Jika tidak, masuk mode Draft (Gambar 2).
  const status = location.state?.status || 'Draft'; 
  const isDisahkan = status === 'Disahkan';

  // HELPER COMPONENTS
  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-2.75 sm:text-xs">
      <div className="flex items-center justify-between sm:w-32.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className="font-bold text-gray-800 wrap-break-words flex-1 min-w-0">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-28 animate-in fade-in duration-300">
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {isDisahkan ? 'Laporan Hasil Pelaksanaan & Monitoring Program (APBD/CSR)' : 'Buat Laporan Pelaksanaan & Monitoring Program (APBD/CSR)'}
            </h1>
            <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full flex items-center gap-1 ${isDisahkan ? 'bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <HiOutlineCheckCircle className="w-3.5 h-3.5" /> {isDisahkan ? 'Disahkan' : 'Draft'}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {isDisahkan ? (
              <>
                <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm bg-white flex items-center gap-2 transition-colors"><HiOutlineCloud className="w-4 h-4 rotate-180" /> Unduh PDF</button>
                <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm bg-white flex items-center gap-2 transition-colors">Aksi Lainnya ▾</button>
              </>
            ) : (
              <>
                <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm bg-white transition-colors flex items-center gap-2"><PiFileText className="w-4 h-4"/> Simpan Draft</button>
                <button className="px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4 rotate-45"/> Kirim untuk Persetujuan</button>
              </>
            )}
          </div>
        </div>
        {!isDisahkan && <p className="text-sm text-gray-500 mt-1 font-medium">Data program, pelaksanaan, dan monitoring diambil otomatis dari sistem.</p>}
        {isDisahkan && <p className="text-sm text-gray-500 mt-1 font-medium">Laporan telah disahkan oleh Kepala Bidang PDAS Provinsi Jawa Barat.</p>}
      </div>

      {/* 2. MAIN LAYOUT (KIRI: KONTEN, KANAN: SIDEBAR) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full min-w-0">
        
        {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
        <div className="w-full xl:w-[calc(100%-360px)] flex flex-col gap-6 min-w-0">
          
          {/* Card A: Informasi Program */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start min-w-0">
              <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0 w-full">
                <div className="w-12 h-12 rounded-full bg-[#EBF8F1] text-[#185325] flex items-center justify-center shrink-0"><PiPlant className="w-6 h-6" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 min-w-0">
                  <div className="space-y-3">
                    <DataRow label="ID Program" value="PRG-2026-0007" />
                    <DataRow label="Nama Program" value="Rehabilitasi Mangrove Karangsong" />
                    <DataRow label="Jenis Program" value="Mangrove" />
                    <DataRow label="Sumber Dana" value="APBD" />
                    <DataRow label="Lokasi" value="Desa Karangsong, Kec. Indramayu, Kab. Indramayu" />
                    <DataRow label="Luas Area" value="4,2 Ha" />
                  </div>
                  <div className="space-y-3">
                    <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                    <DataRow label="Tanggal Selesai" value="15 September 2026" />
                    <DataRow label="Target Tanam" value="2.500 Pohon" />
                    <DataRow label="Realisasi Tanam" value="2.480 Pohon (99,2%)" />
                    <DataRow label="Penyuluh" value="Ahmad Fauzi" />
                    <DataRow label="KTH" value="KTH Karangsong Lestari" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-55 h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <HiOutlineMapPin className="w-8 h-8 text-red-500 drop-shadow-md relative z-10 m-auto" />
                <a href="#" className="absolute bottom-0 inset-x-0 bg-white p-2.5 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <HiOutlineMap className="w-3.5 h-3.5"/> Lihat di Peta
                </a>
              </div>
            </div>
          </div>

          {/* Card B: Ringkasan Target & Realisasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Ringkasan Target & Realisasi</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PiPlant className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Target Tanam</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">2.500</p><p className="text-xs text-gray-500 font-medium mt-1">Pohon</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PiFileText className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Realisasi Tanam</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">2.480</p><p className="text-xs text-gray-500 font-medium mt-1">Pohon (99,2%)</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><HiOutlineCheckCircle className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Persentase Hidup</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">92%</p><p className="text-xs text-gray-500 font-medium mt-1">(2.284 Pohon)</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PiSquaresFour className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Luas Tertanam</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">4,0</p><p className="text-xs text-gray-500 font-medium mt-1">Ha</p></div>
              </div>
            </div>
          </div>

          {!isDisahkan && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-center">
              <HiOutlineInformationCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs font-bold text-blue-800">Silakan lengkapi bagian berikut. Data pada bagian sebelumnya diambil otomatis dari sistem.</p>
            </div>
          )}

          {/* Conditional Content: Draft vs Disahkan */}
          {!isDisahkan ? (
            /* Layout Mode Draft (Gambar 2: Textarea input) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Ringkasan Pelaksanaan <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea rows={8} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 leading-relaxed bg-white" placeholder="Jelaskan secara ringkas bagaimana pelaksanaan program ini dilakukan, tahapan yang sudah dilalui, dan capaian utama yang diperoleh..."></textarea>
                  <span className="absolute bottom-3 left-4 text-[9px] font-bold text-gray-400">0 / 1000 karakter</span>
                  <div className="absolute bottom-3 right-3 text-gray-300 rotate-45 transform origin-center text-xs">⇲</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Analisis Pelaksanaan <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea rows={8} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 leading-relaxed bg-white" placeholder="Jelaskan analisis Anda terhadap capaian program, faktor yang mempengaruhi keberhasilan atau kekurangan program..."></textarea>
                  <span className="absolute bottom-3 left-4 text-[9px] font-bold text-gray-400">0 / 1000 karakter</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-2">Kendala Pelaksanaan & Solusi <span className="text-red-500">*</span></label>
                  <label className="text-[10px] text-gray-500 font-medium block mb-1">Kendala yang Dihadapi</label>
                  <div className="relative mb-3">
                    <textarea rows={3} className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 bg-white" placeholder="Jelaskan kendala yang dihadapi selama pelaksanaan..."></textarea>
                    <span className="absolute bottom-2 left-3 text-[9px] font-bold text-gray-400">0 / 500 karakter</span>
                  </div>
                  <label className="text-[10px] text-gray-500 font-medium block mb-1">Solusi yang Dilakukan</label>
                  <div className="relative">
                    <textarea rows={3} className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 bg-white" placeholder="Jelaskan langkah atau solusi yang dilakukan..."></textarea>
                    <span className="absolute bottom-2 left-3 text-[9px] font-bold text-gray-400">0 / 500 karakter</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Layout Mode Disahkan (Gambar 3: Text Read-only) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Ringkasan Program</h2>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">Program Rehabilitasi Mangrove Karangsong bertujuan untuk memulihkan ekosistem pesisir yang rusak akibat abrasi dan meningkatkan fungsi perlindungan kawasan pesisir serta meningkatkan kesejahteraan masyarakat melalui pengelolaan mangrove secara berkelanjutan. <span className="font-bold text-gray-400 bg-gray-100 px-1 rounded blur-[2px] select-none">Lorem ipsum</span></p>
                <h2 className="text-sm font-bold text-gray-800 mb-3 mt-6">Penerima Manfaat</h2>
                <p className="text-xs text-gray-600 leading-relaxed">Masyarakat Desa Karangsong dan sekitarnya (± 120 KK).</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-4">Tujuan Program</h2>
                <ul className="space-y-3 text-xs text-gray-600 list-disc pl-4 marker:text-gray-400">
                  <li>Memulihkan ekosistem mangrove di kawasan pesisir Karangsong.</li>
                  <li>Meningkatkan ketahanan kawasan pesisir terhadap abrasi dan gelombang pasang.</li>
                  <li>Meningkatkan kesejahteraan masyarakat melalui pemberdayaan kelompok tani hutan.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Grid Bawah: Rekap Anggaran, Pelaksanaan, Monitoring */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Rekapitulasi */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-5">Rekapitulasi Anggaran & Output</h2>
              <div className="space-y-4 text-xs font-medium text-gray-600 flex-1">
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><PiFileText className="w-4 h-4 text-gray-400"/> Total Anggaran</span><span className="font-bold text-gray-800">Rp 125.000.000</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-gray-400"/> Realisasi Anggaran</span><span className="font-bold text-gray-800">Rp 118.750.000 (95%)</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><PiPlant className="w-4 h-4 text-gray-400"/> Total Bibit (Diterima)</span><span className="font-bold text-gray-800">2.500 Pohon</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><PiPlant className="w-4 h-4 text-gray-400"/> Total Bibit (Ditanam)</span><span className="font-bold text-gray-800">2.480 Pohon (99,2%)</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-gray-400"/> Persentase Hidup</span><span className="font-bold text-gray-800">92% (2.284 Pohon)</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4 text-gray-400"/> Luas Tertanam</span><span className="font-bold text-gray-800">4,0 Ha</span></div>
              </div>
            </div>

            {/* Preview Pelaksanaan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Preview Data Pelaksanaan</h2>
              <table className="w-full text-left text-[10px] whitespace-nowrap mb-4 flex-1">
                <thead className="text-gray-500 font-bold border-b border-gray-100">
                  <tr><th className="py-2 pr-2">Kegiatan</th><th className="py-2 pr-2">Tanggal</th><th className="py-2 pr-2">Realisasi</th><th className="py-2 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  <tr><td className="py-2.5 pr-2">Persiapan Lokasi</td><td className="py-2.5 pr-2">05 Jul 2026</td><td className="py-2.5 pr-2 text-emerald-600 font-bold">Selesai</td><td className="py-2.5 text-center text-emerald-600 font-bold">Selesai</td></tr>
                  <tr><td className="py-2.5 pr-2">Pengadaan Bibit</td><td className="py-2.5 pr-2">07 Jul 2026</td><td className="py-2.5 pr-2 text-emerald-600 font-bold">Selesai</td><td className="py-2.5 text-center text-emerald-600 font-bold">Selesai</td></tr>
                  <tr><td className="py-2.5 pr-2">Penanaman</td><td className="py-2.5 pr-2">12 Jul 2026</td><td className="py-2.5 pr-2">2.480 Pohon</td><td className="py-2.5 text-center text-emerald-600 font-bold">Selesai</td></tr>
                  <tr><td className="py-2.5 pr-2">Pemeliharaan</td><td className="py-2.5 pr-2">20 Jul 2026</td><td className="py-2.5 pr-2">3 Kali</td><td className="py-2.5 text-center text-emerald-600 font-bold">Selesai</td></tr>
                </tbody>
              </table>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">Lihat detail pelaksanaan <HiChevronRight className="w-3 h-3"/></button>
            </div>

            {/* Preview Monitoring */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Preview Monitoring Terakhir</h2>
              <div className="flex gap-4 flex-1">
                <div className="w-1/2 space-y-3 text-[10px] font-medium text-gray-600">
                  <div className="flex justify-between items-center"><span>Tanggal Monitoring</span><span className="font-bold text-gray-800">10 Sep 2026</span></div>
                  <div className="flex justify-between items-center"><span>Persentase Hidup</span><span className="font-bold text-gray-800">92%</span></div>
                  <div className="flex justify-between items-center"><span>Jumlah Hidup</span><span className="font-bold text-gray-800">2.284 Pohon</span></div>
                  <div className="flex justify-between items-center"><span>Jumlah Mati</span><span className="font-bold text-gray-800">196 Pohon</span></div>
                  <div className="flex justify-between items-center"><span>Jumlah Belum Tumbuh</span><span className="font-bold text-gray-800">0 Pohon</span></div>
                </div>
                <div className="w-1/2 flex flex-col justify-end">
                  <p className="text-[9px] font-bold text-gray-700 text-center mb-1">Grafik Perkembangan<br/><span className="font-normal text-gray-500">(Persentase Hidup)</span></p>
                  <div className="w-full h-24 relative">
                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                      <polyline points="10,80 55,60 100,45 145,25 190,15" fill="none" stroke="#10b981" strokeWidth="2" />
                      <circle cx="10" cy="80" r="3" fill="#10b981" />
                      <circle cx="55" cy="60" r="3" fill="#10b981" />
                      <circle cx="100" cy="45" r="3" fill="#10b981" />
                      <circle cx="145" cy="25" r="3" fill="#10b981" />
                      <circle cx="190" cy="15" r="3" fill="#10b981" />
                      <text x="10" y="70" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">45%</text>
                      <text x="55" y="50" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">62%</text>
                      <text x="100" y="35" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">72%</text>
                      <text x="145" y="15" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">85%</text>
                      <text x="190" y="5" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">92%</text>
                      <text x="10" y="105" fontSize="6" fill="#6b7280" textAnchor="middle">Periode 1</text>
                      <text x="55" y="105" fontSize="6" fill="#6b7280" textAnchor="middle">Periode 2</text>
                      <text x="100" y="105" fontSize="6" fill="#6b7280" textAnchor="middle">Periode 3</text>
                      <text x="145" y="105" fontSize="6" fill="#6b7280" textAnchor="middle">Periode 4</text>
                      <text x="190" y="105" fontSize="6" fill="#6b7280" textAnchor="middle">Periode 5</text>
                    </svg>
                  </div>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline mt-4">Lihat detail monitoring <HiChevronRight className="w-3 h-3"/></button>
            </div>
          </div>

          {/* Dokumentasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Pelaksanaan</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <div className="flex flex-col gap-1.5"><div className="h-28 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80" className="w-full h-full object-cover" alt="img"/></div><p className="text-[10px] text-gray-500 font-medium">Persiapan Lokasi</p></div>
              <div className="flex flex-col gap-1.5"><div className="h-28 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=300&q=80" className="w-full h-full object-cover" alt="img"/></div><p className="text-[10px] text-gray-500 font-medium">Pengadaan Bibit</p></div>
              <div className="flex flex-col gap-1.5"><div className="h-28 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80" className="w-full h-full object-cover" alt="img"/></div><p className="text-[10px] text-gray-500 font-medium">Penanaman</p></div>
              <div className="flex flex-col gap-1.5"><div className="h-28 rounded-lg overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=300&q=80" className="w-full h-full object-cover" alt="img"/></div><p className="text-[10px] text-gray-500 font-medium">Pemeliharaan</p></div>
              <div className="flex flex-col gap-1.5"><div className="h-28 rounded-lg bg-gray-800 border border-gray-200 relative flex items-center justify-center cursor-pointer hover:bg-gray-900"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="img"/><div className="relative text-center"><p className="text-white text-2xl font-bold">+24</p><p className="text-white text-[9px] font-medium">Foto Lainnya</p></div></div><p className="text-[10px] text-gray-500 font-medium">Monitoring</p></div>
            </div>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline self-start">Lihat semua dokumentasi <HiChevronRight className="w-3 h-3"/></button>
          </div>

        </div>

        {/* ================= KOLOM KANAN (SIDEBAR STATUS) ================= */}
        <div className="w-full xl:w-90 flex flex-col shrink-0 min-w-0">
          
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6">Status Laporan</h2>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
              
              {!isDisahkan ? (
                // Timeline Mode Draft (Gambar 2)
                <>
                  <div className="relative pl-6">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-orange-500"><div className="w-2 h-2 bg-orange-500 rounded-full"></div></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Draft Laporan Dibuat</h3><p className="text-[10px] text-gray-500 mt-1">Oleh Staff PDAS - Ahmad Fauzi<br/>15 Sep 2026 12:00 WIB</p></div>
                  </div>
                  <div className="relative pl-6 opacity-40">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200"></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Dikirim untuk Persetujuan</h3><p className="text-[10px] text-gray-500 mt-1">Menunggu persetujuan Kepala Bidang PDAS</p></div>
                  </div>
                  <div className="relative pl-6 opacity-40">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200"></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Disahkan</h3><p className="text-[10px] text-gray-500 mt-1">Menunggu disahkan oleh Kepala Bidang PDAS</p></div>
                  </div>
                </>
              ) : (
                // Timeline Mode Disahkan (Gambar 3)
                <>
                  <div className="relative pl-6">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Disahkan</h3><p className="text-[10px] text-gray-500 mt-1">Laporan telah disahkan oleh Kepala Bidang PDAS<br/>20 Sep 2026 10:15 WIB</p></div>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-blue-500"><HiOutlineCheckCircle className="w-4 h-4 text-blue-500"/></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Menunggu Persetujuan</h3><p className="text-[10px] text-gray-500 mt-1">Laporan telah dikirim dan menunggu persetujuan<br/>18 Sep 2026 14:20 WIB</p></div>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-orange-500"><HiOutlineCheckCircle className="w-4 h-4 text-orange-500"/></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Draft Laporan Dibuat</h3><p className="text-[10px] text-gray-500 mt-1">Oleh Staff PDAS - Ahmad Fauzi<br/>15 Sep 2026 12:00 WIB</p></div>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-gray-300"><div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div></div>
                    <div><h3 className="text-xs font-bold text-gray-800">Siap Dilaporkan</h3><p className="text-[10px] text-gray-500 mt-1">Data pelaksanaan dan monitoring telah lengkap.<br/>15 Sep 2026 10:15 WIB</p></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {!isDisahkan && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Pemeriksaan Kelengkapan</h2>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Program</span></div>
                <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Pelaksanaan</span></div>
                <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Monitoring</span></div>
                <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Dokumentasi</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center"><div className="w-2 h-2 bg-orange-500 rounded-full"></div></div><span className="text-xs font-bold text-gray-800">Analisis & Evaluasi</span></div>
                <div className="flex items-center gap-2 opacity-50"><div className="w-5 h-5 rounded-full border-2 border-gray-300"></div><span className="text-xs font-medium text-gray-500">Kesimpulan</span></div>
                <div className="flex items-center gap-2 opacity-50"><div className="w-5 h-5 rounded-full border-2 border-gray-300"></div><span className="text-xs font-medium text-gray-500">Review & Kirim</span></div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Lengkapi semua bagian untuk mengirim laporan.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-sm font-bold text-gray-800">Sumber Data Laporan</h2>{isDisahkan && <HiOutlineInformationCircle className="w-4 h-4 text-gray-400"/>}</div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Program</span></div>
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Pelaksanaan</span></div>
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Monitoring</span></div>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Data diambil otomatis dari sistem.</p>
          </div>

          {isDisahkan && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4"><h2 className="text-sm font-bold text-gray-800">Informasi Laporan</h2><HiOutlineInformationCircle className="w-4 h-4 text-gray-400"/></div>
              <div className="space-y-3 text-xs">
                <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Tanggal Dibuat</span><span className="font-bold text-gray-800">15 Sep 2026 12:00 WIB</span></div>
                <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Terakhir Diubah</span><span className="font-bold text-gray-800">20 Sep 2026 10:10 WIB</span></div>
                <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Dibuat Oleh</span><span className="font-bold text-gray-800">Ahmad Fauzi<br/><span className="font-medium text-gray-500">Staff PDAS</span></span></div>
                <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Disahkan Oleh</span><span className="font-bold text-gray-800">Kepala Bidang PDAS<br/><span className="font-medium text-gray-500">(Budi Santoso, S.Hut., M.Sc.)</span></span></div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DetailPelaporanAPBD;