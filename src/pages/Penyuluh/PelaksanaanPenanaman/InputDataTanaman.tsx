import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiChevronRight,
  HiOutlineInformationCircle,
  HiCheck,
  HiChevronDown,
  HiOutlineCamera,
  HiOutlineMapPin,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineBars3,
  HiEllipsisVertical,
  HiOutlineArrowPath,
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlinePhoto,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineClock,
  HiOutlineCalendar,
  HiCheckCircle,
  HiOutlineEye,
  HiChevronLeft
} from 'react-icons/hi2';
import { PiLeaf, PiPlant, PiTree } from 'react-icons/pi';
import { BiMapAlt } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const API_BASE_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_BASE_URL.replace(/\/api\/?$/, '') + '/storage';

const PelaksanaanWizard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [penugasanData, setPenugasanData] = useState<any>(null);
  const [puList, setPuList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [activePu, setActivePu] = useState<any>(null);
  const [tanamanList, setTanamanList] = useState<any[]>([]);
  const [availableSeeds, setAvailableSeeds] = useState<any[]>([]);
  const [formTanaman, setFormTanaman] = useState({ seed_id: '', nama_tanaman: '', tinggi: '', catatan: '', photo: null as File | null });
  const [tanamanPhotoPreview, setTanamanPhotoPreview] = useState<string | null>(null);
  const [tanamanCoords, setTanamanCoords] = useState<{ lat: number | null; lng: number | null; error: string | null }>({ lat: null, lng: null, error: null });
  const [isNewSeed, setIsNewSeed] = useState(false);
  const [dokumentasiList, setDokumentasiList] = useState<any[]>([]);
  const [formDokumentasi, setFormDokumentasi] = useState({ jenis_dokumentasi: 'Foto Sebelum', keterangan: '', file: null as File | null });
  const [dokumentasiPreview, setDokumentasiPreview] = useState<string | null>(null);
  const [puTablePage, setPuTablePage] = useState(1);
  const PU_TABLE_PAGE_SIZE = 10;

  useEffect(() => {
    if (!formTanaman.photo) {
      setTanamanPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(formTanaman.photo);
    setTanamanPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formTanaman.photo]);

  const normalizeSeedOption = (item: any, index: number) => {
    if (!item) return null;

    const seedId = item.id ?? item.seed_id ?? item.seedId ?? item.seed_specification_id ?? item.seedSpecificationId ?? index + 1;
    const seedName = item.name ?? item.nama_bibit ?? item.bibit_nama ?? item.jenis_bibit ?? item.nama ?? item.seed_name ?? item.label;

    if (!seedName) return null;

    return {
      id: String(seedId),
      name: String(seedName),
    };
  };

  const buildSeedOptionsFromProgram = (programData: any) => {
    const source = programData?.penugasanable || programData;
    const candidates = [
      source?.jenis_bibit,
      source?.jenisBibit,
      source?.seed_specifications,
      source?.seedSpecifications,
      source?.bibit,
      source?.bibits,
    ];

    for (const list of candidates) {
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map(normalizeSeedOption).filter(Boolean);
        if (normalized.length > 0) return normalized;
      }
    }

    return [];
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setTanamanCoords({ lat: null, lng: null, error: 'Perangkat tidak mendukung GPS' });
      return;
    }
    setTanamanCoords(prev => ({ ...prev, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTanamanCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null });
      },
      () => {
        setTanamanCoords({ lat: null, lng: null, error: 'Gagal mengambil lokasi. Aktifkan izin GPS.' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (currentStep === 3) fetchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (!formDokumentasi.file) {
      setDokumentasiPreview(null);
      return;
    }
    const url = URL.createObjectURL(formDokumentasi.file);
    setDokumentasiPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formDokumentasi.file]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

        // 1. Fetch Penugasan Detail
        const resP = await fetch(`${API_URL}/penugasan/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const jsonP = await resP.json();
        const d = jsonP.data;

        let programName = '-';
        let location = '-';
        let kth = '-';
        let targetBibit = '0';
        let totalPu = '0';

        if (d.penugasanable_type === 'App\\Models\\DonationProgram') {
          programName = d.penugasanable?.name || '-';
          location = d.penugasanable?.location || '-';
          kth = d.penugasanable?.kth?.name || '-';
          targetBibit = d.penugasanable?.target_amount || '0';
          totalPu = (d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.jumlah_pu || '0';
        } else if (d.penugasanable_type === 'App\\Models\\ProgramApbd' || d.penugasanable_type === 'App\\Models\\ProgramCsr') {
          programName = d.penugasanable?.nama_program || '-';
          location = d.penugasanable?.lokasi || (d.penugasanable?.kth ? `${d.penugasanable.kth.desa_kelurahan}, ${d.penugasanable.kth.kabupaten_kota}` : '-');
          kth = d.penugasanable?.kth?.nama || '-';
          targetBibit = d.penugasanable?.target_bibit || d.penugasanable?.jumlah_bibit || '0';
          totalPu = (d.penugasanable?.analysis_result_zone || d.penugasanable?.analysisResultZone)?.jumlah_pu || '0';
        }

        setPenugasanData({
          id: d.id,
          idPenugasan: `TGS-${d.id}`,
          idProgram: d.penugasanable?.id ? `PRG-${d.penugasanable.id}` : '-',
          programName, location, kth, targetBibit, totalPu,
          periodeMulai: d.tanggal_mulai ? new Date(d.tanggal_mulai).toLocaleDateString('id-ID') : '-',
          periodeSelesai: d.batas_waktu ? new Date(d.batas_waktu).toLocaleDateString('id-ID') : '-',
          jenisKegiatan: d.jenis_kegiatan,
          targetPerPu: (parseInt(totalPu) || 0) > 0 ? String(Math.max(1, Math.floor((parseInt(targetBibit) || 0) / (parseInt(totalPu) || 1)))) : '0',
          luasArea: d.penugasanable?.analysisResultZone?.luas_ha || 0
        });

        // 2. Fetch PU List
        const resPU = await fetch(`${API_URL}/penugasan/${id}/petak-ukur`, { headers: { 'Authorization': `Bearer ${token}` } });
        const jsonPU = await resPU.json();

        const dataPU = jsonPU.data || [];
        const puCount = parseInt(totalPu) || 0;

        // Merge fetched data with placeholders
        const updatedList = Array.from({ length: puCount }, (_, i) => {
          if (dataPU[i]) {
            return {
              id: dataPU[i].id,
              num: i + 1,
              status: dataPU[i].status,
              luas: `${dataPU[i].luas} ha`,
              dataTanamans: dataPU[i].data_tanamans || dataPU[i].dataTanamans || []
            };
          }
          return {
            id: null, num: i + 1,
            status: isDrawingMode && i === dataPU.length ? 'Sedang Dibuat' : 'Belum Dibuat',
            luas: isDrawingMode && i === dataPU.length ? '0.18 ha' : '-',
            dataTanamans: []
          };
        });
        setPuList(updatedList);

        // Prioritaskan bibit dari data program donasi / APBD / CSR, baru fallback ke endpoint seeds bawaan penugasan
        const programSeedOptions = buildSeedOptionsFromProgram(d);
        if (programSeedOptions.length > 0) {
          setAvailableSeeds(programSeedOptions);
        } else {
          const resSeeds = await fetch(`${API_URL}/penugasan/${id}/seeds`, { headers: { 'Authorization': `Bearer ${token}` } });
          const jsonSeeds = await resSeeds.json();
          const fallbackSeeds = (jsonSeeds.data || []).map(normalizeSeedOption).filter(Boolean);
          setAvailableSeeds(fallbackSeeds.length > 0 ? fallbackSeeds : []);
        }

        // Fetch Dokumentasi
        const resDok = await fetch(`${API_URL}/penugasan/${id}/dokumentasi`, { headers: { 'Authorization': `Bearer ${token}` } });
        const jsonDok = await resDok.json();
        setDokumentasiList(jsonDok.data || []);

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchAPI();
  }, [id, isDrawingMode]);

  const nextStep = () => {
    if (currentStep < 5) {
      if (currentStep === 2 && !activePu && puList.length > 0) {
        const firstSelesaiPu = puList.find(p => p.status === 'Selesai') || puList[0];
        setActivePu(firstSelesaiPu);
        if (firstSelesaiPu?.id) fetchTanamanByPu(firstSelesaiPu.id);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 2) setCurrentStep(currentStep - 1);
    else navigate(-1);
  };

  // FUNGSI KONTROL POLIGON
  const handleMapClick = (lat: number, lng: number) => {
    setPolygonPoints(prev => [...prev, [lat, lng]]);
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
  };

  const handleSavePolygon = async () => {
    if (polygonPoints.length < 3) {
      toast.error('Minimal 3 titik untuk membentuk poligon PU');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const createdPuCount = puList.filter(p => p.status === 'Selesai').length;

      const payload = {
        penugasan_id: id,
        nama: `PU ${createdPuCount + 1}`,
        luas: 0.18, // Simulasi luasan untuk demo
        polygon_data: polygonPoints.map(p => ({ lat: p[0], lng: p[1] }))
      };

      const res = await fetch(`${API_URL}/petak-ukur`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('PU berhasil disimpan!');
        setPolygonPoints([]);
        setIsDrawingMode(false); // Trigger useEffect reload
        setTimeout(() => setIsDrawingMode(true), 100);
      } else {
        toast.error('Gagal menyimpan PU');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  const refreshPuList = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const resPU = await fetch(`${API_URL}/penugasan/${id}/petak-ukur`, { headers: { 'Authorization': `Bearer ${token}` } });
      const jsonPU = await resPU.json();
      const dataPU = jsonPU.data || [];
      const puCount = parseInt(penugasanData?.totalPu || '0') || dataPU.length;

      const updatedList = Array.from({ length: puCount }, (_, i) => {
        if (dataPU[i]) {
          return {
            id: dataPU[i].id,
            num: i + 1,
            status: dataPU[i].status,
            luas: `${dataPU[i].luas} ha`,
            dataTanamans: dataPU[i].data_tanamans || dataPU[i].dataTanamans || []
          };
        }
        return { id: null, num: i + 1, status: 'Belum Dibuat', luas: '-', dataTanamans: [] };
      });
      setPuList(updatedList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setPuTablePage(1);
  }, [puList.length]);

  const fetchTanamanByPu = async (puId: number) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_URL}/petak-ukur/${puId}/tanaman`, { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      setTanamanList(json.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTanaman = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePu) return toast.error('Pilih PU terlebih dahulu');
    if (!isNewSeed && !formTanaman.seed_id) return toast.error('Pilih jenis tanaman');
    if (isNewSeed && !formTanaman.nama_tanaman) return toast.error('Isi nama tanaman baru');
    if (!formTanaman.tinggi) return toast.error('Isi tinggi tanaman');
    if (!formTanaman.photo) return toast.error('Foto tanaman wajib diambil');
    if (tanamanCoords.lat === null || tanamanCoords.lng === null) return toast.error('Koordinat lokasi belum tersedia, coba ambil ulang lokasi');

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

      const formData = new FormData();
      formData.append('jumlah', '1');
      formData.append('kondisi_tanaman', 'Baik');
      formData.append('keterangan', formTanaman.catatan);
      formData.append('tinggi_tanaman', formTanaman.tinggi);
      formData.append('latitude', String(tanamanCoords.lat));
      formData.append('longitude', String(tanamanCoords.lng));
      formData.append('photo', formTanaman.photo);

      if (isNewSeed) {
        formData.append('nama_tanaman', formTanaman.nama_tanaman);
      } else {
        formData.append('seed_id', formTanaman.seed_id);
      }

      const res = await fetch(`${API_URL}/petak-ukur/${activePu.id}/tanaman`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        toast.success('Data tanaman disimpan');
        setFormTanaman({ seed_id: '', nama_tanaman: '', tinggi: '', catatan: '', photo: null });
        setIsNewSeed(false);
        fetchTanamanByPu(activePu.id);
        refreshPuList();
        fetchCurrentLocation();
      } else {
        toast.error('Gagal menyimpan tanaman');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  const handleUploadDokumentasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDokumentasi.file) return toast.error('Pilih file terlebih dahulu');
    if (!formDokumentasi.keterangan.trim()) return toast.error('Isi keterangan foto terlebih dahulu');
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const formData = new FormData();
      formData.append('file', formDokumentasi.file);
      formData.append('jenis_dokumentasi', formDokumentasi.jenis_dokumentasi);
      formData.append('keterangan', formDokumentasi.keterangan);

      const res = await fetch(`${API_URL}/penugasan/${id}/dokumentasi`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        toast.success('Dokumentasi diunggah');
        setFormDokumentasi({ jenis_dokumentasi: 'Foto Sebelum', keterangan: '', file: null });
        const resDok = await fetch(`${API_URL}/penugasan/${id}/dokumentasi`, { headers: { 'Authorization': `Bearer ${token}` } });
        const jsonDok = await resDok.json();
        setDokumentasiList(jsonDok.data || []);
      } else {
        let message = 'Gagal mengunggah dokumentasi';
        try {
          const errJson = await res.json();
          message = errJson.message || Object.values(errJson.errors || {}).flat().join(', ') || message;
        } catch { }
        toast.error(message);
      }
    } catch (e) {
      toast.error('Terjadi kesalahan jaringan saat upload');
    }
  };

  const handleSubmitPenugasan = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_URL}/penugasan/${id}/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Laporan berhasil disubmit');
        navigate('/admin/penyuluh/pelaksanaan-penanaman');
      }
    } catch (e) {
      toast.error('Terjadi kesalahan');
    }
  };

  const renderStepper = () => {
    const steps = [
      { num: 1, title: 'Informasi Penugasan', status: 'Selesai' },
      { num: 2, title: 'Pembentukan Poligon PU', status: currentStep === 2 ? 'Sedang dikerjakan' : currentStep > 2 ? 'Selesai' : 'Belum dimulai' },
      { num: 3, title: 'Input Tanaman per PU', status: currentStep === 3 ? 'Sedang dikerjakan' : currentStep > 3 ? 'Selesai' : 'Belum dimulai' },
      { num: 4, title: 'Dokumentasi Kegiatan', status: currentStep === 4 ? 'Sedang dikerjakan' : currentStep > 4 ? 'Selesai' : 'Belum dimulai' },
      { num: 5, title: 'Review & Kirim', status: currentStep === 5 ? 'Sedang dikerjakan' : 'Belum dimulai' },
    ];

    return (
      <div className="flex items-center w-full mb-6 overflow-x-auto custom-scrollbar pb-2">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'Selesai';
          const isActive = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              <div className={`flex items-center gap-3 shrink-0 ${!isCompleted && !isActive ? 'opacity-50' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 
                  ${isCompleted ? 'bg-[#008A4B] border-[#008A4B] text-white' :
                    isActive ? 'bg-[#008A4B] border-[#008A4B] text-white' :
                      'bg-white border-gray-300 text-gray-400'}`}
                >
                  {isCompleted ? <HiCheck className="w-5 h-5" /> : step.num}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isActive ? 'text-[#008A4B]' : 'text-slate-900'}`}>{step.title}</span>
                  <span className={`text-xs font-medium ${isActive ? 'text-[#008A4B]' : 'text-slate-500'}`}>{step.status}</span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <HiOutlineArrowRight className="w-5 h-5 text-gray-300 mx-4 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderStep2 = () => {
    if (isLoading || !penugasanData) return <div className="p-8 text-center">Loading Data...</div>;

    const puSelesai = puList.filter(p => p.status === 'Selesai').length;
    const puProses = puList.filter(p => p.status === 'Sedang Dibuat').length;
    const puBelum = puList.filter(p => p.status === 'Belum Dibuat').length;
    const persentasePu = Math.round((puSelesai / (parseInt(penugasanData.totalPu) || 1)) * 100);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Informasi Kegiatan</h3>
              <HiOutlineInformationCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex"><span className="w-2/5 text-slate-500">ID Penugasan</span><span className="w-3/5 text-emerald-700 font-bold">{penugasanData.idPenugasan}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">ID Program</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.idProgram}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Program</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.programName}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Lokasi</span><span className="w-3/5 text-slate-900 font-medium whitespace-pre-line">{penugasanData.location}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">KTH</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.kth}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Jenis Kegiatan</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.jenisKegiatan}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Target Bibit</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.targetBibit} bibit</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Jumlah PU</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.totalPu} PU</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Target per PU</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.targetPerPu} bibit</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500">Periode</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData.periodeMulai} - {penugasanData.periodeSelesai}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Ringkasan PU</h3>
              <HiOutlineDocumentText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-2 text-xs border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between"><span className="text-slate-500 flex items-center gap-2"><BiMapAlt className="w-4 h-4" /> Total PU</span><span className="font-bold text-blue-600">{penugasanData.totalPu}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4" /> PU Selesai</span><span className="font-bold text-emerald-600">{puSelesai}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 flex items-center gap-2"><HiOutlineClock className="w-4 h-4" /> PU Belum Dibuat</span><span className="font-bold text-blue-600">{puBelum}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
              <div><span className="text-slate-500 block mb-1">Luas Total (Target)</span><span className="font-bold text-blue-700 text-sm">{penugasanData.luasArea} ha</span></div>
              <div><span className="text-slate-500 block mb-1">Luas Terpetakan</span><span className="font-bold text-emerald-600 text-sm">{(puSelesai * 0.18).toFixed(2)} ha</span></div>
            </div>
            <div className="flex justify-between items-end mb-1 text-[10px]"><span className="text-slate-500">Persentase</span><span className="font-bold text-emerald-600">{persentasePu}%</span></div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${persentasePu}%` }}></div></div>
          </div>
        </div>

        {/* TENGAH: Peta Lokasi Kegiatan ASLI (Leaflet) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900">Peta Lokasi Kegiatan</h3>
              <BiMapAlt className="w-5 h-5 text-slate-400" />
            </div>

            <div className="w-full h-100 relative bg-slate-100">
              <MapContainer
                center={[-7.6321456, 107.6587921]}
                zoom={15}
                style={{ width: '100%', height: '100%', zIndex: 10 }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                  subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  maxZoom={20}
                />
                <MapEvents onMapClick={handleMapClick} />
                {polygonPoints.length > 0 && (
                  <Polygon
                    positions={polygonPoints}
                    pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.4, weight: 2, dashArray: '5,5' }}
                  />
                )}
                {polygonPoints.map((pos, idx) => (
                  <CircleMarker
                    key={idx}
                    center={pos}
                    radius={5}
                    pathOptions={{ color: 'white', weight: 2, fillColor: '#10B981', fillOpacity: 1 }}
                  />
                ))}
              </MapContainer>

              {/* Tombol Aksi Poligon */}
              {polygonPoints.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[9999] bg-white p-2 rounded-xl shadow-lg border border-slate-200">
                  <button
                    onClick={handleClearPolygon}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSavePolygon}
                    className="px-6 py-2 bg-[#008A4B] text-white hover:bg-emerald-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    Simpan PU ({polygonPoints.length} Titik)
                  </button>
                </div>
              )}

              {/* Info Mode */}
              {polygonPoints.length === 0 && (
                <div className="absolute top-4 left-4 z-[9999]">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-700">Mode Gambar Aktif: PU {puSelesai + 1}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3">Cara Menggambar Poligon</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-medium text-slate-600">
                <div><div className="w-10 h-10 bg-emerald-50 text-emerald-600 mx-auto rounded mb-1 flex items-center justify-center"><HiOutlineMapPin className="w-5 h-5" /></div>1. Klik pada peta untuk menambahkan titik awal</div>
                <div><div className="w-10 h-10 bg-emerald-50 text-emerald-600 mx-auto rounded mb-1 flex items-center justify-center"><PiTree className="w-5 h-5" /></div>2. Klik titik berikutnya untuk membentuk sisi poligon</div>
                <div><div className="w-10 h-10 bg-emerald-50 text-emerald-600 mx-auto rounded mb-1 flex items-center justify-center"><HiOutlineAdjustmentsHorizontal className="w-5 h-5" /></div>3. Minimal 3 titik untuk membentuk poligon</div>
                <div><div className="w-10 h-10 bg-emerald-50 text-emerald-600 mx-auto rounded mb-1 flex items-center justify-center"><HiOutlineCheckCircle className="w-5 h-5" /></div>4. Poligon akan otomatis tertutup</div>
                <div><div className="w-10 h-10 bg-emerald-50 text-emerald-600 mx-auto rounded mb-1 flex items-center justify-center"><HiOutlineDocumentArrowDown className="w-5 h-5" /></div>5. Klik Simpan PU jika sudah sesuai</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-145">
            <div className="p-4 border-b border-slate-100">
              <button className="w-full py-2 border border-[#008A4B] text-[#008A4B] rounded-lg text-xs font-bold flex justify-center items-center gap-1 hover:bg-emerald-50 transition-colors">
                <HiOutlinePlus className="w-4 h-4" /> Tambah PU <HiChevronDown className="w-3 h-3 ml-2" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Daftar PU ({penugasanData.totalPu})</h3>
              <HiOutlineInformationCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {puList.map(pu => (
                <div
                  key={pu.num}
                  onClick={() => {
                    if (pu.status === 'Selesai') {
                      setActivePu(pu);
                      if (pu.id) fetchTanamanByPu(pu.id);
                      setCurrentStep(3);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${pu.status === 'Sedang Dibuat' ? 'bg-orange-50 border-orange-100' :
                    pu.status === 'Selesai' ? 'hover:bg-slate-50 cursor-pointer border-transparent border-b-slate-100 last:border-b-transparent' :
                      'hover:bg-slate-50 border-transparent border-b-slate-100 last:border-b-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineBars3 className={`w-4 h-4 ${pu.status === 'Sedang Dibuat' ? 'text-slate-400' : 'text-slate-300'}`} />
                    <span className={`text-xs font-medium ${pu.status === 'Sedang Dibuat' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>PU {pu.num}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pu.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' :
                      pu.status === 'Sedang Dibuat' ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>{pu.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] ${pu.status === 'Belum Dibuat' ? 'text-slate-400' : 'font-medium text-slate-600'}`}>{pu.luas}</span>
                    {pu.status === 'Sedang Dibuat' ? (
                      <HiOutlinePencil className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                    ) : (
                      <HiEllipsisVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <button className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                <HiOutlineDocumentText className="w-4 h-4" /> Lihat Ringkasan Semua PU
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // STEP 3: INPUT DATA TANAMAN PER PU
  // ==========================================================================
  const renderStep3 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
      {/* Kolom Kiri: Info PU */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 mb-4">Informasi PU Aktif</h3>
          <span className="inline-block px-3 py-1 bg-[#008A4B] text-white text-xs font-bold rounded mb-4 shadow-sm">
            PU {activePu?.num || activePu?.nama || '-'}
          </span>

          <div className="space-y-3 text-xs">
            <div className="flex gap-4">
              <span className="w-1/3 text-slate-500">Lokasi</span>
              <span className="w-2/3 text-slate-900 font-medium leading-relaxed">{penugasanData?.location || '-'}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-1/3 text-slate-500">KTH</span>
              <span className="w-2/3 text-slate-900 font-medium">{penugasanData?.kth || '-'}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-1/3 text-slate-500">Program</span>
              <span className="w-2/3 text-slate-900 font-medium leading-relaxed">{penugasanData?.programName || '-'}</span>
            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Target di PU ini</span>
              <span className="font-bold text-slate-900">{penugasanData?.targetPerPu || '0'} tanaman</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sudah Input</span>
              <span className="font-bold text-slate-900">{tanamanList.length} tanaman</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sisa Target</span>
              <span className="font-bold text-slate-900">{Math.max(0, parseInt(penugasanData?.targetPerPu || '0') - tanamanList.length)} tanaman</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 mb-4 text-sm">Progress Input PU</h3>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-[#008A4B]">{tanamanList.length} <span className="text-slate-500 font-normal">/ {penugasanData?.targetPerPu || '0'} tanaman</span></span>
            <span className="text-xs font-bold text-slate-900">{Math.min(100, (tanamanList.length / (parseInt(penugasanData?.targetPerPu || '1'))) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-[#008A4B] rounded-full" style={{ width: `${Math.min(100, (tanamanList.length / (parseInt(penugasanData?.targetPerPu || '1'))) * 100)}%` }}></div>
          </div>
          <button onClick={() => setCurrentStep(2)} className="w-full py-2.5 border border-[#008A4B] text-[#008A4B] rounded-lg font-bold text-xs hover:bg-emerald-50 flex justify-center items-center gap-2 transition-colors shadow-sm">
            <HiOutlineArrowPath className="w-4 h-4" /> Ganti PU
          </button>
        </div>
      </div>

      {/* Kolom Tengah: Form Input */}
      <div className="lg:col-span-5 space-y-6">

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Tambah Data Tanaman</h3>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-[10px] font-bold">Tanaman ke-{tanamanList.length + 1} <span className="font-normal text-slate-500">dari {penugasanData?.targetPerPu || '0'}</span></span>
          </div>

          <form className="space-y-5" onSubmit={handleSaveTanaman}>
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2">1. Jenis Tanaman <span className="text-red-500">*</span></label>

              {!isNewSeed ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiLeaf className="h-4 w-4 text-[#008A4B]" />
                  </div>
                  <select
                    value={formTanaman.seed_id}
                    onChange={(e) => setFormTanaman({ ...formTanaman, seed_id: e.target.value })}
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-[#008A4B] focus:border-[#008A4B] appearance-none bg-white font-semibold text-slate-900 shadow-sm">
                    <option value="">Pilih Tanaman...</option>
                    {availableSeeds.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <HiChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiLeaf className="h-4 w-4 text-[#008A4B]" />
                  </div>
                  <input type="text"
                    value={formTanaman.nama_tanaman}
                    onChange={(e) => setFormTanaman({ ...formTanaman, nama_tanaman: e.target.value })}
                    placeholder="Ketik nama tanaman baru..."
                    required
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-[#008A4B] focus:border-[#008A4B] shadow-sm" />
                </div>
              )}

              <button type="button" onClick={() => setIsNewSeed(!isNewSeed)} className="text-blue-600 text-[10px] font-bold mt-2 flex items-center gap-1 hover:underline">
                {isNewSeed ? 'Kembali pilih dari daftar' : '+ Tambah jenis tanaman baru'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2">2. Tinggi Tanaman <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number"
                  value={formTanaman.tinggi}
                  onChange={(e) => setFormTanaman({ ...formTanaman, tinggi: e.target.value })}
                  className="w-full pl-3 pr-12 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-[#008A4B] focus:border-[#008A4B] shadow-sm" />
                <div className="absolute inset-y-0 right-0 px-3 border-l border-slate-300 flex items-center bg-slate-50 rounded-r-lg">
                  <span className="text-slate-500 text-[11px] font-medium">cm</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Ukur dari pangkal batang (di atas permukaan tanah) sampai ujung daun tertinggi.</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2">3. Foto Tanaman <span className="text-red-500">*</span></label>
              {formTanaman.photo ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 h-40 bg-slate-100 mb-3">
                  <img src={tanamanPhotoPreview || undefined} className="w-full h-full object-cover" alt="Preview tanaman" />
                  <button
                    type="button"
                    onClick={() => setFormTanaman({ ...formTanaman, photo: null })}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-600 rounded-full p-1.5 shadow-sm"
                  >
                    <HiOutlineArrowPath className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center h-28 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormTanaman({ ...formTanaman, photo: e.target.files[0] });
                        }
                      }}
                    />
                    <HiOutlineCamera className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">Ambil Foto</span>
                  </label>
                  <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center h-28 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormTanaman({ ...formTanaman, photo: e.target.files[0] });
                        }
                      }}
                    />
                    <HiOutlinePhoto className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">Dari Galeri</span>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2">4. Koordinat Lokasi (Otomatis)</label>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <span className="block text-[10px] text-slate-500 mb-1">Latitude</span>
                  <input type="text" readOnly value={tanamanCoords.lat !== null ? tanamanCoords.lat.toFixed(7) : 'Mengambil...'} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold text-slate-700 shadow-sm" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 mb-1">Longitude</span>
                  <input type="text" readOnly value={tanamanCoords.lng !== null ? tanamanCoords.lng.toFixed(7) : 'Mengambil...'} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold text-slate-700 shadow-sm" />
                </div>
              </div>
              {tanamanCoords.error && (
                <p className="text-[10px] text-red-600 mb-1">{tanamanCoords.error}</p>
              )}
              <button type="button" onClick={fetchCurrentLocation} className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
                <HiOutlineArrowPath className="w-3 h-3" /> Ambil ulang lokasi
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2">5. Catatan (Opsional)</label>
              <textarea rows={2}
                value={formTanaman.catatan}
                onChange={(e) => setFormTanaman({ ...formTanaman, catatan: e.target.value })}
                placeholder="Contoh: Tanaman tumbuh baik, akar kuat..." className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-[#008A4B] focus:border-[#008A4B] resize-none shadow-sm"></textarea>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="px-5 py-2.5 bg-[#008A4B] text-white font-bold text-xs hover:bg-emerald-800 rounded-lg transition-colors shadow-sm">
                Simpan Tanaman
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Kolom Kanan: Daftar & Ringkasan */}
      <div className="lg:col-span-4 space-y-6">

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Tanaman di PU {activePu?.num || '-'}</h3>
            <div className="flex gap-2">
              <button className="px-2.5 py-1.5 border border-slate-300 rounded-md text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50 shadow-sm text-slate-700">
                <HiOutlineAdjustmentsHorizontal className="w-3.5 h-3.5" /> Filter
              </button>
              <button className="p-1.5 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600 shadow-sm">
                <HiOutlineBars3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs font-bold text-[#008A4B] mb-4">{tanamanList.length} <span className="font-normal text-slate-500">tanaman</span></p>

          <div className="space-y-4 mb-4">
            {tanamanList.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="w-5 h-5 rounded text-[#008A4B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-1">{index + 1}</div>
                <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {item.foto_url ? (
                    <img src={`${STORAGE_URL}/${item.foto_url}`} className="w-full h-full object-cover" alt={item.nama_tanaman || 'Foto tanaman'} />
                  ) : (
                    <PiPlant className="text-slate-400 w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.nama_tanaman || item.seed?.name || 'Tanaman'}</p>
                  <p className="text-[9px] text-slate-500 flex items-center gap-1 mt-1"><PiLeaf className="w-3 h-3 text-[#008A4B]" /> {item.kondisi_tanaman}</p>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5">{item.keterangan || '-'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button className="text-slate-400 hover:text-slate-600"><HiEllipsisVertical className="w-4 h-4" /></button>
                  <div className="text-center mt-1">
                    <p className="text-[9px] text-slate-500">Jumlah</p>
                    <p className="text-xs font-bold text-[#008A4B]">{item.jumlah}</p>
                  </div>
                </div>
              </div>
            ))}
            {tanamanList.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">Belum ada data tanaman</div>
            )}
          </div>

          <button className="w-full py-2.5 border border-[#008A4B] text-[#008A4B] rounded-lg text-xs font-bold flex justify-center items-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm">
            <HiOutlineBars3 className="w-4 h-4" /> Lihat Semua Tanaman
          </button>
        </div>

      </div>
    </div>
  );

  // ==========================================================================
  // STEP 4: DOKUMENTASI KEGIATAN
  // ==========================================================================
  const renderStep4 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
      {/* Kolom Kiri: Info */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 mb-4">Informasi Kegiatan</h3>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full mb-5">{penugasanData?.idPenugasan || '-'}</span>

          <div className="space-y-3 text-xs">
            <div className="flex gap-3"><span className="w-1/3 text-slate-500">Program</span><span className="w-2/3 text-slate-900 font-medium">{penugasanData?.programName || '-'}</span></div>
            <div className="flex gap-3"><span className="w-1/3 text-slate-500">Kegiatan</span><span className="w-2/3 text-slate-900 font-medium">{penugasanData?.jenisKegiatan || '-'}</span></div>
            <div className="flex gap-3"><span className="w-1/3 text-slate-500">Lokasi</span><span className="w-2/3 text-slate-900 font-medium leading-relaxed">{penugasanData?.location || '-'}</span></div>
            <div className="flex gap-3"><span className="w-1/3 text-slate-500">KTH</span><span className="w-2/3 text-slate-900 font-medium">{penugasanData?.kth || '-'}</span></div>
            <div className="flex gap-3"><span className="w-1/3 text-slate-500">Periode</span><span className="w-2/3 text-slate-900 font-medium">{penugasanData?.periodeMulai || '-'} s.d {penugasanData?.periodeSelesai || '-'}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 mb-4 text-sm">Ringkasan Input</h3>
          <div className="space-y-3 text-xs mb-5">
            <div className="flex justify-between"><span className="text-slate-500">Jumlah PU</span><span className="font-bold text-slate-900">{puList.length} PU</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target Tanaman</span><span className="font-bold text-slate-900">{penugasanData?.targetBibit || '0'} tanaman</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Dokumentasi</span><span className="font-bold text-slate-900">{dokumentasiList.length} foto</span></div>
          </div>

          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-500">Kelengkapan Data</span>
            <span className="text-sm font-bold text-slate-900">
              {Math.min(100, ((dokumentasiList.length / 5) * 100)).toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-[#008A4B] rounded-full" style={{ width: `${Math.min(100, (dokumentasiList.length / 5) * 100)}%` }}></div>
          </div>
          <button onClick={() => setCurrentStep(3)} className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-50 flex justify-center items-center gap-2 transition-colors shadow-sm">
            <HiOutlineBars3 className="w-4 h-4" /> Kembali ke Input Tanaman
          </button>
        </div>
      </div>

      {/* Kolom Tengah: Form Tambah Dokumentasi */}
      <div className="lg:col-span-5 space-y-6">


        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-6 text-base">Tambah Dokumentasi Kegiatan</h3>

          <form className="space-y-6" onSubmit={handleUploadDokumentasi}>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-3">1. Jenis Dokumentasi <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {['Foto Sebelum', 'Proses Penanaman', 'Kondisi Lokasi', 'Partisipasi Masyarakat', 'Lainnya'].map(jenis => (
                  <button
                    key={jenis}
                    type="button"
                    onClick={() => setFormDokumentasi({ ...formDokumentasi, jenis_dokumentasi: jenis })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors ${formDokumentasi.jenis_dokumentasi === jenis
                      ? 'bg-emerald-50 text-[#008A4B] border border-[#008A4B]'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                      }`}>
                    <HiOutlineCamera className="w-4 h-4" /> {jenis}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-3">2. Foto Dokumentasi <span className="text-red-500">*</span></label>

              {formDokumentasi.file ? (
                <div className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 mb-4">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-slate-200">
                    <img
                      src={dokumentasiPreview || undefined}
                      className="w-full h-full object-cover"
                      alt="Preview dokumentasi"
                    />
                    <button
                      type="button"
                      onClick={() => setFormDokumentasi({ ...formDokumentasi, file: null })}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-600 rounded-full p-1.5 shadow-sm"
                    >
                      <HiOutlineArrowPath className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-700 truncate">{formDokumentasi.file.name}</p>
                  <p className="text-[10px] text-slate-500">{(formDokumentasi.file.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormDokumentasi({ ...formDokumentasi, file: e.target.files[0] });
                        }
                      }}
                    />
                    <HiOutlineCamera className="w-7 h-7 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 text-center px-2">Ambil Foto (Kamera)</span>
                  </label>

                  <label className="h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormDokumentasi({ ...formDokumentasi, file: e.target.files[0] });
                        }
                      }}
                    />
                    <HiOutlinePhoto className="w-7 h-7 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 text-center px-2">Pilih dari Galeri</span>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">3. Keterangan Foto <span className="text-red-500">*</span></label>
              <textarea rows={3}
                value={formDokumentasi.keterangan}
                onChange={(e) => setFormDokumentasi({ ...formDokumentasi, keterangan: e.target.value })}
                placeholder="Jelaskan kegiatan pada foto ini..." className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-[#008A4B] focus:border-[#008A4B] resize-none shadow-sm"></textarea>
            </div>

            <div className="flex gap-3 justify-between pt-2">
              <button type="button" className="px-6 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shadow-sm bg-white">
                Batal
              </button>
              <button type="submit" className="px-6 py-2.5 bg-[#008A4B] text-white font-bold text-xs hover:bg-emerald-800 rounded-lg transition-colors shadow-sm">
                Simpan Dokumentasi
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Kolom Kanan: Daftar Dokumentasi */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-slate-900 text-sm">Dokumentasi Kegiatan ({dokumentasiList.length})</h3>
            <button className="px-2.5 py-1.5 border border-slate-300 rounded-md text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50 shadow-sm text-slate-700">
              <HiOutlineAdjustmentsHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {dokumentasiList.map((item: any, i) => (
              <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                <div className="h-20 w-full relative">
                  <img src={`${STORAGE_URL}/${item.file_path}`} className="w-full h-full object-cover" alt={item.jenis_dokumentasi} />
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/90 rounded text-[#008A4B] font-bold text-[9px] flex items-center justify-center shadow-sm">{i + 1}</div>
                </div>
                <div className="p-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold text-slate-800 leading-tight">{item.jenis_dokumentasi}</p>
                    <button className="text-slate-400 hover:text-slate-600"><HiEllipsisVertical className="w-3 h-3" /></button>
                  </div>
                  <p className="text-[8px] text-slate-500 mt-auto">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
            {dokumentasiList.length === 0 && (
              <div className="col-span-2 text-center py-6 text-slate-400 text-xs">Belum ada dokumentasi</div>
            )}
          </div>

          <button className="w-full py-2.5 border border-[#008A4B] text-[#008A4B] rounded-lg text-xs font-bold flex justify-center items-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm">
            <HiOutlinePhoto className="w-4 h-4" /> Lihat Semua Dokumentasi
          </button>
        </div>

      </div>
    </div>
  );

  // ==========================================================================
  // STEP 5: REVIEW & KIRIM
  // ==========================================================================
  const renderStep5 = () => {
    const totalRealisasi = puList.reduce((acc, pu) => acc + (pu.dataTanamans?.length || 0), 0);
    const targetBibit = parseInt(penugasanData?.targetBibit || '0');
    const targetPerPu = Math.max(1, Math.floor(targetBibit / Math.max(1, puList.length)));
    const totalPuPages = Math.max(1, Math.ceil(puList.length / PU_TABLE_PAGE_SIZE));
    const safePuPage = Math.min(puTablePage, totalPuPages);
    const paginatedPuList = puList.slice((safePuPage - 1) * PU_TABLE_PAGE_SIZE, safePuPage * PU_TABLE_PAGE_SIZE);

    return (
      <div className="flex flex-col gap-6 w-full max-w-300 mx-auto pb-24">
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Informasi Kegiatan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Informasi Kegiatan</h3>
            <div className="space-y-3 text-xs">
              <div className="flex"><span className="w-2/5 text-slate-500 flex items-center gap-1.5"><HiOutlineDocumentText className="w-3.5 h-3.5" /> ID Penugasan</span><span className="w-3/5 text-emerald-600 font-bold">{penugasanData?.idPenugasan || '-'}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500 flex items-center gap-1.5"><PiPlant className="w-3.5 h-3.5" /> Program</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData?.programName || '-'}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500 flex items-center gap-1.5"><PiTree className="w-3.5 h-3.5" /> Kegiatan</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData?.jenisKegiatan || '-'}</span></div>
              <div className="flex items-start"><span className="w-2/5 text-slate-500 flex items-center gap-1.5 mt-0.5"><HiOutlineMapPin className="w-3.5 h-3.5" /> Lokasi</span><span className="w-3/5 text-slate-900 font-medium leading-relaxed">{penugasanData?.location || '-'}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500 flex items-center gap-1.5"><HiOutlineUserGroup className="w-3.5 h-3.5" /> KTH</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData?.kth || '-'}</span></div>
              <div className="flex"><span className="w-2/5 text-slate-500 flex items-center gap-1.5"><HiOutlineCalendar className="w-3.5 h-3.5" /> Periode</span><span className="w-3/5 text-slate-900 font-medium">{penugasanData?.periodeMulai || '-'} - {penugasanData?.periodeSelesai || '-'}</span></div>
            </div>
          </div>

          {/* Status Kelengkapan Data */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Status Kelengkapan Data</h3>
            <div className="space-y-4 text-xs mb-5">
              <div className="flex items-start gap-3">
                <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1"><p className="font-bold text-slate-800">Poligon PU</p><p className="text-[9px] text-slate-500 mt-0.5">Semua PU telah dibuat</p></div>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">{puList.filter(p => p.status === 'Selesai').length} / {penugasanData?.totalPu || '0'} PU</span>
              </div>
              <div className="flex items-start gap-3">
                <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1"><p className="font-bold text-slate-800">Data Tanaman</p><p className="text-[9px] text-slate-500 mt-0.5">Data tanaman telah diinput</p></div>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">{totalRealisasi} / {penugasanData?.targetBibit || '0'}</span>
              </div>
              <div className="flex items-start gap-3">
                <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1"><p className="font-bold text-slate-800">Dokumentasi Kegiatan</p><p className="text-[9px] text-slate-500 mt-0.5">Dokumentasi kegiatan tersedia</p></div>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">{dokumentasiList.length} Foto</span>
              </div>
            </div>
          </div>

          {/* Rekap Realisasi & Jenis */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Rekap Realisasi Penanaman</h3>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-medium mb-1">Target Bibit</p>
                  <h3 className="text-2xl font-black text-slate-900">{penugasanData?.targetBibit || '0'}</h3>
                  <p className="text-[10px] text-slate-400">tanaman</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium mb-1">Realisasi</p>
                  <h3 className="text-2xl font-black text-slate-900">{totalRealisasi}</h3>
                  <p className="text-[10px] text-slate-400">tanaman</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium mb-1">Selisih</p>
                  <h3 className={`text-2xl font-black ${totalRealisasi - targetBibit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {totalRealisasi - targetBibit > 0 ? `+${totalRealisasi - targetBibit}` : totalRealisasi - targetBibit}
                  </h3>
                  <p className="text-[10px] text-slate-400">tanaman</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Rekap Berdasarkan Jenis Tanaman</h3>
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-100">
                  <tr><th className="py-2 font-medium">Jenis Tanaman</th><th className="py-2 font-medium text-right">Jumlah (tanaman)</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {(() => {
                    const speciesCount: Record<string, number> = {};
                    puList.forEach(pu => {
                      (pu.dataTanamans || []).forEach((t: any) => {
                        const name = t.nama_tanaman || t.seed?.name || t.seed?.nama || 'Tanaman';
                        speciesCount[name] = (speciesCount[name] || 0) + (t.jumlah || 1);
                      });
                    });
                    const speciesEntries = Object.entries(speciesCount);
                    if (speciesEntries.length === 0) {
                      return <tr><td colSpan={2} className="py-4 text-center text-slate-400 font-normal">Belum ada data tanaman</td></tr>;
                    }
                    return (
                      <>
                        {speciesEntries.map(([name, count], idx) => (
                          <tr key={idx}><td className="py-2.5">{name}</td><td className="py-2.5 text-right">{count}</td></tr>
                        ))}
                        <tr className="bg-emerald-50/50"><td className="py-2.5 text-emerald-700 font-bold px-2">Total</td><td className="py-2.5 text-right text-emerald-700 font-bold px-2">{totalRealisasi}</td></tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tabel Daftar PU */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="text-sm font-bold text-slate-900">Daftar PU dan Rekap Realisasi</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-center text-[11px]">
              <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-3 text-left">No.</th>
                  <th className="py-3 px-3 text-left">Kode PU</th>
                  <th className="py-3 px-3">Luas (Ha)</th>
                  <th className="py-3 px-3">Target (tanaman)</th>
                  <th className="py-3 px-3">Realisasi (tanaman)</th>
                  <th className="py-3 px-3">Selisih</th>
                  <th className="py-3 px-3">Status Kelengkapan</th>
                  <th className="py-3 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedPuList.map((pu, _idx) => {
                  const realisasi = pu.dataTanamans?.length || 0;
                  const selisih = realisasi - targetPerPu;
                  const isPoligon = pu.status === 'Selesai';
                  const isTanaman = realisasi > 0;
                  return (
                    <tr key={pu.num} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-left">{pu.num}</td>
                      <td className="py-3 px-3 text-left font-bold text-slate-900">PU-{pu.num.toString().padStart(2, '0')}</td>
                      <td className="py-3 px-3">{pu.luas}</td>
                      <td className="py-3 px-3">{targetPerPu}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{realisasi}</td>
                      <td className={`py-3 px-3 font-bold ${selisih >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{selisih > 0 ? `+${selisih}` : selisih}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`flex items-center gap-1 text-[9px] font-bold ${isPoligon ? 'text-emerald-700' : 'text-slate-400'}`}><HiCheckCircle className={`w-3.5 h-3.5 ${isPoligon ? 'text-emerald-500' : 'text-slate-300'}`} /> Poligon</span>
                          <span className={`flex items-center gap-1 text-[9px] font-bold ${isTanaman ? 'text-emerald-700' : 'text-slate-400'}`}><HiCheckCircle className={`w-3.5 h-3.5 ${isTanaman ? 'text-emerald-500' : 'text-slate-300'}`} /> Tanaman</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors mx-auto block"><HiOutlineEye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 pb-2">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setPuTablePage(p => Math.max(1, p - 1))}
                  disabled={safePuPage <= 1}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPuPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPuTablePage(pageNum)}
                    className={`px-2.5 py-1 rounded-md font-bold ${pageNum === safePuPage
                      ? 'bg-[#008A4B] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPuTablePage(p => Math.min(totalPuPages, p + 1))}
                  disabled={safePuPage >= totalPuPages}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <HiChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] p-5 mb-2">
          <label className="flex items-start gap-4 cursor-pointer">
            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${isAgreed ? 'bg-[#008A4B] border-[#008A4B]' : 'bg-white border-emerald-300'}`}>
              {isAgreed && <HiCheck className="w-4 h-4 text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
            <p className="text-sm text-[#166534] font-medium leading-relaxed">
              Saya memastikan data pelaksanaan telah sesuai dengan kondisi lapangan dan siap dikirim untuk dilakukan pemeriksaan oleh Staff PDAS.
            </p>
          </label>
        </div>

      </div>
    );
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-24">
      <div className="max-w-350 mx-auto">

        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
            <PiPlant className="w-5 h-5 text-[#008A4B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-0.5">
              {currentStep === 2 && 'Pembentukan Area Penanaman (PU)'}
              {currentStep === 3 && 'Input Data Tanaman'}
              {currentStep === 4 && 'Dokumentasi Kegiatan'}
              {currentStep === 5 && 'Review & Kirim Hasil Pelaksanaan'}
            </h1>
            <p className="text-xs text-slate-500">
              {currentStep === 2 && 'Bagi lokasi kegiatan menjadi beberapa Petak Ukur (PU) sesuai jumlah yang telah ditentukan.'}
              {currentStep === 3 && 'Input data setiap tanaman yang telah ditanam pada PU terpilih.'}
              {currentStep === 4 && 'Upload dokumentasi kegiatan penanaman sebagai bukti pelaksanaan di lapangan.'}
              {currentStep === 5 && 'Periksa kembali kelengkapan data sebelum mengirim hasil pelaksanaan kegiatan kepada Staff PDAS.'}
            </p>
          </div>
        </div>

        {renderStepper()}

        {/* Render Form Berdasarkan Step */}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

      </div>

      {/* BOTTOM ACTION BAR (Sticky) */}
      <div className="flex justify-between items-center z-40">
        <button onClick={prevStep} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 rounded-full flex items-center gap-2 shadow-sm transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" /> {currentStep === 5 ? 'Kembali Periksa' : 'Kembali'}
        </button>

        <div className="flex items-center gap-3">

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2.5 bg-[#008A4B] text-white font-bold text-sm hover:bg-emerald-800 rounded-full flex items-center gap-2 shadow-sm transition-colors"
            >
              {currentStep === 2 && 'Lanjutkan ke Input Tanaman'}
              {currentStep === 3 && 'Lanjut ke Dokumentasi Kegiatan'}
              {currentStep === 4 && 'Lanjut ke Review & Kirim'}
              <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmitPenugasan}
              disabled={!isAgreed}
              className={`px-8 py-2.5 font-bold text-sm rounded-full flex items-center gap-2 shadow-sm transition-colors ${isAgreed ? 'bg-[#008A4B] text-white hover:bg-emerald-800' : 'bg-emerald-200 text-emerald-50 cursor-not-allowed'}`}
            >
              Kirim Hasil Pelaksanaan <HiOutlineArrowRight className="w-4 h-4 stroke-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PelaksanaanWizard;