import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlinePaperAirplane, HiOutlineCloud } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CreateLaporanDana: React.FC = () => {
  const navigate = useNavigate();
  const [pengeluaranList, setPengeluaranList] = useState([{ id: 1, kategori: '', nominal: '', bukti: null }]);

  const handleAddBaris = () => {
    setPengeluaranList([...pengeluaranList, { id: Date.now(), kategori: '', nominal: '', bukti: null }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Laporan dana berhasil dikirim!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12 px-4 sm:px-0">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 transition-colors self-start hover:text-[#185325]"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-10">
          Laporan Penggunaan Dana
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Pilih Proyek Rehabilitasi Berjalan</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer appearance-none">
              <option>Rehabilitasi Citarum #CSR-001</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tanggal Pengeluaran</label>
            <input 
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tahapan Laporan</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer appearance-none">
              <option>Tahap 1</option>
              <option>Tahap 2</option>
            </select>
          </div>

          <div className="pt-6">
            <label className="block text-sm font-bold text-gray-800 mb-4">Rincian Penggunaan Anggaran</label>
            <div className="grid grid-cols-12 gap-4 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-300 pb-3 mb-3">
              <div className="col-span-5">Kategori Pengeluaran</div>
              <div className="col-span-5">Nominal</div>
              <div className="col-span-2 text-center">Bukti Transaksi</div>
            </div>

            {pengeluaranList.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 mb-3 items-center">
                <div className="col-span-5">
                  <input 
                    type="text" 
                    placeholder="Pembersihan Lahan" 
                    className="w-full text-sm border-b border-gray-200 pb-2 focus:outline-none focus:border-[#185325] text-gray-800 font-semibold"
                  />
                </div>
                
                <div className="col-span-5 flex items-center text-sm border-b border-gray-200 pb-2 focus-within:border-[#185325]">
                  <span className="text-gray-600 mr-2">Rp.</span>
                  <input 
                    type="number" 
                    placeholder="8.000.000" 
                    className="w-full outline-none text-gray-800 font-semibold"
                  />
                </div>
                
                <div className="col-span-2 flex justify-center border-b border-gray-200 pb-2">
                  <label className="cursor-pointer text-gray-500 hover:text-[#185325] transition-colors">
                    <HiOutlineCloud className="w-6 h-6" />
                    <input type="file" className="hidden" />
                  </label>
                </div>

              </div>
            ))}

            <button 
              type="button" 
              onClick={handleAddBaris}
              className="text-xs font-medium text-gray-400 mt-2 hover:text-[#185325] transition-colors"
            >
              + Tambah baris pengeluaran
            </button>
          </div>

          <div className="bg-[#DCECE0]/70 rounded-xl p-6 md:p-8 mt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Ringkasan Saldo</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[140px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Dana Disalurkan</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">Rp 100.000.000</span>
              </div>
              <div className="grid grid-cols-[140px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Total Realisasi</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">Rp 20.000.000</span>
              </div>
              <div className="grid grid-cols-[140px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Sisa Dana</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">Rp 80.000.000</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm w-full md:w-auto cursor-pointer"
            >
              <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45 mb-1" /> Kirim Laporan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateLaporanDana;