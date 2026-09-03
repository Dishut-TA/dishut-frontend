import React, { useState } from 'react';
import ProjectSelector from './components/ProjectSelector';
import TimelineStep, { type StepData } from './components/TimelineStep';

const mockTimelineData: StepData[] = [
  { id: 1, title: 'Tahap 1: Persiapan Lahan', status: 'Selesai', description: 'Deskripsi Kegiatan' },
  { id: 2, title: 'Tahap 2: Pembibitan & Penanaman', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
  { id: 3, title: 'Tahap 3: Perawatan Pemeliharaan', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
  { id: 4, title: 'Tahap 4: Rehabilitasi Selesai', status: 'Belum Mulai', description: 'Deskripsi Kegiatan' },
];

const MonitoringProyek: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('CSR001');

  return (
    <div className="flex flex-col w-full mx-auto pb-12">
      
      <ProjectSelector 
        selectedProject={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800">Timeline Tahapan Proyek Rehabilitasi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Progress fisik reboisasi berdasarkan verifikasi laporan di sistem.
          </p>
        </div>

        <div className="flex flex-col">
          {mockTimelineData.map((step, index) => (
            <TimelineStep 
              key={step.id} 
              step={step} 
              isLast={index === mockTimelineData.length - 1} 
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default MonitoringProyek;