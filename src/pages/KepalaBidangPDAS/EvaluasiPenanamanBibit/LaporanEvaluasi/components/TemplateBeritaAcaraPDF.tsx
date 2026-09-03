import { forwardRef } from 'react';

export const TemplateBeritaAcaraPDF = forwardRef<HTMLDivElement, any>((_, ref) => {
  return (
    <div className="hidden">
      <style type="text/css" media="print">
        {`
          @page {
            size: A4 portrait;
            margin: 20mm; 
          }
        `}
      </style>

      <div 
        ref={ref} 
        className="w-[210mm] bg-white text-black font-serif text-[11pt] leading-snug mx-auto print:block"
      >
        
        {/* KOP SURAT */}
        <div className="text-center border-b-[3px] border-black pb-4 mb-6">
          <h2 className="text-[11pt] font-bold">KEMENTERIAN KEHUTANAN</h2>
          <h1 className="text-[11pt]">DIREKTORAT JENDERAL PENGELOLAAN DAS DAN REHABILITASI HUTAN</h1>
          <h2 className="text-[11pt] font-bold">BALAI PENGELOLAAN DAERAH ALIRAN SUNGAI CIMANUK CITANDUY</h2>
          <p className="text-[10pt]">Alamat : Jalan Soekarno-Hatta No.751, Km. 11,2 Bandung 40292</p>
          <p className="text-[10pt]">Telepon : (022) 7310429, Faxmile : 7313606, Kotak Pos 6701/40401</p>
        </div>

        {/* JUDUL */}
        <div className="text-center mb-6">
          <h3 className="text-[10pt] font-bold mb-1">BERITA ACARA PENILAIAN KEBERHASILAN PENANAMAN</h3>
          <h3 className="text-[10pt] font-bold">DALAM RANGKA REHABILITASI LAHAN KOMPENSASI</h3>
          <h3 className="text-[10pt] font-bold mb-2">OLEH PT. JAWA SATU POWER</h3>
          <p>Nomor : BA. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/BPDAS.CKY/PEVDAS/DAS.0/03/2026</p>
        </div>

        <p className="text-justify mb-4">
          Pada hari ini Jum’at Tanggal Tiga Belas Bulan Maret Tahun Dua Ribu Dua Puluh Enam yang bertanda tangan dibawah ini:
        </p>

        {/* TIM PENILAI */}
        <table className="w-full mb-4 align-top text-[10pt] print:break-inside-avoid">
          <tbody>
            <tr>
              <td className="w-[4%] align-top">1.</td>
              <td className="w-[18%] align-top">Nama</td>
              <td className="w-[2%] align-top">:</td>
              <td className="w-[76%] align-top font-bold">Umar Nasir, S.Sos., M.Sc</td>
            </tr>
            <tr><td></td><td>NIP</td><td>:</td><td>19770509 200212 1 008</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Kepala BPDAS Cimanuk Citanduy selaku Ketua Tim</td></tr>

            <tr>
              <td className="align-top">2.</td>
              <td className="align-top">Nama</td>
              <td className="align-top">:</td>
              <td className="font-bold">Lasmawati, S.E, M.M</td>
            </tr>
            <tr><td></td><td>NIP</td><td>:</td><td>19760503 200801 2 006</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Kepala Bidang Pengelolaan DAS Dishut Prov. Jabar, selaku Sekretaris Tim</td></tr>

            <tr><td colSpan={4} className="font-bold py-2">Anggota Tim :</td></tr>

            <tr>
              <td className="align-top">3.</td>
              <td className="align-top">Nama</td>
              <td className="align-top">:</td>
              <td className="font-bold">Srie Resmita Dewi, SP., MP</td>
            </tr>
            <tr><td></td><td>NIP</td><td>:</td><td>19820913 200801 2 023</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Kasi Perencanaan dan Evaluasi DAS BPDAS Cimanuk Citanduy</td></tr>

            <tr><td className="align-top">4.</td><td className="align-top">Nama</td><td className="align-top">:</td><td className="font-bold">Muhammad Caskadi</td></tr>
            <tr><td></td><td>NIP</td><td>:</td><td>19780925 199803 1 002</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Staf BPDAS Cimanuk Citanduy</td></tr>

            <tr><td className="align-top">5.</td><td className="align-top">Nama</td><td className="align-top">:</td><td className="font-bold">Andi Mansur, S.P</td></tr>
            <tr><td></td><td>NIP</td><td>:</td><td>19740810 199603 1 003</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Staf Dinas Kehutanan Prov. Jawa Barat</td></tr>

            <tr><td className="align-top">6.</td><td className="align-top">Nama</td><td className="align-top">:</td><td className="font-bold">Dedi Sumirat</td></tr>
            <tr><td></td><td>NIP</td><td>:</td><td>NPK. 174106007</td></tr>
            <tr><td></td><td className="align-top pb-2">Jabatan</td><td className="align-top pb-2">:</td><td className="pb-2">Kasi Utama Pembibitan & Tanaman Perum Perhutani, Perum Perhutani Kantor Divre Jawa Barat & Banten</td></tr>

            <tr><td className="align-top">7.</td><td className="align-top">Nama</td><td className="align-top">:</td><td className="font-bold">Yayan Yuhana</td></tr>
            <tr><td></td><td>NIP</td><td>:</td><td>NPK. 171108024</td></tr>
            <tr><td></td><td className="align-top pb-4">Jabatan</td><td className="align-top pb-4">:</td><td className="pb-4">KSS Perencanaan dan monev Pembibitan dan Tanaman, Perum Perhutani KPH Garut</td></tr>
          </tbody>
        </table>

        <p className="mb-2">Yang didampingi oleh petugas a.n PT. Jawa Satu Power</p>
        <table className="w-full mb-6 align-top print:break-inside-avoid">
          <tbody>
            <tr><td className="w-[4%] align-top">1.</td><td className="w-[18%] align-top">Nama</td><td className="w-[2%] align-top">:</td><td className="w-[76%] align-top">Bayu Bargono</td></tr>
            <tr><td></td><td className="pb-2">Jabatan</td><td className="pb-2">:</td><td className="pb-2">Risk & Compliance Manager</td></tr>
            <tr><td className="align-top">2.</td><td className="align-top">Nama</td><td className="align-top">:</td><td>Like Ernawati</td></tr>
            <tr><td></td><td>Jabatan</td><td>:</td><td>Environment Suervisor</td></tr>
          </tbody>
        </table>

        <p className="font-bold mb-2">Berdasarkan :</p>
        <ol className="list-decimal list-outside ml-5 mb-8 text-justify">
          <li className="pl-2 mb-1">Surat Keputusan Direktur Jenderal Pengelolaan Daerah Aliran Sungai dan Rehabilitasi Hutan Nomor 18 Tahun 2026 tanggal 11 Maret 2026 tentang tentang Tim Penilai Keberhasilan Pelaksanaan Penanaman dalam rangka rehabilitasi DAS PT Jawa Satu Power.</li>
          <li className="pl-2">Surat Tugas Direktur Konservasi Tanah dan Reklamasi Hutan Dirjen PDASRH Nomor: ST. 76/TKTRH/RRPKH/DAS.04.03/B/03/2026 tanggal 11 Maret 2026.</li>
        </ol>
        
        <p className="text-justify mb-6">
          Telah selesai melakukan tugas penilaian keberhasilan penanaman dalam rangka reboisasi pada lahan kompensasi PT. Jawa Satu Power Sebagai pemenuhan salah satu kewajiban pemegang IPPKH/Keputusan Menteri Kehutanan dan Lingkungan Hidup Nomor:5708/MENLHK-PKTL/REN/PLA.0/10/2020 Tanggal 19 Oktober 2020 seluas 29,78 Ha, dengan rekapitulasi penilaian luas efektif penanaman dan persen tumbuh penanaman sebagai berikut :
        </p>

        {/* TABEL 1 */}
        <p className="text-justify mb-2">a. Penilaian Luas efektif Penanaman Dalam Rangka Reboisasi Pada Lahan Kompensasi atas nama PT. Jawa Satu Power seluas 29,78 Ha di Lokasi Hitan Lindung Desa Sudalarang, Kecamatan Sukawening, Kabupaten Garut, DAS Cimanuk.</p>
        <table className="w-full border-collapse border border-black mb-8 text-center text-[10pt] print:break-inside-avoid">
          <thead>
            <tr>
              <th className="border border-black p-1 align-middle" rowSpan={2}>No</th>
              <th className="border border-black p-1 align-middle w-1/3" rowSpan={2}>LOKASI</th>
              <th className="border border-black p-1" colSpan={4}>PENANAMAN</th>
              <th className="border border-black p-1 align-middle" rowSpan={2}>KET</th>
            </tr>
            <tr>
              <th className="border border-black p-1 font-normal">Rencana<br/>(Ha)</th>
              <th className="border border-black p-1 font-normal">Realisasi<br/>(Ha)</th>
              <th className="border border-black p-1 font-normal">Hasil Penilaian<br/>Luas (Ha)</th>
              <th className="border border-black p-1 font-normal">% Dari<br/>Rencana</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 align-top">1</td>
              <td className="border border-black p-2 text-justify align-top">Hutan Gunung Lindung Desa Sudalarang, Kecamatan Sukawening, Kabupaten Garut, DAS Cimanuk</td>
              <td className="border border-black p-2 align-top">29,78</td>
              <td className="border border-black p-2 align-top">29,78</td>
              <td className="border border-black p-2 align-top">29,78</td>
              <td className="border border-black p-2 align-top">100</td>
              <td className="border border-black p-2 align-top"></td>
            </tr>
            <tr className="font-bold bg-gray-100">
              <td className="border border-black p-2 text-center" colSpan={2}>Total</td>
              <td className="border border-black p-2">29,78</td>
              <td className="border border-black p-2">29,78</td>
              <td className="border border-black p-2">29,78</td>
              <td className="border border-black p-2">100</td>
              <td className="border border-black p-2"></td>
            </tr>
          </tbody>
        </table>

        {/* TABEL 2 */}
        <p className="text-justify mb-2">b. Rekapitulasi Kondisi Tanaman, Penilaian Keberhasilan Penanaman dalam rangka Reboisasi pada Lahan Kompensasi atas nama PT. Jawa Satu Power seluas 29,78 Ha di Lokasi Hutan Lindung Desa Sudalarang, Kecamatan Sukawening, Kabupaten Garut, DAS Cimanuk.</p>
        <table className="w-full border-collapse border border-black mb-8 text-center text-[10pt] print:break-inside-avoid">
          <thead>
            <tr>
              <th className="border border-black p-1 align-middle" rowSpan={3}>No.</th>
              <th className="border border-black p-1 align-middle" rowSpan={3}>Petak Ukur</th>
              <th className="border border-black p-1" colSpan={3}>Jumlah Tanaman yang Hidup (btg)</th>
              <th className="border border-black p-1 align-middle" rowSpan={2}>% Tanaman<br/>hidup</th>
              <th className="border border-black p-1 align-middle" rowSpan={3}>Keterangan</th>
            </tr>
            <tr>
              <th className="border border-black p-1 font-normal" rowSpan={2}>Realisasi</th>
              <th className="border border-black p-1 font-normal" colSpan={2}>Tanaman Hidup</th>
            </tr>
            <tr>
              <th className="border border-black p-1 font-normal">Jumlah</th>
              <th className="border border-black p-1 font-normal">Rerata tinggi</th>
              <th className="border border-black p-1 font-normal">%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 font-bold italic text-[9pt]">
              <td className="border border-black">1</td><td className="border border-black">2</td><td className="border border-black">3</td><td className="border border-black">4</td><td className="border border-black">5</td><td className="border border-black">9</td><td className="border border-black">10</td>
            </tr>
            {[
              { pu: "PU1", real: 110, jml: 69, tinggi: "98,11", persen: "62,73", ket: "" },
              { pu: "PU2", real: 110, jml: 61, tinggi: "88,68", persen: "55,45", ket: "" },
              { pu: "PU3", real: 110, jml: 113, tinggi: "101,94", persen: "102,73", ket: "Memenuhi" },
              { pu: "PU4", real: 63, jml: 42, tinggi: "111,55", persen: "66,67", ket: "" },
              { pu: "PU5", real: 63, jml: 59, tinggi: "173,63", persen: "93,65", ket: "Memenuhi" },
              { pu: "PU6", real: 63, jml: 62, tinggi: "105,23", persen: "98,41", ket: "Memenuhi" },
              { pu: "PU7", real: 63, jml: 68, tinggi: "114,56", persen: "107,94", ket: "memenuhi" },
              { pu: "PU8", real: 110, jml: 108, tinggi: "103,42", persen: "98,18", ket: "Memenuhi" },
              { pu: "PU9", real: 63, jml: 67, tinggi: "139,61", persen: "106,35", ket: "Memenuhi" },
              { pu: "PU10", real: 64, jml: 49, tinggi: "90,58", persen: "76,56", ket: "Memenuhi" },
              { pu: "PU11", real: 63, jml: 57, tinggi: "96,98", persen: "90,48", ket: "memenuhi" },
              { pu: "PU12", real: 63, jml: 49, tinggi: "176,61", persen: "77,78", ket: "Memenuhi" },
              { pu: "PU13", real: 63, jml: 61, tinggi: "119,75", persen: "96,83", ket: "Memenuhi" },
              { pu: "PU14", real: 63, jml: 70, tinggi: "146,10", persen: "111,11", ket: "memenuhi" },
              { pu: "PU15", real: 110, jml: 109, tinggi: "166,00", persen: "99,09", ket: "Memenuhi" },
              { pu: "PU16", real: 110, jml: 74, tinggi: "146,47", persen: "67,27", ket: "" },
              { pu: "PU17", real: 63, jml: 47, tinggi: "115,10", persen: "74,60", ket: "memenuhi" }
            ].map((row, idx) => (
              <tr key={idx}>
                <td className="border border-black">{idx + 1}</td>
                <td className="border border-black text-left pl-2">{row.pu}</td>
                <td className="border border-black">{row.real}</td>
                <td className="border border-black">{row.jml}</td>
                <td className="border border-black">{row.tinggi}</td>
                <td className="border border-black">{row.persen}</td>
                <td className="border border-black text-left pl-2">{row.ket}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td className="border border-black text-right pr-2" colSpan={2}>Jumlah:</td>
              <td className="border border-black">1354</td>
              <td className="border border-black">1165</td>
              <td className="border border-black">123,20</td>
              <td className="border border-black">87,40</td>
              <td className="border border-black"></td>
            </tr>
          </tbody>
        </table>

        {/* KESIMPULAN */}
        <p className="mb-4">berdasarkan penilaian luas efektif penanaman dan persen tumbuh tanaman dimaksud diperoleh hasil-hasil berikut:</p>
        <ol className="list-decimal list-outside ml-5 mb-8 text-justify">
          <li className="pl-2 mb-2">Lokasi penanaman berada pada Kawasan hutan lindung, Desa Sudalarang, Kecamatan Sukawening, Kabupaten Garut, DAS Cimanuk.</li>
          <li className="pl-2 mb-2">Luas kegiatan penanaman 29,78 Ha dengan jenis tanaman yang dijumpai adalah pinus, akasia mangium, bungur, alpukat, mangga, dan alpukat.</li>
          <li className="pl-2 mb-2">Sesuai dengan hasil tinjauan penanaman a.n PT. Jawa Satu Power di Kawasan hutan lindung Desa Sudalarang, Kecamatan Sukawening, Kabupaten Garut, DAS Cimanuk seluas : 29,78 Ha mempunyai prosentase tumbuh tanaman sebesar 87,40 % dengan rerata ketinggian tanaman 123,20 cm.</li>
          <li className="pl-2 mb-2">Berdasarkan ketentuan pasal 42 ayat (2) Peraturan Menteri Lingkungan Hidup dan Kehutanan Nomor P.105/MENLHK/SETJEN/KUM.1/2/2018 jo P.2/MENLHK/SETJEN/KUM.1/1/2020 tentang Tata Cara Pelaksanaan, Kegiatan Rehabilitasi Hutan dan Lahan dan Pasal 33 Peraturan Menteri Lingkungan Hidup dan Kehutanan No. P.59/Menlhk/Setjen/Kum.1/10/2019 tentang Penanaman dalam rangka Rehabilitasi DAS, menyatakan bahwa Keberhasilan tumbuh tanaman paling sedikit 75 % dari tanaman awal P0, setelah pemeliharaan tanaman kedua (P2).</li>
          <li className="pl-2 mb-2">Berdasarkan prosentasi tumbuh tanaman sebagaimana butir 3 (tiga) dan mengacu pada ketentuan tersebut pada butir 4 (empat), maka pelaksanaan penanaman reboisasi pada lahan kompensasi oleh PT. Jawa Satu Power Energy seluas 29,78 Ha dengan prosentase tumbuh ({'>'}75 %) dinyatakan <strong>BERHASIL</strong>.</li>
          <li className="pl-2 mb-2">Laporan hasil pelaksanaan penilaian keberhasilan penanaman dalam rangka rehabilitasi DAS sebagaimana terlampir.</li>
          <li className="pl-2 mb-2">Memenuhi ketentuan Peraturan Menteri Lingkungan Hidup dan Kehutanan No.P.59/Menlhk/Setjen/Kum.I/10/2019 tentang Pedoman Penanaman dalam rangka Reboisasi pada Lahan Kompensasi PT. Jawa Satu Power maka hasil tanaman seluas 29,78 Ha dapat diserahkan kepada Dirjen PDASRH untuk selanjutnya diserahkan kepada pemangku Kawasan untuk pengelolaan lebih lanjut.</li>
        </ol>

        <p className="text-justify mb-16">
          Demikian Berita Acara Penilaian Keberhasilan Penanaman Rehabilitasi DAS ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        {/* TANDA TANGAN */}
        <div className="w-full text-[11pt] print:break-inside-avoid">
          
          {/* Bagian TIM PENILAI */}
          <div className="flex justify-end w-full">
            <div className="w-[50%]">
              <p className="text-center mb-1">Bandung, 13 Maret 2026</p>
              <p className="text-center mb-8">TIM PENILAI</p>
              
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="align-top w-[5%]">1.</td>
                    <td className="align-top w-[70%] pb-6">Umar Nasir, S.Sos., M.Sc<br/><span className="text-[10pt]">Kepala BPDASHL Cimanuk Citanduy<br/>selaku Ketua Tim</span></td>
                    <td className="align-bottom pb-6 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">2.</td>
                    <td className="align-top pb-6">Lasmawati, S.E, M.M<br/><span className="text-[10pt]">Kepala Bidang Pengelolaan DAS Dishut<br/>Prov. Jabar, selaku Sekretaris Tim</span></td>
                    <td className="align-bottom pb-6 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">3.</td>
                    <td className="align-top pb-4">Srie Resmita Dewi, SP., MP<br/><span className="text-[10pt]">Anggota</span></td>
                    <td className="align-bottom pb-4 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">4.</td>
                    <td className="align-top pb-4">Muhammad Caskadi<br/><span className="text-[10pt]">Anggota</span></td>
                    <td className="align-bottom pb-4 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">5.</td>
                    <td className="align-top pb-4">Andi Mansur, S.P<br/><span className="text-[10pt]">Anggota</span></td>
                    <td className="align-bottom pb-4 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">6.</td>
                    <td className="align-top pb-4">Dedi Sumirat<br/><span className="text-[10pt]">Anggota</span></td>
                    <td className="align-bottom pb-4 text-right">(........................)</td>
                  </tr>
                  <tr>
                    <td className="align-top">7.</td>
                    <td className="align-top pb-4">Yayan Yuhana<br/><span className="text-[10pt]">Anggota</span></td>
                    <td className="align-bottom pb-4 text-right">(........................)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bagian Pimpinan */}
          <div className="w-full text-center mt-12">
            <p className="mb-1">Mengetahui,</p>
            <p className="mb-1">Direktur / Pimpinan</p>
            <p className="mb-24">Pemegang IPPKH / Pemegang Keputusan Menteri</p>
            <p className="font-bold underline">Dwi Murray</p>
          </div>

        </div>

      </div>
    </div>
  );
});