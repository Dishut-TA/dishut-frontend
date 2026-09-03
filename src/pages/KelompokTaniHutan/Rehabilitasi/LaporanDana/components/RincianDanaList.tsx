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
        <div key={laporan.id} className="mb-8 border border-gray-100 rounded-xl p-6 bg-gray-50/30">
          <h4 className="text-sm font-bold text-gray-800 mb-4">
            {laporan.tahap} — Dilaporkan pada {new Date(laporan.tanggal_pengeluaran).toLocaleDateString('id-ID')}
          </h4>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm mb-4">
              <thead className="border-y border-gray-200 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 font-bold px-2 w-1/3">KEGIATAN</th>
                  <th className="py-3 font-bold w-1/4">BUKTI TRANSAKSI</th>
                  <th className="py-3 font-bold text-right w-1/4">NOMINAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                {laporan.rincian?.map((rin: any) => (
                  <tr key={rin.id}>
                    <td className="py-4 px-2 text-gray-800 font-semibold">{rin.kategori_kegiatan}</td>
                    <td className="py-4 text-gray-600">
                      {rin.bukti_transaksi_path ? (
                        <a href={`${STORAGE_URL}${rin.bukti_transaksi_path}`} target="_blank" rel="noreferrer" className="text-[#185325] underline italic font-medium hover:text-[#113d1c]">
                          {getFileName(rin.bukti_transaksi_path) || 'Lihat Nota'}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="py-4 text-gray-800 font-medium text-right">{formatRupiah(rin.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {laporan.catatan && (
            <div className="mb-4 text-xs bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
              <span className="font-bold">Catatan Revisi:</span> {laporan.catatan}
            </div>
          )}

          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center px-2">
            <p className="text-sm font-semibold text-gray-600 mb-2 md:mb-0">
              Status Tahap: <span className={laporan.status === 'Terverifikasi' ? 'text-[#2E7D32] font-bold' : laporan.status === 'Revisi' ? 'text-red-600 font-bold' : 'text-orange-500 font-bold'}>{laporan.status}</span>
            </p>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Subtotal {laporan.tahap}</p>
              <p className="text-base text-[#185325] font-bold">{formatRupiah(laporan.dana_direalisasikan)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}