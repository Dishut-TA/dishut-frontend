import React from 'react';

const PetaKegiatanEvaluasi: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2 flex flex-col h-full min-h-100">
      <h2 className="text-base font-bold text-gray-800 mb-4">
        Peta Evaluasi
      </h2>
      
      <div className="w-full flex-1 bg-blue-50/50 rounded-lg border border-gray-200 overflow-hidden relative flex items-center justify-center">
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <span className="text-gray-400 text-sm font-medium z-10 bg-white/80 px-4 py-2 rounded-md shadow-sm backdrop-blur-sm text-center">
          [ Integrasi React-Leaflet / Peta Evaluasi di sini ]
        </span>

        <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse" title="PU 1 - Gagal"></div>
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-[#185325] rounded-full border-2 border-white shadow-md" title="PU 3 - Berhasil"></div>
        
        <div className="absolute bottom-0 right-0 bg-white/80 text-[10px] text-gray-500 px-2 py-1 z-10">
          Leaflet | © OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
};

export default PetaKegiatanEvaluasi;