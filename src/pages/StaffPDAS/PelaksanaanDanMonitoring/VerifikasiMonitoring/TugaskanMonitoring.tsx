import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft,
  HiOutlineDocument,
  HiOutlinePaperAirplane,
  HiEllipsisVertical,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlineCloudArrowUp,
  HiOutlineInformationCircle,
  HiOutlineTrash
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';
import { getPenugasanByIdAPI, storeMonitoringAPI } from '../../../../services/penugasan.service';

const TugaskanMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock state untuk file uploader
  const [uploadedFile, ] = useState<{ name: string; size: string } | null>({
    name: 'Surat_Tugas_Monitoring_P2.pdf',
    size: '1.2 MB'
  });

  const [programData, setProgramData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    periode_monitoring: 'P2',
    tanggal_penugasan: '2026-05-10',
    batas_waktu: '2026-05-27',
    metode: 'Monitoring Lapangan',
    prioritas: 'Tinggi',
    tujuan: 'Memantau pertumbuhan tanaman mangrove, persentase tanaman hidup, jumlah tanaman mati, serta mengidentifikasi kebutuhan tindak lanjut agar target rehabilitasi tercapai.',
    arahan: '1. Verifikasi kondisi tanaman hidup dan tanaman mati pada seluruh titik sampling yang ditentukan.\n2. Dokumentasikan kondisi lapangan dengan foto sebelum dan sesudah kegiatan monitoring.\n3. Pastikan titik geotag sesuai dengan data koordinat yang telah ditetapkan.\n4. Laporkan hasil monitoring melalui sistem SIGAP JABAR sesuai format yang telah ditentukan.'
  });

  React.useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const res = await getPenugasanByIdAPI(id);
        const penugasan = res.data;
        const source = penugasan.penugasanable;
        
        let pName = '-';
        let pKth = '-';
        let pLuas = '-';
        let pLokasi = '-';
        let pSumberDana = '-';

        const zone = source.analysis_result_zone || source.analysisResultZone;
        const zoneLokasi = zone && (zone.desa || zone.kecamatan || zone.kabupaten) ? [zone.desa, zone.kecamatan, zone.kabupaten].filter(Boolean).join(', ') : '-';
        const zoneLuas = zone?.luas_ha ? `${zone.luas_ha} Ha` : '-';
        const zoneKth = zone?.nama_kelompok || '-';
        
        const kthObj = source?.kth || penugasan.penyuluh?.kth;
        const kthLokasi = kthObj && kthObj.desa_kelurahan ? [kthObj.desa_kelurahan, kthObj.kabupaten_kota].filter(Boolean).join(', ') : '-';

        if (penugasan.penugasanable_type === 'App\\Models\\DonationProgram') {
          pName = source.name || source.nama_program || '-';
          pKth = kthObj?.name || kthObj?.nama || (zoneKth !== '-' ? zoneKth : '-');
          pLuas = zoneLuas !== '-' ? zoneLuas : (source.target_luas_lahan ? `${source.target_luas_lahan} Ha` : '-');
          pLokasi = source.location || source.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
          pSumberDana = 'Donasi';
        } else if (penugasan.penugasanable_type === 'App\\Models\\ProgramApbd' || penugasan.penugasanable_type === 'App\\Models\\ProgramCsr') {
          pName = source.nama_program || source.name || '-';
          pKth = kthObj?.nama || kthObj?.name || (zoneKth !== '-' ? zoneKth : '-');
          pLuas = zoneLuas !== '-' ? zoneLuas : (source.target_luas_lahan ? `${source.target_luas_lahan} Ha` : '-');
          pLokasi = source.lokasi || source.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
          pSumberDana = penugasan.penugasanable_type.includes('Apbd') ? 'APBD' : 'CSR';
        }

        setProgramData({
          id: penugasan.id,
          sourceId: id,
          programName: pName,
          kth: pKth,
          luas: pLuas,
          lokasi: pLokasi,
          sumberDana: pSumberDana,
          penyuluh: penugasan.penyuluh?.username || penugasan.penyuluh?.name || penugasan.penyuluh?.nama_pengguna || '-',
          tanggal_penugasan: penugasan.tanggal_penugasan,
          jenis_kegiatan: penugasan.jenis_kegiatan,
        });
      } catch (error) {
        console.error("Gagal mengambil data detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await storeMonitoringAPI(id, form);
      alert('Berhasil menugaskan monitoring!');
      navigate('/admin/staff/monitoring/monitoring-program');
    } catch (error) {
      console.error(error);
      alert('Gagal menugaskan monitoring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tugaskan Monitoring</h1>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-800">{programData?.programName || 'Rehabilitasi Mangrove Karangsong'}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Tugaskan
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <HiOutlineDocument className="w-4 h-4" /> Simpan Draft
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-[#008A4B] text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-sm">
              <HiOutlinePaperAirplane className="w-4 h-4" /> {isSubmitting ? 'Mengirim...' : 'Kirim Penugasan'}
            </button>
            <button className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <HiEllipsisVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KARTU INFO PROGRAM */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <PiPlant className="w-7 h-7 text-[#008A4B]" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 w-full">
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">ID Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sourceId || 'PRG-2026-0007'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Sumber Dana</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.sumberDana || 'APBD'}</span>
              </div>
              
              {/* Kolom Peta, dipindah ke kanan pada layout lg, tapi masuk flow grid di mobile */}
              <div className="row-span-4 hidden md:block lg:hidden">
                 <div className="w-full h-full min-h-25 bg-slate-100 rounded-lg relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')] bg-cover bg-center border border-slate-200">
                    <HiOutlineMapPin className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
                    <div className="absolute bottom-2 left-2">
                      <button className="text-[10px] font-bold text-blue-600 bg-white/90 px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        Lihat di Peta <HiOutlineMapPin className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Jenis Program</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">Rehabilitasi Mangrove</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Periode Aktif</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">P2</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Lokasi</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.lokasi || 'Desa Karangsong, Kec. Indramayu'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Jadwal Monitoring</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">10 Mei – 27 Mei 2026</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Luas Area</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.luas || '4,2 Ha'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Target Monitoring</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">Monitoring tahap kedua</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">KTH</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.kth || 'KTH Karangsong Lestari'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr] items-start text-xs">
                <span className="text-slate-500 font-medium">Penyuluh Saat Ini</span><span className="text-slate-500">:</span><span className="text-slate-900 font-semibold">{programData?.penyuluh || 'Ahmad Fauzi'}</span>
              </div>
            </div>

            <div className="w-full md:hidden lg:block lg:w-64 h-28 shrink-0 bg-slate-100 rounded-lg relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')] bg-cover bg-center border border-slate-200">
              <HiOutlineMapPin className="w-7 h-7 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
              <div className="absolute bottom-2 left-2">
                <button className="text-[11px] font-bold text-blue-600 bg-white/90 px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  Lihat di Peta <HiOutlineMapPin className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Form Penugasan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-5">Penugasan Monitoring</h3>
              
              <div className="space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Periode Monitoring <span className="text-red-500">*</span></label>
                    <select 
                      value={form.periode_monitoring}
                      onChange={(e) => setForm({...form, periode_monitoring: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B] appearance-none"
                    >
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Penugasan <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={form.tanggal_penugasan}
                        onChange={(e) => setForm({...form, tanggal_penugasan: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B]" 
                      />
                      <HiOutlineCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Batas Monitoring <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={form.batas_waktu}
                        onChange={(e) => setForm({...form, batas_waktu: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B]" 
                      />
                      <HiOutlineCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Penyuluh Penanggung Jawab <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" value={programData?.penyuluh || 'Ahmad Fauzi'} readOnly className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 focus:outline-none" />
                      <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="mt-1.5 text-[10px] text-[#008A4B] font-medium flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-3 h-3" /> Penyuluh tetap sama dengan pelaksanaan sebelumnya.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">KTH Pelaksana <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" value={programData?.kth || 'KTH Karangsong Lestari'} readOnly className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 focus:outline-none" />
                      <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="mt-1.5 text-[10px] text-[#008A4B] font-medium flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-3 h-3" /> KTH tetap sama dengan pelaksanaan sebelumnya.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Metode Monitoring <span className="text-red-500">*</span></label>
                    <select 
                      value={form.metode}
                      onChange={(e) => setForm({...form, metode: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B] appearance-none"
                    >
                      <option value="Monitoring Lapangan">Monitoring Lapangan</option>
                      <option value="Monitoring Jarak Jauh">Monitoring Jarak Jauh</option>
                    </select>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Prioritas <span className="text-red-500">*</span></label>
                    <select 
                      value={form.prioritas}
                      onChange={(e) => setForm({...form, prioritas: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B] appearance-none"
                    >
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tujuan Monitoring <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={2} 
                      value={form.tujuan}
                      onChange={(e) => setForm({...form, tujuan: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B] resize-none text-slate-600"
                    ></textarea>
                  </div>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Arahan Monitoring <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={4} 
                    value={form.arahan}
                    onChange={(e) => setForm({...form, arahan: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#008A4B] focus:ring-1 focus:ring-[#008A4B] resize-none text-slate-600"
                  ></textarea>
                </div>

                {/* Row 5: Lampiran */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lampiran (Opsional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-22.5">
                      <div className="flex items-center gap-3">
                         <HiOutlineCloudArrowUp className="w-8 h-8 text-slate-500" />
                         <div className="text-left">
                           <p className="text-xs font-medium text-slate-700">Drag & drop file di sini atau klik untuk unggah</p>
                           <p className="text-[10px] text-slate-500">PDF, JPG, PNG (Maks. 5MB)</p>
                         </div>
                      </div>
                    </div>
                    
                    {/* Mock Uploaded File */}
                    {uploadedFile && (
                      <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between min-h-22.5 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-lg font-bold text-[10px]">
                            PDF
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{uploadedFile.name}</p>
                            <p className="text-[10px] text-slate-500">{uploadedFile.size}</p>
                          </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat Penugasan Sebelumnya */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Riwayat Penugasan Sebelumnya</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-5">Periode</th>
                      <th className="py-3 px-5">Tanggal Monitoring</th>
                      <th className="py-3 px-5">Penyuluh</th>
                      <th className="py-3 px-5">KTH Pelaksana</th>
                      <th className="py-3 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-5 font-medium text-slate-900">P1</td>
                      <td className="py-3 px-5 text-slate-600">27 Mei 2026</td>
                      <td className="py-3 px-5 text-slate-600">Ahmad Fauzi</td>
                      <td className="py-3 px-5 text-slate-600">KTH Karangsong Lestari</td>
                      <td className="py-3 px-5"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Selesai</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5 font-medium text-slate-900">P0</td>
                      <td className="py-3 px-5 text-slate-600">10 Maret 2026</td>
                      <td className="py-3 px-5 text-slate-600">Ahmad Fauzi</td>
                      <td className="py-3 px-5 text-slate-600">KTH Karangsong Lestari</td>
                      <td className="py-3 px-5"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Selesai</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Ringkasan Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Ringkasan Penugasan</h3>
              </div>
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Status Saat Ini</span><span>:</span>
                  <span className="font-bold text-[#008A4B]">Siap Ditugaskan</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Periode</span><span>:</span>
                  <span className="font-semibold text-slate-900">{form.periode_monitoring || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">KTH</span><span>:</span>
                  <span className="font-semibold text-slate-900">{programData?.kth || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Penyuluh</span><span>:</span>
                  <span className="font-semibold text-slate-900">{programData?.penyuluh || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Kabupaten</span><span>:</span>
                  <span className="font-semibold text-slate-900">{programData?.lokasi ? programData.lokasi.split(',').pop()?.trim() : '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Luas Area</span><span>:</span>
                  <span className="font-semibold text-slate-900">{programData?.luasArea || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-slate-500 font-medium">Tanggal Monitoring</span><span>:</span>
                  <span className="font-semibold text-slate-900">
                    {form.tanggal_penugasan && form.batas_waktu 
                      ? `${new Date(form.tanggal_penugasan).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})} - ${new Date(form.batas_waktu).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}`
                      : '-'}
                  </span>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Catatan Sistem</h4>
                  <div className="p-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50/50">
                    KTH dan penyuluh tetap sama dengan pelaksanaan sebelumnya.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F0FDF4] p-4 flex gap-3 border border-[#BBF7D0] rounded-xl">
              <HiOutlineInformationCircle className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
              <p className="text-xs text-[#166534] leading-relaxed">
                Setelah penugasan disimpan dan dikirim, penugasan monitoring akan dikirimkan kepada Penyuluh dan KTH terkait melalui sistem dan notifikasi.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TugaskanMonitoring;