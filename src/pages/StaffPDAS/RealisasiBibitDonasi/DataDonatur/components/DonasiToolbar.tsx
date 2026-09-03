import React from 'react';
import { Search } from 'lucide-react';

interface DonasiToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const DonasiToolbar: React.FC<DonasiToolbarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Data Donasi</h1>
        <p className="text-sm md:text-base text-gray-500">
          Kelola dan verifikasi data donasi bibit masuk dari para donatur.
        </p>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari ID transaksi/nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#DCECE0]/30 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-sm text-sm text-gray-700 shadow-sm"
        />
      </div>
    </div>
  );
};

export default DonasiToolbar;