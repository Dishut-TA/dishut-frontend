import { HiOutlineClock } from "react-icons/hi2";
import type { ActivityDetail } from "../types/activity";

const TimelineSection = ({ logs }: { logs: ActivityDetail["timelineLogs"] }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
      <HiOutlineClock className="w-5 h-5 text-[#185325]" /> Riwayat Status
    </h2>
    <div className="border-l-2 border-gray-100 ml-2.5 space-y-6">
      {logs.map((log) => (
        <div key={log.id} className="pl-6 relative">
          <div className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-[#185325] ring-4 ring-white shadow-sm"></div>
          <p className="text-xs font-bold text-[#185325] mb-1">{log.tanggal}</p>
          <p className="text-sm font-semibold text-gray-800">{log.pesan}</p>
          <p className="text-xs text-gray-500 mt-1">oleh {log.oleh}</p>
        </div>
      ))}
    </div>
  </div>
);

export default TimelineSection;