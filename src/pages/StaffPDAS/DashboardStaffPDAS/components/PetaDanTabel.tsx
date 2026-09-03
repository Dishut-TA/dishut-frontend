import { HiOutlineMapPin } from 'react-icons/hi2';

export const PetaDanTabel = () => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/5 h-75 lg:h-auto bg-[#eef2f6] rounded-2xl border border-gray-200 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="flex flex-col items-center z-10 p-4 text-center">
          <div className="p-3 bg-white rounded-full shadow-sm text-[#185325] mb-2">
            <HiOutlineMapPin className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-700">Peta Interaktif Wilayah CDK</p>
          <p className="text-xs text-gray-500 mt-1">Integrasi WebGIS akan tampil di sini</p>
        </div>
      </div>

      <div className="w-full lg:w-3/5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Daftar Lokasi Rehabilitasi Baru</h3>
          <button className="text-xs font-bold text-[#185325] hover:underline">Lihat Semua</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#DCECE0]/50 text-[#3A4D3F] text-[10px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Kabupaten/Kota</th>
                <th className="px-4 py-3 text-center">Tanggal</th>
                <th className="px-4 py-3 text-center">Program</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Bibit Ditanam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4].map((item) => (
                <tr key={item} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">Kota Bandung</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">24/08/2026</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">Reboisasi</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#185325] text-right">250.000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};