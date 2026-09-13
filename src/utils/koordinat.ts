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

/**
 * Centroid sederhana dari polygon petak ukur (petak_ukurs.polygon_data).
 *
 * Menerima simpul berbentuk {lat, lng} maupun {latitude, longitude}, dan
 * mengabaikan simpul yang koordinatnya bukan angka. Mengembalikan null bila
 * tidak ada simpul valid, sehingga pemanggil bisa menyembunyikan peta.
 */
export const centroidPolygon = (polygon: any): [number, number] | null => {
  if (!Array.isArray(polygon)) return null;

  const titik = polygon.reduce<[number, number][]>((acc, simpul: any) => {
    const lat = Number(simpul?.lat ?? simpul?.latitude);
    const lng = Number(simpul?.lng ?? simpul?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) acc.push([lat, lng]);
    return acc;
  }, []);

  if (titik.length === 0) return null;

  return [
    titik.reduce((s, t) => s + t[0], 0) / titik.length,
    titik.reduce((s, t) => s + t[1], 0) / titik.length,
  ];
};
