import { HiOutlineClock } from "react-icons/hi2";

interface RiwayatLog {
  id: number;
  tanggal: string;
  jumlahTanam: number;
  totalTanam: number;
  oleh: string;
}

const RiwayatPenanaman = ({ logs, targetBibit }: { logs: RiwayatLog[], targetBibit: number }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
      <HiOutlineClock className="w-5 h-5 text-[#185325]" /> Riwayat Penanaman
    </h2>
    <div className="border-l-2 border-gray-100 ml-2.5 space-y-6">
      {logs.map((log) => (
        <div key={log.id} className="pl-6 relative">
          <div className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-[#185325] ring-4 ring-white shadow-sm"></div>
          <p className="text-xs font-bold text-[#185325] mb-1">{log.tanggal}</p>
          <p className="text-sm font-medium text-gray-800">
            Berhasil menanam <span className="font-bold">+{log.jumlahTanam} Bibit</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total: <span className="font-semibold text-gray-700">{log.totalTanam}</span> / {targetBibit} Bibit
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Oleh: {log.oleh}</p>
        </div>
      ))}
    </div>
  </div>
);

export default RiwayatPenanaman;