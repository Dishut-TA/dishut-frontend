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

// Marker akan selalu berwarna Oranye karena kita hanya menampilkan PU yang kritis
const createCustomMarker = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative w-6 h-6">
        <div class="absolute inset-0 rounded-full border-2 shadow-lg z-10 bg-orange-500 border-white"></div>
        <div class="absolute inset-0 rounded-full animate-ping opacity-75 bg-orange-400"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const DashboardHasilDanPeta: React.FC<DashboardHasilDanPetaProps> = ({ mockStatus, hasilIntegrasi, dataPetakUkur }) => {
  
  // Fungsi aman untuk memecah string koordinat GPS
  const parseCoord = (coordStr: string): [number, number] => {
    if (!coordStr || coordStr.trim() === '' || coordStr === '-') return [-6.20, 106.81];
    const [lat, lng] = coordStr.split(',').map(s => parseFloat(s.trim()));
    return [isNaN(lat) ? -6.20 : lat, isNaN(lng) ? 106.81 : lng];
  };

  // Cari center map dari PU pertama yang punya koordinat valid (agar peta tetap berada di lokasi hutan)
  const firstValidPU = dataPetakUkur.find(item => item.koordinat && item.koordinat.includes(','));
  const mapCenter = firstValidPU ? parseCoord(firstValidPU.koordinat) : [-6.20, 106.81] as [number, number];

  // =====================================================================
  // FILTER DATA PETA CERDAS:
  // 1. Abaikan PU yang tidak punya rencana bibit (rencana <= 0)
  // 2. HANYA masukkan PU yang tingkat tumbuhnya kritis (< 75%)
  // =====================================================================
  const mapMarkersData = dataPetakUkur.filter(item => {
    if (item.rencana <= 0) return false;
    const persen = (item.tumbuh / item.rencana) * 100;
    return persen < 75; 
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 mb-8 border-t border-gray-100 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: STATISTIK HASIL EVALUASI */}
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

        {/* KOLOM KANAN: PETA WEBGIS */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                {mockStatus === 'HASIL TERVALIDASI' ? 'Peta WebGIS Terintegrasi' : '3. Visualisasi Titik Kritis Lapangan'}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1">Hanya menampilkan Petak Ukur kritis (&lt; 75%) yang memerlukan tindak lanjut.</p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-200 flex items-center gap-1 shrink-0">
                <HiOutlineMap className="w-3 h-3"/> Live Map
            </span>
          </div>

          <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative flex-1 min-h-[350px] shadow-inner z-0">
            
            {/* OVERLAY: Jika tidak ada titik kritis yang ditemukan */}
            {mapMarkersData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 z-10 backdrop-blur-sm p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-[#185325] rounded-full flex items-center justify-center mb-3">
                  <HiOutlineMap className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-800">Tidak Ada Titik Kritis Lapangan</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">Seluruh Petak Ukur lapangan memenuhi standar keberhasilan tumbuh (&gt; 75%) atau tidak ada data penanaman di dalamnya.</p>
              </div>
            ) : null}

            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri"
              />
              
              {mapMarkersData.map((item, idx) => {
                const persen = ((item.tumbuh / item.rencana) * 100).toFixed(2);
                const bibitMati = item.rencana - item.tumbuh;
                const pos = parseCoord(item.koordinat);

                return (
                  <Marker key={idx} position={pos} icon={createCustomMarker()}>
                    <Popup className="custom-popup">
                      <div className="w-52 p-1">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                          <span className="text-sm font-bold text-gray-800 m-0">{item.pu}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
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
                          <div className="mt-2 bg-orange-50 text-orange-600 text-[10px] font-bold p-1 rounded text-center border border-orange-100">
                            Perlu Tindak Lanjut Lapangan!
                          </div>
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