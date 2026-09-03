import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight, HiOutlineXCircle } from 'react-icons/hi2';

type StatusVerifikasi = 'Menunggu Verifikasi' | 'Disetujui Staff' | 'Selesai';

interface DataVerifikasi {
  id: string;
  namaProyek: string;
  kthPengusul: string;
  periode: string;
  totalKeluar: number;
  status: StatusVerifikasi;
}

const mockData: DataVerifikasi[] = [
  {
    id: 'V-CSR-001',
    namaProyek: 'Rehabilitasi Citarum',
    kthPengusul: 'KTH Rimba',
    periode: 'Tahap 1',
    totalKeluar: 10000000,
    status: 'Menunggu Verifikasi'
  },
  {
    id: 'V-CSR-002',
    namaProyek: 'Rehabilitasi Citarum',
    kthPengusul: 'KTH Rimba',
    periode: 'Tahap 1',
    totalKeluar: 10000000,
    status: 'Disetujui Staff'
  },
  {
    id: 'V-CSR-003',
    namaProyek: 'Rehabilitasi Citarum',
    kthPengusul: 'KTH Rimba',
    periode: 'Tahap 1',
    totalKeluar: 10000000,
    status: 'Selesai'
  }
];

const VerifikasiDanaCSRKABID: React.FC = () => {
  const navigate = useNavigate();
  const [data] = useState<DataVerifikasi[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    item.namaProyek.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kthPengusul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const renderStatusBadge = (status: StatusVerifikasi) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#FDE68A] text-yellow-800">Menunggu Verifikasi</span>;
      case 'Disetujui Staff':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-blue-100 text-blue-800">Disetujui Staff</span>;
      case 'Selesai':
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#DCECE0] text-[#185325]">Selesai</span>;
      default:
        return <span className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Verifikasi Dana CSR
          </h1>
        </div>

        <div className="relative w-full md:w-72">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari Proyek..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all text-sm text-gray-700 shadow-sm"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                <th className="px-6 py-4 whitespace-nowrap">Nama Proyek</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH Pengusul</th>
                <th className="px-6 py-4 whitespace-nowrap">Periode</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Total Keluar</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {item.namaProyek}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#185325] whitespace-nowrap">
                      {item.kthPengusul}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {item.periode}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right whitespace-nowrap">
                      {formatRupiah(item.totalKeluar)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button 
                        onClick={() => navigate(`/admin/kabid/rehabilitasi/verifikasi-dana-csr/detail/${item.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm"
                      >
                        Periksa Berkas <HiOutlineArrowRight className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="p-3 bg-green-50 border border-green-100 rounded-full mb-4">
                        <HiOutlineXCircle className="w-10 h-10 text-[#185325]" />
                      </div>
                      <p className="text-lg font-bold text-gray-800 mb-1">Tidak ada Data!</p>
                      <p className="text-sm max-w-md mx-auto">
                        Berkas verifikasi tidak ditemukan atau sudah selesai diproses.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VerifikasiDanaCSRKABID;