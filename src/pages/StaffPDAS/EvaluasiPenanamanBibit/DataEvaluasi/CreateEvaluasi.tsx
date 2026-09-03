import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, HiOutlineDocumentText, HiOutlineUserGroup, 
  HiOutlineTableCells, HiOutlineCloudArrowUp
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const StaffCreateBAP: React.FC = () => {
  const navigate = useNavigate();

  // Data Auto-Filled (ReadOnly) hasil lemparan dari Penugasan
  const taskData = {
    noSurat: 'ST.76/TKTRH/B/03/2026',
    perusahaan: 'PT. Jawa Satu Power',
    lokasi: 'Desa Sudalarang, Kec. Sukawening',
    luas: '29.78',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Draf Berita Acara berhasil dikirim ke Kepala Bidang untuk disahkan!');
    navigate('/admin/staff/evaluasi'); // Kembali ke halaman utama evaluasi staff
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#185325] self-start">
          <HiOutlineArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Laporan Berita Acara Penilaian (BAP)</h1>
          <p className="text-sm text-gray-500 mt-1">Isi hasil evaluasi lapangan berdasarkan penugasan Surat Tugas {taskData.noSurat}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Informasi Dokumen (AUTO FILLED - READ ONLY) */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <HiOutlineDocumentText className="w-5 h-5 text-[#185325]" />
            <h2 className="text-lg font-bold text-gray-800">Informasi Penugasan (Otomatis)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 pointer-events-none">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Dasar Surat Tugas</label>
              <input type="text" readOnly value={taskData.noSurat} className="w-full bg-gray-200 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Nama Perusahaan / Pemegang Izin</label>
              <input type="text" readOnly value={taskData.perusahaan} className="w-full bg-gray-200 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600" />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-gray-800 mb-2">Lokasi Penanaman</label>
                 <input type="text" readOnly value={taskData.lokasi} className="w-full bg-gray-200 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-800 mb-2">Luas Lahan (Ha)</label>
                 <input type="text" readOnly value={taskData.luas} className="w-full bg-gray-200 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Form Input Baru (Tgl, No BA, Tim Penilai) */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <HiOutlineUserGroup className="w-5 h-5 text-[#185325]" />
            <h2 className="text-lg font-bold text-gray-800">Administrasi Laporan & Tim Penilai</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Nomor BAP (Draf)</label>
              <input type="text" required placeholder="Cth: BA.12/BPDAS/03/2026" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Tanggal Penilaian Lapangan</label>
              <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Ketua Tim (BPDAS)</label>
              <input type="text" required placeholder="Nama Lengkap beserta Gelar" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Pendamping (Perwakilan Perusahaan)</label>
              <input type="text" required placeholder="Nama & Jabatan" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">Jenis Tanaman (Dipisahkan koma)</label>
              <input type="text" required placeholder="Pinus, Akasia mangium, Bungur..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
            </div>
          </div>
        </div>

        {/* SECTION 3: Data PU */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <HiOutlineTableCells className="w-5 h-5 text-[#185325]" />
              <h2 className="text-lg font-bold text-gray-800">Rekapitulasi Kondisi Tanaman (PU)</h2>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-[#f0f9f3] border-2 border-dashed border-[#C8E0CD] rounded-xl text-center">
            <HiOutlineCloudArrowUp className="w-12 h-12 text-[#185325] mb-3" />
            <h3 className="text-sm font-bold text-gray-800 mb-1">Upload Data Petak Ukur (Excel/CSV)</h3>
            <p className="text-xs text-gray-500 max-w-md mb-4">Sistem akan otomatis menghitung Persentase Tumbuh dan Status Kelulusan (≥ 75%) berdasarkan data Excel.</p>
            <div className="flex gap-3">
               <button type="button" className="px-5 py-2.5 bg-white border border-[#185325] text-[#185325] text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">Unduh Template</button>
               <button type="button" className="px-5 py-2.5 bg-[#185325] text-white text-sm font-bold rounded-lg hover:bg-[#123d1c] transition-colors shadow-sm">Pilih File</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3.5 bg-white border border-gray-300 text-gray-600 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors">Batal</button>
          <button type="submit" className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-md shadow-[#185325]/20">Kirim Draf Laporan ke Kabid</button>
        </div>
      </form>
    </div>
  );
};

export default StaffCreateBAP;