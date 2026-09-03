import React from "react";
import { HiOutlineClock, HiOutlineExclamationTriangle } from "react-icons/hi2";
import type { ActivityDetail } from "../types/activity";

interface StatusBadgeProps {
  status: ActivityDetail["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<ActivityDetail["status"], string> = {
    Berjalan: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Selesai: "bg-gray-100 text-gray-700 border-gray-200",
    Bermasalah: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border ${styles[status]}`}>
      {status === "Berjalan" && <HiOutlineClock className="w-3.5 h-3.5" />}
      {status === "Bermasalah" && <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
};

export default StatusBadge;