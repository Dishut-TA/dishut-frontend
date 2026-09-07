import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiChevronRight,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import { PiPlant, PiFileText } from 'react-icons/pi';
import useDetailPenugasan from '@/hooks/useDetailPenugasan';
import StatusMuat from '@/components/StatusMuat';
import PetaPetakUkur from '@/components/maps/PetaPetakUkur';

const STORAGE_BASE_URL = 'http://127.0.0.1:8000/storage/';

const tanggalId = (nilai?: string | null) => {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const angkaId = (nilai?: number | null) =>
  nilai === null || nilai === undefined ? '-' : Number(nilai).toLocaleString('id-ID');

const DetailPelaporanDonasi: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useDetailPenugasan(id);

  const sumber = data?.raw?.penugasanable ?? {};
  const targetBibit = Number(sumber.target_amount ?? sumber.total_seeds_collected ?? data?.stats.targetTanam ?? 0);
  const bibitDitanam = Number(sumber.total_seeds_realized ?? data?.stats.tanamanHidup ?? 0);
  const persentase = targetBibit > 0 ? (bibitDitanam / targetBibit) * 100 : 0;
  const statusCapaian = persentase >= 100 ? 'Tercapai' : persentase >= 90 ? 'Hampir Tercapai' : 'Belum Tercapai';
  const foto = (data?.dokumentasiProgram?.length ? data.dokumentasiProgram : data?.dokumentasiList) ?? [];

  // HELPER COMPONENTS
  const DataRow = ({ label, value, isBold = false }: { label: string; value: string, isBold?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-2.75 sm:text-xs">
      <div className="flex items-center justify-between sm:w-22.5 md:w-27.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className={`font-bold text-gray-800 wrap-break-words flex-1 min-w-0 ${isBold ? 'text-gray-900' : ''}`}>{value}</span>
    </div>
  );

  return (
    <StatusMuat
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Memuat data laporan donasi..."
      emptyText="Data laporan donasi tidak ditemukan."
    >
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-28 animate-in fade-in duration-300">
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Buat Laporan Realisasi Program Donasi
            </h1>
            <span className="px-2.5 py-1 text-[10px] font-bold border rounded-full flex items-center gap-1 bg-[#EBF8F1] text-[#185325] border-[#C6EBD6]">
              <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Siap Dilaporkan
            </span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm bg-white flex items-center gap-2 transition-colors"><PiFileText className="w-4 h-4"/> Simpan Draft</button>
            <button className="px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"><HiOutlineMapPin className="w-4 h-4 rotate-45"/> Pelaksanaan Selesai</button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1 font-medium">Laporan dibuat berdasarkan data realisasi penanaman bibit program donasi secara otomatis.</p>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full min-w-0">
        
        {/* ================= KOLOM KIRI (KONTEN UTAMA) ================= */}
        <div className="w-full xl:w-[calc(100%-360px)] flex flex-col gap-6 min-w-0">
          
          {/* Card A: Informasi Program Donasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start min-w-0">
              <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0 w-full">
                <div className="w-12 h-12 rounded-full bg-[#EBF8F1] text-[#185325] flex items-center justify-center shrink-0"><PiPlant className="w-6 h-6" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 min-w-0">
                  <div className="col-span-1 md:col-span-2 text-sm font-bold text-gray-800 mb-1">Informasi Program Donasi</div>
                  <div className="space-y-3">
                    <DataRow label="ID Program" value={String(data?.id ?? '-')} />
                    <DataRow label="Nama Program" value={data?.programName || '-'} />
                    <DataRow label="Donatur" value={sumber.donor?.name || sumber.donatur || '-'} />
                    <DataRow label="Nilai Donasi" value={sumber.total_donation ? `Rp ${angkaId(Number(sumber.total_donation))}` : '-'} />
                  </div>
                  <div className="space-y-3">
                    <DataRow label="Tanggal Donasi" value={tanggalId(sumber.created_at)} />
                    <DataRow label="Lokasi" value={data?.lokasi || '-'} />
                    <DataRow label="Target Bibit" value={`${angkaId(targetBibit)} Pohon`} />
                    <DataRow label="Penyuluh" value={data?.penyuluh || '-'} />
                    <DataRow label="KTH Pelaksana" value={data?.kth || '-'} />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-55 h-40 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                <PetaPetakUkur petakUkurs={data?.petakUkurs} emptyMessage="Batas petak ukur belum digambar." />
              </div>
            </div>
          </div>

          {/* Card B: Ringkasan Realisasi Donasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h2 className="text-sm font-bold text-gray-800 mb-5">Ringkasan Realisasi Donasi</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PiPlant className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Target Bibit</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">{angkaId(targetBibit)}</p><p className="text-xs text-gray-500 font-medium mt-1">Pohon</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PiPlant className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Bibit Ditanam</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">{angkaId(bibitDitanam)}</p><p className="text-xs text-gray-500 font-medium mt-1">Pohon</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><HiOutlineCheckCircle className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Persentase Realisasi</span></div>
                <div><p className="text-3xl font-bold text-gray-800 leading-none">{persentase.toFixed(1).replace('.', ',')}%</p><p className="text-xs text-gray-500 font-medium mt-1">({angkaId(bibitDitanam)} / {angkaId(targetBibit)})</p></div>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><HiOutlineCheckCircle className="w-4 h-4"/></div><span className="text-[10px] font-bold text-gray-600">Status Capaian</span></div>
                <div><p className="text-xl font-bold text-gray-800 leading-none mt-2">{statusCapaian}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-center">
            <HiOutlineInformationCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs font-bold text-blue-800">Bagian ini diisi oleh Staff PDAS berdasarkan data realisasi penanaman yang tersedia.</p>
          </div>

          {/* Textareas Layout (Gambar 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Ringkasan Pelaksanaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea rows={8} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 leading-relaxed bg-white" placeholder="Jelaskan secara singkat pelaksanaan penanaman bibit dan capaian utamanya..."></textarea>
                <span className="absolute bottom-3 left-4 text-[9px] font-bold text-gray-400">0 / 1000 karakter</span>
                <div className="absolute bottom-3 right-3 text-gray-300 rotate-45 transform origin-center text-xs">⇲</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-800 block mb-1">Catatan Pelaksanaan <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                <div className="w-1/3 flex flex-col gap-2 pt-2">
                  <p className="text-[10px] font-bold text-gray-600 mb-1">Kendala yang Dihadapi</p>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 rounded accent-emerald-600 border-gray-300"/><span className="text-[10px] font-medium text-gray-600">Cuaca</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 rounded accent-emerald-600 border-gray-300"/><span className="text-[10px] font-medium text-gray-600">Distribusi Bibit</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 rounded accent-emerald-600 border-gray-300"/><span className="text-[10px] font-medium text-gray-600">Akses Lokasi</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 rounded accent-emerald-600 border-gray-300"/><span className="text-[10px] font-medium text-gray-600">Lainnya</span></label>
                </div>
                <div className="w-2/3 relative">
                  <textarea rows={7} className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 bg-white" placeholder="Tuliskan catatan atau kendala penting selama pelaksanaan penanaman..."></textarea>
                  <span className="absolute bottom-2 left-3 text-[9px] font-bold text-gray-400">0 / 1000 karakter</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Kesimpulan <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea rows={8} className="w-full text-xs p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-gray-600 leading-relaxed bg-white" placeholder="Tuliskan kesimpulan akhir berdasarkan realisasi penanaman dan pencapaian target..."></textarea>
                <span className="absolute bottom-3 left-4 text-[9px] font-bold text-gray-400">0 / 1000 karakter</span>
              </div>
            </div>
          </div>

          {/* Grid Bawah: Timeline, Realisasi, Dokumentasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-5">Timeline Pelaksanaan</h2>
              <div className="relative border-l-2 border-emerald-500 ml-3 space-y-4 pb-2 flex-1">
                <div className="relative pl-5"><div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div><div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-800">Persiapan Lokasi</h3><p className="text-[10px] text-gray-500 font-medium">05 Juni 2026</p></div></div>
                <div className="relative pl-5"><div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div><div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-800">Pengadaan Bibit</h3><p className="text-[10px] text-gray-500 font-medium">08 Juni 2026</p></div></div>
                <div className="relative pl-5"><div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div><div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-800">Distribusi Bibit</h3><p className="text-[10px] text-gray-500 font-medium">10 Juni 2026</p></div></div>
                <div className="relative pl-5"><div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div><div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-800">Penanaman</h3><p className="text-[10px] text-gray-500 font-medium">12 Juni 2026</p></div></div>
                <div className="relative pl-5"><div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div><div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-800">Serah Terima</h3><p className="text-[10px] text-gray-500 font-medium">14 Juni 2026</p></div></div>
              </div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline mt-4">Lihat detail timeline <HiChevronRight className="w-3 h-3"/></button>
            </div>

            {/* Realisasi Bibit Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Realisasi Bibit</h2>
              <table className="w-full text-left text-[10px] whitespace-nowrap mb-4 flex-1">
                <thead className="text-gray-500 font-bold border-b border-gray-100">
                  <tr><th className="py-2.5 pr-2">Kegiatan</th><th className="py-2.5 pr-2 text-center">Target</th><th className="py-2.5 pr-2 text-center">Realisasi</th><th className="py-2.5 text-center pr-2">Persentase</th><th className="py-2.5 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  <tr><td className="py-4 pr-2">Bibit</td><td className="py-4 pr-2 text-center">{angkaId(targetBibit)} Pohon</td><td className="py-4 pr-2 text-center">{angkaId(bibitDitanam)} Pohon</td><td className="py-4 pr-2 text-center">{persentase.toFixed(1).replace('.', ',')}%</td><td className="py-4 text-center text-emerald-600 font-bold">{data?.status || '-'}</td></tr>
                  <tr><td className="py-4 pr-2">Luas Area</td><td className="py-4 pr-2 text-center">{data?.luas || '-'}</td><td className="py-4 pr-2 text-center">{data?.luas || '-'}</td><td className="py-4 pr-2 text-center">-</td><td className="py-4 text-center text-emerald-600 font-bold">{data?.status || '-'}</td></tr>
                </tbody>
              </table>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">Lihat detail realisasi <HiChevronRight className="w-3 h-3"/></button>
            </div>

            {/* Dokumentasi Pelaksanaan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Dokumentasi Pelaksanaan</h2>
              <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                {foto.length === 0 ? (
                  <p className="col-span-2 text-[11px] text-gray-400 font-medium self-center text-center">
                    Belum ada dokumentasi lapangan yang diunggah penyuluh.
                  </p>
                ) : foto.slice(0, 4).map((doc: any, i: number) => (
                  <div key={doc.id ?? i} className="flex flex-col gap-1.5">
                    <div className="h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={`${STORAGE_BASE_URL}${doc.file_path}`} className="w-full h-full object-cover" alt={doc.jenis_dokumentasi || 'Dokumentasi'} />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium text-center truncate">{doc.jenis_dokumentasi || 'Dokumentasi'}</p>
                  </div>
                ))}
              </div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline self-start">Lihat semua dokumentasi <HiChevronRight className="w-3 h-3"/></button>
            </div>

          </div>
        </div>

        {/* ================= KOLOM KANAN (SIDEBAR STATUS) ================= */}
        <div className="w-full xl:w-90 flex flex-col shrink-0 min-w-0">
          
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6">Status Laporan</h2>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
              <div className="relative pl-6">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-emerald-500"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/></div>
                <div><h3 className="text-xs font-bold text-gray-800">Siap Dilaporkan</h3><p className="text-[10px] text-gray-500 mt-1">Data realisasi penanaman bibit telah lengkap dan siap dilaporkan.<br/>15 Jun 2026 14:20 WIB</p></div>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-orange-500"><div className="w-2 h-2 bg-orange-500 rounded-full"></div></div>
                <div><h3 className="text-xs font-bold text-gray-800">Draft Laporan Dibuat</h3><p className="text-[10px] text-gray-500 mt-1">Oleh Staff PDAS - Ahmad Fauzi<br/>15 Jun 2026 14:35 WIB</p></div>
              </div>
              <div className="relative pl-6 opacity-40">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200"></div>
                <div><h3 className="text-xs font-bold text-gray-800">Dikirim untuk Persetujuan</h3><p className="text-[10px] text-gray-500 mt-1">Menunggu persetujuan Kepala Bidang PDAS</p></div>
              </div>
              <div className="relative pl-6 opacity-40">
                <div className="absolute -left-2.75 top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200"></div>
                <div><h3 className="text-xs font-bold text-gray-800">Laporan Disahkan</h3><p className="text-[10px] text-gray-500 mt-1">Menunggu persetujuan Kepala Bidang PDAS</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Pemeriksaan Kelengkapan</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Program Donasi</span></div>
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Realisasi Bibit</span></div>
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Dokumentasi</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center"><div className="w-2 h-2 bg-orange-500 rounded-full"></div></div><span className="text-xs font-bold text-gray-800">Ringkasan Laporan</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-sm font-bold text-gray-800">Sumber Data Laporan</h2></div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Program Donasi</span></div>
              <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-emerald-500"/><span className="text-xs font-bold text-gray-700">Data Realisasi Pelaksanaan</span></div>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Data diambil otomatis dari sistem.</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-sm font-bold text-gray-800">Informasi Laporan</h2><HiOutlineInformationCircle className="w-4 h-4 text-gray-400"/></div>
            <div className="space-y-3 text-xs">
              <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Tanggal Dibuat</span><span className="font-bold text-gray-800">15 Jun 2026 14:35 WIB</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Terakhir Diubah</span><span className="font-bold text-gray-800">15 Jun 2026 14:35 WIB</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-gray-500 font-medium">Dibuat Oleh</span><span className="font-bold text-gray-800">Ahmad Fauzi<br/><span className="font-medium text-gray-500">Staff PDAS</span></span></div>
            </div>
          </div>

        </div>

      </div>
    </div>
    </StatusMuat>
  );
};

export default DetailPelaporanDonasi;