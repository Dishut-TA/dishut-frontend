import React from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlinePlus } from 'react-icons/hi2';

interface BibitToolbarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterTinggi: string;
  setFilterTinggi: (val: string) => void;
  onAddClick: () => void;
}

const BibitToolbar: React.FC<BibitToolbarProps> = ({
  searchTerm, setSearchTerm, filterTinggi, setFilterTinggi, onAddClick
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Stok Bibit & Harga</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola master data dan pantau ketersediaan stok bibit tanaman.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
        <div className="relative w-full sm:w-56 shrink-0">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari Kode Bibit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#009262] focus:border-[#009262] outline-none shadow-sm transition-all"
          />
        </div>

        <div className="relative w-full sm:w-40 shrink-0">
          <HiOutlineFunnel className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
          <select
            value={filterTinggi}
            onChange={(e) => setFilterTinggi(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-[#009262] focus:border-[#009262] outline-none shadow-sm transition-all cursor-pointer appearance-none"
          >
            <option value="Semua">Semua Tinggi</option>
            <option value="30-60 cm">30-60 cm</option>
            <option value="61-100 cm">61-100 cm</option>
            <option value="70-100 cm">70-100 cm</option>
            <option value="> 100 cm">&gt; 100 cm</option>
          </select>
        </div>

        <button
          onClick={onAddClick}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#123d1c] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto shrink-0"
        >
          <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} /> Tambah Bibit Baru
        </button>

      </div>
    </div>
  );
};

export default BibitToolbar;