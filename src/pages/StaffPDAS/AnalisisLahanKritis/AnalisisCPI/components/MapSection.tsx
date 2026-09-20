import React, { useEffect, useMemo, useRef } from 'react';
import {
  HiOutlineArrowPath,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { CPIDataRow } from '../types';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const FitBoundsToGeoJSON = ({ geoData }: { geoData: any }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData?.features?.length > 0) {
      const geoJsonLayer = L.geoJSON(geoData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [geoData, map]);

  return null;
};

interface MapSectionProps {
  geoData: any;
  isLoading: boolean;
  onOpenInputModal: () => void;
  tableData: CPIDataRow[];
  petaFilter: string;
  actionLabel?: string;
  activeProjectName?: string | null;
  actionLoading?: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  geoData,
  isLoading,
  onOpenInputModal,
  petaFilter,
  actionLabel = 'Input Data Indikator',
  activeProjectName,
  actionLoading = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const displayedGeoData = useMemo(() => {
    if (!geoData || petaFilter !== 'Prioritas') return geoData;
    return {
      ...geoData,
      features: (geoData.features || []).filter((feature: any) => {
        const status = String(feature?.properties?.status_lahan_kritis || feature?.properties?.status || '').toLowerCase();
        return status.includes('kritis') && !status.includes('tidak kritis');
      }),
    };
  }, [geoData, petaFilter]);

  const getFeatureStyle = (feature: any) => {
    const status = feature.properties?.status_lahan_kritis?.toLowerCase() || feature.properties?.status?.toLowerCase() || '';
    if (status.includes('sangat kritis')) return { color: '#EF4444', fillColor: '#ef4444', fillOpacity: 0.8, weight: 1.5 };
    if (status.includes('tidak kritis')) return { color: '#10B981', fillColor: '#4ade80', fillOpacity: 0.8, weight: 1.5 };
    if (status.includes('kritis')) return { color: '#F59E0B', fillColor: '#facc15', fillOpacity: 0.8, weight: 1.5 };
    return { color: '#10B981', fillColor: '#4ade80', fillOpacity: 0.8, weight: 1.5 };
  };

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const props = feature.properties || {};
    const desa = props.desa_kelurahan || props.desa || 'Desa Tidak Diketahui';
    layer.bindTooltip(`<div class="font-bold text-xs text-gray-800 font-sans">Desa ${desa}</div>`, {
      sticky: true,
      className: 'bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm rounded-md py-1 px-2',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6 relative">
      <style>{`
        .modern-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden;
          border-radius: 1rem !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #f3f4f6;
        }
        .modern-popup .leaflet-popup-content { margin: 0 !important; width: 300px !important; }
        .modern-popup .leaflet-popup-close-button { color: #9ca3af !important; padding: 12px 12px 0 0 !important; z-index: 20; }
        .modern-popup .leaflet-popup-tip { background: #f9fafb !important; border-left: 1px solid #e5e7eb; border-top: 1px solid #e5e7eb; }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Peta Prioritas Rehabilitasi Jawa Barat:</h2>
          <p className="text-xs text-gray-500">Conservation Priority Index (CPI)</p>
          {activeProjectName && (
            <p className="text-[11px] text-emerald-700 mt-1">Project aktif: <span className="font-semibold">{activeProjectName}</span></p>
          )}
        </div>
        <button
          onClick={onOpenInputModal}
          disabled={actionLoading}
          className={`w-full sm:w-auto bg-[#185325] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 ${actionLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#113d1b] cursor-pointer'}`}
        >
          {actionLoading ? 'Mengambil Data Lama...' : actionLabel}
          {actionLoading
            ? <HiOutlineArrowPath className="w-4 h-4 stroke-2 animate-spin" />
            : actionLabel.toLowerCase().includes('edit')
              ? <HiOutlinePencilSquare className="w-4 h-4 stroke-2" />
              : <HiOutlinePlus className="w-4 h-4 stroke-2" />}
        </button>
      </div>

      <div ref={mapContainerRef} className="w-full h-80 md:h-112.5 bg-blue-50/50 rounded-lg border border-blue-100 overflow-hidden relative flex items-center justify-center z-0 mb-4">
        {isLoading ? (
          <div className="flex flex-col items-center text-[#185325]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#185325] mb-3"></div>
            <span className="font-bold text-sm">Merender Peta Spasial...</span>
          </div>
        ) : displayedGeoData?.features?.length ? (
          <MapContainer center={[-6.9204, 107.6046]} zoom={9} style={{ height: '100%', width: '100%' }}>
            <FitBoundsToGeoJSON geoData={displayedGeoData} />
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON
              key={`${activeProjectName ?? 'project'}-${petaFilter}-${displayedGeoData.features.length}`}
              data={displayedGeoData}
              style={getFeatureStyle}
              onEachFeature={onEachFeatureHandler}
            />

            {displayedGeoData.features.map((feature: any, index: number) => {
              try {
                const centroid = turf.centerOfMass(feature);
                const [lng, lat] = centroid.geometry.coordinates;
                const props = feature.properties || {};
                const desa = props.desa_kelurahan || props.desa || 'Tidak Diketahui';
                const status = props.status_lahan_kritis || props.status || 'Tidak Diketahui';
                const skorCpi = props.skor_cpi_rata2 ?? props.cpi ?? '-';
                const luas = props.luas_ha ?? props.luas ?? '-';
                const kth = props.nama_kelompok || 'Belum ada data KTH';
                const ketua = props.ketua_kelompok || '-';
                const cdk = props.cdk || '-';
                const plants = Array.isArray(props.rekomendasi_tanaman) ? props.rekomendasi_tanaman : [];

                const statusLower = String(status).toLowerCase();
                let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                if (statusLower.includes('sangat kritis')) badgeStyle = 'bg-red-100 text-red-800 border-red-200';
                else if (statusLower.includes('tidak kritis')) badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                else if (statusLower.includes('kritis')) badgeStyle = 'bg-yellow-100 text-yellow-800 border-yellow-200';

                return (
                  <Marker key={`marker-${props.zone_id ?? index}`} position={[lat, lng]}>
                    <Popup className="modern-popup" closeButton={true}>
                      <div className="font-sans">
                        <div className="relative bg-white p-4 pb-3 border-b border-gray-100 z-10">
                          <div className="pr-5">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">{cdk}</span>
                            <h3 className="font-bold text-gray-800 text-base leading-tight mb-2">Desa {desa}</h3>
                            <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeStyle}`}>{status}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50/80 flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
                              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Skor CPI</span>
                              <span className="font-bold text-primary text-lg">{skorCpi}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
                              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Luas Lahan</span>
                              <span className="font-bold text-[#185325] text-lg">{luas} <span className="text-[10px] font-semibold text-gray-500">Ha</span></span>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <HiOutlineUsers className="w-3.5 h-3.5" /> Info Kelompok Tani
                            </p>
                            <div className="flex flex-col gap-2 text-xs">
                              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span className="text-gray-500">KTH:</span>
                                <span className="font-bold text-[#185325] text-right truncate max-w-35">{kth}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Ketua:</span>
                                <span className="font-semibold text-gray-700 text-right truncate max-w-35">{ketua}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm">
                            <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Rekomendasi Tanaman</p>
                            <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                              {plants.length ? plants.join(', ') : 'Belum tersedia'}
                            </p>
                          </div>

                          <div className="flex justify-between items-center bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-1.5 rounded-lg"><HiOutlineMapPin className="w-4 h-4 shrink-0 text-green-600" /></div>
                              <div className="flex flex-col text-[9px] font-mono font-medium gap-0.5">
                                <span>Lat: {lat.toFixed(5)}</span>
                                <span>Lng: {lng.toFixed(5)}</span>
                              </div>
                            </div>
                            <button
                              title="Buka di Google Maps"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                              }}
                              className="bg-white p-2 rounded-lg text-green-600 hover:bg-green-600 hover:text-white transition-colors border border-green-200 cursor-pointer shadow-sm active:scale-95"
                            >
                              <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              } catch {
                return null;
              }
            })}
          </MapContainer>
        ) : (
          <div className="text-sm text-gray-400">
            {geoData ? 'Tidak ada zona sesuai filter peta.' : 'Belum ada data spasial. Input data indikator untuk membuat peta.'}
          </div>
        )}

        {displayedGeoData?.features?.length > 0 && !isLoading && (
          <div className="absolute top-4 right-4 z-400 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex gap-3 text-[10px] font-bold tracking-wide uppercase">
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#4ade80] rounded-full"></div> Tidak Kritis</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#facc15] rounded-full"></div> Kritis</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#ef4444] rounded-full"></div> Sangat Kritis</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection;
