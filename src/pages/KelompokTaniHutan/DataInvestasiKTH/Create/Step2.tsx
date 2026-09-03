import React, { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineChevronUp, HiOutlinePlus, HiXMark, HiOutlineCalendarDays, HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import type { InvestasiFormState } from './index';

interface StepProps {
  data: InvestasiFormState;
  updateData: React.Dispatch<React.SetStateAction<InvestasiFormState>>;
  onNext: () => void;
  onPrev: () => void;
}

const Step2: React.FC<StepProps> = ({ data, updateData, onNext, onPrev }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Menyimpan ID milestone yang sedang diedit
  const [newMilestone, setNewMilestone] = useState({ nama: '', batas: '', deskripsi: '' });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewMilestone({ nama: '', batas: '', deskripsi: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (m: { id: number; nama: string; batas: string; deskripsi: string }) => {
    setEditingId(m.id);
    setNewMilestone({ nama: m.nama, batas: m.batas, deskripsi: m.deskripsi });
    setIsModalOpen(true);
  };

  const handleSaveMilestone = () => {
    if (!newMilestone.nama || !newMilestone.batas) return;

    if (editingId !== null) {
      // Mode Edit: Update milestone yang sudah ada
      const updatedMilestones = data.milestones.map(m => 
        m.id === editingId ? { ...m, ...newMilestone } : m
      );
      updateData({ ...data, milestones: updatedMilestones });
    } else {
      // Mode Tambah: Buat milestone baru
      const newId = data.milestones.length ? Math.max(...data.milestones.map(m => m.id)) + 1 : 1;
      updateData({ ...data, milestones: [...data.milestones, { ...newMilestone, id: newId }] });
    }

    setNewMilestone({ nama: '', batas: '', deskripsi: '' }); 
    setEditingId(null);
    setIsModalOpen(false); 
  };

  const removeMilestone = (id: number) => {
    updateData({ ...data, milestones: data.milestones.filter(m => m.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        {data.milestones.map((m) => (
          <div key={m.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col gap-3 relative">
            <div className="pr-12">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">Nama Milestone</p>
              <p className="text-base font-bold text-gray-800">{m.nama}</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-gray-500">Batas Milestone</span>
              <span className="text-gray-800">{m.batas}</span>
            </div>
            
            <div className="absolute top-5 right-5 flex gap-3">
              <button onClick={() => handleOpenEditModal(m)} className="text-gray-400 hover:text-[#185325] transition-colors cursor-pointer" title="Edit Milestone">
                <HiOutlinePencil className="w-4.5 h-4.5" />
              </button>
              <button onClick={() => removeMilestone(m.id)} className="text-[#FF5C5C] hover:text-red-700 transition-colors cursor-pointer" title="Hapus Milestone">
                <HiOutlineTrash className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <button className="mx-auto mt-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <HiOutlineChevronUp className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-[#185325] hover:opacity-85 transition-opacity cursor-pointer">
        Tambah Milestone <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} />
      </button>

      <div className="flex gap-4 mt-6">
        <button onClick={onPrev} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-[#185325] text-[#185325] hover:bg-gray-50 text-sm font-bold rounded-full transition-colors cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm cursor-pointer">
          Selanjutnya <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#f8fbf9] w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="relative p-6 text-center border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#185325]">{editingId !== null ? 'Edit Milestone' : 'Buat Milestone'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-full p-1 shadow-sm cursor-pointer">
                <HiXMark className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Milestone</label>
                <input 
                  type="text" 
                  placeholder="Masukan nama milestone" 
                  value={newMilestone.nama} 
                  onChange={(e) => setNewMilestone({...newMilestone, nama: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#185325]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Batas Milestone (Harus setelah hari ini)</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={newMilestone.batas} 
                    onChange={(e) => setNewMilestone({...newMilestone, batas: e.target.value})}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#185325]"
                  />
                  <HiOutlineCalendarDays className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Deskripsi</label>
                <textarea 
                  placeholder="Tulis keterangan milestone..." 
                  value={newMilestone.deskripsi} 
                  onChange={(e) => setNewMilestone({...newMilestone, deskripsi: e.target.value})}
                  className="w-full h-28 px-4 py-3 border border-gray-300 rounded-3xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] resize-none"
                />
              </div>

              <button onClick={handleSaveMilestone} className="w-full mt-4 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm cursor-pointer">
                {editingId !== null ? 'Simpan Perubahan' : 'Tambah Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;