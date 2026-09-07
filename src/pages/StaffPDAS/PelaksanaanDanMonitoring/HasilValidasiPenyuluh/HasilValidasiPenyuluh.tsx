import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getAllPenugasanAPI } from '@/services/penugasan.service';

interface BarisValidasi {
  id: number | string;
  lokasi: string;
  sumber: string;
  penyuluh: string;
  tanggal: string;
  status: string;
}

const tanggalId = (nilai?: string | null) => {
  if (!nilai || nilai === '-') return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return `${tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ${tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
};

const HasilValidasiPenyuluh: React.FC = () => {
  const navigate = useNavigate();
  const [daftar, setDaftar] = useState<BarisValidasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambil = async () => {
      try {
        const res = await getAllPenugasanAPI();
        // Halaman ini khusus kegiatan Validasi Lokasi yang sudah ditugaskan.
        const baris = (res?.data || [])
          .filter((p: any) => p?.jenisKegiatan === 'Validasi Lokasi' && p.penugasan_id)
          .map((p: any) => ({
            id: p.penugasan_id,
            lokasi: p.lokasi || p.program || '-',
            sumber: p.detail?.sumber_lokasi || 'Analisis CPI',
            penyuluh: p.penyuluh || '-',
            tanggal: tanggalId(p.tanggalPenugasan !== '-' ? p.tanggalPenugasan : p.created_at),
            status: p.status || '-',
          }));
        setDaftar(baris);
      } catch {
        toast.error('Gagal memuat hasil validasi penyuluh.');
      } finally {
        setIsLoading(false);
      }
    };
    ambil();
  }, []);



  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Data Diterima': return 'bg-emerald-100 text-emerald-700';
      case 'Lengkap': return 'bg-green-100 text-green-700';
      case 'Perlu Ditinjau': return 'bg-orange-100 text-orange-700';
      case 'Perlu Perbaikan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Hasil Validasi Penyuluh</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan tinjau hasil verifikasi lapangan dari para penyuluh.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-2/3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Sumber Lokasi</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua Sumber</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Penyuluh</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua CDK</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325] bg-white">
                <option>Semua Status</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full lg:w-1/3">
            <div className="relative w-full">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Cari nama lokasi..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#185325]" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2">
                Reset
              </button>
              <button className="px-6 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0]/50 text-[#3A4D3F] text-xs font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Lokasi</th>
                <th className="px-6 py-4">Sumber Lokasi</th>
                <th className="px-6 py-4">Penyuluh</th>
                <th className="px-6 py-4">Tanggal Kirim</th>
                <th className="px-6 py-4 text-center">Status Data</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 font-medium">Memuat hasil validasi...</td></tr>
              ) : daftar.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 font-medium">Belum ada hasil validasi lokasi dari penyuluh.</td></tr>
              ) : daftar.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.lokasi}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.sumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.penyuluh}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/admin/staff/monitoring/hasil-validasi-lokasi/detail/${item.id}`)}
                      className="px-4 py-1.5 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-lg transition-colors"
                    >
                      Detail
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/staff/monitoring/hasil-validasi-lokasi/proses/${item.id}`)}
                      className="px-4 py-1.5 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Validasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HasilValidasiPenyuluh;