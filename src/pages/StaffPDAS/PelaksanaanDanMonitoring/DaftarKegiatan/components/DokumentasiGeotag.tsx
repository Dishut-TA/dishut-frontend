import { HiOutlinePhoto } from "react-icons/hi2";

const DokumentasiGeotag = ({ title }: { title: string }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
      Dokumentasi Geotag Lapangan
    </h2>
    <div className="h-72 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 hover:bg-gray-100 hover:border-[#185325] transition-colors cursor-pointer">
      <HiOutlinePhoto className="w-10 h-10 text-gray-400" />
      <span className="text-sm font-medium text-gray-500">Lihat Dokumentasi {title}</span>
    </div>
  </div>
);

export default DokumentasiGeotag;