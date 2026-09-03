import React from 'react';
import { HiOutlineCalendarDays, HiOutlineMapPin } from 'react-icons/hi2';
import { parsePenugasan } from '../utils';

interface Props {
  penugasans: any[];
}

const BULAN_PENDEK = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'];

const AgendaTerdekat: React.FC<Props> = ({ penugasans }) => {
  const agenda = penugasans
    .map(parsePenugasan)
    .filter(p => (p.status === 'Berjalan' || p.status === 'Menunggu Verifikasi') && p.tanggal)
    .sort((a, b) => new Date(a.tanggal!).getTime() - new Date(b.tanggal!).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
        <HiOutlineCalendarDays className="w-5 h-5 text-emerald-600" />
        <h3>Agenda Terdekat</h3>
      </div>

      {agenda.length === 0 ? (
        <p className="text-sm text-gray-400 flex-1 flex items-center justify-center">Belum ada agenda aktif</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {agenda.map((item) => {
            const date = new Date(item.tanggal!);
            return (
              <div key={item.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                <div className="text-center w-10 shrink-0">
                  <p className="text-xl font-bold text-emerald-700 leading-none">{date.getDate()}</p>
                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{BULAN_PENDEK[date.getMonth()]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-gray-400 mb-0.5">{item.jenisKegiatan}</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{item.programName}</p>
                  {(item.desa || item.kecamatan || item.kabupaten) && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{[item.kecamatan, item.kabupaten].filter(Boolean).join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgendaTerdekat;