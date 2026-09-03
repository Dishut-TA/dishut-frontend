import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMockupProps {
  markers?: any[];
}

export default function MapMockup({ markers = [] }: MapMockupProps) {
  const center: [number, number] = markers.length > 0 
    ? [markers[0].lat, markers[0].lng] 
    : [-6.9204, 107.5046];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Peta Sebaran Program Rehabilitasi</h3>
        <div className="flex gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Donasi</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> APBD</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> CSR</span>
        </div>
      </div>
      
      <div className="w-full h-70 bg-green-50 rounded-lg relative overflow-hidden border border-gray-200 z-0">
        <MapContainer 
          center={center} 
          zoom={10} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topleft" />
          
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold">{marker.nama_lokasi}</div>
                  <div>Desa: {marker.desa}</div>
                  <div>Penyuluh: {marker.penyuluh}</div>
                  <div>Status: {marker.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-3 text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
        <HiOutlineInformationCircle className="w-4 h-4 text-green-600" /> Klik marker pada peta untuk melihat detail program.
      </div>
    </div>
  );
}