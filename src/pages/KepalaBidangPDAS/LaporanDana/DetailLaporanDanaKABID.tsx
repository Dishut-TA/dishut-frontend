import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';
import ProgramInfo from './components/ProgramInfo';
import RincianDanaList from './components/RincianDanaList';
import SummaryDanaSection from './components/SummaryDanaSection';

const DetailLaporanDanaKABID: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [laporanDanas, setLaporanDanas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (location.state?.allReports) {
          const sortedReports = location.state.allReports.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setLaporanDanas(sortedReports);
          setIsLoading(false);
          return;
        }

        const res = await getLaporanDanasAPI();
        const target = res.find((item: any) => String(item.id) === String(id));
        
        if (target) {
          const related = res.filter((l: any) => l.nama_program === target.nama_program);
          const sortedReports = related.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setLaporanDanas(sortedReports);
        } else {
          toast.error("Data laporan tidak ditemukan.");
        }
      } catch (error: any) {
        toast.error("Gagal memuat detail laporan dana.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat detail laporan...
      </div>
    );
  }

  if (laporanDanas.length === 0) return <div className="text-center text-gray-500 py-10">Data tidak ditemukan.</div>;

  const latestData = laporanDanas[laporanDanas.length - 1];

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#185325] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
          Riwayat Laporan Dana Program
        </h1>
        
        <ProgramInfo data={latestData} laporanDanas={laporanDanas} />

        <RincianDanaList laporanDanas={laporanDanas} />

        <SummaryDanaSection laporanDanas={laporanDanas} />

        <div className="flex justify-end mt-8">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-3 bg-[#185325] text-white font-bold rounded-full hover:bg-[#123d1c] transition-colors active:scale-95 shadow-sm text-sm cursor-pointer"
          >
            <HiPrinter className="w-5 h-5" /> Cetak Laporan Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLaporanDanaKABID;