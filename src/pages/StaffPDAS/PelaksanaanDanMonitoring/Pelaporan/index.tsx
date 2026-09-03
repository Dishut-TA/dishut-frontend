import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineCalendar, 
  HiOutlineArrowPath,
  HiOutlineQrCode,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiEllipsisVertical
} from 'react-icons/hi2';

const MOCK_DATA = [
  { id: 'DON-2026-009', nama: 'Penanaman 1000 Pohon Bersama PT ABC Indonesia', jenis: 'Donasi', tgl: '20 Jun 2026', realisasi: '2.480 / 2.500 bibit (99,2%)', status: 'Siap Dilaporkan' },
  { id: 'APBD-2026-014', nama: 'Rehabilitasi DAS Cimanuk', jenis: 'APBD', tgl: '18 Jul 2026', realisasi: 'Realisasi anggaran 89,5%', status: 'Draft' },
  { id: 'CSR-2026-005', nama: 'Rehabilitasi Mangrove Karangsong', jenis: 'CSR', tgl: '15 Sep 2026', realisasi: '2.284 hidup (92%)', status: 'Menunggu Persetujuan' },
  { id: 'DON-2026-008', nama: 'Hijaukan Sekolah, Hijaukan Masa Depan', jenis: 'Donasi', tgl: '15 Jun 2026', realisasi: '1.350 / 1.500 bibit (90%)', status: 'Disahkan' },
  { id: 'APBD-2026-011', nama: 'Konservasi Sumber Daya Air', jenis: 'APBD', tgl: '08 Jul 2026', realisasi: 'Realisasi anggaran 100%', status: 'Disahkan' },
  { id: 'CSR-2026-004', nama: 'Penghijauan Lahan Kritis Bersama Energi Hijau', jenis: 'CSR', tgl: '05 Jul 2026', realisasi: 'Realisasi anggaran 95%', status: 'Siap Dilaporkan' },
  { id: 'DON-2026-007', nama: 'Gerakan Tanam Pohon Bersama Komunitas Hijau', jenis: 'Donasi', tgl: '10 Jun 2026', realisasi: 'Belum ada realisasi', status: 'Draft' },
  { id: 'CSR-2026-003', nama: 'Pemberdayaan Kelompok Tani Hutan', jenis: 'CSR', tgl: '10 Jul 2026', realisasi: 'Capaian output 92,4%', status: 'Disahkan' },
];

const PelaporanList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Semua Program');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Siap Dilaporkan': return { badge: 'bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]', btn: 'text-emerald-700 border-emerald-500 hover:bg-emerald-50', label: 'Buat Laporan' };
      case 'Draft': return { badge: 'bg-orange-50 text-orange-600 border-orange-200', btn: 'text-orange-600 border-orange-400 hover:bg-orange-50', label: 'Lanjutkan' };
      case 'Menunggu Persetujuan': return { badge: 'bg-blue-50 text-blue-600 border-blue-200', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
      case 'Disahkan': return { badge: 'bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
      default: return { badge: 'bg-gray-100 text-gray-600 border-gray-200', btn: 'text-gray-600 border-gray-300 hover:bg-gray-50', label: 'Lihat' };
    }
  };

  const handleActionClick = (item: any) => {
    if (item.jenis === 'Donasi') {
      navigate(`/admin/staff/monitoring/pelaporan/donasi/${item.id}`);
    } else {
      // Mengirim state status untuk simulasi tampilan Draft vs Disahkan di halaman detail
      navigate(`/admin/staff/monitoring/pelaporan/apbd/${item.id}`, { state: { status: item.status } });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Pelaporan Program</h1>
          <p className="text-sm text-gray-500 font-medium">Kelola laporan hasil pelaksanaan program berdasarkan data program yang tersedia.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <HiOutlineArrowPath className="w-4 h-4" /> Riwayat Laporan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineQrCode className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Total Program</p><p className="text-2xl font-bold text-gray-800 leading-none">28</p><p className="text-[10px] text-gray-400 font-medium mt-1">Seluruh program siap dipantau</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><HiOutlineUser className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Siap Dilaporkan</p><p className="text-2xl font-bold text-gray-800 leading-none">6</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program dapat dibuatkan laporan</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><HiOutlineCalendarDays className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Menunggu Persetujuan</p><p className="text-2xl font-bold text-gray-800 leading-none">4</p><p className="text-[10px] text-gray-400 font-medium mt-1">Laporan sedang diproses</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineCheckCircle className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-800 mb-0.5">Disahkan</p><p className="text-2xl font-bold text-gray-800 leading-none">18</p><p className="text-[10px] text-gray-400 font-medium mt-1">Laporan telah disahkan</p></div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 px-6 gap-6 pt-4 scrollbar-hide">
          {['Semua Program', 'Donasi', 'APBD', 'CSR'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Cari program atau ID program..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] outline-none" />
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Jenis Program</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua</option></select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Status</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua</option></select>
          </div>
          <div className="w-full md:w-48 relative">
            <input type="text" placeholder="Pilih periode" className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none" />
            <HiOutlineCalendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="px-5 py-2.5 border border-gray-300 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 shrink-0 h-fit">
            <HiOutlineArrowPath className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Table */}
        <div className="p-5 border-b border-gray-50 pb-2">
          <h3 className="font-bold text-gray-800">Daftar Program Siap Dilaporkan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-[10px] font-bold text-gray-500 border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 pr-2">No</th>
                <th className="py-4 px-2 text-left">ID Program</th>
                <th className="py-4 px-2 text-left">Nama Program</th>
                <th className="py-4 px-2 text-center">Jenis Program</th>
                <th className="py-4 px-2 text-left">Tanggal Selesai</th>
                <th className="py-4 px-2 text-left">Realisasi Utama</th>
                <th className="py-4 px-2 text-center">Status Laporan</th>
                <th className="py-4 pr-6 pl-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA.map((item, idx) => {
                const style = getStatusStyle(item.status);
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-6 pr-2 font-medium text-gray-600">{idx + 1}</td>
                    <td className="py-4 px-2 font-medium text-gray-600">{item.id}</td>
                    <td className="py-4 px-2 font-bold text-gray-800 w-56 whitespace-normal leading-snug">{item.nama}</td>
                    <td className="py-4 px-2 text-center font-medium text-gray-600">{item.jenis}</td>
                    <td className="py-4 px-2 font-medium text-gray-600">{item.tgl}</td>
                    <td className="py-4 px-2 font-medium text-gray-600 w-48 whitespace-normal leading-snug">{item.realisasi}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full ${style.badge}`}>{item.status}</span>
                    </td>
                    <td className="py-4 pr-6 pl-2">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleActionClick(item)} className={`px-4 py-1.5 text-[10px] font-bold border rounded-lg bg-white transition-colors ${style.btn}`}>
                          {style.label}
                        </button>
                        <button className="text-gray-400 hover:text-gray-700"><HiEllipsisVertical className="w-5 h-5"/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 flex justify-between items-center text-xs text-gray-500 border-t border-gray-50">
          <span>Menampilkan 1 - 8 dari 28 data</span>
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none font-medium text-gray-700 bg-white cursor-pointer"><option>10 / halaman</option></select>
            <div className="flex gap-1">
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&lt;</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#185325] text-white font-bold">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">2</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">3</button>
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PelaporanList;