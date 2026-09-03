import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineDocumentText } from 'react-icons/hi2';

const mockTugasMasuk = [
  { id: 'TGS-001', noSurat: 'ST.76/TKTRH/B/03/2026', perusahaan: 'PT. Jawa Satu Power', luas: 29.78, lokasi: 'Desa Sudalarang, Kec. Sukawening', tenggat: '2026-03-20' },
];

const StaffTugasEvaluasi: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineBriefcase className="w-6 h-6 text-[#185325]" />
          <h1 className="text-2xl font-bold text-gray-800">Tugas Evaluasi Lapangan</h1>
        </div>
        <p className="text-sm text-gray-500">Daftar penugasan evaluasi tanaman dari Kepala Bidang PDAS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTugasMasuk.map((tugas) => (
          <div key={tugas.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#f0f9f3] flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#185325] uppercase tracking-wider block mb-1">Instruksi Kementerian</span>
                <h3 className="font-bold text-gray-800">{tugas.noSurat}</h3>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">Tenggat: {tugas.tenggat}</span>
            </div>
            <div className="p-5 space-y-4 flex-1">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-1">Pemegang Izin</span>
                <p className="font-bold text-gray-800 text-lg">{tugas.perusahaan}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-1">Lokasi Lahan</span>
                <p className="text-sm text-gray-600 font-medium">{tugas.lokasi} <span className="text-[#185325] font-bold">({tugas.luas} Ha)</span></p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => navigate('/admin/staff/evaluasi/create')} // Route diarahkan ke Create Evaluasi
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl transition-all shadow-md"
              >
                <HiOutlineDocumentText className="w-5 h-5" /> Buat Laporan BAP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTugasEvaluasi;