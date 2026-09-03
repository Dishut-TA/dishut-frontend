import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';

// Import CSS wajib Leaflet
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Trik jitu untuk Vite: Import leaflet-draw TANPA variabel default
import 'leaflet-draw';

// ==========================================
// KOMPONEN CUSTOM: Kontrol Gambar Peta
// ==========================================
const CustomDrawControl = ({ onCreated }: { onCreated: (e: any) => void }) => {
  const map = useMap(); // Mendapatkan instance peta asli (Leaflet DOM)

  useEffect(() => {
    // 1. Buat grup layer untuk menampung hasil gambaran user
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // 2. Konfigurasi alat gambar bawaan leaflet-draw
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: {
          allowIntersection: false, // Garis tidak boleh menyilang
          drawError: {
            color: '#e1e100',
            message: 'Garis tidak boleh menyilang!'
          },
          shapeOptions: {
            color: '#1B5E20',     // Garis hijau
            fillColor: '#D5F0DE', // Isi hijau muda
            fillOpacity: 0.6
          }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      }
    });

    // 3. Tambahkan tombol alat ke peta
    map.addControl(drawControl);

    // 4. Dengarkan event ketika user selesai menggambar
    map.on(L.Draw.Event.CREATED, (e: any) => {
      drawnItems.addLayer(e.layer);
      onCreated(e);
    });

    // 5. Cleanup saat komponen dilepas (unmount)
    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED);
    };
  }, [map, onCreated]);

  return null; // Komponen ini hanya memanipulasi peta, tidak merender UI React
};

// ==========================================
// KOMPONEN UTAMA
// ==========================================
const MapPolygonDraw: React.FC = () => {
  const [drawnCoordinates, setDrawnCoordinates] = useState<any[]>([]);

  // Dummy Polygon Data (Area contoh agar tidak kosong)
  const dummyPolygonData: [number, number][] = [
    [-7.2100, 107.8900],
    [-7.2150, 107.9050],
    [-7.2250, 107.9000],
    [-7.2200, 107.8850],
  ];

  // Menangkap data koordinat saat gambar selesai
  const handleCreated = (e: any) => {
    const layer = e.layer;
    const { _latlngs } = layer;
    
    // Set koordinat ke state (format array of objek lat & lng)
    setDrawnCoordinates(_latlngs[0]); 
    console.log("Koordinat Terrekam:", _latlngs[0]);
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <div>
        <h3 className="text-sm font-bold text-gray-800">Peta Batas Penanaman (Area Rehabilitasi)</h3>
        <p className="text-xs text-gray-500 mb-2">
          Gunakan alat <strong>Polygon (segi banyak)</strong> di pojok kiri peta untuk menggambar area target. 
          Klik titik awal untuk menutup area.
        </p>
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col z-0 relative">
        <div className="w-full h-87.5 bg-gray-100 relative">
          
          <MapContainer 
            center={[-7.2150, 107.8950]} 
            zoom={14} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Panggil Custom Control yang kita buat di atas */}
            <CustomDrawControl onCreated={handleCreated} />

            {/* Tampilkan Polygon Dummy bawaan */}
            <Polygon 
              positions={dummyPolygonData} 
              pathOptions={{ color: '#1B5E20', fillColor: '#89CE8C', fillOpacity: 0.5 }} 
            />
          </MapContainer>

        </div>
      </div>

      {drawnCoordinates.length > 0 && (
        <div className="bg-[#EBF3E8] text-primary p-3 rounded-md text-xs font-medium border border-green-200 animate-in fade-in">
          <span className="font-bold">Berhasil merekam {drawnCoordinates.length} titik koordinat batas.</span> Data siap disimpan.
        </div>
      )}

    </div>
  );
};

export default MapPolygonDraw;