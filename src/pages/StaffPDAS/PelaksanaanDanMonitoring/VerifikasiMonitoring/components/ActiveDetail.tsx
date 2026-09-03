import React from 'react';
import { 
  HiOutlineMapPin, 
  HiOutlineInformationCircle, 
  HiOutlineShieldCheck,
  HiCheckCircle,
  HiXMark,
  HiCheck
} from 'react-icons/hi2';
import { type Report } from '../data'; 
import EmptyStateDetail from './EmptyStateDetail';

const ActiveDetail: React.FC<{ report: Report }> = ({ report }) => {
  const { details } = report;
  
  if (!details) return <EmptyStateDetail />;

  const handleApprove = () => {
    console.log("Verifikasi Laporan ID:", report.id);
  };

  const handleReject = () => {
    console.log("Tolak Laporan ID:", report.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in duration-300 relative">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{report.title}</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">ID Laporan: {report.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800">
            <HiOutlineMapPin className="w-5 h-5 text-[#185325]" /> Verifikasi Koordinat
          </div>
          <div className="bg-[#EBF3E8] rounded-xl overflow-hidden text-sm">
            <div className="flex justify-between p-3 border-b border-white/50">
              <span className="text-gray-600">Latitude</span>
              <span className="font-bold text-gray-800">{details.latitude}</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-gray-600">Longitude</span>
              <span className="font-bold text-gray-800">{details.longitude}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="bg-[#185325] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
              {details.accuracy}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800">
            <HiOutlineInformationCircle className="w-5 h-5 text-[#185325]" /> Kondisi Tanaman
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-[#D5F0DE] rounded-xl p-4 text-center flex flex-col justify-center">
              <span className="text-xs text-green-800 font-semibold mb-1">KESEHATAN</span>
              <span className="text-xl font-bold text-green-900">{details.healthStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-800">
          <HiOutlineShieldCheck className="w-5 h-5 text-[#185325]" /> Verifikasi Dokumentasi
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2">
            <img src={details.images.before} alt="Before" className="w-full h-32 lg:h-48 object-cover rounded-xl shadow-sm" />
            <span className="text-[11px] font-bold text-gray-400 tracking-wider">BEFORE</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={details.images.during} alt="During" className="w-full h-32 lg:h-48 object-cover rounded-xl shadow-sm" />
            <span className="text-[11px] font-bold text-gray-400 tracking-wider">DURING</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-bold text-gray-800 mb-3">Verifikasi Kendala</div>
        <div className="bg-[#FDCFBA]/30 text-[#D85B1A] border border-[#FDCFBA] p-4 rounded-xl text-sm italic font-medium">
          {details.kendala}
        </div>
      </div>

      {/* RENDER BERDASARKAN STATUS */}
      {report.status === 'Verified' ? (
        <div className="bg-[#E8EDE9] rounded-xl p-5 flex items-start gap-4 mt-2">
          <HiCheckCircle className="w-6 h-6 text-[#185325] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#185325] text-sm mb-0.5">Sudah Terverifikasi</h4>
            <p className="text-xs text-[#185325]/80 font-medium">
              Oleh: {details.verifiedBy} pada {details.verifiedAt}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mt-4 pt-6 border-t border-gray-100">
          <button 
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors"
          >
            <HiXMark className="w-5 h-5" /> Tolak Laporan
          </button>
          
          <button 
            onClick={handleApprove}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#185325] hover:bg-[#123d1c] text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-[#185325]/20"
          >
            <HiCheck className="w-5 h-5" /> Verifikasi Laporan
          </button>
        </div>
      )}
      
    </div>
  );
};

export default ActiveDetail;