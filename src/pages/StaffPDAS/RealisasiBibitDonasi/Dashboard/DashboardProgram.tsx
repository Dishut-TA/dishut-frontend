import React, { useState, useEffect } from "react";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineMap,
  HiOutlineGlobeAsiaAustralia,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import StatCard, { type StatData } from "./components/StatCard";
import type { DonaturData } from "@/utils/interface";
import { getStaffDonasiDashboardAPI } from "@/services/dashboard.service";
import VerifikasiDonaturModal from "../DataDonatur/components/VerifikasiDonaturModal";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Aktif: "bg-[#e2f1e6] text-[#185325] border border-[#C8E0CD]",
    Selesai: "bg-gray-100 text-gray-600 border border-gray-200",
    "Menunggu Verifikasi": "bg-amber-50 text-amber-600 border border-amber-200",
  };
  return (
    <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap shadow-sm ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const DashboardProgram: React.FC = () => {
  const [dashboard, setDashboard] = useState({
    isLoading: true,
    stats: { menunggu_verifikasi: 0, bibit_siap_salur: 0, total_bibit_tertanam: 0, program_aktif: 0 },
    donaturPending: [] as any[],
    progressProgram: [] as any[],
  });
  const [modal, setModal] = useState<{ isOpen: boolean; data: DonaturData | null }>({
    isOpen: false,
    data: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setDashboard(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await getStaffDonasiDashboardAPI();
      setDashboard({
        isLoading: false,
        stats: {
          menunggu_verifikasi: res.menunggu_verifikasi || 0,
          bibit_siap_salur: res.bibit_siap_salur || 0,
          total_bibit_tertanam: res.total_bibit_tertanam || 0,
          program_aktif: res.program_aktif || 0,
        },
        donaturPending: res.donatur_butuh_verifikasi || [],
        progressProgram: res.progress_program || [],
      });
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data dashboard.');
      setDashboard(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleOpenVerifikasi = (item: any) => {
    let rincianBibit: any[] = [];
    if (Array.isArray(item.seed_details)) {
      rincianBibit = item.seed_details.map((bibit: any) => ({
        nama: bibit.name || "Bibit",
        jumlah: Number(bibit.quantity) || 0,
        hargaSatuan: bibit.price || 0
      }));
    } else {
      rincianBibit = [{ nama: "Bibit", jumlah: item.seed_quantity || 0, hargaSatuan: 0 }];
    }

    setModal({
      isOpen: true,
      data: {
        id: item.id,
        idTransaksi: `TRX-${item.transaction_id || item.donor_id}`,
        idDonasi: `DNS-${item.id}`,
        namaDonatur: item.donor?.donor_name || "Hamba Allah",
        program: item.donation_program?.name || "Program Umum",
        jumlahBibit: item.seed_quantity || 0, // This uses the total we passed earlier
        status: "Menunggu Verifikasi",
        rincianBibit: rincianBibit,
        proof_url: item.proof_url || item.proof_path
      }
    });
  };

  const handleActionDonatur = (pesan: string, isSukses: boolean) => {
    isSukses ? toast.success(pesan) : toast.error(pesan);
    setModal({ isOpen: false, data: null });
    fetchDashboardData();
  };

  const { isLoading, stats, donaturPending, progressProgram } = dashboard;

  const STATS_DATA: StatData[] = [
    { id: 1, label: "Menunggu Verifikasi", value: stats.menunggu_verifikasi, icon: HiOutlineExclamationCircle, iconColor: "text-amber-500", bgColor: "bg-amber-50" },
    { id: 2, label: "Bibit Siap Salur", value: stats.bibit_siap_salur, icon: HiOutlineCheckCircle, iconColor: "text-[#2E7D32]", bgColor: "bg-[#DCECE0]/50" },
    { id: 3, label: "Total Bibit Tertanam", value: stats.total_bibit_tertanam, icon: HiOutlineGlobeAsiaAustralia, iconColor: "text-[#185325]", bgColor: "bg-[#DCECE0]/80" },
    { id: 4, label: "Program Aktif", value: stats.program_aktif, icon: HiOutlineMap, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 w-full">
        <span className="w-10 h-10 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
        <p className="text-sm font-bold text-gray-500 mt-3">Memuat ringkasan dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Dashboard Realisasi Bibit dan Donasi</h1>
          <p className="text-sm md:text-base text-gray-500">Ringkasan performa program dan status verifikasi donatur.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS_DATA.map((stat) => <StatCard key={stat.id} data={stat} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-2 items-start">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#f0f9f3]">
              <h2 className="font-bold text-gray-800">Donatur Butuh Verifikasi</h2>
              <span className="bg-[#F2C94C] text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {donaturPending.length} Baru
              </span>
            </div>

            <div className="p-6 flex-1 bg-slate-50/50 min-h-75">
              {donaturPending.length > 0 ? (
                <div className="space-y-4">
                  {donaturPending.map((item) => {
                    let totalBibit = 0;
                    let bibitNames: string[] = [];
                    if (Array.isArray(item.seed_details)) {
                      item.seed_details.forEach((bibit: any) => {
                        totalBibit += Number(bibit.quantity) || 0;
                        if (bibit.name) bibitNames.push(bibit.name);
                      });
                    }
                    const bibitDisplayStr = bibitNames.length > 0 ? `(${bibitNames.join(', ')})` : '';

                    return (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#185325]/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-800">{item.donor?.donor_name || "Donatur"}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {totalBibit} Bibit {bibitDisplayStr} - {item.donation_program?.name || "Program"}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleOpenVerifikasi({ ...item, seed_quantity: totalBibit })} // Pass total to modal
                        className="px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                      >
                        Verifikasi Data
                      </button>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium py-12">Tidak ada data verifikasi baru.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-800">Progress Program</h2>
            </div>

            <div className="overflow-y-auto max-h-100 custom-scrollbar">
              {progressProgram.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {progressProgram.map((progress) => (
                    <li key={progress.id} className="p-6 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-800">{progress.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Total Terkumpul: <span className="font-bold text-[#185325]">{Number(progress.total_seeds_collected).toLocaleString('id-ID')}</span> Bibit
                        </p>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={progress.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-gray-400 text-sm">Belum ada data progress program.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VerifikasiDonaturModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        donatur={modal.data}
        onTerima={() => handleActionDonatur("Donasi berhasil diverifikasi!", true)}
        onTolak={() => handleActionDonatur("Donasi ditolak.", false)}
      />
    </>
  );
};

export default DashboardProgram;