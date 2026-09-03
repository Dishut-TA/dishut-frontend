import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';
import MilestoneSectionKTH from './components/MilestoneSectionKTH';

const DetailInvestasiKTH: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isKonfirmasiMode = location.pathname.includes('/konfirmasi');

  const programFromState = location.state?.program;

  const getStoredKthName = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed.name || parsed.nama || parsed.nama_pengguna || 'KTH Cikole Lestari';
      }
      return localStorage.getItem('nama_pengguna') || 'KTH Cikole Lestari';
    } catch (e) {
      return localStorage.getItem('nama_pengguna') || 'KTH Cikole Lestari';
    }
  };

  const docLabels = [
    'Dokumen Perjanjian Investasi',
    'Dokumen Rencana Bisnis',
    'Template Perjanjian Investor'
  ];

  const projectData = {
    title: programFromState?.nama_program || 'Proyek Pembangunan Ekowisata Kebun Stroberi',
    kth: getStoredKthName(),
    targetFunding: programFromState ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(programFromState.target_dana) : 'Rp. 100.000.000',
    persentase: programFromState ? `${programFromState.persentase_keuntungan}%` : '40%',
    tenggatWaktu: programFromState ? new Date(programFromState.batas_waktu_pengumpulan).toLocaleDateString('id-ID') : '20 Agustus 2024',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    deskripsiUmum: programFromState?.deskripsi || 'Lorem ipsum dolor sit amet consectetur. Faucibus faucibus urna nulla amet at nascetur...',
    pembagianKeuntungan: {
      kth: programFromState ? `${programFromState.persentase_keuntungan}%` : '60%',
      investor: programFromState ? `${100 - programFromState.persentase_keuntungan}%` : '40%'
    },
    milestones: programFromState?.milestones?.map((m: any, i: number) => ({
      id: i + 1,
      nama: m.judul_milestone,
      batas: m.target_tanggal,
      status: m.status === 'COMPLETED' ? 'Tercapai' : 'Belum Dimulai',
      dokumen: '-',
      deskripsi: m.deskripsi
    })) || [
      { id: 1, nama: 'Milestone 1', batas: '22/04/2024', status: 'Tercapai' as const, dokumen: 'RencanaProyek.pdf', deskripsi: 'Tahap awal...' }
    ],
    dokumen: programFromState?.dokumens?.map((d: any, idx: number) => ({
    label: docLabels[idx] || 'Dokumen Pendukung',
    file: d.file_url ? d.file_url.split('/').pop() : 'Dokumen.pdf'
  })) || [
    { label: 'Dokumen Perjanjian Investasi', file: 'PerjanjianInvestor.pdf' }
  ]
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline self-start cursor-pointer">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        {isKonfirmasiMode ? 'Konfirmasi Pembuatan Investasi Baru' : 'Detail Data Investasi'}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img src={projectData.image} alt="Project" className="w-full md:w-64 h-40 object-cover rounded-xl shadow-sm border border-gray-200" />
        <div className="flex flex-col justify-center gap-2 text-sm">
          <h2 className="text-xl font-bold text-gray-800">{projectData.title}</h2>
          <div className="grid grid-cols-[160px_auto] gap-y-2 mt-2 font-medium">
            <span className="text-gray-500">Nama KTH</span>
            <span className="text-[#185325] font-bold">: {projectData.kth}</span>
            <span className="text-gray-500">Target Funding</span>
            <span className="text-[#185325] font-bold">: {projectData.targetFunding}</span>
            <span className="text-gray-500">Persentase Keuntungan</span>
            <span className="text-gray-800">: {projectData.persentase}</span>
            <span className="text-gray-500">Tenggat Waktu</span>
            <span className="text-orange-500">: {projectData.tenggatWaktu}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-justify leading-relaxed mb-8 bg-gray-50 p-4 rounded-xl">
        {projectData.deskripsiUmum}
      </p>

      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-2">Pembagian Keuntungan</h3>
        <div className="text-sm font-bold text-gray-800 space-y-2 bg-gray-50 p-4 rounded-xl">
          <div className="flex"><span className="w-28 text-gray-500 font-medium">KTH</span> <span>: {projectData.pembagianKeuntungan.kth}</span></div>
          <div className="flex"><span className="w-28 text-gray-500 font-medium">Investor</span> <span>: {projectData.pembagianKeuntungan.investor}</span></div>
        </div>
      </div>

      <MilestoneSectionKTH milestones={projectData.milestones} />

      <div className="mb-12">
        <h3 className="font-bold text-gray-800 mb-4">Dokumen Pendukung</h3>
        <div className="text-sm space-y-3">
          {projectData.dokumen.map((doc: any, idx: number) => (
            <div key={idx} className="flex">
              <span className="w-56 shrink-0 text-gray-500">{doc.label}</span>
              <span className="w-4 shrink-0">:</span>
              <span className="font-bold underline text-gray-800 cursor-pointer hover:text-[#185325]">
                {doc.file}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isKonfirmasiMode && (
        <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8 mt-8">
          <button className="flex-1 py-3.5 bg-[#FF0000] hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-sm cursor-pointer">
            Tolak dan Revisi
          </button>
          <button className="flex-1 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full transition-colors shadow-sm cursor-pointer">
            Setujui Investasi Baru
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailInvestasiKTH;