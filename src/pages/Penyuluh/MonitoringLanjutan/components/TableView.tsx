import React from 'react';
import {
  HiOutlineMagnifyingGlass, HiOutlineFunnel, HiChevronLeft,
  HiChevronRight, HiOutlineArrowLeft, HiOutlineMapPin,
  HiOutlineCheckCircle, HiOutlineClock, HiOutlineCalendar,
  HiOutlineInformationCircle, HiOutlinePaperAirplane
} from 'react-icons/hi2';
import { PiPlant, PiLeaf } from 'react-icons/pi';
import type { MonitoringRow, ProgramData } from '../types';

interface TableViewProps {
  activeId: string;
  activeProgram: ProgramData;
  selectedPuId: any;
  isTindakLanjut: boolean;
  handleBackToRekap: () => void;
  handleOpenForm: (mode: 'input' | 'edit', row: MonitoringRow) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  activeId,
  activeProgram,
  selectedPuId,
  isTindakLanjut,
  handleBackToRekap,
  handleOpenForm
}) => {
  const petakUkurs = (activeProgram?.petak_ukurs || activeProgram?.petakUkurs || []) as any[];
  const targetPu = petakUkurs.find((pu: any, idx: number) => pu.id === selectedPuId || idx === selectedPuId) || petakUkurs[0];
  const allPlants = targetPu?.data_tanamans || targetPu?.dataTanamans || [];
  const puName = targetPu?.nama || `PU-${(petakUkurs.indexOf(targetPu) + 1).toString().padStart(2, '0')}`;

  const totalTanaman = allPlants.reduce((acc: any, curr: any) => acc + (curr.jumlah || 0), 0);
  let sudahDiinput = 0;
  let mati = 0;
  let belumDiinput = 0;
  let updateTerakhir = '-';

  allPlants.forEach((t: any) => {
    const kondisi = t.kondisi_tanaman?.toLowerCase() || '';
    if (kondisi.includes('hidup') || kondisi.includes('sehat') || kondisi.includes('baik')) {
      sudahDiinput += t.jumlah || 0;
    } else if (kondisi.includes('mati') || kondisi.includes('rusak') || kondisi.includes('sakit')) {
      mati += t.jumlah || 0;
      sudahDiinput += t.jumlah || 0;
    } else {
      belumDiinput += t.jumlah || 0;
    }

    if (t.updated_at && (updateTerakhir === '-' || new Date(t.updated_at) > new Date(updateTerakhir))) {
      updateTerakhir = t.updated_at;
    }
  });

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Tambah Data {isTindakLanjut ? 'Penyulaman' : 'Monitoring'} PU <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-md font-bold">{puName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lengkapi atau tambahkan data {isTindakLanjut ? 'hasil penyulaman' : 'monitoring tanaman'} untuk petak ukur (PU) yang dipilih sebelum hasil dikirim.
          </p>
        </div>
        <button onClick={handleBackToRekap} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke Review & Kirim
        </button>
      </div>

      <div className="bg-[#f0f9f3] border border-[#DCECE0] p-3 rounded-lg flex items-center gap-3 text-sm text-emerald-800 mb-6 font-medium">
        <HiOutlineInformationCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        Anda sedang menambahkan data {isTindakLanjut ? 'penyulaman' : 'monitoring'} untuk {puName}.
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
            <div className="text-gray-500">Lokasi</div><div>:</div><div className="font-semibold text-gray-900 whitespace-pre-line">{activeProgram.lokasi || '-'}</div>
            <div className="text-gray-500">Sumber Dana</div><div>:</div><div className="font-semibold text-gray-900">{activeProgram.sumber_dana || '-'}</div>
            <div className="text-gray-500">Penyuluh</div><div>:</div><div className="font-semibold text-gray-900">{activeProgram.penyuluh?.name || 'Ahmad Fauzi, SP'}</div>
            <div className="text-gray-500 font-bold mt-1">Selected PU</div><div className="mt-1">:</div><div className="mt-1"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">{puName}</span></div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineMapPin className="w-5 h-5 text-[#008A4B]" />
            Ringkasan Keseluruhan PU
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 content-center">
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><PiPlant className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">{isTindakLanjut ? 'Total Titik Perlu Disulam' : 'Total Tanaman'}</p>
              <h3 className="text-xl font-bold text-gray-900">{totalTanaman}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#008A4B] mb-2"><HiOutlineCheckCircle className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Sudah Diinput</p>
              <h3 className="text-xl font-bold text-gray-900">{sudahDiinput}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2"><HiOutlineClock className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Belum Diinput</p>
              <h3 className="text-xl font-bold text-gray-900">{belumDiinput}</h3>
              <p className="text-[10px] text-gray-400">{isTindakLanjut ? 'titik' : 'pohon'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-2"><PiLeaf className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Mati / Rusak</p>
              <h3 className="text-xl font-bold text-gray-900">{mati}</h3>
              <p className="text-[10px] text-gray-400">pohon</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2"><HiOutlineCalendar className="w-5 h-5" /></div>
              <p className="text-[9px] text-slate-500 font-semibold mb-1 leading-tight">Update Terakhir</p>
              <h3 className="text-xs font-bold text-gray-900 wrap-break-words w-full text-center">{updateTerakhir !== '-' ? new Date(updateTerakhir).toLocaleDateString('id-ID') : '-'}</h3>
              <p className="text-[10px] text-gray-500">{updateTerakhir !== '-' ? new Date(updateTerakhir).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
            Data {isTindakLanjut ? 'Titik Penyulaman' : 'Monitoring Tanaman'} -
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs">{puName}</span>
          </h2>
          <div className="flex items-center gap-3">
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
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-4">No</th>
                <th className="px-4 py-4 text-left">ID {isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}</th>
                {!isTindakLanjut && <th className="px-4 py-4 text-left">Jenis Tanaman</th>}
                <th className="px-4 py-4 text-left">{isTindakLanjut ? 'Koordinat' : 'Geotag / Koordinat'}</th>
                <th className="px-4 py-4">Tinggi Awal<br /><span className="text-[9px] font-normal">(Saat Tanam)</span></th>
                <th className="px-4 py-4">Foto Sebelum<br /><span className="text-[9px] font-normal">({isTindakLanjut ? 'hasil monitoring' : 'Pelaksanaan'})</span></th>
                <th className="px-4 py-4">Foto Sesudah<br />{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
                <th className="px-4 py-4">Tinggi Saat {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}{!isTindakLanjut && <><br /><span className="text-[9px] font-normal">(Saat Monitoring)</span></>}</th>
                {!isTindakLanjut && <th className="px-4 py-4">Kondisi Tanaman</th>}
                <th className="px-4 py-4">Status {isTindakLanjut ? 'Penyulaman' : ''}</th>
                <th className="px-4 py-4">Tanggal<br />{isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</th>
                <th className="px-4 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px] font-medium">
              {allPlants.map((row: any, index: number) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-bold text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 font-bold text-gray-700 text-left">TNMN-{row.id}</td>

                  {!isTindakLanjut && (
                    <td className="px-4 py-4 text-left">
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-max border border-emerald-100">
                        <PiLeaf className="w-3 h-3 text-emerald-500" />
                        {row.nama_tanaman || row.seed?.name || 'Tanaman'} ({row.jumlah} bibit)
                      </span>
                    </td>
                  )}

                  <td className="px-4 py-4 text-gray-600 text-left">
                    <span className="whitespace-pre-line leading-tight">-</span>
                  </td>

                  <td className="px-4 py-4 font-bold text-gray-800">-</td>

                  <td className="px-4 py-4">
                    <div className="w-20 h-10 bg-gray-200 rounded overflow-hidden inline-block border border-gray-300 mx-auto relative">
                      <span className="text-gray-400 text-[10px] flex items-center justify-center h-full w-full">No Photo</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {!row.foto_url ? (
                      <span className="text-blue-500 font-bold">Belum diinput</span>
                    ) : (
                      <div className="w-20 h-10 bg-gray-200 rounded overflow-hidden inline-block border border-gray-300 mx-auto relative">
                        <img src={row.foto_url} alt="Sesudah" className="object-cover w-full h-full" />
                        {!isTindakLanjut && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[7px] text-white py-0.5 text-center leading-tight">
                            {new Date(row.updated_at).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 font-bold text-gray-800">
                    -
                  </td>

                  {!isTindakLanjut && (
                    <td className="px-4 py-4">
                      {row.kondisi_tanaman ? (
                        <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold ${row.kondisi_tanaman === 'Sehat' || row.kondisi_tanaman === 'Hidup' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            row.kondisi_tanaman === 'Perlu Perawatan' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                              'bg-red-50 text-red-500 border border-red-100'
                          }`}>
                          {row.kondisi_tanaman}
                        </span>
                      ) : '-'}
                    </td>
                  )}

                  <td className="px-4 py-4">
                    {isTindakLanjut ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.kondisi_tanaman === 'Sudah Disulam' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          row.kondisi_tanaman === 'Sedang Disulam' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-red-50 text-red-500 border-red-100'
                        }`}>
                        {row.kondisi_tanaman || 'Belum Disulam'}
                      </span>
                    ) : (
                      row.kondisi_tanaman ? (
                        <span className="px-2.5 py-1 text-[10px] rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {row.kondisi_tanaman === 'Mati' ? 'Mati' : 'Hidup'}
                        </span>
                      ) : '-'
                    )}
                  </td>

                  <td className="px-4 py-4 text-gray-500 font-bold whitespace-pre-line leading-tight">
                    {row.updated_at ? new Date(row.updated_at).toLocaleDateString('id-ID') : '-'}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {!row.kondisi_tanaman ? (
                        <button
                          onClick={() => handleOpenForm('input', row)}
                          className="px-3 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded-full font-bold hover:bg-emerald-50 transition-colors text-[10px] cursor-pointer"
                        >
                          Input Data
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenForm('edit', row)}
                          className="px-4 py-1.5 border border-[#008A4B] text-[#008A4B] bg-white rounded-full font-bold hover:bg-emerald-50 transition-colors text-[10px] cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white text-[10px] text-gray-500">
          <span>Menampilkan 1 - {allPlants.length} dari {allPlants.length} data ({puName})</span>
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

      <div className="mt-4 flex justify-between items-center z-40">
        <button onClick={handleBackToRekap} className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer hover:bg-slate-50">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
        </button>
        <button
          onClick={handleBackToRekap}
          className="px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors bg-[#008A4B] text-white hover:bg-emerald-800 cursor-pointer"
        >
          <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45" /> Kirim Hasil {isTindakLanjut ? 'Penyulaman P2' : `Monitoring ${activeProgram.periode}`}
        </button>
      </div>
    </div>
  );
};