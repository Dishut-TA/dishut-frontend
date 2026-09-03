import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineMapPin, 
  HiOutlineCloud, 
  HiOutlineTrash,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface PetakUkur {
  id: number;
  nomorPetak: string;
  rencana: number;
  tumbuh: number;
  tinggiRata: string;
  koordinat: string;
  keterangan: string;
}

const InputEvaluasiLapanganStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const infoTugas = {
    noSurat: id || 'ST.76/TKTRH/RRPKH/DAS.04.03/B/03/2026',
    namaProyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
    lokasi: 'Hutan Lindung Desa Sudalarang, Kab. Garut',
    luas: 29.78,
  };

  const [petakList, setPetakList] = useState<PetakUkur[]>([
    { id: Date.now(), nomorPetak: 'PU-1', rencana: 0, tumbuh: 0, tinggiRata: '', koordinat: '', keterangan: '' }
  ]);
  const [isGettingLocation, setIsGettingLocation] = useState<number | null>(null);

  const handleAddPetak = () => {
    const newId = petakList.length + 1;
    setPetakList([...petakList, {
      id: Date.now(),
      nomorPetak: `PU-${newId}`,
      rencana: 0, tumbuh: 0, tinggiRata: '', koordinat: '', keterangan: ''
    }]);
  };

  const handleRemovePetak = (removeId: number) => {
    if (petakList.length === 1) return toast.error('Minimal harus ada 1 Petak Ukur.');
    setPetakList(petakList.filter(p => p.id !== removeId));
  };

  const handleChange = (idToChange: number, field: keyof PetakUkur, value: any) => {
    setPetakList(petakList.map(p => p.id === idToChange ? { ...p, [field]: value } : p));
  };

  const handleGetLocation = (getLocationId: number) => {
    if (!("geolocation" in navigator)) return toast.error('Browser tidak mendukung GPS.');
    setIsGettingLocation(getLocationId);
    const loading = toast.loading('Mencari titik koordinat...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        handleChange(getLocationId, 'koordinat', `${lat}, ${lng}`);
        toast.success('Koordinat tersimpan!', { id: loading });
        setIsGettingLocation(null);
      },
      () => {
        toast.error('Gagal mendapatkan GPS. Pastikan izin lokasi aktif.', { id: loading });
        setIsGettingLocation(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const hitungPersenTumbuh = (rencana: number, tumbuh: number) => {
    if (rencana === 0) return "0.00";
    return ((tumbuh / rencana) * 100).toFixed(2);
  };

  const getColorByPercent = (persenStr: string) => {
    const persen = parseFloat(persenStr);
    if (persen === 0) return 'text-gray-400';
    if (persen < 75) return 'text-red-500';
    if (persen > 100) return 'text-blue-600';
    return 'text-[#00A859]';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyKoordinat = petakList.some(p => p.koordinat === '');
    if (hasEmptyKoordinat) {
      toast.error('Gagal menyimpan: Pastikan semua Petak Ukur sudah memiliki titik koordinat GPS.');
      return;
    }

    toast.success('Data Lapangan Berhasil Disimpan & Dikirim ke Kabid untuk Verifikasi!');
    
    setTimeout(() => {
        navigate('/admin/staff/evaluasi/penugasan'); 
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Tugas
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Lembar Evaluasi Lapangan</h1>
            <span className="px-3 py-1 bg-[#FEF3C7] text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">Draft / Proses Input</span>
          </div>
          
          <div className="bg-[#f8fbf9] border border-[#DCECE0] rounded-xl p-5 text-sm text-gray-700 space-y-2">
            <p><span className="font-semibold text-gray-500 inline-block w-32">No. Penugasan</span>: <span className="font-bold">{infoTugas.noSurat}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Program</span>: <span className="font-bold text-[#185325]">{infoTugas.namaProyek}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Lokasi & Luas</span>: <span className="font-bold">{infoTugas.lokasi} ({infoTugas.luas} Ha)</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8 mb-8">
            {petakList.map((petak, index) => {
              const persenStr = hitungPersenTumbuh(petak.rencana, petak.tumbuh);
              const percentColor = getColorByPercent(persenStr);

              return (
                <div key={petak.id} className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm relative group hover:border-[#185325]/30 transition-colors">
                  
                  <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DCECE0] text-[#185325] font-bold text-sm">
                        {index + 1}
                      </span>
                      <input 
                        type="text" 
                        required
                        value={petak.nomorPetak} 
                        onChange={(e) => handleChange(petak.id, 'nomorPetak', e.target.value)} 
                        className="font-bold text-[#185325] text-lg bg-transparent border-b border-transparent focus:border-[#185325] focus:outline-none w-24"
                      />
                    </div>
                    <button type="button" onClick={() => handleRemovePetak(petak.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bibit Rencana (P0)</label>
                          <input type="number" required value={petak.rencana || ''} onChange={(e) => handleChange(petak.id, 'rencana', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:ring-[#185325] outline-none" placeholder="Cth: 110" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bibit Tumbuh</label>
                          <input type="number" required value={petak.tumbuh || ''} onChange={(e) => handleChange(petak.id, 'tumbuh', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:ring-[#185325] outline-none" placeholder="Cth: 98" />
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
                        <span className="text-xs font-bold text-gray-600">Persen Tumbuh</span>
                        <span className={`text-lg font-bold ${percentColor}`}>
                          {persenStr}%
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Rata-Rata Tinggi (cm)</label>
                        <input type="number" step="0.01" required value={petak.tinggiRata} onChange={(e) => handleChange(petak.id, 'tinggiRata', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#185325] outline-none" placeholder="Cth: 123.20" />
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Titik Koordinat PU <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <input type="text" readOnly required value={petak.koordinat} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600 outline-none" placeholder="Titik GPS Belum Diambil..." />
                          <button type="button" onClick={() => handleGetLocation(petak.id)} disabled={isGettingLocation === petak.id} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors disabled:opacity-50">
                            <HiOutlineMapPin className="w-4 h-4" /> Ambil GPS
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Upload Foto Dokumentasi <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type="file" id={`foto-${petak.id}`} required className="hidden" accept="image/*" />
                          <label htmlFor={`foto-${petak.id}`} className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span>Pilih foto lapangan...</span>
                            <HiOutlineCloud className="w-5 h-5 text-[#185325]" />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Catatan / Keterangan Kondisi Tanaman</label>
                        <input type="text" value={petak.keterangan} onChange={(e) => handleChange(petak.id, 'keterangan', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#185325] outline-none" placeholder="Cth: Sebagian daun menguning karena kemarau..." />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mb-10">
            <button type="button" onClick={handleAddPetak} className="px-6 py-2.5 border-2 border-dashed border-[#185325] text-[#185325] hover:bg-[#f0f9f3] text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
              + Tambah Petak Ukur Berikutnya
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button type="submit" className="w-full md:w-auto px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
              <HiOutlineCheckCircle className="w-5 h-5 stroke-2" /> Simpan & Kirim Verifikasi
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InputEvaluasiLapanganStaff;