import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineMapPin, HiOutlineCalendar, HiOutlineCheckCircle, HiCheckCircle, 
  HiOutlineXMark, HiOutlineEye, HiOutlineInformationCircle, 
  HiOutlinePhoto, HiOutlineDocumentText, HiOutlineUser, HiOutlineUsers, 
  HiOutlineBriefcase, HiCheck, HiOutlineArrowLeft 
} from 'react-icons/hi2';
import { MOCK_PU_LIST, MOCK_TANAMAN } from '../data/mockData';

export default function ViewMenungguVerifikasi() {
  const navigate = useNavigate();
  const [selectedPU, setSelectedPU] = useState<string | null>('PU-03');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      
      <InformasiProgramUtama />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RingkasanProgres />
        <PetaSebaranPU />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7">
          <TabelDaftarPU selectedPU={selectedPU} onSelectPU={setSelectedPU} />
        </div>
        <div className="xl:col-span-5 relative">
          <DetailPUCard selectedPU={selectedPU} onClose={() => setSelectedPU(null)} />
        </div>
      </div>

      <FormHasilPemeriksaan navigate={navigate} />

    </div>
  );
}

// --- SUB COMPONENTS ---

const InformasiProgramUtama = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-start">
    <div className="shrink-0 w-full md:w-48">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status Saat Ini</p>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-emerald-600 uppercase">Berjalan</h2>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <p className="text-xs font-medium text-emerald-700">Menunggu Pemeriksaan</p>
    </div>
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 w-full">
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineDocumentText className="w-4 h-4"/> <span className="text-xs font-bold">ID Program</span></div><p className="text-sm font-semibold text-gray-900">PRG-2026-0021</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineBriefcase className="w-4 h-4"/> <span className="text-xs font-bold">Program</span></div><p className="text-sm font-semibold text-gray-900">Rehabilitasi DAS Cimanuk</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineUsers className="w-4 h-4"/> <span className="text-xs font-bold">KTH</span></div><p className="text-sm font-semibold text-gray-900">KTH Mekar Jaya</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineUser className="w-4 h-4"/> <span className="text-xs font-bold">Penyuluh</span></div><p className="text-sm font-semibold text-gray-900">Rina Herlina, S.Hut.</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineMapPin className="w-4 h-4"/> <span className="text-xs font-bold">Lokasi</span></div><p className="text-sm font-semibold text-gray-900">Desa Mandalakasih,<br/>Kec. Pameungpeuk</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineCalendar className="w-4 h-4"/> <span className="text-xs font-bold">Periode Penanaman</span></div><p className="text-sm font-semibold text-gray-900">18 Juni - 03 Juli 2026</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineCheckCircle className="w-4 h-4"/> <span className="text-xs font-bold">Target PO</span></div><p className="text-sm font-semibold text-gray-900">500 tanaman</p></div>
      <div className="space-y-1"><div className="flex items-center gap-1.5 text-gray-500"><HiOutlineInformationCircle className="w-4 h-4"/> <span className="text-xs font-bold">Total PU</span></div><p className="text-sm font-semibold text-gray-900">10 PU</p></div>
    </div>
  </div>
);

const RingkasanProgres = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
    <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-base font-bold text-gray-900">Ringkasan Progres Pelaksanaan PO</h3></div>
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-emerald-100 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1"><HiOutlineCheckCircle className="w-3.5 h-3.5"/> Target</p><p className="text-2xl font-bold text-emerald-600 my-1">500</p></div>
        <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Realisasi</p><p className="text-2xl font-bold text-blue-600 my-1">500</p></div>
        <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Selisih</p><p className="text-2xl font-bold text-gray-800 my-1">0</p></div>
        <div className="border border-gray-200 rounded-lg p-3 text-center bg-white shadow-sm"><p className="text-[10px] font-bold text-gray-500 uppercase">Capaian</p><p className="text-2xl font-bold text-emerald-600 my-1 border-b-4 border-emerald-500 inline-block">100%</p></div>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlineCheckCircle className="w-3 h-3 text-emerald-500"/> Selesai</p><p className="text-sm font-bold text-gray-900">10 / 10</p><p className="text-[9px] text-gray-400">PU</p></div>
        <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 mb-1">Belum Selesai</p><p className="text-sm font-bold text-gray-900">0 / 10</p><p className="text-[9px] text-gray-400">PU</p></div>
        <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlinePhoto className="w-3 h-3"/> Foto</p><p className="text-sm font-bold text-gray-900">500 / 500</p></div>
        <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 flex items-center justify-center gap-1 mb-1"><HiOutlineMapPin className="w-3 h-3"/> Koordinat</p><p className="text-sm font-bold text-gray-900">500 / 500</p></div>
        <div className="border border-gray-200 rounded-lg p-2.5 text-center"><p className="text-[9px] font-bold text-gray-400 mb-1">Dokumentasi</p><p className="text-sm font-bold text-gray-900">8 / 8</p></div>
      </div>
      <div>
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs"><HiCheckCircle className="w-4 h-4"/> Kelengkapan Data</div>
          <span className="text-xs font-bold text-emerald-700">100%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div></div>
      </div>
    </div>
  </div>
);

