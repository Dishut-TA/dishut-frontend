import React from 'react';
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

export interface ProjectOption {
  id: number;
  nama_program: string;
  created_at?: string;
  status?: string;
}

interface ProjectSelectorProps {
  projects: ProjectOption[];
  selectedProject: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const buildKode = (project: ProjectOption) => {
  const tahun = project.created_at ? new Date(project.created_at).getFullYear() : new Date().getFullYear();
  return `P-CSR-${tahun}-${String(project.id).padStart(3, '0')}`;
};

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProject, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineDocumentCheck className="w-5 h-5 text-[#185325]" />
        <h2 className="text-sm font-bold text-gray-800">Pilih Proyek Rehabilitasi Anda</h2>
      </div>
      <select
        value={selectedProject}
        onChange={onChange}
        disabled={projects.length === 0}
        className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] appearance-none bg-white cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        {projects.length === 0 ? (
          <option value="">Belum ada proyek rehabilitasi</option>
        ) : (
          projects.map((project) => (
            <option key={project.id} value={String(project.id)}>
              {project.nama_program} - #{buildKode(project)}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ProjectSelector;
