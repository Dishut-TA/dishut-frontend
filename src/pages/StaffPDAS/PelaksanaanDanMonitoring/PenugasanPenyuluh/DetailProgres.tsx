import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineCheckCircle, 
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineCamera,
  HiOutlinePencilSquare,
  HiOutlineChevronDown
} from 'react-icons/hi2';

const DetailProgres: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12">
      <div className="flex flex-col gap-3 items-start">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#185325] transition-colors cursor-pointer">
          <HiOutlineArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Progres Pelaksanaan Kegiatan</h1>
          <p className="text-sm text-gray-500 mt-1">Halaman ini digunakan untuk memantau progres pelaksanaan kegiatan rehabilitasi yang ditugaskan kepada penyuluh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl pointer-events-none"></div>

            <h2 className="text-sm font-bold text-[#185325] mb-5 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5" /> Informasi Penugasan
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-xs">
              <div>
                <p className="text-gray-500 mb-1">ID Program</p>
                <p className="font-bold text-gray-800">PRG-2026-0025</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nama Program</p>
                <p className="font-bold text-gray-800">Rehabilitasi Mata Air</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Sumber Dana</p>
                <p className="font-bold text-gray-800">CSR</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Batas Waktu</p>
                <p className="font-bold text-gray-800">28 Agu 2026</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Lokasi Program</p>
                <p className="font-bold text-gray-800">Blok Cipeundeuy, Kec. Bandung Barat</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">KTH Terlibat</p>
                <p className="font-bold text-gray-800">KTH Tirta Lestari</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Jenis Kegiatan</p>
                <p className="font-bold text-gray-800">Konservasi</p>
              </div>
              <div className="md:row-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-gray-500 mb-1 font-bold">Catatan Penugasan</p>
                <p className="font-bold text-gray-700 leading-relaxed">
                  Pastikan seluruh dokumentasi, koordinat, dan laporan kegiatan sudah lengkap sebelum konfirmasi selesai.
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Penyuluh Ditugaskan</p>
                <p className="font-bold text-gray-800">Dedi Kurniawan</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status Penugasan</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                  Siap Dikonfirmasi
                </span>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Tanggal Mulai</p>
                <p className="font-bold text-gray-800">10 Jun 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-blue-700 mb-6 flex items-center gap-2">
               <HiOutlineCheckCircle className="w-5 h-5" /> Progres Kegiatan
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className="w-full md:w-1/3 flex flex-col p-2">
                <span className="text-gray-500 text-xs font-bold mb-1">Realisasi</span>
                <span className="text-4xl font-extrabold text-[#185325]">100%</span>
                <span className="text-[11px] text-gray-500 font-bold mt-1">500 / 500 target kegiatan</span>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                  <div className="bg-[#185325] h-2.5 rounded-full w-full"></div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                  <HiOutlineCheckCircle className="w-4 h-4" /> Target kegiatan telah tercapai
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-bold">Tahapan Kegiatan</th>
                      <th className="pb-3 font-bold text-center">Progres</th>
                      <th className="pb-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-bold">
                    <tr>
                      <td className="py-3">1. Persiapan</td>
                      <td className="py-3 text-center">100%</td>
                      <td className="py-3 text-center">
                        <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">Selesai</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">2. Pelaksanaan Kegiatan</td>
                      <td className="py-3 text-center">100%</td>
                      <td className="py-3 text-center">
                         <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">Selesai</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">3. Dokumentasi & Pelaporan Lapangan</td>
                      <td className="py-3 text-center">100%</td>
                      <td className="py-3 text-center">
                        <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">Lengkap</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
             <h2 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
               <HiOutlineCamera className="w-5 h-5" /> Dokumentasi Lapangan
            </h2>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop" alt="Dokumentasi 1" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
              <img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=300&h=200&fit=crop" alt="Dokumentasi 2" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop" alt="Dokumentasi 3" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
              <img src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=300&h=200&fit=crop" alt="Dokumentasi 4" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
              
              <button className="w-32 h-24 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 transition-colors shrink-0 cursor-pointer">
                Lihat Semua
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-xl transition-colors cursor-pointer">
                <HiOutlinePencilSquare className="w-4 h-4" /> Ubah Penugasan
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-colors cursor-pointer">
                Menu Lainnya <HiOutlineChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
              <HiOutlineInformationCircle className="w-5 h-5 text-gray-500" /> Informasi Program
            </h2>
            
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-gray-500 mb-1.5">Jenis Program</p>
                <p className="font-bold text-gray-800">CSR</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1.5">Status Program Saat Ini</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  Berjalan
                </span>
              </div>
              <div>
                <p className="text-gray-500 mb-1.5">Status Program Setelah Selesai</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                  Siap Monitoring
                </span>
              </div>
            </div>

            <div className="mt-5 bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 text-xs text-blue-800 leading-relaxed">
              <HiOutlineInformationCircle className="w-5 h-5 shrink-0 text-blue-500" />
              <p>Setelah pelaksanaan dikonfirmasi selesai, status program akan berubah menjadi <strong>Siap Monitoring</strong>.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-[#185325] mb-5 flex items-center gap-2">
               <HiOutlineCheckCircle className="w-5 h-5" /> Kelengkapan Data
            </h2>
            
            <div className="space-y-3.5 text-xs font-bold text-gray-700">
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Foto dokumentasi</div>
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Koordinat kegiatan</div>
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Data progres kegiatan</div>
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Catatan lapangan</div>
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Jumlah realisasi</div>
              <div className="flex items-center gap-3"><HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> Tidak ada kendala terbuka</div>
            </div>
            
            <button className="w-full mt-8 py-3 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer">
              Konfirmasi Pelaksanaan Selesai
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-3 px-2 leading-relaxed">
              Setelah dikonfirmasi, penugasan akan berubah menjadi Selesai dan status program menjadi Siap Monitoring.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailProgres;