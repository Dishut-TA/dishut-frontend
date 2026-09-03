const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

export default function SummaryDanaSection({ laporanDanas }: { laporanDanas: any[] }) {
  const totalDisalurkan = laporanDanas.reduce((sum, l) => sum + Number(l.dana_disalurkan || 0), 0);
  const totalRealisasi = laporanDanas
    .filter((l: any) => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status))
    .reduce((sum: number, l: any) => sum + Number(l.dana_direalisasikan || 0), 0);
  
  const sisaDana = totalDisalurkan - totalRealisasi;

  return (
    <div className="bg-[#EBF8F1] rounded-xl p-6 md:p-8 mt-12 border border-[#C6EBD6]">
      <h3 className="text-sm font-bold text-gray-800 mb-6 border-b border-gray-300 pb-3">Rekapitulasi Keseluruhan</h3>
      
      <div className="space-y-4 mb-6 border-b border-gray-300 pb-6">
        {laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).length > 0 ? (
          laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).map((l: any, idx: number) => (
            <div key={idx} className="flex items-start text-sm">
              <span className="w-32 md:w-40 text-gray-700">{l.tahap}</span>
              <span className="w-6 text-gray-700">:</span>
              <span className="text-gray-800 font-semibold">{formatRupiah(l.dana_direalisasikan)}</span>
            </div>
          ))
        ) : (
           <p className="text-sm text-gray-500 italic">Belum ada data realisasi valid.</p>
        )}
      </div>

      <div className="flex items-start text-sm">
        <span className="w-32 md:w-40 font-bold text-gray-800">Total Realisasi</span>
        <span className="w-6 font-bold text-gray-800">:</span>
        <span className="font-bold text-[#185325] text-base">{formatRupiah(totalRealisasi)}</span>
      </div>
      <div className="flex items-start text-sm mt-3">
        <span className="w-32 md:w-40 font-bold text-gray-800">Sisa Dana</span>
        <span className="w-6 font-bold text-gray-800">:</span>
        <span className={`font-bold text-base ${sisaDana < 0 ? 'text-red-600' : 'text-gray-800'}`}>{formatRupiah(sisaDana)}</span>
      </div>
    </div>
  );
}