import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMapPin, HiArrowLeft, HiHome } from 'react-icons/hi2';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#F5F7F5] flex flex-col items-center justify-center p-6 text-center overflow-hidden z-0">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-80 h-80 bg-green-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-lime-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-2xl bg-white/40 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-[#EBF3E8] rounded-full blur-xl opacity-80 animate-pulse" />
          <div className="relative bg-linear-to-br from-[#EBF3E8] to-[#D5F0DE] p-6 rounded-full mb-8 shadow-inner border border-white">
            <HiOutlineMapPin className="w-20 h-20 text-[#185325]" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[#185325] to-[#2E7D32] mb-4 tracking-tighter drop-shadow-sm">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Oops! Kehilangan Arah?
        </h2>
        
        <p className="text-gray-500 mb-10 max-w-md text-sm md:text-base leading-relaxed">
          Sepertinya Anda tersesat di luar area rehabilitasi. Koordinat rute atau data lahan yang Anda tuju tidak dapat ditemukan di dalam sistem.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 px-8 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <HiArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto bg-[#185325] hover:bg-[#113d1b] text-white px-8 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <HiHome className="w-5 h-5" />
            Beranda Utama
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;