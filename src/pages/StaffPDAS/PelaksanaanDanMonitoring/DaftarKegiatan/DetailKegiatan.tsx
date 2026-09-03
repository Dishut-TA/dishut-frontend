import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineMapPin, HiOutlinePrinter, HiOutlineCheckCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import { StatCardAuthor, StatCardTarget } from "./components/MetricCards";
import InfoCard from "./components/InfoCard";
import DokumentasiGeotag from "./components/DokumentasiGeotag";
import RiwayatPenanaman from "./components/RiwayatPenanaman";
import FundingNote from "./components/FundingNote";
import StatusBadge from "./components/StatusBadge";

const DetailKegiatan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    // Simulasi Fetch Data
    setData({
      id: Number(id),
      title: "Rehabilitasi DAS Cimanuk Hulu",
      wilayahPrioritas: "DAS Cimanuk - Garut",
      location: "Kecamatan Cisitu, Kabupaten Garut",
      jenisProgram: "Program APBD",
      subProgramName: "Rehabilitasi Lahan Kritis",
      tipeIntervensi: "Penanaman Pohon Pelindung",
      kthPelaksana: "KTH Lestari Mandiri",
      jenisKegiatanFisik: "Penanaman & Pemeliharaan",
      targetLuas: 500,
      targetBibit: 1000,
      jenisTanaman: "Mangrove, Sengon, Jabon",
      sumberPendanaan: "APBD Provinsi Jabar 2026",
      startDate: "20 Mei 2026",
      endDate: "20 Des 2026",
      time: "08:00 - 16:00",
      author: "Dina Marlina, S.Hut",
      progress: 45,
      status: "Menunggu Verifikasi", // Set simulasi ke Menunggu Verifikasi agar tombol muncul
      deskripsi: "Program rehabilitasi lahan kritis ini difokuskan pada pemulihan tutupan lahan...",
      sdmTambahan: "3 Tenaga Ahli GIS, 10 Buruh Tani Lokal",
      kebutuhanAlat: "Cangkul, Bibit, Pagar Pengaman, GPS Handheld",
      riwayatTanam: [
        { id: 1, tanggal: "20 Mei 2026", jumlahTanam: 200, totalTanam: 200, oleh: "KTH Lestari Mandiri" },
        { id: 2, tanggal: "05 Juni 2026", jumlahTanam: 250, totalTanam: 450, oleh: "KTH Lestari Mandiri" }
      ]
    });
  }, [id]);

  const handleVerifikasi = () => {
    // Logika ketika Staff menyetujui program untuk masuk ke modul Monitoring
    setData((prev: any) => ({ ...prev, status: "Siap Monitoring" }));
    toast.success("Kegiatan berhasil diverifikasi dan Siap Monitoring!");
  };

  if (!data) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#185325]"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 mx-auto px-4 sm:px-0 pb-12">
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="group cursor-pointer flex items-center gap-2 w-fit text-sm font-semibold text-gray-700 hover:text-[#185325] transition-colors"
        >
          <div className="p-1.5 rounded-full group-hover:bg-green-50 transition-all">
            <HiOutlineArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          Kembali
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 flex-wrap mb-2.5">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{data.title}</h1>
              <StatusBadge status={data.status} />
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-1.5">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" /> 
              {data.location}
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <HiOutlinePrinter className="w-4 h-4" /> Cetak
            </button>

            {/* TOMBOL VERIFIKASI MUNCUL JIKA STATUS "Menunggu Verifikasi" */}
            {data.status === "Menunggu Verifikasi" && (
              <button 
                onClick={handleVerifikasi}
                className="bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <HiOutlineCheckCircle className="w-5 h-5" /> Verifikasi & Lanjut Monitoring
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        <StatCardTarget luas={data.targetLuas} bibit={data.targetBibit} />
        <StatCardAuthor author={data.author} kth={data.kthPelaksana} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <InfoCard data={data} />
          {/* Mengganti Map dengan Dokumentasi Geotag */}
          <DokumentasiGeotag title={data.title} />
        </div>
        <div className="flex flex-col gap-6">
          {/* Mengganti Timeline Status dengan Riwayat Penanaman */}
          <RiwayatPenanaman logs={data.riwayatTanam} targetBibit={data.targetBibit} />
          <FundingNote source={data.sumberPendanaan} />
        </div>
      </div>
      
    </div>
  );
};

export default DetailKegiatan;