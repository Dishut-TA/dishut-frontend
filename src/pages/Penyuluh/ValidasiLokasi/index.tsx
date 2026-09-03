import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineCheckCircle, 
  HiOutlineMagnifyingGlass,
  HiOutlineCalendar,
  HiOutlineEye,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocumentCheck,
  HiOutlineFunnel
} from 'react-icons/hi2';
import { getMyPenugasanAPI } from '../../../services/penugasan.service';

interface TugasValidasi {
  id: string;
  displayId: string;
  sumber: string;
  lokasi: string;
  batasWaktu: string;
  sisaHari: string;
  sisaHariColor: string;
  status: string;
  zone_id: number;
  raw_data: any;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const calculateSisaHari = (batasWaktu: string) => {
  if (!batasWaktu) return { text: '', color: '' };
  const batas = new Date(batasWaktu);
  const sekarang = new Date();
  const selisihWaktu = batas.getTime() - sekarang.getTime();
  const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
  
  if (selisihHari < 0) return { text: '(Terlambat)', color: 'text-red-600' };
  if (selisihHari === 0) return { text: '(Hari ini)', color: 'text-orange-500' };
  if (selisihHari <= 3) return { text: `(${selisihHari} hari lagi)`, color: 'text-red-500' };
  if (selisihHari <= 7) return { text: `(${selisihHari} hari lagi)`, color: 'text-orange-500' };
  return { text: `(${selisihHari} hari lagi)`, color: 'text-emerald-500' };
};

const getSumberName = (type: string) => {
  if (type.includes('AnalysisResultZone')) return 'Analisis CPI';
  if (type.includes('ProgramApbd')) return 'Program APBD';
  if (type.includes('ProgramCsr')) return 'Program CSR';
  if (type.includes('DonationProgram')) return 'Program Donasi';
  return 'Lainnya';
};

const getLokasiString = (penugasanable: any) => {
  if (!penugasanable) return '-';
  if (penugasanable.desa && penugasanable.kecamatan && penugasanable.kabupaten) {
    return `Desa ${penugasanable.desa}, Kec. ${penugasanable.kecamatan}, Kab. ${penugasanable.kabupaten}`;
  }
  return penugasanable.lokasi || penugasanable.location || '-';
};

const SumberBadge = ({ text }: { text: string }) => {
  const isCPI = text === 'Analisis CPI';
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isCPI ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'}`}>
      {text}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Ditugaskan': 'bg-yellow-50 text-yellow-600',
    'Berjalan': 'bg-yellow-50 text-yellow-600',
    'Selesai': 'bg-emerald-50 text-emerald-600',
    'Menunggu': 'bg-slate-50 text-slate-600',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const Header = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-slate-900 mb-1">Validasi Lokasi</h1>
    <p className="text-sm font-medium text-slate-500">
      Daftar penugasan validasi lokasi yang diberikan kepada Anda.
    </p>
  </div>
);

const SummaryCards = ({ data }: { data: TugasValidasi[] }) => {
  const total = data.length;
  const berjalan = data.filter(d => d.status === 'Berjalan' || d.status === 'Ditugaskan').length;
  const selesai = data.filter(d => d.status === 'Selesai').length;

  const SUMMARY_CARDS = [
    { title: 'Total Penugasan', sub: 'Semua penugasan validasi', value: total.toString(), icon: <HiOutlineClipboardDocumentList className="w-8 h-8" />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { title: 'Ditugaskan', sub: 'Belum mulai dikerjakan', value: berjalan.toString(), icon: <HiOutlineClipboardDocumentCheck className="w-8 h-8" />, bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { title: 'Selesai', sub: 'Validasi telah diselesaikan', value: selesai.toString(), icon: <HiOutlineCheckCircle className="w-8 h-8" />, bg: 'bg-emerald-50', text: 'text-emerald-500' },
  ];

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {SUMMARY_CARDS.map((card, idx) => (
      <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      </div>
    ))}
  </div>
  );
};

const FilterSection = () => (
  <div className="flex flex-col md:flex-row gap-4 mb-6 mt-2">
    <div className="relative flex-1">
      <input 
        type="text" 
        placeholder="Cari ID penugasan, lokasi, desa, CDK..." 
        className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border border-slate-200 rounded-full focus:outline-none focus:border-[#008A4B]" 
      />
      <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
    </div>

    <div className="relative w-full md:w-56">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">Status</div>
      <select className="w-full pl-14 pr-8 py-2.5 text-sm font-semibold border border-slate-200 rounded-full appearance-none bg-white focus:outline-none focus:border-[#008A4B]">
        <option>Semua</option>
      </select>
      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>

    <div className="relative w-full md:w-64">
      <div className="absolute left-10 top-1.5 text-[10px] font-medium text-slate-400">Periode Penugasan</div>
      <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <select className="w-full pl-10 pr-8 pt-4 pb-1 text-sm font-semibold border border-slate-200 rounded-full appearance-none bg-white focus:outline-none focus:border-[#008A4B]">
        <option>Semua Periode</option>
      </select>
      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>

    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#008A4B] text-white text-sm font-semibold rounded-full hover:bg-emerald-800 transition-colors shadow-sm">
      <HiOutlineFunnel className="w-4 h-4" /> Filter
    </button>
  </div>
);

const ValidasiTable = ({ data, navigate }: { data: TugasValidasi[], navigate: any }) => (
  <div className="overflow-x-auto">
    <div className="px-4 py-3 border-b border-slate-100">
      <h3 className="text-sm font-bold text-slate-800">Daftar Validasi Lokasi</h3>
    </div>
    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
      <thead className="bg-[#DCECE0] text-[#3A4D3F] text-xs uppercase tracking-wider font-bold">
        <tr>
          <th className="px-4 py-4 font-bold">No</th>
          <th className="px-4 py-4 font-bold">ID Penugasan</th>
          <th className="px-4 py-4 font-bold">Sumber Lokasi</th>
          <th className="px-4 py-4 font-bold">Lokasi</th>
          <th className="px-4 py-4 font-bold">Batas Waktu Validasi</th>
          <th className="px-4 py-4 font-bold">Status</th>
          <th className="px-4 py-4 font-bold text-center">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item, idx) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-4 py-4">{idx + 1}</td>
            <td className="px-4 py-4 font-semibold text-[#008A4B]">{item.displayId}</td>
            <td className="px-4 py-4"><SumberBadge text={item.sumber} /></td>
            <td className="px-4 py-4">
              <div className="max-w-62.5 whitespace-normal font-medium text-slate-800 leading-relaxed">
                {item.lokasi}
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="font-medium text-slate-800">{item.batasWaktu}</div>
              <div className={`text-xs font-semibold mt-0.5 ${item.sisaHariColor}`}>{item.sisaHari}</div>
            </td>
            <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
            <td className="px-4 py-4 text-center">
              {(item.status === 'Ditugaskan' || item.status === 'Berjalan' || item.status === 'Menunggu') && (
                <button 
                  onClick={() => navigate(`/admin/penyuluh/validasi-lokasi/detail/${item.id}`, { state: { data: item, status: item.status } })}
                  className="inline-flex items-center justify-between w-36 px-4 py-2 text-xs font-bold text-white bg-primary rounded-full hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  Mulai Validasi <HiChevronRight className="w-4 h-4 stroke-2" />
                </button>
              )}
              {item.status === 'Selesai' && (
                <button 
                  onClick={() => navigate(`/admin/penyuluh/validasi-lokasi/detail/${item.id}`, { state: { data: item, status: item.status } })}
                  className="inline-flex items-center justify-center gap-1.5 w-36 px-4 py-2 text-xs font-bold text-[#008A4B] bg-white border border-[#008A4B] rounded-full hover:bg-emerald-50 transition-colors"
                >
                  <HiOutlineEye className="w-4 h-4 stroke-2" /> Lihat Detail
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = () => (
  <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-4 border-t border-slate-100">
    <span className="font-medium"></span>
    <div className="flex items-center gap-2">
    </div>
  </div>
);

const ValidasiLokasi: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TugasValidasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyPenugasanAPI();
        if (res.data) {
          // Filter hanya yang Validasi Lokasi
          const validasi = res.data.filter((item: any) => item.jenis_kegiatan === 'Validasi Lokasi');
          
          const mappedData: TugasValidasi[] = validasi.map((item: any) => {
            const sisa = calculateSisaHari(item.batas_waktu);
            return {
              id: item.id.toString(),
              displayId: 'TGS-' + String(item.id).padStart(3, '0'),
              sumber: getSumberName(item.penugasanable_type),
              lokasi: getLokasiString(item.penugasanable),
              batasWaktu: formatDate(item.batas_waktu),
              sisaHari: sisa.text,
              sisaHariColor: sisa.color,
              status: item.status,
              zone_id: item.penugasanable_id,
              raw_data: item
            };
          });
          setData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch penugasan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full mx-auto pb-12 bg-[#F8FAFC] min-h-screen font-sans">
      <Header />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-4">
        <FilterSection />
        <div className="border border-slate-200 rounded-lg overflow-hidden mt-2">
          <ValidasiTable data={data} navigate={navigate} />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ValidasiLokasi;