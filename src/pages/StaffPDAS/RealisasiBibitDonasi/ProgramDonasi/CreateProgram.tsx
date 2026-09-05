import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import ProgramImagePicker from './components/ProgramImagePicker';
import SelectedBibitList from './components/SelectedBibitList';
import { getBibitsAPI, getSeedSpecificationsAPI } from '@/services/bibit.service';
import { createDonationProgramAPI } from '@/services/program-donasi.service'; 
import { rehabilitasiService } from '@/services/rehabilitasi.service';

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

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    namaProgram: '', 
    lokasiLahan: '', 
    kthPelaksana: '', 
    deskripsi: ''
  });
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [daftarBibit, setDaftarBibit] = useState<MergedBibitSpec[]>([]);
  const [bibitOptions, setBibitOptions] = useState<MergedBibitSpec[]>([]);
  const [selectedSpecId, setSelectedSpecId] = useState('');
  const [isFetchingBibit, setIsFetchingBibit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);  
  const [timeLimitOption, setTimeLimitOption] = useState<'dengan_batas' | 'tanpa_batas'>('dengan_batas');

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasterDataAndProjects = async () => {
      try {
        const [bibitRes, specRes, zonesRes] = await Promise.all([ 
          getBibitsAPI(), 
          getSeedSpecificationsAPI(),
          rehabilitasiService.getValidZones()
        ]);

        const bibitsData = bibitRes.payload || [];
        const specs = specRes.payload || [];
        
        // Filter zones with status_kelayakan 'Layak'
        const validZones = (zonesRes.data || []).filter((z: any) => z.status_kelayakan === 'Layak');
        setProjects(validZones);

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
      } catch (error) {
        toast.error('Gagal memuat data master atau daftar lahan kritis.');
      } finally {
        setIsFetchingBibit(false);
      }
    };
    fetchMasterDataAndProjects();
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);

    const foundZone = projects.find(p => String(p.id) === String(selectedId));
    
    if (foundZone) {
      const namaKth = foundZone.nama_kelompok || 'Belum ada data KTH terpetakan';
      const validation = foundZone.field_validations?.length > 0 ? foundZone.field_validations[0] : null;
      const lokasi = validation?.nama_lokasi || foundZone.result?.project?.project_code || 'Lokasi tidak diketahui';
      
      setForm(prev => ({ 
        ...prev, 
        lokasiLahan: lokasi, 
        namaProgram: `Program Rehabilitasi - ${lokasi}`,
        kthPelaksana: namaKth 
      }));
    } else {
      setForm(prev => ({ 
        ...prev, 
        lokasiLahan: '', 
        namaProgram: '',
        kthPelaksana: '' 
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
    if (daftarBibit.length === 0) return toast.error('Silakan pilih minimal satu jenis bibit.');
    
    if (!form.lokasiLahan) return toast.error('Silakan pilih project lahan kritis terlebih dahulu.');

    setIsLoading(true);
    const loadingToast = toast.loading('Mengajukan program donasi...');

    try {
      const formData = new FormData();
      formData.append('name', form.namaProgram);
      formData.append('location', form.lokasiLahan); 
      formData.append('description', form.deskripsi);
      formData.append('kth_id', '1'); 
      formData.append('analysis_result_id', selectedProjectId);
      formData.append('total_seeds_collected', '0');
      formData.append('total_seeds_realized', '0');
      if (imageFile) formData.append('image', imageFile);

      daftarBibit.forEach(bibit => formData.append('jenis_bibit[]', bibit.seed_id.toString()));

      await createDonationProgramAPI(formData as any); 
      toast.success('Program berhasil diajukan!', { id: loadingToast });
      navigate(-1); 
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 text-[#009262] hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-full">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Buat Program Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Isi formulir di bawah ini untuk mengajukan program penanaman baru.</p>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-8">
            <ProgramImagePicker onImageSelected={(file) => setImageFile(file)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">Nama Program <span className="text-red-500">*</span></label>
                <input type="text" name="namaProgram" required value={form.namaProgram} onChange={handleInputChange} placeholder="Contoh: Penanaman Hutan Lindung..." className="w-full bg-white border border-slate-200 rounded-full px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Pilih Lahan Kritis (Project Analisis) <span className="text-red-500">*</span></label>
                <select 
                  name="lokasiLahanSelect" 
                  required 
                  value={selectedProjectId} 
                  onChange={handleProjectChange} 
                  className="w-full bg-white border border-slate-200 rounded-full px-4 py-3.5 text-slate-800 focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all cursor-pointer shadow-sm"
                >
                  <option value="" disabled>-- Pilih Project Analisis --</option>
                  {projects.map((proj) => {
                    const validation = proj.field_validations?.length > 0 ? proj.field_validations[0] : null;
                    const lokasi = validation?.nama_lokasi || proj.result?.project?.project_code || 'Lokasi tidak diketahui';
                    return (
                      <option key={proj.id} value={proj.id}>
                        {lokasi}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">KTH Terkait (Otomatis)</label>
                <input type="text" disabled value={form.kthPelaksana} placeholder="Akan terisi otomatis berdasarkan wilayah..." className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-3.5 text-slate-500 cursor-not-allowed transition-all shadow-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">Deskripsi Program <span className="text-red-500">*</span></label>
                <textarea name="deskripsi" required value={form.deskripsi} onChange={handleInputChange} placeholder="Ceritakan tujuan dan latar belakang program donasi ini..." rows={4} className="w-full bg-white border border-slate-200 rounded-4xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all shadow-sm resize-y" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="mb-4">
                <label className="block text-base font-bold text-slate-800">1. Pilih Jenis Bibit <span className="text-red-500">*</span></label>
                <p className="text-sm text-slate-500 mt-1">Harga dan spesifikasi akan otomatis menyesuaikan dengan master data.</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <select value={selectedSpecId} onChange={(e) => setSelectedSpecId(e.target.value)} disabled={isFetchingBibit} className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#009262]/20 focus:border-[#009262] transition-all shadow-sm cursor-pointer disabled:bg-slate-50">
                  <option value="">{isFetchingBibit ? 'Memuat data spesifikasi bibit...' : '-- Pilih Bibit & Spesifikasinya --'}</option>
                  {bibitOptions.map(spec => (
                    <option key={spec.spec_id} value={spec.spec_id}>
                      {spec.bibit_nama} (Tinggi: {spec.min_height}-{spec.max_height}cm) - {formatRupiah(spec.price)}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleTambahBibit} disabled={isFetchingBibit || !selectedSpecId} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
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
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary hover:bg-[#007a52] text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {isLoading ? 'Mengajukan...' : 'Ajukan Program Sekarang'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateProgram;