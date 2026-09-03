import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrsAPI } from '@/services/program-csr.service';

const TinjauProposal: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProgramCsrsAPI();
        // const filtered = response.filter((item: any) => item.status === 'Mencari Mitra CSR');
        setData(response);
      } catch (error: any) {
        toast.error("Gagal memuat daftar proposal rekomendasi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(Number(angka || 0));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-bold text-gray-800">
            Rekomendasi Proposal Kehutanan Dinas
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Kepala Dinas Kehutanan PDAS merekomendasikan proposal reboisasi kritis berikut untuk didanai melalui kemitraan CSR perusahaan Anda.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-[#185325] font-bold">
          <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3 border-[#185325]"></span> Memuat data...
        </div>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto w-full mt-2">
          <table className="w-full text-left border-collapse min-w-225 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">NAMA PROGRAM</th>
                <th className="px-6 py-4 whitespace-nowrap">KTH</th>
                <th className="px-6 py-4 whitespace-nowrap">ANGGARAN DIAJUKAN</th>
                <th className="px-6 py-4 whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">AKSI</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200/60 bg-transparent">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">
                        P-CSR-{new Date(item.created_at).getFullYear()}-{String(item.id).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">{item.nama_program}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                    {item.kth?.nama || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {formatRupiah(item.anggaran)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {item.status}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/admin/csr/tinjau-proposal/detail/${item.id}`)}
                      className="flex items-center gap-2 px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95 cursor-pointer"
                    >
                      Tinjau Berkas <HiOutlineArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 mt-2 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-[#f0f9f3] rounded-full flex items-center justify-center mb-4">
            <HiOutlineCheckCircle className="w-6 h-6 text-[#185325]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Selesai Ditinjau</h3>
          <p className="text-sm text-gray-500 mb-6">
            Tidak ada proposal baru yang membutuhkan pendanaan saat ini.
          </p>
          <button 
            onClick={() => navigate('/admin/csr/dashboard')}
            className="flex items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            Kembali ke Dashboard <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default TinjauProposal;