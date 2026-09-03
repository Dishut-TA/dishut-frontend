const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

export default function RincianDanaList({ laporanDanas }: { laporanDanas: any[] }) {
  const getFileName = (path: string) => path ? path.split('/').pop() : null;

  return (
    <div className="mb-10">
      <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Rincian Penggunaan Dana per Tahap</h3>
      
      {laporanDanas.map((laporan: any) => (
        <div key={laporan.id} className="mb-8 border border-gray-100 rounded-xl p-6 bg-gray-50/30 shadow-sm">
          <h4 className="text-sm font-bold text-[#185325] mb-4">
            {laporan.tahap} — Dilaporkan pada {new Date(laporan.tanggal_pengeluaran).toLocaleDateString('id-ID')}
          </h4>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm mb-4 border-collapse">
              <thead className="border-y border-gray-200 text-gray-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-2 w-1/2">Kategori Kegiatan</th>
                  <th className="py-3 px-2 w-1/4">Bukti Transaksi</th>
                  <th className="py-3 px-2 text-right w-1/4">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                {laporan.rincian?.map((rin: any) => (
                  <tr key={rin.id}>
                    <td className="py-4 px-2 text-gray-800 font-semibold">{rin.kategori_kegiatan}</td>
                    <td className="py-4 px-2 text-gray-600">
                      {rin.bukti_transaksi_path ? (
                        <a href={`${STORAGE_URL}${rin.bukti_transaksi_path}`} target="_blank" rel="noreferrer" className="text-[#185325] underline italic font-medium hover:text-[#113d1c]">
                          {getFileName(rin.bukti_transaksi_path) || 'Lihat Bukti'}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-2 text-gray-800 font-medium text-right">{formatRupiah(rin.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center px-2">
            <p className="text-xs font-semibold text-gray-600 mb-2 md:mb-0">
              Status Tahap: <span className={
                laporan.status === 'Terverifikasi' ? 'text-[#2E7D32] font-bold' : 
                ['Revisi', 'Ditolak', 'Perlu Revisi'].includes(laporan.status) ? 'text-red-600 font-bold' : 
                'text-amber-600 font-bold'
              }>{laporan.status}</span>
            </p>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Subtotal Realisasi ({laporan.tahap})</p>
              <p className="text-lg text-[#185325] font-bold">{formatRupiah(laporan.dana_direalisasikan)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}