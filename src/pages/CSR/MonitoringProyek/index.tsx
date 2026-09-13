import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineEye } from 'react-icons/hi2';
import { getProgramCsrSayaAPI } from '@/services/program-csr.service';

const STATUS_DIMONITOR = ['Disetujui', 'Menunggu Pembayaran', 'Berjalan', 'Selesai', 'Dihentikan'];

const MonitoringProyekIndex: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProgramCsrSayaAPI();
        const list = (response || []).filter((item: any) => STATUS_DIMONITOR.includes(item.status));
        setProjects(list);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat daftar proyek rehabilitasi.');
        toast.error(err.message || 'Gagal memuat daftar proyek rehabilitasi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span>
        Memuat data proyek...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto pb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitoring Proyek Rehabilitasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar program rehabilitasi yang didanai oleh instansi Anda.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Program</th>
                <th className="px-6 py-4 font-semibold">Kelompok Tani</th>
                <th className="px-6 py-4 font-semibold">Status Pendanaan</th>
                <th className="px-6 py-4 font-semibold text-center">% Tumbuh</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada program rehabilitasi yang sedang berjalan.
                  </td>
                </tr>
              ) : (
                projects.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nama_program}</td>
                    <td className="px-6 py-4">{item.kth?.nama || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          item.status === 'Berjalan'
                            ? 'bg-green-100 text-[#185325]'
                            : item.status === 'Selesai'
                            ? 'bg-blue-100 text-blue-700'
                            : item.status === 'Dihentikan'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#185325]">
                      {item.persentase_tumbuh_terakhir !== null ? `${item.persentase_tumbuh_terakhir}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => navigate(`detail/${item.id}`)}
                          className="p-2 text-gray-400 hover:text-[#185325] hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Monitoring"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringProyekIndex;
