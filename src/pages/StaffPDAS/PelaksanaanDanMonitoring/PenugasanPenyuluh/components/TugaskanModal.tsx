import React, { useState } from 'react';
import { 
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineListBullet,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineEye,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import DetailRencanaPOModal from './DetailRencanaPOModal';

const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 12 7 12 7 7C7 12 12 12 12 12ZM12 12C12 12 17 12 17 7C17 12 12 12 12 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 22H16" />
  </svg>
);

interface TugaskanModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null; 
  onSuccess?: () => void;
}

// Ambil status kekritisan (Analisis CPI) dari data zona, mendukung sumber:
// - Validasi Lokasi (data.detail = AnalysisResultZone langsung)
// - Pelaksanaan Penanaman (data.detail.analysis_result_zone / analysisResultZone, hasil relasi Donasi/APBD/CSR)
const getStatusKekritisan = (item: any | null): string | null => {
  if (!item) return null;
  const detail = item.detail || {};
  return (
    detail.status_lahan_kritis ||
    detail.analysis_result_zone?.status_lahan_kritis ||
    detail.analysisResultZone?.status_lahan_kritis ||
    null
  );
};

// Mapping status kekritisan CPI -> level prioritas penugasan
// Sangat Kritis -> Tinggi, Kritis -> Sedang, Tidak Kritis / lainnya -> Rendah
const mapStatusToPrioritas = (status: string | null): string => {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'sangat kritis') return 'Tinggi';
  if (s === 'kritis') return 'Sedang';
  if (s === 'tidak kritis') return 'Rendah';
  return '';
};

const TugaskanModal: React.FC<TugaskanModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
  const [formData, setFormData] = useState({
    penyuluh: '',
    tanggal: '',
    batasWaktu: '',
    prioritas: '',
    catatan: '',
    kth: 'kth1' // Default value for locked select
  });

  // Status kekritisan CPI untuk item yang sedang ditugaskan (dipakai untuk auto-set prioritas)
  const statusKekritisan = getStatusKekritisan(data);
  const autoPrioritas = mapStatusToPrioritas(statusKekritisan);

  // Setiap kali item yang mau ditugaskan berganti, prioritas otomatis diisi
  // berdasarkan hasil Analisis CPI (status kekritisan) lokasi tersebut.
  React.useEffect(() => {
    if (isOpen && data) {
      setFormData((prev) => ({
        ...prev,
        prioritas: autoPrioritas || prev.prioritas
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, data?.id]);

  const [penyuluhList, setPenyuluhList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk mengontrol Modal Detail Rencana PO
  const [isDetailPOOpen, setIsDetailPOOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const fetchPenyuluh = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
          const res = await fetch(`${API_URL}/users`);
          const json = await res.json();
          // Assuming user roles can be checked or just listing all users for now
          if (json.payload) {
            setPenyuluhList(json.payload.filter((u: any) => 
              u.peran && u.peran.some((r: any) => r.nama.toLowerCase() === 'penyuluh')
            ));
          }
        } catch (e) {
          console.error("Gagal mengambil data penyuluh:", e);
        }
      };
      fetchPenyuluh();
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isValidasi = data.jenisKegiatan === 'Validasi Lokasi';

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.penyuluh) return alert('Silakan pilih penyuluh');

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      
      const payload = {
        penyuluh_id: parseInt(formData.penyuluh, 10),
        source_type: data.source_type || 'App\\Models\\AnalysisResultZone',
        source_id: data.original_id || (typeof data.id === 'string' ? parseInt(data.id, 10) : data.id),
        jenis_kegiatan: data.jenisKegiatan,
        tanggal_mulai: formData.tanggal || null,
        batas_waktu: formData.batasWaktu || null,
        arahan: formData.catatan || null,
        prioritas: formData.prioritas || null
      };

      const res = await fetch(`${API_URL}/penugasan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error('Gagal menyimpan penugasan');
      }
      
      if (onSuccess) onSuccess();
      else onClose();
    } catch (error: any) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan penugasan. Periksa console untuk detail.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          {/* HEADER */}
          <div className="px-6 py-5 flex items-start justify-between sticky top-0 bg-white z-10">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                {isValidasi ? <HiOutlineMapPin className="w-6 h-6" /> : <SproutIcon className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {isValidasi ? 'Tugaskan Validasi Lokasi' : 'Tugaskan Pelaksanaan Kegiatan'}
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                  {data.jenisKegiatan}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSimpan} className="px-6 pb-6 space-y-6">
            
            {/* SECTION: RINGKASAN */}
            <div className="border border-emerald-100 rounded-xl overflow-hidden">
              <div className="px-5 py-3 flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/30">
                <HiOutlineListBullet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-700">
                  {isValidasi ? 'Ringkasan Lokasi' : 'Ringkasan Program'}
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {isValidasi ? (
                  <>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">ID Referensi</span><span className="font-bold text-gray-900">: LOC-2026-0012</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">CDK</span><span className="font-bold text-gray-900">: {data.wilayah}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Lokasi Usulan</span><span className="font-bold text-gray-900">: Blok Cibodas</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Desa / Kecamatan</span><span className="font-bold text-gray-900 whitespace-pre-line">: {data.lokasi.replace('\n', ' ')}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Sumber Lokasi</span><span className="font-bold text-gray-900">: Analisis CPI</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Luas</span><span className="font-bold text-gray-900">: 12.5 Ha</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">ID Program</span><span className="font-bold text-gray-900">: {data.id}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Jenis Kegiatan</span><span className="font-bold text-gray-900">: Penanaman</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Nama Program</span><span className="font-bold text-gray-900">: {data.program}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Lokasi Program</span><span className="font-bold text-gray-900">: {data.lokasi.replace('\n', ' ')}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Sumber Dana</span><span className="font-bold text-gray-900">: {data.source_type === 'App\\Models\\DonationProgram' ? 'Donasi' : data.source_type === 'App\\Models\\ProgramApbd' ? 'APBD' : 'CSR'}</span></div>
                    <div className="flex items-start"><span className="w-32 text-gray-500 shrink-0">Target Kegiatan</span><span className="font-bold text-gray-900">: {data.source_type === 'App\\Models\\DonationProgram' ? data.detail?.total_seeds_bast : (data.detail?.total_seeds_collected || data.detail?.jumlah_bibit || '-')} Tanaman</span></div>
                  </>
                )}
              </div>
            </div>

            {/* SECTION KHUSUS PELAKSANAAN: PIHAK TERLIBAT */}
            {!isValidasi && (
              <div className="border border-emerald-100 rounded-xl overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/30">
                  <HiOutlineUserGroup className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-emerald-700">Pihak Terlibat</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">KTH Terlibat</label>
                    <select 
                      disabled
                      value="kth1" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                    >
                      <option value="kth1">{data.detail?.kth?.name || data.detail?.kth?.nama || 'KTH Tidak Ditemukan'} (Telah ditetapkan)</option>
                    </select>
                    <p className="text-[11px] mt-2 font-medium text-emerald-700">KTH akan menerima informasi penugasan setelah disimpan.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rencana / Periode Penanaman (P0)</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">P0 - Rencana Penanaman Awal</p>
                        <p className="text-[11px] text-gray-500 mt-1">Target: {data.source_type === 'App\\Models\\DonationProgram' ? data.detail?.total_seeds_bast : (data.detail?.total_seeds_collected || data.detail?.jumlah_bibit || '-')} tanaman | Periode Pelaksanaan: {data.detail?.start_date || data.detail?.tanggal_mulai || '-'} - {data.detail?.end_date || data.detail?.tanggal_selesai || '-'}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsDetailPOOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors shrink-0"
                      >
                        <HiOutlineEye className="w-4 h-4" /> Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: FORM PENUGASAN */}
            <div className="border border-emerald-100 rounded-xl overflow-hidden">
              <div className="px-5 py-3 flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/30">
                <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-700">Form Penugasan</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Penyuluh yang Ditugaskan</label>
                    <select 
                      value={formData.penyuluh} onChange={(e) => setFormData({...formData, penyuluh: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                      required
                    >
                      <option value="">-- Pilih Penyuluh --</option>
                      {penyuluhList.map(p => (
                        <option key={p.id} value={p.id}>{p.username || p.nama_pengguna}</option>
                      ))}
                      {penyuluhList.length === 0 && (
                        <>
                          <option value="1">Admin (Fallback)</option>
                          <option value="2">Penyuluh 1 (Fallback)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isValidasi ? 'Tanggal Validasi' : 'Tanggal Mulai Pelaksanaan'}
                    </label>
                    <input 
                      type="date" 
                      value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isValidasi ? 'Batas Waktu Validasi' : 'Batas Waktu Pelaksanaan'}
                    </label>
                    <input 
                      type="date" 
                      value={formData.batasWaktu} onChange={(e) => setFormData({...formData, batasWaktu: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      Prioritas
                      {statusKekritisan && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Otomatis dari CPI
                        </span>
                      )}
                    </label>
                    <select
                      value={formData.prioritas}
                      onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                      disabled={!!autoPrioritas}
                      className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700 ${autoPrioritas ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                    >
                      <option value="">-- Pilih Prioritas --</option>
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                    </select>
                    {statusKekritisan ? (
                      <p className="text-[11px] mt-1.5 text-gray-500">
                        Status kekritisan lahan (Analisis CPI): <span className="font-bold text-gray-700">{statusKekritisan}</span> → Prioritas <span className="font-bold text-gray-700">{autoPrioritas}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] mt-1.5 text-gray-400">
                        Data status kekritisan CPI tidak ditemukan untuk lokasi ini, silakan pilih prioritas secara manual.
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Penugasan (Opsional)</label>
                  <textarea 
                    value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    placeholder={isValidasi ? "Contoh: Lakukan verifikasi koordinat, kondisi lahan, akses lokasi, dan dokumentasi lapangan." : "Contoh: Dampingi KTH dalam pelaksanaan penanaman sesuai target dan laporkan progres berkala."}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none text-gray-700"
                  ></textarea>
                </div>

                {/* Info Text Bawah */}
                <div className="px-4 py-3 rounded-lg flex items-start gap-2 border bg-emerald-50/50 border-emerald-100 text-emerald-700">
                  <HiOutlineInformationCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-medium pt-0.5">
                    {isValidasi 
                      ? 'Penugasan ini ditujukan untuk validasi lapangan sebelum lokasi ditetapkan.'
                      : 'Penyuluh bertugas mendampingi KTH dalam pelaksanaan penanaman sesuai rencana program.'}
                  </p>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-[#1F7A4D] hover:bg-emerald-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? 'Menyimpan...' : 'Kirim Penugasan'}
              </button>
            </div>

          </form>
        </div>
      </div>

      <DetailRencanaPOModal
        isOpen={isDetailPOOpen} 
        onClose={() => setIsDetailPOOpen(false)} 
        data={data}
      />
    </>
  );
};

export default TugaskanModal;