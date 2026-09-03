import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiOutlineUser, 
  HiOutlineBriefcase, 
  HiOutlineMapPin,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

const mockPenyuluhProfile = {
  id: 1,
  nama: 'Andi Permana',
  nip: '198507212010011015',
  wilayahTugas: 'CDK Wilayah VI (Tasikmalaya, Garut)',
  totalTugas: 5,
  tugasSelesai: 3,
  tugasBerjalan: 2,
};

const mockAssignments = [
  { 
    id: 'TGS-001', 
    kategori: 'Pelaksanaan', 
    program: 'Rehabilitasi DAS Cimanuk (APBD)', 
    lokasi: 'Kec. Cisitu, Kab. Garut', 
    periode: '20 Mei - 20 Jun 2025', 
    tanggal: '24 Jun 2025', 
    status: 'Berjalan' 
  },
  { 
    id: 'TGS-002', 
    kategori: 'Validasi Lokasi', 
    program: 'Penghijauan Hulu Cimanuk (CSR)', // Ini akan diabaikan oleh UI dan diganti "-"
    lokasi: 'Kec. Cikajang, Kab. Garut', 
    periode: '10 Apr - 15 Apr 2025', 
    tanggal: '16 Apr 2025', 
    status: 'Selesai' 
  },
  { 
    id: 'TGS-003', 
    kategori: 'Monitoring', 
    program: 'Pemeliharaan Pohon Lindung (Donasi)', 
    lokasi: 'Kec. Tarogong, Kab. Garut', 
    periode: '01 Mar - 30 Mar 2025', 
    tanggal: '05 Apr 2025', 
    status: 'Selesai' 
  },
];

const DetailPenugasanPenyuluh: React.FC = () => {
  const navigate = useNavigate();

const getStatusStyle = (status: string) => {
    switch (status) {
      // Status Umum
      case 'Berjalan': 
      case 'Proses Validasi':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      
      case 'Menunggu Survei':
        return 'bg-gray-100 text-gray-700 border border-gray-200';

      // Status Hasil Positif
      case 'Selesai': 
      case 'Valid (Layak)':
        return 'bg-green-100 text-green-800 border border-green-200';
      
      // Status Hasil Negatif
      case 'Bermasalah': 
      case 'Tidak Valid (Tidak Layak)':
        return 'bg-red-50 text-red-700 border border-red-200';
        
      default: 
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getKategoriStyle = (kategori: string) => {
    switch (kategori) {
      case 'Validasi Lokasi': return 'text-purple-600 bg-purple-50';
      case 'Pelaksanaan': return 'text-blue-600 bg-blue-50';
      case 'Monitoring': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0">
      <div className="flex flex-col items-start gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#185325] transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Penugasan Penyuluh</h1>
          <p className="text-gray-500 text-sm mt-1">Informasi lengkap riwayat dan daftar penugasan aktif pelaksana.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <HiOutlineUser className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{mockPenyuluhProfile.nama}</h2>
            <p className="text-sm font-medium text-gray-500 mb-4">NIP. {mockPenyuluhProfile.nip}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
                {mockPenyuluhProfile.wilayahTugas}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
              <HiOutlineBriefcase className="w-5 h-5 text-blue-500" /> Total Penugasan
            </div>
            <span className="text-lg font-bold text-gray-800">{mockPenyuluhProfile.totalTugas}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" /> Tugas Selesai
            </div>
            <span className="text-lg font-bold text-emerald-600">{mockPenyuluhProfile.tugasSelesai}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Daftar Program & Penugasan</h3>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#DCECE0]/40 text-[#3A4D3F] text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-center">No</th>
                <th className="px-6 py-4">Kategori Penugasan</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Periode Penugasan</th>
                <th className="px-6 py-4">Tanggal Pelaksanaan</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockAssignments.length > 0 ? (
                mockAssignments.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${getKategoriStyle(item.kategori)}`}>
                        {item.kategori}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {item.kategori === 'Validasi Lokasi' ? (
                        <span className="text-black font-semibold">-</span>
                      ) : (
                        item.program
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.lokasi}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.periode}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.tanggal}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-md text-[11px] font-bold ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Penyuluh ini belum memiliki riwayat penugasan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">Menampilkan {mockAssignments.length} data penugasan</span>
        </div>
      </div>

    </div>
  );
};

export default DetailPenugasanPenyuluh;