import type { ActivityDetail } from "../types/activity";

const InfoCard = ({ data }: { data: ActivityDetail }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
      <h2 className="font-bold text-gray-800">Informasi Program</h2>
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
      <div>
        <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Wilayah Prioritas</label>
        <p className="font-medium text-gray-800">{data.wilayahPrioritas}</p>
      </div>
      <div>
        <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Bentuk Kegiatan</label>
        <p className="font-medium text-gray-800">{data.jenisKegiatanFisik}</p>
      </div>
      <div>
        <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Jenis Tanaman</label>
        <p className="font-medium text-gray-800">{data.jenisTanaman}</p>
      </div>
      <div>
        <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Jadwal Pelaksanaan</label>
        <p className="font-medium text-gray-800">{data.startDate} — {data.endDate}</p>
      </div>
    </div>
  </div>
);

export default InfoCard;