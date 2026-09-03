import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineCloud, HiPlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getKthProgramsAPI, createLaporanProyekAPI, getLaporanProyekAPI } from '@/services/investasi.service';
import type { ProgramInvestasi } from '@/utils/interface';

const CreateLaporanProyek: React.FC = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<ProgramInvestasi[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [deskripsi, setDeskripsi] = useState('');
  const [danaTerpakai, setDanaTerpakai] = useState('');
  const [sisaDana, setSisaDana] = useState('');
  const [saldoAwal, setSaldoAwal] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState('');
  const [fileObj, setFileObj] = useState<File | null>(null);

  React.useEffect(() => {
    getKthProgramsAPI().then(setPrograms).catch(_e => toast.error('Gagal memuat proyek'));
  }, []);

  React.useEffect(() => {
    const fetchSaldoAwal = async () => {
      if (!selectedProgramId) return;
      const prog = programs.find(p => p.id === selectedProgramId);
      if (!prog) return;

      if (prog.milestones && prog.milestones.length > 0) {
        const pendingMilestone = prog.milestones.find(m => m.status === 'PENDING') || prog.milestones[0];
        setSelectedMilestone(pendingMilestone);
      } else {
        setSelectedMilestone(null);
      }

      try {
        const reports = await getLaporanProyekAPI();
        const programReports = reports.filter((r: any) => r.program_id === selectedProgramId || r.program?.id === selectedProgramId);
        
        let initialSaldo = prog.dana_terkumpul || 0;
        if (programReports.length > 0) {
          programReports.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          initialSaldo = programReports[0].sisa_dana !== undefined ? programReports[0].sisa_dana : initialSaldo;
        }
        setSaldoAwal(initialSaldo);
      } catch (err) {
        setSaldoAwal(prog.dana_terkumpul || 0);
      }
    };
    fetchSaldoAwal();
  }, [selectedProgramId, programs]);

  React.useEffect(() => {
    const terpakai = Number(danaTerpakai) || 0;
    setSisaDana(String(Math.max(0, saldoAwal - terpakai)));
  }, [saldoAwal, danaTerpakai]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileObj(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed || !selectedProgramId || !selectedMilestone) {
      toast.error('Mohon lengkapi data dan setujui pernyataan.');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading('Membuat laporan...');
    try {
      const payload = {
        program_id: selectedProgramId,
        milestone_id: selectedMilestone.id,
        deskripsi_kemajuan: deskripsi,
        dana_terpakai: Number(danaTerpakai) || 0,
        sisa_dana: Number(sisaDana) || 0,
        dokumens: [
          {
            file_url: fileUrl || "https://example.com/default-bukti.pdf"
          }
        ]
      };
      await createLaporanProyekAPI(payload);
      toast.success('Laporan proyek berhasil dibuat!', { id: toastId });
      navigate('/admin/kth/laporan-investasi/laporan-proyek');
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat laporan', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12">
      <div className="relative flex items-center justify-center mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline transition-colors"
        >
          <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Buat Laporan Proyek
        </h1>
      </div>

      <div className="p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Proyek</label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] bg-white cursor-pointer appearance-none">
              <option value="" disabled>Pilih proyek</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.nama_program}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Milestone (Otomatis)</label>
            <input 
              type="text" 
              value={selectedMilestone ? selectedMilestone.judul_milestone : ''}
              disabled
              placeholder="Pilih proyek terlebih dahulu"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Dokumen Perkembangan</label>
            <div className="relative w-full">
              <input type="file" id="dokumen-upload" className="hidden" onChange={handleFileChange} />
              <label 
                htmlFor="dokumen-upload" 
                className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="truncate">{fileObj ? fileObj.name : 'Upload file'}</span>
                <HiOutlineCloud className="w-5 h-5 text-gray-500" />
              </label>
            </div>
            <p className="text-[11px] text-gray-500 italic mt-1.5 font-medium">
              **Jika ada 2 file atau lebih, mohon digabungkan dalam satu file
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Dana Terpakai</label>
            <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325] transition-all">
              <span className="pl-4 pr-2 text-sm font-bold text-gray-600 bg-gray-50/50 py-3">Rp.</span>
              <input 
                type="number" 
                placeholder="0" 
                value={danaTerpakai}
                onChange={(e) => setDanaTerpakai(e.target.value)}
                className="w-full px-2 py-3 text-sm outline-none bg-transparent" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Sisa Dana (Otomatis)</label>
            <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 transition-all">
              <span className="pl-4 pr-2 text-sm font-bold text-gray-500 py-3">Rp.</span>
              <input 
                type="number" 
                placeholder="0" 
                value={sisaDana}
                disabled
                className="w-full px-2 py-3 text-sm outline-none bg-transparent text-gray-500 cursor-not-allowed" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea 
              placeholder="Tulis keterangan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-4xl text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] resize-none transition-all"
            />
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer group mb-5">
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-4.5 h-4.5 border-2 border-gray-300 rounded checked:bg-[#185325] checked:border-[#185325] transition-colors cursor-pointer"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                Dengan ini saya menyatakan bahwa laporan dibuat dengan sebenar-benarnya
              </span>
            </label>

            <button 
              type="submit"
              disabled={!isAgreed || isSubmitting}
              className={`flex items-center justify-center gap-1 w-full py-3.5 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-sm ${
                isAgreed && !isSubmitting
                  ? 'bg-[#185325] hover:bg-[#123d1c]' 
                  : 'bg-[#9CA3AF] cursor-not-allowed opacity-80'
              }`}
            >
              {isSubmitting ? 'Memproses...' : 'Buat Laporan Proyek'} <HiPlus className="w-4 h-4 stroke-2" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateLaporanProyek;