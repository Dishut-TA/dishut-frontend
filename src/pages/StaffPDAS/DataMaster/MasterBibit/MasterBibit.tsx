import React, { useState, useEffect } from 'react';
import { 
  HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlinePencilSquare, 
  HiOutlineTrash, HiXMark, HiOutlineFunnel
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { 
  getBibitsAPI, 
  createBibitAPI, 
  updateBibitAPI,
  type BibitResponseData,
  type BibitPayload
} from '@/services/bibit.service';

const MasterBibit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBibit, setDataBibit] = useState<BibitResponseData[]>([]);

  const [formData, setFormData] = useState({
    namaBibit: '',
    namaLatin: '',
    kategori: '',
  });

  const fetchBibit = async () => {
    try {
      const res = await getBibitsAPI(1);
      setDataBibit(res.payload);
    } catch (error: any) {
      toast.error('Gagal mengambil data master bibit');
    }
  };

  useEffect(() => {
    fetchBibit();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ namaBibit: '', namaLatin: '', kategori: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bibit: BibitResponseData) => {
    setModalMode('edit');
    setSelectedId(bibit.id);
    setFormData({
      namaBibit: bibit.nama,
      namaLatin: bibit.deskripsi || '',
      kategori: bibit.kategori,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus bibit ${nama}?`)) {
      setDataBibit(dataBibit.filter(item => item.id !== id));
      toast.success('Data master bibit berhasil dihapus');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Menyimpan master data bibit...');

    try {
      const payload: BibitPayload = {
        kode: modalMode === 'edit' ? dataBibit.find(b => b.id === selectedId)?.kode || '' : `BBT-${Math.floor(1000 + Math.random() * 9000)}`,
        nama: formData.namaBibit,
        jenis: "Kayu",
        kategori: formData.kategori,
        deskripsi: formData.namaLatin || `Master data bibit ${formData.namaBibit}`, 
        status: "aktif" 
      };

      if (modalMode === 'add') {
        await createBibitAPI(payload);
        toast.success('Bibit baru berhasil ditambahkan', { id: loadingToast });
      } else if (selectedId) {
        await updateBibitAPI(selectedId, payload);
        toast.success('Data bibit berhasil diperbarui', { id: loadingToast });
      }
      
      await fetchBibit();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = dataBibit.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Master Jenis Bibit</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola standar biologis tanaman untuk pedoman evaluasi dan rehabilitasi.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari bibit atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors shadow-sm" 
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-50 transition-colors shadow-sm bg-white">
             <HiOutlineFunnel className="w-5 h-5" />
          </button>
          <button 
            onClick={handleOpenAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-2" /> Tambah Bibit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[#3A4D3F] bg-[#DCECE0] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold w-12 text-center">No</th>
                <th className="px-6 py-4 font-bold">Nama Bibit</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-medium text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{row.nama}</p>
                      <p className="text-xs text-gray-500 italic">{row.deskripsi}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${row.kategori.includes('Kayu') ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                          row.kategori.includes('Buah') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}
                      >
                        {row.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(row)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Data"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id, row.nama)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Hapus Data"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data bibit ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {modalMode === 'add' ? 'Tambah Master Bibit' : 'Edit Master Bibit'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} disabled={isLoading} className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors">
                <HiXMark className="w-5 h-5 stroke-2" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Bibit Lokal <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="Contoh: Mahoni"
                      value={formData.namaBibit}
                      onChange={(e) => setFormData({...formData, namaBibit: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Latin</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Swietenia macrophylla"
                      value={formData.namaLatin}
                      onChange={(e) => setFormData({...formData, namaLatin: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all italic" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori Tanaman <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all cursor-pointer"
                    >
                      <option value="" disabled>Pilih Kategori Tanaman</option>
                      <option value="Kayu-kayuan">Kayu-kayuan</option>
                      <option value="MPTS / Buah">MPTS / Buah</option>
                      <option value="HHBK">HHBK (Bambu, Rotan, dll)</option>
                      <option value="Mangrove / Payau">Mangrove / Payau</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button" 
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-8 py-2.5 text-sm font-bold text-white bg-[#185325] hover:bg-[#123d1c] rounded-full shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                    {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MasterBibit;