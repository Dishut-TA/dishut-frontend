import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineDocumentArrowDown, HiOutlineCheckBadge, HiOutlineMapPin } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getStoredPenugasanDetail, type PenugasanItem } from './dummyData';

const DetailInisiasiPenugasan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<PenugasanItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = () => {
      setIsLoading(true);
      try {
        if (id) {
          const item = getStoredPenugasanDetail(id);
          if (item) {
            setDetailData(item);
          } else {
            toast.error('Data penugasan tidak ditemukan.');
          }
        }
      } catch (error: any) {
        console.error('Error fetching detail:', error);
        toast.error('Gagal memuat detail penugasan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDownloadSurat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (detailData?.file_surat_url && detailData.file_surat_url !== '#') {
      window.open(detailData.file_surat_url, '_blank');
    } else {
      toast.success('Mengunduh Surat Tugas Resmi Tim Penilai...');
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500 font-medium animate-pulse">
        Memuat detail dokumen penugasan...
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="p-16 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">Data penugasan tidak ditemukan.</p>
        <button
          onClick={() => navigate('/admin/kabid/evaluasi/penugasan')}
          className="px-6 py-2.5 bg-[#185325] text-white rounded-full text-sm font-semibold hover:bg-[#123d1c] transition-colors"
        >
          Kembali ke Daftar Penugasan
        </button>
      </div>
    );
  }

  const isAssigned = (detailData.status_surat || '').toUpperCase() === 'TELAH DITUGASKAN';

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/admin/kabid/evaluasi/penugasan')} 
        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] self-start transition-colors cursor-pointer"
      >
        <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Daftar Penugasan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Detail Penugasan Evaluasi</h1>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              isAssigned 
                ? 'bg-emerald-50 text-[#185325] border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <HiOutlineCheckBadge className="w-4 h-4" /> {detailData.status_surat || 'TELAH DITUGASKAN'}
            </span>
          </div>
          <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-xl">
            <p className="text-xs text-gray-500 font-medium">ID Penugasan</p>
            <p className="text-sm font-bold font-mono text-gray-800">{detailData.id_penugasan || detailData.id || id}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4">Informasi Surat & Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 bg-gray-50/80 border border-gray-100 rounded-2xl p-6">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Nomor Surat Tugas</p>
              <p className="text-sm font-bold font-mono text-gray-800">{detailData.nomor_surat || detailData.noSurat || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Surat</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggal_surat || detailData.tanggalSurat || '-'}</p>
            </div>
            <div className="md:col-span-2 border-t border-gray-200/80 pt-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Program Rehabilitasi</p>
              <p className="text-base font-bold text-gray-800">{detailData.nama_proyek || detailData.proyek}</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                <HiOutlineMapPin className="w-4 h-4 text-[#185325] shrink-0" />
                <span>{detailData.lokasi}</span>
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-700">{detailData.luas_ha || detailData.luas} Hektar</span>
                <span className="text-gray-300">•</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  detailData.jenis_program === 'APBD' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {detailData.jenis_program}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Tahap / Periode Evaluasi</p>
              <p className="text-sm font-bold text-gray-800">{detailData.periode_evaluasi || detailData.periode || detailData.status_program}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Dokumen Surat Tugas</p>
              <button
                type="button"
                onClick={handleDownloadSurat}
                className="text-sm font-bold text-[#185325] hover:text-[#123d1c] hover:underline flex items-center gap-1.5 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit"
              >
                <HiOutlineDocumentArrowDown className="w-4 h-4" /> Lihat & Unduh Surat Tugas (PDF)
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Periode Pelaksanaan Evaluasi Mulai</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggal_mulai || detailData.tanggal_awal || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Periode Pelaksanaan Evaluasi Selesai</p>
              <p className="text-sm font-bold text-gray-800">{detailData.tanggal_selesai || detailData.tanggal_akhir || '-'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#185325] uppercase tracking-wider mb-4">Susunan Tim Penilai Lapangan</h3>
          <div className="overflow-hidden border border-gray-200 rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fbf9] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Anggota</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5 text-center">Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailData.tim_penilai && detailData.tim_penilai.length > 0 ? (
                  detailData.tim_penilai.map((anggota: any, idx: number) => {
                    const isKetua = anggota.peran === 'Ketua Tim';
                    const isSekretaris = anggota.peran === 'Sekretaris Tim';

                    return (
                      <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">{anggota.nama}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{anggota.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isKetua 
                              ? 'bg-[#DCECE0] text-[#185325] border border-[#C6EBD6]' 
                              : isSekretaris
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {anggota.peran}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-gray-400">
                      Tidak ada data personil tim penilai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailInisiasiPenugasan;