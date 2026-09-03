import React, { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineEye, HiOutlinePencil, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getZonasisAPI, uploadZonasiAPI, type ZonasiData } from '@/services/zonasi.service';

const DataZonasi: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [tableData, setTableData] = useState<ZonasiData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getZonasisAPI();
      setTableData(data);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data Zonasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const safeTableData = Array.isArray(tableData) ? tableData : [];
  const filteredData = safeTableData.filter(row => 
    row?.kabupaten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row?.kecamatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row?.desa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'zip') {
        toast.error('Format salah! Wajib mengunggah file .zip');
        e.target.value = ''; 
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Silakan pilih file .zip terlebih dahulu!');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Mengekstrak file spasial...');

    try {
      const formData = new FormData();
      formData.append('file_zonasi', selectedFile);

      await uploadZonasiAPI(formData);

      toast.success('Data Zonasi berhasil ditambahkan!', { id: loadingToast });
      setIsModalOpen(false);
      
      setSelectedFile(null);
      setCurrentPage(1);
      
      fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal mengunggah file', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Data Zonasi</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari Wilayah..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#185325] focus:border-[#185325] outline-none transition-colors shadow-sm" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-sm active:scale-95 whitespace-nowrap"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-2" /> Tambah Zonasi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-center text-sm whitespace-nowrap">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">Kabupaten/Kota</th>
                <th className="px-6 py-4 font-bold">Kecamatan</th>
                <th className="px-6 py-4 font-bold">Desa/Kelurahan</th>
                <th className="px-6 py-4 font-bold">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-gray-500 font-medium animate-pulse">Memuat data...</td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-700">{row.kabupaten || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{row.kecamatan || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{row.desa || '-'}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button className="text-gray-400 hover:text-[#185325] transition-colors">
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-[#185325] transition-colors">
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-gray-500 font-medium">Tidak ada data Zonasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredData.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Menampilkan <span className="font-bold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> hingga <span className="font-bold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-bold text-gray-700">{filteredData.length}</span> data
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm"
              >
                Sebelumnya
              </button>
              <span className="text-sm font-bold text-[#185325] px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Input Data Zonasi (SHP)</h2>
              <button 
                onClick={() => !isUploading && setIsModalOpen(false)} 
                disabled={isUploading}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleUploadSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Peta Batas Wilayah <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  required
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                />
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  *Wajib unggah file berformat <b>.zip</b> yang berisi kumpulan file Shapefile (.shp, .dbf, dll).
                </p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isUploading || !selectedFile}
                  className="w-full bg-[#185325] hover:bg-[#123d1c] text-white py-3 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-md disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Mengekstrak Data...
                    </>
                  ) : 'Proses Data Zonasi'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataZonasi;