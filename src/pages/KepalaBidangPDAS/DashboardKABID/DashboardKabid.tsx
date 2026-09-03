import React, { useState, useEffect } from "react";
import {
  HiOutlineHeart,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { PiPlant } from "react-icons/pi";
import toast from "react-hot-toast";
import SummaryCard from "./components/SummaryCard";
import TrendDonasiChart from "./components/TrendDonasiChart";
import PerbandinganPendanaanChart from "./components/PerbandinganPendanaanChart";
import { getDashboardKabidPDASAPI } from "@/services/dashboard.service";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
};

const DashboardKabid: React.FC = () => {
  const [year, setYear] = useState('2026');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardKabidPDASAPI(year);
        setDashboardData(data);
      } catch (error) {
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [year]);

  return (
    <div className="space-y-6 w-full max-w-screen-2xl mx-auto bg-slate-50 min-h-screen pb-12 animate-in fade-in duration-300">
      
      {/* Header dengan Global Year Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Dashboard Kepala Bidang PDAS
        </h1>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Filter Tahun:</span>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="text-sm font-bold text-[#185325] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {isLoading || !dashboardData ? (
        <div className="flex justify-center items-center py-20 text-[#185325] font-bold">
          <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3 border-[#185325]"></span> Memuat dashboard...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Lahan Prioritas"
              value={`${dashboardData.summary.total_lahan_prioritas?.toLocaleString('id-ID') || 0} Ha`}
              icon={<PiPlant className="w-6 h-6" />}
              iconBgColor="bg-emerald-100"
              iconTextColor="text-emerald-700"
            />
            <SummaryCard
              title={`Donasi Terkumpul (${year})`}
              value={formatRupiah(dashboardData.summary.total_donasi_terkumpul)}
              icon={<HiOutlineHeart className="w-6 h-6" />}
              iconBgColor="bg-blue-100"
              iconTextColor="text-blue-700"
            />
            <SummaryCard
              title="Total Lahan Pendanaan CSR"
              value={`${dashboardData.summary.total_lahan_csr?.toLocaleString('id-ID') || 0} Ha`}
              icon={<HiOutlineBuildingOffice2 className="w-6 h-6" />}
              iconBgColor="bg-amber-100"
              iconTextColor="text-amber-700"
            />
            <SummaryCard
              title="Total Lahan Pendanaan APBD"
              value={`${dashboardData.summary.total_lahan_apbd?.toLocaleString('id-ID') || 0} Ha`}
              icon={<HiOutlineBanknotes className="w-6 h-6" />}
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-700"
            />
          </div>

          {/* Charts (Menerima Data & Tahun dari Parent) */}
          <TrendDonasiChart 
            data={dashboardData.trend_donasi} 
            total={dashboardData.summary.total_donasi_terkumpul} 
            year={year} 
          />

          <PerbandinganPendanaanChart 
            data={dashboardData.perbandingan_pendanaan} 
            year={year} 
          />
        </>
      )}
    </div>
  );
};

export default DashboardKabid;