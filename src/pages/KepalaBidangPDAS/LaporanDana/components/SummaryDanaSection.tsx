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
    <div className="bg-[#EBF8F1] rounded-xl p-6 md:p-8 mt-6 border border-[#C6EBD6]">
      <h3 className="text-sm font-bold text-[#185325] mb-6 border-b border-[#C6EBD6] pb-3">Rekapitulasi Keseluruhan (Seluruh Tahap)</h3>
      
      <div className="space-y-4 mb-6 border-b border-[#C6EBD6] pb-6">
        {laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).length > 0 ? (
          laporanDanas.filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status)).map((l: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm max-w-sm">
              <span className="text-gray-700 font-medium">Realisasi {l.tahap}</span>
              <span className="text-gray-800 font-semibold">{formatRupiah(l.dana_direalisasikan)}</span>
            </div>
          ))
        ) : (
           <p className="text-sm text-gray-500 italic">Belum ada data realisasi valid.</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm max-w-sm mb-3">
        <span className="font-bold text-gray-800">Total Akumulasi Realisasi</span>
        <span className="font-bold text-[#185325] text-base">{formatRupiah(totalRealisasi)}</span>
      </div>
      <div className="flex items-center justify-between text-sm max-w-sm">
        <span className="font-bold text-gray-800">Sisa Dana Program</span>
        <span className={`font-bold text-base ${sisaDana < 0 ? 'text-red-600' : 'text-gray-800'}`}>{formatRupiah(sisaDana)}</span>
      </div>
    </div>
  );
}