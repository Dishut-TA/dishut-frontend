import React, { useState } from 'react';
import { HiOutlineDocumentPlus, HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockTugas = [
  { id: 'TGS-001', noSurat: 'ST.76/TKTRH/B/03/2026', perusahaan: 'PT. Jawa Satu Power', lokasi: 'Desa Sudalarang, Kec. Sukawening', tenggat: '2026-03-20', status: 'Menunggu Evaluasi' },
  { id: 'TGS-002', noSurat: 'ST.88/TKTRH/B/03/2026', perusahaan: 'PT. Telkom Indonesia', lokasi: 'Hulu Citarum, Kab. Bandung', tenggat: '2026-03-25', status: 'Selesai' },
];

const KabidPenugasan: React.FC = () => {
  const [data, setData] = useState(mockTugas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({ noSurat: '', perusahaan: '', lokasi: '', luas: '', tenggat: '' });

  const filteredData = data.filter(item => 
    item.perusahaan.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.noSurat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      id: `TGS-00${data.length + 1}`,
      noSurat: formData.noSurat,
      perusahaan: formData.perusahaan,
      lokasi: formData.lokasi,
      tenggat: formData.tenggat,
      status: 'Menunggu Evaluasi'
    };
    setData([newTask, ...data]);
    setIsModalOpen(false);
    toast.success('Surat Tugas berhasil didisposisikan ke Staff PDAS!');
    setFormData({ noSurat: '', perusahaan: '', lokasi: '', luas: '', tenggat: '' });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Penugasan Evaluasi Penanaman</h1>
          <p className="text-sm text-gray-500">Buat dan disposisikan tugas evaluasi lapangan berdasarkan instruksi Kementerian.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" placeholder="Cari Penugasan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <HiOutlineDocumentPlus className="w-5 h-5" /> Buat Tugas Baru
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-225 text-sm text-left">
            <thead className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No. Surat Tugas</th>
                <th className="px-6 py-4 whitespace-nowrap">Pemegang Izin / Perusahaan</th>
                <th className="px-6 py-4 whitespace-nowrap">Lokasi Lahan</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Tenggat Waktu</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{item.noSurat}</td>
                  <td className="px-6 py-4 font-semibold text-[#185325] whitespace-nowrap">{item.perusahaan}</td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{item.lokasi}</td>
                  <td className="px-6 py-4 text-center font-bold text-red-600">{item.tenggat}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${item.status === 'Selesai' ? 'bg-[#e2f1e6] text-[#185325]' : 'bg-[#F2C94C] text-gray-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Form Surat Tugas Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><HiOutlineXMark className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nomor Surat Tugas Kementerian</label>
                <input type="text" required value={formData.noSurat} onChange={e => setFormData({...formData, noSurat: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nama Perusahaan / Pemegang Izin</label>
                <input type="text" required value={formData.perusahaan} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Luas Lahan (Ha)</label>
                    <input type="number" step="0.01" required value={formData.luas} onChange={e => setFormData({...formData, luas: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Tenggat Waktu</label>
                    <input type="date" required value={formData.tenggat} onChange={e => setFormData({...formData, tenggat: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Lokasi Penanaman</label>
                <textarea rows={2} required value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]"></textarea>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-xl shadow-md transition-all">Terbitkan Penugasan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KabidPenugasan;