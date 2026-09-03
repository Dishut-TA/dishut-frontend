import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlinePaperAirplane, HiOutlineCloud } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createLaporanDanaAPI, getLaporanDanaByIdAPI, updateLaporanDanaAPI, getLaporanDanasAPI } from '@/services/laporan-dana.service';
import { getProgramApbdsAPI } from '@/services/program-apbd.service';
import { getProgramCsrsAPI } from '@/services/program-csr.service';

const CreateLaporanDana: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State Data Master Program
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedUid, setSelectedUid] = useState<string>('');

  // State Form Laporan
  const [tanggal, setTanggal] = useState('');
  const [tahap, setTahap] = useState('Tahap 1');
  const [pengeluaranList, setPengeluaranList] = useState([
    { id: 1, kategori: '', nominal: '', bukti: null as File | null, existingFileName: '' },
  ]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Ambil Data Proyek & Seluruh Histori Laporan secara paralel
        const [apbdRes, csrRes, laporanRes] = await Promise.all([
          getProgramApbdsAPI(),
          getProgramCsrsAPI(),
          getLaporanDanasAPI()
        ]);

        // Helper untuk menghitung dana yang sudah terpakai dari laporan sebelumnya
        const hitungRealisasiSebelumnya = (sumber: string, progId: string) => {
          return laporanRes
            .filter((l: any) => 
              l.sumber_dana === sumber && 
              String(l.program_id) === String(progId) && 
              ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status) &&
              String(l.id) !== String(id) // Jangan hitung nominal lama dari laporan yang SEDANG di-edit
            )
            .reduce((sum: number, l: any) => sum + Number(l.dana_direalisasikan), 0);
        };

        const activeApbd = apbdRes.filter((p: any) => ['Aktif', 'Berjalan', 'Selesai'].includes(p.status)).map((p: any) => {
          const terpakai = hitungRealisasiSebelumnya('APBD', p.id);
          return {
            uid: `APBD-${p.id}`, id: p.id, sumber_dana: 'APBD', nama_program: p.nama_program, anggaran: p.anggaran,
            realisasi_sebelumnya: terpakai, sisa_anggaran: Number(p.anggaran) - terpakai
          };
        });

        const activeCsr = csrRes.filter((p: any) => ['Disetujui', 'Aktif', 'Berjalan', 'Selesai'].includes(p.status)).map((p: any) => {
          const terpakai = hitungRealisasiSebelumnya('CSR', p.id);
          return {
            uid: `CSR-${p.id}`, id: p.id, sumber_dana: 'CSR', nama_program: p.nama_program, anggaran: p.anggaran,
            realisasi_sebelumnya: terpakai, sisa_anggaran: Number(p.anggaran) - terpakai
          };
        });
        
        const allPrograms = [...activeApbd, ...activeCsr];
        setPrograms(allPrograms);

        // Jika mode revisi, fetch data existing dan populate ke form
        if (id) {
          const detailRes = await getLaporanDanaByIdAPI(id);
          const data = detailRes.data || detailRes.payload || detailRes;
          
          setSelectedUid(`${data.sumber_dana}-${data.program_id}`);
          setTanggal(data.tanggal_pengeluaran);
          setTahap(data.tahap);
          
          if (data.rincian && data.rincian.length > 0) {
            const parsedRincian = data.rincian.map((rin: any) => ({
              id: rin.id,
              kategori: rin.kategori_kegiatan,
              nominal: rin.nominal,
              bukti: null, 
              existingFileName: rin.bukti_transaksi_path ? 'Bukti Nota Terlampir' : ''
            }));
            setPengeluaranList(parsedRincian);
          }
        }

      } catch (error: any) {
        toast.error("Gagal memuat data persiapan formulir.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [id]);

  const handleAddBaris = () => {
    setPengeluaranList([...pengeluaranList, { id: Date.now(), kategori: '', nominal: '', bukti: null, existingFileName: '' }]);
  };

  const handleInputChange = (index: number, field: 'kategori' | 'nominal', value: string) => {
    const updated = [...pengeluaranList];
    updated[index] = { ...updated[index], [field]: value };
    setPengeluaranList(updated);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...pengeluaranList];
    updated[index].bukti = file;
    setPengeluaranList(updated);
  };

  // Kalkulasi Dinamis
  const selectedProgram = programs.find(p => p.uid === selectedUid);
  const danaDisalurkan = selectedProgram ? Number(selectedProgram.anggaran) : 0;
  const realisasiSebelumnya = selectedProgram ? Number(selectedProgram.realisasi_sebelumnya) : 0;
  
  const totalRealisasiSaatIni = pengeluaranList.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
  
  const danaTersedia = danaDisalurkan - realisasiSebelumnya;
  const sisaDanaAkhir = danaTersedia - totalRealisasiSaatIni;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return toast.error("Silakan pilih proyek terlebih dahulu.");
    if (totalRealisasiSaatIni <= 0) return toast.error("Rincian pengeluaran tidak boleh kosong.");
    if (sisaDanaAkhir < 0) return toast.error("Pengeluaran melebihi sisa dana yang tersedia.");

    setIsSubmitting(true);
    const loadingToast = toast.loading(id ? 'Mengirim revisi...' : 'Mengirim laporan dana...');

    try {
      const formData = new FormData();
      formData.append('sumber_dana', selectedProgram.sumber_dana);
      formData.append('program_id', selectedProgram.id.toString());
      formData.append('nama_program', selectedProgram.nama_program);
      formData.append('tahap', tahap);
      formData.append('tanggal_pengeluaran', tanggal || new Date().toISOString().split('T')[0]);
      formData.append('dana_disalurkan', String(danaDisalurkan));

      let hasMissingNewFile = false;

      pengeluaranList.forEach((item, index) => {
        formData.append(`rincian[${index}][kategori]`, item.kategori);
        formData.append(`rincian[${index}][nominal]`, item.nominal);
        
        if (item.bukti) {
          formData.append(`rincian[${index}][bukti]`, item.bukti);
        } else if (id && !item.bukti) {
           hasMissingNewFile = true;
        }
      });

      if (id && hasMissingNewFile) {
          toast.dismiss(loadingToast);
          setIsSubmitting(false);
          return toast.error("Saat revisi, seluruh bukti nota wajib diunggah ulang.");
      }

      if (id) {
        await updateLaporanDanaAPI(id, formData);
      } else {
        await createLaporanDanaAPI(formData);
      }
      
      toast.success(id ? "Revisi Laporan berhasil dikirim!" : "Laporan dana berhasil dikirim!", { id: loadingToast });
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses form.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-[#185325] font-bold">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Menyiapkan formulir...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12 px-4 sm:px-0 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 transition-colors self-start hover:text-[#185325]">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-10">
          {id ? "Revisi Laporan Penggunaan Dana" : "Laporan Penggunaan Dana"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Pilih Proyek Rehabilitasi Berjalan <span className="text-red-500">*</span></label>
            <select 
              required
              value={selectedUid}
              onChange={(e) => setSelectedUid(e.target.value)}
              disabled={!!id} // Disabled jika mode revisi
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>-- Pilih Proyek --</option>
              {programs.map((prog) => (
                <option key={prog.uid} value={prog.uid} disabled={prog.sisa_anggaran <= 0 && !id}>
                  [{prog.sumber_dana}] {prog.nama_program} - Sisa: {formatRupiah(prog.sisa_anggaran)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tanggal Pengeluaran <span className="text-red-500">*</span></label>
            <input 
              required 
              type="date" 
              value={tanggal} 
              onChange={(e) => setTanggal(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tahapan Laporan <span className="text-red-500">*</span></label>
            <select 
              value={tahap} 
              onChange={(e) => setTahap(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#185325] bg-white cursor-pointer"
            >
              <option value="Tahap 1">Tahap 1</option>
              <option value="Tahap 2">Tahap 2</option>
              <option value="Tahap 3">Tahap 3</option>
              <option value="Tahap Akhir">Tahap Akhir</option>
            </select>
          </div>

          <div className="pt-6">
            <label className="block text-sm font-bold text-gray-800 mb-4">Rincian Penggunaan Anggaran</label>
            <div className="grid grid-cols-12 gap-4 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-300 pb-3 mb-3">
              <div className="col-span-5">Kategori Pengeluaran</div>
              <div className="col-span-5">Nominal</div>
              <div className="col-span-2 text-center">Bukti Nota</div>
            </div>

            {id && (
                <div className="mb-4 text-xs font-bold text-red-500 italic bg-red-50 p-2 rounded-lg">
                    ⚠️ Karena ini mode Revisi, Anda wajib mengunggah ulang <b>Semua Bukti Nota</b> agar tidak hilang saat penyimpanan.
                </div>
            )}

            {pengeluaranList.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 mb-3 items-center">
                <div className="col-span-5">
                  <input 
                    required 
                    type="text" 
                    placeholder="Contoh: Pembersihan Lahan" 
                    value={item.kategori} 
                    onChange={(e) => handleInputChange(index, 'kategori', e.target.value)} 
                    className="w-full text-sm border-b border-gray-200 pb-2 focus:outline-none focus:border-[#185325] text-gray-800 font-semibold bg-transparent" 
                  />
                </div>
                <div className="col-span-5 flex items-center text-sm border-b border-gray-200 pb-2 focus-within:border-[#185325]">
                  <span className="text-gray-600 mr-2 font-semibold">Rp</span>
                  <input 
                    required 
                    type="number" 
                    placeholder="8000000" 
                    value={item.nominal} 
                    onChange={(e) => handleInputChange(index, 'nominal', e.target.value)} 
                    className="w-full outline-none text-gray-800 font-semibold bg-transparent" 
                  />
                </div>
                <div className="col-span-2 flex justify-center border-b border-gray-200 pb-2 relative group">
                  <label className="cursor-pointer text-gray-500 hover:text-[#185325] transition-colors" title={item.bukti ? item.bukti.name : "Upload File Nota"}>
                    <HiOutlineCloud className={`w-6 h-6 ${item.bukti ? 'text-[#185325]' : item.existingFileName ? 'text-yellow-500' : ''}`} />
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            ))}

            <button type="button" onClick={handleAddBaris} className="text-xs font-medium text-gray-400 mt-2 hover:text-[#185325] transition-colors">
              + Tambah baris pengeluaran
            </button>
          </div>

          <div className="bg-[#DCECE0]/70 rounded-xl p-6 md:p-8 mt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Ringkasan Saldo</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Total Anggaran Program</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">{formatRupiah(danaDisalurkan)}</span>
              </div>
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Realisasi Sebelumnya</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">{formatRupiah(realisasiSebelumnya)}</span>
              </div>
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-sm">
                <span className="text-gray-600 font-medium">Realisasi Laporan Ini</span>
                <span className="font-bold text-gray-600">:</span>
                <span className="font-semibold text-gray-800">{formatRupiah(totalRealisasiSaatIni)}</span>
              </div>
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-sm border-t border-gray-300 pt-3 mt-1">
                <span className="text-gray-800 font-bold">Sisa Dana Tersedia</span>
                <span className="font-bold text-gray-800">:</span>
                <span className={`font-bold ${sisaDanaAkhir < 0 ? 'text-red-600' : 'text-[#185325]'}`}>
                  {formatRupiah(sisaDanaAkhir)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isSubmitting || sisaDanaAkhir < 0 || !selectedProgram} 
              className="flex items-center justify-center gap-2 px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm w-full md:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45 mb-1" /> 
              )}
              {isSubmitting ? 'Mengirim...' : (id ? "Kirim Revisi Laporan" : "Kirim Laporan")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLaporanDana;