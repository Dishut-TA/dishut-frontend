import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite mem-bundle aset marker, jadi jangan andalkan path bawaan Leaflet.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export interface TitikPetakUkur {
  id: number | string;
  lat: number;
  lng: number;
  polygon?: { lat: number; lng: number }[];
  nama_lokasi?: string;
  luas?: number;
  penugasan_id?: number | null;
  jenis_kegiatan?: string | null;
  status?: string | null;
  penyuluh?: string;
  program?: string;
  sumber_dana?: string;
  desa?: string;
  persentase_tumbuh?: number | null;
}

interface PetaPetakUkurProps {
  /** Titik dari backend (map_locations / map_markers). */
  titik?: TitikPetakUkur[];
  /** Petak ukur mentah dari /api/penugasan/{id}/petak-ukur, dipetakan otomatis. */
  petakUkurs?: any[];
  height?: string;
  zoom?: number;
  scrollWheelZoom?: boolean;
  /** Ditampilkan saat tidak ada koordinat sama sekali. */
  emptyMessage?: string;
}

// Fallback: Bandung Barat, dipakai hanya bila tidak ada titik sama sekali.
const PUSAT_DEFAULT: [number, number] = [-6.9204, 107.5046];

const WARNA_SUMBER: Record<string, string> = {
  Donasi: '#10B981',
  APBD: '#3B82F6',
  CSR: '#A855F7',
};

const warnaUntuk = (sumber?: string) => WARNA_SUMBER[sumber ?? ''] ?? '#64748B';

/** Menormalkan simpul polygon ke [lat, lng] dan membuang yang tidak valid. */
const bersihkanPolygon = (polygon: any): [number, number][] => {
  if (!Array.isArray(polygon)) return [];

  return polygon.reduce<[number, number][]>((acc, simpul: any) => {
    const lat = Number(simpul?.lat ?? simpul?.latitude);
    const lng = Number(simpul?.lng ?? simpul?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) acc.push([lat, lng]);
    return acc;
  }, []);
};

/** Memetakan petak ukur mentah menjadi titik peta, sama seperti perhitungan backend. */
const dariPetakUkurs = (petakUkurs: any[]): TitikPetakUkur[] =>
  petakUkurs.reduce<TitikPetakUkur[]>((acc, pu: any) => {
    const simpul = bersihkanPolygon(pu?.polygon_data);
    if (simpul.length === 0) return acc;

    const lat = simpul.reduce((s, p) => s + p[0], 0) / simpul.length;
    const lng = simpul.reduce((s, p) => s + p[1], 0) / simpul.length;

    acc.push({
      id: pu.id,
      lat,
      lng,
      polygon: simpul.map(([la, ln]) => ({ lat: la, lng: ln })),
      nama_lokasi: pu.nama,
      luas: pu.luas ? Number(pu.luas) : undefined,
      status: pu.status,
      persentase_tumbuh: pu.eval_persentase_tumbuh ?? null,
    });
    return acc;
  }, []);

/** Menyesuaikan viewport agar seluruh titik masuk layar. */
const AturBatas: React.FC<{ posisi: [number, number][] }> = ({ posisi }) => {
  const map = useMap();

  React.useEffect(() => {
    if (posisi.length === 0) return;

    if (posisi.length === 1) {
      map.setView(posisi[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(posisi), { padding: [30, 30], maxZoom: 16 });
  }, [map, posisi]);

  return null;
};

const PetaPetakUkur: React.FC<PetaPetakUkurProps> = ({
  titik,
  petakUkurs,
  height = '100%',
  zoom = 11,
  scrollWheelZoom = false,
  emptyMessage = 'Belum ada titik lokasi. Petak ukur belum digambar penyuluh.',
}) => {
  const daftar = useMemo<TitikPetakUkur[]>(() => {
    if (titik && titik.length > 0) return titik;
    if (petakUkurs && petakUkurs.length > 0) return dariPetakUkurs(petakUkurs);
    return [];
  }, [titik, petakUkurs]);

  const posisi = useMemo<[number, number][]>(
    () =>
      daftar
        .filter((t) => Number.isFinite(Number(t.lat)) && Number.isFinite(Number(t.lng)))
        .map((t) => [Number(t.lat), Number(t.lng)] as [number, number]),
    [daftar]
  );

  if (posisi.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex flex-col items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400"
      >
        <span className="text-sm font-medium text-center px-6">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full relative z-0">
      <MapContainer
        center={posisi[0] ?? PUSAT_DEFAULT}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topleft" />
        <AturBatas posisi={posisi} />

        {daftar.map((t) => {
          const warna = warnaUntuk(t.sumber_dana);
          const simpul = bersihkanPolygon(t.polygon);

          return (
            <React.Fragment key={t.id}>
              {simpul.length >= 3 && (
                <Polygon
                  positions={simpul}
                  pathOptions={{ color: warna, fillColor: warna, fillOpacity: 0.25, weight: 2 }}
                />
              )}
              <Marker position={[Number(t.lat), Number(t.lng)]}>
                <Popup>
                  <div className="text-xs leading-relaxed">
                    <div className="font-bold">{t.nama_lokasi || 'Petak Ukur'}</div>
                    {t.program && <div>Program: {t.program}</div>}
                    {t.sumber_dana && t.sumber_dana !== '-' && <div>Sumber Dana: {t.sumber_dana}</div>}
                    {t.desa && t.desa !== '-' && <div>Desa: {t.desa}</div>}
                    {t.luas !== undefined && <div>Luas: {t.luas} Ha</div>}
                    {t.penyuluh && t.penyuluh !== '-' && <div>Penyuluh: {t.penyuluh}</div>}
                    {t.jenis_kegiatan && <div>Kegiatan: {t.jenis_kegiatan}</div>}
                    {t.status && <div>Status: {t.status}</div>}
                    {t.persentase_tumbuh !== null && t.persentase_tumbuh !== undefined && (
                      <div>Persentase Tumbuh: {t.persentase_tumbuh}%</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PetaPetakUkur;
