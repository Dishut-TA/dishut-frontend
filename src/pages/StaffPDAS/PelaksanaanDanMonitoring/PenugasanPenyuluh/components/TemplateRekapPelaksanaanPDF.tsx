import React, { forwardRef } from 'react';

interface TemplateRekapPelaksanaanPDFProps {
  data?: any;
  tanaman?: any[];
  dokumentasi?: any[];
}

export const TemplateRekapPelaksanaanPDF = forwardRef<HTMLDivElement, TemplateRekapPelaksanaanPDFProps>(({ data, tanaman = [], dokumentasi = [] }, ref) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="hidden">
      <div ref={ref} className="p-10 font-sans bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* KOP Surat */}
        <div className="flex flex-col items-center border-b-4 border-double border-gray-900 pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase">Dinas Kehutanan Provinsi Jawa Barat</h1>
          <h2 className="text-lg font-semibold">Rekapitulasi Pelaksanaan Penanaman</h2>
          <p className="text-sm mt-1">Tanggal Cetak: {currentDate}</p>
        </div>

        {/* Informasi Program */}
        <div className="mb-6">
          <h3 className="text-sm font-bold bg-gray-100 p-2 mb-3 border border-gray-300">A. Informasi Program</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="w-1/3 py-1 font-semibold">Nama Program</td><td className="py-1">: {data?.program || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Penyuluh</td><td className="py-1">: {data?.penyuluh || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Lokasi</td><td className="py-1">: {data?.lokasi || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Wilayah</td><td className="py-1">: {data?.wilayah || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Target Bibit</td><td className="py-1">: {data?.target || 0}</td></tr>
              <tr><td className="py-1 font-semibold">Realisasi Tanam</td><td className="py-1">: {data?.realisasi || 0}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Data Tanaman */}
        <div className="mb-6">
          <h3 className="text-sm font-bold bg-gray-100 p-2 mb-3 border border-gray-300">B. Data Tanaman</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 p-2 w-12 text-center">No</th>
                <th className="border border-gray-300 p-2">Petak Ukur</th>
                <th className="border border-gray-300 p-2">Jenis Tanaman</th>
                <th className="border border-gray-300 p-2 text-center">Tinggi (cm)</th>
                <th className="border border-gray-300 p-2 text-center">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              {tanaman.length > 0 ? tanaman.map((t, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-2 text-center">{i + 1}</td>
                  <td className="border border-gray-300 p-2">{t.petak}</td>
                  <td className="border border-gray-300 p-2">{t.jenis}</td>
                  <td className="border border-gray-300 p-2 text-center">{t.tinggi || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{t.kondisi}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="border border-gray-300 p-4 text-center">Tidak ada data tanaman</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-12 flex justify-end">
          <div className="text-center">
            <p className="text-sm mb-16">Disetujui Oleh,</p>
            <p className="text-sm font-bold border-b border-gray-400 inline-block px-4">Staff PDAS / Verifikator</p>
          </div>
        </div>
      </div>
    </div>
  );
});
