import React from 'react';
import { 
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowLeft, 
  HiCheckCircle, HiOutlineCalendar, HiOutlineCamera, HiOutlineMapPin,
  HiOutlineMagnifyingGlass, HiOutlineClock
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';
import toast from 'react-hot-toast';
import type { ProgramData } from '../types';

interface InputEditViewProps {
  activeId: string;
  activeProgram: ProgramData;
  isTindakLanjut: boolean;
  isEdit: boolean;
  selectedRow: any;
  selectedPu?: any;
  handleBackToTable: () => void;
}

export const InputEditView: React.FC<InputEditViewProps> = ({
  activeId,
  activeProgram,
  isTindakLanjut,
  isEdit,
  selectedRow,
  selectedPu,
  handleBackToTable
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    kondisiTanaman: selectedRow?.kondisi_tanaman || '',
    catatan: selectedRow?.keterangan || '',
    fotoUrl: selectedRow?.foto_url || '',
    status: (selectedRow?.kondisi_tanaman || '').toLowerCase().includes('hidup') || (selectedRow?.kondisi_tanaman || '').toLowerCase().includes('sehat') || (selectedRow?.kondisi_tanaman || '').toLowerCase().includes('baik') ? 'Hidup' : ((selectedRow?.kondisi_tanaman || '').toLowerCase().includes('mati') || (selectedRow?.kondisi_tanaman || '').toLowerCase().includes('sakit') ? 'Mati' : '')
  });

  const handleSimpan = async () => {
    if (!form.kondisiTanaman && !isTindakLanjut) {
      toast.error('Kondisi Tanaman wajib diisi');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
      
      const payload = {
        kondisi_tanaman: isTindakLanjut ? 'Sudah Disulam' : form.kondisiTanaman,
        keterangan: form.catatan,
        foto_url: form.fotoUrl
      };

      const res = await fetch(`${API_URL}/tanaman/${selectedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success('Data berhasil disimpan');
        // Ideally we should refetch the data, but for now we just go back to the table
        // The table will remount when going back to rekap, but we can just use handleBackToTable and wait for a full reload.
        // Or we can reload the page to get the updated data immediately for simplicity.
        window.location.reload();
      } else {
        toast.error('Gagal menyimpan data');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };
  const title = isEdit 
    ? `Edit Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}` 
    : `Input Data ${isTindakLanjut ? 'Penyulaman' : 'Monitoring'}`;
  const subTitle = isEdit 
    ? `Edit data ${isTindakLanjut ? 'hasil penyulaman' : 'monitoring'} untuk 1 ${isTindakLanjut ? 'titik / tanaman' : 'tanaman'} pada PU yang dipilih.` 
    : `Isi data ${isTindakLanjut ? 'hasil penyulaman' : 'monitoring'} untuk 1 ${isTindakLanjut ? 'titik / tanaman' : 'tanaman'} pada PU yang dipilih.`;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans w-full pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {title}
            <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 text-sm rounded-md font-bold">{selectedPu?.nama || 'PU-03'}</span>
            <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-md font-bold">{selectedRow?.idTanaman || (isTindakLanjut ? 'PU-03-TK-001' : 'PRG26-0007-PU03-003')}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
        </div>
        <button onClick={handleBackToTable} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer shadow-sm">
          <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke Review & Kirim
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row overflow-hidden">
        <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs border-r border-gray-100 content-center">
          <div className="grid grid-cols-[130px_10px_1fr] gap-1">
            <div className="text-gray-500">ID Program</div><div>:</div><div className="font-semibold text-gray-900">{activeId}</div>
            <div className="text-gray-500 mt-2">Nama Program</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">{activeProgram.nama}</div>
            <div className="text-gray-500 mt-2">Periode Monitoring</div><div className="mt-2">:</div>
            <div className="font-semibold text-gray-900 mt-2 flex items-center gap-1.5">
              {isTindakLanjut ? `${activeProgram.periode} - Tindak Lanjut ${activeProgram.periode}` : `${activeProgram.periode} - Monitoring ${activeProgram.periode}`}
            </div>
            <div className="text-gray-500 mt-2">Penyuluh</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2">{activeProgram.penyuluh?.name || 'Ahmad Fauzi, SP'}</div>
            <div className="text-gray-500 font-bold mt-3">Selected PU</div><div className="mt-3">:</div><div className="mt-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">Semua PU</span></div>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr] gap-1">
            <div className="text-gray-500">ID {isTindakLanjut ? 'Titik/Tanaman' : 'Tanaman'}</div><div>:</div><div className="font-semibold text-gray-900">TNMN-{selectedRow?.id}</div>
            <div className="text-gray-500 mt-2">Lokasi</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2 whitespace-pre-line leading-relaxed">{activeProgram.lokasi || '-'}</div>
            <div className="text-gray-500 mt-2">Koordinat / Geotag</div><div className="mt-2">:</div><div className="font-semibold text-gray-900 mt-2 whitespace-pre-line">-</div>
          </div>
          {!isTindakLanjut && (
            <div className="grid grid-cols-[130px_10px_1fr] gap-1">
              <div className="text-gray-500">Jenis Tanaman</div><div>:</div><div className="font-semibold text-gray-900">{selectedRow?.nama_tanaman || selectedRow?.seed?.name || 'Sonneratia'}</div>
            </div>
          )}
        </div>
        <div className="w-full lg:w-96 h-48 lg:h-auto bg-gray-200 relative shrink-0 p-4 flex items-center justify-center">
          <div className="w-full h-full rounded-lg overflow-hidden relative shadow-sm border border-slate-300">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" className="w-full h-full object-cover opacity-80" alt="Map" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
               <HiOutlineMapPin className="w-8 h-8 text-blue-500 drop-shadow-md" />
            </div>
            <div className="absolute right-2 top-2 flex flex-col gap-0.5 bg-white rounded shadow-sm overflow-hidden">
               <button className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 border-b border-gray-100">+</button>
               <button className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">-</button>
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
                <input type="text" disabled defaultValue={`TNMN-${selectedRow?.id}`} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
              </div>
              {isTindakLanjut ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">PU</label>
                  <input type="text" disabled defaultValue="PU-03" className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Tanaman</label>
                  <input type="text" disabled defaultValue={selectedRow?.nama_tanaman || selectedRow?.seed?.name || 'Sonneratia'} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                </div>
              )}
              
              <div className={isTindakLanjut ? '' : "col-span-1 grid grid-cols-2 gap-3"}>
                {!isTindakLanjut && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">Koordinat Geotag <HiOutlineMapPin className="w-3 h-3 text-gray-400"/></label>
                    <input type="text" disabled defaultValue={selectedRow?.koordinat?.split('\n')[0] || '6.841401° S'} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 text-sm font-medium" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5">Tinggi Awal <span className="font-normal text-gray-400">(Saat Tanam)</span></label>
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
                   <div className="flex border border-emerald-500 rounded-lg overflow-hidden h-10.5">
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
                    <div className="relative h-10.5">
                      <select 
                        className="w-full h-full border border-gray-300 rounded-lg px-3 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B] bg-white cursor-pointer appearance-none" 
                        value={form.kondisiTanaman}
                        onChange={(e) => setForm({ ...form, kondisiTanaman: e.target.value })}
                      >
                        <option value="" disabled hidden>Pilih kondisi</option>
                        <option value="Sehat">Sehat</option>
                        <option value="Perlu Perawatan">Perlu Perawatan</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Mati">Mati</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tinggi Saat Penyulaman' : 'Status Tanaman'} <span className="text-red-500">*</span></label>
                {isTindakLanjut ? (
                   <div className="relative h-10.5">
                     <input type="number" defaultValue={isEdit ? '24' : ''} className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" />
                     <span className="absolute right-3 top-3 text-sm text-gray-500 font-medium">cm</span>
                   </div>
                ) : (
                  <div className="flex gap-2 h-10.5">
                    <button type="button" className={`flex-1 border rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      form.status === 'Hidup' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}>
                      <HiOutlineCheckCircle className="w-4 h-4" /> Hidup
                    </button>
                    <button type="button" className={`flex-1 border rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      form.status === 'Mati' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}>
                      <HiOutlineXCircle className="w-4 h-4" /> Mati
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isTindakLanjut ? 'Tanggal Penyulaman' : 'Tinggi Saat Monitoring'} <span className="text-red-500">*</span></label>
                {isTindakLanjut ? (
                   <div className="relative h-10.5">
                     <input type="text" defaultValue={isEdit ? '27 Mei 2026' : ''} className="w-full h-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" />
                     <HiOutlineCalendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                   </div>
                ) : (
                  <div className="relative h-10.5">
                    <input type="number" disabled defaultValue={selectedRow?.tinggiSaatMonitoring?.replace(' cm', '') || '26'} className="w-full h-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-400" />
                    <span className="absolute right-3 top-3 text-sm text-gray-400 font-medium">cm</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">URL Foto {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}</label>
              <input 
                type="text" 
                placeholder="https://example.com/foto.jpg"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm font-medium focus:ring-[#008A4B] focus:border-[#008A4B]" 
                value={form.fotoUrl}
                onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col h-45">
                <p className="text-xs font-bold text-blue-700 mb-2">Foto Sebelum <span className="font-normal text-blue-500 bg-blue-50 px-1 py-0.5 rounded">({isTindakLanjut ? 'hasil monitoring' : 'Dari Pelaksanaan / PO'})</span></p>
                <div className="flex-1 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative group">
                  <img src="https://images.unsplash.com/photo-1621360841013-c76831f13885?q=80&w=400" alt="Sebelum" className="w-full h-full object-cover" />
                  <button className="absolute bottom-2 right-2 bg-white/90 w-8 h-8 rounded flex items-center justify-center shadow-sm cursor-pointer">
                    <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-700" />
                  </button>
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
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  placeholder={isTindakLanjut ? "Keterangan penyulaman..." : "Catatan kondisi tanaman saat ini..."}
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
              <HiOutlineClock className="w-5 h-5" /> Riwayat {isTindakLanjut ? 'Penyulaman' : 'Monitoring'}
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
              {!isEdit ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 mb-4">
                    <HiOutlineClock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Belum ada riwayat {isTindakLanjut ? 'penyulaman' : 'monitoring'}</h4>
                  <p className="text-xs text-slate-500">Riwayat {isTindakLanjut ? 'penyulaman' : 'monitoring'} akan muncul<br/>setelah data {isTindakLanjut ? 'hasil' : 'monitoring'} disimpan.</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=150" className="w-20 h-14 rounded border border-gray-200 object-cover" alt="History" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900 text-xs">27 Mei 2026</span>
                        <span className="text-[10px] font-medium text-gray-500">10:32 WIB</span>
                      </div>
                      <div className="grid grid-cols-[50px_10px_1fr] gap-y-1 text-[10px] mt-1">
                        <span className="text-gray-500">Tinggi</span><span>:</span><span className="font-bold text-gray-900">24 cm</span>
                        <span className="text-gray-500">Status</span><span>:</span>
                        <span className={`font-bold flex items-center gap-1 ${!isTindakLanjut ? 'text-emerald-600' : 'text-emerald-600'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {isTindakLanjut ? 'Sudah Disulam' : 'Hidup'}
                        </span>
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
                        <span className="text-gray-500">Status</span><span>:</span>
                        <span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-slate-500' : 'text-emerald-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-slate-400' : 'bg-emerald-500'}`}></span> {isTindakLanjut ? 'Belum Disulam' : 'Hidup'}
                        </span>
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
                        <span className="text-gray-500">Status</span><span>:</span>
                        <span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-slate-500' : 'text-orange-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-slate-400' : 'bg-orange-500'}`}></span> {isTindakLanjut ? 'Belum Disulam' : 'Perlu Perawatan'}
                        </span>
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
                        <span className="text-gray-500">Status</span><span>:</span>
                        <span className={`font-bold flex items-center gap-1 ${isTindakLanjut ? 'text-blue-600' : 'text-emerald-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isTindakLanjut ? 'bg-blue-500' : 'bg-emerald-500'}`}></span> {isTindakLanjut ? 'Hasil Monitoring' : 'Hidup'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {isEdit && (
              <button className="w-full mt-6 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 font-bold text-[11px] rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Lihat Riwayat Lengkap
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center z-40">
         <button onClick={handleBackToTable} className="px-6 py-2.5 border border-slate-300 text-blue-800 bg-white rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer hover:bg-slate-50">
           <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali ke Tambah Data PU
         </button>
         <div className="flex items-center gap-3">
           <button 
             onClick={handleSimpan} 
             disabled={isSubmitting}
             className={`px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors ${
               isSubmitting ? 'bg-emerald-300 cursor-not-allowed' : 'bg-[#008A4B] text-white hover:bg-emerald-800'
             }`}
           >
             <HiCheckCircle className="w-5 h-5" /> {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : `Simpan ${isTindakLanjut ? 'Hasil Penyulaman' : 'Monitoring'}`)}
           </button>
         </div>
      </div>
    </div>
  );
};