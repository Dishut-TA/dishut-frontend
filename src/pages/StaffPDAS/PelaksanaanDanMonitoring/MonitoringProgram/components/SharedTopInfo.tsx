import React from 'react';
import { HiOutlineMap, HiOutlineMapPin } from 'react-icons/hi2';

interface SharedTopInfoProps {
  hideMap?: boolean;
}

const SharedTopInfo: React.FC<SharedTopInfoProps> = ({ hideMap }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs w-full">
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">ID Program</span><span>:</span><span className="font-bold text-gray-800">PRG-2026-0007</span></div>
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Tanggal Pelaksanaan</span><span>:</span><span className="font-bold text-gray-800">12 Juli 2026</span></div>
          {!hideMap && <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Penyuluh</span><span>:</span><span className="font-bold text-gray-800">Ahmad Fauzi</span></div>}
          
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Jenis Program</span><span>:</span><span className="font-bold text-gray-800">Rehabilitasi Mangrove</span></div>
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Tanggal Selesai</span><span>:</span><span className="font-bold text-gray-800">15 September 2026</span></div>
          {!hideMap && <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">KTH</span><span>:</span><span className="font-bold text-gray-800">KTH Karangsong Lestari</span></div>}
          
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Sumber Dana</span><span>:</span><span className="font-bold text-gray-800">APBD</span></div>
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Target Tanam</span><span>:</span><span className="font-bold text-gray-800">2.500 Pohon</span></div>
          
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Lokasi Program</span><span>:</span><span className="font-bold text-gray-800">Desa Karangsong, Kec. Indramayu</span></div>
          <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Realisasi Tanam</span><span>:</span><span className="font-bold text-gray-800">2.500 Pohon</span></div>
        </div>

      </div>
        {!hideMap && (
          <div className="w-full lg:w-64 shrink-0 rounded-xl overflow-hidden border border-gray-200 relative bg-[#EBF3FA] h-32 flex flex-col">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Map" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><HiOutlineMapPin className="w-8 h-8 text-red-500 drop-shadow-md bg-white rounded-full p-1.5" /></div>
            <a href="#" className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur text-blue-600 text-[11px] font-bold py-1.5 text-center flex justify-center items-center gap-1 border-t border-gray-100 hover:bg-white transition-colors"><HiOutlineMap className="w-3.5 h-3.5"/> Lihat di Peta</a>
          </div>
        )}
    </div>
  );
};

export default SharedTopInfo;