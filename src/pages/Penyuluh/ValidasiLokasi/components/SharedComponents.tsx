export const PageHeader = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-1">Validasi Lokasi Rehabilitasi</h1>
    <p className="text-sm text-gray-500">Lengkapi hasil validasi lokasi berdasarkan penugasan yang diberikan.</p>
  </div>
);

export const InfoItem = ({ icon: Icon, label, value, isBadge, badgeClass }: any) => (
  <div className="flex items-center gap-3">
    <Icon className="w-5 h-5 text-gray-400 shrink-0" />
    <div className="flex-1 flex items-center justify-between">
      <span className="text-sm text-gray-600 w-1/3">{label}</span>
      {isBadge ? (
        <div className="w-2/3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-md border ${badgeClass}`}>{value}</span>
        </div>
      ) : (
        <input type="text" readOnly value={value} className="w-2/3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none" />
      )}
    </div>
  </div>
);

export const RadioStatus = ({ label, value, current, onChange }: any) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative flex items-center justify-center w-5 h-5">
      <input type="radio" name="statusValidasi" value={value} checked={current === value} onChange={onChange} className="peer opacity-0 absolute w-full h-full cursor-pointer" />
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-emerald-600"></div>
      <div className="absolute w-2.5 h-2.5 bg-emerald-600 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);