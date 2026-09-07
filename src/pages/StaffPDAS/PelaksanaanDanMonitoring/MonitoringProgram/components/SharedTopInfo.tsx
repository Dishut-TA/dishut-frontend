import React from 'react';
import PetaPetakUkur from '@/components/maps/PetaPetakUkur';
import type { DetailPenugasan } from '@/hooks/useDetailPenugasan';

interface SharedTopInfoProps {
  data: DetailPenugasan | null;
  hideMap?: boolean;
}

const tanggalId = (nilai?: string | null) => {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const angkaId = (nilai?: number | null, satuan = '') => {
  if (nilai === null || nilai === undefined) return '-';
  return `${Number(nilai).toLocaleString('id-ID')}${satuan ? ` ${satuan}` : ''}`;
};

const Baris = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_10px_1fr]">
    <span className="text-gray-500 font-medium">{label}</span>
    <span>:</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

/**
 * Ringkasan program di bagian atas halaman monitoring.
 * Seluruh nilainya berasal dari detail penugasan, bukan lagi teks tetap.
 */
const SharedTopInfo: React.FC<SharedTopInfoProps> = ({ data, hideMap }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs w-full">
          <Baris label="ID Program" value={data?.id ?? '-'} />
          <Baris label="Tanggal Pelaksanaan" value={tanggalId(data?.tanggal_penugasan)} />
          {!hideMap && <Baris label="Penyuluh" value={data?.penyuluh || '-'} />}

          <Baris label="Jenis Program" value={data?.programName || '-'} />
          <Baris label="Tanggal Selesai" value={tanggalId(data?.batas_waktu)} />
          {!hideMap && <Baris label="KTH" value={data?.kth || '-'} />}

          <Baris label="Sumber Dana" value={data?.sumberDana || '-'} />
          <Baris label="Target Tanam" value={angkaId(data?.stats.targetTanam, 'Pohon')} />

          <Baris label="Lokasi Program" value={data?.lokasi || '-'} />
          <Baris label="Realisasi Tanam" value={angkaId(data?.stats.tanamanHidup, 'Pohon')} />
        </div>
      </div>

      {!hideMap && (
        <div className="w-full lg:w-64 shrink-0 rounded-xl overflow-hidden border border-gray-200 h-32 mt-4 lg:mt-0">
          <PetaPetakUkur
            petakUkurs={data?.petakUkurs}
            emptyMessage="Batas petak ukur belum digambar."
          />
        </div>
      )}
    </div>
  );
};

export default SharedTopInfo;
