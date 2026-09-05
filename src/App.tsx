import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import CustomToaster from "./components/CustomToaster";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import { ROLE_REDIRECTS, ROLES } from "./utils/roles";
import DashboardKTH from "./pages/KelompokTaniHutan/Dashboard/DashboardKTH";
import DashboardCSR from "./pages/CSR/DashboardCSR/DashboardCSR";
import TinjauProposal from "./pages/CSR/TinjauProposal/TinjauProposal";
import DetailTinjauProposal from "./pages/CSR/TinjauProposal/DetailTinjauProposal";
import MonitoringProyek from "./pages/CSR/MonitoringProyek/MonitoringProyek";
import DashboardStaffBUPM from "./pages/StaffBUPM/Dashboard/DashboardStaffBUPM";
import DataInvestasi from "./pages/StaffBUPM/DataInvestasi/DataInvestasi";
import DetailInvestasi from "./pages/StaffBUPM/DataInvestasi/DetailInvestasi";
import DataInvestorIndex from "./pages/StaffBUPM/DataInvestor/DataInvestorIndex";
import DetailInvestor from "./pages/StaffBUPM/DataInvestor/DetailInvestor";
import LaporanProyekIndex from "./pages/StaffBUPM/LaporanProyek/LaporanProyekIndex";
import DashboardKABIDBUPM from "./pages/KepalaBidangBUPM/Dashboard/DashboardKABIDBUPM";
import DataInvestasiKABIDBUPM from "./pages/KepalaBidangBUPM/DataInvestasi/DataInvestasiKABIDBUPM";
import DetailInvestasiKABIDBUPM from "./pages/KepalaBidangBUPM/DataInvestasi/DetailInvestasiKABIDBUPM";
import DataInvestorIndexKABIDBUPM from "./pages/KepalaBidangBUPM/DataInvestor/DataInvestorIndexKABIDBUPM";
import DetailInvestorKABIDBUPM from "./pages/KepalaBidangBUPM/DataInvestor/DetailInvestor";
import LaporanProyekIndexKABIDBUPM from "./pages/KepalaBidangBUPM/LaporanProyek/LaporanProyekIndexKABIDBUPM";
import AjukanProgramCSR from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanCSR/AjukanProgramCSR";
import RiwayatPengajuan from "./pages/KelompokTaniHutan/Rehabilitasi/RiwayatPengajuan";
import UpdateProgres from "./pages/KelompokTaniHutan/Rehabilitasi/UpdateProgress";
import DataInvestasiKTH from "./pages/KelompokTaniHutan/DataInvestasiKTH/DataInvestasi";
import CreateInvestasi from "./pages/KelompokTaniHutan/DataInvestasiKTH/Create";
import PersetujuanInvestasi from "./pages/KelompokTaniHutan/InvestasiKTH/PersetujuanInvestasi/PersetujuanInvestasi";
import DetailPersetujuan from "./pages/KelompokTaniHutan/InvestasiKTH/PersetujuanInvestasi/DetailPersetujuan";
import DataInvestorIndexKTH from "./pages/KelompokTaniHutan/DataInvestorKTH/DataInvestorIndexKTH";
import DetailInvestorKTH from "./pages/KelompokTaniHutan/DataInvestorKTH/DetailInvestor";
import LaporanProyekIndexKTH from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanProyekKTH/LaporanProyek";
import CreateLaporanProyek from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanProyekKTH/CreateLaporanProyek";
import CreateLaporanUsaha from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanUsaha/CreateLaporanUsaha";
import LaporanUsaha from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanUsaha/LaporanUsaha";
import LaporanKeuangan from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanKeuangan/LaporanKeuangan";
import CreateLaporanKeuangan from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanKeuangan/CreateLaporanKeuangan";
import CreateLaporanBiayaPengeluaran from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanBiayaPengeluaran/CreateLaporanBiayaPengeluaran";
import BiayaPengeluaranIndex from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanBiayaPengeluaran/BiayaPengeluaranIndex";
import BiayaPemasukanIndex from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanBiayaPemasukan/BiayaPemasukanIndex";
import BiayaPemasukanCreate from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanBiayaPemasukan/CreateBiayaPemasukan";
import DetailVerifikasiDanaCSRKABID from "./pages/KepalaBidangPDAS/VerifikasiDanaCSR/DetailVerifikasiDanaCSRKKABID";
import VerifikasiDanaCSRKABID from "./pages/KepalaBidangPDAS/VerifikasiDanaCSR/VerifikasiDanaCSRKABID";
// import VerifikasiDanaCSR from "./pages/StaffPDAS/Investasi/VerifikasiDanaCSRSTAFF";
// import DetailVerifikasiDanaCSR from "./pages/StaffPDAS/Investasi/VerifikasiDanaCSRSTAFF/DetailVerifikasiLaporanDanaSTAFF";
import LaporanKeuanganIndex from "./pages/CSR/LaporanRealisasiDanaCSR/LaporanRealisasiDanaCSR";
import DetailLaporanKeuangan from "./pages/CSR/LaporanRealisasiDanaCSR/DetailLaporanRealisasiDanaCSR";
import LaporanDanaIndex from "./pages/KelompokTaniHutan/Rehabilitasi/LaporanDana/LaporanDanaIndex";
import CreateLaporanDana from "./pages/KelompokTaniHutan/Rehabilitasi/LaporanDana/CreateLaporanDana";
import DetailLaporanDana from "./pages/KelompokTaniHutan/Rehabilitasi/LaporanDana/DetailLaporanDana";
import ValidasiLokasi from "./pages/Penyuluh/ValidasiLokasi";
import CreateValidasi from "./pages/Penyuluh/ValidasiLokasi/CreateValidasi";
import DashboardPenyuluh from "./pages/Penyuluh/Dashboard";
import PelaksanaanPenanamanIndex from "./pages/Penyuluh/PelaksanaanPenanaman";
import InputProgresPage from "./pages/Penyuluh/PelaksanaanPenanaman/CreateProgress";
import MonitoringLanjutanIndex from "./pages/Penyuluh/MonitoringLanjutan";
import DetailInvestasiKTH from "./pages/KelompokTaniHutan/DataInvestasiKTH/DetailInvestasiKTH";
import InputEvaluasi from "./pages/StaffPDAS/EvaluasiPenanamanBibit/Penugasan/InputEvaluasi";
import CreateInisiasiPenugasanEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/InisiasiPenugasanEvaluasi/CreateInisiasiPenugasanEvaluasiKABID";
import DataEvaluasiIndex from "./pages/StaffPDAS/EvaluasiPenanamanBibit/DataEvaluasi/DataEvaluasiIndex";
import DraftLaporanIndividu from "./pages/StaffPDAS/EvaluasiPenanamanBibit/DataEvaluasi/DraftLaporanIndividu";
import PenugasanEvaluasiSTAFFPDAS from "./pages/StaffPDAS/EvaluasiPenanamanBibit/Penugasan";
// import CreatePengesahanLaporanKabid from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/LaporanEvaluasi/CreatePengesahanLaporanKabid";
// import PengesahanLaporanKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/LaporanEvaluasi";
import CreatePenugasanEvaluasiStaffPDAS from "./pages/StaffPDAS/EvaluasiPenanamanBibit/Penugasan/InputEvaluasi";
import InisiasiPenugasanEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/InisiasiPenugasanEvaluasi/InisiasiPenugasanKABID";
import DetailInisiasiPenugasan from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/InisiasiPenugasanEvaluasi/DetailInisiasiPenugasanEvaluasiKABID";
import PerhitunganHasilEvaluasiStaff from "./pages/StaffPDAS/EvaluasiPenanamanBibit/PerhitunganHasilEvaluasi/PerhitunganHasilEvaluasiStaff";
import DetailPerhitunganHasilEvaluasiStaff from "./pages/StaffPDAS/EvaluasiPenanamanBibit/PerhitunganHasilEvaluasi/DetailPerhitunganHasilEvaluasiStaff";
import ValidasiDataEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/ValidasiDataEvaluasi";
import DetailEvaluasiDataEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/ValidasiDataEvaluasi/DetailValidasiDataEvaluasiKABID";
import LaporanEvaluasiStaffPDAS from "./pages/StaffPDAS/EvaluasiPenanamanBibit/LaporanEvaluasiStaffPDAS/LaporanEvaluasiStaffPDAS";
import CreateLaporanEvaluasiStaffPDAS from "./pages/StaffPDAS/EvaluasiPenanamanBibit/LaporanEvaluasiStaffPDAS/CreateLaporanEvaluasiStaffPDAS";
import LaporanEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/LaporanEvaluasi/LaporanEvaluasiKABID";
import PengesahanLaporanEvaluasiKabid from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/LaporanEvaluasi/PengesahanLaporanEvaluasiKabid";
import PendanaanCSR from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanCSR/PendanaanCSR";
import PendanaanAPBD from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanAPBD/PendanaanAPBD";
import IndexBibit from "./pages/StaffPDAS/RealisasiBibitDonasi/Bibit/IndexBibit";
import CreateBibit from "./pages/StaffPDAS/RealisasiBibitDonasi/Bibit/CreateBibit";
import DetailBibit from "./pages/StaffPDAS/RealisasiBibitDonasi/Bibit/DetailBibit";
import PenugasanPenyuluh from "./pages/StaffPDAS/PelaksanaanDanMonitoring/PenugasanPenyuluh";
import HasilValidasiPenyuluh from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/HasilValidasiPenyuluh/HasilValidasiLokasi";
import DetailHasilValidasi from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/HasilValidasiPenyuluh/DetailHasilValidasi";
import ProsesValidasiPenyuluh from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/HasilValidasiPenyuluh/ProsesHasilValidasiPenyuluh";
import DetailPenugasanPenyuluh from "./pages/StaffPDAS/PelaksanaanDanMonitoring/PenugasanPenyuluh/DetailPenugasanPenyuluh";
import DetailKegiatan from "./pages/StaffPDAS/PelaksanaanDanMonitoring/DaftarKegiatan/DetailKegiatan";
import SaldoKeuntungan from "./pages/KelompokTaniHutan/SaldoKeuntungan/SaldoKeuntungan";
import IsiSaldo from "./pages/KelompokTaniHutan/SaldoKeuntungan/IsiSaldo/IsiSaldo";
import RiwayatTransaksi from "./pages/KelompokTaniHutan/SaldoKeuntungan/RiwayatTransaksi/RiwayatTransaksi";
import TarikSaldo from "./pages/KelompokTaniHutan/SaldoKeuntungan/TarikSaldo/TarikSaldo";
import DetailProgramAPBD from "./pages/StaffPDAS/Investasi/ProgramAPBD/DetailProgramAPBD";
import DetailPendanaanAPBD from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanAPBD/DetailPendanaanAPBD";
import RiwayatRehabilitasi from "./pages/KelompokTaniHutan/Rehabilitasi/RiwayatRehabilitasi/RiwayatRehabilitasi";
import DetailRiwayatRehabilitasi from "./pages/KelompokTaniHutan/Rehabilitasi/RiwayatRehabilitasi/DetailRiwayatRehabilitasi";
import RiwayatRehabilitasiKABID from "./pages/KepalaBidangPDAS/RiwayatRehabilitasi/RiwayatRehabilitasiKABID";
import DetailRiwayatRehabilitasiKABID from "./pages/KepalaBidangPDAS/RiwayatRehabilitasi/DetailRiwayatRehabilitasi";
import LaporanDanaIndexKABID from "./pages/KepalaBidangPDAS/LaporanDana/LaporanDanaIndexKABID";
import PendanaanProgram from "./pages/CSR/TinjauProposal/PembayaranProgramPendanaan/PendanaanProgram";
import RiwayatRehabilitasiSTAFF from "./pages/StaffPDAS/Investasi/RiwayatRehabilitasi/RiwayatRehabilitasiSTAFF";
import DetailRiwayatRehabilitasiSTAFF from "./pages/StaffPDAS/Investasi/RiwayatRehabilitasi/DetailRiwayatRehabilitasi";
import VerifikasiLaporanDanaSTAFF from "./pages/StaffPDAS/Investasi/VerifikasiDanaCSRSTAFF/VerifikasiLaporanDanaSTAFF";
import DetailVerifikasiLaporanDanaSTAFF from "./pages/StaffPDAS/Investasi/VerifikasiDanaCSRSTAFF/DetailVerifikasiLaporanDanaSTAFF";
import LaporanDanaIndexSTAFF from "./pages/StaffPDAS/Investasi/LaporanDana/LaporanDanaIndexSTAFF";
import DetailRiwayatPendanaan from "./pages/CSR/RiwayatPendanaan/DetailRiwayatPendanaan";
import RiwayatPendanaan from "./pages/CSR/RiwayatPendanaan/RiwayatPendanaan";
import DetailProgres from "./pages/StaffPDAS/PelaksanaanDanMonitoring/PenugasanPenyuluh/DetailProgres";
// import DetailHasilValidasiPenugasan from "./pages/StaffPDAS/PelaksanaanDanMonitoring/PenugasanPenyuluh/DetailHasilValidasiPenugasan";
// import DetailVerifikasiPelaksanaan from "./pages/StaffPDAS/PelaksanaanDanMonitoring/VerifikasiMonitoring/components/DetailVerifikasiPelaksanaan";
import MonitoringProgram from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram";
import ProgresMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/ProgresMonitoring";
import DetailTitikMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/DetailTitikMonitoring";
import TinjauHasilMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/TinjauHasilMonitoring";
import TindakLanjutMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/TindakLanjutMonitoring";
import HasilMonitoringSelesai from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/HasilMonitoringSelesai";
import DetailPenugasanMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/DetailPenugasanMonitoring";
import DetailValidasi from "./pages/Penyuluh/ValidasiLokasi/DetailValidasi";
import MulaiKegiatan from "./pages/Penyuluh/PelaksanaanPenanaman/MulaiKegiatan";
import MonitoringProgramRehabilitasi from "./pages/Penyuluh/MonitoringProgram";
import DetailMonitoringProgram from "./pages/Penyuluh/MonitoringProgram/DetailMonitoringProgram";
import PelaporanList from "./pages/StaffPDAS/PelaksanaanDanMonitoring/Pelaporan";
import DetailPelaporanAPBD from "./pages/StaffPDAS/PelaksanaanDanMonitoring/Pelaporan/DetailPelaporanAPBD";
import DetailPelaporanDonasi from "./pages/StaffPDAS/PelaksanaanDanMonitoring/Pelaporan/DetailPelaporanDonasi";
import MasterPenyuluh from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MasterPenyuluh";
import DetailPenyuluh from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MasterPenyuluh/DetailPenyuluh";
import DetailLaporanKeuanganKTH from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanKeuangan/DetailLaporanKeuanganKTH";
import EditLaporanKeuangan from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanInvestasi/LaporanKeuangan/EditLaporanKeuangan";
import DetailLaporanProyekKTH from "./pages/KelompokTaniHutan/InvestasiKTH/LaporanProyekKTH/DetailLaporanProyek";
import DetailLaporanProyekStaffBUPM from "./pages/StaffBUPM/LaporanProyek/DetailLaporanProyekStaffBUPM";
import LaporanKeuanganStaffBUPM from "./pages/StaffBUPM/LaporanKeuanganStaffBUPM/LaporanKeuanganStaffBUPM";
import DetailLaporanKeuanganStaffBUPM from "./pages/StaffBUPM/LaporanKeuanganStaffBUPM/DetailLaporanKeuanganStaffBUPM";
import DetailLaporanProyekKABIDBUPM from "./pages/KepalaBidangBUPM/LaporanProyek/DetailLaporanProyekKABIDBUPM";
import LaporanKeuanganKABIDBUPM from "./pages/KepalaBidangBUPM/LaporanKeuangan/LaporanKeuanganKABIDBUPM";
import DetailLaporanKeuanganKABIDBUPM from "./pages/KepalaBidangBUPM/LaporanKeuangan/DetailLaporanKeuanganKABIDBUPM";
import DetailLaporanEvaluasiStaff from "./pages/StaffPDAS/EvaluasiPenanamanBibit/LaporanEvaluasiStaffPDAS/DetailLaporanEvaluasiStaff";
import DetailLaporanEvaluasiKABID from "./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/LaporanEvaluasi/DetailLaporanEvaluasiKABID";
import PenugasanEvaluasiStaff from "./pages/StaffPDAS/EvaluasiPenanamanBibit/Penugasan/PenugasanEvaluasiStaff";
import DetailPenugasanEvaluasiStaff from "./pages/StaffPDAS/EvaluasiPenanamanBibit/Penugasan/DetailPenugasanEvaluasiStaff";
import DashboardCPISTAFF from "./pages/StaffPDAS/AnalisisLahanKritis/DashboardCPISTAFF/DashboardCPISTAFF";
import DataKTH from "./pages/StaffPDAS/AnalisisLahanKritis/DataKTH/DataKTH";
import DataZonasi from "./pages/StaffPDAS/AnalisisLahanKritis/DataZonasi";
import DashboardCPIKABID from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/DashboardCPIKABID/DashboardCPIKABID";
import DetailCPIKABID from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/DashboardCPIKABID/DetailCPIKABID";
import HasilValidasiLokasi from "./pages/KepalaBidangPDAS/AnalisisLahanKritis/HasilValidasiPenyuluh/HasilValidasiLokasi";
import MasterBibit from "./pages/StaffPDAS/DataMaster/MasterBibit/MasterBibit";
import DetailCPISTAFF from "./pages/StaffPDAS/AnalisisLahanKritis/AnalisisCPI/DetailCPISTAFF";
import DetailPendanaanCSR from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanCSR/DetailPendanaanCSR";
import EditProgram from "./pages/StaffPDAS/RealisasiBibitDonasi/ProgramDonasi/EditProgramDonasi";
import DashboardPelaksanaanMonitoringKabid from "./pages/KepalaBidangPDAS/PelaksanaanDanMonitoring/Dashboard/DashboardPelaksanaanMonitoringKABID";
import DetailPenugasan from "./pages/StaffPDAS/PelaksanaanDanMonitoring/PenugasanPenyuluh/DetailPenugasan";
import PelaksanaanWizard from "./pages/Penyuluh/PelaksanaanPenanaman/InputDataTanaman";
import DetailMonitoringPage from "./pages/StaffPDAS/PelaksanaanDanMonitoring/MonitoringProgram/DetailMonitoringPage";
import TugaskanMonitoring from "./pages/StaffPDAS/PelaksanaanDanMonitoring/VerifikasiMonitoring/TugaskanMonitoring";
import DashboardKTHPelaksanaan from "./pages/KTHPelaksanaan/Dashboard/DashboardKTHPelaksanaan";
import DetailPenugasanPenanaman from "./pages/KTHPelaksanaan/Dashboard/DetailPenugasanPenanaman";
import DetailPenugasanPenyulaman from "./pages/KTHPelaksanaan/Dashboard/DetailPenugasanPenyulaman";
import FormMonitoringPage from "./pages/Penyuluh/MonitoringLanjutan/FormMonitoringPage";
import DetailPelaksanaanProgramKabid from "./pages/KepalaBidangPDAS/PelaksanaanDanMonitoring/Dashboard/DetailPelaksanaanProgramKabid";
import EditProgramCSR from "./pages/KelompokTaniHutan/Rehabilitasi/PendanaanCSR/EditProgramCSR";
import DetailLaporanDanaKABID from "./pages/KepalaBidangPDAS/LaporanDana/DetailLaporanDanaKABID";
import RencanaRehabilitasiIndex from "./pages/StaffPDAS/AnalisisLahanKritis/RencanaRehabilitasi/RencanaRehabilitasiIndex";
import RencanaRehabilitasiDetail from "./pages/StaffPDAS/AnalisisLahanKritis/RencanaRehabilitasi/RencanaRehabilitasiDetail";
const Login = lazy(() => import("./pages/Authentication/Login/Login"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Staff PDAS Import
const DashboardStaffPDAS = lazy(() => import("./pages/StaffPDAS/DashboardStaffPDAS/DashboardStaffPDAS"));
const ProgramAPBDList = lazy(() => import("./pages/StaffPDAS/Investasi/ProgramAPBD/ProgramAPBDList"));
const CreateProgramAPBD = lazy(() => import("./pages/StaffPDAS/Investasi/ProgramAPBD/CreateProgram"));
const EditProgramAPBD = lazy(() => import("./pages/StaffPDAS/Investasi/ProgramAPBD/EditProgram"));
const ProgramCSRList = lazy(() => import("./pages/StaffPDAS/Investasi/ProgramCSR/ProgramCSRList"));
const VerifikasiBerkasCSR = lazy(() => import("./pages/StaffPDAS/Investasi/ProgramCSR/VerifikasiBerkas"));
// const MonitoringRiwayatList = lazy(() => import("./pages/StaffPDAS/Investasi/MonitoringRiwayat"));
// const CreateEvaluasi = lazy(() => import("./pages/StaffPDAS/EvaluasiPenanamanBibit/DataEvaluasi/CreateEvaluasi"));
const StaffTugasEvaluasi = lazy(() => import("./pages/StaffPDAS/EvaluasiPenanamanBibit/TugasMasuk"));
const AnalisisLahanKritis = lazy(() => import("./pages/StaffPDAS/AnalisisLahanKritis/AnalisisCPI/AnalisisLahanKritis"));
const DashboardMonitoring = lazy(() => import("./pages/StaffPDAS/PelaksanaanDanMonitoring/DashboardMonitoring"));
const DaftarKegiatan = lazy(() => import("./pages/StaffPDAS/PelaksanaanDanMonitoring/DaftarKegiatan"));
// const VerifikasiMonitoring = lazy(() => import("./pages/StaffPDAS/PelaksanaanDanMonitoring/VerifikasiMonitoring"));
const RekapMonitoring = lazy(() => import("./pages/StaffPDAS/PelaksanaanDanMonitoring/RekapMonitoring"));
const DashboardEvaluasi = lazy(() => import("./pages/StaffPDAS/EvaluasiPenanamanBibit/DashboardEvaluasi/DashboardEvaluasi"));
// const DataEvaluasi = lazy(() => import("./pages/StaffPDAS/EvaluasiPenanamanBibit/DataEvaluasi"));
const DashboardProgramStaff = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/Dashboard/DashboardProgram"));
const ProgramDonasiStaff = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/ProgramDonasi/ProgramDonasi"));
const CreateProgram = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/ProgramDonasi/CreateProgram"));
const DataDonatur = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/DataDonatur/DataDonasi"));
const PelaksanaanKegiatan = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/PelaksanaanKegiatan/PelaksanaanKegiatan"));
const PelaporanData = lazy(() => import("./pages/StaffPDAS/RealisasiBibitDonasi/PelaporanData"));

// Kabid Import
const DashboardKabid = lazy(() => import("./pages/KepalaBidangPDAS/DashboardKABID/DashboardKabid"));
const DashhboardProgramKabid = lazy(() => import("./pages/KepalaBidangPDAS/RealisasiBibitDonasi/DashboardProgramKabid/DashboardProgramKabid"));
const DataProgramKabid = lazy(() => import("./pages/KepalaBidangPDAS/RealisasiBibitDonasi/DataProgram/KabidProgramDonasi"));
const DataPengguna = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataPengguna"));
const DetailPengguna = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataPengguna/DetailPengguna"));
const DataPeranPengguna = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataPeranPengguna"));
const DetailRole = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataPeranPengguna/components/DetailRole"));
const DataHakAkses = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataHakAkses"));
const DetailHakAkses = lazy(() => import("./pages/KepalaBidangPDAS/ManajemenAkun/DataHakAkses/components/DetailHakAkses"));
// const KabidVerifikasiBAP = lazy(() => import("./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/VerifikasiLaporan"));
// const KabidPenugasan = lazy(() => import("./pages/KepalaBidangPDAS/EvaluasiPenanamanBibit/Penugasan"));
const DaftarUsulanAPBD = lazy(() => import("./pages/KepalaBidangPDAS/Investasi/ProgramUsulanAPBDKABID/DaftarUsulanAPBD"));
const VerifikasiAPBD = lazy(() => import("./pages/KepalaBidangPDAS/Investasi/ProgramUsulanAPBDKABID/VerifikasiAPBD"));
const DaftarUsulanCSR = lazy(() => import("./pages/KepalaBidangPDAS/Investasi/ProgramCSRKABID/DaftarUsulanCSR"));
const VerifikasiCSR = lazy(() => import("./pages/KepalaBidangPDAS/Investasi/ProgramCSRKABID/VerifikasiCSR"));
const RiwayatKeputusan = lazy(() => import("./pages/KepalaBidangPDAS/Investasi/RiwayatKeputusan/RiwayatKeputusan"));
const EditDataLapanganEvaluasi = lazy(() => import("./pages/StaffPDAS/EvaluasiPenanamanBibit/PerhitunganHasilEvaluasi/EditDataLapanganEvaluasi"));

const RoleBasedRedirect = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/admin/login" replace />;

  try {
    const userData = JSON.parse(userStr);
    const roleName = userData?.peran?.[0]?.nama?.trim().toLowerCase();

    return <Navigate to={ROLE_REDIRECTS[roleName] || "/admin/login"} replace />;
  } catch (e) {
    return <Navigate to="/admin/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<RoleBasedRedirect />} />
              <Route path="profile" element={<Profile />} />

              {/* Staff PDAS */}
              <Route element={<RoleGuard allowedRoles={[ROLES.STAFF]} />}>
                <Route path="staff">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardStaffPDAS />} />
                  
                  {/* DATA MASTER */}
                  <Route path="master/master-bibit" element={<MasterBibit />} />

                  {/* CPI */}
                  <Route path="analisis-cpi/dashboard" element={<DashboardCPISTAFF />} />
                  <Route path="analisis-cpi/peta" element={<AnalisisLahanKritis />} />
                  <Route path="analisis-cpi/peta/:id" element={<DetailCPISTAFF />} />
                  <Route path="analisis-cpi/zonasi" element={<DataZonasi />} />
                  <Route path="analisis-cpi/kth" element={<DataKTH />} />
                  <Route path="analisis-cpi/rencana" element={<RencanaRehabilitasiIndex />} />
                  <Route path="analisis-cpi/rencana/detail/:id" element={<RencanaRehabilitasiDetail />} />

                  {/* Donasi */}
                  <Route path="donasi/bibit" element={<IndexBibit />} />
                  <Route path="donasi/bibit/create" element={<CreateBibit />} />
                  <Route path="donasi/bibit/detail/:id" element={<DetailBibit />} />
                  <Route path="donasi/bibit/edit/:id" element={<CreateBibit />} />
                  <Route path="donasi/dashboard" element={<DashboardProgramStaff />} />
                  <Route path="donasi/program" element={<ProgramDonasiStaff />} />
                  <Route path="donasi/program/create" element={<CreateProgram />} />
                  <Route path="donasi/program/edit/:id" element={<EditProgram />} />
                  <Route path="donasi/donatur" element={<DataDonatur />} />
                  <Route path="donasi/pelaksanaan-kegiatan" element={<PelaksanaanKegiatan />} />
                  <Route path="donasi/pelaporan-data" element={<PelaporanData />} />

                  {/* Rehabilitasi / Investasi */}
                  <Route path="rehabilitasi/program-apbd" element={<ProgramAPBDList />} />
                  <Route path="rehabilitasi/program-apbd/create" element={<CreateProgramAPBD />} />
                  <Route path="rehabilitasi/program-apbd/edit/:id" element={<EditProgramAPBD />} />
                  <Route path="rehabilitasi/program-apbd/detail/:id" element={<DetailProgramAPBD />} />
                  <Route path="rehabilitasi/program-csr" element={<ProgramCSRList />} />
                  <Route path="rehabilitasi/program-csr/detail/:id" element={<VerifikasiBerkasCSR />} />
                  <Route path="rehabilitasi/verifikasi-dana" element={<VerifikasiLaporanDanaSTAFF />} />
                  <Route path="rehabilitasi/verifikasi-dana/detail/:id" element={<DetailVerifikasiLaporanDanaSTAFF />} />
                  <Route path="rehabilitasi/laporan-dana" element={<LaporanDanaIndexSTAFF />} />
                  <Route path="rehabilitasi/riwayat-rehabilitasi" element={<RiwayatRehabilitasiSTAFF />} />
                  <Route path="rehabilitasi/riwayat-rehabilitasi/detail/:id" element={<DetailRiwayatRehabilitasiSTAFF />} />

                  {/* Monitoring */}
                  <Route path="monitoring/dashboard" element={<DashboardMonitoring />} />
                  <Route path="monitoring/penugasan-pelaksanaan" element={<PenugasanPenyuluh />} />
                  <Route path="monitoring/penugasan-pelaksanaan/detail/:id" element={<DetailPenugasan />} />
                  <Route path="monitoring/penugasan-penyuluh/progres/:id" element={<DetailProgres />} />
                  <Route path="monitoring/penugasan-penyuluh/detail/:id" element={<DetailPenugasanPenyuluh />} />
                  <Route path="monitoring/monitoring-program" element={<MonitoringProgram />} />
                  <Route path="monitoring/monitoring-program/penugasan/:id" element={<DetailPenugasanMonitoring />} />
                  <Route path="monitoring/monitoring-program/progres/:id" element={<ProgresMonitoring />} />
                  <Route path="monitoring/monitoring-program/progres/:id/titik/:titikId" element={<DetailTitikMonitoring />} />
                  <Route path="monitoring/monitoring-program/tinjau/:id" element={<TinjauHasilMonitoring />} />
                  <Route path="monitoring/monitoring-program/tindak-lanjut/:id" element={<TindakLanjutMonitoring />} />
                  <Route path="monitoring/monitoring-program/hasil/:id" element={<HasilMonitoringSelesai />} />
                  <Route path="monitoring/pelaporan" element={<PelaporanList />} />
                  <Route path="monitoring/pelaporan/apbd/:id" element={<DetailPelaporanAPBD />} />
                  <Route path="monitoring/pelaporan/donasi/:id" element={<DetailPelaporanDonasi />} />
                  <Route path="monitoring/master-penyuluh" element={<MasterPenyuluh />} />
                  <Route path="monitoring/master-penyuluh/:id" element={<DetailPenyuluh />} />
                  <Route path="monitoring/hasil-validasi-penyuluh/" element={<HasilValidasiPenyuluh />} />
                  <Route path="monitoring/hasil-validasi-penyuluh/detail/:id" element={<DetailHasilValidasi />} />
                  <Route path="monitoring/hasil-validasi-penyuluh/proses/:id" element={<ProsesValidasiPenyuluh />} />
                  <Route path="monitoring/kegiatan" element={<DaftarKegiatan />} />
                  <Route path="monitoring/kegiatan/detail/:id" element={<DetailKegiatan />} />
                  <Route path="monitoring/verifikasi" element={<MonitoringProgram />} />
                  <Route path="monitoring/verifikasi/detail/:id" element={<DetailMonitoringPage />} />
                  <Route path="monitoring/verifikasi/tugaskan/:id" element={<TugaskanMonitoring />} />
                  <Route path="monitoring/rekap" element={<RekapMonitoring />} />

                  {/* Evaluasi */}
                  <Route path="evaluasi/dashboard" element={<DashboardEvaluasi />} />
                  <Route path="evaluasi/data" element={<DataEvaluasiIndex />} />
                  <Route path="evaluasi/penugasan" element={<PenugasanEvaluasiStaff />} />
                  <Route path="evaluasi/penugasan/detail/:id" element={<DetailPenugasanEvaluasiStaff />} />
                  <Route path="evaluasi/hasil" element={<PerhitunganHasilEvaluasiStaff />} />
                  <Route path="evaluasi/hasil/detail/:id" element={<DetailPerhitunganHasilEvaluasiStaff />} />
                  <Route path="evaluasi/hasil/form-lapangan/:id" element={<EditDataLapanganEvaluasi />} />
                  <Route path="evaluasi/data/create/:id" element={<InputEvaluasi />} />
                  <Route path="evaluasi/laporan" element={<LaporanEvaluasiStaffPDAS />} />
                  <Route path="evaluasi/laporan/create/:id" element={<CreateLaporanEvaluasiStaffPDAS />} />
                  <Route path="evaluasi/laporan/detail/:id" element={<DetailLaporanEvaluasiStaff />} />
                  <Route path="evaluasi/laporan-individu" element={<DraftLaporanIndividu />} />
                  <Route path="evaluasi/penugasan-evaluasi" element={<PenugasanEvaluasiSTAFFPDAS />} />
                  <Route path="evaluasi/penugasan-evaluasi/create/:id" element={<CreatePenugasanEvaluasiStaffPDAS />} />
                  <Route path="evaluasi/tugas-masuk" element={<StaffTugasEvaluasi />} />
                </Route>
              </Route>

              {/* KABID PDAS */}
              <Route element={<RoleGuard allowedRoles={[ROLES.KABID, ROLES.SUPERADMIN]} />}>
                <Route path="kabid">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardKabid />} />

                  {/* Analisis CPI */}
                  <Route path="analisis-cpi/dashboard" element={<DashboardCPIKABID />} />
                  <Route path="analisis-cpi/dashboard/detail/:id" element={<DetailCPIKABID />} />
                  <Route path="analisis-cpi/hasil-validasi-lokasi" element={<HasilValidasiLokasi />} />
                  <Route path="analisis-cpi/hasil-validasi-lokasi/detail/:id" element={<DetailHasilValidasi />} />
                  <Route path="analisis-cpi/hasil-validasi-lokasi/proses/:id" element={<ProsesValidasiPenyuluh />} />

                  {/* Donasi */}
                  <Route path="donasi/dashboard" element={<DashhboardProgramKabid />} />
                  <Route path="donasi/program" element={<DataProgramKabid />} />

                  {/* Rehabilitasi */}
                  <Route path="rehabilitasi/program-apbd" element={<DaftarUsulanAPBD />} />
                  <Route path="rehabilitasi/program-apbd/verifikasi/:id" element={<VerifikasiAPBD />} />
                  <Route path="rehabilitasi/validasi-csr" element={<DaftarUsulanCSR />} />
                  <Route path="rehabilitasi/validasi-csr/verifikasi/:id" element={<VerifikasiCSR />} />
                  <Route path="rehabilitasi/verifikasi-dana-csr" element={<VerifikasiDanaCSRKABID />} />
                  <Route path="rehabilitasi/verifikasi-dana-csr/detail/:id" element={<DetailVerifikasiDanaCSRKABID />} />
                  <Route path="rehabilitasi/riwayat-keputusan" element={<RiwayatKeputusan />} />
                  <Route path="rehabilitasi/laporan-dana" element={<LaporanDanaIndexKABID />} />
                  <Route path="rehabilitasi/laporan-dana/detail/:id" element={<DetailLaporanDanaKABID />} />
                  <Route path="rehabilitasi/riwayat-rehabilitasi" element={<RiwayatRehabilitasiKABID />} />
                  <Route path="rehabilitasi/riwayat-rehabilitasi/detail/:id" element={<DetailRiwayatRehabilitasiKABID />} />

                  {/* Monitoring */}
                  <Route path="monitoring/dashboard" element={<DashboardPelaksanaanMonitoringKabid />} />
                  <Route path="monitoring/dashboard/detail/:id" element={<DetailPelaksanaanProgramKabid />} />
                  
                  {/* Evaluasi */}
                  <Route path="evaluasi/penugasan" element={<InisiasiPenugasanEvaluasiKABID />} />
                  <Route path="evaluasi/penugasan/create" element={<CreateInisiasiPenugasanEvaluasiKABID />} />
                  <Route path="evaluasi/penugasan/detail/:id" element={<DetailInisiasiPenugasan />} />
                  <Route path="evaluasi/validasi-evaluasi" element={<ValidasiDataEvaluasiKABID />} />
                  <Route path="evaluasi/validasi-evaluasi/detail/:id" element={<DetailEvaluasiDataEvaluasiKABID />} />
                  <Route path="evaluasi/validasi-evaluasi/detail/:id" element={<DetailEvaluasiDataEvaluasiKABID />} />
                  <Route path="evaluasi/laporan" element={<LaporanEvaluasiKABID />} />
                  <Route path="evaluasi/laporan/pengesahan/:id" element={<PengesahanLaporanEvaluasiKabid />} />
                  <Route path="evaluasi/laporan/detail/:id" element={<DetailLaporanEvaluasiKABID />} />

                  {/* blm fixx */}
                  {/* <Route path="evaluasi/laporan" element={<PengesahanLaporanKABID />} />
                  <Route path="evaluasi/laporan/:id" element={<CreatePengesahanLaporanKabid />} />
                  <Route path="evaluasi/laporan/:id" element={<CreatePengesahanLaporanKabid />} />
                  <Route path="evaluasi/verifikasi-laporan" element={<KabidVerifikasiBAP />} /> */}
                  {/* blm fixx */}

                  <Route path="manajemen-akun/data-pengguna" element={<DataPengguna />} />
                  <Route path="manajemen-akun/data-pengguna/detail/:id" element={<DetailPengguna />} />
                  <Route path="manajemen-akun/data-peran-pengguna" element={<DataPeranPengguna />} />
                  <Route path="manajemen-akun/data-peran-pengguna/detail/:id" element={<DetailRole />} />
                  <Route path="manajemen-akun/data-hak-akses" element={<DataHakAkses />} />
                  <Route path="manajemen-akun/data-hak-akses/detail/:id" element={<DetailHakAkses />} />
                </Route>
              </Route>

              {/* KTH */}
              <Route element={<RoleGuard allowedRoles={[ROLES.KTH]} />}>
                <Route path="kth">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardKTH />} />
                  <Route path="rehabilitasi/pendanaan-csr" element={<PendanaanCSR />} />
                  <Route path="rehabilitasi/pendanaan-csr/create" element={<AjukanProgramCSR />} />
                  <Route path="rehabilitasi/pendanaan-csr/edit/:id" element={<EditProgramCSR />} />
                  <Route path="rehabilitasi/pendanaan-csr/detail/:id" element={<DetailPendanaanCSR />} />
                  <Route path="rehabilitasi/pendanaan-apbd" element={<PendanaanAPBD />} />
                  <Route path="rehabilitasi/pendanaan-apbd/detail/:id" element={<DetailPendanaanAPBD />} />
                  <Route path="rehabilitasi/riwayat" element={<RiwayatRehabilitasi />} />
                  <Route path="rehabilitasi/riwayat/detail/:id" element={<DetailRiwayatRehabilitasi />} />
                  <Route path="rehabilitasi/riwayat-pengajuan" element={<RiwayatPengajuan />} />
                  <Route path="rehabilitasi/update-progres" element={<UpdateProgres />} />
                  <Route path="rehabilitasi/laporan-dana" element={<LaporanDanaIndex />} />
                  <Route path="rehabilitasi/laporan-dana/create" element={<CreateLaporanDana />} />
                  <Route path="rehabilitasi/laporan-dana/edit/:id" element={<CreateLaporanDana />} />
                  <Route path="rehabilitasi/laporan-dana/detail/:id" element={<DetailLaporanDana />} />
                  <Route path="investasi/data" element={<DataInvestasiKTH />} />
                  <Route path="investasi/data/create" element={<CreateInvestasi />} />
                  <Route path="investasi/data/detail/:id" element={<DetailInvestasiKTH />} />
                  <Route path="investasi/persetujuan" element={<PersetujuanInvestasi />} />
                  <Route path="investasi/persetujuan/detail/:id" element={<DetailPersetujuan />} />
                  <Route path="investasi/investor" element={<DataInvestorIndexKTH />} />
                  <Route path="investasi/investor/detail/:id" element={<DetailInvestorKTH />} />
                  <Route path="laporan-investasi/laporan-proyek" element={<LaporanProyekIndexKTH />} />
                  <Route path="laporan-investasi/laporan-proyek/create" element={<CreateLaporanProyek />} />
                  <Route path="laporan-investasi/laporan-proyek/detail/:id" element={<DetailLaporanProyekKTH />} />
                  <Route path="laporan-investasi/usaha" element={<LaporanUsaha />} />
                  <Route path="laporan-investasi/usaha/create" element={<CreateLaporanUsaha />} />
                  <Route path="laporan-investasi/keuangan" element={<LaporanKeuangan />} />
                  <Route path="laporan-investasi/keuangan/create" element={<CreateLaporanKeuangan />} />
                  <Route path="laporan-investasi/keuangan/edit/:id" element={<EditLaporanKeuangan />} />
                  <Route path="laporan-investasi/keuangan/detail/:id" element={<DetailLaporanKeuanganKTH />} />
                  <Route path="laporan-investasi/pengeluaran" element={<BiayaPengeluaranIndex />} />
                  <Route path="laporan-investasi/pengeluaran/create" element={<CreateLaporanBiayaPengeluaran />} />
                  <Route path="laporan-investasi/pemasukan" element={<BiayaPemasukanIndex />} />
                  <Route path="laporan-investasi/pemasukan/create" element={<BiayaPemasukanCreate />} />
                  <Route path="saldo/keuntungan" element={<SaldoKeuntungan />} />
                  <Route path="saldo/isi" element={<IsiSaldo />} />
                  <Route path="saldo/riwayat-transaksi" element={<RiwayatTransaksi />} />
                  <Route path="saldo/tarik" element={<TarikSaldo />} />
                </Route>
              </Route>

              {/* CSR */}
              <Route element={<RoleGuard allowedRoles={[ROLES.CSR]} />}>
                <Route path="csr">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardCSR />} />
                  <Route path="tinjau-proposal" element={<TinjauProposal />} />
                  <Route path="tinjau-proposal/detail/:id" element={<DetailTinjauProposal />} />
                  <Route path="pendanaan/:id" element={<PendanaanProgram />} />
                  <Route path="riwayat-pendanaan" element={<RiwayatPendanaan />} />
                  <Route path="riwayat-pendanaan/detail/:id" element={<DetailRiwayatPendanaan />} />
                  <Route path="monitoring-proyek" element={<MonitoringProyek />} />
                  <Route path="laporan-keuangan" element={<LaporanKeuanganIndex />} />
                  <Route path="laporan-keuangan/detail/:id" element={<DetailLaporanKeuangan />} />
                </Route>
              </Route>

              {/* Staff BUPM */}
              <Route element={<RoleGuard allowedRoles={[ROLES.STAFFBUPM]} />}>
                <Route path="staff/bupm">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardStaffBUPM />} />
                  <Route path="data-investasi" element={<DataInvestasi />} />
                  <Route path="data-investasi/konfirmasi/:id" element={<DetailInvestasi />} />
                  <Route path="data-investasi/detail/:id" element={<DetailInvestasi />} />
                  <Route path="data-investor" element={<DataInvestorIndex />} />
                  <Route path="data-investor/detail/:id" element={<DetailInvestor />} />
                  <Route path="laporan-proyek" element={<LaporanProyekIndex />} />
                  <Route path="laporan-proyek/detail/:id" element={<DetailLaporanProyekStaffBUPM />} />
                  <Route path="laporan-keuangan" element={<LaporanKeuanganStaffBUPM />} />
                  <Route path="laporan-keuangan/detail/:id" element={<DetailLaporanKeuanganStaffBUPM />} />
                </Route>
              </Route>

              {/* Kabid BUPM */}
              <Route element={<RoleGuard allowedRoles={[ROLES.KABIDBUPM]} />}>
                <Route path="kabid/bupm">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardKABIDBUPM />} />
                  <Route path="data-investasi" element={<DataInvestasiKABIDBUPM />} />
                  <Route path="data-investasi/validasi/:id" element={<DetailInvestasiKABIDBUPM />} />
                  <Route path="data-investasi/detail/:id" element={<DetailInvestasiKABIDBUPM />} />
                  <Route path="data-investor" element={<DataInvestorIndexKABIDBUPM />} />
                  <Route path="data-investor/detail/:id" element={<DetailInvestorKABIDBUPM />} />
                  <Route path="laporan-proyek" element={<LaporanProyekIndexKABIDBUPM />} />
                  <Route path="laporan-proyek/detail/:id" element={<DetailLaporanProyekKABIDBUPM />} />
                  <Route path="laporan-keuangan" element={<LaporanKeuanganKABIDBUPM />} />
                  <Route path="laporan-keuangan/detail/:id" element={<DetailLaporanKeuanganKABIDBUPM />} />
                </Route>
              </Route>

              {/* Penyuluh */}
              <Route element={<RoleGuard allowedRoles={["penyuluh"]} />}>
                <Route path="penyuluh">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPenyuluh />} />
                  <Route path="validasi-lokasi" element={<ValidasiLokasi />} />
                  <Route path="validasi-lokasi/create/:id" element={<CreateValidasi />} />
                  <Route path="validasi-lokasi/detail/:id" element={<DetailValidasi />} />
                  <Route path="pelaksanaan-penanaman" element={<PelaksanaanPenanamanIndex />} />
                  <Route path="pelaksanaan-penanaman/create/:id" element={<InputProgresPage />} />
                  <Route path="pelaksanaan-penanaman/mulai/:id" element={<MulaiKegiatan />} />
                  <Route path="pelaksanaan-penanaman/input-data" element={<PelaksanaanWizard />} />
                  <Route path="pelaksanaan-penanaman/input-data/:id" element={<PelaksanaanWizard />} />
                  <Route path="monitoring-program" element={<MonitoringProgramRehabilitasi />} />
                  <Route path="monitoring-program/detail/:id" element={<DetailMonitoringProgram />} />
                  <Route path="monitoring-lanjutan" element={<MonitoringLanjutanIndex />} />
                  <Route path="monitoring-lanjutan/form/:id" element={<FormMonitoringPage />} />
                </Route>
              </Route>

              {/* KTH Pelaksanaan */}
              <Route element={<RoleGuard allowedRoles={[ROLES.KTH_PELAKSANAAN]} />}>
                <Route path="kth-pelaksanaan">
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardKTHPelaksanaan />} />
                  <Route path="dashboard/penanaman/:id" element={<DetailPenugasanPenanaman />} />
                  <Route path="dashboard/penyulaman/:id" element={<DetailPenugasanPenyulaman />} />
                </Route>
              </Route>
              
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CustomToaster />
    </BrowserRouter>
  );
}

export default App;