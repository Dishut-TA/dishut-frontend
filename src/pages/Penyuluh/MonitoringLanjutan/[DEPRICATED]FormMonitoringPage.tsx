// import React, { useState } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import { 
//   HiOutlineMagnifyingGlass,
//   HiOutlineFunnel,
//   HiOutlineArrowLeft,
//   HiOutlineInformationCircle,
//   HiOutlineMapPin,
//   HiOutlineCamera,
//   HiOutlineCalendar,
//   HiChevronRight,
//   HiChevronLeft,
//   HiOutlineCheckCircle,
//   HiOutlineXCircle,
//   HiOutlineClock,
//   HiOutlinePaperAirplane,
//   HiOutlineDocumentText,
//   HiOutlineDocumentCheck,
//   HiCheckCircle
// } from 'react-icons/hi2';
// import { PiPlant, PiTree, PiLeaf } from 'react-icons/pi';

// // --- Types & Interfaces ---
// type ViewMode = 'rekap' | 'table' | 'input' | 'edit';
// type MonitoringStatus = 'Siap Monitoring' | 'Berjalan' | 'Menunggu Evaluasi' | 'Tindak Lanjut' | 'Selesai' | 'Dihentikan';

// interface MonitoringRow {
//   id: string;
//   idTanaman: string;
//   jenisTanaman: string;
//   koordinat: string;
//   tinggiAwal: string;
//   waktuPelaksanaan: string;
//   fotoSebelum: boolean;
//   fotoSesudah: boolean;
//   waktuMonitoring: string | null;
//   tinggiSaatMonitoring: string | null;
//   kondisiTanaman: 'Sehat' | 'Perlu Perawatan' | 'Rusak Ringan' | 'Belum Disulam' | 'Sudah Disulam' | '-';
//   status: 'Hidup' | 'Mati' | '-';
// }

// // Data Dinamis Disesuaikan dengan Dashboard
// const MOCK_DASHBOARD_DATA: Record<string, any> = {
//   'PRG-2026-0030': { nama: 'Rehabilitasi Mangrove Tanjungpura', lokasi: 'Desa Tanjungpura, Kec. Karangampel,\nKab. Indramayu', periode: 'P1'},
//   'PRG-2026-0012': { nama: 'Rehabilitasi Mangrove Eretan', lokasi: 'Desa Eretan, Kec. Kandanghaur,\nKab. Indramayu', periode: 'P1'},
//   'PRG-2026-0007': { nama: 'Rehabilitasi Mangrove Karangsong', lokasi: 'Desa Karangsong, Kec. Indramayu,\nKab. Indramayu', periode: 'P1' },
//   'PRG-2026-0018': { nama: 'Rehabilitasi Mangrove Kertasemaya', lokasi: 'Desa Kertasemaya, Kec. Kertasemaya,\nKab. Indramayu', periode: 'P2'},
//   'PRG-2026-0021': { nama: 'Rehabilitasi Mangrove Pawidean', lokasi: 'Desa Pawidean, Kec. Juntinyuat,\nKab. Indramayu', periode: 'P3' },
// };

// // Data Mock untuk Rekap Review & Kirim
// const MOCK_REKAP_DATA = [
//   { pu: 'PU-01', total: 520, hidup: 460, pctHidup: 88, mati: 30, pctMati: 6, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:30' },
//   { pu: 'PU-02', total: 510, hidup: 440, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:35' },
//   { pu: 'PU-03', total: 500, hidup: 430, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:40' },
//   { pu: 'PU-04', total: 500, hidup: 430, pctHidup: 86, mati: 40, pctMati: 8, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:45' },
//   { pu: 'PU-05', total: 500, hidup: 440, pctHidup: 88, mati: 30, pctMati: 6, rawat: 30, pctRawat: 6, foto: 10, status: 'Lengkap', update: '27 Mei 2026 10:50' },
// ];

// const MOCK_TABLE_DATA: MonitoringRow[] = [
//   {
//     id: '1', idTanaman: 'PRG26-0007-PU03-001', jenisTanaman: 'Rhizophora', koordinat: '6.841232° S\n107.564891° E',
//     tinggiAwal: '15 cm', waktuPelaksanaan: '25 Mei 2026, 08:12', fotoSebelum: true, fotoSesudah: true,
//     waktuMonitoring: '27 Mei 2026, 10:32', tinggiSaatMonitoring: '33 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
//   },
//   {
//     id: '2', idTanaman: 'PRG26-0007-PU03-002', jenisTanaman: 'Avicennia', koordinat: '6.841315° S\n107.564905° E',
//     tinggiAwal: '18 cm', waktuPelaksanaan: '25 Mei 2026, 08:13', fotoSebelum: true, fotoSesudah: true,
//     waktuMonitoring: '27 Mei 2026, 10:33', tinggiSaatMonitoring: '27 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
//   },
//   {
//     id: '3', idTanaman: 'PRG26-0007-PU03-003', jenisTanaman: 'Sonneratia', koordinat: '6.841401° S\n107.564910° E',
//     tinggiAwal: '12 cm', waktuPelaksanaan: '25 Mei 2026, 08:14', fotoSebelum: true, fotoSesudah: false,
//     waktuMonitoring: null, tinggiSaatMonitoring: '-', kondisiTanaman: 'Perlu Perawatan', status: 'Hidup',
//   },
//   {
//     id: '4', idTanaman: 'PRG26-0007-PU03-004', jenisTanaman: 'Rhizophora', koordinat: '6.841487° S\n107.564830° E',
//     tinggiAwal: '16 cm', waktuPelaksanaan: '25 Mei 2026, 08:15', fotoSebelum: true, fotoSesudah: true,
//     waktuMonitoring: '27 Mei 2026, 10:35', tinggiSaatMonitoring: '29 cm', kondisiTanaman: 'Sehat', status: 'Hidup',
//   },
//   {
//     id: '5', idTanaman: 'PRG26-0007-PU03-005', jenisTanaman: 'Avicennia', koordinat: '6.841519° S\n107.564850° E',
//     tinggiAwal: '17 cm', waktuPelaksanaan: '25 Mei 2026, 08:16', fotoSebelum: true, fotoSesudah: false,
//     waktuMonitoring: null, tinggiSaatMonitoring: '-', kondisiTanaman: 'Rusak Ringan', status: 'Hidup',
//   },
// ];

// const FormMonitoringPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
  
//   // Tangkap data aktif berdasarkan URL ID
//   const activeId = id || 'PRG-2026-0007';
//   const activeProgram = MOCK_DASHBOARD_DATA[activeId] || MOCK_DASHBOARD_DATA['PRG-2026-0007'];

//   // Tangkap status dari page sebelumnya (default ke Siap Monitoring jika tidak ada)
//   const programStatus = (location.state?.status as MonitoringStatus) || 'Siap Monitoring';
  
//   // Deteksi mode
//   const isTindakLanjut = programStatus === 'Tindak Lanjut';
//   const isReadOnly = programStatus === 'Menunggu Evaluasi' || programStatus === 'Selesai';

//   // --- States ---
//   // Default masuk ke view rekap saat diklik mulai monitoring
//   const [viewMode, setViewMode] = useState<ViewMode>('rekap');
//   const [selectedRow, setSelectedRow] = useState<MonitoringRow | null>(null);

//   // --- Handlers ---
//   const handleOpenForm = (mode: 'input' | 'edit', row: MonitoringRow) => {
//     setSelectedRow(row);
//     setViewMode(mode);
//   };

//   const handleBackToTable = () => {
//     setViewMode('table');
//     setSelectedRow(null);
//   };

//   const handleBackToRekap = () => {
//     setViewMode('rekap');
//     setSelectedRow(null);
//   };

//   // =========================================================================
//   // RENDER 0: REKAP VIEW (VIEW AWAL KETIKA MULAI MONITORING)
//   // =========================================================================
//   const renderRekapView = () => (
//     <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
//           Review & Kirim Hasil {isTindakLanjut ? 'Penyulaman P2' : `Monitoring ${activeProgram.periode}`}
//         </h1>
//         <p className="text-sm text-slate-500">
//           Berikut adalah hasil {isTindakLanjut ? 'penyulaman P2' : `monitoring ${activeProgram.periode}`} yang telah Anda input, dikelompokkan per Petak Ukur (PU) sebelum dikirim.
//         </p>
//       </div>

//       {/* Info Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row gap-6">
//         <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">ID Program</p>
//             <p className="text-sm font-bold text-slate-900">{activeId}</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">Nama Program</p>
//             <p className="text-sm font-bold text-slate-900">{activeProgram.nama}</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">Sumber Dana</p>
//             <p className="text-sm font-bold text-slate-900">APBD</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">Periode Monitoring</p>
//             <div className="flex items-center gap-1.5">
//               <p className="text-sm font-bold text-slate-900">{isTindakLanjut ? 'P2 - Tindak Lanjut P2' : activeProgram.periode}</p>
//             </div>
//           </div>
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">Lokasi</p>
//             <p className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">{activeProgram.lokasi}</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-slate-500 font-medium mb-1">KTH</p>
//             <p className="text-sm font-bold text-slate-900">Ahmad Fauzi</p>
//           </div>
//           <div className="col-span-2 md:col-span-3">
//             <p className="text-[10px] text-slate-500 font-medium mb-1">Tanggal Monitoring</p>
//             <p className="text-sm font-bold text-slate-900">27 Mei 2026</p>
//           </div>
//         </div>
//         <div className="w-full md:w-[320px] h-32 bg-slate-100 rounded-lg relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')] bg-cover bg-center border border-slate-200 shrink-0">
//           <div className="absolute inset-0 bg-black/10"></div>
//           {/* Mock green dots */}
//           <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
//           <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
//           <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
//         </div>
//       </div>

//       {/* Ringkasan Cards */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
//         <h3 className="text-sm font-bold text-[#0F172A] mb-4">Ringkasan {isTindakLanjut ? 'Penyulaman P2' : `Monitoring ${activeProgram.badge}`} (Per PU)</h3>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
//               <HiOutlineMapPin className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Total PU</p>
//               <h3 className="text-xl font-bold text-slate-900">5</h3>
//             </div>
//           </div>
//           <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
//               <PiPlant className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Total Tanaman</p>
//               <h3 className="text-xl font-bold text-slate-900">2.530</h3>
//             </div>
//           </div>
//           <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
//               <PiLeaf className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Hidup</p>
//               <h3 className="text-xl font-bold text-slate-900">2.200</h3>
//             </div>
//           </div>
//           <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
//               <PiTree className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Mati</p>
//               <h3 className="text-xl font-bold text-slate-900">180</h3>
//             </div>
//           </div>
//           <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
//               <PiPlant className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Perlu Perawatan</p>
//               <h3 className="text-xl font-bold text-slate-900">150</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabel Rekap */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
//         <div className="px-6 py-4 border-b border-slate-100">
//           <h3 className="text-sm font-bold text-slate-900">Rekap {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} per PU</h3>
//         </div>
//         <div className="overflow-x-auto p-4">
//           <table className="w-full text-center text-xs">
//             <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
//               <tr>
//                 <th className="py-3 px-4 text-left">PU</th>
//                 <th className="py-3 px-4">Jumlah Tanaman</th>
//                 <th className="py-3 px-4">Hidup</th>
//                 <th className="py-3 px-4">Mati</th>
//                 <th className="py-3 px-4">Perlu Perawatan</th>
//                 <th className="py-3 px-4">Foto</th>
//                 <th className="py-3 px-4">Status Kelengkapan</th>
//                 <th className="py-3 px-4">Update Terakhir</th>
//                 <th className="py-3 px-4 text-center">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
//               {MOCK_REKAP_DATA.map((row, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                   <td className="py-3 px-4 text-left font-bold text-slate-700">{row.pu}</td>
//                   <td className="py-3 px-4">{row.total}</td>
//                   <td className="py-3 px-4 text-emerald-600 font-bold">{row.hidup} ({row.pctHidup}%)</td>
//                   <td className="py-3 px-4 text-red-500 font-bold">{row.mati} ({row.pctMati}%)</td>
//                   <td className="py-3 px-4 text-orange-500 font-bold">{row.rawat} ({row.pctRawat}%)</td>
//                   <td className="py-3 px-4 text-slate-600 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> {row.foto}</td>
//                   <td className="py-3 px-4"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded font-bold text-[10px]">{row.status}</span></td>
//                   <td className="py-3 px-4 text-slate-500">{row.update}</td>
//                   <td className="py-3 px-4 text-center">
//                     <button 
//                       onClick={() => setViewMode('table')}
//                       className="px-4 py-1.5 border border-primary text-[#008A4B] bg-white rounded-full font-bold hover:bg-emerald-50 transition-colors text-xs"
//                     >
//                       Tambah Data
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               <tr className="bg-slate-50/50 font-bold border-t-2 border-slate-200">
//                 <td className="py-4 px-4 text-left text-blue-700">Total</td>
//                 <td className="py-4 px-4 text-blue-700">2.530</td>
//                 <td className="py-4 px-4 text-emerald-600">2.200 (87%)</td>
//                 <td className="py-4 px-4 text-red-500">180 (7%)</td>
//                 <td className="py-4 px-4 text-orange-500">150 (6%)</td>
//                 <td className="py-4 px-4 text-blue-700 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> 50</td>
//                 <td className="py-4 px-4 text-slate-400">-</td>
//                 <td className="py-4 px-4 text-slate-400">-</td>
//                 <td className="py-4 px-4 text-slate-400">-</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Info Alert */}
//       <div className="bg-[#f0f9f3] border border-[#DCECE0] p-4 rounded-lg flex items-center gap-3 text-sm text-emerald-800 font-medium mb-8">
//         <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
//         Klik "Tambah Data" pada baris PU yang ingin Anda lengkapi untuk membuka halaman Input Hasil Monitoring.
//       </div>

//       {/* Action Footer */}
//       <div className="px-6 py-4 flex justify-center items-center gap-4 z-40">
//          <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-full w-full text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
//             <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
//          </button>
//          <button className="px-6 py-2.5 bg-[#008A4B] text-white rounded-full w-full text-sm font-bold hover:bg-emerald-800 flex items-center justify-center gap-2 shadow-sm transition-colors">
//            <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45" /> Kirim Hasil {isTindakLanjut ? 'Penyulaman P2' : `Monitoring ${activeProgram.periode}`}
//          </button>
//       </div>
//     </div>
//   );

//   // =========================================================================
//   // RENDER 1: READ ONLY VIEW (SAMA SEPERTI STAFF PDAS)
//   // =========================================================================
//   const renderReadOnlyView = () => (
//     <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 w-full pb-12">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <div className="flex items-center gap-3 mb-1.5">
//             <h1 className="text-2xl font-bold text-slate-900">Detail Hasil Monitoring P2</h1>
//             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-orange-50 text-orange-700 border-orange-200">
//               {programStatus}
//             </span>
//           </div>
//           <p className="text-sm text-slate-500">Halaman ini hanya menampilkan hasil monitoring. Proses evaluasi dilakukan oleh Tim Evaluasi.</p>
//         </div>
//         <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
//           <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         <div className="lg:col-span-8 space-y-6">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//             <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Program</h3>
//             <div className="flex flex-col lg:flex-row gap-6">
//               <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900">{activeProgram.nama}</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">KTH</p><p className="text-xs font-bold text-slate-900">KTH Karangsong Lestari</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">{activeId}</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Ketua KTH</p><p className="text-xs font-bold text-slate-900">Ahmad Fauzi</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Jenis Program</p><p className="text-xs font-bold text-slate-900">Rehabilitasi Mangrove</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Periode Monitoring</p><p className="text-xs font-bold text-slate-900">{activeProgram.badge}</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Lokasi</p><p className="text-xs font-bold text-slate-900 leading-snug whitespace-pre-line">{activeProgram.lokasi}</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring</p><p className="text-xs font-bold text-slate-900">22 Mei 2026</p></div>
//                 <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Luas Area</p><p className="text-xs font-bold text-slate-900">25,40 Ha</p></div>
//               </div>
//               <div className="w-full md:hidden lg:block lg:w-48 shrink-0">
//                  <div className="w-full h-24 bg-slate-100 rounded-lg relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')] bg-cover bg-center border border-slate-200">
//                     <div className="absolute inset-0 flex items-center justify-center"><HiOutlineMapPin className="w-6 h-6 text-green-500 drop-shadow" /></div>
//                  </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 mt-1">
//                <HiOutlineClock className="w-6 h-6 text-orange-500" />
//             </div>
//             <div>
//               <h3 className="text-sm font-bold text-slate-500 mb-1">Status Program</h3>
//               <h2 className="text-lg font-bold text-orange-600 mb-2 leading-none">{programStatus}</h2>
//               <p className="text-[11px] text-slate-600 leading-relaxed">Hasil monitoring telah dikirim dan sedang menunggu proses evaluasi oleh Tim Evaluasi.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // =========================================================================
//   // RENDER 2: TABLE VIEW (TAMBAH DATA)
//   // =========================================================================
//   const renderTableView = () => (
//     <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
//       {/* Breadcrumb & Header */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//             Tambah Data {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} PU 
//             <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-md font-bold">PU-03</span>
//           </h1>
//           {/* Tombol kembali pakai yang ATAS saja */}
//           <button onClick={handleBackToRekap} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50">
//             <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Review & Kirim
//           </button>
//         </div>
//         <p className="text-sm text-gray-500 mt-1">Lengkapi atau tambahkan data {isTindakLanjut ? 'hasil penyulaman' : 'monitoring tanaman'} untuk petak ukur (PU) yang dipilih sebelum hasil dikirim.</p>
//       </div>

//       {/* Info Alert */}
//       <div className="bg-[#f0f9f3] border border-[#DCECE0] p-3 rounded-lg flex items-center gap-3 text-sm text-emerald-800 mb-6 font-medium">
//         <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0 italic text-xs">i</div>
//         Anda sedang menambahkan data {isTindakLanjut ? 'penyulaman' : 'monitoring'} untuk PU-03.
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
//         {/* Ringkasan Program */}
//         <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
//           <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <HiOutlineDocumentText className="w-5 h-5 text-[#008A4B]" />
//             Ringkasan Program
//           </h3>
//           <div className="grid grid-cols-[130px_10px_1fr] gap-y-2.5 text-xs flex-1 content-start">
//             <div className="text-gray-500">ID Program</div><div>:</div><div className="font-semibold text-gray-900">{activeId}</div>
//             <div className="text-gray-500">Nama Program</div><div>:</div><div className="font-semibold text-gray-900">{activeProgram.nama}</div>
//             <div className="text-gray-500">Periode Monitoring</div><div>:</div>
//             <div className="flex items-center gap-1.5">
//               <span className="font-semibold text-gray-900">{isTindakLanjut ? 'P2 - Tindak Lanjut P2' : activeProgram.periode}</span> 
//             </div>
//             <div className="text-gray-500">Lokasi</div><div>:</div><div className="font-semibold text-gray-900 whitespace-pre-line">{activeProgram.lokasi}</div>
//             <div className="text-gray-500">Sumber Dana</div><div>:</div><div className="font-semibold text-gray-900">APBD</div>
//             <div className="text-gray-500">KTH</div><div>:</div><div className="font-semibold text-gray-900">Ahmad Fauzi</div>
//             <div className="text-gray-500 font-bold mt-1">Selected PU</div><div className="mt-1">:</div><div className="mt-1"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">PU-03</span></div>
//           </div>
//         </div>

//         {/* Ringkasan PU-03 (Disesuaikan agar rata tengah/sama persis gambar) */}
//         <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
//           <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <HiOutlineDocumentCheck className="w-5 h-5 text-[#008A4B]" />
//             Ringkasan PU-03
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 content-center">
//             <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
//               <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><PiPlant className="w-5 h-5" /></div>
//               <p className="text-[10px] text-gray-500 font-medium mb-1">{isTindakLanjut ? 'Total Titik Perlu Disulam' : 'Total Tanaman'}</p>
//               <p className="text-xl font-bold text-gray-900">{isTindakLanjut ? '7' : '500'}</p>
//               <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
//             </div>
//             <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
//               <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><HiOutlineCheckCircle className="w-5 h-5" /></div>
//               <p className="text-[10px] text-gray-500 font-medium mb-1">Sudah Diinput</p>
//               <p className="text-xl font-bold text-gray-900">{isTindakLanjut ? '1' : '430'}</p>
//               <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
//             </div>
//             <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
//               <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2"><HiOutlineClock className="w-5 h-5" /></div>
//               <p className="text-[10px] text-gray-500 font-medium mb-1">Belum Diinput</p>
//               <p className="text-xl font-bold text-gray-900">{isTindakLanjut ? '6' : '70'}</p>
//               <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
//             </div>
//             <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
//               <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2"><HiOutlineCamera className="w-5 h-5" /></div>
//               <p className="text-[10px] text-gray-500 font-medium mb-1">Foto {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</p>
//               <p className="text-xl font-bold text-gray-900">{isTindakLanjut ? '2' : '10'}</p>
//               <p className="text-[10px] text-gray-400">foto</p>
//             </div>
//             <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
//               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2"><HiOutlineCalendar className="w-5 h-5" /></div>
//               <p className="text-[10px] text-gray-500 font-medium mb-1">Update Terakhir</p>
//               <p className="text-sm font-bold text-gray-900 whitespace-nowrap">27 Mei 2026</p>
//               <p className="text-[10px] text-gray-500">10:40</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Data Table Section */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
//           <h2 className="font-bold text-gray-900 flex items-center gap-2">
//             Data {isTindakLanjut ? 'Titik Penyulaman' : 'Monitoring Tanaman'} - <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs">PU-03</span>
//           </h2>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input type="text" placeholder={`Cari ID ${isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}...`} className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg w-56 focus:outline-none focus:border-[#008A4B]" />
//             </div>
//             <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 shadow-sm">
//               <HiOutlineFunnel className="w-4 h-4" /> Filter
//             </button>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
//             <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-900 tracking-wide text-center">
//               <tr>
//                 <th className="px-4 py-4 text-left">No</th>
//                 <th className="px-4 py-4 text-left">{isTindakLanjut ? 'ID Titik/Tanaman' : 'ID Tanaman'}</th>
//                 {isTindakLanjut && <th className="px-4 py-4 text-left">Koordinat</th>}
//                 {!isTindakLanjut && <th className="px-4 py-4 text-left">Jenis Tanaman</th>}
//                 {!isTindakLanjut && <th className="px-4 py-4 text-left">Geotag / Koordinat</th>}
//                 {!isTindakLanjut && <th className="px-4 py-4">Tinggi Awal<br/><span className="text-[10px] text-gray-400 font-normal">(Saat Tanam)</span></th>}
//                 <th className="px-4 py-4">Foto Sebelum<br/><span className="text-[10px] text-gray-400 font-normal">(hasil monitoring)</span></th>
//                 <th className="px-4 py-4">Foto Sesudah<br/><span className="text-[10px] text-gray-400 font-normal">({isTindakLanjut ? 'Penyulaman' : 'Monitoring'})</span></th>
//                 <th className="px-4 py-4">Tinggi Saat {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
//                 {!isTindakLanjut && <th className="px-4 py-4">Kondisi Tanaman</th>}
//                 <th className="px-4 py-4">Status {isTindakLanjut ? 'Penyulaman' : ''}</th>
//                 <th className="px-4 py-4">Tanggal<br/>{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
//                 <th className="px-4 py-4">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-xs">
//               {MOCK_TABLE_DATA.map((row, _index) => (
//                 <tr key={row.id} className="hover:bg-gray-50/50">
//                   <td className="px-4 py-4 font-bold text-gray-900 text-left">{row.id}</td>
//                   <td className="px-4 py-4 font-bold text-gray-700 text-left">{row.idTanaman}</td>
                  
//                   {isTindakLanjut ? (
//                     <td className="px-4 py-4 text-gray-600 text-left">
//                       <span className="whitespace-pre-line leading-tight">{row.koordinat.replace('\n', ', ')}</span>
//                     </td>
//                   ) : (
//                     <>
//                       <td className="px-4 py-4 text-left">
//                         <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-max border border-emerald-100">
//                           <PiLeaf className="w-3 h-3 text-emerald-500" />
//                           {row.jenisTanaman}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-gray-600 text-left">
//                         <div className="flex items-start gap-1">
//                           <HiOutlineMapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
//                           <span className="whitespace-pre-line leading-tight">{row.koordinat}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-center font-bold text-gray-800">{row.tinggiAwal}</td>
//                     </>
//                   )}
                  
//                   {/* Foto Sebelum */}
//                   <td className="px-4 py-4 text-center">
//                     <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden relative inline-block border border-gray-300">
//                       <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" alt="Sebelum" className="object-cover w-full h-full" />
//                       {!isTindakLanjut && (
//                         <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white py-0.5 text-center leading-tight">
//                           {row.waktuPelaksanaan.split(',')[0]}<br/>{row.waktuPelaksanaan.split(',')[1]}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   {/* Foto Sesudah */}
//                   <td className="px-4 py-4 text-center">
//                     {row.fotoSesudah ? (
//                       <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden relative inline-block border border-gray-300">
//                         <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=150" alt="Sesudah" className="object-cover w-full h-full" />
//                         {!isTindakLanjut && (
//                           <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white py-0.5 text-center leading-tight">
//                             {row.waktuMonitoring?.split(',')[0]}<br/>{row.waktuMonitoring?.split(',')[1]}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="text-[10px] text-red-400 font-medium">
//                         Belum diinput
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-4 py-4 text-center font-bold text-gray-800">
//                     {row.tinggiSaatMonitoring}
//                   </td>
                  
//                   {/* Kondisi (hanya non-tindak lanjut) */}
//                   {!isTindakLanjut && (
//                     <td className="px-4 py-4 text-center">
//                       {row.kondisiTanaman !== '-' ? (
//                         <span className={`px-2.5 py-1 text-[10px] rounded font-bold ${
//                           row.kondisiTanaman === 'Sehat' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
//                           row.kondisiTanaman === 'Perlu Perawatan' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
//                           'bg-red-50 text-red-700 border border-red-100'
//                         }`}>
//                           {row.kondisiTanaman}
//                         </span>
//                       ) : '-'}
//                     </td>
//                   )}

//                   {/* Status */}
//                   <td className="px-4 py-4 text-center">
//                     {isTindakLanjut ? (
//                        <span className={`px-2.5 py-1 text-[10px] rounded font-bold ${row.fotoSesudah ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
//                          {row.fotoSesudah ? 'Sudah Disulam' : 'Belum Disulam'}
//                        </span>
//                     ) : (
//                       row.status !== '-' ? (
//                          <span className="px-2.5 py-1 text-[10px] rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
//                          {row.status}
//                        </span>
//                       ) : '-'
//                     )}
//                   </td>

//                   {/* Tanggal Monitoring/Penyulaman */}
//                   <td className="px-4 py-4 text-center text-gray-500 whitespace-pre-line leading-tight font-medium">
//                     {row.waktuMonitoring ? row.waktuMonitoring.replace(', ', '\n') : '-'}
//                   </td>
                  
//                   {/* Aksi */}
//                   <td className="px-4 py-4">
//                     <div className="flex items-center justify-center gap-2">
//                       {row.tinggiSaatMonitoring === '-' ? (
//                         <button 
//                           onClick={() => handleOpenForm('input', row)}
//                           className="px-3 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded font-bold hover:bg-emerald-50 transition-colors text-[10px]"
//                         >
//                           Input Data
//                         </button>
//                       ) : (
//                         <button 
//                           onClick={() => handleOpenForm('edit', row)}
//                           className="px-4 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded font-bold hover:bg-emerald-50 transition-colors text-[10px]"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white text-xs text-gray-500">
//           <span>Menampilkan 1 - 7 dari 7 data (PU-03)</span>
//           <div className="flex items-center gap-3">
//             <div className="flex gap-1">
//               <button className="p-1.5 border border-gray-200 rounded text-gray-400 bg-gray-50"><HiChevronLeft className="w-4 h-4" /></button>
//               <button className="px-3 py-1.5 border border-[#008A4B] rounded bg-[#008A4B] text-white font-bold">1</button>
//               <button className="p-1.5 border border-gray-200 rounded text-gray-400 bg-gray-50"><HiChevronRight className="w-4 h-4" /></button>
//             </div>
//             <div className="flex items-center gap-2">
//               <span>Tampilkan</span>
//               <select className="border border-gray-300 rounded px-2 py-1 bg-white font-medium focus:outline-none">
//                 <option>10</option>
//               </select>
//               <span>data per halaman</span>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );

//   // =========================================================================
//   // RENDER 3: INPUT / EDIT FORM VIEW
//   // =========================================================================
//   const renderFormView = () => {
//     const isEdit = viewMode === 'edit';
//     const title = isEdit 
//       ? `Edit Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}` 
//       : `Input Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}`;
//     const subTitle = isEdit 
//       ? `Edit data ${isTindakLanjut ? 'hasil penyulaman' : 'monitoring'} untuk 1 titik / tanaman pada PU yang dipilih.` 
//       : `Isi data ${isTindakLanjut ? 'hasil penyulaman' : 'monitoring'} untuk 1 titik / tanaman pada PU yang dipilih.`;

//     return (
//       <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
//         {/* Header (No Top Back Button) */}
//         <div className="mb-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//               {title}
//               <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 text-sm rounded-md font-bold">PU-03</span>
//               <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-md font-bold">{selectedRow?.idTanaman}</span>
//             </h1>
//           </div>
//           <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
//         </div>

//         {/* Top Info Banner with Map */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row overflow-hidden">
//           <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs border-r border-gray-100">
//             <div className="grid grid-cols-[110px_10px_1fr] gap-1">
//               <div className="text-gray-500">ID Program</div><div>:</div><div className="font-semibold text-gray-900">{activeId}</div>
//               <div className="text-gray-500 mt-2">Nama Program</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">{activeProgram.nama}</div>
//               <div className="text-gray-500 mt-2">Periode Monitoring</div><div className="mt-2">:</div>
//               <div className="font-semibold text-gray-900 mt-2 flex items-center gap-1.5">
//                 {isTindakLanjut ? 'P2 - Tindak Lanjut P2' : activeProgram.periode}
//               </div>
//               <div className="text-gray-500 mt-2">KTH</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">Ahmad Fauzi</div>
//             </div>
//             <div className="grid grid-cols-[110px_10px_1fr] gap-1">
//               <div className="text-gray-500">Lokasi</div><div>:</div><div className="font-semibold text-gray-900 whitespace-pre-line">{activeProgram.lokasi}</div>
//               <div className="text-gray-500 mt-3">Selected PU</div><div className="mt-3">:</div><div className="mt-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">PU-03</span></div>
//               <div className="text-gray-500 mt-3">ID {isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}</div><div className="mt-3">:</div><div className="font-semibold text-gray-900 mt-3">{selectedRow?.idTanaman}</div>
//             </div>
//             <div className="grid grid-cols-[110px_10px_1fr] gap-1">
//               <div className="text-gray-500">Jenis Tanaman</div><div>:</div><div className="font-semibold text-gray-900">{selectedRow?.jenisTanaman || 'Sonneratia'}</div>
//               <div className="text-gray-500 mt-2">Koordinat / Geotag</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2 whitespace-pre-line">{selectedRow?.koordinat.replace('\n', ' / ')}</div>
//             </div>
//           </div>
//           <div className="w-full lg:w-80 h-48 lg:h-auto bg-gray-200 relative shrink-0">
//             {/* Mocking Map Image */}
//             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" className="w-full h-full object-cover opacity-80" alt="Map" />
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
//                <HiOutlineMapPin className="w-8 h-8 text-[#008A4B] fill-white" />
//             </div>
//             <div className="absolute right-3 top-3 flex flex-col gap-1 bg-white rounded-md shadow-sm overflow-hidden">
//                <button className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 border-b border-gray-100">+</button>
//                <button className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">-</button>
//             </div>
//           </div>
//         </div>

//         {/* Form and Sidebar Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* Main Form Left */}
//           <div className="lg:col-span-8 space-y-6">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
//                 <svg className="w-5 h-5 text-[#008A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
//                 Form {isEdit ? 'Edit' : 'Input'} {isTindakLanjut ? 'Penyulaman' : 'Monitoring Tanaman'}
//               </h3>
              
//               {/* Row 1: Disabled Info Inputs */}
//               <div className="grid grid-cols-3 gap-5 mb-5">
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">ID {isTindakLanjut ? 'Titik / Tanaman' : 'Tanaman'}</label>
//                   <input type="text" disabled defaultValue={selectedRow?.idTanaman} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
//                 </div>
//                 {isTindakLanjut ? (
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 mb-1.5">PU</label>
//                     <input type="text" disabled defaultValue="PU-03" className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
//                   </div>
//                 ) : (
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Tanaman</label>
//                     <input type="text" disabled defaultValue={selectedRow?.jenisTanaman} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
//                   </div>
//                 )}
                
//                 <div className={isTindakLanjut ? '' : "col-span-1 grid grid-cols-2 gap-3"}>
//                   {!isTindakLanjut && (
//                     <div>
//                       <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">Koordinat Geotag <HiOutlineMapPin className="w-3 h-3 text-gray-400"/></label>
//                       <input type="text" disabled defaultValue={selectedRow?.koordinat.split('\n')[0]} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Awal <span className="font-normal text-gray-400">(Saat Tanam)</span></label>
//                     <div className="relative">
//                       <input type="text" disabled defaultValue={selectedRow?.tinggiAwal.replace(' cm', '')} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium pr-8" />
//                       <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">cm</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Row 2: Active Inputs */}
//               <div className="grid grid-cols-3 gap-5 mb-6">
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Status Penyulaman' : 'Kondisi Tanaman'} <span className="text-red-500">*</span></label>
//                   {isTindakLanjut ? (
//                      <div className="flex gap-2 h-[42px]">
//                        <button className="flex-1 border border-emerald-500 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5">
//                          <HiOutlineCheckCircle className="w-4 h-4" /> Sudah Disulam
//                        </button>
//                      </div>
//                   ) : (
//                     <>
//                       <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B] bg-white" defaultValue={isEdit ? selectedRow?.kondisiTanaman : ""}>
//                         <option value="" disabled hidden>Pilih kondisi</option>
//                         <option value="Sehat">Sehat</option>
//                         <option value="Perlu Perawatan">Perlu Perawatan</option>
//                         <option value="Rusak Ringan">Rusak Ringan</option>
//                       </select>
//                       {isEdit && selectedRow?.kondisiTanaman === 'Perlu Perawatan' && (
//                         <div className="mt-2 text-orange-600 text-xs font-bold flex items-center gap-1">
//                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Perlu Perawatan
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tinggi Saat Penyulaman' : 'Status Tanaman'} <span className="text-red-500">*</span></label>
//                   {isTindakLanjut ? (
//                      <div className="relative h-[42px]">
//                        <input 
//                          type="number" 
//                          defaultValue={isEdit ? '24' : ''} 
//                          className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" 
//                        />
//                        <span className="absolute right-3 top-3 text-sm text-gray-500 font-medium">cm</span>
//                      </div>
//                   ) : (
//                     <div className="flex gap-2 h-[42px]">
//                       <button className={`flex-1 border rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
//                         (!isEdit || selectedRow?.status === 'Hidup') ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
//                       }`}>
//                         <HiOutlineCheckCircle className="w-4 h-4" /> Hidup
//                       </button>
//                       <button className="flex-1 border border-gray-200 text-gray-500 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
//                         <HiOutlineXCircle className="w-4 h-4" /> Mati
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tanggal Penyulaman' : 'Tinggi Saat Monitoring'} <span className="text-red-500">*</span></label>
//                   {isTindakLanjut ? (
//                      <div className="relative h-[42px]">
//                        <input 
//                          type="text" 
//                          defaultValue={isEdit ? '27 Mei 2026' : ''} 
//                          className="w-full h-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" 
//                        />
//                        <HiOutlineCalendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
//                      </div>
//                   ) : (
//                     <div className="relative h-[42px]">
//                       <input 
//                         type="number" 
//                         defaultValue={isEdit ? selectedRow?.tinggiSaatMonitoring?.replace(' cm', '') : ''} 
//                         placeholder="Misal: 24"
//                         className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" 
//                       />
//                       <span className="absolute right-3 top-3 text-sm text-gray-500 font-medium">cm</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Row 3: Photos & Notes */}
//               <div className="grid grid-cols-3 gap-5 mb-5">
//                 {/* Foto Sebelum */}
//                 <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 flex flex-col h-[180px]">
//                   <p className="text-xs font-bold text-gray-700 mb-0.5">Foto Sebelum <span className="font-normal text-gray-500">({isTindakLanjut ? 'hasil monitoring' : 'Dari Pelaksanaan / PO'})</span></p>
//                   <div className="mt-2 flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
//                     <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=400" alt="Sebelum" className="w-full h-full object-cover" />
//                   </div>
//                   <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-2 font-medium">
//                     <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400" />
//                     12 Mei 2026 • 09:15 WIB
//                   </div>
//                 </div>

//                 {/* Foto Sesudah */}
//                 <div className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col h-[180px]">
//                   <div className="flex justify-between items-start mb-0.5">
//                     <p className="text-xs font-bold text-gray-700">Foto {isTindakLanjut ? 'Sesudah Penyulaman' : `Monitoring ${isEdit ? 'Terbaru' : ''}`} <span className="font-normal text-gray-500">(Saat ini)</span></p>
//                     {!isEdit && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">Baru diunggah</span>}
//                   </div>
                  
//                   {isEdit ? (
//                     // Edit State Photo
//                     <div className="mt-2 flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative group">
//                       <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400" alt="Sesudah" className="w-full h-full object-cover" />
//                       <button className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm border border-gray-200">
//                         <HiOutlineCamera className="w-3.5 h-3.5" /> Ganti Foto
//                       </button>
//                     </div>
//                   ) : (
//                     // Input State Photo (Simulated Uploaded)
//                     <div className="mt-2 flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative group">
//                       <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400" alt="Sesudah" className="w-full h-full object-cover" />
//                       <button className="absolute bottom-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 p-1.5 rounded-md shadow-sm border border-gray-200">
//                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                       </button>
//                     </div>
//                   )}

//                   <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-2 font-medium">
//                     <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400" />
//                     27 Mei 2026 • 10:35 WIB
//                   </div>
//                 </div>

//                 {/* Catatan */}
//                 <div className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col h-[180px]">
//                   <p className="text-xs font-bold text-gray-700 mb-2">Catatan {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} <span className="text-red-500">*</span></p>
//                   <textarea 
//                     className="flex-1 w-full border-none p-0 text-xs text-gray-600 focus:ring-0 resize-none bg-transparent"
//                     placeholder="Tulis catatan..."
//                     defaultValue={isTindakLanjut ? "Penyulaman telah dilakukan pada titik ini. Bibit pengganti ditanam dan area sekitar dibersihkan." : (isEdit ? "Daun masih hijau, namun pertumbuhan lebih lambat dibanding tanaman lain pada PU-03. Area sekitar cukup berlumpur dan perlu pemantauan lanjutan." : "")}
//                   ></textarea>
//                   <div className="text-right text-[10px] text-gray-400 mt-1 font-medium border-t border-gray-100 pt-1">
//                     {isTindakLanjut ? '91' : (isEdit ? '135' : '0')} / 500
//                   </div>
//                 </div>
//               </div>

