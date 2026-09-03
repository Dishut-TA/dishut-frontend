import React, { useState } from 'react';
import { HiOutlineCloudArrowUp, HiOutlinePaperAirplane } from 'react-icons/hi2';

const UpdateProgres: React.FC = () => {
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submit logic
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto pb-12 px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-greenAdmin p-8">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Update Progres Rehabilitasi
          </h1>
          <p className="text-sm text-gray-800/80 mt-2 leading-relaxed">
            Laporkan kemajuan berkala dari proyek rehabilitasi kelompok Anda agar para CSR dapat memantau perkembangan di lapangan secara transparan.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Pilih Proyek Rehabilitasi Berjalan
              </label>
              <select 
                required 
                defaultValue=""
                className="w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] bg-white cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
              >
                <option value="" disabled>-- Pilih Proyek Rehabilitasi --</option>
                <option value="1">Rehabilitasi Lahan Subang (CSR-001)</option>
                <option value="2">Reboisasi DAS Cimanuk (CSR-042)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Status Tahapan
              </label>
              <select 
                required 
                className="w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] bg-white cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
              >
                <option value="1">Tahapan 1: Persiapan Lahan</option>
                <option value="2">Tahapan 2: Penanaman Bibit</option>
                <option value="3">Tahapan 3: Pemeliharaan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Gambar Kegiatan
              </label>
              <div className="relative w-full">
                <input 
                  type="file" 
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-between w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span>Upload file</span>
                  <HiOutlineCloudArrowUp className="w-5 h-5 text-gray-800" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Keterangan
              </label>
              <textarea 
                required
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                maxLength={100}
                placeholder="Tambahkan keterangan pada kegiatan yang dilakukan.."
                className="w-full h-32 px-5 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] resize-none transition-all"
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400 font-medium">{keterangan.length}/100</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <HiOutlinePaperAirplane className="w-4 h-4" /> Kirim Laporan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgres;