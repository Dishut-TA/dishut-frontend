import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowPath,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiOutlineUserMinus,
  HiOutlinePlus,
  HiEllipsisVertical,
  HiOutlineEye
} from 'react-icons/hi2';
import TambahPenyuluhModal from './components/TambahPenyuluhModal';

// --- MOCK DATA ---
const MOCK_DATA = [
  { id: '1', nama: 'IMAS ROHMAYATI, S.P., M.P.', nip: '198105152008012001', unitKerja: 'Cabang Dinas Kehutanan Wilayah V Garut', jabatan: 'Penyuluh Kehutanan Ahli Madya', status: 'Aktif', jmlPenugasan: 3 },
  { id: '2', nama: 'ATAN RUSTANDI, S.P.', nip: '197905222007011015', unitKerja: 'Cabang Dinas Kehutanan Wilayah V Garut', jabatan: 'Penyuluh Kehutanan Ahli Madya', status: 'Aktif', jmlPenugasan: 2 },
  { id: '3', nama: 'SUHERMAN, S.P.', nip: '197803112006041009', unitKerja: 'Cabang Dinas Kehutanan Wilayah V Garut', jabatan: 'Penyuluh Kehutanan Ahli Madya', status: 'Aktif', jmlPenugasan: 1 },
  { id: '4', nama: 'DINI NURLATIFAH, S.Hut', nip: '198406102010122005', unitKerja: 'Cabang Dinas Kehutanan Wilayah V Garut', jabatan: 'Penyuluh Kehutanan Ahli Pertama', status: 'Aktif', jmlPenugasan: 2 },
  { id: '5', nama: 'WAWAN SETIAWAN, S.P.', nip: '198307182009011003', unitKerja: 'Cabang Dinas Kehutanan Wilayah V Garut', jabatan: 'Penyuluh Kehutanan Ahli Muda', status: 'Aktif', jmlPenugasan: 1 },
];

const MasterPenyuluh: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) setActiveDropdown(null);
    else setActiveDropdown(id);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Master Penyuluh</h1>
          <p className="text-sm text-gray-500 font-medium">Kelola data penyuluh yang digunakan dalam penugasan dan pelaksanaan program.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#185325] hover:bg-[#123d1c] text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            <HiOutlinePlus className="w-4 h-4" /> Tambah Penyuluh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineUserGroup className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Total Penyuluh</p><p className="text-2xl font-bold text-gray-800 leading-none">156</p><p className="text-[10px] text-gray-400 font-medium mt-1">Seluruh penyuluh terdaftar</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineCheckCircle className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Penyuluh Aktif</p><p className="text-2xl font-bold text-gray-800 leading-none">148</p><p className="text-[10px] text-gray-400 font-medium mt-1">Penyuluh berstatus aktif</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><HiOutlineBriefcase className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Sedang Ditugaskan</p><p className="text-2xl font-bold text-gray-800 leading-none">32</p><p className="text-[10px] text-gray-400 font-medium mt-1">Penyuluh dalam program berjalan</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><HiOutlineUserMinus className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Penyuluh Nonaktif</p><p className="text-2xl font-bold text-gray-800 leading-none">8</p><p className="text-[10px] text-gray-400 font-medium mt-1">Penyuluh tidak aktif</p></div>
        </div>
      </div>

      {/* Filter & Table Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        
        {/* Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full md:w-auto relative">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Pencarian</label>
            <HiOutlineMagnifyingGlass className="absolute left-3.5 bottom-3 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Cari nama penyuluh, NIP, atau unit kerja..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] outline-none" />
          </div>
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Unit Kerja</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua Unit Kerja</option></select>
          </div>
          <div className="w-full md:w-56">
            <label className="text-[10px] font-bold text-gray-500 block mb-1">Status</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none"><option>Semua Status</option></select>
          </div>
          <button className="px-5 py-2.5 border border-gray-300 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 shrink-0 h-fit w-full md:w-auto">
            <HiOutlineArrowPath className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Table List */}
        <div className="p-6 border-b border-gray-50 pb-3">
          <h3 className="font-bold text-gray-800">Daftar Penyuluh</h3>
        </div>
        <div className="overflow-x-auto min-h-75">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-[11px] font-bold text-[#3A4D3F] bg-[#DCECE0] border-y border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 pr-2">No</th>
                <th className="py-4 px-2 text-left">Nama Penyuluh</th>
                <th className="py-4 px-2 text-left">NIP</th>
                <th className="py-4 px-2 text-left">Unit Kerja</th>
                <th className="py-4 px-2 text-left">Jabatan</th>
                <th className="py-4 px-2 text-center">Status</th>
                <th className="py-4 px-2 text-center">Jumlah Penugasan</th>
                <th className="py-4 pr-6 pl-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pl-6 pr-2 font-medium text-gray-600">{idx + 1}</td>
                  <td className="py-4 px-2 font-bold text-gray-800">{item.nama}</td>
                  <td className="py-4 px-2 font-medium text-gray-600">{item.nip}</td>
                  <td className="py-4 px-2 font-medium text-gray-600 w-48 whitespace-normal leading-snug">{item.unitKerja}</td>
                  <td className="py-4 px-2 font-medium text-gray-600 w-40 whitespace-normal leading-snug">{item.jabatan}</td>
                  <td className="py-4 px-2 text-center">
                    <span className="px-2.5 py-1 text-[10px] font-bold border rounded-full bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]">Aktif</span>
                  </td>
                  <td className="py-4 px-2 text-center font-medium text-gray-600">{item.jmlPenugasan} Program</td>
                  <td className="py-4 pr-6 pl-2 text-center relative">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => navigate(`/admin/staff/monitoring/master-penyuluh/${item.id}`)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" title="Lihat Detail">
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleDropdown(item.id)} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <HiEllipsisVertical className="w-5 h-5"/>
                      </button>
                    </div>
                    
                    {/* Dropdown Aksi */}
                    {activeDropdown === item.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)}></div>
                        <div className="absolute right-6 top-10 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2 flex flex-col text-left">
                          <button onClick={() => navigate(`/admin/staff/monitoring/master-penyuluh/${item.id}`)} className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs font-medium text-left">Lihat Detail</button>
                          <button className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs font-medium text-left">Edit Penyuluh</button>
                          <button className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs font-medium text-left">Riwayat Penugasan</button>
                          <button className="px-4 py-2 hover:bg-orange-50 text-orange-600 text-xs font-medium text-left">Nonaktifkan</button>
                          <button className="px-4 py-2 hover:bg-red-50 text-red-600 text-xs font-medium text-left border-t border-gray-50 mt-1 pt-3">Hapus</button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex justify-between items-center text-xs text-gray-500 border-t border-gray-50">
          <span>Menampilkan 1 - 10 dari 156 data</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Tampilkan</span>
              <select className="border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none font-medium text-gray-700 bg-white cursor-pointer"><option>10</option></select>
            </div>
            <div className="flex gap-1">
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&lt;</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#185325] text-white font-bold">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">2</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">3</button>
              <span className="px-2 py-1.5">...</span>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">16</button>
              <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <TambahPenyuluhModal onClose={() => setIsModalOpen(false)} />}

    </div>
  );
}

export default MasterPenyuluh;