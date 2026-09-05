import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineMapPin, 
  HiOutlineCloud, 
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

interface PetakUkurForm {
  id: number;
  nomorPetak: string;
  rencana: number;
  tumbuh: number;
  tinggiRata: string;
  koordinat: string;
  keterangan: string;
  foto: File | null;
}

const InputEvaluasiLapanganStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [infoTugas, setInfoTugas] = useState<any>(null);
  const [petakList, setPetakList] = useState<PetakUkurForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/evaluasi/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        const d = json.data;
        const program = d?.penugasanable;

        setInfoTugas({
          noSurat: `TGS-${d?.id}`,
          namaProyek: program?.name || program?.nama_program || '-',
          lokasi: program?.location || program?.lokasi || '-',
          luas: program?.analysisResultZone?.luas_ha || program?.analysis_result_zone?.luas_ha || 0,
        });

        const petaks: PetakUkurForm[] = (d?.petakUkurs || []).map((pu: any) => ({
          id: pu.id,
          nomorPetak: pu.nama,
          rencana: pu.dataTanamans?.length || 0,
          tumbuh: pu.eval_bibit_tumbuh ?? 0,
          tinggiRata: pu.eval_tinggi_rata ?? '',
          koordinat: pu.eval_koordinat ?? '',
          keterangan: pu.eval_keterangan ?? '',
          foto: null,
        }));
        setPetakList(petaks);
      } catch (e) {
        console.error(e);
        toast.error('Gagal memuat data penugasan');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleChange = (idToChange: number, field: keyof PetakUkurForm, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (petakList.length === 0) {
      toast.error('Tidak ada Petak Ukur untuk dievaluasi.');
      return;
    }
    const hasEmptyKoordinat = petakList.some(p => p.koordinat === '');
    if (hasEmptyKoordinat) {
      toast.error('Gagal menyimpan: Pastikan semua Petak Ukur sudah memiliki titik koordinat GPS.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      petakList.forEach((p, index) => {
        formData.append(`petaks[${index}][petak_ukur_id]`, String(p.id));
        formData.append(`petaks[${index}][bibit_tumbuh]`, String(p.tumbuh || 0));
        formData.append(`petaks[${index}][tinggi_rata]`, String(p.tinggiRata || ''));
        formData.append(`petaks[${index}][koordinat]`, p.koordinat);
        formData.append(`petaks[${index}][keterangan]`, p.keterangan || '');
        if (p.foto) {
          formData.append(`petaks[${index}][foto]`, p.foto);
        }
      });

      const res = await fetch(`${API_URL}/evaluasi/${id}/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        toast.success('Data Lapangan Berhasil Disimpan! Status penugasan diperbarui menjadi Selesai.');
        setTimeout(() => {
          navigate('/admin/staff/evaluasi/penugasan');
        }, 1200);
      } else {
        let message = 'Gagal menyimpan data evaluasi';
        try {
          const errJson = await res.json();
          message = errJson.message || Object.values(errJson.errors || {}).flat().join(', ') || message;
        } catch {}
        toast.error(message);
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Memuat data penugasan...</div>;

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
            <p><span className="font-semibold text-gray-500 inline-block w-32">No. Penugasan</span>: <span className="font-bold">{infoTugas?.noSurat}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Program</span>: <span className="font-bold text-[#185325]">{infoTugas?.namaProyek}</span></p>
            <p><span className="font-semibold text-gray-500 inline-block w-32">Lokasi & Luas</span>: <span className="font-bold">{infoTugas?.lokasi} ({infoTugas?.luas} Ha)</span></p>
          </div>
        </div>

        {petakList.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada Petak Ukur pada penugasan Pelaksanaan Penanaman sebelumnya, sehingga tidak ada yang bisa dievaluasi.
          </div>
        ) : (
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
                      <span className="font-bold text-[#185325] text-lg">{petak.nomorPetak}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bibit Rencana (P0)</label>
                          <input type="number" readOnly value={petak.rencana} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-500 bg-gray-100 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bibit Tumbuh <span className="text-red-500">*</span></label>
                          <input type="number" required min={0} value={petak.tumbuh || ''} onChange={(e) => handleChange(petak.id, 'tumbuh', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:ring-[#185325] outline-none" placeholder="Cth: 98" />
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
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Upload Foto Dokumentasi</label>
                        <div className="relative">
                          <input
                            type="file"
                            id={`foto-${petak.id}`}
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleChange(petak.id, 'foto', e.target.files?.[0] || null)}
                          />
                          <label htmlFor={`foto-${petak.id}`} className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span>{petak.foto ? petak.foto.name : 'Ambil / pilih foto lapangan...'}</span>
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

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
              <HiOutlineCheckCircle className="w-5 h-5 stroke-2" /> {isSubmitting ? 'Menyimpan...' : 'Simpan & Selesaikan Evaluasi'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default InputEvaluasiLapanganStaff;