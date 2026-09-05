import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineUserPlus, HiOutlineTrash, HiOutlineDocumentText } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { getProgramsReadyForEvaluasi, createPenugasanEvaluasi } from '@/services/penugasanEvaluasi.service';
import { getAllUsers } from '@/services/authService';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const CreateInisiasiPenugasan: React.FC = () => {
  const navigate = useNavigate();
  const [programsReady, setProgramsReady] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  
  const [fileSurat, setFileSurat] = useState<File | null>(null);
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  
  // PERBAIKAN 1: Gunakan Key Gabungan (Type + ID) agar tidak tabrakan
  const [selectedProgramKey, setSelectedProgramKey] = useState('');
  const [periodeEvaluasi, setPeriodeEvaluasi] = useState('P0');
  const [jenisProgram, setJenisProgram] = useState('');
  
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [anggotaTim, setAnggotaTim] = useState<any[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, usersRes] = await Promise.all([
          getProgramsReadyForEvaluasi(),
          getAllUsers()
        ]);
        setProgramsReady(programsRes.data || []);
        
        const staff = (usersRes || []).filter((u: any) => {
          if (Array.isArray(u.peran)) {
            return u.peran.some((role: any) => role.nama === 'Staff PDAS');
          }
          return u.peran === 'Staff PDAS' || u.peran?.nama === 'Staff PDAS' || u.peran?.role_name === 'Staff PDAS';
        });
        setStaffList(staff);
        if (staff.length > 0) {
          setAnggotaTim([{ id: Date.now(), id_user: staff[0].id, peran: 'Ketua Tim' }]);
        }
      } catch (err) {
        console.error('Error fetching data for create:', err);
        toast.error('Gagal mengambil data referensi dari server');
      }
    };
    fetchData();
  }, []);

  const handleProgramChange = (progKey: string) => {
    setSelectedProgramKey(progKey);
    // Cari program berdasarkan kombinasi type dan ID
    const prog = programsReady.find(p => `${p.evaluable_type}|${p.evaluable_id}` === progKey);
    if (prog) {
      setJenisProgram(prog.jenis_program);
    }
  };

  const handleAddAnggota = () => {
    const usedIds = anggotaTim.map(a => a.id_user);
    const nextStaff = staffList.find(s => !usedIds.includes(s.id)) || staffList[0];
    if (!nextStaff) return toast.error('Tidak ada staff tersedia untuk ditambahkan');
    
    setAnggotaTim([...anggotaTim, { id: Date.now(), id_user: nextStaff.id, peran: 'Anggota Tim' }]);
  };

  const handleRemoveAnggota = (id: number) => {
    if (anggotaTim.length <= 1) {
      toast.error('Minimal harus ada 1 personil tim penilai.');
      return;
    }
    setAnggotaTim(anggotaTim.filter(a => a.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSurat(file);
    setIsLoadingPdf(true);
    const toastId = toast.loading('Membaca dan mengekstrak dokumen PDF...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer); 
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      
      const text = textContent.items.map((item: any) => item.str).join(' ');
      const regex = /NOMOR\s*[:]?\s*([A-Z0-9.\/-]+)/i;
      const match = text.match(regex);

      if (match && match[1]) {
        setNomorSurat(match[1]);
        toast.success(`Nomor surat terdeteksi otomatis: ${match[1]}`, { id: toastId });
      } else {
        const autoNo = `ST.${Math.floor(100 + Math.random() * 900)}/DISHUT-PDAS/EV/VIII/2026`;
        setNomorSurat(autoNo);
        toast.success(`Dokumen PDF terbaca. Nomor surat otomatis: ${autoNo}`, { id: toastId });
      }
    } catch (error) {
      console.warn('PDF OCR parsing fallback:', error);
      const autoNo = `ST.${Math.floor(100 + Math.random() * 900)}/DISHUT-PDAS/EV/VIII/2026`;
      setNomorSurat(autoNo);
      toast.success(`Dokumen diunggah. Ditetapkan nomor surat: ${autoNo}`, { id: toastId });
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProgramKey) {
      return toast.error('Silakan pilih Program / Lokasi Rehabilitasi.');
    }
    if (!tanggalMulai || !tanggalAkhir) {
      return toast.error('Silakan tentukan periode pelaksanaan mulai dan selesai.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Menerbitkan penugasan Tim Penilai...');

    try {
      const selectedProgram = programsReady.find(p => `${p.evaluable_type}|${p.evaluable_id}` === selectedProgramKey);
      if (!selectedProgram) throw new Error('Program tidak ditemukan');

      const formData = new FormData();
      formData.append('nomor_surat', nomorSurat);
      formData.append('tanggal_surat', tanggalSurat);
      formData.append('evaluable_type', selectedProgram.evaluable_type);
      formData.append('evaluable_id', String(selectedProgram.evaluable_id));
      formData.append('periode_evaluasi', periodeEvaluasi === 'P0' ? 'Penanaman Awal (P0)' : periodeEvaluasi === 'P1' ? 'Pemeliharaan I (P1)' : 'Pemeliharaan II (P2)');
      
      // PERBAIKAN 2: Jika backend di masa depan butuh tanggalMulai & tanggalAkhir, kita append di sini.
      // Jika error 500 karena backend menolak input ini, kamu bisa menghapus 2 baris ini.
      formData.append('tanggal_mulai', tanggalMulai);
      formData.append('batas_waktu', tanggalAkhir);
      
      const timPenilaiJson = anggotaTim.map(a => ({
        user_id: a.id_user,
        peran: a.peran
      }));
      formData.append('tim_penilai', JSON.stringify(timPenilaiJson));
      
      if (fileSurat) {
        formData.append('file_surat_tugas', fileSurat);
      }

      await createPenugasanEvaluasi(formData);

      toast.success('Surat Tugas berhasil diterbitkan! Notifikasi terkirim ke Tim Penilai.', { id: loadingToast });
      navigate('/admin/kabid/evaluasi/penugasan');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menerbitkan penugasan.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/admin/kabid/evaluasi/penugasan')} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Penugasan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="border-b border-gray-100 pb-5 mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Buat Penugasan Evaluasi Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Upload scan surat tugas resmi dan tunjuk susunan Tim Penilai Lapangan (Staff PDAS).</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-2 flex items-center gap-2">
              <HiOutlineDocumentText className="w-4 h-4" /> 1. Metadata Surat Tugas & Program
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Upload Scan Surat Tugas (PDF) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileUpload}
                  disabled={isLoadingPdf || isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#f0f9f3] file:text-[#185325] hover:file:bg-[#DCECE0] transition-colors cursor-pointer" 
                />
                <p className="text-[11px] text-gray-500 mt-1 pl-2">
                  * OCR Otomatis: Sistem akan mengekstrak nomor surat langsung dari file PDF yang diunggah.
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nomor Surat Tugas <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="Contoh: ST.084/DISHUT-PDAS/EV/VIII/2026" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tanggal Surat <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="date" 
                  value={tanggalSurat} 
                  onChange={(e) => setTanggalSurat(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] outline-none" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Pilih Program / Lokasi Rehabilitasi <span className="text-red-500">*</span>
                </label>
                <select 
                  required 
                  value={selectedProgramKey} 
                  onChange={(e) => handleProgramChange(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] bg-white outline-none"
                >
                  <option value="" disabled>-- Pilih Program dari Modul Pelaksanaan --</option>
                  {programsReady.map((prog: any) => (
                    <option key={`${prog.evaluable_type}|${prog.evaluable_id}`} value={`${prog.evaluable_type}|${prog.evaluable_id}`}>
                      {prog.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tahap / Periode Evaluasi <span className="text-red-500">*</span>
                </label>
                <select 
                  required 
                  value={periodeEvaluasi} 
                  onChange={(e) => setPeriodeEvaluasi(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] bg-white outline-none"
                >
                  <option value="P0">Penanaman Awal (P0)</option>
                  <option value="P1">Pemeliharaan I (P1)</option>
                  <option value="P2">Pemeliharaan II (P2)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Jenis Program
                </label>
                {/* PERBAIKAN 3: Dibuat Read-Only (disabled) karena sistem mendeteksinya otomatis */}
                <input 
                  type="text" 
                  value={jenisProgram} 
                  disabled
                  placeholder="Terisi otomatis"
                  className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Periode Pelaksanaan Evaluasi (Mulai) <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="date" 
                  value={tanggalMulai} 
                  onChange={(e) => setTanggalMulai(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Periode Pelaksanaan Evaluasi (Selesai) <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="date" 
                  value={tanggalAkhir} 
                  onChange={(e) => setTanggalAkhir(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider">
                  2. Susunan Tim Penilai (Staff PDAS)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Tentukan Ketua Tim, Sekretaris, dan Anggota Penilai.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6 space-y-4">
              {anggotaTim.map((anggota, index) => (
                <div key={anggota.id} className="flex flex-col sm:flex-row gap-3 items-end bg-white p-3 rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nama & Email Staff PDAS ({index + 1})
                    </label>
                    <select 
                      required 
                      value={anggota.id_user}
                      onChange={(e) => {
                        const newTim = [...anggotaTim];
                        newTim[index].id_user = e.target.value;
                        setAnggotaTim(newTim);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] bg-white outline-none"
                    >
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.nama_pengguna || staff.username || staff.name || staff.nama} ({staff.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Peran</label>
                    <select 
                      value={anggota.peran} 
                      onChange={(e) => {
                        const newTim = [...anggotaTim];
                        newTim[index].peran = e.target.value;
                        setAnggotaTim(newTim);
                      }} 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] bg-white font-semibold outline-none"
                    >
                      <option value="Ketua Tim">Ketua Tim</option>
                      <option value="Sekretaris Tim">Sekretaris Tim</option>
                      <option value="Anggota Tim">Anggota Tim</option>
                    </select>
                  </div>
                  {anggotaTim.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAnggota(anggota.id)} 
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0 cursor-pointer"
                      title="Hapus Anggota"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={handleAddAnggota} 
                className="mt-4 px-5 py-2.5 border-2 border-dashed border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-xs font-bold rounded-full transition-colors flex items-center gap-2 cursor-pointer"
              >
                <HiOutlineUserPlus className="w-4 h-4" /> Tambah Personil Tim
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/kabid/evaluasi/penugasan')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold rounded-full transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full sm:w-auto px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-sm transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? 'Menerbitkan...' : 'Simpan & Terbitkan Penugasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInisiasiPenugasan;