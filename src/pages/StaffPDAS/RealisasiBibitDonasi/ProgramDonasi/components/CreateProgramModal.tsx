import React, { useEffect, useState } from 'react';
import { HiOutlineXMark, HiOutlinePhoto } from 'react-icons/hi2';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BIBIT_OPTIONS = [
  'Mahoni', 'Sengon', 'Trembesi', 'Mangrove', 'Pucuk Merah', 'Beringin'
];

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ isOpen, onClose }) => {
  const [selectedBibit, setSelectedBibit] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedBibit([]);
      setSelectedImage(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (bibit: string) => {
    setSelectedBibit(prev => 
      prev.includes(bibit)
        ? prev.filter(item => item !== bibit) // Hapus jika sudah ada
        : [...prev, bibit] // Tambah jika belum ada
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Buat Program Baru
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          
          {/* 1. Upload Foto Field */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Foto Program / Lokasi
            </label>
            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-[#009262] transition-colors group overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-emerald-50 text-[#009262] rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <HiOutlinePhoto className="w-8 h-8" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-slate-700">
                    Klik untuk unggah foto
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG atau WEBP (Maks. 2MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* 2. Nama Program */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Nama Program
            </label>
            <input 
              type="text" 
              placeholder="Contoh: Penanaman Hutan..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all"
            />
          </div>
          
          {/* 3. Lahan Kritis (Select) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Pilih Lahan Kritis (Tervalidasi)
            </label>
            <select 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all cursor-pointer appearance-none"
              defaultValue=""
            >
              <option value="" disabled>-- Pilih Area Lahan --</option>
              <option value="blok1">Blok 1 Kertasari - 15.5 Ha (Proses Tanam)</option>
              <option value="cisurupan">Blok Cisurupan - 8 Ha (Survei)</option>
              <option value="ciliwung">Hulu Ciliwung Tugu - 12.2 Ha (Hijau)</option>
            </select>
          </div>

          {/* 4. Jenis Bibit (Checkboxes) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              Jenis Bibit <span className="text-slate-400 font-normal">(Dapat pilih lebih dari satu)</span>
            </label>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {BIBIT_OPTIONS.map((bibit) => (
                <label key={bibit} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer w-5 h-5 border-2 border-slate-300 rounded text-[#009262] focus:ring-[#009262]/20 focus:ring-offset-0 cursor-pointer transition-all"
                      checked={selectedBibit.includes(bibit)}
                      onChange={() => handleCheckboxChange(bibit)}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {bibit}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors active:scale-95"
          >
            Batal
          </button>
          <button 
            type="button"
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#185325] hover:bg-[#123d1c] text-white font-bold text-sm transition-all shadow-md shadow-[#185325]/20 active:scale-95"
          >
            Ajukan Program
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProgramModal;