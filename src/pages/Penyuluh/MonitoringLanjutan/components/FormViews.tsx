import React from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { 
  HiOutlineMapPin, HiOutlineCamera, HiOutlineArrowLeft, HiOutlinePaperAirplane,
  HiOutlineInformationCircle, HiOutlineClock,
  HiOutlineCalendar, HiOutlineMagnifyingGlass, HiOutlineFunnel, HiChevronLeft, 
  HiChevronRight, HiOutlineEllipsisVertical, HiOutlineCheckCircle, HiOutlineXCircle
} from 'react-icons/hi2';
import { PiPlant, PiTree, PiLeaf } from 'react-icons/pi';
import type { ProgramData, MonitoringRow, ViewMode } from '../types';
import { MOCK_REKAP_DATA, MOCK_TABLE_DATA } from '../constants';

// =========================================================================
// 1. REKAP VIEW
// =========================================================================
interface RekapViewProps {
  activeId: string;
  activeProgram: ProgramData;
  isTindakLanjut: boolean;
  setViewMode: (mode: ViewMode) => void;
  navigate: NavigateFunction;
}

export const RekapView: React.FC<RekapViewProps> = ({
  activeId,
  activeProgram,
  isTindakLanjut,
  setViewMode,
  navigate
}) => {
  const isAllComplete = MOCK_REKAP_DATA.every(row => row.status === 'Lengkap');
  const MOCK_REKAP_PENYULAMAN = [
    { pu: 'PU-01', perlu: 5, sudah: 2, belum: 3, bibit: 35, status: 'Lengkap', update: '27 Mei 2026 10:30' },
    { pu: 'PU-03', perlu: 7, sudah: 1, belum: 6, bibit: 50, status: 'Lengkap', update: '27 Mei 2026 10:40' },
    { pu: 'PU-04', perlu: 6, sudah: 3, belum: 3, bibit: 35, status: 'Lengkap', update: '27 Mei 2026 10:45' }
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
          Review & Kirim Hasil {isTindakLanjut ? `Penyulaman ${activeProgram.periode}` : `Monitoring ${activeProgram.periode}`}
        </h1>
        <p className="text-sm text-slate-500">
          Berikut adalah hasil {isTindakLanjut ? 'tindak lanjut penyulaman' : `monitoring ${activeProgram.periode}`} yang telah Anda input, dikelompokkan per Petak Ukur (PU) sebelum dikirim.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">ID Program</p><p className="text-sm font-bold text-slate-900">{activeId}</p></div>
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">Nama Program</p><p className="text-sm font-bold text-slate-900">{activeProgram.nama}</p></div>
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">Sumber Dana</p><p className="text-sm font-bold text-slate-900">APBD</p></div>
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">Periode Monitoring</p><p className="text-sm font-bold text-slate-900">{isTindakLanjut ? `${activeProgram.periode} - Tindak Lanjut ${activeProgram.periode}` : `${activeProgram.periode} - Monitoring ${activeProgram.periode}`}</p></div>
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">Lokasi</p><p className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">{activeProgram.lokasi}</p></div>
          <div><p className="text-[10px] text-slate-500 font-medium mb-1">Penyuluh</p><p className="text-sm font-bold text-slate-900">Ahmad Fauzi</p></div>
          <div className="col-span-2 md:col-span-3"><p className="text-[10px] text-slate-500 font-medium mb-1">Tanggal Monitoring</p><p className="text-sm font-bold text-slate-900">27 Mei 2026</p></div>
        </div>
        <div className="w-full md:w-[320px] h-32 bg-slate-100 rounded-lg relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')] bg-cover bg-center border border-slate-200 shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-emerald-400 rounded-full border border-white shadow-md"></div>
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-emerald-400 rounded-full border border-white shadow-md"></div>
          <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-emerald-400 rounded-full border border-white shadow-md"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-[#0F172A] mb-4">Ringkasan {isTindakLanjut ? `Penyulaman ${activeProgram.periode}` : `Monitoring ${activeProgram.periode}`} (Per PU)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-2 md:mb-0"><HiOutlineMapPin className="w-5 h-5" /></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-500 font-semibold mb-0.5">Total PU</p><h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? '3' : '5'}</h3></div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-2 md:mb-0"><PiPlant className="w-5 h-5" /></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Total Titik Perlu Disulam' : 'Total Tanaman'}</p><h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? '18' : '2.530'}</h3></div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-2 md:mb-0"><PiLeaf className="w-5 h-5" /></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}</p><h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? '6' : '2.200'}</h3></div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mb-2 md:mb-0"><PiTree className="w-5 h-5" /></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Belum Disulam' : 'Mati'}</p><h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? '12' : '180'}</h3></div>
          </div>
          <div className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center flex-col md:flex-row md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mb-2 md:mb-0"><PiPlant className="w-5 h-5" /></div>
            <div className="text-center md:text-left"><p className="text-[10px] text-slate-500 font-semibold mb-0.5">{isTindakLanjut ? 'Total Bibit Sulam' : 'Perlu Perawatan'}</p><h3 className="text-xl font-bold text-slate-900">{isTindakLanjut ? '120' : '150'}</h3></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Rekap {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} per PU</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-center text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left">PU</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Titik Perlu Disulam' : 'Jumlah Tanaman'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Belum Disulam' : 'Mati'}</th>
                <th className="py-3 px-4">{isTindakLanjut ? 'Bibit Sulam' : 'Perlu Perawatan'}</th>
                {!isTindakLanjut && <th className="py-3 px-4">Foto</th>}
                <th className="py-3 px-4">Status Kelengkapan</th>
                <th className="py-3 px-4">Update Terakhir</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {(isTindakLanjut ? MOCK_REKAP_PENYULAMAN : MOCK_REKAP_DATA).map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-left font-bold text-slate-700">{row.pu}</td>
                  <td className="py-3 px-4 font-bold">{isTindakLanjut ? row.perlu : row.total}</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">{isTindakLanjut ? row.sudah : `${row.hidup} (${row.pctHidup}%)`}</td>
                  <td className="py-3 px-4 text-red-500 font-bold">{isTindakLanjut ? row.belum : `${row.mati} (${row.pctMati}%)`}</td>
                  <td className="py-3 px-4 text-orange-500 font-bold">{isTindakLanjut ? `${row.bibit} bibit` : `${row.rawat} (${row.pctRawat}%)`}</td>
                  {!isTindakLanjut && <td className="py-3 px-4 text-slate-600 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> {row.foto}</td>}
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded font-bold text-[10px]">{row.status}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{row.update}</td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => setViewMode('table')}
                      className="px-4 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded font-bold hover:bg-emerald-50 transition-colors text-xs cursor-pointer"
                    >
                      Tambah Data
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50/50 font-bold border-t-2 border-slate-200">
                <td className="py-4 px-4 text-left text-blue-700">Total</td>
                <td className="py-4 px-4 text-blue-700">{isTindakLanjut ? '18' : '2.530'}</td>
                <td className="py-4 px-4 text-emerald-600">{isTindakLanjut ? '6' : '2.200 (87%)'}</td>
                <td className="py-4 px-4 text-red-500">{isTindakLanjut ? '12' : '180 (7%)'}</td>
                <td className="py-4 px-4 text-orange-500">{isTindakLanjut ? '120 bibit' : '150 (6%)'}</td>
                {!isTindakLanjut && <td className="py-4 px-4 text-blue-700 flex items-center justify-center gap-1.5"><HiOutlineCamera className="w-4 h-4"/> 50</td>}
                <td className="py-4 px-4 text-slate-400">-</td>
                <td className="py-4 px-4 text-slate-400">-</td>
                <td className="py-4 px-4 text-slate-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-4 rounded-lg flex items-center gap-3 text-sm text-emerald-800 font-medium mb-8">
        <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        Klik "Tambah Data" pada baris PU yang ingin Anda lengkapi untuk membuka halaman Input Hasil {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}.
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-40 lg:ml-64 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer hover:bg-slate-50">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        <button 
          disabled={!isAllComplete} 
          onClick={() => navigate(-1)}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors ${isAllComplete ? 'bg-[#008A4B] text-white hover:bg-emerald-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45" /> Kirim Hasil {isTindakLanjut ? `Penyulaman ${activeProgram.periode}` : `Monitoring ${activeProgram.periode}`}
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 2. TABLE VIEW
// =========================================================================
interface TableViewProps {
  activeId: string;
  activeProgram: ProgramData;
  isTindakLanjut: boolean;
  handleBackToRekap: () => void;
  handleOpenForm: (mode: 'input' | 'edit', row: MonitoringRow) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  activeId,
  activeProgram,
  isTindakLanjut,
  handleBackToRekap,
  handleOpenForm
}) => {
  const MOCK_TITIK = [
    { id: '1', tk: 'PU-03-TK-001', koordinat: '6.342512° S, 108.323145° E', foto: true, tinggi: '-', status: 'Belum Disulam', tgl: '-' },
    { id: '2', tk: 'PU-03-TK-002', koordinat: '6.342845° S, 108.323582° E', foto: true, tinggi: '-', status: 'Belum Disulam', tgl: '-' },
    { id: '3', tk: 'PU-03-TK-003', koordinat: '6.343210° S, 108.323911° E', foto: true, tinggi: '-', status: 'Belum Disulam', tgl: '-' },
    { id: '4', tk: 'PU-03-TK-004', koordinat: '6.343678° S, 108.324301° E', foto: true, tinggi: '24 cm', status: 'Sudah Disulam', tgl: '27 Mei 2026' },
    { id: '5', tk: 'PU-03-TK-005', koordinat: '6.344125° S, 108.324782° E', foto: true, tinggi: '28 cm', status: 'Sudah Disulam', tgl: '27 Mei 2026' },
    { id: '6', tk: 'PU-03-TK-006', koordinat: '6.344598° S, 108.325112° E', foto: true, tinggi: '-', status: 'Belum Disulam', tgl: '-' },
    { id: '7', tk: 'PU-03-TK-007', koordinat: '6.344932° S, 108.325448° E', foto: true, tinggi: '22 cm', status: 'Sedang Disulam', tgl: '27 Mei 2026' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Tambah Data {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} PU 
            <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-md font-bold">PU-03</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lengkapi atau tambahkan data {isTindakLanjut ? 'hasil penyulaman' : 'monitoring tanaman'} untuk petak ukur (PU) yang dipilih sebelum dikirim.
          </p>
        </div>
        <button onClick={handleBackToRekap} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke Review & Kirim
        </button>
      </div>

      <div className="bg-[#f0f9f3] border border-[#DCECE0] p-3 rounded-lg flex items-center gap-3 text-sm text-emerald-800 mb-6 font-medium">
        <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        Anda sedang menambahkan data {isTindakLanjut ? 'penyulaman' : 'monitoring'} untuk PU-03.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PiPlant className="w-5 h-5 text-[#008A4B]" />
            Ringkasan Program
          </h3>
          <div className="grid grid-cols-[130px_10px_1fr] gap-y-2.5 text-xs flex-1 content-start">
            <div className="text-gray-500">ID Program</div><div>:</div><div className="font-semibold text-gray-900">{activeId}</div>
            <div className="text-gray-500">Nama Program</div><div>:</div><div className="font-semibold text-gray-900">{activeProgram.nama}</div>
            <div className="text-gray-500">Periode Monitoring</div><div>:</div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900">{isTindakLanjut ? `${activeProgram.periode} - Tindak Lanjut ${activeProgram.periode}` : `${activeProgram.periode} - Monitoring ${activeProgram.periode}`}</span> 
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold">{activeProgram.periode}</span>
            </div>
            <div className="text-gray-500">Lokasi</div><div>:</div><div className="font-semibold text-gray-900 whitespace-pre-line">{activeProgram.lokasi}</div>
            <div className="text-gray-500">Sumber Dana</div><div>:</div><div className="font-semibold text-gray-900">APBD</div>
            <div className="text-gray-500">Penyuluh</div><div>:</div><div className="font-semibold text-gray-900">Ahmad Fauzi, SP</div>
            <div className="text-gray-500 font-bold mt-1">Selected PU</div><div className="mt-1">:</div><div className="mt-1"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">PU-03</span></div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineMapPin className="w-5 h-5 text-[#008A4B]" />
            Ringkasan PU-03
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 content-center">
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><PiPlant className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">{isTindakLanjut ? 'Total Titik Perlu Disulam' : 'Total Tanaman'}</p>
              <h3 className="text-xl font-bold text-gray-900">{isTindakLanjut ? '7' : '500'}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><HiOutlineCheckCircle className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Sudah Diinput</p>
              <h3 className="text-xl font-bold text-gray-900">{isTindakLanjut ? '1' : '430'}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2"><HiOutlineClock className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Belum Diinput</p>
              <h3 className="text-xl font-bold text-gray-900">{isTindakLanjut ? '6' : '70'}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2"><HiOutlineCamera className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Foto {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</p>
              <h3 className="text-xl font-bold text-gray-900">{isTindakLanjut ? '2' : '10'}</h3>
              <p className="text-[10px] text-gray-400">foto</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2"><HiOutlineCalendar className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Update Terakhir</p>
              <h3 className="text-sm font-bold text-gray-900 whitespace-nowrap">27 Mei 2026</h3>
              <p className="text-[10px] text-gray-500">10:40</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
            Data {isTindakLanjut ? 'Titik Penyulaman' : 'Monitoring Tanaman'} - 
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs">PU-03</span>
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={handleBackToRekap} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">
              <HiOutlineArrowLeft className="w-3.5 h-3.5 stroke-2" /> Kembali ke Rekap PU
            </button>
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={`Cari ID ${isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}...`} className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg w-56 focus:outline-none focus:border-[#008A4B]" />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">
              <HiOutlineFunnel className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs text-gray-600 whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-gray-200 text-[10px] font-bold text-gray-600 tracking-wide">
              <tr>
                <th className="px-4 py-4">No</th>
                <th className="px-4 py-4 text-left">{isTindakLanjut ? 'ID Titik/Tanaman' : 'ID Tanaman'}</th>
                {isTindakLanjut && <th className="px-4 py-4 text-left">Koordinat</th>}
                {!isTindakLanjut && <th className="px-4 py-4 text-left">Jenis Tanaman</th>}
                {!isTindakLanjut && <th className="px-4 py-4 text-left">Geotag / Koordinat</th>}
                {!isTindakLanjut && <th className="px-4 py-4">Tinggi Awal<br/><span className="text-[9px] font-normal">(Saat Tanam)</span></th>}
                <th className="px-4 py-4">Foto Sebelum<br/><span className="text-[9px] font-normal">({isTindakLanjut ? 'hasil monitoring' : 'Pelaksanaan'})</span></th>
                <th className="px-4 py-4">Foto Sesudah<br/>{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
                <th className="px-4 py-4">Tinggi Saat<br/>{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
                {!isTindakLanjut && <th className="px-4 py-4">Kondisi Tanaman</th>}
                <th className="px-4 py-4">Status {isTindakLanjut ? 'Penyulaman' : ''}</th>
                <th className="px-4 py-4">Tanggal<br/>{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
                <th className="px-4 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px] font-medium">
              {(isTindakLanjut ? MOCK_TITIK : MOCK_TABLE_DATA).map((row: any) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-bold text-gray-900">{row.id}</td>
                  <td className="px-4 py-4 font-bold text-gray-700 text-left">{isTindakLanjut ? row.tk : row.idTanaman}</td>
                  
                  {isTindakLanjut ? (
                    <td className="px-4 py-4 text-gray-600 text-left">
                      <span className="whitespace-pre-line leading-tight">{row.koordinat.replace('\n', ', ')}</span>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-left">
                        <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-max border border-emerald-100">
                          <PiLeaf className="w-3 h-3 text-emerald-500" />
                          {row.jenisTanaman}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-left">
                        <div className="flex items-start gap-1">
                          <HiOutlineMapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                          <span className="whitespace-pre-line leading-tight">{row.koordinat}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-800">{row.tinggiAwal}</td>
                    </>
                  )}
                  
                  <td className="px-4 py-4">
                    <div className="w-20 h-10 bg-gray-200 rounded overflow-hidden inline-block border border-gray-300 mx-auto">
                      <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" alt="Sebelum" className="object-cover w-full h-full" />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {(isTindakLanjut ? row.status === 'Belum Disulam' : !row.fotoSesudah) ? (
                      <span className="text-blue-500 font-bold">Belum diinput</span>
                    ) : (
                      <div className="w-20 h-10 bg-gray-200 rounded overflow-hidden inline-block border border-gray-300 mx-auto">
                        <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=150" alt="Sesudah" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 font-bold text-gray-800">
                    {isTindakLanjut ? row.tinggi : row.tinggiSaatMonitoring}
                  </td>
                  
                  {!isTindakLanjut && (
                    <td className="px-4 py-4">
                      {row.kondisiTanaman !== '-' ? (
                        <span className={`px-2.5 py-1 text-[10px] rounded font-bold ${
                          row.kondisiTanaman === 'Sehat' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                          row.kondisiTanaman === 'Perlu Perawatan' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {row.kondisiTanaman}
                        </span>
                      ) : '-'}
                    </td>
                  )}

                  <td className="px-4 py-4">
                    {isTindakLanjut ? (
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                         row.status === 'Sudah Disulam' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         row.status === 'Sedang Disulam' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                         'bg-red-50 text-red-500 border-red-100'
                       }`}>
                         {row.status}
                       </span>
                    ) : (
                      row.status !== '-' ? (
                         <span className="px-2.5 py-1 text-[10px] rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                         {row.status}
                       </span>
                      ) : '-'
                    )}
                  </td>

                  <td className="px-4 py-4 text-gray-500 font-bold">
                    {isTindakLanjut ? row.tgl : (row.waktuMonitoring ? row.waktuMonitoring.replace(', ', '\n') : '-')}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {(isTindakLanjut ? row.status === 'Belum Disulam' : row.tinggiSaatMonitoring === '-') ? (
                        <button 
                          onClick={() => handleOpenForm('input', isTindakLanjut ? { id: row.id, idTanaman: row.tk, koordinat: row.koordinat, status: row.status } as any : row)}
                          className="px-3 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded font-bold hover:bg-emerald-50 transition-colors text-[10px] cursor-pointer"
                        >
                          Input Data
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenForm('edit', isTindakLanjut ? { id: row.id, idTanaman: row.tk, koordinat: row.koordinat, status: row.status } as any : row)}
                          className="px-4 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded font-bold hover:bg-emerald-50 transition-colors text-[10px] cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                        <HiOutlineEllipsisVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white text-[10px] text-gray-500">
          <span>Menampilkan 1 - 7 dari 7 data (PU-03)</span>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button className="p-1.5 border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed"><HiChevronLeft className="w-3.5 h-3.5" /></button>
              <button className="px-2.5 py-1 border border-[#008A4B] rounded bg-[#008A4B] text-white font-bold cursor-pointer">1</button>
              <button className="p-1.5 border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed"><HiChevronRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <select className="border border-gray-300 rounded px-2 py-1 bg-white font-medium focus:outline-none cursor-pointer">
                <option>10</option>
              </select>
              <span>data per halaman</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. INPUT / EDIT VIEW
// =========================================================================
interface InputEditViewProps {
  activeId: string;
  activeProgram: ProgramData;
  isTindakLanjut: boolean;
  isEdit: boolean;
  selectedRow: MonitoringRow | null;
  handleBackToTable: () => void;
}

export const InputEditView: React.FC<InputEditViewProps> = ({
  activeId,
  activeProgram,
  isTindakLanjut,
  isEdit,
  selectedRow,
  handleBackToTable
}) => {
  const title = isEdit 
    ? `Edit Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}` 
    : `Tambah Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}`;
  const subTitle = isEdit 
    ? `Edit data hasil ${isTindakLanjut ? 'penyulaman' : 'monitoring'} untuk 1 titik / tanaman pada PU yang dipilih.` 
    : `Isi data hasil ${isTindakLanjut ? 'penyulaman' : 'monitoring'} untuk 1 titik / tanaman pada PU yang dipilih.`;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {title}
            <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 text-sm rounded-md font-bold">PU-03</span>
            <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-md font-bold">{selectedRow?.idTanaman || 'PU-03-TK-001'}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
        </div>
        <button onClick={handleBackToTable} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke Review & Kirim
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row overflow-hidden">
        <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs border-r border-gray-100 content-center">
          <div className="grid grid-cols-[130px_10px_1fr] gap-1">
            <div className="text-gray-500">ID Program</div><div>:</div><div className="font-semibold text-gray-900">{activeId}</div>
            <div className="text-gray-500 mt-2">Nama Program</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">{activeProgram.nama}</div>
            <div className="text-gray-500 mt-2">Periode Monitoring</div><div className="mt-2">:</div>
            <div className="font-semibold text-gray-900 mt-2 flex items-center gap-1.5">
              {isTindakLanjut ? `${activeProgram.periode} - Tindak Lanjut ${activeProgram.periode}` : `${activeProgram.periode} - Monitoring ${activeProgram.periode}`}
            </div>
            <div className="text-gray-500 mt-2">Penyuluh</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">Ahmad Fauzi, SP</div>
            <div className="text-gray-500 font-bold mt-3">Selected PU</div><div className="mt-3">:</div><div className="mt-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">PU-03</span></div>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr] gap-1">
            <div className="text-gray-500">ID {isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}</div><div>:</div><div className="font-semibold text-gray-900">{selectedRow?.idTanaman || 'PU-03-TK-001'}</div>
            <div className="text-gray-500 mt-2">Lokasi</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2 whitespace-pre-line leading-relaxed">{activeProgram.lokasi}</div>
            {!isTindakLanjut && <><div className="text-gray-500 mt-2">Jenis Tanaman</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">{selectedRow?.jenisTanaman || 'Sonneratia'}</div></>}
            <div className="text-gray-500 mt-2">Koordinat / Geotag</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2 whitespace-pre-line">{selectedRow?.koordinat?.replace('\n', ' / ') || '-6.342512° S / 108.323145° E'}</div>
          </div>
        </div>
        <div className="w-full lg:w-96 h-48 lg:h-auto bg-gray-200 relative shrink-0 p-4 flex items-center justify-center">
          <div className="w-full h-full rounded-lg overflow-hidden relative shadow-sm border border-slate-300">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" className="w-full h-full object-cover opacity-80" alt="Map" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
               <HiOutlineMapPin className="w-8 h-8 text-green-500 drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
              <PiPlant className="w-5 h-5 text-[#008A4B]" />
              Form {isEdit ? 'Edit' : 'Input'} {isTindakLanjut ? 'Penyulaman' : 'Monitoring Tanaman'}
            </h3>
            
            <div className="grid grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">ID {isTindakLanjut ? 'Titik / Tanaman' : 'Tanaman'}</label>
                <input type="text" disabled defaultValue={selectedRow?.idTanaman || 'PU-03-TK-001'} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
              </div>
              {isTindakLanjut ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">PU</label>
                  <input type="text" disabled defaultValue="PU-03" className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Tanaman</label>
                  <input type="text" disabled defaultValue={selectedRow?.jenisTanaman || 'Sonneratia'} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                </div>
              )}
              
              <div className={isTindakLanjut ? '' : "col-span-1 grid grid-cols-2 gap-3"}>
                {!isTindakLanjut && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">Koordinat Geotag</label>
                    <input type="text" disabled defaultValue={selectedRow?.koordinat?.split('\n')[0] || '-6.342512° S'} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Awal <span className="font-normal text-gray-400">(Tanam)</span></label>
                  <div className="relative">
                    <input type="text" disabled defaultValue="12" className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium pr-8" />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Status Penyulaman' : 'Kondisi Tanaman'} <span className="text-red-500">*</span></label>
                {isTindakLanjut ? (
                   <div className="flex border border-emerald-500 rounded-lg overflow-hidden h-10">
                     <button className="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                       <HiOutlineCheckCircle className="w-4 h-4" /> Sudah Disulam
                     </button>
                     <button className="flex-1 border-l border-emerald-500 text-gray-400 text-[9px] font-bold flex items-center justify-center bg-white cursor-not-allowed opacity-60">
                       Belum Disulam
                     </button>
                     <button className="flex-1 border-l border-emerald-500 text-gray-400 text-[8px] font-bold flex items-center justify-center bg-white cursor-not-allowed opacity-60 text-center leading-none">
                       Belum Bisa<br/>Dilaksanakan
                     </button>
                   </div>
                ) : (
                  <>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B] bg-white cursor-pointer" defaultValue={isEdit ? selectedRow?.kondisiTanaman : ""}>
                      <option value="" disabled hidden>Pilih kondisi</option>
                      <option value="Sehat">Sehat</option>
                      <option value="Perlu Perawatan">Perlu Perawatan</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                    </select>
                    {isEdit && selectedRow?.kondisiTanaman === 'Perlu Perawatan' && (
                      <div className="mt-2 text-orange-600 text-xs font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Perlu Perawatan
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tinggi Saat Penyulaman' : 'Status Tanaman'} <span className="text-red-500">*</span></label>
                {isTindakLanjut ? (
                   <div className="relative h-10">
                     <input type="number" defaultValue={isEdit ? '24' : ''} className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" />
                     <span className="absolute right-3 top-2.5 text-sm text-gray-500 font-medium">cm</span>
                   </div>
                ) : (
                  <div className="flex gap-2 h-10">
                    <button className={`flex-1 border rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      (!isEdit || selectedRow?.status === 'Hidup') ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}>
                      <HiOutlineCheckCircle className="w-4 h-4" /> Hidup
                    </button>
                    <button className="flex-1 border border-gray-200 text-gray-500 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                      <HiOutlineXCircle className="w-4 h-4" /> Mati
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tanggal Penyulaman' : 'Tinggi Saat Monitoring'} <span className="text-red-500">*</span></label>
                {isTindakLanjut ? (
                   <div className="relative h-10">
                     <input type="text" defaultValue={isEdit ? '27 Mei 2026' : ''} className="w-full h-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" />
                     <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                ) : (
                  <div className="relative h-10">
                    <input type="number" defaultValue={isEdit ? selectedRow?.tinggiSaatMonitoring?.replace(' cm', '') || '26' : ''} className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500 font-medium">cm</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col h-45">
                <p className="text-xs font-bold text-blue-700 mb-2">Foto Sebelum <span className="font-normal text-blue-500 bg-blue-50 px-1 py-0.5 rounded">({isTindakLanjut ? 'hasil monitoring' : 'Dari Pelaksanaan / PO'})</span></p>
                <div className="flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=400" alt="Sebelum" className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-2 font-medium">
                  <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400" />
                  12 Mei 2026 • 09:15 WIB
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col h-45">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-bold text-gray-900">Foto {isTindakLanjut ? 'Sesudah Penyulaman' : 'Monitoring Terbaru'}</p>
                  <span className="font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">{isEdit ? 'Saat ini' : 'Baru diunggah'}</span>
                </div>
                <div className="flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative group">
                  <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400" alt="Sesudah" className="w-full h-full object-cover" />
                  <button className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-gray-200 cursor-pointer hover:bg-white">
                    <HiOutlineCamera className="w-4 h-4" /> Ganti Foto
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-2 font-medium">
                  <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400" />
                  27 Mei 2026 • 10:35 WIB
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Catatan {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} <span className="text-red-500">*</span></label>
              <div className="border border-gray-300 rounded-lg p-3 bg-white relative">
                <textarea 
                  className="w-full border-none p-0 text-xs text-gray-600 focus:ring-0 resize-none bg-transparent outline-none h-14 leading-relaxed"
                  defaultValue={isTindakLanjut ? "Penyulaman telah dilakukan pada titik ini. Bibit pengganti ditanam dan area sekitar dibersihkan." : (isEdit ? "Daun masih hijau, namun pertumbuhan lebih lambat dibanding tanaman lain pada PU-03. Area sekitar cukup berlumpur dan perlu pemantauan lanjutan." : "")}
                ></textarea>
                <div className="text-right text-[10px] text-gray-400 font-medium">{isTindakLanjut ? '91/500' : (isEdit ? '135/500' : '0/500')}</div>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-3 rounded-lg flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Setiap {isTindakLanjut ? 'titik' : 'tanaman'} wajib memiliki 1 foto sebelum ({isTindakLanjut ? 'hasil monitoring' : 'dari pelaksanaan/PO'}) dan 1 foto {isTindakLanjut ? 'sesudah penyulaman' : 'monitoring (saat ini)'}.
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-150">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              Riwayat {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
               <div className="flex gap-4">
                 <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=150" className="w-20 h-14 rounded border border-gray-200 object-cover" alt="History" />
                 <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                     <span className="font-bold text-gray-900 text-xs">27 Mei 2026</span>
                     <span className="text-[10px] font-medium text-gray-500">10:32 WIB</span>
                   </div>
                   <div className="grid grid-cols-[50px_10px_1fr] gap-y-1 text-[10px] mt-1">
                     <span className="text-gray-500">Tinggi</span><span>:</span><span className="font-bold text-gray-900">24 cm</span>
                     <span className="text-gray-500">Status</span><span>:</span><span className="font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}</span>
                   </div>
                 </div>
               </div>
               
               <div className="w-full h-px bg-slate-100"></div>

               <div className="flex gap-4 opacity-70">
                 <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" className="w-20 h-14 rounded border border-gray-200 object-cover" alt="History" />
                 <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                     <span className="font-bold text-gray-900 text-xs">20 Mei 2026</span>
                     <span className="text-[10px] font-medium text-gray-500">09:18 WIB</span>
                   </div>
                   <div className="grid grid-cols-[50px_10px_1fr] gap-y-1 text-[10px] mt-1">
                     <span className="text-gray-500">Tinggi</span><span>:</span><span className="font-bold text-gray-900">20 cm</span>
                     <span className="text-gray-500">Status</span><span>:</span><span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-slate-500' : 'text-emerald-600'}`}><span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-slate-400' : 'bg-emerald-500'}`}></span> {isTindakLanjut ? 'Belum Disulam' : 'Hidup'}</span>
                   </div>
                 </div>
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               <div className="flex gap-4 opacity-70">
                 <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" className="w-20 h-14 rounded border border-gray-200 object-cover" alt="History" />
                 <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                     <span className="font-bold text-gray-900 text-xs">16 Mei 2026</span>
                     <span className="text-[10px] font-medium text-gray-500">08:15 WIB</span>
                   </div>
                   <div className="grid grid-cols-[50px_10px_1fr] gap-y-1 text-[10px] mt-1">
                     <span className="text-gray-500">Tinggi</span><span>:</span><span className="font-bold text-gray-900">16 cm</span>
                     <span className="text-gray-500">Status</span><span>:</span><span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-slate-500' : 'text-orange-500'}`}><span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-slate-400' : 'bg-orange-500'}`}></span> {isTindakLanjut ? 'Belum Disulam' : 'Perlu Perawatan'}</span>
                   </div>
                 </div>
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               <div className="flex gap-4 opacity-70">
                 <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=150" className="w-20 h-14 rounded border border-gray-200 object-cover" alt="History" />
                 <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                     <span className="font-bold text-gray-900 text-xs">12 Mei 2026</span>
                     <span className="text-[10px] font-medium text-gray-500">08:00 WIB</span>
                   </div>
                   <div className="grid grid-cols-[50px_10px_1fr] gap-y-1 text-[10px] mt-1">
                     <span className="text-gray-500">Tinggi</span><span>:</span><span className="font-bold text-gray-900">12 cm</span>
                     <span className="text-gray-500">Status</span><span>:</span><span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-blue-600' : 'text-emerald-600'}`}><span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-blue-500' : 'bg-emerald-500'}`}></span> {isTindakLanjut ? 'Hasil Monitoring' : 'Hidup'}</span>
                   </div>
                 </div>
               </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 font-bold text-[11px] rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              Lihat Riwayat Lengkap
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-40 lg:ml-64 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button onClick={handleBackToTable} className="px-6 py-2.5 border border-slate-300 text-blue-800 bg-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer hover:bg-slate-50">
           <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke {isTindakLanjut ? 'Tambah Data PU' : 'Rekap PU'}
         </button>
         <button onClick={handleBackToTable} className="px-8 py-2.5 bg-[#008A4B] text-white rounded-lg text-sm font-bold hover:bg-emerald-800 flex items-center gap-2 shadow-sm cursor-pointer transition-colors">
           <HiOutlineCheckCircle className="w-5 h-5" /> {isEdit ? 'Simpan Perubahan' : (isTindakLanjut ? 'Simpan Hasil Penyulaman' : 'Simpan Monitoring')}
         </button>
      </div>
    </div>
  );
};