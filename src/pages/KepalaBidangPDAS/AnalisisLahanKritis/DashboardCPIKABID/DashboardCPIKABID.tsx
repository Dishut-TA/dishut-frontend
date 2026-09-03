import React, { useState, useEffect } from 'react';
import type { SummaryStats, CPIDataRow } from './types';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import MapSection from './components/MapSection';
import CPITable from './components/CPITable';
import * as turf from '@turf/turf'; 

const API_URL = "http://127.0.0.1:8000/api";

const DashboardCPIKABID: React.FC = () => {
  const [periode, setPeriode] = useState<string>('2021-2026');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [tableData, setTableData] = useState<CPIDataRow[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Initial Project
  useEffect(() => {
    const fetchInitialProject = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const res = await fetch(`${API_URL}/projects?status=completed&per_page=1`, { headers });
        const json = await res.json();
        
        const projectData = json.payload || json.data || [];
        
        if (projectData.length > 0) {
          setProjectId(projectData[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Gagal memuat project awal:", error);
        setIsLoading(false);
      }
    };
    fetchInitialProject();
  }, [periode]);

  // Fetch Detail Dashboard Data (Table & Map)
  useEffect(() => {
    if (!projectId) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const [resultRes, tableRes, mapRes] = await Promise.all([
          fetch(`${API_URL}/projects/${projectId}/result`, { headers }).catch(() => null),
          fetch(`${API_URL}/projects/${projectId}/table`, { headers }),
          fetch(`${API_URL}/projects/${projectId}/map`, { headers })
        ]);

        const tableJson = await tableRes.json();
        const mapJson = await mapRes.json();
        let resultJson = null;
        if (resultRes && resultRes.ok) resultJson = await resultRes.json();

        // 1. Dapatkan GeoData terlebih dahulu
        let finalGeoData = null;
        if (mapJson.type === "FeatureCollection") {
          finalGeoData = mapJson;
        } else if (mapJson.geojson_url) {
          const directGeoRes = await fetch(mapJson.geojson_url);
          finalGeoData = await directGeoRes.json();
        } else if (mapJson.payload && mapJson.payload.geojson_url) {
          const directGeoRes = await fetch(mapJson.payload.geojson_url);
          finalGeoData = await directGeoRes.json();
        }
        setGeoData(finalGeoData);

        // 2. Mapping Table Data (DIBUAT SAMA LENGKAPNYA DENGAN STAFF AGAR PDF BISA BACA)
        const rawTableRows = tableJson.payload || tableJson.data || [];
        let mappedTable = rawTableRows.map((row: any, idx: number) => ({
          id: row.zone_id || idx.toString(),
          kabupaten: row.kota_kabupaten || row.kabupaten || '-',
          kecamatan: row.kecamatan || '-',
          desa: row.desa_kelurahan || row.desa || '-',
          statusLahan: row.status_lahan_kritis || row.status || '-', // Untuk tabel web Kabid
          statusKekritisan: row.status_lahan_kritis || row.status || '-', // Untuk bacaan PDF
          skorCPI: row.skor_cpi_rata2 ? Number(row.skor_cpi_rata2).toFixed(2) : (row.skor_cpi ? Number(row.skor_cpi).toFixed(2) : '-'),
          rekomendasi: row.rekomendasi_intervensi || '-',
          statusVerifikasi: row.status_verifikasi || 'Menunggu Verifikasi',
          // Data Pelengkap Untuk PDF
          cdk: row.cdk || '-',
          namaKth: row.nama_kelompok || '-',
          ketuaKth: row.ketua_kelompok || '-',
          luas: row.luas_ha || row.luas || '-',
          latitude: row.latitude || row.lat || row.centroid_lat || '-',
          longitude: row.longitude || row.lng || row.lon || row.centroid_lng || '-',
        }));

        // 3. Sinkronisasi Koordinat & Luas dari Map ke Tabel
        let calcTotalArea = 0;
        let calcKritisArea = 0;
        let calcSangatKritisArea = 0;

        if (finalGeoData && finalGeoData.features) {
          mappedTable = mappedTable.map((row: any, idx: number) => {
            const feature = finalGeoData.features[idx];
            if (feature) {
              const props = feature.properties || {};
              let newLat = row.latitude;
              let newLng = row.longitude;
              let newLuas = row.luas;

              // Ambil luas dari geojson jika di database kosong
              if (newLuas === '-') {
                newLuas = props.luas_ha || props.luas || '-';
              }

              // Kalkulasi Turf area
              let areaVal = Number(newLuas);
              if (!areaVal || isNaN(areaVal)) {
                try {
                  areaVal = turf.area(feature) / 10000;
                  newLuas = areaVal;
                } catch(e) {
                  areaVal = 0;
                }
              }

              calcTotalArea += areaVal;
              const status = (props.status_lahan_kritis || props.status || row.statusLahan).toLowerCase();
              if (status.includes('sangat kritis')) calcSangatKritisArea += areaVal;
              else if (status.includes('kritis')) calcKritisArea += areaVal;

              // Hitung centroid jika koordinat tidak ada
              if (newLat === '-' || newLng === '-') {
                try {
                  const centroid = turf.centerOfMass(feature);
                  newLng = centroid.geometry.coordinates[0];
                  newLat = centroid.geometry.coordinates[1];
                } catch (e) {
                  console.error("Gagal menghitung centroid");
                }
              }

              return { ...row, latitude: newLat, longitude: newLng, luas: newLuas };
            }
            return row;
          });
        }
        
        setTableData(mappedTable);

        // 4. Update Summary Stats
        const formatArea = (val: number) => {
            return val > 0 ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val) : '0';
        };

        const resultPayload = resultJson?.payload || resultJson?.data || resultJson?.hasil || {};
        
        setStats({
          totalLuas: `${resultPayload.total_area || formatArea(calcTotalArea)} Ha`,
          totalKritis: `${resultPayload.total_kritis || formatArea(calcKritisArea)} Ha`,
          totalSangatKritis: `${resultPayload.total_sangat_kritis || formatArea(calcSangatKritisArea)} Ha`,
          totalWilayahPrioritas: resultPayload.zone_count || rawTableRows.length || (finalGeoData?.features?.length || 0),
          luasWilayahPrioritas: `${resultPayload.priority_area || formatArea(calcTotalArea)} Ha`,
          analisisTerakhir: resultPayload.updated_at ? new Date(resultPayload.updated_at).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID'),
        });

      } catch (error) {
        console.error("Gagal menarik data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [projectId]);

  const handleApprove = (id: string) => {
    console.log('Kirim request approval untuk zone ID:', id);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto animate-in fade-in duration-500">
      <DashboardHeader periode={periode} setPeriode={setPeriode} />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#185325]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#185325] mb-4"></div>
          <p className="font-bold">Memuat Data Dashboard KABID...</p>
        </div>
      ) : (
        <>
          {stats && <SummaryCards stats={stats} />}
          <MapSection geoData={geoData} tableData={tableData} />
          <CPITable data={tableData} onApprove={handleApprove} />
        </>
      )}
    </div>
  );
};

export default DashboardCPIKABID;