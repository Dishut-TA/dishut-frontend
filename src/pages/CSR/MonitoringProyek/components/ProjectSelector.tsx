import React from 'react';
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

interface ProjectSelectorProps {
  selectedProject: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProject, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineDocumentCheck className="w-5 h-5 text-[#185325]" />
        <h2 className="text-sm font-bold text-gray-800">Pilih Proyek Rehabilitasi Anda</h2>
      </div>
      <select 
        value={selectedProject}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] appearance-none bg-white cursor-pointer"
      >
        <option value="CSR001">Rehabilitasi Lahan Citarum - #CSR001</option>
        <option value="CSR002">Pemulihan Mangrove Pesisir - #CSR002</option>
      </select>
    </div>
  );
};

export default ProjectSelector;