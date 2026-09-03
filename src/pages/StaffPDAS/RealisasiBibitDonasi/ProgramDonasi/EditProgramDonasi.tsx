import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import ProgramImagePicker from './components/ProgramImagePicker';
import SelectedBibitList from './components/SelectedBibitList';
import { getBibitsAPI, getSeedSpecificationsAPI } from '@/services/bibit.service';
import { getDonationProgramByIdAPI, updateDonationProgramAPI } from '@/services/program-donasi.service'; 

const API_URL = "http://127.0.0.1:8000/api";

interface MergedBibitSpec {
  spec_id: number;
  seed_id: number; 
  bibit_nama: string;
  min_height: number;
  max_height: number;
  price: number;
}

const formatRupiah = (angka: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const EditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [form, setForm] = useState({
    namaProgram: '', 
    lokasiLahan: '', 
    kthPelaksana: 'Otomatis terisi', 
    tanggalMulai: '', 
    tanggalSelesai: '', 
    deskripsi: ''
  });
  
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [daftarBibit, setDaftarBibit] = useState<MergedBibitSpec[]>([]);
  const [bibitOptions, setBibitOptions] = useState<MergedBibitSpec[]>([]);
  const [selectedSpecId, setSelectedSpecId] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);  
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasterAndDetail = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [bibitRes, specRes, projRes, detailRes] = await Promise.all([ 
          getBibitsAPI(), 
          getSeedSpecificationsAPI(),
          fetch(`${API_URL}/projects?status=completed`, { headers }),
          getDonationProgramByIdAPI(id)
        ]);

        const bibitsData = bibitRes.payload || [];
        const specs = specRes.payload || [];
        
        const projJson = await projRes.json();
        const projList = projJson.payload || projJson.data || [];
        setProjects(projList);

        const mergedData = specs.reduce((acc: MergedBibitSpec[], spec: any) => {
          const bibit = bibitsData.find((b: any) => Number(b.id) === Number(spec.seed_id));
          if (bibit) {
            acc.push({
              spec_id: spec.id, seed_id: bibit.id, bibit_nama: bibit.nama,
              min_height: spec.min_height, max_height: spec.max_height, price: Number(spec.price)
            });
          }
          return acc;
        }, []);
        setBibitOptions(mergedData);

        const existingData = detailRes.payload || detailRes.data;
        if (existingData) {
          setForm({
            namaProgram: existingData.name || '',
            lokasiLahan: existingData.location || '',
            kthPelaksana: existingData.kth_id ? `KTH ID: ${existingData.kth_id}` : 'Tanpa KTH',
            deskripsi: existingData.description || '',
            tanggalMulai: existingData.start_date || '', 
            tanggalSelesai: existingData.end_date || ''
          });
          
          setSelectedProjectId(existingData.analysis_result_id || '');

          if (existingData.jenis_bibit) {
             const existingBibits = existingData.jenis_bibit.map((eb: any) => {
                 return mergedData.find((m: MergedBibitSpec) => m.seed_id === eb.id) || {
                     spec_id: Date.now() + Math.random(), 
                     seed_id: eb.id,
                     bibit_nama: eb.nama,
                     price: 0
                 };
             });
             setDaftarBibit(existingBibits);
          }
        }

      } catch (error) {
        toast.error('Gagal memuat data program.');
        navigate(-1);
      } finally {
        setIsFetchingData(false);
      }
    };
    
    fetchMasterAndDetail();
  }, [id, navigate]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);

    const foundProject = projects.find(p => String(p.id) === String(selectedId));
    if (foundProject && foundProject.hasil && foundProject.hasil.pratinjau_tabel) {
      const firstZone = foundProject.hasil.pratinjau_tabel[0];
      const namaKth = firstZone?.nama_kelompok || 'Belum ada data KTH terpetakan';
      const formatLokasiWilayah = firstZone?.desa ? `${firstZone.desa}, ${firstZone.kabupaten}` : foundProject.nama_project;
      
      setForm(prev => ({ 
        ...prev, 
        lokasiLahan: formatLokasiWilayah, 
        kthPelaksana: namaKth 
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTambahBibit = () => {
    if (!selectedSpecId) return toast.error('Pilih spesifikasi bibit dari dropdown terlebih dahulu.');
    
    const bibitTarget = bibitOptions.find(b => b.spec_id.toString() === selectedSpecId);
    if (!bibitTarget) return;

    if (daftarBibit.some(b => b.spec_id === bibitTarget.spec_id)) {
      return toast.error('Bibit dengan spesifikasi tersebut sudah ada di daftar.');
    }

    setDaftarBibit(prev => [...prev, bibitTarget]);
    setSelectedSpecId(''); 
    toast.success(`${bibitTarget.bibit_nama} ditambahkan ke daftar!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (daftarBibit.length === 0) return toast.error('Silakan pilih minimal satu jenis bibit.');

    setIsLoading(true);
    const loadingToast = toast.loading('Menyimpan perubahan program...');

    try {
      const formData = new FormData();
      formData.append('name', form.namaProgram);
      formData.append('location', form.lokasiLahan); 
      formData.append('description', form.deskripsi);
      formData.append('kth_id', '1'); 
      formData.append('start_date', form.tanggalMulai); 
      formData.append('end_date', form.tanggalSelesai);
      
      if (selectedProjectId) formData.append('analysis_result_id', selectedProjectId);
      if (imageFile) formData.append('image', imageFile);

      daftarBibit.forEach(bibit => formData.append('jenis_bibit[]', bibit.seed_id.toString()));

      await updateDonationProgramAPI(id, formData); 
      toast.success('Program berhasil diperbarui!', { id: loadingToast });
      navigate(-1); 
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
      return <div className="p-12 text-center text-gray-500 font-bold">Memuat Form Edit...</div>
  }

  return (
    <div className="w-full mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 text-[#009262] hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-full">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Program Donasi</h1>
          <p className="text-sm text-slate-500 mt-1">Perbarui informasi program yang sudah ada.</p>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-8">
            <ProgramImagePicker onImageSelected={(file) => setImageFile(file)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">Nama Program <span className="text-red-500">*</span></label>
                <input type="text" name="namaProgram" required value={form.namaProgram} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-full px-4 py-3.5 text-slate-800 focus:ring-[#009262] transition-all shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Pilih Lahan Kritis (Project Analisis)</label>
                <select 
                  name="lokasiLahanSelect" 
                  value={selectedProjectId} 
                  onChange={handleProjectChange} 
                  className="w-full bg-white border border-slate-200 rounded-full px-4 py-3.5 text-slate-800 focus:ring-[#009262] transition-all cursor-pointer shadow-sm"
                >
                  <option value="">-- Pertahankan Lokasi Saat Ini --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.nama_project || proj.kode_project}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">KTH Terkait (Otomatis)</label>
                <input type="text" disabled value={form.kthPelaksana} className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-3.5 text-slate-500 cursor-not-allowed shadow-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">Deskripsi Program <span className="text-red-500">*</span></label>
                <textarea name="deskripsi" required value={form.deskripsi} onChange={handleInputChange} rows={4} className="w-full bg-white border border-slate-200 rounded-4xl px-4 py-3.5 text-slate-800 focus:ring-[#009262] transition-all shadow-sm resize-y" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="mb-4">
                <label className="block text-base font-bold text-slate-800">1. Ubah Jenis Bibit</label>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <select value={selectedSpecId} onChange={(e) => setSelectedSpecId(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-3 text-sm text-slate-800 focus:ring-[#009262] transition-all shadow-sm cursor-pointer">
                  <option value="">-- Tambah Spesifikasi Bibit Baru --</option>
                  {bibitOptions.map(spec => (
                    <option key={spec.spec_id} value={spec.spec_id}>
                      {spec.bibit_nama} (Tinggi: {spec.min_height}-{spec.max_height}cm) - {formatRupiah(spec.price)}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleTambahBibit} disabled={!selectedSpecId} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50">
                  <HiOutlinePlus className="w-5 h-5" /> Tambah Bibit
                </button>
              </div>
            </div>

            <SelectedBibitList 
              bibits={daftarBibit} 
              onRemove={(spec_id) => setDaftarBibit(prev => prev.filter(b => b.spec_id !== spec_id))} 
            />

          </div>

          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4">
            <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors shadow-sm">
              Batalkan
            </button>
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#185325] hover:bg-[#123d1c] text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditProgram;