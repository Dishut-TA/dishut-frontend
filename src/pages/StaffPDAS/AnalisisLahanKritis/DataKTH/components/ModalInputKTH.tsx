import React, { useState, useRef, useEffect } from 'react';
import { HiXMark, HiOutlineDocumentArrowUp, HiOutlineDocumentText } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createKthAPI, updateKthAPI, importKthExcelAPI, type KthResponseData } from '@/services/kth.service'; 

interface ModalInputKTHProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kthToEdit?: KthResponseData | null;
}

const ModalInputKTH: React.FC<ModalInputKTHProps> = ({ isOpen, onClose, onSuccess, kthToEdit }) => {
  const isEditMode = Boolean(kthToEdit);
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>('excel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    cdk: '',
    kabupaten_kota: '',
    kecamatan: '',
    desa_kelurahan: '',
    nama: '',
    ketua: '',
    jenis_usaha: ''
  });

  useEffect(() => {
    if (kthToEdit) {
      setInputMode('manual');
      setFormData({
        cdk: kthToEdit.cdk || '',
        kabupaten_kota: kthToEdit.kabupaten_kota || '',
        kecamatan: kthToEdit.kecamatan || '',
        desa_kelurahan: kthToEdit.desa_kelurahan || '',
        nama: kthToEdit.nama || '',
        ketua: kthToEdit.ketua || '',
        jenis_usaha: kthToEdit.jenis_usaha || ''
      });
    } else {
      setInputMode('excel');
      setFormData({
        cdk: '',
        kabupaten_kota: '',
        kecamatan: '',
        desa_kelurahan: '',
        nama: '',
        ketua: '',
        jenis_usaha: ''
      });
      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [kthToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditMode ? 'Memperbarui data KTH...' : 'Memproses data KTH...');

    try {
      if (isEditMode && kthToEdit) {
        if (!formData.cdk || !formData.nama || !formData.ketua) {
          throw new Error('Mohon lengkapi field wajib pada form!');
        }
        await updateKthAPI(kthToEdit.id, formData);
        toast.success('Data KTH berhasil diperbarui!', { id: loadingToast });
      } else if (inputMode === 'excel') {
        if (!excelFile) throw new Error('Pilih file Excel terlebih dahulu!');
        await importKthExcelAPI(excelFile);
        toast.success('Data KTH berhasil diimpor dari Excel!', { id: loadingToast });
      } else {
        if (!formData.cdk || !formData.nama || !formData.ketua) {
          throw new Error('Mohon lengkapi field wajib pada form!');
        }
        await createKthAPI(formData);
        toast.success('Data KTH berhasil ditambahkan!', { id: loadingToast });
      }

      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFormData({
        cdk: '', kabupaten_kota: '', kecamatan: '', desa_kelurahan: '', nama: '', ketua: '', jenis_usaha: ''
      });
      onSuccess();
      onClose();

    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'Edit Data KTH' : 'Input Data KTH'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isEditMode ? 'Perbarui informasi kelompok tani hutan.' : 'Pilih metode pengisian data yang diinginkan.'}
            </p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90">
            <HiXMark className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!isEditMode && (
            <div className="relative flex bg-gray-100/80 p-1.5 rounded-full mb-8 shadow-inner">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#185325] shadow-md rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  inputMode === 'excel' ? 'translate-x-0' : 'translate-x-full'
                }`}
              ></div>

              <button
                type="button"
                onClick={() => setInputMode('excel')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-full transition-colors duration-300 ${
                  inputMode === 'excel' ? 'text-white' : 'text-[#185325] hover:text-[#0e3316]'
                }`}
              >
                <HiOutlineDocumentArrowUp className="w-4 h-4 stroke-2" /> Upload Excel
              </button>

              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-full transition-colors duration-300 ${
                  inputMode === 'manual' ? 'text-white' : 'text-[#185325] hover:text-[#0e3316]'
                }`}
              >
                <HiOutlineDocumentText className="w-4 h-4 stroke-2" /> Input Manual
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            {!isEditMode && (
              <div className={`grid transition-all duration-500 ease-in-out ${inputMode === 'excel' ? 'grid-rows-[1fr] opacity-100 translate-x-0 scale-100' : 'grid-rows-[0fr] opacity-0 -translate-x-4 scale-95 pointer-events-none absolute inset-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-6 border-2 border-dashed border-[#185325]/30 bg-[#f8fbf9] rounded-2xl text-center group hover:border-[#185325] transition-colors duration-300">
                    <div className="w-12 h-12 bg-[#EBF8F1] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineDocumentArrowUp className="w-6 h-6 text-[#185325]" />
                    </div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Pilih Dokumen Excel</label>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileChange}
                      required={!isEditMode && inputMode === 'excel'}
                      tabIndex={inputMode === 'excel' ? 0 : -1}
                      className="w-full max-w-62.5 mx-auto block text-xs text-gray-600 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:rounded-full file:bg-[#185325] file:text-white hover:file:bg-[#123d1c] file:transition-colors file:cursor-pointer" 
                    />
                    <p className="text-[10px] text-gray-500 mt-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
                      *Gunakan template Excel KTH yang sudah disediakan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className={`grid transition-all duration-500 ease-in-out ${isEditMode || inputMode === 'manual' ? 'grid-rows-[1fr] opacity-100 translate-x-0 scale-100' : 'grid-rows-[0fr] opacity-0 translate-x-4 scale-95 pointer-events-none absolute inset-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-4 p-1">
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Cabang Dinas Kehutanan <span className="text-red-500">*</span></label>
                    <select 
                      name="cdk" 
                      value={formData.cdk} 
                      onChange={handleInputChange} 
                      required={isEditMode || inputMode === 'manual'} 
                      tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all cursor-pointer"
                    >
                      <option value="">-- Pilih CDK --</option>
                      <option value="CDK WILAYAH I">CDK WILAYAH I</option>
                      <option value="CDK WILAYAH II">CDK WILAYAH II</option>
                      <option value="CDK WILAYAH III">CDK WILAYAH III</option>
                      <option value="CDK WILAYAH IV">CDK WILAYAH IV</option>
                      <option value="CDK WILAYAH V">CDK WILAYAH V</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Kabupaten/Kota</label>
                      <input 
                        name="kabupaten_kota" 
                        value={formData.kabupaten_kota} 
                        onChange={handleInputChange} 
                        placeholder="Kab. Bandung" 
                        tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Kecamatan</label>
                      <input 
                        name="kecamatan" 
                        value={formData.kecamatan} 
                        onChange={handleInputChange} 
                        placeholder="Kecamatan" 
                        tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Desa/Kelurahan</label>
                    <input 
                      name="desa_kelurahan" 
                      value={formData.desa_kelurahan} 
                      onChange={handleInputChange} 
                      placeholder="Desa/Kelurahan" 
                      tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Nama Kelompok & Ketua <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <input 
                        name="nama" 
                        value={formData.nama} 
                        onChange={handleInputChange} 
                        tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                        type="text" 
                        placeholder="Nama KTH" 
                        required={isEditMode || inputMode === 'manual'} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                      />
                      <input 
                        name="ketua" 
                        value={formData.ketua} 
                        onChange={handleInputChange} 
                        tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                        type="text" 
                        placeholder="Nama Ketua" 
                        required={isEditMode || inputMode === 'manual'} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Jenis Usaha</label>
                    <select 
                      name="jenis_usaha" 
                      value={formData.jenis_usaha} 
                      onChange={handleInputChange} 
                      tabIndex={isEditMode || inputMode === 'manual' ? 0 : -1} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all cursor-pointer"
                    >
                      <option value="">-- Pilih Jenis Usaha --</option>
                      <option value="Agroforestri">Agroforestri</option>
                      <option value="Silvopastura">Silvopastura</option>
                      <option value="Silvofishery">Silvofishery</option>
                      <option value="Jasa Lingkungan">Jasa Lingkungan / Ekowisata</option>
                      {formData.jenis_usaha && !['Agroforestri', 'Silvopastura', 'Silvofishery', 'Jasa Lingkungan', ''].includes(formData.jenis_usaha) && (
                        <option value={formData.jenis_usaha}>{formData.jenis_usaha}</option>
                      )}
                    </select>
                  </div>

                </div>
              </div>
            </div>

            <div className={`pt-6 border-t border-gray-100 ${isEditMode || inputMode === 'manual' ? 'mt-4' : 'mt-12'}`}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#185325] hover:bg-[#123d1c] text-white py-3.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : null}
                {isSubmitting 
                  ? 'Memproses...' 
                  : isEditMode 
                    ? 'Simpan Perubahan' 
                    : `Submit Data ${inputMode === 'excel' ? 'Excel' : 'Manual'}`
                }
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalInputKTH;