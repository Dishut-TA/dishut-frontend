import React from 'react';
import { HiOutlineInformationCircle, HiOutlineMap } from 'react-icons/hi2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PetakUkur } from '../types';

interface DashboardHasilDanPetaProps {
  mockStatus: string;
  hasilIntegrasi: {
    persenTumbuhGlobal: string;
    skorCPILingkungan: string;
    statusEvaluasiLahan: string;
    rekomendasiTindakLanjut: string;
  };
  dataPetakUkur: PetakUkur[];
}

const createCustomMarker = (isKritis: boolean) => {
  const colorClass = isKritis ? 'bg-orange-500 border-white' : 'bg-[#00A859] border-white';
  const pingClass = isKritis ? 'bg-orange-400' : 'bg-green-400';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative w-6 h-6">
        <div class="absolute inset-0 rounded-full border-2 shadow-lg z-10 ${colorClass}"></div>
        <div class="absolute inset-0 rounded-full animate-ping opacity-75 ${pingClass}"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const DashboardHasilDanPeta: React.FC<DashboardHasilDanPetaProps> = ({ mockStatus, hasilIntegrasi, dataPetakUkur }) => {
  
  // Fungsi pecah string koordinat "-6.21, 106.82" jadi array angka [-6.21, 106.82] untuk Leaflet
  const parseCoord = (coordStr: string): [number, number] => {
    const [lat, lng] = coordStr.split(',').map(s => parseFloat(s.trim()));
    return [isNaN(lat) ? -6.20 : lat, isNaN(lng) ? 106.81 : lng]; // Fallback
  };

  const mapCenter = dataPetakUkur.length > 0 ? parseCoord(dataPetakUkur[0].koordinat) : [-6.20, 106.81] as [number, number];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 mb-8 border-t border-gray-100 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            {mockStatus === 'HASIL TERVALIDASI' ? 'Ringkasan Hasil Evaluasi' : '2. Matriks Hasil Perhitungan'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tumbuh Tanaman</p>
              <p className="text-4xl font-bold text-[#185325]">{hasilIntegrasi.persenTumbuhGlobal}%</p>
              {parseFloat(hasilIntegrasi.persenTumbuhGlobal) >= 75 ? (
                <span className="mt-2 text-[10px] bg-green-50 text-[#185325] px-2.5 py-1 rounded-md font-bold border border-green-100">MEMENUHI STANDAR</span>
              ) : (
                <span className="mt-2 text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-bold border border-red-100">DI BAWAH STANDAR</span>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-md uppercase tracking-wider">
                WebGIS Connected
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skor CPI Lingkungan</p>
              <p className="text-4xl font-bold text-blue-600">{hasilIntegrasi.skorCPILingkungan}</p>
              <span className="mt-2 text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold border border-blue-100 flex items-center gap-1">
                <HiOutlineInformationCircle className="w-3 h-3" /> PRIORITAS TINGGI
              </span>
            </div>
          </div>

          <div className="bg-[#DCECE0] border border-[#185325]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-xs font-bold text-[#3A4D3F] uppercase tracking-wider mb-1">Status Persentase Keberhasilan Penanaman</p>
            <p className="text-base font-bold text-[#185325] leading-tight uppercase">{hasilIntegrasi.statusEvaluasiLahan}</p>
          </div>
        </div>

        <div className="space-y-6 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              {mockStatus === 'HASIL TERVALIDASI' ? 'Peta WebGIS Terintegrasi' : '3. Visualisasi Sebaran Petak Ukur'}
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-200 flex items-center gap-1"><HiOutlineMap className="w-3 h-3"/> Live Map</span>
          </div>

          <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative flex-1 min-h-87.5 shadow-inner z-0">
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EAW, and the GIS User Community"
              />
              
              {dataPetakUkur.map((item, idx) => {
                const persen = item.rencana > 0 ? ((item.tumbuh / item.rencana) * 100).toFixed(2) : "0.00";
                const isKritis = parseFloat(persen) < 75;
                const bibitMati = item.rencana - item.tumbuh;
                const pos = parseCoord(item.koordinat);

                return (
                  <Marker key={idx} position={pos} icon={createCustomMarker(isKritis)}>
                    <Popup className="custom-popup">
                      <div className="w-52 p-1">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                          <span className="text-sm font-bold text-gray-800 m-0">{item.pu}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isKritis ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {persen}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase m-0">Jenis Bibit</p>
                            <p className="text-xs font-semibold text-gray-800 m-0">{item.jenisBibit}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-1 pt-1">
                            <div className="bg-gray-50 border border-gray-200 rounded p-1 text-center">
                              <span className="text-[9px] text-gray-400 block">Rencana</span>
                              <span className="text-xs font-bold text-gray-700">{item.rencana}</span>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded p-1 text-center">
                              <span className="text-[9px] text-gray-400 block">Hidup</span>
                              <span className="text-xs font-bold text-[#185325]">{item.tumbuh}</span>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded p-1 text-center">
                              <span className="text-[9px] text-red-400 block">Mati</span>
                              <span className="text-xs font-bold text-red-600">{bibitMati}</span>
                            </div>
                          </div>
                          {isKritis && (
                            <div className="mt-2 bg-orange-50 text-orange-600 text-[10px] font-bold p-1 rounded text-center border border-orange-100">
                              Perlu Tindak Lanjut!
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
      <style>{`.leaflet-popup-content { margin: 8px 12px; } .leaflet-popup-content p { margin: 0; }`}</style>
    </div>
  );
};

export default DashboardHasilDanPeta;