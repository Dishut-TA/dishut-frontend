import React, { useRef, useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ReportPDF from './pdf/ReportPDF';
import { pdf } from '@react-pdf/renderer';
import { toJpeg } from 'html-to-image';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen Helper untuk Auto Zoom Peta
const FitBoundsToGeoJSON = ({ geoData }: { geoData: any }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData && geoData.features && geoData.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geoData);
      const bounds = geoJsonLayer.getBounds();
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [geoData, map]);

  return null;
};

interface MapSectionProps {
  geoData?: any;
  isLoading?: boolean;
  onOpenInputModal?: () => void;
  tableData?: any[]; // <- Ubah jadi any[] agar aman dari error TS
  petaFilter?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  geoData, 
  isLoading = false, 
  onOpenInputModal, 
  tableData,
  petaFilter = 'Keseluruhan'
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getFeatureStyle = (feature: any) => {
    const status = feature.properties?.status_lahan_kritis?.toLowerCase() || feature.properties?.status?.toLowerCase() || '';
    if (status.includes('sangat kritis')) return { color: '#EF4444', fillColor: '#ef4444', fillOpacity: 0.9, weight: 1 };
    if (status.includes('kritis')) return { color: '#F59E0B', fillColor: '#facc15', fillOpacity: 0.9, weight: 1 };
    return { color: '#10B981', fillColor: '#4ade80', fillOpacity: 0.9, weight: 1 };
  };

  // --- FUNGSI EXPORT PDF (Dipindahkan ke luar onEachFeatureHandler) ---
  const handleExportPDF = async () => {
    if (!tableData || tableData.length === 0) return;
    setIsGeneratingPDF(true);

    try {
      let mapImageBase64 = null;

      if (mapContainerRef.current) {
        mapImageBase64 = await toJpeg(mapContainerRef.current, { 
          quality: 0.8,
          pixelRatio: 2,
          style: { transform: 'scale(1)' } 
        });
      }

      const doc = <ReportPDF data={tableData} projectName={petaFilter} mapImage={mapImageBase64} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_CPI_${petaFilter}_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat laporan PDF. Silakan coba lagi.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const props = feature.properties || {};
    const desa = props.desa_kelurahan || props.desa || 'Desa Tidak Diketahui';
    const status = props.status_lahan_kritis || props.status || 'Tidak Diketahui';
    const skorCpi = props.skor_cpi_rata2 || props.cpi || '-';
    const luas = props.luas_ha || props.luas || '-';

    const statusLower = status.toLowerCase();
    let badgeStyle = 'bg-green-100 text-green-700 border-green-200';
    if (statusLower.includes('sangat kritis')) badgeStyle = 'bg-red-100 text-red-700 border-red-200';
    else if (statusLower.includes('kritis')) badgeStyle = 'bg-yellow-100 text-yellow-700 border-yellow-200';

    const popupContent = `
      <div class="font-sans min-w-55 -m-1">
        <div class="border-b border-gray-100 pb-3 mb-3">
          <h3 class="font-bold text-gray-800 text-sm mb-1.5 leading-tight">${desa}</h3>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeStyle}">${status}</span>
        </div>
        <div class="flex flex-col gap-2 text-xs text-gray-600">
          <div class="flex justify-between items-center"><span class="text-gray-500">Skor CPI</span><span class="font-bold text-[#185325]">${skorCpi}</span></div>
          <div class="flex justify-between items-center"><span class="text-gray-500">Luas Lahan</span><span class="font-semibold text-gray-700">${luas} Ha</span></div>
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Peta Prioritas Rehabilitasi Jawa Barat:</h2>
          <p className="text-xs text-gray-500">Conservation Priority Index (CPI)</p>
        </div>
        
        {/* Tombol Input File (Opsional) */}
        {onOpenInputModal && (
          <button
            onClick={onOpenInputModal}
            className="w-full sm:w-auto bg-[#185325] hover:bg-[#113d1b] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            Input File <HiOutlinePlus className="w-4 h-4 stroke-2" />
          </button>
        )}
      </div>

      <div ref={mapContainerRef} className="w-full h-80 md:h-112.5 bg-blue-50/50 rounded-lg border border-blue-100 overflow-hidden relative flex items-center justify-center z-0 mb-4">
        {isLoading ? (
          <div className="flex flex-col items-center text-[#185325]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#185325] mb-3"></div>
            <span className="font-bold text-sm">Merender Peta Spasial...</span>
          </div>
        ) : geoData ? (
          <MapContainer center={[-6.9204, 107.6046]} zoom={9} style={{ height: '100%', width: '100%' }}>
            <FitBoundsToGeoJSON geoData={geoData} />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              key={geoData.projectId || Math.random()}
              data={geoData}
              style={getFeatureStyle}
              onEachFeature={onEachFeatureHandler}
            />
            {geoData.features?.map((feature: any, index: number) => {
              try {
                const centroid = turf.centerOfMass(feature);
                const [lng, lat] = centroid.geometry.coordinates;
                const props = feature.properties || {};
                const desa = props.desa_kelurahan || props.desa || '-';
                const kth = props.nama_kelompok || 'Belum ada data KTH';
                const ketua = props.ketua_kelompok || '-';
                const cdk = props.cdk || '-';

                return (
                  <Marker key={`marker-${index}`} position={[lat, lng]}>
                    <Popup>
                      <div className="font-sans text-xs min-w-48 p-1">
                        <span className="bg-[#185325]/10 text-[#185325] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mb-1.5 inline-block">{cdk}</span>
                        <strong className="block text-sm text-gray-800 mb-2 pb-1 border-b">Desa {desa}</strong>
                        <div className="mb-2 bg-gray-50 p-1.5 rounded border border-gray-100 text-[11px] text-gray-600 font-mono">
                          <div>Lat: {lat.toFixed(5)}</div>
                          <div>Lng: {lng.toFixed(5)}</div>
                        </div>
                        <div className="mb-1"><span className="text-gray-500">KTH:</span> <span className="font-bold text-[#185325]">{kth}</span></div>
                        <div><span className="text-gray-500">Ketua:</span> <span className="font-bold text-gray-700">{ketua}</span></div>
                      </div>
                    </Popup>
                  </Marker>
                );
              } catch (error) {
                return null;
              }
            })}
          </MapContainer>
        ) : (
          <div className="text-sm text-gray-400">Belum ada data spasial</div>
        )}

        {geoData && !isLoading && (
          <div className="absolute top-4 right-4 z-400 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex gap-3 text-[10px] font-bold tracking-wide uppercase">
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#4ade80] rounded-full"></div> Tidak Kritis</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#facc15] rounded-full"></div> Kritis</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-[#ef4444] rounded-full"></div> Sangat Kritis</div>
          </div>
        )}
      </div>

      {/* --- TOMBOL EKSPOR PDF KABID --- */}
      <div className="flex justify-end mt-4">
        {tableData && tableData.length > 0 ? (
          <button 
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className={`bg-[#185325] text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors shadow-sm active:scale-95 ${isGeneratingPDF ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#123d1c] cursor-pointer'}`}
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4 stroke-2" /> 
            {isGeneratingPDF ? 'Memproses PDF...' : 'Ekspor Laporan'}
          </button>
        ) : (
          <button 
            disabled
            className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-not-allowed"
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4 stroke-2" /> Data Belum Tersedia
          </button>
        )}
      </div>
    </div>
  );
};

export default MapSection;