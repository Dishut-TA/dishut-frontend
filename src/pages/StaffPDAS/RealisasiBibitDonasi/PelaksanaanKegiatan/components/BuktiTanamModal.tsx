import React, { useEffect, useState } from 'react';
import { HiOutlineXMark, HiOutlineCheckCircle, HiOutlinePhoto } from 'react-icons/hi2';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { KegiatanData } from '../PelaksanaanKegiatan';

interface BuktiTanamModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KegiatanData | null;
}

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage';
const API_URL = import.meta.env.VITE_API_EXAMPLE || 'http://127.0.0.1:8000/api';

const resolveUrl = (url: string | null | undefined, filePath: string | null | undefined): string | null => {
  if (url) return url;
  if (!filePath) return null;
  return filePath.startsWith('http') ? filePath : `${STORAGE_URL}/${filePath}`;
};

const BuktiTanamModal: React.FC<BuktiTanamModalProps> = ({ isOpen, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    if (!isOpen) setSelectedIdx(0);
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const fotoList = (data.dokumentasiPenanaman || [])
    .map((d: any) => ({
      url: resolveUrl(d.url, d.file_path),
      jenis: d.jenis_dokumentasi || 'Dokumentasi',
      keterangan: d.keterangan || '',
    }))
    .filter((d: any) => d.url);

  const handleKonfirmasi = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Mengkonfirmasi realisasi...');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('seed_status', 'Terealisasi');
      formData.append('_method', 'PUT');
      await axios.post(`${API_URL}/donations/${data.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Status berhasil diubah menjadi Terealisasi!', { id: toastId });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengkonfirmasi realisasi', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bukti Realisasi Penanaman</h2>
            <p className="text-xs text-gray-500 mt-0.5">{data.program} · {data.namaDonatur}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {fotoList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <HiOutlinePhoto className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">Belum ada dokumentasi penanaman</p>
              <p className="text-xs mt-1">Penyuluh belum mengupload foto dokumentasi kegiatan</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <img
                  src={fotoList[selectedIdx].url!}
                  alt={fotoList[selectedIdx].jenis}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                    {fotoList[selectedIdx].jenis}
                  </span>
                  {fotoList[selectedIdx].keterangan && (
                    <p className="text-xs text-gray-600">{fotoList[selectedIdx].keterangan}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{selectedIdx + 1} / {fotoList.length}</span>
              </div>
              {fotoList.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {fotoList.map((foto: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        i === selectedIdx ? 'border-[#185325] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={foto.url!} alt={foto.jenis} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-gray-500">
            {fotoList.length > 0
              ? `${fotoList.length} foto dokumentasi dari tahap Pelaksanaan Penanaman`
              : 'Konfirmasi realisasi tanpa foto bukti'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleKonfirmasi}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg transition-colors ${
                isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#185325] hover:bg-[#123d1c] text-white cursor-pointer shadow-sm'
              }`}
            >
              <HiOutlineCheckCircle className="w-4 h-4" />
              {isLoading ? 'Menyimpan...' : 'Konfirmasi Terealisasi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuktiTanamModal;
