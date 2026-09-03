import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import MapSection from './components/MapSection';
import CPITable from './components/CPITable';
import toast from 'react-hot-toast';
import type { CPIDataRow, SummaryStats } from './types';
import { getLatestProjectAPI, getMapCPIAPI, getTableCPIAPI } from '@/services/gisService';
import * as turf from '@turf/turf'; 

const DashboardCPISTAFF: React.FC = () => {
  const [periode, setPeriode] = useState<string>('2021-2026');
  
  const [projectId, setProjectId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<CPIDataRow[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [stats, setStats] = useState<SummaryStats>({
    totalLuas: '0 Ha',
    totalKritis: '0 Lokasi',
    totalSangatKritis: '0 Lokasi',
    totalWilayahPrioritas: 0,
    luasWilayahPrioritas: '0 Ha',
    analisisTerakhir: '-',
  });

  // 1. Fetch Initial Project
  useEffect(() => {
    const fetchInitialProject = async () => {
      setIsLoading(true);
      try {
        const projectRes = await getLatestProjectAPI();
        const projectData = projectRes.payload || projectRes.data || [];
        
        if (projectData.length > 0) {
          setProjectId(projectData[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Gagal memuat project awal:", error);
        setIsLoading(false);
      }
    };
    fetchInitialProject();
  }, [periode]);

  // 2. Fetch Data (Table & Map)
  useEffect(() => {
    if (!projectId) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [tableRes, mapRes] = await Promise.all([
          getTableCPIAPI(projectId),
          getMapCPIAPI(projectId)
        ]);

        // Parsing Peta (GeoJSON) DULU agar bisa dipakai fallback perhitungan luas
        let finalGeoData = null;
        if (mapRes.type === "FeatureCollection") {
          finalGeoData = mapRes;
        } else if (mapRes.geojson_url) {
          const directGeoRes = await fetch(mapRes.geojson_url);
          finalGeoData = await directGeoRes.json();
        } else if (mapRes.payload && mapRes.payload.geojson_url) {
          const directGeoRes = await fetch(mapRes.payload.geojson_url);
          finalGeoData = await directGeoRes.json();
        }
        
        setGeoData(finalGeoData);

        // Parsing Tabel & Kalkulasi Statistik
        let tLuas = 0;
        let countKritis = 0; // Menghitung JUMLAH LOKASI
        let countSangatKritis = 0; // Menghitung JUMLAH LOKASI
        let luasPrioritas = 0; // Menghitung total luas area yang kritis/sangat kritis
        
        const rawTableRows = tableRes.payload || tableRes.data || [];
        
        const mappedTable = rawTableRows.map((row: any, idx: number) => {
          // Ambil luas_ha dari API tabel
          let luas = parseFloat(row.luas_ha || 0);

          // Fallback: Jika luas_ha 0, hitung otomatis dari poligon peta menggunakan Turf.js
          if (!luas && finalGeoData?.features?.[idx]) {
             try {
                 luas = turf.area(finalGeoData.features[idx]) / 10000; // Konversi m2 ke Hektar
             } catch(e) {
                 luas = 0;
             }
          }

          tLuas += luas;

          const status = row.status_lahan_kritis || row.status || '';

          if (status === 'Kritis') {
            countKritis += 1;       // Tambah 1 lokasi
            luasPrioritas += luas;  // Tambah luas lahan ke prioritas
          } else if (status === 'Sangat Kritis') {
            countSangatKritis += 1; // Tambah 1 lokasi
            luasPrioritas += luas;  // Tambah luas lahan ke prioritas
          }

          return {
            id: row.zone_id || idx.toString(),
            kabupaten: row.kota_kabupaten || row.kabupaten || '-',
            kecamatan: row.kecamatan || '-',
            desa: row.desa_kelurahan || row.desa || '-',
            statusLahan: status || '-',
            skorCPI: row.skor_cpi_rata2 ? Number(row.skor_cpi_rata2).toFixed(2) : (row.skor_cpi ? Number(row.skor_cpi).toFixed(2) : '-'),
            rekomendasi: row.rekomendasi_intervensi || '-',
            statusVerifikasi: row.status_validasi_penyuluh || 'Belum Verifikasi', 
          };
        });

        setTableData(mappedTable);
        
        // Helper untuk format angka dengan koma
        const formatNum = (val: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val);

        setStats({
          totalLuas: `${formatNum(tLuas)} Ha`,
          totalKritis: `${countKritis} Lokasi`,         // Berdasarkan jumlah lokasi
          totalSangatKritis: `${countSangatKritis} Lokasi`, // Berdasarkan jumlah lokasi
          totalWilayahPrioritas: countKritis + countSangatKritis,
          luasWilayahPrioritas: `${formatNum(luasPrioritas)} Ha`,
          analisisTerakhir: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        });

      } catch (error: any) {
        toast.error("Gagal memuat data dashboard. Pastikan endpoint API sudah benar.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [projectId]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto animate-in fade-in duration-500">
      <DashboardHeader 
        periode={periode} 
        setPeriode={setPeriode} 
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#185325]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#185325] mb-4"></div>
          <p className="font-bold">Memuat Data Dashboard STAFF...</p>
        </div>
      ) : (
        <>
          <SummaryCards stats={stats} />
          <MapSection geoData={geoData} isLoading={isLoading} />
          <CPITable 
            data={tableData} 
          />
        </>
      )}
    </div>
  );
};

export default DashboardCPISTAFF;