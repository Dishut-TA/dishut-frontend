import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
} from 'react-icons/hi2';
import { PiPlant, PiFileText, PiHourglassHigh, PiCalendarBlank } from 'react-icons/pi';
import InputDataModal from './components/InputDataModal';
import EditDataModal from './components/EditDataModal';

const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';

interface TanamanRow {
  id: number;
  petak_ukur_id: number;
  petak_ukur_nama?: string;
  nama_tanaman: string | null;
  jumlah: number;
  kondisi_tanaman: string | null;
  keterangan: string | null;
  foto_url: string | null;
}

interface ProgramInfo {
  id: string | number;
  nama: string;
  lokasi: string;
  sumber_dana: string;
  periode: string;
  targetBibit: number | string;
}

const JenisTag = ({ jenis }: { jenis: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
    <PiPlant className="w-3 h-3" /> {jenis || 'Tidak diketahui'}
  </span>
);

const DetailMonitoringProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<ProgramInfo | null>(null);
  const [rows, setRows] = useState<TanamanRow[]>([]);
  const [search, setSearch] = useState('');

  const [modalInputOpen, setModalInputOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TanamanRow | null>(null);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [penugasanRes, puRes] = await Promise.all([
        axios.get(`${API_URL}/penugasan/${id}`, { headers: authHeader }),
        axios.get(`${API_URL}/penugasan/${id}/petak-ukur`, { headers: authHeader }),
      ]);

      const raw = penugasanRes.data?.data;
      const formatted = raw?.formatted_data || {};
      setProgram({
        id: raw?.id ?? id,
        nama: formatted.nama_program || raw?.penugasanable?.nama_program || '-',
        lokasi: formatted.lokasi || raw?.penugasanable?.lokasi || '-',
        sumber_dana: formatted.sumber_dana || '-',
        periode: formatted.periode_monitoring || '-',
        targetBibit: formatted.target_bibit || '-',
      });

      const puList = puRes.data?.data || [];
      const flattened: TanamanRow[] = [];
      puList.forEach((pu: any) => {
        (pu.dataTanamans || []).forEach((t: any) => {
          flattened.push({
            id: t.id,
            petak_ukur_id: pu.id,
            petak_ukur_nama: pu.nama,
            nama_tanaman: t.nama_tanaman || t.seed?.name || null,
            jumlah: t.jumlah,
            kondisi_tanaman: t.kondisi_tanaman,
            keterangan: t.keterangan,
            foto_url: t.foto_url,
          });
        });
      });
      setRows(flattened);
    } catch (err: any) {
      console.error('Gagal memuat data monitoring:', err);
      setError('Gagal memuat data monitoring dari server. Coba muat ulang halaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOpenInput = (item: TanamanRow) => { setSelectedItem(item); setModalInputOpen(true); };
  const handleOpenEdit = (item: TanamanRow) => { setSelectedItem(item); setModalEditOpen(true); };

  const handleSaved = () => {
    setModalInputOpen(false);
    setModalEditOpen(false);
    setSelectedItem(null);
    fetchData();
  };

  const filteredRows = rows.filter((r) =>
    (r.nama_tanaman || '').toLowerCase().includes(search.toLowerCase()) ||
    String(r.id).includes(search)
  );

  const totalTanaman = rows.reduce((sum, r) => sum + (r.jumlah || 0), 0);
  const sudahDiinput = rows.filter((r) => !!r.foto_url).length;
  const belumDiinput = rows.length - sudahDiinput;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Memuat data monitoring...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 mt-1">Detail Monitoring Program Rehabilitasi</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-[#EBF8F1] text-[#185325] flex items-center justify-center shrink-0">
            <PiPlant className="w-8 h-8" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs w-full mt-1">
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">ID Program</span><span>:</span><span className="font-bold text-gray-800">{program?.id}</span></div>
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Sumber Dana</span><span>:</span><span className="font-bold text-gray-800">{program?.sumber_dana}</span></div>
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Nama Program</span><span>:</span><span className="font-bold text-gray-800">{program?.nama}</span></div>
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Periode Monitoring</span><span>:</span><span className="font-bold text-gray-800">{program?.periode}</span></div>
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Lokasi</span><span>:</span><span className="font-bold text-gray-800">{program?.lokasi}</span></div>
            <div className="grid grid-cols-[110px_10px_1fr]"><span className="text-gray-500 font-medium">Target Tanaman</span><span>:</span><span className="font-bold text-gray-800">{program?.targetBibit}</span></div>
          </div>
        </div>
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex gap-3 items-center">
          <HiOutlineInformationCircle className="w-5 h-5 text-[#00A859] shrink-0" />
          <p className="text-xs font-bold text-[#185325]">Setiap tanaman wajib memiliki 1 foto sebelum pelaksanaan dan 1 foto sesudah monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><PiPlant className="w-6 h-6"/></div>
          <div><p className="text-[10px] font-bold text-gray-500">Total Tanaman</p><p className="text-2xl font-bold text-gray-800 leading-none mt-1">{totalTanaman}</p><p className="text-[10px] font-medium text-gray-500 mt-1">pohon</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><PiFileText className="w-6 h-6"/></div>
          <div><p className="text-[10px] font-bold text-gray-500">Sudah Diinput</p><p className="text-2xl font-bold text-gray-800 leading-none mt-1">{sudahDiinput}</p><p className="text-[10px] font-medium text-gray-500 mt-1">titik</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-full"><PiHourglassHigh className="w-6 h-6"/></div>
          <div><p className="text-[10px] font-bold text-gray-500">Belum Diinput</p><p className="text-2xl font-bold text-gray-800 leading-none mt-1">{belumDiinput}</p><p className="text-[10px] font-medium text-gray-500 mt-1">titik</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><PiCalendarBlank className="w-6 h-6"/></div>
          <div><p className="text-[10px] font-bold text-gray-500">Periode Aktif</p><p className="text-2xl font-bold text-gray-800 leading-none mt-1">{program?.periode}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-bold text-gray-800">Data Monitoring Tanaman <span className="text-gray-400 font-medium text-sm">({filteredRows.length} Data)</span></h3>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-64">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID atau nama tanaman..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">
              <HiOutlineFunnel className="w-4 h-4"/> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-[10px] font-bold text-gray-500 border-b border-gray-100 text-center uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 pr-2">No</th>
                <th className="py-4 px-2 text-left">Petak Ukur</th>
                <th className="py-4 px-2 text-left">Jenis Tanaman</th>
                <th className="py-4 px-2">Jumlah</th>
                <th className="py-4 px-2">Foto Monitoring</th>
                <th className="py-4 px-2">Kondisi Tanaman</th>
                <th className="py-4 px-2 text-left">Keterangan</th>
                <th className="py-4 pr-6 pl-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 font-medium">
                    Belum ada data tanaman untuk program ini.
                  </td>
                </tr>
              )}
              {filteredRows.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50 text-center">
                  <td className="py-3 pl-6 pr-2 font-bold text-gray-700">{idx + 1}</td>
                  <td className="py-3 px-2 text-left font-medium text-gray-600">{item.petak_ukur_nama || `PU #${item.petak_ukur_id}`}</td>
                  <td className="py-3 px-2 text-left"><JenisTag jenis={item.nama_tanaman || ''} /></td>
                  <td className="py-3 px-2 font-bold text-gray-700">{item.jumlah}</td>
                  <td className="py-3 px-2 text-[9px] font-medium text-gray-500">
                    {item.foto_url ? (
                      <img src={item.foto_url} className="w-14 h-8 object-cover rounded mx-auto" alt="Monitoring" />
                    ) : (
                      <span className="text-gray-400">Belum diinput</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {item.kondisi_tanaman ? <span className="text-emerald-600 font-bold">{item.kondisi_tanaman}</span> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="py-3 px-2 text-left text-[10px] text-gray-500 font-medium max-w-[200px] truncate" title={item.keterangan || ''}>
                    {item.keterangan || '-'}
                  </td>
                  <td className="py-3 pr-6 pl-2">
                    <div className="flex items-center justify-center gap-2">
                      {!item.foto_url ? (
                        <button onClick={() => handleOpenInput(item)} className="px-3 py-1.5 text-[10px] font-bold border border-emerald-500 text-emerald-600 rounded bg-white hover:bg-emerald-50 transition-colors">Input Data</button>
                      ) : (
                        <button onClick={() => handleOpenEdit(item)} className="px-3 py-1.5 text-[10px] font-bold border border-emerald-500 text-emerald-600 rounded bg-white hover:bg-emerald-50 transition-colors">Edit</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
             <HiOutlineArrowLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>
        </div>
      </div>

      {modalInputOpen && selectedItem && (
        <InputDataModal item={selectedItem} penugasanId={id!} onClose={() => setModalInputOpen(false)} onSaved={handleSaved} />
      )}
      {modalEditOpen && selectedItem && (
        <EditDataModal item={selectedItem} penugasanId={id!} onClose={() => setModalEditOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default DetailMonitoringProgram;
