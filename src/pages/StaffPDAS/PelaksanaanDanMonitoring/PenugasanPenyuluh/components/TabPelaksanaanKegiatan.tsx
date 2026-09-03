import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowPath, 
  HiOutlineEllipsisVertical, 
  HiOutlineClipboardDocumentCheck, 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineCheckCircle 
} from 'react-icons/hi2';

const mockPelaksanaan = [
  { id: 1, jenis: 'Pelaksanaan Kegiatan', ref: 'PRG-2026-0021', objek: 'Rehabilitasi DAS Cimanuk', jenisKeg: 'Penanaman', lokasi: 'Blok Cibodas, Kec. Rancabali', kth: 'KTH Mekar Jaya', penyuluh: 'Ahmad Fauzi', tglMulai: '15 Jun 2026', batasWaktu: '30 Sep 2026', status: 'Berjalan' },
  { id: 2, jenis: 'Pelaksanaan Kegiatan', ref: 'PRG-2026-0022', objek: 'Penanaman Lahan Kritis', jenisKeg: 'Penanaman', lokasi: 'Blok Pangalengan', kth: 'KTH Wana Lestari', penyuluh: 'Siti Nurafiza', tglMulai: '16 Jun 2026', batasWaktu: '25 Sep 2026', status: 'Berjalan' },
  { id: 3, jenis: 'Pelaksanaan Kegiatan', ref: 'PRG-2026-0023', objek: 'Agroforestry Hutan Desa', jenisKeg: 'Agroforestry', lokasi: 'Blok Citalem, Kec. Cisarua', kth: 'KTH Citalem Hijau', penyuluh: null, tglMulai: '-', batasWaktu: '20 Jun 2026', status: 'Siap Ditugaskan' },
  { id: 4, jenis: 'Pelaksanaan Kegiatan', ref: 'PRG-2026-0025', objek: 'Rehabilitasi Mata Air', jenisKeg: 'Konservasi', lokasi: 'Blok Cipeundeuy', kth: 'KTH Tirta Lestari', penyuluh: 'Dedi Kurniawan', tglMulai: '10 Jun 2026', batasWaktu: '28 Agu 2026', status: 'Berjalan' },
  { id: 5, jenis: 'Pelaksanaan Kegiatan', ref: 'PRG-2026-0027', objek: 'Rehabilitasi Mangrove', jenisKeg: 'Penanaman', lokasi: 'Desa Karangsong', kth: 'KTH Mangrove Lestari', penyuluh: 'Ahmad Fauzi', tglMulai: '01 Jun 2026', batasWaktu: '15 Sep 2026', status: 'Selesai Pelaksanaan' },
];

const topStats = [
  { title: 'Total Penugasan', value: '18', desc: 'Seluruh penugasan pelaksanaan', icon: HiOutlineClipboardDocumentCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Siap Ditugaskan', value: '4', desc: 'Belum ditugaskan ke penyuluh', icon: HiOutlineUser, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Berjalan', value: '9', desc: 'Sedang dilaksanakan di lapangan', icon: HiOutlineCalendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Selesai Pelaksanaan', value: '5', desc: 'Pelaksanaan telah selesai', icon: HiOutlineCheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const TabPelaksanaanKegiatan = ({ onAction }: { onAction: (type: 'tugaskan' | 'detail', data: any) => void }) => {

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('ditugaskan')) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (s.includes('berjalan')) return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    if (s.includes('selesai')) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getActionMapping = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('ditugaskan')) {
      return { label: 'Tugaskan', type: 'tugaskan' as const, primary: true };
    }
    return { label: 'Detail', type: 'detail' as const, primary: false };
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border-b border-gray-100">
        {topStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 mb-0.5">{stat.title}</p>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white flex flex-col lg:flex-row gap-4 border-b border-gray-50">
        <div className="relative w-full lg:max-w-xs">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Cari program..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-[#185325] outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Penyuluh</label><select className="px-3 py-2 border rounded-lg text-sm outline-none"><option>Semua</option></select></div>
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Status</label><select className="px-3 py-2 border rounded-lg text-sm outline-none"><option>Semua</option></select></div>
          <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-gray-500">Periode</label><input type="date" className="px-3 py-2 border rounded-lg text-sm text-gray-500 outline-none" /></div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 mt-5 lg:mt-0 border rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 h-9.5 self-end shrink-0 cursor-pointer"><HiOutlineArrowPath/> Reset</button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap bg-white">
          <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-center">No</th>
              <th className="px-6 py-4">ID Program</th>
              <th className="px-6 py-4">Nama Program</th>
              <th className="px-6 py-4">Jenis Kegiatan</th>
              <th className="px-6 py-4">Lokasi</th>
              <th className="px-6 py-4">KTH Terlibat</th>
              <th className="px-6 py-4">Penyuluh</th>
              <th className="px-6 py-4">Tanggal Mulai</th>
              <th className="px-6 py-4">Batas Waktu</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPelaksanaan.map((item, index) => {
              const action = getActionMapping(item.status);
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.ref}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.objek}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{item.jenisKeg}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500"><div className="w-32 truncate" title={item.lokasi}>{item.lokasi}</div></td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700">{item.kth}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {item.penyuluh ? <span className="flex items-center gap-2"><div className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold">{item.penyuluh[0]}</div>{item.penyuluh}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{item.tglMulai}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{item.batasWaktu}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusStyle(item.status)}`}>{item.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onAction(action.type, item)} 
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border shadow-sm cursor-pointer ${action.primary ? 'bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {action.label}
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"><HiOutlineEllipsisVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabPelaksanaanKegiatan;