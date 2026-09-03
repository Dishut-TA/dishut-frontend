import React from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

interface Props {
  onClose: () => void;
}

const TambahPenyuluhModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Tambah Penyuluh</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <HiOutlineXMark className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Informasi Penyuluh</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">NIP <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Masukkan NIP penyuluh" className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Masukkan nama lengkap" className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Jabatan <span className="text-red-500">*</span></label>
              <select className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white cursor-pointer"><option>Pilih jabatan</option></select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Unit Kerja <span className="text-red-500">*</span></label>
              <select className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white cursor-pointer"><option>Pilih unit kerja</option></select>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-700 block mb-2">No. HP</label>
            <input type="text" placeholder="Masukkan nomor handphone" className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-700 block mb-2">Email</label>
            <input type="email" placeholder="Masukkan email" className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div className="mb-5 relative">
            <label className="text-xs font-bold text-gray-700 block mb-2">Alamat</label>
            <textarea rows={3} placeholder="Masukkan alamat lengkap" className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
            <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400">0 / 255</span>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-3">Status <span className="text-red-500">*</span></label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" defaultChecked className="w-4 h-4 accent-emerald-600" />
                <span className="text-sm font-bold text-gray-800">Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" className="w-4 h-4 accent-emerald-600" />
                <span className="text-sm font-medium text-gray-600">Nonaktif</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Batal</button>
          <button className="px-6 py-2.5 bg-[#185325] text-white text-xs font-bold rounded-xl hover:bg-[#123d1c] transition-colors shadow-sm">Simpan Penyuluh</button>
        </div>

      </div>
    </div>
  );
};

export default TambahPenyuluhModal;