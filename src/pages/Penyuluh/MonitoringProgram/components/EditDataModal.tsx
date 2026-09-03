import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlineXMark, HiOutlineInformationCircle, HiOutlineCamera } from 'react-icons/hi2';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
const STORAGE_BASE_URL = API_URL.replace(/\/api\/?$/, '');

interface TanamanItem {
  id: number;
  nama_tanaman: string | null;
  jumlah: number;
  kondisi_tanaman: string | null;
  keterangan: string | null;
  foto_url: string | null;
}

interface Props {
  item: TanamanItem;
  penugasanId: string | number;
  onClose: () => void;
  onSaved: () => void;
}

const KONDISI_OPTIONS = ['Sehat', 'Perlu Perawatan', 'Mati / Rusak'];

const EditDataModal: React.FC<Props> = ({ item, penugasanId, onClose, onSaved }) => {
  const [kondisi, setKondisi] = useState(item.kondisi_tanaman || KONDISI_OPTIONS[0]);
  const [keterangan, setKeterangan] = useState(item.keterangan || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(item.foto_url);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      let fotoUrl = item.foto_url;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jenis_dokumentasi', 'monitoring_tanaman');
        formData.append('keterangan', `Update monitoring tanaman #${item.id}`);

        const uploadRes = await axios.post(
          `${API_URL}/penugasan/${penugasanId}/dokumentasi`,
          formData,
          { headers: { ...authHeader, 'Content-Type': 'multipart/form-data' } }
        );
        const filePath = uploadRes.data?.data?.file_path;
        if (filePath) fotoUrl = `${STORAGE_BASE_URL}/storage/${filePath}`;
      }

      await axios.put(
        `${API_URL}/tanaman/${item.id}`,
        {
          kondisi_tanaman: kondisi,
          keterangan,
          foto_url: fotoUrl,
        },
        { headers: authHeader }
      );

      toast.success('Perubahan berhasil disimpan.');
      onSaved();
    } catch (err: any) {
      console.error('Gagal memperbarui data monitoring:', err);
      toast.error(err?.response?.data?.message || 'Gagal memperbarui data monitoring.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit Hasil Monitoring</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <HiOutlineXMark className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-5">
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex gap-3 items-center">
            <HiOutlineInformationCircle className="w-5 h-5 text-[#00A859] shrink-0" />
            <p className="text-xs font-bold text-[#185325]">
              Data Tanaman #{item.id} &middot; {item.nama_tanaman || 'Jenis tidak diketahui'} &middot; Jumlah: {item.jumlah}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Kondisi Tanaman <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {KONDISI_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setKondisi(opt)}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold border transition-colors ${
                    kondisi === opt
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-xl p-4 flex flex-col">
            <label className="text-xs font-bold text-gray-800 block mb-0.5">Foto Monitoring</label>
            <p className="text-[10px] text-gray-500 font-medium mb-3">Ganti foto jika ada pembaruan (opsional)</p>
            {preview ? (
              <img src={preview} className="w-full h-40 object-cover rounded-lg mb-3" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 border border-dashed border-gray-200 rounded-lg mb-3">
                <HiOutlineCamera className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-xs font-bold text-gray-400">Belum ada foto</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">Catatan Monitoring</label>
            <textarea
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Tuliskan catatan tambahan jika diperlukan..."
              className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} disabled={saving} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50">Batal</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-[#185325] text-white text-xs font-bold rounded-xl hover:bg-[#123d1c] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDataModal;
