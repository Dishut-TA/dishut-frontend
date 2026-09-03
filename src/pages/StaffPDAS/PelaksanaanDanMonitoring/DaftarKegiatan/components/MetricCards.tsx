import ProgressBar from "@/components/ui/ProgressBar";

export const StatCardProgress = ({ progress, status }: { progress: number, status: string }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-1">
    <span className="text-xs font-bold tracking-wider uppercase text-gray-400">Progres Keseluruhan</span>
    <p className="text-3xl font-bold text-gray-800 mt-2 mb-3">{progress}%</p>
    <ProgressBar progress={progress} status={status as any} />
  </div>
);

export const StatCardTarget = ({ luas, bibit }: { luas: number, bibit: number }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-1">
    <span className="text-xs font-bold tracking-wider uppercase text-gray-400">Target Cakupan</span>
    <p className="text-2xl font-bold text-gray-800 mt-2">{luas} <span className="text-lg font-semibold text-gray-500">Ha</span></p>
    <p className="text-sm font-medium text-gray-500 mt-1">{bibit.toLocaleString("id-ID")} Bibit disiapkan</p>
  </div>
);

export const StatCardBudget = ({ budget, source }: { budget: number, source: string }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-1">
    <span className="text-xs font-bold tracking-wider uppercase text-gray-400">Estimasi Anggaran</span>
    <p className="text-2xl font-bold text-[#185325] mt-2">
      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(budget)}
    </p>
    <p className="text-sm font-medium text-gray-500 mt-1 truncate" title={source}>{source}</p>
  </div>
);

export const StatCardAuthor = ({ author, kth }: { author: string, kth: string }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-1">
    <span className="text-xs font-bold tracking-wider uppercase text-gray-400">Penanggung Jawab</span>
    <p className="text-lg font-bold text-gray-800 mt-2 truncate" title={author}>{author}</p>
    <p className="text-sm font-medium text-gray-500 mt-1 truncate" title={kth}>{kth}</p>
  </div>
);