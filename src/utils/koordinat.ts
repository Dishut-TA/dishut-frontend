/**
 * Mengurai koordinat geotag berformat teks menjadi pasangan [lat, lng].
 *
 * Data lapangan tersimpan sebagai teks bebas dengan beberapa variasi, contoh:
 *   "6.841232° S\n107.564891° E"
 *   "-6.342512° S / 108.323145° E"
 *   "-6.9204, 107.5046"
 *
 * Huruf arah mata angin yang menentukan tanda: S dan W menjadi negatif.
 * Bila teks sudah memuat tanda minus sekaligus huruf S/W, nilai absolutnya
 * yang dipakai supaya tidak berbalik menjadi positif.
 */
export const parseKoordinat = (teks?: string | null): [number, number] | null => {
  if (!teks || typeof teks !== 'string') return null;

  // Tangkap angka beserta huruf arah yang mengikutinya, bila ada.
  const cocok = [...teks.matchAll(/(-?\d+(?:[.,]\d+)?)\s*°?\s*([NSEW])?/gi)];
  if (cocok.length < 2) return null;

  const nilai = cocok.slice(0, 2).map((m) => {
    const angka = Number(m[1].replace(',', '.'));
    const arah = m[2]?.toUpperCase();

    if (!Number.isFinite(angka)) return null;
    if (arah === 'S' || arah === 'W') return -Math.abs(angka);
    if (arah === 'N' || arah === 'E') return Math.abs(angka);
    return angka;
  });

  const [lat, lng] = nilai;
  if (lat === null || lng === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return [lat, lng];
};
