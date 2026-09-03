# PRD --- Modul Pelaksanaan dan Monitoring Program Rehabilitasi

## 1. Informasi Produk

  -----------------------------------------------------------------------
  Informasi                           Detail
  ----------------------------------- -----------------------------------
  Produk                              Sistem Informasi Terintegrasi
                                      Mitigasi Bencana dan Rehabilitasi
                                      Hutan

  Modul                               Pelaksanaan dan Monitoring Program
                                      Rehabilitasi

  Platform                            Mobile Web Application

  Status                              Requirement untuk Pengembangan
                                      Backend

  Aktor                               Staff PDAS, Penyuluh, KTH, Kepala
                                      Bidang PDAS

  Modul Terintegrasi                  Modul Validasi, Modul Donasi, Modul
                                      Investasi, Modul Evaluasi
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Tujuan Modul

Modul Pelaksanaan dan Monitoring digunakan untuk mengelola kegiatan
rehabilitasi setelah lokasi tervalidasi dan program pendanaan tersedia.

Modul ini bertanggung jawab terhadap:

1.  menerima program yang telah tervalidasi dan memperoleh pendanaan;
2.  mengelola pelaksanaan penanaman awal P0;
3.  membuat polygon berdasarkan Petak Ukur (PU) yang telah ditentukan
    pada modul sebelumnya;
4.  mencatat hasil pelaksanaan P0;
5.  mencatat hasil monitoring P1 sampai P4;
6.  menyimpan dokumentasi foto dan koordinat/geotagging;
7.  mengirim hasil monitoring ke Modul Evaluasi;
8.  menerima perubahan status yang berasal dari Modul Investasi,
    khususnya penghentian pendanaan CSR;
9.  menyediakan rekapitulasi kegiatan;
10. menyediakan unduhan rekapitulasi sebagai bentuk laporan kegiatan.

------------------------------------------------------------------------

## 3. Scope

### 3.1 In Scope

-   Validasi lokasi sebagai prasyarat masuk tahap pendanaan.
-   Penerimaan program dari Modul Donasi dan Modul Investasi.
-   Penugasan pelaksanaan P0.
-   Input hasil pelaksanaan P0 oleh Penyuluh.
-   Pembuatan polygon sesuai jumlah PU.
-   Dokumentasi foto dan geotagging.
-   Penugasan monitoring awal P1.
-   Input monitoring P1, P2, P3, dan P4 oleh Penyuluh.
-   Integrasi hasil monitoring dengan Modul Evaluasi.
-   Integrasi status penghentian pendanaan CSR dari Modul Investasi.
-   Rekapitulasi pelaksanaan dan monitoring.
-   Pengunduhan rekapitulasi setelah kegiatan selesai.

### 3.2 Out of Scope

-   Analisis lahan kritis.
-   Perhitungan CPI.
-   Pembuatan proposal program.
-   Evaluasi hasil monitoring.
-   Keputusan penyulaman/tindak lanjut.
-   Penugasan monitoring P2, P3, dan P4 oleh Staff PDAS.
-   Input pelaksanaan oleh KTH.
-   Input monitoring oleh KTH.
-   Pembuatan laporan sebagai workflow terpisah.

------------------------------------------------------------------------

## 4. Aktor dan Hak Akses

  Fitur                         Staff PDAS     Penyuluh         KTH        Kabid PDAS
  ---------------------------- ------------ -------------- -------------- ------------
  Melihat program                   Ya            Ya             Ya            Ya
  Melihat status program            Ya            Ya             Ya            Ya
  Penugasan pelaksanaan P0          Ya          Tidak          Tidak         Tidak
  Input hasil pelaksanaan P0      Tidak           Ya           Tidak         Tidak
  Membuat polygon                 Tidak           Ya           Tidak         Tidak
  Melihat polygon                   Ya            Ya             Ya            Ya
  Penugasan monitoring P1           Ya          Tidak          Tidak         Tidak
  Input monitoring P1             Tidak           Ya           Tidak         Tidak
  Input monitoring P2             Tidak           Ya           Tidak         Tidak
  Input monitoring P3             Tidak           Ya           Tidak         Tidak
  Input monitoring P4             Tidak           Ya           Tidak         Tidak
  Melihat hasil monitoring          Ya            Ya             Ya            Ya
  Melihat rekapitulasi              Ya       Sesuai akses   Sesuai akses       Ya
  Mengunduh rekapitulasi            Ya       Sesuai akses   Sesuai akses       Ya

