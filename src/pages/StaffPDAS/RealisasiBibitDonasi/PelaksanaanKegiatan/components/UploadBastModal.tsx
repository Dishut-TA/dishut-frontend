import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineXMark, HiOutlineCloudArrowUp } from 'react-icons/hi2';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UploadBastModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationId: number | null;
}

const UploadBastModal: React.FC<UploadBastModalProps> = ({ isOpen, onClose, donationId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    if (!isOpen) setFile(null); 
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !donationId) return;

    const formData = new FormData();
    formData.append('bast_file', file);
    
    formData.append('seed_status', 'Disalurkan');
    formData.append('_method', 'PUT'); 

    setIsLoading(true);
    const toastId = toast.loading('Mengunggah dokumen BAST...');
    const API_URL = import.meta.env.VITE_API_EXAMPLE;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/donations/${donationId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success('BAST berhasil diunggah dan status diperbarui!', { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah BAST', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-112.5 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-gray-800">Upload BAST</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#A5D6A7] bg-[#F4FFF6] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8F5E9] transition-colors"
          >
            <HiOutlineCloudArrowUp className="w-10 h-10 text-[#2E7D32] mb-3" />
            <p className="text-sm font-semibold text-[#2E7D32] text-center">
              {file ? file.name : 'Klik di sini untuk upload file PDF/Image'}
            </p>
            {!file && <p className="text-xs text-gray-500 mt-1">Maksimal ukuran file 5MB</p>}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </div>

          <button 
            disabled={!file || isLoading}
            onClick={handleUpload}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
              file && !isLoading ? 'bg-[#185325] hover:bg-[#144a18] text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Dokumen'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadBastModal;