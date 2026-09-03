import React, { useState, useEffect } from 'react';
import { HiXMark, HiOutlineInformationCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import type { Option } from './AnimatedSelect';
import AnimatedSelect from './AnimatedSelect';
import { getAllUsers } from '@/services/authService';
import { getLatestProjectAPI } from '@/services/gisService';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalBuatPenugasan: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [penyuluh, setPenyuluh] = useState('');
  const [kategori, setKategori] = useState('');
  const [wilayah, setWilayah] = useState(''); 
  const [lokasi, setLokasi] = useState('');   
  const [lokasiAtauProgram, setLokasiAtauProgram] = useState(''); 
  const [tanggal, setTanggal] = useState('');
  const [periode, setPeriode] = useState(''); 
  const [catatan, setCatatan] = useState('');
  const [, setPenyuluhOptions] = useState<Option[]>([]);
  const [wilayahOptions, setWilayahOptions] = useState<Option[]>([]);
  const [lokasiOptions, setLokasiOptions] = useState<Option[]>([]);
  const [targetOptions, setTargetOptions] = useState<Option[]>([]);
  const [rawCpiData, setRawCpiData] = useState<any[]>([]);

  const kategoriOptions: Option[] = [
    { value: 'validasi', label: 'Validasi Lokasi (Analisis CPI)' },
    { value: 'pelaksanaan', label: 'Pelaksanaan Penanaman (P0)' },
  ];

  // 1. Reset Modal
  useEffect(() => {
    if (!isOpen) {
      setPenyuluh(''); setKategori(''); setWilayah(''); setLokasi(''); 
      setLokasiAtauProgram(''); setTanggal(''); setPeriode(''); setCatatan('');
      setWilayahOptions([]); setLokasiOptions([]); setTargetOptions([]);
    }
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // 2. Fetch Penyuluh
  useEffect(() => {
    if (isOpen) {
      getAllUsers().then(users => {
        const dataPenyuluh = users.filter((u: any) => 
          u.peran && u.peran.some((p: any) => p.nama.toLowerCase().includes('penyuluh'))
        );
        setPenyuluhOptions(dataPenyuluh.map((p: any) => ({
          value: p.id.toString(),
          label: p.nama_pengguna,
          badgeText: 'Penyuluh',
          badgeColor: 'bg-emerald-100 text-emerald-700'
        })));
      }).catch(() => toast.error("Gagal memuat data penyuluh"));
    }
  }, [isOpen]);

  // 3. Fetch Data Awal Berdasarkan Kategori
  useEffect(() => {
    if (!kategori) {
      setWilayah(''); setLokasi(''); setLokasiAtauProgram('');
      return;
    }

    const fetchTargetData = async () => {
      try {
        if (kategori === 'validasi') {
          const res = await getLatestProjectAPI();
          const projectData = res.payload?.[0] || res.data?.[0];
          
          if (projectData && projectData.hasil?.pratinjau_tabel) {
            const tableRows = projectData.hasil.pratinjau_tabel;
            setRawCpiData(tableRows);

            const uniqueWilayah = Array.from(new Set(tableRows.map((d: any) => d.kota_kabupaten || d.kabupaten)));
            setWilayahOptions(uniqueWilayah.map((w: any) => ({ value: w, label: w })));
          }
        } else if (kategori === 'pelaksanaan') {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/program`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          });
          const json = await res.json();
          const list = json.data || json.payload || [];
          
          setTargetOptions(list.map((item: any) => ({
            value: item.id.toString(),
            label: `[Program] ${item.nama_program}`
          })));
        }
      } catch (error) {
        toast.error("Gagal memuat data referensi");
      }
    };
    fetchTargetData();
  }, [kategori]);

  // 4. Cascade Filter: Wilayah -> Kecamatan
  useEffect(() => {
    if (kategori === 'validasi' && wilayah) {
      const filtered = rawCpiData.filter(d => (d.kota_kabupaten || d.kabupaten) === wilayah);
      const uniqueKecamatan = Array.from(new Set(filtered.map(d => d.kecamatan)));
      
      setLokasiOptions(uniqueKecamatan.map((k: any) => ({ value: k, label: k })));
      setLokasi(''); setLokasiAtauProgram(''); setTargetOptions([]); 
    }
  }, [wilayah, kategori, rawCpiData]);

  // 5. Cascade Filter & SORTING KEKRITISAN: Kecamatan -> Target (Desa)
  useEffect(() => {
    if (kategori === 'validasi' && lokasi && wilayah) {
      let filtered = rawCpiData.filter(d => 
        d.kecamatan === lokasi && (d.kota_kabupaten || d.kabupaten) === wilayah
      );
      
      // LOGIKA SORTING KEKRITISAN
      const priority: Record<string, number> = {
        'Sangat Kritis': 1,
        'Kritis': 2,
        'Tidak Kritis': 3
      };

      filtered.sort((a, b) => {
        const valA = priority[a.status_lahan_kritis] || 99;
        const valB = priority[b.status_lahan_kritis] || 99;
        return valA - valB; // Ascending (1 paling atas)
      });
      
      // Mapping ke Options dengan tambahan label status
      setTargetOptions(filtered.map(d => ({ 
        value: d.zone_id.toString(), 
        label: `[Zona ${d.zone_id}] Desa ${d.desa_kelurahan || d.desa} (${d.status_lahan_kritis})` 
      })));
      
      setLokasiAtauProgram(''); 
    }
  }, [lokasi, kategori, wilayah, rawCpiData]);

  // 6. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penyuluh || !kategori || !lokasiAtauProgram || !tanggal || !periode) {
      return toast.error("Mohon lengkapi semua kolom wajib!");
    }

    setIsLoading(true);
    const loadingId = toast.loading("Menyimpan penugasan...");

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      
      let payload: any = {
        penyuluh_id: parseInt(penyuluh),
        tanggal_mulai: tanggal,
        batas_waktu: periode,
        arahan: catatan
      };

      if (kategori === 'pelaksanaan') {
        const sourceData = JSON.parse(lokasiAtauProgram);
        payload.source_id = sourceData.id;
        payload.source_type = sourceData.type;
        payload.jenis_kegiatan = 'Pelaksanaan Penanaman';
      } else {
        payload.source_id = parseInt(lokasiAtauProgram);
        payload.source_type = 'App\\Models\\AnalysisResultZone';
        payload.jenis_kegiatan = 'Validasi Lokasi';
      }

      const res = await fetch(`${API_URL}/penugasan/assign`, {
        method: 'POST', headers, body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan penugasan");

      toast.success('Penugasan berhasil dibuat!', { id: loadingId });
      onClose();
      window.location.reload(); // Refresh halaman agar tabel terupdate
    } catch (error: any) {
      toast.error(error.message, { id: loadingId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-800">Buat Penugasan Baru</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <HiXMark className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="form-penugasan" onSubmit={handleSubmit} className="space-y-6">

            <AnimatedSelect 
              label="Kategori Penugasan"
              placeholder="-- Pilih Kategori --"
              options={kategoriOptions}
              value={kategori}
              onChange={(val) => { setKategori(val); setWilayah(''); setLokasi(''); setLokasiAtauProgram(''); }}
              required
            />

            {kategori === 'validasi' && (
              <div className="bg-blue-50/50 p-4 rounded-xl space-y-5 border border-blue-100">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-2">
                  Detail Lokasi <span className="text-[10px] font-medium bg-white border border-blue-200 px-2 py-0.5 rounded text-blue-600 normal-case">(Dari Modul CPI)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AnimatedSelect label="Wilayah (Kabupaten/Kota)" placeholder="-- Pilih Wilayah --" options={wilayahOptions} value={wilayah} onChange={setWilayah} required />
                  <AnimatedSelect label="Lokasi (Kecamatan)" placeholder="-- Pilih Kecamatan --" options={lokasiOptions} value={lokasi} onChange={setLokasi} required disabled={!wilayah} />
                </div>
              </div>
            )}

            {kategori && (
              <AnimatedSelect 
                label={kategori === 'validasi' ? 'Target Lokasi / Desa (Zona)' : 'Target Program'}
                placeholder={kategori === 'validasi' ? (lokasi ? '-- Pilih Desa --' : '-- Pilih Kecamatan Dahulu --') : '-- Pilih Program --'}
                options={targetOptions}
                value={lokasiAtauProgram}
                onChange={setLokasiAtauProgram}
                required
                disabled={kategori === 'validasi' && !lokasi}
              />
            )}

            {kategori && (
              <div className="px-4 py-3 rounded-lg flex items-start gap-3 border bg-gray-50 border-gray-200 text-gray-700">
                <HiOutlineInformationCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <p className="text-xs font-medium leading-relaxed">
                  {kategori === 'validasi' 
                    ? 'Penyuluh akan mengecek kesesuaian koordinat dan lahan kritis hasil analisis CPI.' 
                    : 'Penyuluh akan memonitoring kegiatan penanaman bibit oleh KTH di lapangan.'}
                </p>
              </div>
            )}  
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl z-10">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100">
            Batal
          </button>
          <button type="submit" form="form-penugasan" disabled={isLoading} className="px-8 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-xl hover:bg-[#123d1c] disabled:opacity-70 flex items-center gap-2">
            {isLoading ? 'Menyimpan...' : 'Simpan Penugasan'}
          </button>
        </div>

      </div>
    </div>
  );
};
export default ModalBuatPenugasan;