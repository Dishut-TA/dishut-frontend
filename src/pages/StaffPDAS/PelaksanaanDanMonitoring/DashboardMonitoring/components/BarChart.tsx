import { HiOutlineTrophy, HiOutlineInformationCircle } from 'react-icons/hi2';

interface BarChartProps {
  perWilayah: any;
}

export default function BarChart({ perWilayah }: BarChartProps) {
  // Convert object to array and sort by realisasi
  const dataArray = Object.entries(perWilayah || {}).map(([wilayah, data]: [string, any]) => ({
    cdk: wilayah,
    value: data.realisasi || 0
  })).sort((a, b) => b.value - a.value).slice(0, 5); // Take top 5

  const maxValue = Math.max(...dataArray.map(d => d.value), 1000);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
           <HiOutlineTrophy className="w-5 h-5 text-green-700" />
           Total Realisasi Terbanyak per CDK
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
          <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
          Realisasi (Pohon)
        </div>
      </div>

      <div className="relative h-48 w-full flex items-end justify-between px-2 gap-2 border-b-2 border-gray-100 pb-1 mt-2">
        <div className="absolute left-0 top-0 bottom-1 w-10 flex flex-col justify-between text-[10px] text-gray-400 font-medium pb-5">
           <span>{maxValue.toLocaleString('id-ID')}</span>
           <span>{(maxValue * 0.75).toLocaleString('id-ID')}</span>
           <span>{(maxValue * 0.5).toLocaleString('id-ID')}</span>
           <span>{(maxValue * 0.25).toLocaleString('id-ID')}</span>
           <span>0</span>
        </div>
        
        <div className="flex-1 flex justify-around items-end h-full ml-12 pt-4">
          {dataArray.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
              Belum ada data realisasi
            </div>
          ) : (
            dataArray.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end h-full group">
                <span className="text-[10px] font-bold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value.toLocaleString('id-ID')}
                </span>
                <div 
                  className="w-8 md:w-12 bg-green-800 rounded-t-sm hover:bg-green-700 transition-colors" 
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                ></div>
                <span className="text-[10px] font-bold text-gray-600 mt-2 truncate w-16 text-center">{item.cdk}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <p className="text-center text-[10px] font-bold text-gray-500 mt-1">Kabupaten/Kota</p>

      <div className="mt-6 text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
        <HiOutlineInformationCircle className="w-4 h-4 text-green-600" />
        Data berdasarkan total realisasi tanaman pada wilayah yang dipilih.
      </div>
    </div>
  );
}