const PetaSebaranPU = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
    <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between">
      <h3 className="text-base font-bold text-gray-900">Peta Sebaran PU</h3>
      <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div> Sesuai</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div> Perlu Perhatian</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Belum Sesuai</span>
      </div>
    </div>
    <div className="p-4 flex-1 relative">
      <div className="w-full h-full min-h-65 rounded-lg bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center border border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 justify-center w-64">
           <div className="w-16 h-16 bg-emerald-500/40 border border-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">PU-01</div>
           <div className="w-16 h-16 bg-emerald-500/40 border border-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">PU-02</div>
           <div className="w-20 h-20 bg-yellow-400/60 border-2 border-yellow-400 flex items-center justify-center text-yellow-900 font-bold text-[10px] transform rotate-3">PU-03</div>
        </div>
        <span className="absolute bottom-4 left-4 text-white font-bold drop-shadow-md text-sm">Google Map</span>
      </div>
    </div>
  </div>
);

const TabelDaftarPU = ({ selectedPU, onSelectPU }: { selectedPU: string | null, onSelectPU: (pu: string) => void }) => {
  const getStatusBadge = (status: string) => {
    if (status === 'Sesuai') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'Perlu Perhatian') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (status === 'Belum Sesuai') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="text-base font-bold text-gray-900">Daftar PU & Rekap Realisasi</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-[11px] text-gray-900 font-bold border-b border-gray-100 bg-white">
            <tr>
              <th className="px-4 py-3 text-center">No.</th>
              <th className="px-4 py-3">Kode PU</th>
              <th className="px-4 py-3 text-center">Luas (Ha)</th>
              <th className="px-4 py-3 text-center">Target</th>
              <th className="px-4 py-3 text-center">Realisasi</th>
              <th className="px-4 py-3 text-center">Selisih</th>
              <th className="px-4 py-3 text-center">Status PU</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_PU_LIST.map((row) => (
              <tr key={row.no} onClick={() => onSelectPU(row.kode)} className={`transition-colors cursor-pointer ${selectedPU === row.kode ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-4 text-center text-xs">{row.no}</td>
                <td className="px-4 py-4 font-semibold text-gray-900 text-xs">{row.kode}</td>
                <td className="px-4 py-4 text-center font-medium text-xs">{row.luas}</td>
                <td className="px-4 py-4 text-center text-xs">{row.target}</td>
                <td className="px-4 py-4 text-center text-xs">{row.realisasi}</td>
                <td className={`px-4 py-4 text-center font-bold text-xs ${row.selisih.toString().includes('+') ? 'text-emerald-600' : row.selisih.toString().includes('-') ? 'text-red-600' : 'text-gray-600'}`}>{row.selisih}</td>
                <td className="px-4 py-4 text-center"><span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadge(row.status)}`}>{row.status}</span></td>
                <td className="px-4 py-4 text-center"><button className="p-1.5 text-gray-400 hover:text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors shadow-sm"><HiOutlineEye className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetailPUCard = ({ selectedPU, onClose }: { selectedPU: string | null, onClose: () => void }) => {
  const [activeTabPU, setActiveTabPU] = useState('Data Tanaman (52)');

  if (!selectedPU) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center text-gray-400 text-sm p-10 text-center min-h-100">Pilih PU pada tabel untuk melihat detail</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full max-h-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3"><h3 className="text-base font-bold text-gray-900">Detail {selectedPU}</h3><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Sesuai</span></div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><HiOutlineXMark className="w-5 h-5"/></button>
      </div>
      <div className="p-5 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Luas (Ha)</p><p className="text-lg font-bold text-gray-900 mt-1">0,55</p></div>
          <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Target</p><p className="text-lg font-bold text-gray-900 mt-1">50</p></div>
          <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Realisasi</p><p className="text-lg font-bold text-gray-900 mt-1">52</p></div>
          <div className="border border-gray-100 rounded-lg p-3 text-center"><p className="text-[10px] font-bold text-gray-500">Selisih</p><p className="text-lg font-bold text-emerald-600 mt-1">+2</p></div>
        </div>
        <div className="flex border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
          {['Data Tanaman (52)', 'Dokumentasi', 'Informasi PU'].map(tab => (
            <button key={tab} onClick={() => setActiveTabPU(tab)} className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${activeTabPU === tab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
        {activeTabPU === 'Data Tanaman (52)' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h4 className="text-sm font-bold text-gray-900">Data Tanaman</h4></div>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-white text-[10px] text-gray-500 font-bold border-b border-gray-100">
                  <tr><th className="p-3 text-center w-8">No.</th><th className="p-3">Jenis Tanaman</th><th className="p-3 text-center">Tinggi</th><th className="p-3 text-center">Kondisi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_TANAMAN.map(tanaman => (
                    <tr key={tanaman.no} className="hover:bg-gray-50">
                      <td className="p-3 text-center">{tanaman.no}</td>
                      <td className="p-3 font-medium text-gray-900">{tanaman.jenis}</td>
                      <td className="p-3 text-center">{tanaman.tinggi} cm</td>
                      <td className="p-3 text-center"><span className="font-bold text-emerald-600 text-[10px]">{tanaman.kondisi}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormHasilPemeriksaan = ({ navigate }: { navigate: any }) => {
  const [statusPemeriksaan, setStatusPemeriksaan] = useState<'sesuai' | 'perbaikan'>('sesuai');
  const [catatan, setCatatan] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Hasil Pemeriksaan Staff PDAS</h3>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
        <div className="md:col-span-3 space-y-4">
          <label className="block text-xs font-bold text-gray-900 mb-2">Status Pemeriksaan <span className="text-red-500">*</span></label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="radio" name="status" className="w-5 h-5 accent-emerald-600 cursor-pointer" checked={statusPemeriksaan === 'sesuai'} onChange={() => setStatusPemeriksaan('sesuai')}/>
            <div><p className="text-sm font-bold text-gray-900">Sesuai / Dapat Disetujui</p><p className="text-xs text-gray-500">Realisasi sesuai target dan data lengkap.</p></div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group mt-4">
            <input type="radio" name="status" className="w-5 h-5 accent-emerald-600 cursor-pointer" checked={statusPemeriksaan === 'perbaikan'} onChange={() => setStatusPemeriksaan('perbaikan')}/>
            <div><p className="text-sm font-bold text-gray-900">Perlu Perbaikan</p><p className="text-xs text-gray-500">Masih terdapat kekurangan data.</p></div>
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-900 mb-2">Catatan Pemeriksaan</label>
          <textarea rows={4} value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tulis catatan..." className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 resize-none text-gray-700"></textarea>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-900 mb-3">Checklist Verifikasi</label>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><HiCheck className="w-3 h-3 text-white stroke-3"/></div><span className="text-[11px] font-bold text-gray-700">Seluruh PU terbentuk</span></div>
            <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><HiCheck className="w-3 h-3 text-white stroke-3"/></div><span className="text-[11px] font-bold text-gray-700">Realisasi tanaman sesuai</span></div>
          </div>
        </div>
        <div className="md:col-span-3 h-full">
          <div className="h-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-gray-500 mb-2">Data siap disetujui sebagai</p>
            <h3 className="text-xl font-bold text-emerald-700 mb-4">P0 SELESAI</h3>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-emerald-100 shadow-sm"><HiCheck className="w-6 h-6 text-emerald-300 stroke-3" /></div>
          </div>
        </div>
      </div>
      <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><HiOutlineArrowLeft className="w-4 h-4"/> Kembali</button>
        <button className="px-6 py-2.5 bg-[#1F7A4D] hover:bg-emerald-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><HiCheck className="w-4 h-4 stroke-3"/> Setujui & Selesaikan PO</button>
      </div>
    </div>
  );
};