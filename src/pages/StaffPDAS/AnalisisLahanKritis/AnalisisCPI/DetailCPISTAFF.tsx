import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineMapPin, 
  HiOutlineBuildingLibrary,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
} from 'react-icons/hi2';

const DetailCPISTAFF: React.FC = () => {
  const navigate = useNavigate();

  const detailData = {
    cdk: 'CDK V',
    kabupaten: 'Kota Bandung',
    kecamatan: 'Coblong',
    desa: 'Sekeloa Tengah',
    statusKekritisan: 'Sangat Kritis',
    skorCPI: '1-5',
    rekomendasi: 'Agroforestry',
    namaKTH: 'KTH Rimba',
    namaKetua: 'Asep Rohman',
    jenisUsaha: 'Agroforestry'
  };

  const isKritis = detailData.statusKekritisan.toLowerCase().includes('kritis');
  const isSangatKritis = detailData.statusKekritisan.toLowerCase() === 'sangat kritis';

  return (
    <div className="w-full mx-auto pb-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#185325] transition-colors mb-6 group w-fit"
      >
        <div className="p-1.5 group-hover:bg-[#EBF8F1] transition-colors">
          <HiOutlineChevronLeft className="w-4 h-4 stroke-2" />
        </div>
        Kembali ke Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Detail Informasi Analisis CPI</h1>
          <p className="text-sm text-gray-500 mt-1.5">Rincian data spasial dan profil wilayah evaluasi.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 ${
          isSangatKritis ? 'bg-red-50/50' : 
          isKritis ? 'bg-yellow-50/50' : 'bg-[#f8fbf9]'
        }`}>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
            <HiOutlineChartBar className="w-4 h-4" /> Indikator Analisis CPI
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold mb-1.5">Status Kekritisan</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSangatKritis ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isSangatKritis ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                </span>
                <h4 className={`text-xl font-bold ${isSangatKritis ? 'text-red-600' : isKritis ? 'text-yellow-600' : 'text-green-600'}`}>
                  {detailData.statusKekritisan}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold mb-1.5">Skor CPI Rata-rata</p>
              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {detailData.skorCPI}
              </h4>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold mb-1.5">Rekomendasi Intervensi</p>
              <h4 className="text-xl font-bold text-[#185325]">
                {detailData.rekomendasi}
              </h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <HiOutlineMapPin className="w-4 h-4" /> Informasi Wilayah Administrasi
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Cabang Dinas</p>
                <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <HiOutlineBuildingLibrary className="w-4 h-4 text-gray-400" /> {detailData.cdk}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Kabupaten/Kota</p>
                <p className="text-sm font-bold text-gray-800">{detailData.kabupaten}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Kecamatan</p>
                <p className="text-sm font-bold text-gray-800">{detailData.kecamatan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Desa/Kelurahan</p>
                <p className="text-sm font-bold text-gray-800">{detailData.desa}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <HiOutlineUserGroup className="w-4 h-4" /> Profil Kelompok Tani (KTH)
            </h3>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                  <HiOutlineUserGroup className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Nama KTH Terdaftar</p>
                  <p className="text-base font-bold text-gray-800">{detailData.namaKTH}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">Ketua Kelompok</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{detailData.namaKetua}</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">Jenis Usaha</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <HiOutlineBriefcase className="w-4 h-4 text-gray-400" /> {detailData.jenisUsaha}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailCPISTAFF;