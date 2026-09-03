import { 
  HiOutlineArrowLeft, HiCheckCircle, HiOutlineDocumentText, 
  HiOutlineMapPin, HiOutlineSquare2Stack, HiOutlineCalendar, HiOutlineUser, 
  HiOutlineInformationCircle, HiOutlineDocumentCheck, HiOutlineXMark, 
  HiOutlineArrowDownTray
} from 'react-icons/hi2';

export const LihatDetailView = ({ data, navigate }: { data: any, navigate: any }) => {
  const validationData = data.raw_data?.penugasanable?.field_validations?.[0] || {};
  const isTidakSesuai = validationData.kendala_lapangan === 'Tidak Sesuai';
  const hasilValidasi = validationData.kendala_lapangan ? (isTidakSesuai ? 'Tidak Sesuai' : 'Sesuai') : (data.status === 'Selesai' ? 'Sesuai' : '-');

  return (
    <div className="flex flex-col gap-6 w-full max-w-325 mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Validasi Lokasi</h1>
        <p className="text-sm text-gray-500">Berikut adalah detail hasil validasi lokasi berdasarkan penugasan yang diberikan.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-wrap gap-y-4 gap-x-8 items-center divide-x divide-gray-100">
        <div className="pr-2">
          <p className="text-[11px] text-gray-500 mb-1.5">Status Penugasan</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold uppercase border border-emerald-100">
            <HiCheckCircle className="w-4 h-4" /> {data.status}
          </span>
        </div>
        <div className="pl-8 pr-2">
          <p className="text-[11px] text-gray-500 mb-1.5">Hasil Validasi</p>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase border ${isTidakSesuai ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            {isTidakSesuai ? <HiOutlineXMark className="w-4 h-4 stroke-2" /> : <HiCheckCircle className="w-4 h-4" />} {hasilValidasi}
          </span>
        </div>
        <div className="pl-8 pr-2">
          <p className="text-[11px] text-gray-500 mb-1">ID Penugasan</p>
          <p className="text-sm font-bold text-gray-900">{data.displayId || data.id}</p>
        </div>
        <div className="pl-8 pr-2">
          <p className="text-[11px] text-gray-500 mb-1.5">Sumber Lokasi</p>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-600">{data.sumber || '-'}</span>
        </div>
        <div className="pl-8 pr-2">
          <p className="text-[11px] text-gray-500 mb-1">Tanggal Validasi</p>
          <p className="text-sm font-bold text-gray-900">{validationData.created_at ? new Date(validationData.created_at).toLocaleDateString('id-ID') : '-'}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6 w-full">
          {/* Info Penugasan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-6">
              <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" /> Informasi Penugasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              <div className="flex gap-3"><HiOutlineDocumentText className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">ID Program</p><p className="text-xs font-semibold">{data.displayId || data.id}</p></div></div>
              <div className="flex gap-3"><HiOutlineSquare2Stack className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">Sumber Lokasi</p><span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-600">{data.sumber || '-'}</span></div></div>
              <div className="flex gap-3"><HiOutlineMapPin className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">Lokasi Penugasan</p><p className="text-xs font-semibold leading-relaxed max-w-50">{data.lokasi || '-'}</p></div></div>
              <div className="flex gap-3"><HiOutlineCalendar className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">Batas Waktu Validasi</p><p className="text-xs font-semibold">{data.batasWaktu}</p></div></div>
              <div className="flex gap-3"><HiOutlineUser className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">Penyuluh</p><p className="text-xs font-semibold">{data.raw_data?.penyuluh?.username || 'Penyuluh'}</p></div></div>
              <div className="flex gap-3"><HiOutlineInformationCircle className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-[11px] text-gray-500 mb-1">Status</p><p className="text-xs font-semibold">{data.status}</p></div></div>
            </div>
          </div>

          {/* Info Hasil Validasi */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className={`text-sm font-bold flex items-center gap-2 mb-6 ${isTidakSesuai ? 'text-red-600' : 'text-[#008A4B]'}`}>
              <HiOutlineDocumentCheck className="w-5 h-5" /> Informasi Hasil Validasi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div><p className="text-[11px] font-bold text-gray-800 mb-1">Tanggal Validasi</p><p className="text-xs font-medium text-gray-600">{validationData.created_at ? new Date(validationData.created_at).toLocaleDateString('id-ID') : '-'}</p></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800 mb-2">Koordinat Lokasi</p>
                  <div className="flex gap-3">
                    <div className="flex-1"><div className={`px-3 py-2 border rounded text-xs font-medium ${isTidakSesuai ? 'bg-red-50/50 border-red-100 text-red-800' : 'bg-emerald-50/30 border-emerald-100 text-emerald-800'}`}>{validationData.titik_koordinat_gps || '-'}</div></div>
                  </div>
                </div>
                <div><p className="text-[11px] font-bold text-gray-800 mb-1">Kesesuaian Lokasi</p><p className="text-xs font-medium text-gray-600">{hasilValidasi}</p></div>
                <div><p className="text-[11px] font-bold text-gray-800 mb-1">Catatan Validasi</p><p className="text-xs font-medium text-gray-600 leading-relaxed">{validationData.catatan_peninjauan || '-'}</p></div>
              </div>
              <div className="space-y-6">
                <div><p className="text-[11px] font-bold text-gray-800 mb-1">Kondisi Umum Lokasi</p><p className="text-xs font-medium text-gray-600 leading-relaxed">{validationData.kondisi_lahan || '-'}</p></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800 mb-3">Dokumentasi Lokasi</p>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {validationData.foto_lokasi_url ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img src={validationData.foto_lokasi_url} alt="Dokumentasi" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Tidak ada foto</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-4">
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <HiOutlineArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm">
                <HiOutlineArrowDownTray className="w-4 h-4" /> Unduh PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};