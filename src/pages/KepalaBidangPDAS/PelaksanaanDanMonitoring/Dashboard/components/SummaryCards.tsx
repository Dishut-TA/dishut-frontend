export default function SummaryCards({ }: { stats?: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">Total Program</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Program</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-medium text-gray-600 flex gap-2">
          <span className="text-emerald-600">17 Berjalan</span> • <span>3 Selesai</span>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-center">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">Total Target Tanaman</p>
            <p className="text-3xl font-bold text-gray-900">125.450</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Pohon</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-center">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">Total Realisasi Tanaman</p>
            <p className="text-3xl font-bold text-gray-900">68.230</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Pohon</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-center">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v10h10a10 10 0 11-10-10z" className="text-blue-200"/><path d="M13 2v10h10a10 10 0 00-10-10z" className="text-blue-600"/></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">Persentase Realisasi</p>
            <p className="text-3xl font-bold text-gray-900">54,38%</p>
            <p className="text-[11px] text-gray-400 mt-0.5">dari Target</p>
          </div>
        </div>
      </div>
    </div>
  );
}