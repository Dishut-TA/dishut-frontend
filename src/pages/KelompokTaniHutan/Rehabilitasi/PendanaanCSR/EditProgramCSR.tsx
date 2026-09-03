import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlinePaperAirplane, HiOutlineCloudArrowUp, HiOutlineChevronLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI, updateProgramCsrAPI } from '@/services/program-csr.service';
const EditProgramCSR: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState({ fetch: true, submit: false });
  const [form, setForm] = useState({
    judul: '',
    luasLahan: '',
    jenisPohon: '',
    jumlahBibit: '',
    anggaran: '',
    deskripsi: ''
  });
  const [fileProposal, setFileProposal] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        if (!id) return;
        const res = await getProgramCsrByIdAPI(id);
        const data = res.data || res.payload || res;
        
        setForm({
          judul: data.nama_program || '',
          luasLahan: data.target_luas_lahan || '',
          jenisPohon: data.jenis_tanaman || '',
          jumlahBibit: data.jumlah_bibit || '',
          anggaran: data.anggaran || '',
          deskripsi: data.deskripsi_rencana || ''
        });
        setExistingFile(data.proposal_file_path);
      } catch (error) {
        toast.error("Gagal memuat data program.");
        navigate(-1);
      } finally {
        setIsLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    fetchExistingData();
  }, [id, navigate]);

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
    if (!id) return;

    setIsLoading(prev => ({ ...prev, submit: true }));
    const loadingToast = toast.loading('Mengirim revisi proposal CSR...');

    try {
      const formData = new FormData();
      formData.append('nama_program', form.judul);
      formData.append('target_luas_lahan', form.luasLahan);
      formData.append('jenis_tanaman', form.jenisPohon);
      formData.append('jumlah_bibit', form.jumlahBibit);
      formData.append('anggaran', form.anggaran);
      formData.append('deskripsi_rencana', form.deskripsi);
      formData.append('status', 'Menunggu Verifikasi'); 
      
      if (fileProposal) {
        formData.append('file_proposal', fileProposal);
      }

      await updateProgramCsrAPI(id, formData);
      
      toast.success('Revisi proposal berhasil dikirim!', { id: loadingToast });
      navigate('/admin/kth/rehabilitasi/pendanaan-csr');
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan.', { id: loadingToast });
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (isLoading.fetch) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat data pengajuan...
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 max-w-5xl animate-in fade-in duration-300 pb-12 bg-[#F8FAFC] min-h-screen pt-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#185325] font-bold mb-6 hover:text-[#113d1b] transition-colors cursor-pointer">
        <HiOutlineChevronLeft /> Batal Revisi
      </button>

      <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold text-[#185325]">REVISI PENGAJUAN CSR</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">Ubah dan perbaiki data formulir digital Anda sebelum dikirimkan ulang untuk diverifikasi.</p>

        <hr className='border-gray-200 mb-8'/>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
                <span className="text-sm font-bold text-gray-700">Judul Program <span className="text-red-500">*</span></span>
                <input required type="text" name="judul" value={form.judul} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: Reboisasi DAS Hulu Sungai" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
                <span className="text-sm font-bold text-gray-700">Luas Lahan Terbuka yang Direhab (Hektar) <span className="text-red-500">*</span></span>
                <input required type="number" name="luasLahan" value={form.luasLahan} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 15" />
            </label>
            <label>
                <span className="text-sm font-bold text-gray-700">Jenis Pohon / Tanaman Utama</span>
                <input type="text" name="jenisPohon" value={form.jenisPohon} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: Mahoni, Jati Mas, Sengon" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
                <span className="text-sm font-bold text-gray-700">Target Jumlah Bibit <span className="text-red-500">*</span></span>
                <input required type="number" name="jumlahBibit" value={form.jumlahBibit} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 200" />
            </label>
            <label>
                <span className="text-sm font-bold text-gray-700">Total Estimasi Anggaran (Rupiah) <span className="text-red-500">*</span></span>
                <input required type="number" name="anggaran" value={form.anggaran} onChange={handleInputChange} className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors" placeholder="Contoh: 850000000" />
            </label>
          </div>

          <label className="block cursor-pointer">
            <span className="text-sm font-bold text-gray-700">Upload Proposal CSR (PDF)</span>
            <div className={`mt-2 w-full px-5 py-3 border rounded-full text-sm flex items-center justify-between transition-colors ${fileProposal ? 'border-[#185325] bg-[#E8F5E9] text-[#185325]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                <span className="truncate pr-4">
                  {fileProposal ? fileProposal.name : (existingFile ? `File saat ini: ${existingFile.split('/').pop()}` : 'Upload file PDF proposal...')}
                </span>
                <HiOutlineCloudArrowUp className="w-5 h-5 shrink-0" />
            </div>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
            {!fileProposal && existingFile && (
              <p className="text-[10px] text-gray-500 mt-2 px-2">* Biarkan kosong jika tidak ingin mengganti file proposal sebelumnya.</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-gray-700">Deskripsi Rencana Kerja & Teknis Pelaksanaan</span>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleInputChange} className="mt-2 w-full h-32 px-5 py-4 border border-gray-300 rounded-3xl text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors resize-none" placeholder="Tuliskan detail program..." />
          </label>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
            <p className="text-xs text-gray-500 md:max-w-md text-center md:text-left">Pastikan data sudah diperbaiki sesuai dengan catatan evaluator.</p>
            <button 
              type="submit" 
              disabled={isLoading.submit}
              className="w-full md:w-auto bg-[#185325] text-white px-8 py-3 rounded-full text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#113d1b] transition-colors active:scale-95 disabled:opacity-70 shadow-sm cursor-pointer"
            >
                {isLoading.submit ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <HiOutlinePaperAirplane className="w-4 h-4" />
                )}
                {isLoading.submit ? 'Menyimpan...' : 'Simpan & Kirim Ulang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgramCSR;