import React, { useState } from 'react';
import { 
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath,
  HiOutlineEllipsisVertical,
  HiOutlineUser
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const mockTableData = [
  { id: 1, ref: 'PRG-2026-0007', nama: 'Rehabilitasi Mangrove Karangsong', lokasi: 'Desa Karangsong, Kec. Indramayu', sumber: 'APBD', tgl: '15 Sep 2026', pj: 'Ahmad Fauzi', status: 'Siap Monitoring' },
  { id: 2, ref: 'PRG-2026-0004', nama: 'Pemulihan Lahan Kritis', lokasi: 'Blok Sukarame, Kec. Pacet', sumber: 'APBD', tgl: '22 Jun 2026', pj: 'Rina Herlina', status: 'Dalam Monitoring' },
  { id: 3, ref: 'PRG-2026-0012', nama: 'Agroforestry Hutan Desa', lokasi: 'Blok Citalem, Kec. Cisarua', sumber: 'APBD', tgl: '20 Jun 2026', pj: 'Siti Nurafiza', status: 'Menunggu Evaluasi' },
  { id: 4, ref: 'PRG-2026-0009', nama: 'Rehabilitasi DAS Citarik', lokasi: 'Desa Sukamaju, Kec. Rancabali', sumber: 'CSR', tgl: '18 Sep 2026', pj: 'Ahmad Fauzi', status: 'Perlu Tindak Lanjut' },
  { id: 5, ref: 'PRG-2026-0008', nama: 'Pemulihan Daerah Tangkapan Air', lokasi: 'Blok Cikoneng, Kec. Garut', sumber: 'APBD', tgl: '10 Jul 2026', pj: 'Rina Herlina', status: 'Monitoring Selesai' },
  { id: 6, ref: 'PRG-2026-0010', nama: 'Penghijauan Bukit Citeureup', lokasi: 'Blok Mekarsari, Kec. Banjar', sumber: 'CSR', tgl: '25 Sep 2026', pj: 'Siti Nurafiza', status: 'Dalam Monitoring' },
  { id: 7, ref: 'PRG-2026-0003', nama: 'Rehabilitasi Mata Air', lokasi: 'Blok Cipeundeuy, Kec. Bandung Barat', sumber: 'APBD', tgl: '28 Agu 2026', pj: 'Dedi Kurniawan', status: 'Monitoring Selesai' },
  { id: 8, ref: 'PRG-2026-0011', nama: 'Penanaman di Sempadan Sungai', lokasi: 'Desa Wanajaya, Kec. Cibitung', sumber: 'CSR', tgl: '27 Sep 2026', pj: 'Rina Herlina', status: 'Menunggu Evaluasi' },
];

const MonitoringMainTable: React.FC = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Semua');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Siap Monitoring': return 'bg-emerald-50 text-emerald-600';
      case 'Dalam Monitoring': return 'bg-blue-50 text-blue-600';
      case 'Menunggu Evaluasi': return 'bg-purple-50 text-purple-600';
      case 'Perlu Tindak Lanjut': return 'bg-orange-50 text-orange-600';
      case 'Monitoring Selesai': return 'bg-[#f0f9f3] text-[#185325]';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getActionButton = (status: string, id: string | number) => {
    switch (status) {
      case 'Siap Monitoring': 
        return { label: 'Atur Penugasan', style: 'border-emerald-500 text-emerald-600', route: `/admin/staff/monitoring/monitoring-program/penugasan/${id}` };
      case 'Dalam Monitoring': 
        return { label: 'Lihat Progres', style: 'border-blue-500 text-blue-600', route: `/admin/staff/monitoring/monitoring-program/progres/${id}` };
      case 'Menunggu Evaluasi': 
        return { label: 'Tinjau Hasil', style: 'border-purple-500 text-purple-600', route: `/admin/staff/monitoring/monitoring-program/tinjau/${id}` };
      case 'Perlu Tindak Lanjut': 
        return { label: 'Kelola Tindak Lanjut', style: 'border-orange-500 text-orange-600', route: `/admin/staff/monitoring/monitoring-program/tindak-lanjut/${id}` };
      case 'Monitoring Selesai': 
        return { label: 'Lihat Hasil', style: 'border-[#185325] text-[#185325]', route: `/admin/staff/monitoring/monitoring-program/hasil/${id}` };
      default: 
        return { label: 'Detail', style: 'border-gray-300 text-gray-700', route: '#' };
    }
  };

  return (
    <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-gray-100 px-6 pt-2 scrollbar-hide">
        {['Semua', 'Siap Monitoring', 'Dalam Monitoring', 'Menunggu Evaluasi', 'Perlu Tindak Lanjut', 'Monitoring Selesai'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 bg-white flex flex-col xl:flex-row gap-4 border-b border-gray-50">
        <div className="relative w-full xl:max-w-xs shrink-0">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Cari program..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Jenis Program</label><select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer"><option>Semua</option></select></div>
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Sumber Dana</label><select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer"><option>Semua</option></select></div>
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Lokasi Program</label><select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer"><option>Semua</option></select></div>
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Periode Selesai</label><input type="date" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 outline-none cursor-pointer" /></div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 mt-5 xl:mt-0 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 h-10.5 self-end shrink-0 cursor-pointer shadow-sm">
          <HiOutlineArrowPath/> Reset
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap bg-white">
          <thead className="bg-white text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-center">No</th>
              <th className="px-6 py-4">ID Program</th>
              <th className="px-6 py-4">Nama Program</th>
              <th className="px-6 py-4">Lokasi Program</th>
              <th className="px-6 py-4">Jenis Program</th>
              <th className="px-6 py-4">Tanggal Selesai</th>
              <th className="px-6 py-4">Penyuluh</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockTableData.map((item, index) => {
              const btn = getActionButton(item.status, item.id);
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.ref}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.nama}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{item.lokasi.split(',')[0]}</div>
                    <div className="text-[11px] text-gray-400">{item.lokasi.split(',')[1]}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.sumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.tgl}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="text-gray-400 w-4 h-4" />
                      <span className="text-sm font-bold text-gray-700">{item.pj}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                  onClick={() => navigate(btn.route)} 
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border bg-white shadow-sm cursor-pointer transition-colors hover:bg-gray-50 ${btn.style}`}
                >
                  {btn.label}
                </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                        <HiOutlineEllipsisVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <span className="text-sm text-gray-500 font-medium">Menampilkan 1 - 8 dari 45 data</span>
        <div className="flex items-center gap-4">
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none font-medium cursor-pointer">
            <option>10 / halaman</option>
          </select>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer">&laquo;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-sm cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer">&raquo;</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MonitoringMainTable;