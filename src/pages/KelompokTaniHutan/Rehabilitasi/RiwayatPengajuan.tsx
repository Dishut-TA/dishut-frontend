import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineEye } from 'react-icons/hi2';

interface RiwayatCSR {
  id: string;
  judulUsaha: string;
  estimasiDana: string;
  status: string;
}

const RiwayatPengajuan: React.FC = () => {
  const navigate = useNavigate();

  const [data] = useState<RiwayatCSR[]>([
    {
      id: '#PROP-09-042',
      judulUsaha: 'Rehabilitasi Hutan Gunung Gede',
      estimasiDana: 'Rp 80.000.000',
      status: 'Menunggu Verifikasi'
    }
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Pengajuan Pendanaan CSR</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar usulan program rehabilitasi pendanaan mitra</p>
        </div>
        
        {data.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari Proposal..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#185325]"
              />
            </div>
            <button 
              onClick={() => navigate('/admin/kth/rehabilitasi/ajukan')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} /> Ajukan Pendanaan CSR
            </button>
          </div>
        )}
      </div>

      {data.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-200">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap w-32">ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Judul Usaha</th>
                  <th className="px-6 py-4 whitespace-nowrap">Estimasi Dana</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">{item.judulUsaha}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#185325] whitespace-nowrap">{item.estimasiDana}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold border border-gray-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-[#185325] hover:underline">
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 mt-2 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#f0f9f3] rounded-full flex items-center justify-center mb-4">
            <HiOutlineDocumentText className="w-8 h-8 text-[#185325]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tidak ada berkas yang dikirim</h3>
          <p className="text-sm text-gray-500 mb-6">
            Anda belum mengirim usulan baru untuk pengajuan pendanaan CSR
          </p>
          <button 
            onClick={() => navigate('/admin/kth/rehabilitasi/ajukan')}
            className="flex items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm active:scale-95"
          >
            <HiOutlinePlus className="w-4 h-4" strokeWidth={2.5} /> Ajukan Pendanaan CSR
          </button>
        </div>
      )}
    </div>
  );
};

export default RiwayatPengajuan;