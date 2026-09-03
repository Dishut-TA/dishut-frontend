import {
  HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineMapPin,
  HiChevronLeft, HiChevronRight
} from 'react-icons/hi2';
import { getPeriodeBadge, getStatusBadgeStyles } from '../constants';

export const HeaderAndFilter = () => (
  <div className="flex flex-col gap-4 mb-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Monitoring Program Rehabilitasi</h1>
          <p className="text-sm text-gray-500">Daftar seluruh program rehabilitasi mangrove yang sedang Anda dampingi.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text" placeholder="Cari program, KTH, atau lokasi..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 shadow-sm transition-colors">
          <HiOutlineFunnel className="w-4 h-4" /> Filter
        </button>
      </div>
    </div>
  </div>
);

const mapStatus = (status: string | undefined) => {
  if (!status) return 'Siap Monitoring';
  if (['Menunggu', 'Menunggu Verifikasi', 'MENUNGGU', 'Pending', 'PENDING', 'WAITING', 'Waiting', 'Berjalan', 'BERJALAN', 'Sedang berjalan', 'Selesai'].includes(status)) {
    return 'Siap Monitoring';
  }
  return status;
};

export const DataTable = ({ navigate, data = [], isLoading = false, activeTab = 'Semua Program' }: { navigate: any, data?: any[], isLoading?: boolean, activeTab?: string }) => {
  const filteredData = data.filter((item) => {
    const mappedStatus = mapStatus(item.status);
    if (activeTab === 'Semua Program') return true;
    if (activeTab === 'Siap Monitoring' && mappedStatus === 'Siap Monitoring') return true;
    if (activeTab === 'Dalam Monitoring' && mappedStatus === 'Dalam Monitoring') return true;
    if (activeTab === 'Menunggu Evaluasi' && mappedStatus === 'Menunggu Evaluasi') return true;
    if (activeTab === 'Tindak Lanjut' && mappedStatus === 'Tindak Lanjut') return true;
    if (activeTab === 'Monitoring Selesai' && mappedStatus === 'Monitoring Selesai') return true;
    if (activeTab === 'Dihentikan' && mappedStatus === 'Dihentikan') return true;
    return false;
  });

  const formatData = (item: any) => {
    const source = item.penugasanable;
    let nama = '-';
    let lokasiKab = '-';
    let desaKec = '-';
    let kth = '-';

    const zone = source?.analysis_result_zone || source?.analysisResultZone;
    const zoneLokasi = zone ? [zone.desa, zone.kecamatan, zone.kabupaten].filter(Boolean).join(', ') : '-';
    const zoneKth = zone?.nama_kelompok || '-';

    const kthObj = source?.kth || item.penyuluh?.kth;
    const kthLokasi = kthObj && kthObj.desa_kelurahan ? [kthObj.desa_kelurahan, kthObj.kabupaten_kota].filter(Boolean).join(', ') : '-';

    if (item.penugasanable_type === 'App\\Models\\DonationProgram') {
      nama = source?.name || source?.nama_program || '-';
      lokasiKab = source?.location || source?.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      desaKec = source?.location || source?.lokasi || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      kth = kthObj?.name || kthObj?.nama || (zoneKth !== '-' ? zoneKth : '-');
    } else if (item.penugasanable_type === 'App\\Models\\ProgramApbd' || item.penugasanable_type === 'App\\Models\\ProgramCsr') {
      nama = source?.nama_program || source?.name || '-';
      lokasiKab = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      desaKec = source?.lokasi || source?.location || (kthLokasi !== '-' ? kthLokasi : (zoneLokasi !== '-' ? zoneLokasi : '-'));
      kth = kthObj?.nama || kthObj?.name || (zoneKth !== '-' ? zoneKth : '-');
    }

    let statusText = mapStatus(item.status);
    let statusColorKey = 'siap';
    let statusSubText = '';

    if (statusText === 'Dalam Monitoring') {
      statusColorKey = 'berjalan';
    } else if (statusText === 'Menunggu Evaluasi') {
      statusColorKey = 'evaluasi';
    } else if (statusText === 'Monitoring Selesai') {
      statusColorKey = 'selesai';
    } else if (statusText === 'Tindak Lanjut') {
      statusColorKey = 'berjalan'; 
    } else if (statusText === 'Dihentikan') {
      statusColorKey = 'dihentikan';
    }

    return {
      id: item.id,
      nama,
      desaKec,
      periode: item.periode_monitoring || 'P1',
      kth,
      lokasiKab,
      periodeAktif: `Target: ${item.batas_waktu}`,
      statusText,
      statusColorKey,
      statusSubText,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
          <thead className="text-xs text-[#3A4D3F] bg-[#DCECE0] font-bold tracking-wide">
            <tr>
              <th className="px-5 py-4">ID Program</th>
              <th className="px-5 py-4">Nama Program</th>
              <th className="px-5 py-4 text-center">Periode</th>
              <th className="px-5 py-4">KTH</th>
              <th className="px-5 py-4">Lokasi</th>
              <th className="px-5 py-4">Periode Aktif</th>
              <th className="px-5 py-4">Status Program</th>
              <th className="px-5 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-5 py-5 text-center text-sm text-gray-500">Memuat data...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-5 text-center text-sm text-gray-500">Tidak ada data.</td>
              </tr>
            ) : (
              filteredData.map((rawItem) => {
                const item = formatData(rawItem);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-5 font-bold text-emerald-600 text-xs">{item.id}</td>
                    <td className="px-5 py-5">
                      <div className="font-bold text-gray-900 text-sm mb-1">{item.nama}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <HiOutlineMapPin className="w-3.5 h-3.5" /> {item.desaKec}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-center">{getPeriodeBadge(item.periode)}</td>
                    <td className="px-5 py-5 text-xs font-semibold text-gray-700">{item.kth}</td>
                    <td className="px-5 py-5 text-xs text-gray-700">{item.lokasiKab}</td>
                    <td className="px-5 py-5 text-xs font-medium text-gray-600 whitespace-pre-line leading-relaxed">{item.periodeAktif}</td>
                    <td className="px-5 py-5">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusBadgeStyles(item.statusColorKey)}`}>{item.statusText}</span>
                        {item.statusSubText && (
                          <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 ml-1">
                            {item.statusSubText === 'Baru' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                            {item.statusSubText}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-center">
                      {item.statusText === 'Siap Monitoring' ? (
                        <button
                          onClick={() => navigate(`/admin/penyuluh/monitoring-lanjutan/form/${item.id}`, { state: { status: item.statusText } })}
                          className="flex items-center justify-between w-36 px-4 py-2 text-xs font-bold text-white bg-[#008A4B] rounded-full hover:bg-emerald-800 transition-colors shadow-sm mx-auto cursor-pointer"
                        >
                          Mulai Monitoring <HiChevronRight className="w-4 h-4 stroke-2" />
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/admin/penyuluh/monitoring-lanjutan/form/${item.id}`, { state: { status: item.statusText } })}
                          className="px-4 py-1.5 text-xs font-bold text-emerald-600 border border-emerald-500 bg-white rounded-full hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-5 py-4 border-t border-gray-100 bg-white">
        <span className="font-medium">Menampilkan 1 - {filteredData.length} dari {filteredData.length} data</span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md border border-gray-200 text-gray-400 bg-gray-50 hover:bg-gray-100 cursor-not-allowed"><HiChevronLeft className="w-4 h-4" /></button>
          <button className="px-3 py-1.5 rounded-md border border-emerald-500 bg-emerald-50 text-emerald-700 font-bold">1</button>
          <button className="p-1.5 rounded-md border border-gray-200 text-gray-400 bg-gray-50 hover:bg-gray-100 cursor-not-allowed"><HiChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

export const BottomBanner = () => (
  <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#f0f9f3] border border-[#DCECE0] rounded-xl p-4">
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs italic">i</div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-0.5">Keterangan Status Program</h4>
        <p className="text-xs text-gray-600 leading-snug">Status program menunjukkan tahapan pelaksanaan rehabilitasi mangrove sesuai periode monitoring yang sedang berjalan.</p>
      </div>
    </div>
  </div>
);