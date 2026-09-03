import React from 'react';
import { HiOutlineCloud, HiOutlineArrowRight, HiOutlineArrowLeft, HiDocumentText, HiXMark, HiEye, HiPlus } from 'react-icons/hi2';
import type { InvestasiFormState } from './index';

interface StepProps {
  data: InvestasiFormState;
  updateData: React.Dispatch<React.SetStateAction<InvestasiFormState>>;
  onNext: () => void;
  onPrev?: () => void;
}

const Step3: React.FC<StepProps> = ({ data, updateData, onNext, onPrev }) => {
  const handleFileChange = (index: number, file: File | null) => {
    const newDokumen = [...data.dokumen];
    newDokumen[index].file = file;
    updateData({ ...data, dokumen: newDokumen });
  };

  const handleNameChange = (index: number, name: string) => {
    const newDokumen = [...data.dokumen];
    newDokumen[index].name = name;
    updateData({ ...data, dokumen: newDokumen });
  };

  const addDokumen = () => {
    updateData({
      ...data,
      dokumen: [...data.dokumen, { name: 'Dokumen Tambahan', file: null, isRequired: false }]
    });
  };

  const removeDokumen = (index: number) => {
    const newDokumen = [...data.dokumen];
    newDokumen.splice(index, 1);
    updateData({ ...data, dokumen: newDokumen });
  };

  const previewDocument = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <p className="text-xs text-gray-500 mb-2 font-medium">Unggah dokumen pendukung investasi dalam format PDF:</p>
      
      {data.dokumen.map((doc, idx) => {
        return (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              {doc.isRequired ? (
                <label className="block text-xs font-bold text-gray-700">{doc.name} <span className="text-red-500">*</span></label>
              ) : (
                <div className="flex-1 mr-4">
                   <input
                     type="text"
                     value={doc.name}
                     onChange={(e) => handleNameChange(idx, e.target.value)}
                     className="w-full text-xs font-bold text-gray-700 bg-transparent border-b border-gray-300 focus:border-[#185325] outline-none py-1"
                     placeholder="Nama Dokumen..."
                   />
                </div>
              )}
              {!doc.isRequired && (
                 <button onClick={() => removeDokumen(idx)} className="text-xs text-red-500 hover:text-red-700 font-bold">Hapus</button>
              )}
            </div>
            
            {doc.file ? (
              <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-full bg-gray-50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <HiDocumentText className="w-5 h-5 text-[#185325] shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">{doc.file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => previewDocument(doc.file!)}
                    className="p-1 text-gray-500 hover:text-[#185325] rounded-full cursor-pointer"
                    title="Preview Dokumen"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleFileChange(idx, null)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full cursor-pointer"
                    title="Hapus File"
                  >
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-between w-full px-4 py-3 border border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-400">Upload file PDF</span>
                <HiOutlineCloud className="w-5 h-5 text-gray-600" />
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleFileChange(idx, e.target.files[0])} 
                />
              </label>
            )}
          </div>
        );
      })}

      <button
        onClick={addDokumen}
        className="mt-2 flex items-center gap-2 text-sm font-bold text-[#185325] hover:text-[#123d1c] transition-colors"
      >
        <HiPlus className="w-4 h-4" /> Tambah Dokumen Lain
      </button>

      <div className="flex gap-4 mt-6">
        <button onClick={onPrev} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-[#185325] text-[#185325] hover:bg-gray-50 text-sm font-bold rounded-full transition-colors cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm cursor-pointer">
          Selanjutnya <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3;