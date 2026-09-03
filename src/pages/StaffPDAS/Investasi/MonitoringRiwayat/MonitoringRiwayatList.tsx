import React, { useState } from 'react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

type StatusMonitoring = 
  | 'Menunggu Persetujuan CSR' 
  | 'Sedang Berjalan' 
  | 'Selesai' 
  | 'Ditolak';

interface MonitoringProgram {
  id: string;
  namaProgram: string;
  kth: string;
  lokasi: string;
  pendanaan: 'CSR' | 'APBD' | 'Mandiri';
  mitra: string;
  anggaran: number;
  status: StatusMonitoring;
}

const mockData: MonitoringProgram[] = [
  {
    id: '#PROP-1',
    namaProgram: 'Laporan Dampak Penghijauan Cisarua',
    kth: 'KTH Rimba',
    lokasi: 'Desa Sukamulya',
    pendanaan: 'CSR',
    mitra: 'PT. Alfamart',
    anggaran: 80000000,
    status: 'Menunggu Persetujuan CSR'
  },
  {
    id: '#PROP-2',
    namaProgram: 'Rehabilitasi Lahan Kritis Citarum Blok 1',
    kth: 'KTH Wana Lestari',
    lokasi: 'Kertasari',
    pendanaan: 'APBD',
    mitra: 'Dinas Kehutanan Jabar',
    anggaran: 150000000,
    status: 'Sedang Berjalan'
  },
  {
    id: '#PROP-3',
    namaProgram: 'Penanaman Pohon Pelindung DAS Cisadane',
    kth: 'KTH Maju Jaya',
    lokasi: 'Desa Cikahuripan',
    pendanaan: 'CSR',
    mitra: 'Bank BJB',
    anggaran: 95000000,
    status: 'Selesai'
  }
];

const MonitoringRiwayatList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data] = useState<MonitoringProgram[]>(mockData);

  const filteredData = data.filter((item) =>
    item.namaProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kth.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mitra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(angka);
  };

  const getStatusColor = (status: StatusMonitoring) => {
    switch (status) {
      case 'Menunggu Persetujuan CSR':
        return 'text-[#185325] font-bold';
      case 'Sedang Berjalan':
        return 'text-blue-600 font-bold';
      case 'Selesai':
        return 'text-emerald-600 font-bold';
      case 'Ditolak':
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-700 font-medium';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Riwayat & Monitoring Program
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Daftar usulan yang telah diverifikasi dan dipantau status kemitraannya.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari Program.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all text-sm text-gray-700 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200/60">
                <th className="px-6 py-4 whitespace-nowrap">PROPOSAL / PROGRAM KERJA</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap">Pendanaan</th>
                <th className="px-6 py-4 whitespace-nowrap">Mitra</th>
                <th className="px-6 py-4 whitespace-nowrap">Anggaran</th>
                <th className="px-6 py-4 whitespace-nowrap">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-400">
                          {item.id}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {item.namaProgram}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-gray-800">
                          {item.kth}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.lokasi}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                      {item.pendanaan}
                    </td>

                    <td className="px-6 py-4.5 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {item.mitra}
                    </td>

                    <td className="px-6 py-4.5 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {formatRupiah(item.anggaran)}
                    </td>

                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500 text-sm">
                    Program atau usulan yang Anda cari tidak ditemukan.
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

export default MonitoringRiwayatList;