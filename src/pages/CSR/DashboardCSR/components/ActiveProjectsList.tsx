import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineBriefcase, 
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineBuildingStorefront
} from 'react-icons/hi2';

interface ActiveProjectsListProps {
  companyName: string;
  projects: any[];
}

const ActiveProjectsList: React.FC<ActiveProjectsListProps> = ({ companyName, projects }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Kemitraan Kehutanan Aktif oleh Perusahaan Anda
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Daftar program rehabilitasi kritis yang didanai penuh oleh dana CSR korporasi {companyName}.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/csr/tinjau-proposal')} 
          className="hidden md:flex items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95"
        >
          Tinjau Proposal Baru <HiOutlineArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:border-[#185325] transition-colors group cursor-pointer" onClick={() => navigate(`/admin/csr/monitoring-proyek`)}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f3ea] text-[#185325] flex items-center justify-center shrink-0">
                <HiOutlineBriefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#185325] transition-colors">{project.nama_program || '-'}</h4>
                <div className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {project.status || 'Berjalan'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiOutlineBuildingStorefront className="w-4 h-4 shrink-0 text-gray-400" />
                <span className="truncate">{project.kth?.nama || project.kth?.name || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiOutlineMapPin className="w-4 h-4 shrink-0 text-gray-400" />
                <span className="truncate">{project.lokasi || project.analysis_result_zone?.desa || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiOutlineCalendar className="w-4 h-4 shrink-0 text-gray-400" />
                <span>Target Lahan: {project.target_luas_lahan || 0} Ha</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 md:hidden">
        <button
          onClick={() => navigate('/admin/csr/tinjau-proposal')} 
          className="w-full flex justify-center items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95"
        >
          Tinjau Proposal Baru <HiOutlineArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default ActiveProjectsList;
