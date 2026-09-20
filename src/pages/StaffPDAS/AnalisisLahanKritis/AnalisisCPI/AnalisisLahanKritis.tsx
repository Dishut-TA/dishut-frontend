import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { HiOutlineClock } from 'react-icons/hi2';
import type { CPIDataRow } from './types';
import MapSection from './components/MapSection';
import CPITable from './components/CPITable';
import InputDataModal from './components/InputDataModal';
import DetailVerifikasiModal from './components/DetailVerifikasiModal';
import HistoryModal from './components/HistoryModal';
import {
  getLatestProjectAPI,
  getMapCPIAPI,
  getProjectAPI,
  getProjectEditDataAPI,
  getTableCPIAPI,
} from '@/services/gisService';
import { ToastError } from '@/utils/toastHelper';

const asPlantList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const AnalisisLahanKritis: React.FC = () => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CPIDataRow | null>(null);
  const [petaFilter, setPetaFilter] = useState('Keseluruhan');
  const [geoData, setGeoData] = useState<any>(null);
  const [tableData, setTableData] = useState<CPIDataRow[]>([]);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [editProjectData, setEditProjectData] = useState<any | null>(null);
  const [isPreparingEdit, setIsPreparingEdit] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const mapRowsWithGeometry = (rawRows: any[], finalGeoData: any): CPIDataRow[] => {
    const features = Array.isArray(finalGeoData?.features) ? finalGeoData.features : [];
    const featureByZone = new Map<string, any>();

    features.forEach((feature: any) => {
      const zoneId = feature?.properties?.zone_id;
      if (zoneId !== undefined && zoneId !== null) {
        featureByZone.set(String(zoneId), feature);
      }
    });

    return rawRows.map((row: any, idx: number) => {
      const zoneId = row.zone_id ?? idx;
      const feature = featureByZone.get(String(zoneId)) ?? features[idx];
      const props = feature?.properties ?? {};

      let latitude = row.latitude ?? row.lat ?? row.centroid_lat ?? '-';
      let longitude = row.longitude ?? row.lng ?? row.lon ?? row.centroid_lng ?? '-';
      const luas = row.luas_ha ?? row.luas ?? props.luas_ha ?? props.luas ?? '-';

      if (feature && (latitude === '-' || longitude === '-' || latitude === null || longitude === null)) {
        try {
          const centroid = turf.centerOfMass(feature);
          longitude = centroid.geometry.coordinates[0];
          latitude = centroid.geometry.coordinates[1];
        } catch {
          // Koordinat tabel tetap '-' jika geometri tidak dapat dihitung centroid-nya.
        }
      }

      return {
        id: zoneId,
        kabupaten: row.kota_kabupaten || row.kabupaten || '-',
        kecamatan: row.kecamatan || '-',
        desa: row.desa_kelurahan || row.desa || '-',
        statusKekritisan: row.status_lahan_kritis || row.status || '-',
        skorCPI: row.skor_cpi_rata2 !== undefined && row.skor_cpi_rata2 !== null
          ? Number(row.skor_cpi_rata2).toFixed(2)
          : (row.skor_cpi !== undefined && row.skor_cpi !== null ? Number(row.skor_cpi).toFixed(2) : '-'),
        rekomendasi: row.rekomendasi_intervensi || '-',
        rekomendasiTanaman: asPlantList(row.rekomendasi_tanaman ?? props.rekomendasi_tanaman),
        rekomendasiTanamanAlasan: row.rekomendasi_tanaman_alasan ?? props.rekomendasi_tanaman_alasan ?? null,
        rekomendasiTanamanRule: row.rekomendasi_tanaman_rule ?? null,
        cdk: row.cdk || props.cdk || '-',
        namaKth: row.nama_kelompok || props.nama_kelompok || 'Belum ada',
        ketuaKth: row.ketua_kelompok || props.ketua_kelompok || '-',
        statusKelayakan: row.status_kelayakan || 'Belum Diverifikasi',
        luas,
        latitude,
        longitude,
      };
    });
  };

  const loadProjectData = async (projectId: number) => {
    if (!projectId) return;

    setIsLoadingData(true);
    try {
      const [projectJson, tableJson, mapJson] = await Promise.all([
        getProjectAPI(projectId),
        getTableCPIAPI(projectId),
        getMapCPIAPI(projectId),
      ]);

      const project = projectJson?.data ?? projectJson;
      const rawRows = tableJson?.data || tableJson?.payload || [];

      let finalGeoData: any = null;
      if (mapJson?.type === 'FeatureCollection') {
        finalGeoData = mapJson;
      } else if (mapJson?.geojson_url && /^https?:\/\//i.test(mapJson.geojson_url)) {
        const directGeoRes = await fetch(mapJson.geojson_url);
        if (directGeoRes.ok) finalGeoData = await directGeoRes.json();
      }

      setActiveProject(project);
      setGeoData(finalGeoData);
      setTableData(mapRowsWithGeometry(rawRows, finalGeoData));
    } catch (error) {
      console.error('Gagal menarik data hasil analisis:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const fetchLatestProject = async () => {
      try {
        setIsLoadingData(true);
        const json = await getLatestProjectAPI();
        const latest = json?.data?.[0];
        if (latest?.id) {
          await loadProjectData(latest.id);
        } else {
          setActiveProject(null);
          setGeoData(null);
          setTableData([]);
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error('Gagal load project awal:', error);
        setIsLoadingData(false);
      }
    };

    fetchLatestProject();
  }, []);

  const handleOpenDataModal = async () => {
    // Belum ada project aktif = alur input baru, tidak perlu GET data lama.
    if (!activeProject?.id) {
      setEditProjectData(null);
      setIsInputModalOpen(true);
      return;
    }

    // MODE EDIT: GET WAJIB selesai lebih dulu. Modal baru dibuka setelah backend
    // mengembalikan nama project + metadata seluruh indikator aktif.
    setIsPreparingEdit(true);
    try {
      const response = await getProjectEditDataAPI(activeProject.id);
      const detail = response?.data ?? response;

      if (!detail?.id || !detail?.indicators) {
        throw new Error('Response data edit project tidak lengkap.');
      }

      setEditProjectData(detail);
      setIsInputModalOpen(true);
    } catch (error: any) {
      console.error('Gagal GET data indikator sebelum edit:', error);
      setEditProjectData(null);
      ToastError(error?.message || 'Gagal mengambil data indikator sebelumnya.');
    } finally {
      setIsPreparingEdit(false);
    }
  };

  const handleAnalysisSuccess = async (responseData: any) => {
    const projectId = responseData?.data?.id ?? activeProject?.id;
    if (projectId) {
      await loadProjectData(Number(projectId));
    }
  };

  const handleViewDetail = (row: CPIDataRow) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full max-w-screen-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Analisis Conservation Priority Index (CPI)
          </h1>
          {activeProject && (
            <p className="text-xs text-gray-500 mt-1">
              Data peta aktif: <span className="font-semibold text-[#185325]">{activeProject.nama_project || activeProject.kode_project}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
        onOpenInputModal={handleOpenDataModal}
        tableData={tableData}
        petaFilter={petaFilter}
        actionLabel={activeProject ? 'Edit Data Peta' : 'Input Data Indikator'}
        activeProjectName={activeProject?.nama_project ?? null}
        actionLoading={isPreparingEdit}
      />

      <CPITable data={tableData} onViewDetail={handleViewDetail} />

      <InputDataModal
        isOpen={isInputModalOpen}
        onClose={() => { setIsInputModalOpen(false); setEditProjectData(null); }}
        onSuccess={handleAnalysisSuccess}
        project={activeProject?.id ? editProjectData : null}
      />

      <DetailVerifikasiModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectProject={loadProjectData}
        activeProjectId={activeProject?.id}
      />
    </div>
  );
};

export default AnalisisLahanKritis;
