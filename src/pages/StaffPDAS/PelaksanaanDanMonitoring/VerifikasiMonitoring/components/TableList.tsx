import { useNavigate } from 'react-router-dom';
import { HiEllipsisVertical, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { MOCK_PROGRAMS } from '../data/mockData';

export default function TableList() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Siap Monitoring':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{status}
          </span>
        );
      case 'Berjalan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{status}
          </span>
        );
      case 'Menunggu Evaluasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{status}
          </span>
        );
      case 'Tindak Lanjut':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{status}
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{status}
          </span>
        );
      case 'Dihentikan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>{status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Daftar Program Monitoring</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-250">
          <thead className="text-xs text-slate-600 font-bold border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="py-3.5 px-6 font-semibold">Program</th>
              <th className="py-3.5 px-6 font-semibold">Lokasi / KTH</th>
              <th className="py-3.5 px-6 font-semibold">Periode Aktif</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold">Ringkasan</th>
              <th className="py-3.5 px-6 font-semibold">Tanggal Terakhir</th>
              <th className="py-3.5 px-6 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PROGRAMS.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-900 mb-0.5">{row.program}</p>
                  <p className="text-xs text-slate-400">ID: {row.id}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800 mb-0.5">{row.lokasi}</p>
                  <p className="text-xs text-slate-400">{row.kth}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800 mb-0.5">{row.periodeLabel}</p>
                  <p className="text-xs text-slate-400">{row.periodeDate}</p>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(row.status)}
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800 mb-0.5">{row.ringkasanTitle}</p>
                  <p className="text-xs text-slate-400">{row.ringkasanDesc}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800 mb-0.5">{row.tanggal}</p>
                  <p className="text-xs text-slate-400">{row.waktu}</p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="px-3 py-1.5 bg-white border border-[#008A4B] text-[#008A4B] hover:bg-emerald-50 text-xs font-semibold rounded-lg transition-colors"
                      onClick={() => navigate(`/admin/staff/monitoring/verifikasi/detail/${row.id}`, { state: { status: row.status } })}
                    >
                      Lihat Progres
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <HiEllipsisVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm text-slate-500">
        <span>Menampilkan 1–6 dari 6 data</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <HiChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#008A4B] text-white font-semibold text-xs shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
          <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white text-slate-700 cursor-pointer">
            <option>10 / halaman</option>
            <option>20 / halaman</option>
            <option>50 / halaman</option>
          </select>
        </div>
      </div>
    </div>
  );
}