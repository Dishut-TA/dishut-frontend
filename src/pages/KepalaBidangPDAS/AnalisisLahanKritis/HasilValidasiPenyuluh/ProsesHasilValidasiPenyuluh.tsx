import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiExclamationCircle, HiOutlineXMark, HiOutlineCheck, HiXCircle, HiOutlineShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ProsesValidasiPenyuluh: React.FC = () => {
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    toast.success(`Berhasil! Tindakan: ${action}`);
    navigate(-1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Validasi Hasil Penyuluh</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* BAGIAN CHECKLIST (STEPPER) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-sm font-bold text-gray-800 mb-6">Checklist Validasi</h3>
          
          <div className="relative flex flex-col gap-6">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-[#185325] via-yellow-400 to-gray-200 z-0"></div>
            
            {[
              { label: 'Kelengkapan Data', status: 'ok' },
              { label: 'Kesesuaian Koordinat', status: 'ok' },
              { label: 'Kesesuaian Luas', status: 'warn' },
              { label: 'Dokumentasi Foto', status: 'ok' },
              { label: 'Catatan Lapangan', status: 'ok' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex items-center gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-transform group-hover:scale-110 
                  ${step.status === 'ok' ? 'bg-[#185325] text-white' : 'bg-yellow-500 text-white'}`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 font-bold text-sm text-gray-700 flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                  {step.label}
                  {step.status === 'ok' ? (
                    <HiCheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiExclamationCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN TABEL PERBANDINGAN */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-800">Perbandingan Data Awal vs Hasil Lapangan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#DCECE0]/50 text-[#3A4D3F] text-xs">
                  <tr>
                    <th className="px-5 py-4 font-bold">Aspek</th>
                    <th className="px-5 py-4 font-bold">Data Awal</th>
                    <th className="px-5 py-4 font-bold">Hasil Lapangan</th>
                    <th className="px-5 py-4 font-bold text-center">Kesesuaian</th>
                    <th className="px-5 py-4 font-bold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">Koordinat</td>
                    <td className="px-5 py-4 text-gray-600">2.345678° S,<br/>138.765432° E</td>
                    <td className="px-5 py-4 text-gray-600">2.346123° S,<br/>138.766210° E</td>
                    <td className="px-5 py-4 text-center"><HiXCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="px-5 py-4 text-gray-600">Selisih 93 m</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">Luas Lahan</td>
                    <td className="px-5 py-4 text-gray-600">125,50 Ha</td>
                    <td className="px-5 py-4 text-gray-600">118,40 Ha</td>
                    <td className="px-5 py-4 text-center"><HiXCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="px-5 py-4 text-gray-600">Selisih 7,10 Ha (5,66%)</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">Status Kekritisan</td>
                    <td className="px-5 py-4 text-gray-600">Kritis</td>
                    <td className="px-5 py-4 text-gray-600">Kritis</td>
                    <td className="px-5 py-4 text-center"><HiCheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-5 py-4 text-gray-600">Sesuai</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">Akses Lokasi</td>
                    <td className="px-5 py-4 text-gray-600">Sedang</td>
                    <td className="px-5 py-4 text-gray-600">Sulit</td>
                    <td className="px-5 py-4 text-center"><HiXCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="px-5 py-4 text-gray-600">Perlu dicatat</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">Kondisi Lahan</td>
                    <td className="px-5 py-4 text-gray-600">Erosi ringan</td>
                    <td className="px-5 py-4 text-gray-600">Erosi ringan</td>
                    <td className="px-5 py-4 text-center"><HiCheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-5 py-4 text-gray-600">Sesuai</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR (UI/UX yang diperbarui) */}
      <div className="bg-white rounded-2xl p-5 md:px-8 md:py-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-4 text-left w-full md:w-auto">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-full hidden sm:block">
            <HiOutlineShieldCheck className="w-6 h-6 stroke-2" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Keputusan Validasi</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Pastikan Anda telah memeriksa kesesuaian data lapangan secara menyeluruh sebelum mengambil keputusan.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => handleAction('Validasi Tidak Layak')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold text-sm rounded-full transition-all active:scale-95 whitespace-nowrap"
          >
            <HiOutlineXMark className="w-4 h-4 stroke-2" /> Validasi Tidak Layak
          </button>
          <button 
            onClick={() => handleAction('Validasi Sebagai Layak')}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            <HiOutlineCheck className="w-5 h-5 stroke-2" /> Validasi Layak
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProsesValidasiPenyuluh;