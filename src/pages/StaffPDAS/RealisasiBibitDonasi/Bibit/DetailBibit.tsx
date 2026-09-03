import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineCheckBadge } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { 
  getBibitByIdAPI, 
  getSeedSpecificationsAPI, 
  type BibitResponseData, 
  type SeedSpecResponseData 
} from '@/services/bibit.service';

const formatRupiah = (angka: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const formatTinggi = (min: number, max: number) => 
  (max === 0 || min > 100) ? '> 100 cm' : `${min} - ${max} cm`;

const DetailBibit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useState<{
    bibit: BibitResponseData | null;
    specs: SeedSpecResponseData[];
    isLoading: boolean;
  }>({ bibit: null, specs: [], isLoading: true });

  useEffect(() => {
    if (!id) return;
    
    const fetchDetailData = async () => {
      try {
        const [bibitRes, allSpecsRes] = await Promise.all([
          getBibitByIdAPI(id),
          getSeedSpecificationsAPI()
        ]);

        const bibit = bibitRes.payload;
        setState({
          bibit,
          specs: allSpecsRes.payload.filter((s: any) => s.seed_id === bibit.id),
          isLoading: false
        });
      } catch (error: any) {
        toast.error(error.message || 'Terjadi kesalahan saat memuat data detail.');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDetailData();
  }, [id]);

  const { bibit, specs, isLoading } = state;

  if (isLoading) return (
    <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
      <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
      <p className="text-sm font-bold text-gray-500">Memuat detail master bibit...</p>
    </div>
  );

  if (!bibit) return <div className="w-full py-20 text-center text-gray-500 font-bold">Data bibit tidak ditemukan.</div>;

  const isKehutanan = bibit.kategori.toLowerCase().includes("kehutanan");

  return (
    <div className="w-full mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detail Master Bibit</h1>
        </div>
        <button onClick={() => navigate(`/admin/staff/donasi/bibit/edit/${id}`)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-colors">
          <HiOutlinePencilSquare className="w-4 h-4" /> Edit Data
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden p-8 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${isKehutanan ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                {bibit.kategori}
              </span>
              <span className="text-xs font-bold text-gray-400">Kode Bibit: {bibit.kode}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#185325] mb-2">{bibit.nama}</h2>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <HiOutlineCheckBadge className="w-5 h-5 text-blue-500" /> Sertifikasi Bibit: {bibit.deskripsi}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Struktur Harga & Stok Berdasarkan Spesifikasi</h3>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200">Spesifikasi Ukuran Tanaman</th>
                    <th className="px-6 py-4 border-b border-gray-200 text-center">Stok Tersedia</th>
                    <th className="px-6 py-4 border-b border-gray-200 text-right">Harga Per Batang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {specs.length ? specs.map(item => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-700">Tinggi Batang {formatTinggi(item.min_height, item.max_height)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 text-center">{item.stock} Batang</td>
                      <td className="px-6 py-4 text-right"><span className="text-lg font-bold text-[#185325]">{formatRupiah(Number(item.price))}</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm font-medium text-gray-400">
                        Belum ada spesifikasi ukuran dan harga yang diatur untuk bibit ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
            <p className="text-xs text-blue-800 leading-relaxed">
              Harga di atas dihitung berdasarkan penawaran katalog vendor dan digunakan sistem untuk mengkalkulasi estimasi anggaran secara otomatis saat Kelompok Tani atau CSR melakukan penyusunan RAB rehabilitasi lahan.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DetailBibit;