//               {/* Alert Footer */}
//               <div className="bg-[#f0f9f3] border border-[#DCECE0] p-3 rounded-lg flex items-center gap-3 text-xs text-emerald-800 font-medium">
//                 <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0 italic text-[10px]">i</div>
//                 Setiap {isTindakLanjut ? 'titik' : 'tanaman'} wajib memiliki 1 foto sebelum ({isTindakLanjut ? 'hasil monitoring' : 'dari pelaksanaan/PO'}) dan 1 foto {isTindakLanjut ? 'sesudah penyulaman' : 'monitoring (saat ini)'}.
//               </div>
//             </div>
//           </div>

//           {/* Sidebar Right: Riwayat Monitoring */}
//           <div className="lg:col-span-4">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px]">
//               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
//                 <HiOutlineClock className="w-5 h-5 text-gray-400" />
//                 Riwayat {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}
//               </h3>
              
//               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
//                 {!isEdit && isTindakLanjut ? (
//                   // Empty State for Input Mode
//                   <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
//                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
//                       <HiOutlineClock className="w-8 h-8 text-gray-300" />
//                     </div>
//                     <p className="font-bold text-gray-900 mb-1 text-sm">Belum ada riwayat {isTindakLanjut ? 'penyulaman' : 'monitoring'}</p>
//                     <p className="text-xs text-gray-400">Riwayat {isTindakLanjut ? 'penyulaman per-titik / per-tanaman' : 'monitoring'} akan muncul setelah data hasil disimpan.</p>
//                   </div>
//                 ) : (
//                   // History List for Edit Mode
//                   <div className="space-y-4">
//                     {[
//                       { date: '27 Mei 2026', time: '10:32 WIB', tinggi: '24 cm', kondisi: 'Sehat', status: isTindakLanjut ? 'Sudah Disulam' : 'Hidup', isWarning: false },
//                       { date: '20 Mei 2026', time: '09:18 WIB', tinggi: '20 cm', kondisi: 'Sehat', status: isTindakLanjut ? 'Belum Disulam' : 'Hidup', isWarning: isTindakLanjut },
//                       { date: '16 Mei 2026', time: '08:15 WIB', tinggi: '16 cm', kondisi: 'Perlu Perawatan', status: isTindakLanjut ? 'Belum Disulam' : 'Hidup', isWarning: true },
//                       { date: '12 Mei 2026', time: '08:00 WIB', tinggi: '12 cm', kondisi: 'Perlu Perawatan', status: isTindakLanjut ? 'Hasil Monitoring' : 'Hidup', isWarning: true },
//                     ].map((hist, idx) => (
//                       <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-4">
//                         <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" alt="History" />
//                         <div className="flex-1 text-xs">
//                           <div className="flex justify-between items-start mb-2">
//                             <span className="font-bold text-gray-900">{hist.date}</span>
//                             <span className="text-[10px] font-medium text-gray-500">{hist.time}</span>
//                           </div>
//                           <div className="grid grid-cols-[50px_10px_1fr] gap-y-1">
//                             <div className="text-gray-500 font-medium">Tinggi</div><div>:</div><div className="font-bold text-gray-900">{hist.tinggi}</div>
                            
//                             {!isTindakLanjut && (
//                               <>
//                                 <div className="text-gray-500 font-medium">Kondisi</div><div>:</div>
//                                 <div className={`font-bold flex items-center gap-1 ${hist.isWarning ? 'text-orange-600' : 'text-emerald-600'}`}>
//                                   {hist.isWarning ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> : <HiCheckCircle className="w-3 h-3"/>} 
//                                   {hist.kondisi}
//                                 </div>
//                               </>
//                             )}

//                             <div className="text-gray-500 font-medium">Status</div><div>:</div>
//                             <div className={`font-bold flex items-center gap-1 ${hist.status === 'Belum Disulam' ? 'text-slate-500' : (hist.status === 'Hasil Monitoring' ? 'text-blue-600' : 'text-emerald-600')}`}>
//                               <div className={`w-1.5 h-1.5 rounded-full ${hist.status === 'Belum Disulam' ? 'bg-slate-400' : (hist.status === 'Hasil Monitoring' ? 'bg-blue-500' : 'bg-emerald-500')}`}></div> {hist.status}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               {isEdit && (
//                 <button className="w-full mt-4 py-2 border border-gray-200 bg-gray-50 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2">
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
//                   Lihat Riwayat Lengkap
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Floating Action Bar */}
//         <div className="flex justify-end mt-6 items-center z-40">
//            {/* Main Actions */}
//            <div className="flex gap-4">
//              <button onClick={handleBackToTable} className="px-5 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-full w-full text-sm font-bold hover:bg-gray-50 flex items-center gap-2 justify-center">
//                 <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Tambah Data PU
//              </button>
             
//              <div className="flex gap-4 ml-auto">
//                <button className="px-5 py-2.5 bg-[#008A4B] text-white rounded-full w-full text-sm font-bold hover:bg-emerald-800 flex items-center gap-2 shadow-sm">
//                  <HiCheckCircle className="w-5 h-5" /> {isEdit ? 'Simpan Perubahan' : (isTindakLanjut ? 'Simpan Hasil Penyulaman' : 'Simpan Monitoring')}
//                </button>
//              </div>
//            </div>
//         </div>

//       </div>
//     );
//   };

//   return (
//     <>
//       {isReadOnly ? renderReadOnlyView() : (viewMode === 'rekap' ? renderRekapView() : (viewMode === 'table' ? renderTableView() : renderFormView()))}
//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: #cbd5e1;
//           border-radius: 10px;
//         }
//       `}} />
//     </>
//   );
// };

// export default FormMonitoringPage;