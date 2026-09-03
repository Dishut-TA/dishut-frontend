import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineBriefcase, 
  HiOutlineArrowRight 
} from 'react-icons/hi2';

interface ActiveProjectsEmptyProps {
  companyName: string;
}

const ActiveProjectsEmpty: React.FC<ActiveProjectsEmptyProps> = ({ companyName }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-start gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Kemitraan Kehutanan Aktif oleh Perusahaan Anda
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Daftar program rehabilitasi kritis yang didanai penuh oleh dana CSR korporasi {companyName}.
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-10 md:p-16 flex flex-col items-center justify-center text-center bg-gray-50/30">
        <HiOutlineBriefcase className="w-10 h-10 text-[#185325] mb-4" />
        <h4 className="text-base font-bold text-gray-800 mb-2">
          Belum Ada Proyek Rehabilitasi Aktif
        </h4>
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          Silakan buka tab "Tinjauan Proposal Dinas" untuk mengecek pengajuan reboisasi yang butuh dana CSR.
        </p>
        <button
          onClick={() => navigate('/admin/csr/tinjau-proposal')} 
          className="flex items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95"
        >
          Tinjau Proposal Baru <HiOutlineArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
};

export default ActiveProjectsEmpty;