import React, { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineClock } from 'react-icons/hi2';

interface Milestone {
  id: number;
  nama: string;
  batas: string;
  status: 'Tercapai' | 'Belum Dimulai';
  dokumen: string;
  deskripsi: string;
}

interface MilestoneSectionProps {
  milestones: Milestone[];
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ milestones }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedMilestones = isExpanded ? milestones : milestones.slice(0, 2);
  const hasMore = milestones.length > 2;

  const renderMilestone = (m: Milestone) => (
    <div key={m.id} className="mb-8 last:mb-0 text-sm">
      <div className="flex mb-2">
        <span className="w-40 shrink-0 text-gray-500">Nama Milestone</span>
        <span className="w-4 shrink-0">:</span>
        <span className="font-bold text-gray-800">{m.nama}</span>
      </div>
      <div className="flex mb-2">
        <span className="w-40 shrink-0 text-gray-500">Batas Milestone</span>
        <span className="w-4 shrink-0">:</span>
        <span className="text-gray-800">{m.batas}</span>
      </div>
      <div className="flex mb-2">
        <span className="w-40 shrink-0 text-gray-500">Status</span>
        <span className="w-4 shrink-0">:</span>
        <span
          className={`font-bold flex items-center gap-1 ${m.status === "Tercapai"
              ? "text-[#185325]"
              : "text-gray-500"
            }`}
        >
          {m.status}
          {m.status === "Tercapai" ? (
            <HiOutlineCheckCircle className="w-4 h-4" />
          ) : (
            <HiOutlineClock className="w-4 h-4" />

          )}
        </span>
      </div>
      <div className="flex mb-2">
        <span className="w-40 shrink-0 text-gray-500">Dokumen Milestone</span>
        <span className="w-4 shrink-0">:</span>
        <span className={m.dokumen !== '-' ? 'font-bold underline text-gray-800 cursor-pointer' : 'text-gray-800'}>
          {m.dokumen}
        </span>
      </div>
      <div className="flex">
        <span className="w-40 shrink-0 text-gray-500">Deskripsi</span>
        <span className="w-4 shrink-0">:</span>
        <span className="text-gray-500 text-justify leading-relaxed">{m.deskripsi}</span>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <h3 className="font-bold text-gray-800 mb-4">Milestone</h3>

      <div>{displayedMilestones.slice(0, 2).map(renderMilestone)}</div>

      {hasMore && (
        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            {milestones.slice(2).map(renderMilestone)}
          </div>
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg transition-colors border border-gray-200"
        >
          {isExpanded ? (
            <>Tutup Milestone <HiOutlineChevronUp className="w-4 h-4" /></>
          ) : (
            <>Lihat Milestone Lainnya ({milestones.length - 2}) <HiOutlineChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
};

export default MilestoneSection;