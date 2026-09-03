export default function DonutChart({ }: { stats?: any }) {
  return (
    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6 text-sm">Rekapitulasi Berdasarkan Sumber Program</h3>
      <div className="flex-1 flex flex-col justify-center gap-6">
        
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="20" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0284c7" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.417)} />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#16a34a" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.375)} strokeDashoffset-transform="rotate" className="origin-center rotate-150" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7e22ce" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.208)} className="origin-center rotate-285" />
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-gray-900 leading-none">24</p>
            <p className="text-[10px] font-bold text-gray-500 mt-1">Program</p>
          </div>
        </div>

        <div className="space-y-3 px-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-600 mt-0.5 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Donasi</p>
              <p className="text-[10px] text-gray-500">9 Program (37,5%)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-600 mt-0.5 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">APBD</p>
              <p className="text-[10px] text-gray-500">10 Program (41,7%)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-700 mt-0.5 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">CSR</p>
              <p className="text-[10px] text-gray-500">5 Program (20,8%)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}