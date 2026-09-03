import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPrinter, HiOutlinePencilSquare } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLaporanDanasAPI } from '@/services/laporan-dana.service';
import RincianDanaList from './components/RincianDanaList';
import ProgramInfo from './components/ProgramInfo';
import SummaryDanaSection from './components/SummaryDanaSection';

const DetailLaporanDana: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [laporanDanas, setLaporanDanas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (location.state?.allReports) {
          setLaporanDanas(location.state.allReports);
          setIsLoading(false);
          return;
        }

        const res = await getLaporanDanasAPI();
        const target = res.find((item: any) => String(item.id) === String(id));
        
        if (target) {
          const related = res.filter((l: any) => l.nama_program === target.nama_program);
          setLaporanDanas(related);
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

  const mainData = laporanDanas[0];
  const hasRevisi = laporanDanas.some((l: any) => l.status === 'Revisi');

  const year = mainData.created_at ? new Date(mainData.created_at).getFullYear() : new Date().getFullYear();
  const paddedId = String(mainData.program_id || mainData.id).padStart(3, '0');
  const formattedId = `P-${mainData.sumber_dana}-${year}-${paddedId}`;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 px-4 sm:px-0 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#185325] transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>

        {hasRevisi && (
          <button 
            onClick={() => navigate(`/admin/kth/rehabilitasi/laporan-dana/edit/${mainData.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-800 hover:bg-red-200 text-sm font-bold rounded-full transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <HiOutlinePencilSquare className="w-5 h-5" /> Revisi Laporan
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
          Detail Laporan {formattedId}
        </h1>
        
        <ProgramInfo data={mainData} laporanDanas={laporanDanas} />

        <RincianDanaList laporanDanas={laporanDanas} />

        <SummaryDanaSection laporanDanas={laporanDanas} />

        <div className="flex justify-end mt-8">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-3 bg-[#185325] text-white font-bold rounded-full hover:bg-[#123d1c] transition-colors active:scale-95 shadow-sm text-sm cursor-pointer"
          >
            <HiPrinter className="w-5 h-5" /> Cetak Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLaporanDana;