import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { TemplateRekapMonitoringPDF } from './components/TemplateRekapMonitoringPDF';
import {
  HiOutlineArrowLeft,
  HiOutlinePrinter,
  HiOutlineUserPlus,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineDocumentCheck,
  HiOutlineCalendar,
  HiOutlineArrowDownTray,
  HiArrowRight,
  HiArrowTrendingUp,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineDocument
} from 'react-icons/hi2';
import { PiPlant, PiTree, PiLeaf } from 'react-icons/pi';
import { getPenugasanByIdAPI } from '../../../../services/penugasan.service';
import PetaPetakUkur from '@/components/maps/PetaPetakUkur';
import { centroidPolygon } from '@/utils/koordinat';

type MonitoringStatus = 'Siap Monitoring' | 'Berjalan' | 'Menunggu' | 'Menunggu Penugasan' | 'Menunggu Evaluasi' | 'Tindak Lanjut' | 'Selesai' | 'Dihentikan';

const DetailMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Membaca status secara dinamis dari tabel sebelumnya
  const currentStatus = (location.state?.status as MonitoringStatus) || 'Siap Monitoring';

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [programData, setProgramData] = useState<any>(null);
  const [dokumentasiList, setDokumentasiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pdfRef = React.useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: 'Ringkasan_Akhir_Monitoring',
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const res = await getPenugasanByIdAPI(id);
        const penugasan = res.data;
        console.log(penugasan)
        const source = penugasan.penugasanable;

        let pName = '-';
        let pKth = '-';
        let pLuas = '-';
        let pLokasi = '-';
        let pSumberDana = '-';

        const zone = source.analysis_result_zone || source.analysisResultZone;
        const zoneLokasi = zone && (zone.desa || zone.kecamatan || zone.kabupaten) ? [zone.desa, zone.kecamatan, zone.kabupaten].filter(Boolean).join(', ') : '-';
        const zoneLuas = zone?.luas_ha ? `${zone.luas_ha} Ha` : '-';
        const zoneKth = zone?.nama_kelompok || '-';

        const kthObj = source?.kth || penugasan.penyuluh?.kth;
        const kthLokasi = kthObj && kthObj.desa_kelurahan ? [kthObj.desa_kelurahan, kthObj.kabupaten_kota].filter(Boolean).join(', ') : '-';

        if (penugasan.penugasanable_type === 'App\\Models\\DonationProgram') {
          pName = source.name || source.nama_program || '-';
          pKth = kthObj?.name || kthObj?.nama || (zoneKth !== '-' ? zoneKth : '-');
          pLuas = zoneLuas !== '-' ? zoneLuas : (source.target_luas_lahan ? `${source.target_luas_lahan} Ha` : '-');
          pLokasi = source.location || source.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
          pSumberDana = 'Donasi';
        } else if (penugasan.penugasanable_type === 'App\\Models\\ProgramApbd' || penugasan.penugasanable_type === 'App\\Models\\ProgramCsr') {
          pName = source.nama_program || source.name || '-';
          pKth = kthObj?.nama || kthObj?.name || (zoneKth !== '-' ? zoneKth : '-');
          pLuas = zoneLuas !== '-' ? zoneLuas : (source.target_luas_lahan ? `${source.target_luas_lahan} Ha` : '-');
          pLokasi = source.lokasi || source.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
          pSumberDana = penugasan.penugasanable_type.includes('Apbd') ? 'APBD' : 'CSR';
        }

        // Calculate monitoring results from petakUkurs
        let tanamanHidup = 0;
        let tanamanMati = 0;
        let targetTanam = 0;
        let jenisTanamanSet = new Set<string>();
        const petakUkurs = penugasan.petak_ukurs || penugasan.petakUkurs || [];
        petakUkurs.forEach((pu: any) => {
          (pu.data_tanamans || []).forEach((t: any) => {
            targetTanam += t.jumlah || 0;
            const jenis = t.nama_tanaman || t.seed?.name || t.jenis_tanaman;
            if (jenis) jenisTanamanSet.add(jenis);
            const kondisi = t.kondisi_tanaman?.toLowerCase() || '';
            if (kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik')) {
              tanamanHidup += t.jumlah || 0;
            } else if (kondisi.includes('mati') || kondisi.includes('rusak') || kondisi.includes('sakit')) {
              tanamanMati += t.jumlah || 0;
            } else {
              tanamanHidup += t.jumlah || 0; // Default if not specified
            }
          });
        });
        const totalTanaman = tanamanHidup + tanamanMati;
        const persentaseHidup = totalTanaman > 0 ? ((tanamanHidup / totalTanaman) * 100).toFixed(2) : 0;
        
        let dokumentasiFromApi = penugasan.dokumentasi || [];
        try {
          const resDok = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/penugasan/${id}/dokumentasi`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (resDok.ok) {
            const jsonDok = await resDok.json();
            if (jsonDok.data && jsonDok.data.length > 0) {
              dokumentasiFromApi = jsonDok.data;
            }
          }
        } catch (e) {
          console.error("Failed to fetch extended dokumentasi:", e);
        }
        
        const countDokumentasi = dokumentasiFromApi.length;

        // Petak ukur tidak punya kolom latitude/longitude. Koordinatnya tersimpan
        // sebagai polygon_data [{lat, lng}], jadi titik geotag adalah centroidnya.
        const geotagList = petakUkurs.map((pu: any) => {
          const pusat = centroidPolygon(pu?.polygon_data);
          if (!pusat) return null;
          return {
            lat: pusat[0],
            lng: pusat[1],
            nama: pu.nama || pu.nama_petak || `PU ${pu.id || ''}`.trim() || 'Petak Ukur'
          };
        }).filter(Boolean);

        setProgramData({
          id: penugasan.id,
          sourceId: id,
          programName: pName,
          kth: pKth,
          luas: pLuas,
          lokasi: pLokasi,
          sumberDana: pSumberDana,
          penyuluh: penugasan.penyuluh?.username || penugasan.penyuluh?.name || penugasan.penyuluh?.nama_pengguna || '-',
          tanggal_penugasan: penugasan.tanggal_penugasan,
          batas_waktu: penugasan.batas_waktu,
          jenis_kegiatan: penugasan.jenis_kegiatan,
          periode_monitoring: penugasan.periode_monitoring || penugasan.jenis_kegiatan || '-',
          jenisTanaman: Array.from(jenisTanamanSet).join(', ') || '-',
          stats: {
            tanamanHidup,
            tanamanMati,
            targetTanam,
            persentaseHidup,
            // countGeotag,
            countDokumentasi
          },
          geotagList,
          petakUkurs,
          dokumentasiList: dokumentasiFromApi,
          pelaksanaan: penugasan.pelaksanaan_penanaman || null,
          riwayatMonitoring: penugasan.riwayat_monitoring || []
        });
        setDokumentasiList(dokumentasiFromApi);
      } catch (error) {
        console.error("Gagal mengambil data detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  }

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage';
  
  const allDocs = [
    ...(dokumentasiList || []),
    ...(programData?.dokumentasiList || []),
    ...(programData?.pelaksanaan?.dokumentasi || []),
    ...(programData?.dokumentasi || [])
  ];

  // Hapus duplikat berdasarkan file_path / url
  const uniqueDocs = Array.from(new Map(allDocs.map((item: any) => {
    const path = item.file_path || item.url || item.foto_url || item.file_url || item.path || item.image_url || item.gambar_url;
    return [path, item];
  })).values());

  const dokumentasiPreview = uniqueDocs
    .map((item: any) => {
      const path = item.file_path || item.url || item.foto_url || item.file_url || item.path || item.image_url || item.gambar_url;
      if (!path) return null;
      return path.startsWith('http') ? path : `${STORAGE_URL}/${path}`;
    })
    .filter(Boolean)
    .slice(0, 4);

  const geotagPreview = (programData?.geotagList || []).slice(0, 6);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Siap Monitoring': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Berjalan':
      case 'Menunggu':
      case 'Menunggu Penugasan': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Menunggu Evaluasi': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Tindak Lanjut': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Selesai': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Dihentikan': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderHeader = () => {
    let title = 'Detail Program Monitoring';
    let subtitle = '';

    if (currentStatus === 'Berjalan' || currentStatus === 'Menunggu' || currentStatus === 'Menunggu Penugasan') {
      title = 'Tinjau Hasil Monitoring ';
      subtitle = 'Meninjau hasil monitoring periode aktif yang telah dilakukan oleh penyuluh.';
    } else if (currentStatus === 'Menunggu Evaluasi') {
      title = 'Detail Hasil Monitoring';
      subtitle = 'Halaman ini hanya menampilkan hasil monitoring. Proses evaluasi dilakukan oleh Tim Evaluasi pada modul evaluasi.';
    } else if (currentStatus === 'Selesai') {
      title = 'Hasil Monitoring';
      subtitle = 'Monitoring telah selesai untuk seluruh periode (P0 - P4). Berikut adalah ringkasan hasil akhir program.';
    } else if (currentStatus === 'Tindak Lanjut') {
      title = 'Detail Tindak Lanjut Monitoring';
      subtitle = 'Halaman ini menampilkan hasil evaluasi dan tindak lanjut program. Proses evaluasi dilakukan oleh Tim Evaluasi pada modul terpisah.';
    }

    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeColor(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {currentStatus === 'Selesai' ? (
            <>
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                <HiOutlineArrowLeft className="w-4 h-4" /> Kembali ke Daftar
              </button>
              <button onClick={() => setIsDownloadModalOpen(true)} className="px-4 py-2 bg-[#008A4B] text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <HiOutlineArrowDownTray className="w-4 h-4 stroke-2" /> Unduh Ringkasan Akhir
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
              </button>
              {currentStatus === 'Siap Monitoring' && (
                <button onClick={() => navigate(`/admin/staff/monitoring/verifikasi/tugaskan/${id || 'PRG-2026-0007'}`)} className="px-4 py-2 bg-[#008A4B] text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                  <HiOutlineUserPlus className="w-4 h-4 stroke-2" /> Tugaskan Monitoring
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderViewSiapMonitoring = () => (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <PiPlant className="w-7 h-7 text-[#008A4B]" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4">
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">ID Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sourceId || id || 'PRG-2026-0007'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">KTH</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.kth || 'KTH Karangsong Lestari'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Jenis Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">Rehabilitasi Mangrove</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Penyuluh</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.penyuluh || 'Ahmad Fauzi'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Lokasi</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold leading-relaxed">{programData?.lokasi || 'Desa Karangsong, Kec. Indramayu'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Periode Aktif</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">P2</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Luas Area</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.luas || '4,2 Ha'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Jadwal Monitoring</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">10 Mei 2026 – 27 Mei 2026</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Sumber Dana</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sumberDana || 'APBD'}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Ringkasan Realisasi P0</h3>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"><PiPlant className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Target Tanam</p><p className="text-base font-bold text-slate-900">{programData?.stats?.targetTanam || 0} <span className="text-[10px] font-normal text-slate-500">pohon</span></p></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Realisasi Tanam</p><p className="text-base font-bold text-slate-900">{programData?.stats?.targetTanam || 0} <span className="text-[10px] font-normal text-slate-500">pohon</span></p></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"><PiLeaf className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Tanaman Hidup</p><p className="text-base font-bold text-slate-900">{programData?.stats?.tanamanHidup || 0}</p></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100"><PiTree className="w-5 h-5 text-orange-500" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Tanaman Mati</p><p className="text-base font-bold text-slate-900">{programData?.stats?.tanamanMati || 0}</p></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100"><HiOutlineMapPin className="w-5 h-5 text-purple-600" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Titik Geotag</p><p className="text-base font-bold text-slate-900">{programData?.stats?.countGeotag || 0} <span className="text-[10px] font-normal text-slate-500">titik</span></p></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100"><HiOutlineDocumentText className="w-5 h-5 text-amber-600" /></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Dokumentasi</p><p className="text-base font-bold text-slate-900">{programData?.stats?.countDokumentasi || 0} <span className="text-[10px] font-normal text-slate-500">foto</span></p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Data Realisasi Penanaman P0</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 w-1/4">Target Tanam</td>
                    <td className="p-4 text-slate-900 w-1/4">{programData?.stats?.targetTanam || 0} pohon</td>
                    <td className="p-4 font-semibold text-slate-500 w-1/4">Tanggal Pelaksanaan</td>
                    <td className="p-4 text-slate-900 w-1/4">{programData?.pelaksanaan?.tanggal_mulai ? new Date(programData.pelaksanaan.tanggal_mulai).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Realisasi Tanam</td>
                    <td className="p-4 text-slate-900">{programData?.stats?.targetTanam || 0} pohon</td>
                    <td className="p-4 font-semibold text-slate-500">Lokasi Penanaman</td>
                    <td className="p-4 text-slate-900 whitespace-pre-line">{programData?.lokasi || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Persentase Hidup</td>
                    <td className="p-4 text-slate-900">{programData?.stats?.persentaseHidup || 0}%</td>
                    <td className="p-4 font-semibold text-slate-500">Pelaksana</td>
                    <td className="p-4 text-slate-900">{programData?.kth || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Persentase Mati</td>
                    <td className="p-4 text-slate-900">{((100 - parseFloat(programData?.stats?.persentaseHidup || 0)) || 0).toFixed(2)}%</td>
                    <td className="p-4 font-semibold text-slate-500">Catatan Singkat</td>
                    <td className="p-4 text-slate-900">{programData?.pelaksanaan?.arahan || programData?.pelaksanaan?.catatan || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Dokumentasi & Peta Lokasi</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-40 rounded-lg overflow-hidden border border-slate-200">
                <PetaPetakUkur
                  petakUkurs={programData?.petakUkurs}
                  emptyMessage="Belum ada batas petak ukur yang digambar penyuluh."
                />
              </div>
              <div className="flex flex-col gap-2">
                {dokumentasiPreview.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {dokumentasiPreview.map((url, i) => (
                      <div key={i} className="bg-slate-200 rounded-lg h-20 w-full bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url('${url}')` }}></div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-[10px] text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 text-center">
                    Belum ada dokumentasi pelaksanaan
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Riwayat Monitoring</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Periode</th>
                    <th className="py-3 px-5">Tanggal Monitoring</th>
                    <th className="py-3 px-5">Penyuluh</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programData?.riwayatMonitoring?.length > 0 ? (
                    programData.riwayatMonitoring.map((riwayat: any, idx: number) => {
                      const persenTumbuh = riwayat.persentase_tumbuh || 0;
                      let statusBadge = '';
                      if (persenTumbuh >= 75) statusBadge = 'bg-emerald-50 text-emerald-700';
                      else if (persenTumbuh >= 50) statusBadge = 'bg-yellow-50 text-yellow-700';
                      else statusBadge = 'bg-red-50 text-red-700';

                      return (
                        <tr key={riwayat.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-5 font-semibold text-slate-900">{riwayat.periode_monitoring || riwayat.jenis_kegiatan}</td>
                          <td className="py-3 px-5 text-slate-600">{riwayat.tanggal_penugasan ? new Date(riwayat.tanggal_penugasan).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</td>
                          <td className="py-3 px-5 text-slate-600">{riwayat.penyuluh?.name || riwayat.penyuluh?.username || '-'}</td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeColor(riwayat.status)}`}>
                              {riwayat.status}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-slate-600">{riwayat.arahan || riwayat.tujuan || '-'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">Belum ada riwayat monitoring</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderViewBerjalan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Program</h3>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900">Rehabilitasi Mangrove Karangsong</p></div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">{id || 'PRG-2026-0007'}</p></div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Jenis Program</p><p className="text-xs font-bold text-slate-900">Rehabilitasi Mangrove</p></div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Luas Area</p><p className="text-xs font-bold text-slate-900">25,40 Ha</p></div>
            <div className="col-span-2">
              <p className="text-[10px] text-slate-500 font-semibold mb-1 flex items-center gap-1"><HiOutlineMapPin className="w-3.5 h-3.5 text-green-600" /> Lokasi</p>
              <p className="text-xs font-bold text-slate-900 leading-relaxed">Desa Karangsong, Kec. Indramayu<br />Kabupaten Indramayu, Jawa Barat</p>
            </div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Penyuluh Pendamping</p><p className="text-xs font-bold text-slate-900">Ahmad Fauzi, SP</p></div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring </p><p className="text-xs font-bold text-slate-900">22 Mei 2026</p></div>
            <div className="col-span-2"><p className="text-[10px] text-slate-500 font-semibold mb-1">KTH Pelaksana</p><p className="text-xs font-bold text-slate-900">KTH Karangsong Lestari</p></div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Periode Aktif</p>
              <p className="text-xs font-bold text-slate-900">P2</p>
            </div>
            <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Periode</p><p className="text-xs font-bold text-slate-900">10 Mei 2026 – 27 Mei 2026</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 mb-4">Hasil Monitoring <span className="text-xs font-normal text-slate-500 ml-1">(22 Mei 2026)</span></h3>
          <div className="flex gap-6 border-b border-slate-200 text-sm">
            <button className="pb-3 border-b-2 border-[#008A4B] text-[#008A4B] font-bold cursor-pointer">Ringkasan Hasil</button>
            <button className="pb-3 text-slate-500 font-medium hover:text-slate-700 cursor-pointer">Data Detail</button>
            <button className="pb-3 text-slate-500 font-medium hover:text-slate-700 cursor-pointer">Dokumentasi</button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Tanaman Hidup</p>
              <div className="flex items-end justify-between">
                <div><h3 className="text-2xl font-bold text-slate-900 leading-none">{programData?.stats?.tanamanHidup || 0}</h3><p className="text-[10px] text-slate-400 mt-1">Batang</p></div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Tanaman Mati</p>
              <div className="flex items-end justify-between">
                <div><h3 className="text-2xl font-bold text-slate-900 leading-none">{programData?.stats?.tanamanMati || 0}</h3><p className="text-[10px] text-slate-400 mt-1">Batang</p></div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Persentase Hidup</p>
              <h3 className="text-2xl font-bold text-slate-900 leading-none mb-1">{programData?.stats?.persentaseHidup || 0}%</h3>
              <div className="mt-auto"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded">Aktual</span></div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Titik Geotag (PU)</p>
              <div className="flex items-end justify-between">
                <div><h3 className="text-2xl font-bold text-slate-900 leading-none">{programData?.stats?.countGeotag || 0}</h3><p className="text-[10px] text-slate-400 mt-1">Titik</p></div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Dokumentasi</p>
              <div className="flex items-end justify-between">
                <div><h3 className="text-2xl font-bold text-slate-900 leading-none">{programData?.stats?.countDokumentasi || 0}</h3><p className="text-[10px] text-slate-400 mt-1">Foto</p></div>
              </div>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-700 font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Indikator</th><th className="py-3 px-4">Target (P0)</th><th className="py-3 px-4">Hasil P2</th><th className="py-3 px-4">Perubahan</th><th className="py-3 px-4">Persentase</th><th className="py-3 px-4">Kriteria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              <tr><td className="py-3 px-4 font-bold text-slate-800">Total Tanaman</td><td className="py-3 px-4">15.000 Batang</td><td className="py-3 px-4">14.360 Batang</td><td className="py-3 px-4">-640</td><td className="py-3 px-4">95,73%</td><td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">Baik</span></td></tr>
              <tr><td className="py-3 px-4 font-bold text-slate-800">Tanaman Hidup</td><td className="py-3 px-4">13.860 Batang</td><td className="py-3 px-4">13.210 Batang</td><td className="py-3 px-4">-650</td><td className="py-3 px-4">92,01%</td><td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">Baik</span></td></tr>
              <tr><td className="py-3 px-4 font-bold text-slate-800">Tanaman Mati</td><td className="py-3 px-4">990 Batang</td><td className="py-3 px-4">1.150 Batang</td><td className="py-3 px-4 text-red-500">+160</td><td className="py-3 px-4">7,99%</td><td className="py-3 px-4"><span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-bold text-[10px]">Perlu Perhatian</span></td></tr>
              <tr><td className="py-3 px-4 font-bold text-slate-800">Persentase Hidup</td><td className="py-3 px-4">93,33%</td><td className="py-3 px-4">92,01%</td><td className="py-3 px-4">-1,32%</td><td className="py-3 px-4">92,01%</td><td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">Baik</span></td></tr>
              <tr><td className="py-3 px-4 font-bold text-slate-800">Titik Geotag</td><td className="py-3 px-4">120 Titik</td><td className="py-3 px-4">118 Titik</td><td className="py-3 px-4">-2</td><td className="py-3 px-4">98,33%</td><td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">Baik</span></td></tr>
              <tr><td className="py-3 px-4 font-bold text-slate-800">Dokumentasi</td><td className="py-3 px-4">48 Foto</td><td className="py-3 px-4">36 Foto</td><td className="py-3 px-4">-12</td><td className="py-3 px-4">75,00%</td><td className="py-3 px-4"><span className="text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded font-bold text-[10px]">Cukup</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderViewMenungguEvaluasi = () => (
    <div className="w-full">
      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Program</h3>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900">{programData?.programName || 'Rehabilitasi Mangrove'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">KTH</p><p className="text-xs font-bold text-slate-900">{programData?.kth || '-'}</p></div>
              <div className="col-span-1 row-span-4 hidden md:block lg:hidden">
              </div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">{id || 'PRG-2026-0007'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Penyuluh</p><p className="text-xs font-bold text-slate-900">{programData?.penyuluh || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Jenis Program</p><p className="text-xs font-bold text-slate-900">{programData?.jenis_kegiatan || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Periode Monitoring</p><p className="text-xs font-bold text-slate-900">{programData?.periode_monitoring || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Lokasi</p><p className="text-xs font-bold text-slate-900 leading-snug">{programData?.lokasi || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring</p><p className="text-xs font-bold text-slate-900">{programData?.tanggal_penugasan ? new Date(programData.tanggal_penugasan).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Luas Area</p><p className="text-xs font-bold text-slate-900">{programData?.luas || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Sumber Dana</p><p className="text-xs font-bold text-slate-900">{programData?.sumberDana || '-'}</p></div>
            </div>
            <div className="w-full md:hidden lg:block lg:w-48 shrink-0">
              <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                <PetaPetakUkur petakUkurs={programData?.petakUkurs} emptyMessage="Koordinat belum ada." />
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Hasil Monitoring P2 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Hasil Monitoring P2</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <PiPlant className="w-6 h-6 text-emerald-600 mb-1.5" />
              <p className="text-[9px] text-slate-500 font-semibold leading-tight">Persentase Keberhasilan</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{programData?.stats?.persentaseHidup || 0}%</h3>
              <span className="text-[9px] text-emerald-700 font-bold mt-1">Aktual</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <PiLeaf className="w-6 h-6 text-emerald-600 mb-1.5" />
              <p className="text-[9px] text-slate-500 font-semibold leading-tight">Jumlah Tanaman Hidup</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{programData?.stats?.tanamanHidup || 0}</h3>
              <p className="text-[9px] text-slate-400">Batang</p>
            </div>
            <div className="border border-orange-100 bg-orange-50/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <PiTree className="w-6 h-6 text-orange-500 mb-1.5" />
              <p className="text-[9px] text-slate-500 font-semibold leading-tight">Jumlah Tanaman Mati</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{programData?.stats?.tanamanMati || 0}</h3>
              <p className="text-[9px] text-slate-400">Batang</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <HiOutlineMapPin className="w-6 h-6 text-purple-600 mb-1.5" />
              <p className="text-[9px] text-slate-500 font-semibold leading-tight">Jumlah Titik Geotag (PU)</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{programData?.stats?.countGeotag || 0}</h3>
              <p className="text-[9px] text-slate-400">Titik</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <HiOutlineDocumentText className="w-6 h-6 text-amber-500 mb-1.5" />
              <p className="text-[9px] text-slate-500 font-semibold leading-tight">Dokumentasi & Periode</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{programData?.stats?.countDokumentasi || 0} <span className="text-[10px] font-normal text-slate-500">Foto</span></h3>
              <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded mt-1 font-bold">{programData?.periode_monitoring || '-'}</span>
            </div>
          </div>
        </div>

        {/* Data Hasil Monitoring Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Data Hasil Monitoring {programData?.periode_monitoring || 'P2'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <tr><th className="py-3 px-5">Indikator</th><th className="py-3 px-5">Target</th><th className="py-3 px-5">Hasil Aktual</th><th className="py-3 px-5">Persentase</th><th className="py-3 px-5">Keterangan</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr><td className="py-3 px-5 text-slate-800">Total Tanaman</td><td className="py-3 px-5">{programData?.stats?.targetTanam || 0} Batang</td><td className="py-3 px-5">{(programData?.stats?.tanamanHidup || 0) + (programData?.stats?.tanamanMati || 0)} Batang</td><td className="py-3 px-5">{programData?.stats?.targetTanam > 0 ? (((programData?.stats?.tanamanHidup || 0) + (programData?.stats?.tanamanMati || 0)) / programData?.stats?.targetTanam * 100).toFixed(2) : 0}%</td><td className="py-3 px-5"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-[9px]">Baik</span></td></tr>
                <tr><td className="py-3 px-5 text-slate-800">Tanaman Hidup</td><td className="py-3 px-5">-</td><td className="py-3 px-5">{programData?.stats?.tanamanHidup || 0} Batang</td><td className="py-3 px-5">{programData?.stats?.persentaseHidup || 0}%</td><td className="py-3 px-5"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-[9px]">Baik</span></td></tr>
                <tr><td className="py-3 px-5 text-slate-800">Tanaman Mati</td><td className="py-3 px-5">-</td><td className="py-3 px-5">{programData?.stats?.tanamanMati || 0} Batang</td><td className="py-3 px-5">{programData?.stats?.targetTanam > 0 ? ((programData?.stats?.tanamanMati || 0) / (programData?.stats?.targetTanam) * 100).toFixed(2) : 0}%</td><td className="py-3 px-5"><span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold text-[9px]">Perlu Perhatian</span></td></tr>
                <tr><td className="py-3 px-5 text-slate-800">Titik Geotag</td><td className="py-3 px-5">-</td><td className="py-3 px-5">{programData?.stats?.countGeotag || 0} Titik</td><td className="py-3 px-5">-</td><td className="py-3 px-5">-</td></tr>
                <tr><td className="py-3 px-5 text-slate-800">Dokumentasi</td><td className="py-3 px-5">-</td><td className="py-3 px-5">{programData?.stats?.countDokumentasi || 0} Foto</td><td className="py-3 px-5">-</td><td className="py-3 px-5">-</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dokumen */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Dokumentasi Foto</h3>
            {dokumentasiPreview.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dokumentasiPreview.map((url, i) => (
                  <img key={`${url}-${i}`} src={url} alt={`Dokumentasi monitoring ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                ))}
              </div>
            ) : (
              <div className="h-32 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[11px] text-slate-500">
                Belum ada dokumentasi foto
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );

  const renderViewTindakLanjut = () => (
    <div className="space-y-6">

      {/* Ringkasan Program Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Program</h3>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Nama Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.programName || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">KTH</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.kth || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">ID Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.id || id || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Penyuluh</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.penyuluh || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Jenis Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sumberDana || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Periode Monitoring</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.periode_monitoring || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Lokasi</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold leading-relaxed">{programData?.lokasi || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Tanggal Monitoring</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.tanggal_penugasan ? new Date(programData.tanggal_penugasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Luas Area</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.luas || '-'}</span></div>
            <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs"><span className="text-slate-500 font-medium">Sumber Dana</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sumberDana || '-'}</span></div>
          </div>
        </div>
      </div>

      {/* Ringkasan Hasil Monitoring */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Hasil Monitoring {programData?.periode_monitoring || ''}</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="col-span-2 md:col-span-1 border border-emerald-100 bg-emerald-50/30 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[9px] text-slate-500 font-semibold mb-1">Persentase Keberhasilan</p>
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">{programData?.stats?.persentaseHidup || 0}%</h3>
            </div>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold mt-1 px-2 py-0.5 rounded">Aktual</span>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <PiLeaf className="w-5 h-5 text-emerald-600 mb-1" />
            <p className="text-[9px] text-slate-500 font-semibold mb-0.5">Jumlah Tanaman Hidup</p>
            <h3 className="text-lg font-bold text-slate-900">{programData?.stats?.tanamanHidup || 0}</h3>
            <p className="text-[8px] text-slate-400">Batang</p>
          </div>
          <div className="border border-red-100 bg-red-50/30 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-red-400"></div>
            <PiTree className="w-5 h-5 text-red-500 mb-1" />
            <p className="text-[9px] text-slate-500 font-semibold mb-0.5">Jumlah Tanaman Mati</p>
            <h3 className="text-lg font-bold text-slate-900">{programData?.stats?.tanamanMati || 0}</h3>
            <p className="text-[8px] text-slate-400">Batang</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <HiOutlineMapPin className="w-5 h-5 text-blue-500 mb-1" />
            <p className="text-[9px] text-slate-500 font-semibold mb-0.5">Jumlah Titik Geotag (PU)</p>
            <h3 className="text-lg font-bold text-slate-900">{programData?.stats?.countGeotag || 0}</h3>
            <p className="text-[8px] text-slate-400">Titik</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <HiOutlineDocumentText className="w-5 h-5 text-emerald-600 mb-1" />
            <p className="text-[9px] text-slate-500 font-semibold mb-0.5">Dokumentasi</p>
            <h3 className="text-lg font-bold text-slate-900">{programData?.stats?.countDokumentasi || 0}</h3>
            <p className="text-[8px] text-slate-400">Foto</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center bg-slate-50">
            <HiOutlineCalendar className="w-5 h-5 text-blue-500 mb-1" />
            <p className="text-[9px] text-slate-500 font-semibold mb-0.5">Periode Monitoring</p>
            <h3 className="text-xl font-bold text-slate-900">{programData?.periode_monitoring || '-'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Data Hasil Monitoring */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Data Hasil Monitoring {programData?.periode_monitoring || ''}</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
                <tr><th className="py-2.5 px-3">Indikator</th><th className="py-2.5 px-3">Target</th><th className="py-2.5 px-3">Hasil Aktual</th><th className="py-2.5 px-3">Persentase</th><th className="py-2.5 px-3">Keterangan</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="py-2.5 px-3">Total Tanaman</td>
                  <td className="py-2.5 px-3">{programData?.stats?.targetTanam || 0} Batang</td>
                  <td className="py-2.5 px-3">{(programData?.stats?.tanamanHidup || 0) + (programData?.stats?.tanamanMati || 0)} Batang</td>
                  <td className="py-2.5 px-3">{programData?.stats?.persentaseHidup || 0}%</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Baik</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Tanaman Hidup</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3">{programData?.stats?.tanamanHidup || 0} Batang</td>
                  <td className="py-2.5 px-3">{programData?.stats?.persentaseHidup || 0}%</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Baik</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Tanaman Mati</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3 text-red-500">{programData?.stats?.tanamanMati || 0} Batang</td>
                  <td className="py-2.5 px-3">{(100 - (programData?.stats?.persentaseHidup || 0)).toFixed(2)}%</td>
                  <td className="py-2.5 px-3"><span className="text-orange-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Perlu Perhatian</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Titik Geotag</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3">{programData?.stats?.countGeotag || 0} Titik</td>
                  <td className="py-2.5 px-3">100%</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Baik</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Dokumentasi</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3">{programData?.stats?.countDokumentasi || 0} Foto</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3"><span className="text-yellow-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Cukup</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Hasil Evaluasi dari Tim Evaluasi */}
        <div className="lg:col-span-5 bg-orange-50/30 rounded-xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center"><HiOutlineUserPlus className="w-4 h-4 text-orange-600" /></div>
            <h3 className="text-sm font-bold text-orange-800">Hasil Evaluasi dari Tim Evaluasi</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-[130px_10px_1fr] items-start text-xs">
              <span className="text-slate-600 font-medium">Keputusan Evaluasi</span><span className="text-slate-600">:</span>
              <span className="text-orange-700 font-bold">Perlu Penyulaman</span>
            </div>
            <div className="grid grid-cols-[130px_10px_1fr] items-start text-xs">
              <span className="text-slate-600 font-medium">Tanggal Evaluasi</span><span className="text-slate-600">:</span>
              <span className="text-slate-900 font-semibold">{programData?.batas_waktu ? new Date(programData.batas_waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
            </div>
            <div className="grid grid-cols-[130px_10px_1fr] items-start text-xs">
              <span className="text-slate-600 font-medium">Dievaluasi Oleh</span><span className="text-slate-600">:</span>
              <span className="text-slate-900 font-semibold">Staff PDAS Tim Evaluasi</span>
            </div>
            <div className="grid grid-cols-[130px_10px_1fr] items-start text-xs">
              <span className="text-slate-600 font-medium">Ringkasan Evaluasi</span><span className="text-slate-600">:</span>
              <span className="text-slate-900 leading-relaxed font-medium">Program memerlukan penyulaman pada beberapa titik karena terdapat tanaman mati dan pertumbuhan kurang optimal.</span>
            </div>
            <div className="grid grid-cols-[130px_10px_1fr] items-start text-xs">
              <span className="text-slate-600 font-medium">Rekomendasi</span><span className="text-slate-600">:</span>
              <span className="text-slate-900 leading-relaxed font-medium">Lakukan penyulaman pada titik prioritas dan lanjutkan pemantauan setelah tindak lanjut selesai.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Monitoring</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
                <tr><th className="py-2.5 px-3">Periode</th><th className="py-2.5 px-3">Tanggal</th><th className="py-2.5 px-3">Penyuluh</th><th className="py-2.5 px-3">Persentase Hidup</th><th className="py-2.5 px-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr><td className="py-2.5 px-3 font-bold text-slate-800">{programData?.periode_monitoring || '-'}</td><td className="py-2.5 px-3">{programData?.tanggal_penugasan ? new Date(programData.tanggal_penugasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td><td className="py-2.5 px-3">{programData?.penyuluh || '-'}</td><td className="py-2.5 px-3">{programData?.stats?.persentaseHidup || 0}%</td><td className="py-2.5 px-3"><span className="text-orange-700 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded font-bold text-[9px] leading-tight">Tindak Lanjut</span></td></tr>
              </tbody>
            </table>
          </div>
        </div> */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Dokumentasi Foto</h3>
          {dokumentasiPreview.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {dokumentasiPreview.map((url, i) => (
                <img key={`${url}-${i}`} src={url} alt={`Dokumentasi ${i + 1}`} className="w-full h-20 object-cover rounded border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center text-xs text-slate-400">Belum ada dokumentasi</div>
          )}
        </div> */}
      </div>

    </div>
  );

  const renderViewSelesai = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">

        {/* Informasi Program (Selesai Layout) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Informasi Program</h3>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4">
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Nama Program</p><p className="text-xs font-bold text-slate-900 leading-snug">{programData?.programName || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">ID Program</p><p className="text-xs font-bold text-slate-900">{programData?.id || id || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Jenis Program</p><p className="text-xs font-bold text-slate-900">{programData?.programName || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Luas Area</p><p className="text-xs font-bold text-slate-900">{programData?.luas || '-'}</p></div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 font-semibold mb-1 flex items-center gap-1"><HiOutlineMapPin className="w-3.5 h-3.5 text-green-600" /> Lokasi Program</p>
                <p className="text-xs font-bold text-slate-900 leading-relaxed">{programData?.lokasi || '-'}</p>
              </div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Penyuluh Pendamping</p><p className="text-xs font-bold text-slate-900">{programData?.penyuluh || '-'}</p></div>
              <div><p className="text-[10px] text-slate-500 font-semibold mb-1">KTH Pelaksana</p><p className="text-xs font-bold text-slate-900">{programData?.kth || '-'}</p></div>
              <div className="col-span-4 border-t border-slate-100 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Periode Monitoring</p><p className="text-xs font-bold text-slate-900">{programData?.periode_monitoring || '-'}</p></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring Awal</p><p className="text-xs font-bold text-slate-900">{programData?.tanggal_penugasan ? new Date(programData.tanggal_penugasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Tanggal Monitoring Akhir</p><p className="text-xs font-bold text-slate-900">{programData?.batas_waktu ? new Date(programData.batas_waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p></div>
                <div><p className="text-[10px] text-slate-500 font-semibold mb-1">Total Durasi Monitoring</p><p className="text-xs font-bold text-slate-900">-</p></div>
              </div>
            </div>
            <div className="w-full md:hidden lg:block lg:w-48 shrink-0">
              <p className="text-[10px] text-slate-500 font-semibold mb-2">Lokasi Program</p>
              <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-200">
                <PetaPetakUkur petakUkurs={programData?.petakUkurs} emptyMessage="Koordinat belum ada." />
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Hasil Akhir (P4) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Hasil Akhir (P4)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border border-emerald-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <PiPlant className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-[10px] text-slate-500 font-semibold">Tanaman Hidup</p>
              <h3 className="text-xl font-bold text-slate-900 my-1">{programData?.stats?.tanamanHidup || 0} <span className="text-[10px] font-normal text-slate-500">batang</span></h3>
              <p className="text-[10px] font-bold text-emerald-600">{programData?.stats?.persentaseHidup || 0}% Aktual</p>
            </div>
            <div className="border border-red-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <PiTree className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-[10px] text-slate-500 font-semibold">Tanaman Mati</p>
              <h3 className="text-xl font-bold text-slate-900 my-1">{programData?.stats?.tanamanMati || 0} <span className="text-[10px] font-normal text-slate-500">batang</span></h3>
              <p className="text-[10px] font-bold text-red-500">{(100 - (programData?.stats?.persentaseHidup || 0)).toFixed(2)}% Aktual</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm">
              <HiOutlineMapPin className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-[10px] text-slate-500 font-semibold">Titik Geotag (PU)</p>
              <h3 className="text-xl font-bold text-slate-900 my-1">{programData?.stats?.countGeotag || 0} <span className="text-[10px] font-normal text-slate-500">titik</span></h3>
              <p className="text-[10px] font-bold text-emerald-600">100% terverifikasi</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm">
              <HiOutlineDocumentText className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-[10px] text-slate-500 font-semibold">Dokumentasi</p>
              <h3 className="text-xl font-bold text-slate-900 my-1">{programData?.stats?.countDokumentasi || 0} <span className="text-[10px] font-normal text-slate-500">foto</span></h3>
              <p className="text-[10px] font-bold text-emerald-600">Lengkap</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 shadow-sm bg-slate-50/50">
              <HiOutlineCalendar className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-[10px] text-slate-500 font-semibold">Periode Monitoring</p>
              <h3 className="text-xs font-bold text-slate-900 my-1 leading-snug">{programData?.periode_monitoring || '-'}</h3>
              <p className="text-[10px] font-bold text-slate-600 mt-1">Selesai</p>
            </div>
          </div>
        </div>

        {/* Bottom Row Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Dokumentasi Kegiatan</h3>
              <span className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer">Lihat Semua ({allDocs.length})</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {dokumentasiPreview.length > 0 ? dokumentasiPreview.map((url: string, i: number) => (
                <div key={i} className="bg-slate-200 rounded h-16 bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url('${url}')` }}></div>
              )) : (
                <div className="col-span-4 h-16 bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400">Belum ada dokumentasi</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Evaluasi Akhir Program</h3>
            <div className="flex gap-3 items-start">
              <div className="mt-1"><HiOutlineDocumentCheck className={`w-6 h-6 ${Number(programData?.stats?.persentaseHidup) >= 80 ? 'text-[#008A4B]' : 'text-orange-500'}`} /></div>
              <div>
                <h4 className={`text-xs font-bold mb-1 ${Number(programData?.stats?.persentaseHidup) >= 80 ? 'text-[#008A4B]' : 'text-orange-600'}`}>{Number(programData?.stats?.persentaseHidup) >= 80 ? 'Program dinyatakan berhasil.' : 'Program perlu perhatian khusus.'}</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed mb-2">Persentase hidup tanaman mangrove mencapai {programData?.stats?.persentaseHidup || 0}%.</p>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${Number(programData?.stats?.persentaseHidup) >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{Number(programData?.stats?.persentaseHidup) >= 80 ? 'Memenuhi Kriteria' : 'Tidak Memenuhi Kriteria'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="lg:col-span-4 space-y-6">

        {/* Status Selesai Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <h3 className="text-sm font-bold text-slate-500 mb-4 text-left border-b border-slate-100 pb-3 w-full">Status Program</h3>
          <div className="flex justify-center mb-4 mt-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-emerald-600 mb-2">Monitoring Selesai</h2>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-6 px-2">Seluruh periode monitoring (P0 – P4) telah selesai dilaksanakan. Data dan dokumentasi telah diverifikasi.</p>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-left space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 flex items-center gap-1.5"><HiOutlineCalendar className="w-3.5 h-3.5 text-emerald-600" /> Tanggal Selesai Monitoring Akhir</span>
              <span className="font-bold text-slate-900">12 Mei 2027</span>
            </div>
            <div className="flex justify-between items-center text-[10px] border-t border-slate-200 pt-2">
              <span className="text-slate-500 flex items-center gap-1.5"><HiOutlineUserPlus className="w-3.5 h-3.5 text-emerald-600" /> Dievaluasi Oleh</span>
              <span className="font-bold text-slate-900">Tim Evaluasi PDAS Citarum</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-12">

      {/* Tampilan Content Berubah Sepenuhnya Sesuai Status */}
      <div className="max-w-[1600px] mx-auto">
        {renderHeader()}
        {currentStatus === 'Siap Monitoring' && renderViewSiapMonitoring()}
        {(currentStatus === 'Berjalan' || currentStatus === 'Menunggu' || currentStatus === 'Menunggu Penugasan') && renderViewBerjalan()}
        {currentStatus === 'Menunggu Evaluasi' && renderViewMenungguEvaluasi()}
        {currentStatus === 'Tindak Lanjut' && renderViewTindakLanjut()}
        {currentStatus === 'Selesai' && renderViewSelesai()}
        {currentStatus === 'Dihentikan' && renderViewSiapMonitoring()}
      </div>

      {/* MODAL UNDUH / CETAK RINGKASAN */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-white">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] leading-tight">
                  {currentStatus === 'Selesai' ? 'Unduh Ringkasan Akhir' : 'Cetak Ringkasan Monitoring'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {currentStatus === 'Selesai'
                    ? 'Unduh ringkasan akhir monitoring program dalam format dokumen resmi.'
                    : 'Unduh ringkasan progres monitoring program dalam format dokumen resmi.'}
                </p>
              </div>
              <button onClick={() => setIsDownloadModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-white flex-1 space-y-8">

              {/* Info Program Box */}
              <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shrink-0">
                  <PiPlant className="w-7 h-7 text-[#008A4B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base">Rehabilitasi Mangrove Karangsong</h3>
                  <div className="flex items-center gap-2 mt-1 mb-1.5">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{id || 'PRG-2026-0007'}</span>
                    <span className="text-[11px] text-slate-500">Desa Karangsong, Kec. Indramayu, Kab. Indramayu</span>
                  </div>
                </div>
                <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(currentStatus)}`}>
                  {currentStatus === 'Selesai' ? 'Monitoring Selesai' : currentStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Kolom Kiri: Rincian Info */}
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      Informasi Dokumen
                    </h4>
                    <div className="space-y-3.5 text-sm">
                      <div className="grid grid-cols-[140px_10px_1fr] items-start">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineDocumentText className="w-4 h-4" /> Nama Dokumen</span><span>:</span>
                        <span className="text-slate-900 font-medium">Ringkasan_{currentStatus === 'Selesai' ? 'Akhir_' : ''}Monitoring_P2_Karangsong.pdf</span>
                      </div>
                      <div className="grid grid-cols-[140px_10px_1fr] items-start">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineDocument className="w-4 h-4" /> Jenis Dokumen</span><span>:</span>
                        <span className="text-slate-900 font-medium">PDF Ringkasan {currentStatus === 'Selesai' ? 'Akhir' : 'Monitoring'}</span>
                      </div>
                      <div className="grid grid-cols-[140px_10px_1fr] items-start">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineArrowDownTray className="w-4 h-4" /> Ukuran Perkiraan</span><span>:</span>
                        <span className="text-slate-900 font-medium">2.4 MB</span>
                      </div>
                      <div className="grid grid-cols-[140px_10px_1fr] items-start">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4" /> Tanggal Dibuat</span><span>:</span>
                        <span className="text-slate-900 font-medium">12 Mei 2027</span>
                      </div>
                      <div className="grid grid-cols-[140px_10px_1fr] items-start">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><HiOutlineUserPlus className="w-4 h-4" /> Dibuat Oleh</span><span>:</span>
                        <span className="text-slate-900 font-medium">Sistem / Staff PDAS</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      Isi Ringkasan
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Ringkasan identitas program</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Hasil {currentStatus === 'Selesai' ? 'akhir monitoring P0 - P4' : 'progres monitoring'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Grafik perkembangan persentase hidup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Perbandingan kondisi awal dan akhir</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Dokumentasi {currentStatus === 'Selesai' ? 'akhir program' : 'kegiatan monitoring'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Riwayat status program</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-[#008A4B] shrink-0" />
                        <span className="font-medium">Catatan akhir dan evaluasi akhir</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Kolom Kanan: Preview Dokumen Cover Mockup */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-70 aspect-[1/1.4] bg-white border border-slate-200 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col relative overflow-hidden">
                    {/* Kop Surat Header Mockup */}
                    <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center"><PiPlant className="text-white w-4 h-4" /></div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-800 leading-tight">BPDAS Citarum</p>
                        <p className="text-[6px] text-slate-500">Sistem Informasi Jabar</p>
                      </div>
                    </div>
                    {/* Title Dokumen Mockup */}
                    <div className="px-6 py-8">
                      <h3 className="text-[#0f172a] font-bold text-xl leading-tight mb-2">Ringkasan {currentStatus === 'Selesai' ? 'Akhir' : 'Monitoring'}</h3>
                      <h3 className="text-[#0f172a] font-bold text-xl leading-tight mb-4">Program Rehabilitasi</h3>
                      <div className="w-12 h-1 bg-[#008A4B] mb-4"></div>
                      <p className="text-xs font-bold text-slate-600">Rehabilitasi Mangrove Karangsong</p>
                    </div>
                    {/* Ilustrasi Bawah Mockup */}
                    <div className="mt-auto h-32 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400')] bg-cover bg-center opacity-80 relative">
                      <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent"></div>
                      <p className="absolute bottom-4 left-6 text-[10px] font-bold text-slate-500">Mei 2027</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Info Bottom */}
              <div className="bg-[#eff6ff] text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-[#bfdbfe]">
                <HiOutlineInformationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  Dokumen ini akan diunduh sebagai arsip ringkasan {currentStatus === 'Selesai' ? 'akhir program monitoring yang telah selesai' : 'progres program monitoring berjalan'}.
                </p>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-[#0f172a] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm" onClick={() => handlePrint()}>
                <HiOutlineEye className="w-4 h-4" /> Lihat Preview
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-[#008A4B] rounded-lg hover:bg-[#00753f] transition-colors flex items-center gap-2 shadow-sm cursor-pointer" onClick={() => handlePrint()}>
                <HiOutlineArrowDownTray className="w-4 h-4" /> Unduh PDF
              </button>
            </div>

          </div>
        </div>
      )}

      <TemplateRekapMonitoringPDF programData={programData} ref={pdfRef} />
    </div>
  );
};

export default DetailMonitoringPage;