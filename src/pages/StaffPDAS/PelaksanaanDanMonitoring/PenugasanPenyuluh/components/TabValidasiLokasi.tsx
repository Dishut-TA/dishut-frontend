import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowPath, 
  HiOutlineEllipsisVertical, 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineCheckCircle, 
  HiOutlineMapPin 
} from 'react-icons/hi2';

const mockValidasi = [
  { id: 1, jenis: 'Validasi Lokasi', ref: 'LOC-2026-0012', objek: 'Blok Cibodas', sumber: 'Usulan KTH', cdk: 'Cimanuk', penyuluh: 'Ahmad Fauzi', tglMulai: '15 Jun 2026', batasWaktu: '20 Jun 2026', status: 'Dalam Validasi' },
  { id: 2, jenis: 'Validasi Lokasi', ref: 'LOC-2026-0013', objek: 'Blok Pangalengan', sumber: 'Musrenbangdes', cdk: 'Citarum', penyuluh: 'Siti Nurafiza', tglMulai: '16 Jun 2026', batasWaktu: '22 Jun 2026', status: 'Dijadwalkan' },
  { id: 3, jenis: 'Validasi Lokasi', ref: 'LOC-2026-0014', objek: 'Blok Citalem', sumber: 'Usulan KTH', cdk: 'Priangan Timur', penyuluh: null, tglMulai: '-', batasWaktu: '18 Jun 2026', status: 'Menunggu Penugasan' },
  { id: 4, jenis: 'Validasi Lokasi', ref: 'LOC-2026-0015', objek: 'Blok Cipeundeuy', sumber: 'Usulan DLHK', cdk: 'Ciliwung', penyuluh: 'Dedi Kurniawan', tglMulai: '19 Jun 2026', batasWaktu: '24 Jun 2026', status: 'Dalam Validasi' },
  { id: 5, jenis: 'Validasi Lokasi', ref: 'LOC-2026-0016', objek: 'Blok Sukarame', sumber: 'Usulan Desa', cdk: 'Citarum', penyuluh: 'Rina Herlina', tglMulai: '14 Jun 2026', batasWaktu: '21 Jun 2026', status: 'Selesai Validasi' },
];

const topStats = [
  { title: 'Total Penugasan', value: '24', desc: 'Seluruh penugasan validasi lokasi', icon: HiOutlineMapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Menunggu Penugasan', value: '5', desc: 'Belum ditugaskan ke penyuluh', icon: HiOutlineUser, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Dalam Validasi', value: '9', desc: 'Sedang berlangsung di lapangan', icon: HiOutlineCalendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Selesai Validasi', value: '10', desc: 'Validasi telah selesai dilakukan', icon: HiOutlineCheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const TabValidasiLokasi = ({ onAction }: { onAction: (type: 'tugaskan' | 'detail', data: any) => void }) => {

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('menunggu')) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (s.includes('dijadwalkan')) return 'bg-sky-50 text-sky-600 border-sky-200';
    if (s.includes('dalam validasi')) return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    if (s.includes('selesai')) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getActionMapping = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('menunggu')) {
      return { label: 'Tugaskan', type: 'tugaskan' as const, primary: true };
    }
    return { label: 'Detail', type: 'detail' as const, primary: false };
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border-b border-gray-100">
        {topStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
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
          <input type="text" placeholder="Cari lokasi..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-[#185325] outline-none" />
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
              <th className="px-6 py-4">ID Lokasi</th>
              <th className="px-6 py-4">Lokasi Usulan</th>
              <th className="px-6 py-4">Sumber Lokasi</th>
              <th className="px-6 py-4">CDK</th>
              <th className="px-6 py-4">Penyuluh</th>
              <th className="px-6 py-4">Tanggal Validasi</th>
              <th className="px-6 py-4">Batas Waktu</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockValidasi.map((item, index) => {
              const action = getActionMapping(item.status);
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.ref}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.objek}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{item.sumber}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{item.cdk}</td>
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

export default TabValidasiLokasi;