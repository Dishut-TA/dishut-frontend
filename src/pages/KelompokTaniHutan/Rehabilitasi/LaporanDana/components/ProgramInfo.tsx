const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
};

export default function ProgramInfo({ data, laporanDanas }: { data: any; laporanDanas: any[] }) {
  const totalDisalurkan = laporanDanas.reduce((sum, l) => sum + Number(l.dana_disalurkan || 0), 0);
  const totalDirealisasikan = laporanDanas
    .filter(l => ['Terverifikasi', 'Menunggu Verifikasi'].includes(l.status))
    .reduce((sum, l) => sum + Number(l.dana_direalisasikan || 0), 0);
  const sisaDana = totalDisalurkan - totalDirealisasikan;

  const InfoRow = ({ label, value, isStatus = false }: { label: string, value: string, isStatus?: boolean }) => {
    let textColor = 'text-gray-800';
    if (isStatus) {
      const lower = value.toLowerCase();
      if (lower.includes('terverifikasi')) textColor = 'text-[#2E7D32]';
      else if (lower.includes('menunggu')) textColor = 'text-yellow-600';
      else if (lower.includes('revisi')) textColor = 'text-red-600';
    }
    return (
      <div className="flex items-start mb-4 text-sm">
        <span className="w-48 md:w-56 shrink-0 text-gray-500">{label}</span>
        <span className="w-8 shrink-0 text-gray-500 text-center">:</span>
        <span className={`flex-1 font-semibold ${textColor}`}>{value || '-'}</span>
      </div>
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-base font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Informasi Program</h3>
      <InfoRow label="Nama Program" value={data.nama_program} />
      <InfoRow label="Sumber Dana" value={data.sumber_dana} />
      <InfoRow label="Total Disalurkan" value={formatRupiah(totalDisalurkan)} />
      <InfoRow label="Total Direalisasikan" value={formatRupiah(totalDirealisasikan)} />
      <InfoRow label="Sisa Dana" value={formatRupiah(sisaDana)} />
      <InfoRow label="Status Terakhir" value={data.status} isStatus />
    </div>
  );
}