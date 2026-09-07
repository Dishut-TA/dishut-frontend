import React, { useMemo } from 'react';
import PetaPetakUkur from './PetaPetakUkur';
import { parseKoordinat } from '@/utils/koordinat';

interface PetaTitikKoordinatProps {
  /** Koordinat geotag berformat teks, mis. "6.841232° S\n107.564891° E". */
  koordinat?: string | null;
  label?: string;
  keterangan?: string;
  height?: string;
  zoom?: number;
  emptyMessage?: string;
}

/**
 * Peta satu titik geotag. Dipakai halaman detail yang hanya menyimpan
 * koordinat sebagai teks, bukan polygon petak ukur.
 */
const PetaTitikKoordinat: React.FC<PetaTitikKoordinatProps> = ({
  koordinat,
  label = 'Titik Lokasi',
  keterangan,
  height = '100%',
  zoom = 17,
  emptyMessage = 'Koordinat belum tersedia.',
}) => {
  const titik = useMemo(() => {
    const posisi = parseKoordinat(koordinat);
    if (!posisi) return [];

    return [
      {
        id: 'titik',
        lat: posisi[0],
        lng: posisi[1],
        nama_lokasi: label,
        desa: keterangan,
      },
    ];
  }, [koordinat, label, keterangan]);

  return (
    <PetaPetakUkur
      titik={titik}
      height={height}
      zoom={zoom}
      emptyMessage={emptyMessage}
    />
  );
};

export default PetaTitikKoordinat;
