import React, { useEffect, useState } from 'react';
import type { CPIDataRow } from './types'; 
import MapSection from './components/MapSection'; 
import CPITable from './components/CPITable'; 
import InputDataModal from './components/InputDataModal'; 
import DetailVerifikasiModal from './components/DetailVerifikasiModal'; 
import HistoryModal from './components/HistoryModal'; 
import { HiOutlineClock } from 'react-icons/hi2';
import * as turf from '@turf/turf';

const API_URL = "http://127.0.0.1:8000/api"; 

const AnalisisLahanKritis: React.FC = () => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CPIDataRow | null>(null);
  const [petaFilter, setPetaFilter] = useState('Keseluruhan');
  const [geoData, setGeoData] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchLatestProject = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setIsLoadingData(true);
        const res = await fetch(`${API_URL}/projects?status=completed&per_page=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        console.log("=== PROJECT TERBARU ===");
        console.log("Response projects:", json);
        console.log("Project pertama:", json.data?.[0]);

        if (json.data && json.data.length > 0) {
          loadHistoryData(json.data[0].id);
        } else {
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("Gagal load project awal:", error);
        setIsLoadingData(false);
      }
    };

    fetchLatestProject();
  }, []);

  const loadHistoryData = async (projectId: number) => {
      const token = localStorage.getItem("token");
      if (!projectId || !token) return;

      setIsLoadingData(true);

      try {
          const tableRes = await fetch(`${API_URL}/projects/${projectId}/table`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const tableJson = await tableRes.json();
          
          const rawRows = tableJson.data || tableJson.payload || [];
          let mappedTableData: any[] = rawRows.map((row: any, idx: number) => ({
              id: row.zone_id || idx, 
              kabupaten: row.kota_kabupaten || row.kabupaten || '-',
              kecamatan: row.kecamatan || '-',
              desa: row.desa_kelurahan || row.desa || '-',
              statusKekritisan: row.status_lahan_kritis || row.status || '-',
              skorCPI: row.skor_cpi_rata2 ? Number(row.skor_cpi_rata2).toFixed(2) : (row.skor_cpi ? Number(row.skor_cpi).toFixed(2) : '-'),
              rekomendasi: row.rekomendasi_intervensi || '-',
              cdk: row.cdk || '-',
              namaKth: row.nama_kelompok || 'Belum ada',
              ketuaKth: row.ketua_kelompok || '-',
              statusKelayakan: 'Layak',
              luas: row.luas_ha || row.luas || '-',
              latitude: row.latitude || row.lat || row.centroid_lat || '-',
              longitude: row.longitude || row.lng || row.lon || row.centroid_lng || '-',
          }));
          
          const mapRes = await fetch(`${API_URL}/projects/${projectId}/map`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const mapJson = await mapRes.json();

          let finalGeoData = null;
          if (mapJson.type === "FeatureCollection") {
              finalGeoData = mapJson;
          } else if (mapJson.geojson_url) {
              const directGeoRes = await fetch(mapJson.geojson_url);
              finalGeoData = await directGeoRes.json();
          }
          
          setGeoData(finalGeoData);

          if (finalGeoData && finalGeoData.features) {
             mappedTableData = mappedTableData.map((row, idx) => {
                 const feature = finalGeoData.features[idx]; 
                 if (feature) {
                     const props = feature.properties || {};
                     let newLat = row.latitude;
                     let newLng = row.longitude;
                     let newLuas = row.luas;

                     if (newLuas === '-') {
                         newLuas = props.luas_ha || props.luas || '-';
                     }

                     if (newLat === '-' || newLng === '-') {
                         try {
                             const centroid = turf.centerOfMass(feature);
                             newLng = centroid.geometry.coordinates[0];
                             newLat = centroid.geometry.coordinates[1];
                         } catch (e) {
                             console.error("Gagal menghitung centroid untuk baris:", idx);
                         }
                     }
                     return { ...row, latitude: newLat, longitude: newLng, luas: newLuas };
                 }
                 return row;
             });
          }

          setTableData(mappedTableData);

      } catch (error) {
          console.error("Gagal menarik data hasil analisis:", error);
      } finally {
          setIsLoadingData(false);
      }
  };

  const handleUploadSuccess = async (responseData: any) => {
    const projectId = responseData?.data?.id;
    const token = localStorage.getItem("token");
    if (!projectId || !token) return;

    setIsLoadingData(true);
    try {
      const tableRes = await fetch(`${API_URL}/projects/${projectId}/table`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tableJson = await tableRes.json();

      const rawRows = tableJson.data || tableJson.payload || [];
      let mappedTableData: any[] = rawRows.map((row: any, idx: number) => ({
        id: row.zone_id && row.zone_id !== '-' ? row.zone_id : idx, 
        kabupaten: row.kota_kabupaten || row.kabupaten || '-',
        kecamatan: row.kecamatan || '-',
        desa: row.desa_kelurahan || row.desa || '-',
        statusKekritisan: row.status_lahan_kritis || row.status || '-',
        skorCPI: row.skor_cpi_rata2 ? Number(row.skor_cpi_rata2).toFixed(2) : (row.skor_cpi ? Number(row.skor_cpi).toFixed(2) : '-'),
        rekomendasi: row.rekomendasi_intervensi || '-',
        cdk: row.cdk || '-',
        namaKth: row.nama_kelompok || 'Belum ada',
        ketuaKth: row.ketua_kelompok || '-',
        statusKelayakan: 'Layak',
        luas: row.luas_ha || row.luas || '-',
        latitude: row.latitude || row.lat || row.centroid_lat || '-',
        longitude: row.longitude || row.lng || row.lon || row.centroid_lng || '-',
      }));

      const mapRes = await fetch(`${API_URL}/projects/${projectId}/map`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const mapJson = await mapRes.json();

      let finalGeoData = null;
      if (mapJson.type === "FeatureCollection") {
        finalGeoData = mapJson;
      } else if (mapJson.geojson_url) {
        const directGeoRes = await fetch(mapJson.geojson_url);
        finalGeoData = await directGeoRes.json();
      }
      
      setGeoData(finalGeoData);

      if (finalGeoData && finalGeoData.features) {
         mappedTableData = mappedTableData.map((row, idx) => {
             const feature = finalGeoData.features[idx]; 
             if (feature) {
                 const props = feature.properties || {};
                 let newLat = row.latitude;
                 let newLng = row.longitude;
                 let newLuas = row.luas;

                 if (newLuas === '-') {
                     newLuas = props.luas_ha || props.luas || '-';
                 }

                 if (newLat === '-' || newLng === '-') {
                     try {
                         const centroid = turf.centerOfMass(feature);
                         newLng = centroid.geometry.coordinates[0];
                         newLat = centroid.geometry.coordinates[1];
                     } catch (e) {
                         console.error("Gagal menghitung centroid untuk baris:", idx);
                     }
                 }
                 return { ...row, latitude: newLat, longitude: newLng, luas: newLuas };
             }
             return row;
         });
      }

      setTableData(mappedTableData);
    } catch (error) {
      console.error("Gagal menarik data hasil analisis dari server:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleViewDetail = (row: CPIDataRow) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full max-w-screen-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Analisis Conservation Priority Index (CPI)
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm active:scale-95"
          >
            <HiOutlineClock className="w-4 h-4 text-[#185325]" /> Riwayat Analisis
          </button>
          <label className="text-xs font-bold text-gray-700">Pilih Peta</label>
          <select
            value={petaFilter}
            onChange={(e) => setPetaFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-[#185325] focus:border-[#185325] block px-4 py-2 outline-none cursor-pointer shadow-sm min-w-37.5"
          >
            <option value="Keseluruhan">Keseluruhan</option>
            <option value="Prioritas">Prioritas</option>
          </select>
        </div>
      </div>

      <MapSection
        geoData={geoData}
        isLoading={isLoadingData}
        onOpenInputModal={() => setIsInputModalOpen(true)}
        tableData={tableData}
        petaFilter={petaFilter}
      />

      <CPITable
        data={tableData}
        onViewDetail={handleViewDetail}
      />

      <InputDataModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <DetailVerifikasiModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectProject={loadHistoryData}
      />
    </div>
  );
};

export default AnalisisLahanKritis;