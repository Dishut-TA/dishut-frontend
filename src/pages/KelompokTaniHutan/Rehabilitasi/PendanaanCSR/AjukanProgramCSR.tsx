import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePaperAirplane, HiOutlineCloudArrowUp, HiOutlineChevronLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createProgramCsrAPI } from '@/services/program-csr.service';
import { rehabilitasiService } from '@/services/rehabilitasi.service';

const AjukanProgramCSR: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    judul: '',
    luasLahan: '',
    jenisPohon: '',
    jumlahBibit: '',
    anggaran: '',
    deskripsi: '',
    kth_id: '1'
  });
  const [fileProposal, setFileProposal] = useState<File | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  React.useEffect(() => {
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
      
      setForm(prev => ({
        ...prev,
        judul: foundZone.result?.project?.nama_project ? `Program CSR - ${foundZone.result?.project?.nama_project}` : `Program CSR - ${lokasi}`,
        luasLahan: foundZone.luas_ha ? String(foundZone.luas_ha) : '',
        kth_id: foundZone.kth_id ? String(foundZone.kth_id) : '1'
      }));
    } else {
      setForm(prev => ({
        ...prev,
        judul: '',
        luasLahan: '',
        kth_id: '1'
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileProposal(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Mengirim proposal CSR...');

    try {
      const formData = new FormData();
      formData.append('kth_id', form.kth_id);
      formData.append('analysis_result_zone_id', selectedProjectId);
      formData.append('nama_program', form.judul);
      formData.append('target_luas_lahan', form.luasLahan);
      formData.append('jenis_tanaman', form.jenisPohon);
      formData.append('jumlah_bibit', form.jumlahBibit);
      formData.append('anggaran', form.anggaran);
      formData.append('deskripsi_rencana', form.deskripsi);
      
      if (fileProposal) {
        formData.append('file_proposal', fileProposal);
      }

      await createProgramCsrAPI(formData);
      
      toast.success('Pengajuan proposal berhasil dikirim!', { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 max-w-5xl animate-in fade-in duration-300 pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#185325] font-bold mb-4 hover:text-[#113d1b] transition-colors">
        <HiOutlineChevronLeft /> Kembali
      </button>

      <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold text-[#185325]">FORMULIR DIGITAL: PENGAJUAN CSR</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">Isi formulir digital di bawah ini dengan jujur & teliti agar mudah diverifikasi Dinas.</p>

        <hr className='border-gray-200 mb-8'/>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-sm font-bold text-[#185325]">Lokasi Lahan Prioritas (Hasil Rencana Rehabilitasi) <span className="text-red-500">*</span></span>
              <select 
                required
                value={selectedProjectId}
                onChange={handleProjectChange}
                disabled={isFetchingProjects}
                className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors disabled:bg-gray-50"
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
            </label>

            <label className="block">
                <span className="text-sm font-bold text-[#185325]">Judul Program <span className="text-red-500">*</span></span>
                <input required type="text" name="judul" value={form.judul} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: Reboisasi DAS Hulu Sungai" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
                <span className="text-sm font-bold text-[#185325]">Luas Lahan Terbuka yang Direhab (Hektar) <span className="text-red-500">*</span></span>
                <input required type="number" name="luasLahan" value={form.luasLahan} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 15" />
            </label>
            <label>
                <span className="text-sm font-bold text-[#185325]">Jenis Pohon / Tanaman Utama</span>
                <input type="text" name="jenisPohon" value={form.jenisPohon} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: Mahoni, Jati Mas, Sengon" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
                <span className="text-sm font-bold text-[#185325]">Target Jumlah Bibit <span className="text-red-500">*</span></span>
                <input required type="number" name="jumlahBibit" value={form.jumlahBibit} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 200" />
            </label>
            <label>
                <span className="text-sm font-bold text-[#185325]">Total Estimasi Anggaran (Rupiah) <span className="text-red-500">*</span></span>
                <input required type="number" name="anggaran" value={form.anggaran} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 850000000" />
            </label>
          </div>

          <label className="block cursor-pointer">
            <span className="text-sm font-bold text-[#185325]">Upload Proposal CSR (PDF)</span>
            <div className={`mt-2 w-full px-5 py-3 border rounded-full text-sm flex items-center justify-between transition-colors ${fileProposal ? 'border-[#185325] bg-[#E8F5E9] text-[#185325]' : 'border-gray-300 text-gray-400 hover:bg-gray-50'}`}>
                <span className="truncate pr-4">{fileProposal ? fileProposal.name : 'Upload file PDF proposal...'}</span>
                <HiOutlineCloudArrowUp className="w-5 h-5 shrink-0" />
            </div>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#185325]">Deskripsi Rencana Kerja & Teknis Pelaksanaan</span>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleInputChange} className="mt-2 w-full h-32 px-5 py-4 border border-gray-300 rounded-3xl text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors resize-none" placeholder="Tuliskan detail program, tujuan rehabilitasi, manfaat ekonomi kelompok, dan cara pelaksanaan harian..." />
          </label>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
            <p className="text-xs text-gray-500 md:max-w-md text-center md:text-left">ⓘ Pengajuan akan ditinjau secara berkala oleh staf teknis Dinas Kehutanan.</p>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto bg-[#185325] text-white px-8 py-3 rounded-full text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#113d1b] transition-colors active:scale-95 disabled:opacity-70 shadow-sm"
            >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <HiOutlinePaperAirplane className="w-4 h-4" />
                )}
                {isLoading ? 'Mengirim...' : 'Kirim Berkas Pengajuan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjukanProgramCSR;