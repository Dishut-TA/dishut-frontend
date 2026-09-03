import { HiOutlineMapPin } from "react-icons/hi2";

const MapPlaceholderCard = ({ title }: { title: string }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="font-bold text-gray-800 mb-4">Peta Lokasi Intervensi</h2>
    <div className="h-72 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
      <HiOutlineMapPin className="w-8 h-8" />
      <span className="text-sm font-medium">Muat Peta {title}</span>
    </div>
  </div>
);

export default MapPlaceholderCard;