import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlinePlusCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createProgramApbdAPI } from '@/services/program-apbd.service';
import { rehabilitasiService } from '@/services/rehabilitasi.service';


const CreateProgramAPBD: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [lokasiWilayah, setLokasiWilayah] = useState('');
  
  const [form, setForm] = useState({
    rekomendasi: '',
    luasLahan: '',
    kth_id: '',
    namaKth: '',
    ketuaKth: '',
    namaProgram: '',
    jumlah_bibit: '',
    anggaran: '',
    deskripsi: ''
  });

  const MAX_DESC_LENGTH = 100;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await rehabilitasiService.getValidZones();
        const validZones = (res.data || []).filter((z: any) => z.status_kelayakan === 'Layak');
        setProjects(validZones);
      } catch (error) {
        toast.error('Gagal memuat daftar project lahan kritis.');
      } finally {
        setIsFetchingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);

    const foundZone = projects.find(p => String(p.id) === String(selectedId));
    
    if (foundZone) {
      const validation = foundZone.field_validations?.length > 0 ? foundZone.field_validations[0] : null;
      const lokasi = validation?.nama_lokasi || foundZone.result?.project?.project_code || 'Lokasi tidak diketahui';
      
      setLokasiWilayah(lokasi);
      
      setForm(prev => ({
        ...prev,
        rekomendasi: foundZone.rekomendasi_intervensi || 'Belum ada rekomendasi',
        luasLahan: foundZone.luas_ha || 0, 
        namaKth: foundZone.nama_kelompok || 'Belum ada data KTH',
        ketuaKth: foundZone.ketua_kelompok || '-',
        kth_id: foundZone.kth_id || '1', 
        namaProgram: foundZone.result?.project?.nama_project ? `Rehabilitasi Lahan Kritis - ${foundZone.result?.project?.nama_project}` : `Program APBD - ${lokasi}`,
        jumlah_bibit: '',
      }));
    } else {
      setLokasiWilayah('');
      setForm(prev => ({
        ...prev,
        rekomendasi: '', luasLahan: '', namaKth: '', ketuaKth: '', kth_id: '', namaProgram: '', jumlah_bibit: ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return toast.error('Pilih lokasi prioritas terlebih dahulu.');

    setIsLoading(true);
    const loadingToast = toast.loading('Memproses Rancangan Program...');

    const payload = {
      kth_id: form.kth_id,
      nama_program: form.namaProgram,
      jumlah_bibit: form.jumlah_bibit, // Fix: use jumlah_bibit
      deskripsi_rencana: form.deskripsi,
      anggaran: form.anggaran,
      target_luas_lahan: form.luasLahan,
      pilihan_intervensi: form.rekomendasi,
      analysis_result_zone_id: selectedProjectId // Keep track of the selected zone
    };

    try {
      await createProgramApbdAPI(payload);
      toast.success('Draft Program APBD berhasil dikirim ke Kepala PDAS!', { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-gray-600 self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" />
        Kembali ke Daftar Program
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mt-2">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
             <HiOutlinePlusCircle className="w-6 h-6 text-[#185325]" strokeWidth={2} />
             <h1 className="text-xl font-bold text-gray-800">Rancang Program APBD Baru</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Rancang program rehabilitasi APBD berdasarkan lahan prioritas di Jawa Barat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Lokasi Lahan Prioritas <span className="text-red-500">*</span>
            </label>
            <select 
              required
              value={selectedProjectId}
              onChange={handleProjectChange}
              disabled={isFetchingProjects}
              className="w-full bg-white border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] transition-all cursor-pointer shadow-sm appearance-none disabled:bg-gray-50"
            >
              <option value="">-- Pilih Lokasi Prioritas --</option>
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
            {lokasiWilayah && <p className="text-[11px] text-gray-500 mt-2 ml-2">Area Terpilih: {lokasiWilayah}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Rekomendasi Intervensi (Analisis CPI)
              </label>
              <input 
                type="text" 
                readOnly
                value={form.rekomendasi}
                className="w-full bg-gray-50 border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-600 outline-none cursor-not-allowed"
                placeholder="Akan otomatis terisi..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Luas Lahan (Analisis CPI)
              </label>
              <input 
                type="text" 
                readOnly
                value={form.luasLahan ? `${form.luasLahan} Ha` : ''}
                className="w-full bg-gray-50 border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-600 outline-none cursor-not-allowed"
                placeholder="Akan otomatis terisi..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Nama KTH (Analisis CPI)
              </label>
              <input 
                type="text" 
                readOnly
                value={form.namaKth}
                className="w-full bg-gray-50 border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-600 outline-none cursor-not-allowed"
                placeholder="Akan otomatis terisi..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Nama Ketua KTH (Analisis CPI)
              </label>
              <input 
                type="text" 
                readOnly
                value={form.ketuaKth}
                className="w-full bg-gray-50 border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-600 outline-none cursor-not-allowed"
                placeholder="Akan otomatis terisi..."
              />
            </div>
          </div>

          {/* GRID UNTUK NAMA PROGRAM DAN TARGET BIBIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Nama Program <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="namaProgram"
                required
                value={form.namaProgram}
                onChange={handleInputChange}
                placeholder="Contoh: Rehabilitasi Lahan Kritis Citarum"
                className="w-full bg-white border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Target Bibit (Pohon) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="jumlah_bibit"
                required
                value={form.jumlah_bibit}
                onChange={handleInputChange}
                placeholder="Contoh: 5000"
                className="w-full bg-white border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] transition-all shadow-sm appearance-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Anggaran (Rp) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="anggaran"
                required
                value={form.anggaran}
                onChange={handleInputChange}
                placeholder="Contoh: 50000000"
                className="w-full bg-white border border-gray-400 rounded-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] transition-all shadow-sm appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Deskripsi Rencana Kegiatan
            </label>
            <div className="relative">
              <textarea 
                name="deskripsi"
                rows={4}
                maxLength={MAX_DESC_LENGTH}
                value={form.deskripsi}
                onChange={handleInputChange}
                placeholder="Masukkan rincian arahan kerja, jenis tanaman / pohon pelindung yang wajib ditanam, serta jangka waktu persiapan persemaian bibit unggul"
                className="w-full bg-white border border-gray-400 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] transition-all resize-none shadow-sm"
              ></textarea>
              <div className="absolute -bottom-6 right-2 text-[10px] font-bold text-gray-500">
                {form.deskripsi.length}/{MAX_DESC_LENGTH}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-bold rounded-full transition-colors active:scale-95 shadow-sm cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors active:scale-95 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              Kirim ke Kepala PDAS
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProgramAPBD;