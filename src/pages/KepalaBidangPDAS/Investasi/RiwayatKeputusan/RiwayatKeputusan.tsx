import React from 'react';
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

interface RiwayatData {
  id: string;
  program: string;
  kth: string;
  lokasi: string;
  jalurPembiayaan: 'APBD' | 'Kemitraan CSR';
  status: string;
  catatan: string;
}

const mockRiwayat: RiwayatData[] = [
  {
    id: 'HIS-001',
    program: 'Restorasi Mangrove di Pesisir Teluk Hijau',
    kth: 'KTH Rimba',
    lokasi: 'Desa Sukamulya',
    jalurPembiayaan: 'Kemitraan CSR',
    status: 'Menunggu Mitra CSR',
    catatan: 'Proyek penanganan daerah aliran sungai (DAS) sangat mendesak.'
  },
  {
    id: 'HIS-002',
    program: 'Restorasi Mangrove di Pesisir Teluk Hijau',
    kth: 'KTH Rimba',
    lokasi: 'Desa Sukamulya',
    jalurPembiayaan: 'APBD',
    status: 'Disetujui APBD',
    catatan: 'Proyek penanganan daerah aliran sungai (DAS) sangat mendesak.'
  }
];

const getStatusStyle = (status: string) => {
  if (status.includes('Disetujui') || status.includes('Mitra CSR')) {
    return 'text-[#185325] font-bold';
  }
  if (status.includes('Ditolak') || status.includes('Revisi')) {
    return 'text-red-600 font-bold';
  }
  return 'text-gray-600 font-bold';
};

const RiwayatKeputusan: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-800">
            Riwayat Keputusan & Otorisasi Dinas Kehutanan
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Rekam jejak disposisi, persetujuan, dan penolakan program rehabilitasi oleh Kepala Bidang.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-225">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap w-[25%]">Program</th>
                <th className="px-6 py-4 whitespace-nowrap w-[20%]">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap w-[15%]">Jalur / Pembiayaan</th>
                <th className="px-6 py-4 whitespace-nowrap w-[15%]">Status</th>
                <th className="px-6 py-4 w-[25%]">Catatan Disposisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRiwayat.length > 0 ? (
                mockRiwayat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <HiOutlineDocumentCheck className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 leading-snug">
                          {item.program}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{item.kth}</span>
                        <span className="text-xs text-gray-500">{item.lokasi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {item.jalurPembiayaan}
                    </td>
                    <td className={`px-6 py-4 text-sm whitespace-nowrap ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 italic leading-relaxed">
                        "{item.catatan}"
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada riwayat keputusan atau otorisasi.
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

export default RiwayatKeputusan;