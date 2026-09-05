import React, { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getMyPenugasanAPI } from '@/services/penugasan.service';
import AgendaTerdekat from './components/AgendaTerdekat';
import PembaruanTerbaru from './components/PembaruanTerbaru';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Pusat default peta: Jawa Barat
const DEFAULT_CENTER: [number, number] = [-6.9147, 107.6098];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Menunggu Penugasan': 'bg-gray-100 text-gray-600',
    'Menunggu Verifikasi': 'bg-orange-50 text-orange-600',
    'Berjalan': 'bg-emerald-50 text-emerald-600',
    'Selesai': 'bg-blue-50 text-blue-600',
    'Dihentikan': 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ status }: { status: string }) => {
  const isLanjutkan = status === 'Berjalan' || status === 'Menunggu Verifikasi';
  return (
    <button className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${isLanjutkan
        ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}>
      {isLanjutkan ? 'Lanjutkan' : 'Lihat Detail'}
    </button>
  );
};

// Hitung titik tengah (centroid) dari kumpulan titik polygon petak ukur
const getCentroidFromPetakUkurs = (petakUkurs: any[]): [number, number] | null => {
  if (!petakUkurs || petakUkurs.length === 0) return null;

  const points: { lat: number; lng: number }[] = [];
  petakUkurs.forEach((pu) => {
    const polygon = pu.polygon_data;
    if (Array.isArray(polygon)) {
      polygon.forEach((pt: any) => {
        const lat = pt.lat ?? pt.latitude;
        const lng = pt.lng ?? pt.longitude;
        if (typeof lat === 'number' && typeof lng === 'number') {
          points.push({ lat, lng });
        }
      });
    }
  });

  if (points.length === 0) return null;

  const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const avgLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return [avgLat, avgLng];
};

