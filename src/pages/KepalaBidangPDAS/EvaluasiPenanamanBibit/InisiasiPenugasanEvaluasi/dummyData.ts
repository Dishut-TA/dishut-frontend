export interface PenugasanAnggota {
  id_user: string;
  nama: string;
  email: string;
  peran: string;
}

export interface PenugasanItem {
  id_penugasan: string;
  id?: string;
  nomor_surat: string;
  noSurat?: string;
  tanggal_surat: string;
  tanggalSurat?: string;
  id_program: string;
  nama_proyek: string;
  proyek: string;
  lokasi: string;
  luas_ha: number | string;
  luas: number | string;
  jenis_program: string;
  periode_evaluasi: string;
  periode?: string;
  status_program: string;
  status_surat: string;
  tanggal_mulai: string;
  tanggal_awal?: string;
  tanggal_selesai: string;
  tanggal_akhir?: string;
  file_surat_url?: string;
  tim_penilai: PenugasanAnggota[];
}

export const DUMMY_PROGRAMS_READY = [
  {
    id_program: 'PRG-2026-001',
    nama_program: 'Rehabilitasi Hutan Lindung DAS Cimanuk Hulu',
    lokasi: 'Kec. Cisurupan, Kab. Garut',
    jenis_program: 'APBD',
    luas_ha: 25,
  },
  {
    id_program: 'PRG-2026-002',
    nama_program: 'Penanaman Pohon Blok Cisangkuy KBU',
    lokasi: 'Kec. Pangalengan, Kab. Bandung',
    jenis_program: 'CSR',
    luas_ha: 40,
  },
  {
    id_program: 'PRG-2026-003',
    nama_program: 'Pemulihan Vegetasi Kawasan Manglayang Timur',
    lokasi: 'Kec. Tanjungsari, Kab. Sumedang',
    jenis_program: 'APBD',
    luas_ha: 15,
  },
  {
    id_program: 'PRG-2026-004',
    nama_program: 'Rehabilitasi Lahan Kritis Hulu Citarum',
    lokasi: 'Kec. Kertasari, Kab. Bandung',
    jenis_program: 'CSR',
    luas_ha: 50,
  },
  {
    id_program: 'PRG-2026-005',
    nama_program: 'Restorasi Sumber Mata Air DAS Cipeles',
    lokasi: 'Kec. Conggeang, Kab. Sumedang',
    jenis_program: 'APBD',
    luas_ha: 20,
  },
];

export const DUMMY_STAFF_LIST = [
  { id_user: 'user-srie', nama: 'Srie Resmita Dewi, SP., MP', email: 'srie@dishut.jabarprov.go.id' },
  { id_user: 'user-caskadi', nama: 'Muhammad Caskadi, S.Hut', email: 'caskadi@dishut.jabarprov.go.id' },
  { id_user: 'user-andi', nama: 'Andi Mansur, S.P., M.Si', email: 'andi@dishut.jabarprov.go.id' },
  { id_user: 'user-hendra', nama: 'Ir. Hendra Gunawan, MT', email: 'hendra.g@dishut.jabarprov.go.id' },
  { id_user: 'user-siti', nama: 'Siti Nurhaliza, S.Hut', email: 'siti.n@dishut.jabarprov.go.id' },
];

export const INITIAL_DUMMY_PENUGASAN: PenugasanItem[] = [
  {
    id_penugasan: 'TUGAS-EV-001',
    id: 'TUGAS-EV-001',
    nomor_surat: 'ST.084/DISHUT-PDAS/EV/VIII/2026',
    noSurat: 'ST.084/DISHUT-PDAS/EV/VIII/2026',
    tanggal_surat: '2026-08-10',
    tanggalSurat: '2026-08-10',
    id_program: 'PRG-2026-001',
    nama_proyek: 'Rehabilitasi Hutan Lindung DAS Cimanuk Hulu',
    proyek: 'Rehabilitasi DAS Cimanuk Hulu',
    lokasi: 'Kec. Cisurupan, Kab. Garut',
    luas_ha: 25,
    luas: 25,
    jenis_program: 'APBD',
    periode_evaluasi: 'Penanaman Awal (P0)',
    periode: 'Penanaman Awal (P0)',
    status_program: 'Tahap Penanaman (P0)',
    status_surat: 'TELAH DITUGASKAN',
    tanggal_mulai: '2026-08-15',
    tanggal_awal: '2026-08-15',
    tanggal_selesai: '2026-08-22',
    tanggal_akhir: '2026-08-22',
    file_surat_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tim_penilai: [
      { id_user: 'user-srie', nama: 'Srie Resmita Dewi, SP., MP', email: 'srie@dishut.jabarprov.go.id', peran: 'Ketua Tim' },
      { id_user: 'user-caskadi', nama: 'Muhammad Caskadi, S.Hut', email: 'caskadi@dishut.jabarprov.go.id', peran: 'Sekretaris Tim' },
      { id_user: 'user-andi', nama: 'Andi Mansur, S.P., M.Si', email: 'andi@dishut.jabarprov.go.id', peran: 'Anggota Tim' },
    ],
  },
  {
    id_penugasan: 'TUGAS-EV-002',
    id: 'TUGAS-EV-002',
    nomor_surat: 'ST.092/DISHUT-PDAS/EV/VIII/2026',
    noSurat: 'ST.092/DISHUT-PDAS/EV/VIII/2026',
    tanggal_surat: '2026-08-18',
    tanggalSurat: '2026-08-18',
    id_program: 'PRG-2026-002',
    nama_proyek: 'Penanaman Pohon Blok Cisangkuy KBU',
    proyek: 'Penanaman Pohon Blok Cisangkuy KBU',
    lokasi: 'Kec. Pangalengan, Kab. Bandung',
    luas_ha: 40,
    luas: 40,
    jenis_program: 'CSR',
    periode_evaluasi: 'Pemeliharaan I (P1)',
    periode: 'Pemeliharaan I (P1)',
    status_program: 'Pemeliharaan I (P1)',
    status_surat: 'TELAH DITUGASKAN',
    tanggal_mulai: '2026-08-20',
    tanggal_awal: '2026-08-20',
    tanggal_selesai: '2026-08-28',
    tanggal_akhir: '2026-08-28',
    file_surat_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tim_penilai: [
      { id_user: 'user-andi', nama: 'Andi Mansur, S.P., M.Si', email: 'andi@dishut.jabarprov.go.id', peran: 'Ketua Tim' },
      { id_user: 'user-hendra', nama: 'Ir. Hendra Gunawan, MT', email: 'hendra.g@dishut.jabarprov.go.id', peran: 'Sekretaris Tim' },
      { id_user: 'user-siti', nama: 'Siti Nurhaliza, S.Hut', email: 'siti.n@dishut.jabarprov.go.id', peran: 'Anggota Tim' },
    ],
  },
  {
    id_penugasan: 'TUGAS-EV-003',
    id: 'TUGAS-EV-003',
    nomor_surat: 'ST.105/DISHUT-PDAS/EV/VIII/2026',
    noSurat: 'ST.105/DISHUT-PDAS/EV/VIII/2026',
    tanggal_surat: '2026-08-25',
    tanggalSurat: '2026-08-25',
    id_program: 'PRG-2026-003',
    nama_proyek: 'Pemulihan Vegetasi Kawasan Manglayang Timur',
    proyek: 'Pemulihan Vegetasi Manglayang',
    lokasi: 'Kec. Tanjungsari, Kab. Sumedang',
    luas_ha: 15,
    luas: 15,
    jenis_program: 'APBD',
    periode_evaluasi: 'Pemeliharaan II (P2)',
    periode: 'Pemeliharaan II (P2)',
    status_program: 'Pemeliharaan II (P2)',
    status_surat: 'TELAH DITUGASKAN',
    tanggal_mulai: '2026-08-28',
    tanggal_awal: '2026-08-28',
    tanggal_selesai: '2026-09-05',
    tanggal_akhir: '2026-09-05',
    file_surat_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tim_penilai: [
      { id_user: 'user-srie', nama: 'Srie Resmita Dewi, SP., MP', email: 'srie@dishut.jabarprov.go.id', peran: 'Ketua Tim' },
      { id_user: 'user-siti', nama: 'Siti Nurhaliza, S.Hut', email: 'siti.n@dishut.jabarprov.go.id', peran: 'Anggota Tim' },
    ],
  },
  {
    id_penugasan: 'TUGAS-EV-004',
    id: 'TUGAS-EV-004',
    nomor_surat: 'ST.112/DISHUT-PDAS/EV/VIII/2026',
    noSurat: 'ST.112/DISHUT-PDAS/EV/VIII/2026',
    tanggal_surat: '2026-08-29',
    tanggalSurat: '2026-08-29',
    id_program: 'PRG-2026-004',
    nama_proyek: 'Rehabilitasi Lahan Kritis Hulu Citarum',
    proyek: 'Rehabilitasi Hulu Citarum',
    lokasi: 'Kec. Kertasari, Kab. Bandung',
    luas_ha: 50,
    luas: 50,
    jenis_program: 'CSR',
    periode_evaluasi: 'Penanaman Awal (P0)',
    periode: 'Penanaman Awal (P0)',
    status_program: 'Tahap Penanaman (P0)',
    status_surat: 'DALAM PROSES EVALUASI',
    tanggal_mulai: '2026-09-01',
    tanggal_awal: '2026-09-01',
    tanggal_selesai: '2026-09-10',
    tanggal_akhir: '2026-09-10',
    file_surat_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tim_penilai: [
      { id_user: 'user-hendra', nama: 'Ir. Hendra Gunawan, MT', email: 'hendra.g@dishut.jabarprov.go.id', peran: 'Ketua Tim' },
      { id_user: 'user-caskadi', nama: 'Muhammad Caskadi, S.Hut', email: 'caskadi@dishut.jabarprov.go.id', peran: 'Anggota Tim' },
    ],
  },
];

const STORAGE_KEY = 'KABID_EVALUASI_PENUGASAN_DUMMY_DATA';

export const getStoredPenugasanList = (): PenugasanItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DUMMY_PENUGASAN));
      return INITIAL_DUMMY_PENUGASAN;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DUMMY_PENUGASAN));
    return INITIAL_DUMMY_PENUGASAN;
  } catch (err) {
    console.error('Failed to read dummy data from localStorage', err);
    return INITIAL_DUMMY_PENUGASAN;
  }
};

export const getStoredPenugasanDetail = (id: string): PenugasanItem | undefined => {
  const list = getStoredPenugasanList();
  const found = list.find(item => item.id_penugasan === id || item.id === id);
  if (found) return found;
  return INITIAL_DUMMY_PENUGASAN.find(item => item.id_penugasan === id || item.id === id) || INITIAL_DUMMY_PENUGASAN[0];
};

export const saveNewPenugasan = (item: PenugasanItem): void => {
  try {
    const list = getStoredPenugasanList();
    const updated = [item, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save dummy penugasan to localStorage', err);
  }
};