### Aturan KTH

KTH tidak melakukan input data ke dalam sistem.

KTH hanya:

-   melihat informasi program;
-   melihat status program;
-   melakukan kegiatan fisik di lapangan;
-   melakukan kegiatan di bawah pantauan Penyuluh.

Penyuluh bertanggung jawab mencatat hasil kegiatan KTH ke dalam sistem.

------------------------------------------------------------------------

## 5. Alur Bisnis Utama

``` text
Lokasi ditentukan pada modul sebelumnya
        ↓
Validasi Lokasi
        ↓
Lokasi Tervalidasi
        ↓
Modul Donasi / Modul Investasi
        ↓
Pendanaan tersedia
        ↓
Pelaksanaan P0
        ↓
Pembuatan Polygon berdasarkan PU
        ↓
Input hasil P0 oleh Penyuluh
        ↓
P0 Selesai
        ↓
Penugasan Monitoring P1
        ↓
Monitoring P1 oleh Penyuluh
        ↓
Hasil Monitoring
        ↓
Modul Evaluasi
        ↓
 ┌─────────────────────┐
 │                     │
 ▼                     ▼
Sesuai               < 75%
 │                     │
 ▼                     ▼
Lanjut periode       Tindak lanjut /
berikutnya            evaluasi
 │
 ▼
P2 → P3 → P4
```

------------------------------------------------------------------------

## 6. Alur Pendanaan

Setelah lokasi tervalidasi, program tidak langsung masuk ke pelaksanaan
P0.

Program terlebih dahulu memperoleh pendanaan dari modul yang sesuai.

Pada program donasi, ketersediaan dana tidak otomatis memicu pelaksanaan P0. Diperlukan unggahan dokumen Berita Acara Serah Terima (BAST) sebagai *trigger* integrasi.

### Program Donasi

``` text
Lokasi Tervalidasi
        ↓
Modul Donasi (Status Bibit: Terkumpul)
        ↓
Upload Dokumen BAST (Manual oleh Staff PDAS)
        ↓
Modul Donasi (Status Bibit: Disalurkan)
        ↓
Masuk ke Dashboard Penugasan Pelaksanaan P0
```

### Program APBD / CSR

``` text
Lokasi Tervalidasi
        ↓
Modul Investasi
        ↓
Program Pendanaan
        ↓
Pelaksanaan P0
```

### Business Rule

Program hanya dapat masuk ke pelaksanaan P0 apabila:

-   lokasi telah tervalidasi; dan
-   informasi/status pendanaan telah tersedia dari Modul Donasi atau
    Modul Investasi.
- Modul Donasi hanya dilakukan sampai P0 (HANYA PELAKSANAAN, NAMUN TIDAK DILAKUKAN MONITORING P1 P2 P3 DST)

------------------------------------------------------------------------

## 7. Feature 1 --- Pelaksanaan P0

### Tujuan

Mencatat pelaksanaan kegiatan penanaman awal setelah program memperoleh
pendanaan.

### Aktor

-   Staff PDAS: melakukan penugasan.
-   Penyuluh: melakukan seluruh input hasil pelaksanaan.
-   KTH: melakukan kegiatan fisik di lapangan di bawah pantauan
    Penyuluh.

### Alur

``` text
Program Pendanaan Tersedia
        ↓
Staff melakukan penugasan
        ↓
Penyuluh menerima tugas
        ↓
Kegiatan P0 dilakukan
        ↓
Penyuluh menginput hasil kegiatan
        ↓
Pembuatan polygon PU
        ↓
Data pelaksanaan lengkap
        ↓
P0 Selesai
```
### Business Rules Integrasi Donasi

- Program bersumber dari Donasi **hanya akan muncul** di halaman Penugasan Staff PDAS apabila status donasi sudah berubah menjadi `disalurkan` (BAST telah diunggah di Modul Donasi).
- Saat Pelaksanaan P0 dinyatakan `Selesai`, Modul Pelaksanaan wajib mengirimkan *trigger/event* balik ke Modul Donasi untuk mengubah status bibit terkait dari `disalurkan` menjadi `terealisasi`.

------------------------------------------------------------------------

## 8. Feature 2 --- Pembuatan Polygon

Polygon dibuat pada tahap pelaksanaan P0.

### Aturan Utama

Jumlah polygon harus mengikuti jumlah Petak Ukur (PU) yang telah
ditentukan pada modul sebelumnya.

Contoh:

``` text
Modul sebelumnya:
Jumlah PU = 5

Pelaksanaan P0:
Jumlah polygon yang harus dibuat = 5
```

### Relasi

``` text
Program
 ├── PU 1 → Polygon 1
 ├── PU 2 → Polygon 2
 ├── PU 3 → Polygon 3
 ├── PU 4 → Polygon 4
 └── PU 5 → Polygon 5
```

### Business Rules Polygon

1.  Satu PU memiliki satu polygon.
2.  Jumlah polygon harus sama dengan jumlah PU.
3.  Polygon tidak boleh dibuat tanpa PU yang sesuai.
4.  Polygon tambahan yang tidak memiliki PU harus ditolak.
5.  Polygon yang belum lengkap menyebabkan proses P0 belum dapat
    dianggap lengkap.
6.  Polygon dibuat oleh Penyuluh.

### Data Polygon

  Field          Keterangan
  -------------- -----------------------
  `polygon_id`   ID polygon
  `program_id`   ID program
  `pu_id`        PU yang terkait
  `geometry`     Data geometri polygon
  `created_by`   Penyuluh
  `created_at`   Waktu pembuatan

------------------------------------------------------------------------

## 9. Feature 3 --- Input Pelaksanaan P0

Hanya Penyuluh yang dapat menginput hasil pelaksanaan P0.

### Data yang dicatat

-   program;
-   Petak Ukur;
-   jenis tanaman;
-   jumlah bibit/tanaman;
-   target_bibit;
-   bibit_terealisasi;
-   tanggal pelaksanaan;
-   polygon;
-   koordinat;
-   foto;
-   kondisi kegiatan;
-   catatan;
-   status pelaksanaan.

### Business Rules

-   KTH tidak dapat menginput data pelaksanaan.
-   Penyuluh dapat menginput dan menyimpan hasil pelaksanaan.
-   Data wajib harus lengkap sebelum kegiatan dapat dinyatakan selesai.
-   Polygon harus sesuai dengan jumlah PU.
-   Setelah seluruh kebutuhan kegiatan terpenuhi, status P0 dapat
    menjadi `Selesai`.

------------------------------------------------------------------------

## 10. Feature 4 --- Monitoring

Monitoring terdiri dari periode:

-   P1;
-   P2;
-   P3;
-   P4.

### Penugasan Monitoring

Penugasan monitoring oleh Staff PDAS hanya dilakukan satu kali, yaitu
untuk P1.

  Periode    Penugasan oleh Staff   Input Penyuluh
  --------- ---------------------- ----------------
  P1                  Ya                  Ya
  P2                Tidak                 Ya
  P3                Tidak                 Ya
  P4                Tidak                 Ya

### Business Rule

-   Staff hanya membuat penugasan monitoring awal P1.
-   Penugasan P1 tidak boleh dibuat lebih dari satu kali untuk alur
    monitoring yang sama.
-   P2, P3, dan P4 tidak ditugaskan ulang oleh Staff melalui modul ini.
-   Penyuluh menginput seluruh hasil monitoring P1 sampai P4.
-   Kelanjutan ke periode berikutnya mengikuti hasil dari Modul
    Evaluasi.

------------------------------------------------------------------------

## 11. Feature 5 --- Monitoring P1

Setelah P0 selesai:

``` text
P0 Selesai
    ↓
Penugasan Monitoring P1
    ↓
Penyuluh
    ↓
Monitoring P1
```

### Data Monitoring

-   program;
-   periode;
-   Petak Ukur;
-   tanggal monitoring;
-   jenis tanaman;
-   jumlah tanaman hidup;
-   jumlah tanaman mati;
-   jumlah tanaman belum tumbuh;
-   tinggi tanaman;
-   kondisi tanaman;
-   foto;
-   koordinat/geotagging;
-   catatan;
-   status monitoring.

------------------------------------------------------------------------

## 12. Feature 6 --- Monitoring P2, P3, P4

Setelah hasil monitoring suatu periode diproses oleh Modul Evaluasi,
program dapat melanjutkan ke periode berikutnya apabila hasil evaluasi
menyatakan sesuai.

Contoh:

``` text
P1
 ↓
Evaluasi
 ↓
Sesuai
 ↓
P2
 ↓
Evaluasi
 ↓
Sesuai
 ↓
P3
 ↓
Evaluasi
 ↓
Sesuai
 ↓
P4
```

Penyuluh tetap menjadi pihak yang menginput hasil monitoring pada setiap
periode.

------------------------------------------------------------------------

## 13. Integrasi dengan Modul Evaluasi

Modul Pelaksanaan dan Monitoring hanya bertanggung jawab untuk:

1.  menerima tugas monitoring;
2.  mencatat hasil monitoring;
3.  menyimpan data;
4.  mengirimkan hasil monitoring ke Modul Evaluasi.

Modul Evaluasi bertanggung jawab untuk:

-   melakukan evaluasi;
-   menentukan hasil evaluasi;
-   menentukan kelanjutan periode;
-   menentukan tindak lanjut apabila diperlukan.

### Jika hasil sesuai

``` text
Hasil Monitoring
        ↓
Modul Evaluasi
        ↓
Sesuai
        ↓
Lanjut periode berikutnya
```

### Jika keberhasilan kurang dari 75%

``` text
Hasil Monitoring
        ↓
Modul Evaluasi
        ↓
Keberhasilan < 75%
        ↓
Tindak lanjut / keputusan evaluasi
```

Modul Pelaksanaan dan Monitoring tidak menentukan keputusan evaluasi
atau penyulaman.

------------------------------------------------------------------------

## 14. Feature 7 --- Integrasi Penghentian Pendanaan CSR

Khusus program CSR, pendanaan dapat dihentikan apabila hasil
keberhasilan kurang dari 75% dan pihak pendana memilih untuk
menghentikan pendanaan.

Perubahan tersebut dilakukan melalui Modul Investasi CSR.

### Alur

``` text
Hasil Monitoring
        ↓
Evaluasi
        ↓
Keberhasilan < 75%
        ↓
Modul Investasi CSR
        ↓
Pihak CSR memilih "Hentikan Pendanaan"
        ↓
Status Pendanaan = Dihentikan
        ↓
Modul Pelaksanaan & Monitoring
        ↓
Status Monitoring = Dihentikan
```

### Business Rules CSR

1.  Penyuluh tidak dapat menentukan status `Dihentikan`.
2.  Staff PDAS tidak mengubah status monitoring menjadi `Dihentikan`
    secara manual.
3.  Status `Dihentikan` dipicu oleh keputusan penghentian pendanaan pada
    Modul Investasi CSR.
4.  Perubahan status harus terhubung dengan program CSR yang
    bersangkutan.
5.  Setelah status monitoring menjadi `Dihentikan`, proses monitoring
    lanjutan tidak dapat dilanjutkan kecuali terdapat mekanisme bisnis
    baru yang ditentukan oleh modul terkait.

------------------------------------------------------------------------

## 15. Status Monitoring

Status umum:

``` text
Menunggu Monitoring
        ↓
Ditugaskan
        ↓
Berlangsung
        ↓
Selesai
```

Status khusus CSR:

``` text
Berlangsung
    ↓
Pendanaan CSR dihentikan
    ↓
Dihentikan
```

------------------------------------------------------------------------

## 16. Feature 8 --- Rekapitulasi

Modul ini tidak memiliki workflow pelaporan terpisah.

Yang tersedia adalah **rekapitulasi kegiatan**.

Rekapitulasi yang telah selesai dapat diunduh dan hasil unduhannya
menjadi bentuk laporan kegiatan.

### Alur

``` text
Kegiatan Berlangsung
        ↓
Data dikumpulkan
        ↓
Kegiatan Selesai
        ↓
Rekapitulasi tersedia
        ↓
User dapat mengunduh
        ↓
File rekapitulasi = bentuk laporan
```

### Aturan Utama

-   Rekapitulasi tidak dapat diunduh sebelum kegiatan selesai.
-   Rekapitulasi tersedia setelah kegiatan berstatus `Selesai`.
-   Tidak ada proses `Buat Laporan`.
-   Tidak ada proses approval laporan terpisah.
-   File hasil unduhan rekapitulasi merupakan bentuk laporan kegiatan.

------------------------------------------------------------------------

## 17. Rekapitulasi Pelaksanaan

Rekapitulasi P0 minimal berisi:

-   identitas program;
-   sumber pendanaan;
-   informasi kegiatan;
-   target;
-   realisasi;
-   Petak Ukur;
-   polygon;
-   jenis tanaman;
-   tanggal pelaksanaan;
-   dokumentasi;
-   koordinat;
-   status pelaksanaan.

Rekapitulasi hanya dapat diunduh setelah P0 selesai.

------------------------------------------------------------------------

## 18. Rekapitulasi Monitoring

Rekapitulasi monitoring dapat memuat:

-   identitas program;
-   periode monitoring;
-   Petak Ukur;
-   jumlah tanaman hidup;
-   jumlah tanaman mati;
-   jumlah tanaman belum tumbuh;
-   tinggi tanaman;
-   kondisi tanaman;
-   foto;
-   koordinat;
-   catatan;
-   status monitoring.

Rekapitulasi periode dapat diunduh setelah monitoring pada periode
tersebut selesai.

------------------------------------------------------------------------

## 19. Hak Akses Rekapitulasi

### Staff PDAS

Dapat:

-   melihat rekapitulasi;
-   mengunduh rekapitulasi.

### Penyuluh

Dapat melihat dan mengunduh rekapitulasi sesuai program/tugas yang
menjadi tanggung jawabnya.

### KTH

Dapat melihat informasi program dan status sesuai hak akses.

### Kepala Bidang PDAS

Dapat:

-   melihat rekapitulasi;
-   mengunduh rekapitulasi.

------------------------------------------------------------------------

## 20. Data Utama

Entity/data utama yang perlu diperhatikan backend:

1. PROGRAM

id_program (PK)

id_program_donasi (FK)

id_program_apbd (FK)

id_program_csr (FK)

id_bibit (FK)

nama

jenis_kegiatan

tanggal_pelaksanaan

target_bibit

status

2. PENUGASAN

id_penugasan (PK)

id_program (FK)

id_penyuluh (FK)

jenis_penugasan

tanggal_mulai

batas_waktu

catatan

status

3. PENUGASAN_VALIDASI

id_penugasan_validasi (PK)

id_penugasan (FK)

id_user (FK)

id_hasil_analisis (FK)

tanggal_validasi

batas_waktu

prioritas

status_penugasan

catatan_penugasan

4. HASIL_VALIDASI

id_hasil_validasi (PK)

id_validasi_lokasi (FK)

kesesuaian_lokasi

kondisi_lahan

aksesbilitas

status_kepemilikan

rekomendasi

lintang

bujur

akurasi_gps

dokumentasi

status_validasi

catatan_validasi

5. PENUGASAN_PELAKSANAAN

id_penugasan_pelaksanaan (PK)

id_penugasan (FK)

tanggal_penugasan

kondisi_bibit_yang_ditanam

metode_penanaman

target_jumlah_bibit

catatan_penugasan

6. HASIL_PELAKSANAAN

id_hasil_pelaksanaan (PK)

id_penugasan_pelaksanaan (FK)

tanggal_mulai

tanggal_selesai

jumlah_bibit_diterima

jumlah_bibit_ditanam

koordinat_geotag

progress

bukti_penanaman

catatan

status

7. BIBIT_DITANAM [Akan Di Fetching Oleh Modul Evaluasi Penanaman Bibit]

id_bibit_ditanam (PK)

id_program_donasi (FK)

id_program_apbd (FK)

id_program_csr (FK)

id_bibit (FK)

id_hasil_pelaksanaan (FK)

jumlah_bibit_ditanam

bukti_penanaman

8. PENUGASAN_MONITORING

id_penugasan_monitoring (PK)

id_penugasan (FK)

id_hasil_pelaksanaan (FK)

periode_rentang

tgl_monitoring_pertama

deadline_pengiriman_hasil

kunjungan

prioritas

catatan_penugasan

status

9. HASIL_MONITORING

id_hasil_monitoring (PK)

id_penugasan_monitoring (FK)

tindak_lanjut (FK)

jumlah_tanaman_hidup

jumlah_tanaman_mati

jumlah_tanaman_belum_tumbuh

rata_rata_tinggi

tanggal_selesai

status_monitoring

10. MONITORING_TANAMAN

id_monitoring_tanaman (PK)

id_penugasan_monitoring (FK)

tanggal_monitoring

jenis_tanaman

tinggi_tanaman

kondisi_tanaman

foto_sebelum

foto_sesudah

koordinat_geotag

catatan_monitoring

status_tanaman

11. LAPORAN

id_laporan (PK)

id_hasil_pelaksanaan (FK)

id_hasil_monitoring (FK)

id_program (FK)

tanggal_laporan

status

jenis_program

ringkasan_pelaksanaan

analisis_pelaksanaan

solusi_pelaksanaan

kesimpulan

file_path

catatan

12. TINDAK_LANJUT

id_tindak_lanjut (PK)

id_evaluasi (FK)

id_evaluasi_petak_ukur (FK)

jenis_tindak_lanjut

prioritas

target_penyelesaian

periode_monitoring_ulang

arahan_instruksi

(Catatan: atribut periode_monitoring_ulang ditulis dua kali pada ERD asli)

catatan_tambahan

list_titik_perbaikan

lampiran

13. RENCANA_REHABILITASI

id (PK)

id_hasil_validasi (FK)

id_kth (FK)

id_rekomendasi_intervensi (FK)

jumlah_petak_ukur

luas_satu_pu

panjang_pu

lebar_pu

status_kelayakan

Struktur final harus mengikuti ERD yang digunakan pada skripsi dan
disesuaikan dengan implementasi backend.

------------------------------------------------------------------------

``` http
GET /api/pelaksanaan/{id}/rekapitulasi
GET /api/monitoring/{id}/rekapitulasi
```

Backend harus mengecek status kegiatan sebelum memberikan file
rekapitulasi.

------------------------------------------------------------------------

## 22. Contoh Request Penugasan Monitoring P1

``` json
{
  "program_id": "PRG001",
  "penyuluh_id": "PEN001",
  "periode": "P1",
  "tanggal_mulai": "2026-08-01",
  "batas_waktu": "2026-08-15",
  "arahan": "Melakukan monitoring kondisi tanaman pada petak ukur."
}
```

Jika penugasan P1 sudah tersedia:

``` http
409 Conflict
```

``` json
{
  "success": false,
  "message": "Penugasan monitoring P1 untuk program ini sudah tersedia."
}
```

------------------------------------------------------------------------

## 23. Contoh Logic Rekapitulasi

``` text
Request Unduh Rekapitulasi
        ↓
Cek Authentication
        ↓
Cek Authorization
        ↓
Cari Kegiatan
        ↓
Cek Status
        ↓
Apakah Selesai?
   ┌────┴────┐
  Tidak     Ya
   ↓         ↓
  422     Generate
          Rekapitulasi
              ↓
          Download File
```

Jika belum selesai:

``` json
{
  "success": false,
  "message": "Rekapitulasi belum dapat diunduh karena kegiatan belum selesai."
}
```

Jika selesai:

``` json
{
  "success": true,
  "message": "Rekapitulasi berhasil dibuat.",
  "data": {
    "file_name": "rekapitulasi-kegiatan.pdf"
  }
}
```

------------------------------------------------------------------------

## 24. Integrasi Status CSR

Modul Investasi dapat mengirimkan informasi perubahan pendanaan:

``` json
{
  "program_id": "PRG001",
  "funding_type": "CSR",
  "funding_status": "Dihentikan"
}
```

Backend Modul Pelaksanaan dan Monitoring kemudian memperbarui status
monitoring program terkait:

``` text
monitoring.status = "Dihentikan"
```

Perubahan harus dapat dilacak berdasarkan program dan event penghentian
pendanaan.

## 24.1 Integrasi Status Program Donasi

Terdapat komunikasi dua arah (*two-way trigger*) terkait sinkronisasi status antara Modul Donasi dan Modul Pelaksanaan P0:

1. **Trigger Masuk:** Upload BAST di Modul Donasi → Status donasi berubah menjadi `disalurkan` → Program masuk sebagai data penugasan P0 di Modul Pelaksanaan.
2. **Trigger Keluar:** Pelaksanaan P0 berstatus `Selesai` → Modul Pelaksanaan mengirim *event* agar sistem otomatis memperbarui status donasi terkait menjadi `terealisasi`. Perubahan ini krusial agar donatur dapat memantau bukti tanam.
------------------------------------------------------------------------

## 25. File dan Geotagging

Dokumentasi kegiatan dapat berupa:

-   foto;
-   koordinat latitude;
-   koordinat longitude;
-   waktu dokumentasi;
-   relasi foto terhadap kegiatan/PU/monitoring.

GIS digunakan untuk mendukung:

-   visualisasi lokasi;
-   polygon PU;
-   dokumentasi geotagging.

GIS tidak digunakan untuk melakukan analisis lahan kritis atau
perhitungan CPI dalam modul ini.

------------------------------------------------------------------------

## 26. Authorization dan Validasi Backend

Backend harus melakukan validasi server-side.

### Penyuluh

-   hanya dapat menginput kegiatan yang menjadi tanggung jawabnya;
-   hanya dapat menginput monitoring yang tersedia untuk programnya.

### KTH

-   tidak dapat menginput P0;
-   tidak dapat menginput monitoring;
-   hanya melihat informasi dan status program.

### Staff PDAS

-   dapat melakukan penugasan;
-   hanya membuat penugasan monitoring awal P1;
-   dapat melihat dan mengunduh rekapitulasi.

### Kabid PDAS

-   dapat melihat informasi kegiatan;
-   dapat melihat rekapitulasi;
-   dapat mengunduh rekapitulasi.

------------------------------------------------------------------------

## 27. Error Handling

  HTTP Status   Kondisi
  ------------- -----------------------------------------------
  `400`         Request tidak valid
  `401`         User belum login
  `403`         Tidak memiliki hak akses
  `404`         Data tidak ditemukan
  `409`         Konflik data, misalnya penugasan P1 sudah ada
  `422`         Data belum memenuhi validasi bisnis
  `500`         Kesalahan server

------------------------------------------------------------------------

## 28. Acceptance Criteria

### Pelaksanaan P0

-   [ ] Program hanya dapat masuk P0 setelah lokasi tervalidasi dan
    pendanaan tersedia.
-   [ ] Program dari Modul Donasi dapat diterima setelah pendanaan
    tersedia.
-   [ ] Program APBD/CSR dari Modul Investasi dapat diterima setelah
    pendanaan tersedia.
-   [ ] Staff dapat melakukan penugasan P0.
-   [ ] Hanya Penyuluh yang dapat menginput hasil P0.
-   [ ] KTH tidak dapat menginput hasil P0.
-   [ ] KTH hanya melihat informasi dan status program.
-   [ ] Polygon dibuat berdasarkan PU.
-   [ ] Jumlah polygon sama dengan jumlah PU.
-   [ ] Satu PU memiliki satu polygon.
-   [ ] Polygon tanpa PU yang sesuai ditolak.
-   [ ] P0 dapat berstatus `Selesai` setelah data wajib lengkap.
-   [ ] Program dari Modul Donasi hanya tampil di penugasan Staff PDAS jika dokumen BAST sudah diunggah (status `disalurkan`).
-   [ ] Setelah data P0 program donasi berstatus `Selesai`, sistem otomatis memperbarui status bibit di Modul Donasi menjadi `terealisasi`.
-   [ ] Sistem otomatis mendisabel (disable) / memblokir pembuatan penugasan monitoring P1 jika program bersumber dari Modul Donasi.

### Monitoring

-   [ ] Staff dapat membuat penugasan monitoring P1.
-   [ ] Penugasan P1 hanya dilakukan satu kali.
-   [ ] Staff tidak melakukan penugasan P2/P3/P4 melalui modul ini.
-   [ ] Penyuluh dapat menginput P1.
-   [ ] Penyuluh dapat menginput P2.
-   [ ] Penyuluh dapat menginput P3.
-   [ ] Penyuluh dapat menginput P4.
-   [ ] KTH tidak dapat menginput monitoring.
-   [ ] Hasil monitoring dapat dikirim ke Modul Evaluasi.
-   [ ] Kelanjutan periode mengikuti hasil Modul Evaluasi.

### CSR

-   [ ] Program CSR memiliki informasi sumber pendanaan.
-   [ ] Modul Investasi dapat mengirim status penghentian pendanaan.
-   [ ] Penghentian pendanaan CSR dapat mengubah status monitoring
    menjadi `Dihentikan`.
-   [ ] Penyuluh tidak dapat memilih status `Dihentikan`.
-   [ ] Staff tidak mengubah status `Dihentikan` secara manual.

### Rekapitulasi

-   [ ] Staff PDAS dapat melihat rekapitulasi.
-   [ ] Staff PDAS dapat mengunduh rekapitulasi.
-   [ ] Kabid dapat melihat rekapitulasi.
-   [ ] Kabid dapat mengunduh rekapitulasi.
-   [ ] Rekapitulasi tidak dapat diunduh sebelum kegiatan selesai.
-   [ ] Rekapitulasi dapat diunduh setelah kegiatan selesai.
-   [ ] Tidak ada workflow pelaporan terpisah.
-   [ ] File hasil unduhan rekapitulasi menjadi bentuk laporan kegiatan.

------------------------------------------------------------------------

## 29. Definition of Done

Backend Modul Pelaksanaan dan Monitoring dianggap selesai apabila:

1.  program dapat diterima setelah lokasi tervalidasi dan pendanaan
    tersedia;
2.  sumber pendanaan Donasi/Investasi dapat dikenali;
3.  pelaksanaan P0 dapat dikelola;
4.  hanya Penyuluh yang dapat menginput hasil P0;
5.  KTH hanya dapat melihat informasi dan status;
6.  polygon dapat dibuat sesuai PU;
7.  jumlah polygon divalidasi backend;
8.  setiap PU terhubung dengan satu polygon;
9.  P0 dapat diselesaikan;
10. Staff dapat membuat penugasan monitoring P1;
11. penugasan monitoring hanya dilakukan satu kali pada P1;
12. Penyuluh dapat menginput hasil monitoring P1 sampai P4;
13. hasil monitoring dapat diteruskan ke Modul Evaluasi;
14. P2--P4 mengikuti hasil evaluasi;
15. penghentian pendanaan CSR dari Modul Investasi dapat mengubah status
    monitoring menjadi `Dihentikan`;
16. Staff PDAS dapat melihat rekapitulasi;
17. Staff PDAS dapat mengunduh rekapitulasi;
18. Kabid dapat melihat dan mengunduh rekapitulasi;
19. rekapitulasi hanya dapat diunduh setelah kegiatan selesai;
20. tidak terdapat workflow pelaporan terpisah.

------------------------------------------------------------------------

# 30. Ringkasan Requirement Final

### Polygon

**Jumlah polygon = jumlah PU yang telah ditentukan pada modul
sebelumnya.**

### Pelaksanaan

**Hanya Penyuluh yang menginput hasil pelaksanaan P0.**

### KTH

**KTH hanya melihat informasi dan status program serta melakukan
kegiatan lapangan di bawah pantauan Penyuluh.**

### Monitoring

**Staff hanya melakukan penugasan monitoring satu kali, yaitu P1.
Penyuluh menginput monitoring P1, P2, P3, dan P4.**

### Evaluasi

**Modul Evaluasi menentukan kelanjutan periode dan tindak lanjut.**

### CSR

**Jika hasil keberhasilan \<75% dan pihak CSR menghentikan pendanaan
melalui Modul Investasi, status monitoring menjadi `Dihentikan`.**

### Rekapitulasi

**Tidak ada fitur pelaporan terpisah. Rekapitulasi yang telah selesai
dapat diunduh dan file tersebut menjadi bentuk laporan kegiatan.**

**Catatan Untuk Backend Developer**
Aturan Data Relasi
Untuk endpoint detail, embedded relation wajib diberikan untuk foreign key penting.

Untuk endpoint list, embedded relation dapat berupa summary object.

Contoh list:

{
  "id_penyuluh": 12,
  "penyuluh": {
    "nama": "Budi Santoso"
  }
}

Detail:

{
  "id_penyuluh": 12,
  "penyuluh": {
    "id_penyuluh": 12,
    "nip": "198xxxxxxxxx",
    "nama": "Budi Santoso",
    "no_hp": "081234567890",
    "email": "budi@example.com",
    "wilayah": "Kabupaten Bandung",
    "status": "AKTIF"
  }
}

Jadi response tidak perlu selalu mengembalikan seluruh database, tetapi harus mengembalikan informasi relasi yang dibutuhkan oleh halaman tersebut.