const DashboardPenyuluh: React.FC = () => {
  const [penugasans, setPenugasans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const res = await getMyPenugasanAPI();
        setPenugasans(res.data || []);
      } catch (error) {
        console.error('Failed to fetch penugasan', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  const totalAktif = penugasans.filter(p => p.status === 'Berjalan' || p.status === 'Menunggu Verifikasi').length;
  const validasiMenunggu = penugasans.filter(p => (p.jenisKegiatan || p.jenis_kegiatan) === 'Validasi Lokasi' && p.status === 'Menunggu Verifikasi').length;
  const pelaksanaanBerjalan = penugasans.filter(p => (p.jenisKegiatan || p.jenis_kegiatan) === 'Pelaksanaan Penanaman' && p.status === 'Berjalan').length;
  const monitoringBelumSelesai = penugasans.filter(p => (p.jenisKegiatan || p.jenis_kegiatan) === 'Monitoring Program' && p.status !== 'Selesai' && p.status !== 'Dihentikan').length;

  const STATS_DATA = [
    { title: 'Total Penugasan Aktif', value: totalAktif.toString(), sub: 'Penugasan', icon: <HiOutlineClipboardDocumentList />, color: 'text-gray-700', bg: 'bg-[#f0f9f3]', iconColor: 'text-emerald-700' },
    { title: 'Validasi Lokasi', value: validasiMenunggu.toString(), sub: 'Menunggu', subColor: 'text-orange-500', icon: <HiOutlineMapPin />, color: 'text-gray-700', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { title: 'Pelaksanaan Penanaman', value: pelaksanaanBerjalan.toString(), sub: 'Program', subColor: 'text-emerald-600', icon: <HiOutlineUsers />, color: 'text-gray-700', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { title: 'Monitoring Belum Selesai', value: monitoringBelumSelesai.toString(), sub: 'Program', subColor: 'text-blue-500', icon: <HiOutlineChartBar />, color: 'text-gray-700', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
  ];

  const PROGRAMS_DATA = penugasans
    .filter(p => p.status === 'Berjalan' || p.status === 'Menunggu Verifikasi')
    .slice(0, 5)
    .map(p => {
      const detail = p.detail || p.penugasanable || {};
      const sourceType = p.source_type || p.penugasanable_type;
      const jenisK = p.jenisKegiatan || p.jenis_kegiatan || '-';
      const tglP = p.tanggalPenugasan || p.tanggal_penugasan;

      let programName = '-';
      let location = '-';
      if (sourceType === 'App\\Models\\DonationProgram') {
        programName = detail.name || '-';
        location = detail.location || '-';
      } else if (sourceType === 'App\\Models\\ProgramApbd' || sourceType === 'App\\Models\\ProgramCsr') {
        programName = detail.nama_program || '-';
        location = detail.lokasi || (detail.kth ? `${detail.kth.desa_kelurahan}, ${detail.kth.kabupaten_kota}` : '-');
      } else if (sourceType === 'App\\Models\\AnalysisResultZone') {
        programName = 'Validasi Lahan Kritis';
        location = detail.desa ? `${detail.desa}, ${detail.kabupaten}` : (detail.kabupaten || '-');
      }

      return {
        id: p.id,
        name: programName,
        loc: location,
        stage: jenisK,
        date: tglP ? new Date(tglP).toLocaleDateString('id-ID') : '-',
        status: p.status
      };
    });

  // Marker peta: hanya program yang sudah punya Petak Ukur (jadi punya koordinat asli)
  const mapMarkers = useMemo(() => {
    return penugasans
      .filter(p => p.status === 'Berjalan' || p.status === 'Menunggu Verifikasi')
      .map(p => {
        const petakUkurs = p.petak_ukurs || p.petakUkurs || [];
        const centroid = getCentroidFromPetakUkurs(petakUkurs);
        if (!centroid) return null;

        const detail = p.detail || p.penugasanable || {};
        const sourceType = p.source_type || p.penugasanable_type;
        let programName = '-';
        if (sourceType === 'App\\Models\\DonationProgram') {
          programName = detail.name || '-';
        } else if (sourceType === 'App\\Models\\ProgramApbd' || sourceType === 'App\\Models\\ProgramCsr') {
          programName = detail.nama_program || '-';
        } else if (sourceType === 'App\\Models\\AnalysisResultZone') {
          programName = 'Validasi Lahan Kritis';
        }

        return {
          id: p.id,
          position: centroid,
          name: programName,
          status: p.status,
        };
      })
      .filter((m): m is { id: number; position: [number, number]; name: string; status: string } => m !== null);
  }, [penugasans]);

  const mapCenter = mapMarkers.length > 0 ? mapMarkers[0].position : DEFAULT_CENTER;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 bg-[#f8faf9] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
          Dashboard Penyuluh
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Pantau tugas lapangan, validasi lokasi, pelaksanaan kegiatan, dan monitoring program.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_DATA.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.iconColor} shrink-0`}>
              {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stat.value}</h3>
                <span className={`text-xs font-medium ${stat.subColor || 'text-gray-400'}`}>{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Peta Program Aktif */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <HiOutlineMapPin className="w-5 h-5 text-emerald-600" />
            <h3>Peta Sebaran Program Aktif</h3>
          </div>
          {!isLoading && mapMarkers.length === 0 && (
            <span className="text-xs text-gray-400 font-medium">Belum ada titik lokasi (Petak Ukur belum dibuat)</span>
          )}
        </div>
        <div className="w-full h-80 relative z-0">
          {!isLoading && (
            <MapContainer center={mapCenter} zoom={mapMarkers.length > 0 ? 11 : 8} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapMarkers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                  <Popup>
                    <span className="font-bold">{marker.name}</span><br />
                    Status: {marker.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Tabel Program Aktif (Full Width) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <HiOutlineClipboardDocumentList className="w-5 h-5 text-emerald-600" />
            <h3>Program Aktif Saya</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3 font-semibold">No</th>
                <th className="px-5 py-3 font-semibold">ID Program</th>
                <th className="px-5 py-3 font-semibold">Nama Program</th>
                <th className="px-5 py-3 font-semibold">Lokasi</th>
                <th className="px-5 py-3 font-semibold">Tahap</th>
                <th className="px-5 py-3 font-semibold">Tgl Penugasan</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : PROGRAMS_DATA.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Belum ada penugasan</td>
                </tr>
              ) : PROGRAMS_DATA.map((prog, idx) => (
                <tr key={prog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">{idx + 1}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500">{prog.id}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">{prog.name}</td>
                  <td className="px-5 py-4 text-xs">{prog.loc}</td>
                  <td className="px-5 py-4 text-xs">{prog.stage}</td>
                  <td className="px-5 py-4 text-xs">{prog.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={prog.status} /></td>
                  <td className="px-5 py-4"><ActionButton status={prog.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Agenda, Progress, Notifikasi, Sebaran Penugasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgendaTerdekat penugasans={penugasans} />
        <PembaruanTerbaru penugasans={penugasans} />
      </div>
    </div>

  );
};

export default DashboardPenyuluh;