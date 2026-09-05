import React from 'react';
import {
  HiOutlineXMark,
  HiOutlineInformationCircle,
  HiOutlineMap,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

interface DetailRencanaPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 12 7 12 7 7C7 12 12 12 12 12ZM12 12C12 12 17 12 17 7C17 12 12 12 12 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 22H16" />
  </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 4 6 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 6 12 2 12 2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DetailRencanaPOModal: React.FC<DetailRencanaPOModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const targetKegiatan = data?.source_type === 'App\\Models\\DonationProgram'
    ? (data?.detail?.total_seeds_bast || 0)
    : (data?.detail?.total_seeds_collected || data?.detail?.jumlah_bibit || data?.detail?.target_amount || 0);
  const tahunProgram = data?.detail?.start_date ? new Date(data.detail.start_date).getFullYear()
    : data?.detail?.tanggal_mulai ? new Date(data.detail.tanggal_mulai).getFullYear()
      : data?.detail?.created_at ? new Date(data.detail.created_at).getFullYear() : '-';
  const sumberDana = data?.source_type === 'App\\Models\\DonationProgram' ? 'Donasi' : data?.source_type === 'App\\Models\\ProgramApbd' ? 'APBD' : 'CSR';

  // Calculate or get Total PU
  const targetLuasLahan = data?.detail?.analysis_result_zone?.luas_ha || data?.detail?.analysisResultZone?.luas_ha || data?.detail?.target_luas_lahan || 0;
  const totalPu = data?.detail?.analysis_result_zone?.jumlah_pu || data?.detail?.analysisResultZone?.jumlah_pu || (targetLuasLahan ? Math.ceil(targetLuasLahan * 1) : '-');

  // Format tanggal pelaksanaan
  const formatTgl = (tgl: string) => {
    if (!tgl) return '-';
    return new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const tglMulai = data?.detail?.start_date || data?.detail?.tanggal_mulai;
  const tglSelesai = data?.detail?.end_date || data?.detail?.tanggal_selesai;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-2xl shadow-xl w-full max-w-275 max-h-[95vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <HiOutlineDocumentText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detail Rencana Penanaman P0</h2>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Rencana Awal</span>
                &bull; Data acuan sebelum pelaksanaan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* KARTU INFO UTAMA */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
              <div className="relative z-10 flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-emerald-800">Informasi Program</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
                <div className="flex"><span className="w-32 text-gray-500">ID Program</span><span className="font-semibold">: {data.id}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Jenis Kegiatan</span><span className="font-semibold">: Penanaman</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Nama Program</span><span className="font-semibold">: {data?.program || '-'}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Target Kegiatan</span><span className="font-semibold">: {targetKegiatan} tanaman</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Lokasi Program</span><span className="font-semibold pr-4 leading-relaxed whitespace-pre-line">: {data?.lokasi?.replace('\n', ' ') || '-'}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Tahun Program</span><span className="font-semibold">: {tahunProgram}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Wilayah</span><span className="font-semibold">: {data?.wilayah !== '-' ? data?.wilayah : (data?.lokasi?.split(',')[1]?.trim() || '-')}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Deskripsi</span><span className="font-semibold pr-4 leading-relaxed">: {data?.detail?.description || data?.detail?.deskripsi_rencana || '-'}</span></div>
                <div className="flex"><span className="w-32 text-gray-500">Sumber Dana</span><span className="font-semibold">: {sumberDana}</span></div>
              </div>
            </div>


          </div>

          {/* RENCANA PENANAMAN P0 (Cards) */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineDocumentText className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-emerald-800">Rencana Penanaman P0 (Rencana Penanaman Awal)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <p className="text-xs text-gray-500 mb-2 font-medium">Periode</p>
                <p className="text-sm font-bold text-gray-900">P0 - Rencana Penanaman Awal</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Periode Pelaksanaan</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <HiOutlineCalendar className="w-4 h-4 text-emerald-600" /> {formatTgl(tglMulai)} s/d {formatTgl(tglSelesai)}
                </p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HiOutlineCheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total PU (Petak Ukur)</p>
                  <p className="text-base font-bold text-gray-900">{totalPu} <span className="text-[10px] font-normal text-gray-500">(Petak Ukur)</span></p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Status</p>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                    Siap Dilaksanakan
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-800 mb-3">Ringkasan Target & Volume</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 border border-gray-100 rounded-xl flex items-center gap-3 shadow-sm">
                <SproutIcon className="w-8 h-8 text-emerald-600 opacity-80" />
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">{targetKegiatan}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Total Target Tanaman</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl flex items-center gap-3 shadow-sm">
                <HiOutlineMap className="w-8 h-8 text-emerald-600 opacity-80" />
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">{targetLuasLahan || '-'} <span className="text-sm font-medium">Ha</span></p>
                  <p className="text-[10px] text-gray-500 mt-1">Luas Area Penanaman</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl flex items-center gap-3 shadow-sm">
                <LeafIcon className="w-8 h-8 text-emerald-600 opacity-80" />
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">{data?.source_type === 'App\\Models\\DonationProgram' ? (data?.detail?.allocations_bast?.length || '-') : (data?.detail?.seeds?.length || '-')}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Jenis Tanaman</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl flex items-center gap-3 shadow-sm">
                <UsersIcon className="w-8 h-8 text-emerald-600 opacity-80" />
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">{data?.detail?.kth_id || data?.detail?.kth ? '1' : '0'}</p>
                  <p className="text-[10px] text-gray-500 mt-1">KTH Terlibat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between sticky bottom-0 rounded-b-2xl">
          <div className="flex items-start gap-2 bg-[#f0f9f3] px-4 py-2.5 rounded-lg border border-[#DCECE0]">
            <HiOutlineInformationCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Keterangan</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">Rencana Penanaman P0 digunakan sebagai data pembanding untuk monitoring periode berikutnya.</p>
            </div>
          </div>
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailRencanaPOModal;