import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineUser } from 'react-icons/hi2';

const DetailPenyuluh: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profil');

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header Page */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
          <h1 className="text-xl font-bold text-gray-800">Detail Penyuluh</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Profile Card Header */}
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            <HiOutlineUser className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-tight">IMAS ROHMAYATI, S.P., M.P.</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold border rounded-full bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]">Aktif</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Penyuluh Kehutanan Ahli Madya</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 md:px-8 border-b border-gray-100 gap-8">
          <button onClick={() => setActiveTab('Profil')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Profil' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Profil</button>
          <button onClick={() => setActiveTab('Riwayat')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Riwayat' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Riwayat Penugasan</button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'Profil' ? (
            <div className="flex flex-col gap-8 animate-in fade-in">
              
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">Profil Penyuluh</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">NIP</span><span className="font-bold text-gray-800 flex-1">198105152008012001</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Nama Lengkap</span><span className="font-bold text-gray-800 flex-1">IMAS ROHMAYATI, S.P., M.P.</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Jabatan</span><span className="font-bold text-gray-800 flex-1">Penyuluh Kehutanan Ahli Madya</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Unit Kerja</span><span className="font-bold text-gray-800 flex-1">Cabang Dinas Kehutanan Wilayah V Garut</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Status</span><span className="font-bold text-gray-800 flex-1">Aktif</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">No. HP</span><span className="font-bold text-gray-800 flex-1">0812-3456-7890</span></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Email</span><span className="font-bold text-gray-800 flex-1">imas.rohmayati@jabarprov.go.id</span></div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="w-40 text-gray-500 font-medium">Alamat</span><span className="font-bold text-gray-800 flex-1 leading-relaxed">Jl. Terusan Pahlawan No. 32,<br/>Garut, Jawa Barat</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">Ringkasan Penugasan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-center text-center shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">Total Penugasan</p><p className="text-2xl font-bold text-blue-600">12</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-center text-center shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">Selesai</p><p className="text-2xl font-bold text-[#185325]">8</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-center text-center shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">Berjalan</p><p className="text-2xl font-bold text-emerald-600">3</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-center text-center shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">Dibatalkan</p><p className="text-2xl font-bold text-red-500">1</p><p className="text-[10px] text-gray-400 font-medium mt-1">Program</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-sm font-bold text-gray-800">Riwayat Penugasan Terbaru</h3>
                  <button onClick={() => setActiveTab('Riwayat')} className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-3">
                    <p className="text-xs font-bold text-gray-700 flex-1">Rehabilitasi DAS Cimanuk</p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 w-16 text-center">Berjalan</span>
                      <span className="text-gray-500 font-medium w-20 text-right">10 Mei 2026</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-3">
                    <p className="text-xs font-bold text-gray-700 flex-1">Penanaman Lahan Kritis</p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] w-16 text-center">Selesai</span>
                      <span className="text-gray-500 font-medium w-20 text-right">20 Apr 2026</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-3">
                    <p className="text-xs font-bold text-gray-700 flex-1">Rehabilitasi Mangrove Karangsong</p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600 border border-blue-100 w-16 text-center">Monitoring</span>
                      <span className="text-gray-500 font-medium w-20 text-right">12 Apr 2026</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Semua Riwayat Penugasan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="text-[10px] font-bold text-[#3A4D3F] bg-[#DCECE0] border-y border-gray-100 uppercase tracking-wider">
                    <tr><th className="py-3 px-4">Nama Program</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Tanggal Dimulai</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    <tr className="hover:bg-gray-50"><td className="py-3 px-4 font-bold text-gray-700">Rehabilitasi DAS Cimanuk</td><td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px]">Berjalan</span></td><td className="py-3 px-4 text-right text-gray-500">10 Mei 2026</td></tr>
                    <tr className="hover:bg-gray-50"><td className="py-3 px-4 font-bold text-gray-700">Penanaman Lahan Kritis</td><td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded-full font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] text-[10px]">Selesai</span></td><td className="py-3 px-4 text-right text-gray-500">20 Apr 2026</td></tr>
                    <tr className="hover:bg-gray-50"><td className="py-3 px-4 font-bold text-gray-700">Rehabilitasi Mangrove Karangsong</td><td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600 border border-blue-100 text-[10px]">Monitoring</span></td><td className="py-3 px-4 text-right text-gray-500">12 Apr 2026</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPenyuluh;