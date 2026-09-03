import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi2'; 
import toast from 'react-hot-toast';
import { hasilValidasiService } from '@/services/hasilValidasi.service';

const HasilValidasiLokasi: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await hasilValidasiService.getAll();
      setData(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hasil Validasi Lokasi</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan tinjau hasil verifikasi lapangan dari para penyuluh.</p>
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
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">Belum ada data validasi dari penyuluh.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.nama_lokasi}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.sumber_lokasi || 'Analisis CPI'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.nama_penyuluh}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.created_at).toLocaleString('id-ID')}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status_verifikasi === 'Belum' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-emerald-50 text-[#185325] border border-emerald-200'}`}>
                        {item.status_verifikasi === 'Belum' ? 'Belum Validasi' : 'Sudah Validasi'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 flex justify-center items-center">
                      {item.status_verifikasi !== 'Belum' ? (
                        <button 
                          onClick={() => navigate(`/admin/kabid/analisis-cpi/hasil-validasi-lokasi/detail/${item.id}`, { state: { data: item } })}
                          title="Lihat Detail Validasi"
                          className="p-2 text-gray-500 hover:text-[#185325] hover:bg-[#EBF8F1] rounded-lg transition-colors active:scale-95"
                        >
                          <HiOutlineEye className="w-5 h-5 stroke-2" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/admin/kabid/analisis-cpi/hasil-validasi-lokasi/detail/${item.id}`, { state: { data: item } })}
                          className="px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95 flex items-center justify-center"
                        >
                          Validasi
                        </button>
                      )}
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

export default HasilValidasiLokasi;