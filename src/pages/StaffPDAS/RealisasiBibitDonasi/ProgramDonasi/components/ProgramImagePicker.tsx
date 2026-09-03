import React, { useRef, useState } from 'react';
import { HiOutlinePhoto } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import ZoomableImagePreview from './ZoomableImagePreview';

interface ProgramImagePickerProps {
  onImageSelected: (file: File | null) => void;
}

const ProgramImagePicker: React.FC<ProgramImagePickerProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 2MB");
        return;
      }

      setPreview(URL.createObjectURL(file));
      onImageSelected(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-base font-bold text-slate-800 mb-3">
        Foto Program / Lokasi <span className="text-red-500">*</span>
      </label>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
      
      {preview ? (
        <ZoomableImagePreview src={preview} onClear={clearImage} onChangeClick={triggerFileInput} />
      ) : (
        <div onClick={triggerFileInput} className="relative flex flex-col items-center justify-center w-full h-56 md:h-72 border-2 border-slate-200 border-dashed rounded-4xl cursor-pointer hover:bg-emerald-50 hover:border-[#009262] transition-colors group overflow-hidden bg-slate-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-4 bg-white shadow-sm border border-slate-100 text-[#009262] rounded-full mb-4 group-hover:scale-110 transition-transform">
              <HiOutlinePhoto className="w-10 h-10" />
            </div>
            <p className="mb-2 text-base font-bold text-slate-700">Klik untuk mengunggah foto</p>
            <p className="text-sm text-slate-500">Mendukung format PNG, JPG, atau WEBP (Maks. 2MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramImagePicker;