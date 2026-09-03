import React from 'react';
import { 
  HiOutlineDocumentArrowDown, 
  HiOutlineFunnel,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineMapPin,
  HiOutlineChartBar,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

// Import MUI BarChart
import { BarChart } from '@mui/x-charts/BarChart';

// Import Data & Components
import { chartData, aggregateData, performanceData, historyData } from './data';
import StatCard from '../components/StatCard';
import MiniProgressBar from '../components/MiniProgressBar';

const RekapMonitoring: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-customBlack mb-1">Rekap Monitoring</h1>
          <p className="text-greyadmin text-sm">Statistik dan rekapitulasi data monitoring strategis</p>
        </div>
        <button className="bg-primary hover:bg-[#113d1b] text-customWhite px-5 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <HiOutlineDocumentArrowDown className="w-5 h-5" />
          Ekspor PDF/Excel
        </button>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Laporan" value="3" icon={<HiOutlineClipboardDocumentList className="w-6 h-6"/>} bgColor="bg-blue-50" textColor="text-blue-600" />
        <StatCard title="Penyuluh Aktif" value="5" icon={<HiOutlineUserGroup className="w-6 h-6"/>} bgColor="bg-purple-50" textColor="text-purple-600" />
        <StatCard title="Total Wilayah (CDK)" value="3" icon={<HiOutlineMapPin className="w-6 h-6"/>} bgColor="bg-greenAdmin" textColor="text-primary" />
        <StatCard title="AVG Progress" value="68%" icon={<HiOutlineChartBar className="w-6 h-6"/>} bgColor="bg-gray-100" textColor="text-customBlack" />
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="bg-customWhite rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineFunnel className="w-5 h-5 text-customBlack" />
          <h2 className="font-bold text-customBlack">Filter Wilayah Rekapitulasi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['CDK Wilayah', 'Kota/Kabupaten', 'Kecamatan', 'Desa/Kelurahan'].map((label) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-greyadmin">{label}</label>
              <select className="w-full bg-gray-50 border border-gray-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Semua</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* --- MIDDLE SECTION: CHART & AGGREGATE TABLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kiri: Bar Chart (Menggunakan MUI x-charts) */}
        <div className="bg-customWhite rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-customBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            <h2 className="font-bold text-customBlack">Grafik Sebaran Kegiatan</h2>
          </div>
          <div className="h-62.5 w-full">
            <BarChart
              dataset={chartData}
              xAxis={[
                { 
                  scaleType: 'band', 
                  dataKey: 'name',
                  tickLabelStyle: { fontSize: 11, fill: '#939393' }
                }
              ]}
              yAxis={[
                {
                  tickLabelStyle: { fontSize: 11, fill: '#939393' }
                }
              ]}
              series={[
                { 
                  dataKey: 'total', 
                  color: '#89CE8C', // Menggunakan warna sekunder hijau terang agar sesuai desain
                }
              ]}
              margin={{ top: 10, right: 10, left: 30, bottom: 25 }}
              sx={{
                // Opsional: Menyembunyikan garis border bawaan MUI Chart agar terlihat lebih bersih
                '& .MuiChartsAxis-line': { stroke: 'transparent' },
                '& .MuiChartsAxis-tick': { stroke: 'transparent' },
              }}
            />
          </div>
        </div>

        {/* Kanan: Tabel Detail Agregat */}
        <div className="bg-customWhite rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-customBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <h2 className="font-bold text-customBlack">Detail Agregat Wilayah</h2>
          </div>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-700 bg-greenAdmin rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap">Wilayah</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Total Laporan</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg whitespace-nowrap">AVG Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {aggregateData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-customBlack whitespace-nowrap">{item.wilayah}</td>
                    <td className="px-4 py-3 text-center font-medium text-customBlack">{item.total}</td>
                    <td className="px-4 py-3"><MiniProgressBar progress={item.avg} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- REKAP KINERJA PENYULUH --- */}
      <div className="bg-customWhite rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUserGroup className="w-5 h-5 text-customBlack" />
          <h2 className="font-bold text-customBlack">Rekap Kinerja Penyuluh / Pelaksana</h2>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left min-w-175">
            <thead className="text-gray-700 bg-greenAdmin">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap">Nama Pelaksana</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Area Cakupan</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Program Kegiatan</th>
                <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Laporan Masuk</th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg whitespace-nowrap">Rata-rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {performanceData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-customBlack whitespace-nowrap">{item.nama}</td>
                  <td className="px-4 py-4 text-customBlack whitespace-nowrap">{item.area}</td>
                  <td className="px-4 py-4 text-customBlack whitespace-nowrap">{item.program}</td>
                  <td className="px-4 py-4 text-center font-medium text-customBlack">{item.laporan}</td>
                  <td className="px-4 py-4 min-w-30"><MiniProgressBar progress={item.avg} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- RIWAYAT MONITORING (TIMELINE) --- */}
      <div className="bg-customWhite rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-customBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          <h2 className="font-bold text-customBlack">Riwayat Monitoring Terbaru (Global)</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {historyData.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow bg-gray-50/50">
              <div className="mt-1">
                <HiOutlineCheckCircle className={`w-6 h-6 ${item.status === 'Verified' ? 'text-primary' : 'text-[#D85B1A]'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-customBlack">{item.title}</h3>
                <p className="text-xs text-greyadmin mt-1">{item.desc}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  item.status === 'Verified' ? 'bg-greenAdmin text-primary' : 'bg-[#FDE2D3] text-[#D85B1A]'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default RekapMonitoring;