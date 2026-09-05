import React from 'react';
import { HiOutlineBell, HiOutlineClipboardDocumentList, HiOutlineMapPin, HiOutlineChartBar } from 'react-icons/hi2';
import { parsePenugasan, formatRelativeTime } from '../utils';

interface Props {
  penugasans: any[];
}

interface FeedItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  message: string;
  time: string;
  timestamp: number;
}

const PembaruanTerbaru: React.FC<Props> = ({ penugasans }) => {
  const feed: FeedItem[] = [];

  penugasans.forEach((p) => {
    const info = parsePenugasan(p);

    if (info.createdAt) {
      feed.push({
        id: `new-${info.id}`,
        icon: <HiOutlineClipboardDocumentList className="w-4 h-4" />,
        iconBg: 'bg-orange-50 text-orange-500',
        message: `Penugasan baru diberikan untuk program ${info.programName}.`,
        time: formatRelativeTime(info.createdAt),
        timestamp: new Date(info.createdAt).getTime(),
      });
    }

    if (info.jenisKegiatan === 'Validasi Lokasi' && info.status === 'Menunggu Verifikasi') {
      feed.push({
        id: `validasi-${info.id}`,
        icon: <HiOutlineMapPin className="w-4 h-4" />,
        iconBg: 'bg-red-50 text-red-500',
        message: `Validasi lokasi diperlukan untuk program ${info.programName}.`,
        time: formatRelativeTime(info.updatedAt || info.createdAt),
        timestamp: new Date(info.updatedAt || info.createdAt || 0).getTime(),
      });
    }

    if (info.jenisKegiatan === 'Monitoring Program' && info.status !== 'Selesai' && info.status !== 'Dihentikan') {
      feed.push({
        id: `monitoring-${info.id}`,
        icon: <HiOutlineChartBar className="w-4 h-4" />,
        iconBg: 'bg-blue-50 text-blue-500',
        message: `Monitoring program ${info.programName} masih menunggu tindak lanjut.`,
        time: formatRelativeTime(info.updatedAt || info.createdAt),
        timestamp: new Date(info.updatedAt || info.createdAt || 0).getTime(),
      });
    }
  });

  const sorted = feed.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
        <HiOutlineBell className="w-5 h-5 text-emerald-600" />
        <h3>Pembaruan Terbaru</h3>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 flex-1 flex items-center justify-center">Belum ada pembaruan</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {sorted.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className={`p-2 rounded-lg shrink-0 ${item.iconBg}`}>{item.icon}</div>
              <div className="min-w-0">
                <p className="text-sm text-gray-700 font-medium leading-snug">{item.message}</p>
                <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PembaruanTerbaru;