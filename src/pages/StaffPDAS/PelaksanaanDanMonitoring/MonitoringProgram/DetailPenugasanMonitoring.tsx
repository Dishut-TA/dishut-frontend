import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineUserGroup, 
  HiOutlineUser, 
  HiOutlineInformationCircle,
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineHomeModern,
  HiOutlineCalendarDays
} from 'react-icons/hi2';
import { HiCheckCircle } from 'react-icons/hi';
import { PiPlant } from 'react-icons/pi';

const DetailPenugasanMonitoring: React.FC = () => {
  const navigate = useNavigate();

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start text-sm gap-1 sm:gap-2">
      <div className="flex items-center justify-between sm:w-37.5 shrink-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="hidden sm:inline text-gray-500">:</span>
      </div>
      <span className="font-bold text-gray-800 wrap-break-words flex-1">{value}</span>
    </div>
  );

  const SubCardRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-start gap-3 text-[11px]">
      <span className="text-gray-500 font-medium shrink-0">{label}</span>
      <span className="font-bold text-gray-800 text-right wrap-break-words">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 mt-1">Detail Penugasan Monitoring</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
          <span className="font-bold text-gray-800 text-base md:text-lg wrap-break-words">Program Rehabilitasi Mangrove Karangsong</span>
          <span className="px-3 py-1 text-xs font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] rounded-full shrink-0">
            Siap Monitoring
          </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        <div className="w-full xl:w-[calc(100%-350px)] flex flex-col gap-6 min-w-0">
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-base font-bold text-gray-800 mb-6">Informasi Program</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5 min-w-0">
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="ID Program" value="PRG-2026-0007" />
                  <DataRow label="Nama Program" value="Rehabilitasi Mangrove Karangsong" />
                  <DataRow label="Jenis Program" value="Rehabilitasi Mangrove" />
                  <DataRow label="Sumber Dana" value="APBD" />
                  <DataRow label="Lokasi Program" value="Desa Karangsong, Kec. Indramayu" />
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <DataRow label="Tanggal Pelaksanaan" value="12 Juli 2026" />
                  <DataRow label="Tanggal Selesai" value="15 September 2026" />
                  <DataRow label="Luas Area" value="4,2 Ha" />
                  <DataRow label="Target Tanam" value="2.500 Pohon" />
                  <DataRow label="Jumlah Bibit" value="2.500" />
                </div>
              </div>

            </div>
                <div className="w-full mt-6 lg:w-70 h-50 lg:h-auto min-h-40 bg-[#EBF3FA] rounded-xl border border-gray-200 overflow-hidden relative flex flex-col shrink-0 group">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" 
                  alt="Map" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                />
                <HiOutlineMapPin className="w-10 h-10 text-red-500 drop-shadow-md relative z-10 m-auto" />
                <div className="absolute bottom-0 inset-x-0 bg-white p-3 text-center border-t border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-800 truncate">Desa Karangsong, Kec. Indramayu</p>
                  <a href="#" className="text-xs text-blue-600 font-bold flex items-center justify-center gap-1 mt-1.5 hover:underline">
                    <HiOutlineMap className="w-4 h-4"/> Lihat di Peta
                  </a>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <HiOutlineUserGroup className="w-6 h-6 text-emerald-600 shrink-0"/>
                <h3 className="text-sm font-bold text-gray-800">Data Pelaksanaan (KTH)</h3>
              </div>
              <div className="space-y-3">
                <SubCardRow label="Nama KTH" value="KTH Karangsong Lestari" />
                <SubCardRow label="Ketua" value="Bapak Dedi Kurniawan" />
                <SubCardRow label="Jumlah Anggota" value="18 Orang" />
                <SubCardRow label="Jumlah Bibit" value="2.500" />
                <SubCardRow label="Target Tanam" value="2.500 Pohon" />
                <SubCardRow label="Luas Area" value="4,2 Ha" />
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <HiOutlineUser className="w-6 h-6 text-emerald-600 shrink-0"/>
                <h3 className="text-sm font-bold text-gray-800">Penyuluh Penanggung Jawab</h3>
              </div>
              <div className="space-y-3">
                <SubCardRow label="Nama" value="Ahmad Fauzi" />
                <SubCardRow label="NIP" value="1987 0321 201403 1 002" />
                <SubCardRow label="Wilayah" value="Indramayu" />
                <SubCardRow label="No HP" value="08xxxxxxxxxx" />
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <HiOutlineHomeModern className="w-6 h-6 text-emerald-600 shrink-0"/>
                <h3 className="text-sm font-bold text-gray-800">Kelompok Tani Hutan (KTH)</h3>
              </div>
              <div className="space-y-3">
                <SubCardRow label="Nama KTH" value="KTH Karangsong Lestari" />
                <SubCardRow label="Ketua" value="Bapak Dedi Kurniawan" />
                <SubCardRow label="Jumlah Anggota" value="18 Orang" />
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-10">
            <div className="flex-1 flex flex-col gap-5 min-w-0">
              <h2 className="text-base font-bold text-gray-800 mb-2">Penugasan Monitoring</h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-50 shrink-0">Periode Monitoring <span className="text-red-500">*</span></label>
                <div className="relative flex-1 w-full">
                  <input type="text" value="Mei 2026 - Agustus 2026" className="w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none" readOnly/>
                  <HiOutlineCalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-50 shrink-0">Tanggal Monitoring Pertama <span className="text-red-500">*</span></label>
                <input type="date" defaultValue="2026-05-27" className="flex-1 w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-50 shrink-0">Deadline Pengiriman Hasil <span className="text-red-500">*</span></label>
                <input type="date" defaultValue="2026-06-10" className="flex-1 w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-50 shrink-0">Prioritas <span className="text-red-500">*</span></label>
                <select className="flex-1 w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer">
                  <option>Tinggi</option>
                  <option>Sedang</option>
                  <option>Rendah</option>
                </select>
              </div>

            <div className="w-full lg:w-70 space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 lg:border-none lg:bg-transparent lg:p-0">
              <h3 className="text-sm font-bold text-gray-800 mb-5 lg:pt-2">Checklist Monitoring</h3>
              <div className="space-y-4 text-sm font-bold text-gray-700">
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Kondisi Tanaman</div>
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Dokumentasi Foto</div>
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Koordinat Geotag</div>
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Jumlah Tanaman Hidup</div>
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Jumlah Tanaman Mati</div>
                <div className="flex items-center gap-3"><HiCheckCircle className="text-[#185325] w-5 h-5 shrink-0"/> Catatan Lapangan</div>
              </div>
            </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-sm font-bold text-gray-700">Catatan Penugasan</label>
                <textarea 
                  rows={4} 
                  className="w-full text-sm px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none resize-none" 
                  defaultValue="Pastikan seluruh titik tanaman dimonitoring dan hasil dokumentasi sesuai kondisi lapangan."
                ></textarea>
              </div>
            </div>


          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button 
              onClick={() => navigate(-1)} 
              className="w-full sm:w-auto px-8 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Batal
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-3 bg-[#185325] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#123d1c] transition-colors cursor-pointer"
            >
              Simpan Penugasan
            </button>
          </div>

        </div>

        <div className="w-full xl:w-77.5 flex flex-col gap-6 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 sticky top-6">
             <h2 className="text-base font-bold text-gray-800 mb-2">Ringkasan Penugasan</h2>
             <div className="space-y-5">
               <div className="flex items-start gap-4">
                 <PiPlant className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-500 font-medium">Program</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 leading-snug wrap-break-words">Rehabilitasi Mangrove Karangsong</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-500 font-medium">ID Program</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 wrap-break-words">PRG-2026-0007</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <HiOutlineUser className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-500 font-medium">Penyuluh</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 wrap-break-words">Ahmad Fauzi</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <HiOutlineHomeModern className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-500 font-medium">KTH</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 wrap-break-words">KTH Karangsong Lestari</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <HiOutlineMapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-500 font-medium">Lokasi</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 leading-snug wrap-break-words">Desa Karangsong, Kec. Indramayu</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <HiOutlineCalendarDays className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>
                 <div className="min-w-0 flex-1">
                   <p className="text-[11px] text-gray-500 font-medium">Status Saat Ini</p>
                   <span className="inline-block mt-1.5 px-3 py-1 text-[11px] font-bold bg-[#EBF8F1] text-[#185325] border border-[#C6EBD6] rounded-full">Siap Monitoring</span>
                 </div>
               </div>
               <div className="pl-9 pt-2">
                 <p className="text-[11px] text-gray-500 font-medium">Akan Berubah Menjadi</p>
                 <span className="inline-block mt-1.5 px-3 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-full">Dalam Monitoring</span>
               </div>
             </div>

            <div className="bg-[#F4F8FB] border border-[#D1E4F5] rounded-xl p-5 flex flex-col gap-2 shadow-sm mt-4">
              <div className="flex items-center gap-2 text-blue-700">
                <HiOutlineInformationCircle className="w-5 h-5 shrink-0"/>
                <span className="font-bold text-sm">Informasi</span>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Setelah penugasan disimpan, notifikasi akan dikirim kepada penyuluh untuk melakukan monitoring lapangan sesuai periode yang ditentukan.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DetailPenugasanMonitoring;