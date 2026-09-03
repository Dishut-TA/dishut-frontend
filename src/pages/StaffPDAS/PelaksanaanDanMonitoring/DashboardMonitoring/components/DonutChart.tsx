interface DonutChartProps {
  stats: any;
}

export default function DonutChart({ stats }: DonutChartProps) {
  const programs = stats?.programs || [];
  const total = stats?.total_program || 0;
  
  const donasi = programs?.filter?.((p: any) => p.sumber_dana === 'Donasi')?.length || 0;
  const apbd = programs?.filter?.((p: any) => p.sumber_dana === 'APBD')?.length || 0;
  const csr = programs?.filter?.((p: any) => p.sumber_dana === 'CSR')?.length || 0;
  const totalCalc = donasi + apbd + csr || 1;
  
  const donasiPct = ((donasi / totalCalc) * 100).toFixed(1);
  const apbdPct = ((apbd / totalCalc) * 100).toFixed(1);
  const csrPct = ((csr / totalCalc) * 100).toFixed(1);

  const donasiEnd = (donasi / totalCalc) * 100;
  const apbdEnd = donasiEnd + (apbd / totalCalc) * 100;

  return (
    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6 text-sm">Rekapitulasi Berdasarkan Sumber Program</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative mb-4">
        <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-gray-100 shadow-sm" style={{
            background: total > 0 
              ? `conic-gradient(#059669 0% ${donasiEnd}%, #2563eb ${donasiEnd}% ${apbdEnd}%, #7c3aed ${apbdEnd}% 100%)`
              : '#e5e7eb'
        }}>
          <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
            <span className="text-[10px] font-medium text-gray-500">Program</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-green-600 mt-1 shrink-0"></div>
          <div>
            <p className="text-xs font-bold text-gray-900">Donasi</p>
            <p className="text-[10px] text-gray-500">{donasi} Program ({donasiPct}%)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 shrink-0"></div>
          <div>
            <p className="text-xs font-bold text-gray-900">APBD</p>
            <p className="text-[10px] text-gray-500">{apbd} Program ({apbdPct}%)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-purple-600 mt-1 shrink-0"></div>
          <div>
            <p className="text-xs font-bold text-gray-900">CSR</p>
            <p className="text-[10px] text-gray-500">{csr} Program ({csrPct}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}