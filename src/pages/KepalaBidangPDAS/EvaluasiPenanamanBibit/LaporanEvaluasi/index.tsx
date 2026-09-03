import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineCheckBadge, HiOutlineDocumentCheck } from 'react-icons/hi2';

const PengesahanLaporanKABID: React.FC = () => {
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState('');

  const mockData = [
    {
      id: 'EVAL-001',
      proyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
      timPenilai: 'Srie Resmita (Ketua) dkk.',
      hasilTumbuh: '87.40%',
      kategori: 'BERHASIL',
      status: 'MENUNGGU PENGESAHAN',
    },
    {
      id: 'EVAL-002',
      proyek: 'Rehabilitasi DAS PT Pertamina EP',
      timPenilai: 'Andi Mansur (Ketua) dkk.',
      hasilTumbuh: '92.10%',
      kategori: 'BERHASIL',
      status: 'BERITA ACARA TERBIT',
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi & Pengesahan Laporan</h1>
          <p className="text-sm text-gray-500 mt-1">Review hasil evaluasi lapangan Tim Penilai dan terbitkan Berita Acara.</p>
        </div>
        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Cari laporan..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#185325] focus:border-[#185325]" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Proyek & Lokasi</th>
                <th className="px-6 py-4 text-center">Tim Penilai</th>
                <th className="px-6 py-4 text-center">Hasil (% Tumbuh)</th>
                <th className="px-6 py-4 text-center">Status Dokumen</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-800">{item.proyek}</div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-semibold text-gray-600">{item.timPenilai}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-[#185325]">{item.hasilTumbuh}</span>
                      <span className="text-[10px] font-bold text-[#185325] uppercase bg-[#DCECE0] px-2 py-0.5 rounded-md mt-1">{item.kategori}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'MENUNGGU PENGESAHAN' ? 'bg-[#FEF3C7] text-yellow-800' : 'bg-[#DCECE0] text-[#185325]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 flex justify-center">
                    {item.status === 'MENUNGGU PENGESAHAN' ? (
                      <button onClick={() => navigate(`/admin/kabid/evaluasi/laporan/${item.id}`)} className="flex items-center gap-1.5 px-4 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                        <HiOutlineCheckBadge className="w-4 h-4" /> Review & Sahkan
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-lg transition-colors shadow-sm border border-gray-200">
                        <HiOutlineDocumentCheck className="w-4 h-4" /> Buka Berita Acara
                      </button>
                    )}
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

export default PengesahanLaporanKABID;