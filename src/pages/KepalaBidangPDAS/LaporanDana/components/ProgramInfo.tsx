const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

export default function ProgramInfo({ data, laporanDanas }: { data: any; laporanDanas: any[] }) {
  const totalDisalurkan = laporanDanas.reduce((sum, l) => sum + Number(l.dana_disalurkan || 0), 0);
  const totalDirealisasikan = laporanDanas
    .filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status))
    .reduce((sum, l) => sum + Number(l.dana_direalisasikan || 0), 0);
  
  const sisaDana = totalDisalurkan - totalDirealisasikan;

  const year = data.created_at ? new Date(data.created_at).getFullYear() : new Date().getFullYear();
  const paddedId = String(data.program_id || data.id).padStart(3, '0');
  const formattedId = `P-${data.sumber_dana}-${year}-${paddedId}`;

  const renderStatusBadge = (status: string) => {
    const baseStyle = "px-4 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-block";
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Menunggu Persetujuan':
        return <span className={`${baseStyle} bg-amber-100 text-amber-800`}>{status}</span>;
      case 'Terverifikasi':
        return <span className={`${baseStyle} bg-emerald-100 text-emerald-800 border border-emerald-200`}>{status}</span>;
      case 'Selesai':
      case 'Disetujui':
        return <span className={`${baseStyle} bg-emerald-600 text-white`}>{status}</span>;
      case 'Aktif':
      case 'Berjalan':
        return <span className={`${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`}>{status}</span>;
      case 'Ditolak':
      case 'Revisi':
      case 'Perlu Revisi':
        return <span className={`${baseStyle} bg-red-100 text-red-700 border border-red-200`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status || '-'}</span>;
    }
  };

  const InfoRow = ({ label, value, isStatus = false }: { label: string, value: string, isStatus?: boolean }) => {
    return (
      <div className="flex items-start mb-4 text-sm">
        <span className="w-48 md:w-56 shrink-0 text-gray-500 font-medium">{label}</span>
        <span className="w-8 shrink-0 text-gray-500 text-center">:</span>
        {isStatus ? (
          <span className="flex-1">{renderStatusBadge(value)}</span>
        ) : (
          <span className="flex-1 font-bold text-gray-800">{value || '-'}</span>
        )}
      </div>
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Informasi Program</h3>
      <InfoRow label="ID Program" value={formattedId} />
      <InfoRow label="Nama Program" value={data.nama_program} />
      <InfoRow label="Sumber Dana" value={data.sumber_dana} />
      <InfoRow label="Total Dana Disalurkan" value={formatRupiah(totalDisalurkan)} />
      <InfoRow label="Total Dana Direalisasi" value={formatRupiah(totalDirealisasikan)} />
      <InfoRow label="Sisa Dana Tersedia" value={formatRupiah(sisaDana)} />
      <InfoRow label="Status Terkini" value={data.status} isStatus />
    </div>
  );
}