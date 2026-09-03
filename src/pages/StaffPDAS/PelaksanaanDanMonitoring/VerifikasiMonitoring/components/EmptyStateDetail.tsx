import { HiOutlineShieldCheck } from 'react-icons/hi2';

const EmptyStateDetail = () => {
  return (
    <div className="bg-white h-full min-h-100 lg:min-h-150 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
        <HiOutlineShieldCheck className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih Data Laporan</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Pilih salah satu laporan di samping untuk melakukan verifikasi bukti lapangan.
      </p>
    </div>
  );
};

export default EmptyStateDetail;