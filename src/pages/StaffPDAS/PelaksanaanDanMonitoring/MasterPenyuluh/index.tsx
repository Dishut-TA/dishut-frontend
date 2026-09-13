import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllPenugasanAPI } from '@/services/penugasan.service';
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
interface BarisPenyuluh {
  id: string;
  nama: string;
  nip: string;
  unitKerja: string;
  jabatan: string;
  jmlPenugasan: number;
}

const API_URL = import.meta.env.VITE_API_MASTER_URL || 'http://127.0.0.1:8000/api';

const MasterPenyuluh: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [daftar, setDaftar] = useState<BarisPenyuluh[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/users?role=penyuluh`, {
          headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Gagal memuat data penyuluh');

        const pengguna = json.payload?.data || json.payload || [];

        // Jumlah penugasan dihitung dari daftar penugasan, bukan disimpan di users.
        let hitungan: Record<string, number> = {};
        try {
          const penugasan = await getAllPenugasanAPI();
          hitungan = (penugasan?.data || []).reduce((acc: Record<string, number>, p: any) => {
            if (p?.penyuluh_id) acc[p.penyuluh_id] = (acc[p.penyuluh_id] || 0) + 1;
            return acc;
          }, {});
        } catch {
          // jumlah penugasan opsional; daftar penyuluh tetap ditampilkan
        }

        setDaftar(
          (Array.isArray(pengguna) ? pengguna : []).map((u: any) => ({
            id: String(u.id),
            nama: u.nama_pengguna || u.username || u.name || '-',
            nip: u.nip || u.profil?.nip || '-',
            // Kolom unit kerja belum ada di basis data pengguna.
            unitKerja: u.unit_kerja || '-',
            jabatan: u.jabatan || u.peran?.[0]?.nama || '-',
            jmlPenugasan: hitungan[u.id] || 0,
          }))
        );
      } catch (e: any) {
        toast.error(e?.message || 'Gagal memuat data penyuluh.');
      } finally {
        setIsLoading(false);
      }
    };
    ambil();
  }, []);

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
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Total Penyuluh</p><p className="text-2xl font-bold text-gray-800 leading-none">{daftar.length}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Seluruh penyuluh terdaftar</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><HiOutlineCheckCircle className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Penyuluh Aktif</p><p className="text-2xl font-bold text-gray-800 leading-none">{daftar.length}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Kolom status belum ada di basis data</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><HiOutlineBriefcase className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Sedang Ditugaskan</p><p className="text-2xl font-bold text-gray-800 leading-none">{daftar.filter((d) => d.jmlPenugasan > 0).length}</p><p className="text-[10px] text-gray-400 font-medium mt-1">Penyuluh dalam program berjalan</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><HiOutlineUserMinus className="w-6 h-6"/></div>
          <div><p className="text-xs font-bold text-gray-500 mb-0.5">Penyuluh Nonaktif</p><p className="text-2xl font-bold text-gray-800 leading-none">-</p><p className="text-[10px] text-gray-400 font-medium mt-1">Kolom status belum ada di basis data</p></div>
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
              {isLoading ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-500 font-medium">Memuat data penyuluh...</td></tr>
              ) : daftar.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-500 font-medium">Belum ada penyuluh terdaftar.</td></tr>
              ) : daftar.map((item, idx) => (
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
          <span>Menampilkan {daftar.length} dari {daftar.length} data</span>
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