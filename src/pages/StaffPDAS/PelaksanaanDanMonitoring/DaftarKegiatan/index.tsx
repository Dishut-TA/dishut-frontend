import React, { useState, useMemo } from 'react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import ActivityTable from './components/ActivityTable';

export type ActivityStatus = 'Menunggu Verifikasi' | 'Siap Monitoring' | 'Berjalan' | 'Selesai' | 'Bermasalah';

export interface Activity {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  progress: number;
  author: string;
  status: ActivityStatus;
}

const DaftarKegiatan: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData: Activity[] = [
    {
      id: 1,
      title: 'Rehabilitasi Lahan Kritis Citarum',
      location: 'Hulu Citarum, Kabupaten Bandung',
      date: '15/3/2026',
      time: '09.00 WIB',
      progress: 0,
      author: 'KTH Rimba',
      status: 'Menunggu Verifikasi'
    },
    {
      id: 2,
      title: 'Penanaman Mangrove Pesisir',
      location: 'Pantai Pondok Bali, Subang',
      date: '15/3/2026',
      time: '09.00 WIB',
      progress: 75,
      author: 'Bpk Daffa Mahendra',
      status: 'Berjalan'
    },
    {
      id: 3,
      title: 'Pemeliharaan Pohon Pelindung',
      location: 'Hutan Kota, Bandung',
      date: '20/4/2026',
      time: '10.00 WIB',
      progress: 100,
      author: 'Bpk Daffa Mahendra',
      status: 'Selesai'
    },
    {
      id: 4,
      title: 'Penanaman Bibit Mahoni',
      location: 'Lembang, Bandung Barat',
      date: '10/6/2026',
      time: '09.00 WIB',
      progress: 0,
      author: 'KTH Maju Jaya',
      status: 'Siap Monitoring'
    },
  ];

  const filters = ['All', 'Menunggu Verifikasi', 'Siap Monitoring', 'Berjalan', 'Selesai', 'Bermasalah'];

  const filteredData = useMemo(() => {
    return dummyData.filter((kegiatan) => {
      const matchesFilter = activeFilter === 'All' || kegiatan.status === activeFilter;
      const matchesSearch = 
        kegiatan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kegiatan.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 px-4 sm:px-0">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Daftar Kegiatan Program Rehabilitasi
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Kelola dan monitor detail seluruh kegiatan lapangan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 flex flex-col xl:flex-row gap-4 justify-between items-center w-full">
        <div className="relative w-full xl:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari nama kegiatan atau lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#DCECE0]/30 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-sm text-sm text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 custom-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                activeFilter === filter
                  ? 'bg-[#185325] text-white border-[#185325]'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <ActivityTable data={filteredData} />

    </div>
  );
}

export default DaftarKegiatan;