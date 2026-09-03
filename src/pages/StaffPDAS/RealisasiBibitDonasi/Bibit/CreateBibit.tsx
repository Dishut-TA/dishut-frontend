import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { 
  getBibitsAPI,
  createSeedSpecificationAPI,
  updateSeedSpecificationAPI,
  getSeedSpecificationsAPI,
  type BibitResponseData 
} from '@/services/bibit.service';

const HEIGHT_MAP: Record<string, { min: number, max: number }> = {
  '30-60 cm': { min: 30, max: 60 },
  '61-100 cm': { min: 61, max: 100 },
  '70-100 cm': { min: 70, max: 100 },
  '> 100 cm': { min: 101, max: 0 }
};

const CreateBibit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Menangkap ID dari URL (jika ada, berarti mode Edit)
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState({ fetch: true, submit: false });
  const [bibitList, setBibitList] = useState<BibitResponseData[]>([]);
  const [specIdToEdit, setSpecIdToEdit] = useState<number | null>(null);

  const [form, setForm] = useState({
    bibitId: '',
    kategori: '',
    tinggiBibit: '30-60 cm',
    stokAwal: '',
    harga: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bibitRes, specRes] = await Promise.all([
          getBibitsAPI(1),
          getSeedSpecificationsAPI()
        ]);

        setBibitList(bibitRes.payload);

        if (isEditMode) {
          // Cari spesifikasi berdasarkan ID spec yang dilempar dari DetailBibit
          const currentSpec = specRes.payload.find((s: any) => s.id.toString() === id);
          if (currentSpec) {
            setSpecIdToEdit(currentSpec.id);
            const parentBibit = bibitRes.payload.find(b => b.id === currentSpec.seed_id);
            
            let tinggiKey = '30-60 cm';
            if (currentSpec.min_height === 61) tinggiKey = '61-100 cm';
            else if (currentSpec.min_height === 70) tinggiKey = '70-100 cm';
            else if (currentSpec.min_height > 100 || currentSpec.max_height === 0) tinggiKey = '> 100 cm';

            setForm({
              bibitId: currentSpec.seed_id.toString(),
              kategori: parentBibit ? parentBibit.kategori : '',
              tinggiBibit: tinggiKey,
              stokAwal: currentSpec.stock.toString(),
              harga: currentSpec.price.toString()
            });
          }
        } else {
          if (bibitRes.payload.length > 0) {
            setForm(prev => ({ ...prev, bibitId: bibitRes.payload[0].id.toString(), kategori: bibitRes.payload[0].kategori }));
          }
        }
      } catch {
        toast.error("Gagal memuat data.");
      } finally {
        setIsLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const getTinggiOptions = (kat: string) => 
    (kat.includes('Buah') || kat.includes('MPTS')) ? ['70-100 cm', '> 100 cm'] : ['30-60 cm', '61-100 cm', '> 100 cm'];

  const handleBibitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const bibit = bibitList.find(b => b.id.toString() === selectedId);
    if (!bibit) return;

    const validOptions = getTinggiOptions(bibit.kategori);
    setForm(prev => ({
      ...prev,
      bibitId: selectedId,
      kategori: bibit.kategori,
      tinggiBibit: validOptions.includes(prev.tinggiBibit) ? prev.tinggiBibit : validOptions[0]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bibitId || !form.harga || !form.stokAwal) {
      return toast.error('Pastikan semua form telah diisi.');
    }

    setIsLoading(prev => ({ ...prev, submit: true }));
    const loadingToast = toast.loading(isEditMode ? 'Memperbarui spesifikasi bibit...' : 'Menyimpan spesifikasi varian bibit...');
    
    const { min, max } = HEIGHT_MAP[form.tinggiBibit] || { min: 0, max: 0 };

    try {
      const payload = {
        seed_id: Number(form.bibitId),
        min_height: min, 
        max_height: max, 
        stock: Number(form.stokAwal),
        price: Number(form.harga)
      };

      if (isEditMode && specIdToEdit) {
        await updateSeedSpecificationAPI(specIdToEdit, payload);
        toast.success('Spesifikasi bibit berhasil diperbarui!', { id: loadingToast });
      } else {
        await createSeedSpecificationAPI(payload);
        toast.success('Spesifikasi bibit berhasil ditambahkan!', { id: loadingToast });
      }
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (isLoading.fetch) {
    return <div className="w-full text-center py-20 text-gray-500 font-bold animate-pulse">Memuat referensi bibit...</div>;
  }

  return (
    <div className="w-full mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Spesifikasi Varian Bibit' : 'Tambah Spesifikasi Varian Bibit'}</h1>
          <p className="text-sm text-gray-500">Pilih master bibit dan definisikan spesifikasi ukuran, stok awal, serta harganya.</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            <div className="bg-greenAdmin p-6 rounded-2xl space-y-6">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Referensi Master Bibit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Nama Bibit <span className="text-red-500">*</span></label>
                  <select required value={form.bibitId} onChange={handleBibitChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold">
                    {bibitList.map(b => <option key={b.id} value={b.id}>{b.nama} {b.deskripsi ? `(${b.deskripsi})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori (Auto-fill)</label>
                  <input disabled type="text" value={form.kategori} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider">Manajemen Ukuran, Harga & Stok</h3>
                <p className="text-xs text-gray-500 mt-1">Satu varian ukuran (tinggi bibit) merepresentasikan satu SKU / varian unik.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tinggi Bibit <span className="text-red-500">*</span></label>
                  <select value={form.tinggiBibit} onChange={e => setForm({...form, tinggiBibit: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-[#185325] focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]">
                    {getTinggiOptions(form.kategori).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stok Tersedia <span className="text-red-500">*</span></label>
                  <input type="number" required value={form.stokAwal} onChange={e => setForm({...form, stokAwal: e.target.value})} placeholder="Contoh: 1000" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga Per Batang <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input type="number" required value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} placeholder="15000" className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-[#185325] focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors">Batal</button>
            <button type="submit" disabled={isLoading.submit} className="px-8 py-3 rounded-xl bg-[#185325] hover:bg-[#123d1c] text-white font-bold transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading.submit ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-xl animate-spin"></span> : null}
              {isLoading.submit ? 'Menyimpan...' : (isEditMode ? 'Perbarui Spesifikasi' : 'Simpan Spesifikasi Bibit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBibit;