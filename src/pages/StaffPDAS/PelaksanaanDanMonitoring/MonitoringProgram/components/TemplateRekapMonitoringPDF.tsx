import { forwardRef } from 'react';

interface TemplateRekapMonitoringPDFProps {
  programData?: any;
}

export const TemplateRekapMonitoringPDF = forwardRef<HTMLDivElement, TemplateRekapMonitoringPDFProps>(({ programData }, ref) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const STORAGE_URL = (import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage');

  const dokumentasiList = programData?.dokumentasiList || [];
  const dokumentasiToPrint = dokumentasiList.slice(0, 4);

  const persentaseHidupNum = Number(programData?.stats?.persentaseHidup || 0);
  const statusBerhasil = persentaseHidupNum >= 80;

  const evaluasiTitle = statusBerhasil ? "Program dinyatakan berhasil." : "Program perlu perhatian khusus.";
  const evaluasiDesc = statusBerhasil
    ? `Persentase hidup tanaman mangrove telah mencapai target (${persentaseHidupNum}%) dan memenuhi kriteria keberhasilan rehabilitasi.`
    : `Persentase hidup tanaman mangrove hanya mencapai ${persentaseHidupNum}%, di bawah target yang diharapkan (80%). Dibutuhkan tindak lanjut penanaman kembali.`;

  return (
    <div className="hidden">
      <div ref={ref} className="p-10 font-sans bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* KOP Surat */}
        <div className="flex flex-col items-center border-b-4 border-double border-gray-900 pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase">Dinas Kehutanan Provinsi Jawa Barat</h1>
          <h2 className="text-lg font-semibold">Rekapitulasi Akhir Monitoring Program Rehabilitasi</h2>
          <p className="text-sm mt-1">Tanggal Cetak: {currentDate}</p>
        </div>

        {/* Informasi Program */}
        <div className="mb-6">
          <h3 className="text-sm font-bold bg-gray-100 p-2 mb-3 border border-gray-300">A. Informasi Program</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="w-1/3 py-1 font-semibold">ID Program</td><td className="py-1">: {programData?.sourceId || programData?.id || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Nama Program</td><td className="py-1">: {programData?.programName || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Penyuluh</td><td className="py-1">: {programData?.penyuluh || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">KTH Pelaksana</td><td className="py-1">: {programData?.kth || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Lokasi</td><td className="py-1">: {programData?.lokasi || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Luas Area</td><td className="py-1">: {programData?.luas || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Periode Monitoring</td><td className="py-1">: {programData?.periode_monitoring || '-'}</td></tr>
              <tr><td className="py-1 font-semibold">Tanggal Akhir</td><td className="py-1">: {programData?.batas_waktu ? new Date(programData.batas_waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Hasil Monitoring */}
        <div className="mb-6">
          <h3 className="text-sm font-bold bg-gray-100 p-2 mb-3 border border-gray-300">B. Hasil Akhir Monitoring (P4)</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2">Target Tanam</th>
                <th className="border border-gray-300 p-2">Tanaman Hidup</th>
                <th className="border border-gray-300 p-2">Tanaman Mati</th>
                <th className="border border-gray-300 p-2">Persentase Hidup</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 text-center font-semibold">{programData?.stats?.targetTanam || 0}</td>
                <td className="border border-gray-300 p-2 text-center text-green-700 font-bold">{programData?.stats?.tanamanHidup || 0}</td>
                <td className="border border-gray-300 p-2 text-center text-red-700 font-bold">{programData?.stats?.tanamanMati || 0}</td>
                <td className="border border-gray-300 p-2 text-center font-bold">{programData?.stats?.persentaseHidup || 0}%</td>
              </tr>
            </tbody>
          </table>

          <div className="border border-gray-300 p-3 bg-gray-50 text-sm mt-4">
            <p className="font-bold mb-1">Evaluasi Akhir:</p>
            <p className="font-semibold text-gray-800">{evaluasiTitle}</p>
            <p className="text-gray-700 mt-1">{evaluasiDesc}</p>
          </div>
        </div>

        {/* Dokumentasi */}
        <div className="mb-6">
          <h3 className="text-sm font-bold bg-gray-100 p-2 mb-3 border border-gray-300">C. Dokumentasi Akhir Kegiatan</h3>
          {dokumentasiToPrint.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {dokumentasiToPrint.map((dok: any, idx: number) => {
                const path = dok.file_path || dok.url || dok.foto_url || dok.file_url || dok.path || dok.image_url || dok.gambar_url;
                const src = path?.startsWith('http') ? path : `${STORAGE_URL}/${path}`;
                return (
                  <div key={idx} className="border border-gray-300 p-2 text-center">
                    <img src={src} alt={`Dokumentasi ${idx + 1}`} className="w-full h-40 object-cover border border-gray-200" />
                    <p className="text-xs mt-2 text-gray-600">{dok.keterangan || `Foto Dokumentasi ${idx + 1}`}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-gray-300 p-4 text-center text-sm text-gray-500">
              Tidak ada dokumentasi kegiatan yang dilampirkan.
            </div>
          )}
        </div>

        {/* Tanda Tangan */}
        <div className="mt-12 flex justify-end">
          <div className="text-center">
            <p className="text-sm mb-16">Disetujui Oleh,</p>
            <p className="text-sm font-bold border-b border-gray-400 inline-block px-4">Tim Evaluasi BPDAS Citarum</p>
          </div>
        </div>
      </div>
    </div>
  );
});
