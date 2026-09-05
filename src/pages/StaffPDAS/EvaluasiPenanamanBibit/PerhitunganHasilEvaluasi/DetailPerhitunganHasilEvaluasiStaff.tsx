import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineCheckBadge, HiOutlineDocumentText, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getPenugasanEvaluasiDetail, kalkulasiHasilEvaluasi } from '@/services/penugasanEvaluasi.service';
import DashboardHasilDanPeta from './components/DashboardHasilDanPeta';
import TableDataPetakUkur from './components/TableDataPetakUkur';
import SectionTindakLanjut from './components/SectionTindakLanjut';

const DetailPerhitunganHasilEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [dataDetail, setDataDetail] = useState<any>(null);
  const [dataPetakUkur, setDataPetakUkur] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showTindakLanjut, setShowTindakLanjut] = useState(false);

  const [hasilIntegrasi, setHasilIntegrasi] = useState({
    persenTumbuhGlobal: '0.00', 
    skorCPILingkungan: '0.00', 
    statusEvaluasiLahan: '-', 
    rekomendasiTindakLanjut: '', 
    isPerluTindakLanjut: false
  });

  const isDataFilled = location.state?.isDataFilled || dataPetakUkur.some(pu => pu.eval_at !== null);

  const fetchDetail = async () => {
    try {
      const res = await getPenugasanEvaluasiDetail(id!);
      const data = res.data;
      setDataDetail(data);
      
      const statusDB = data.status_penugasan || data.status;
      const sudahDihitung = ['Selesai Evaluasi', 'Menunggu Verifikasi Hasil', 'Selesai'].includes(statusDB);
      setHasCalculated(sudahDihitung);

      const pus = data.petak_ukurs || data.petakUkurs || [];
      
      let totalTumbuh = 0; 
      let totalRencana = 0;

      const mappedPU = pus.map((pu: any) => {
        const dt = pu.data_tanamans || pu.dataTanamans || [];
        const rencana = dt.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0);
        const tinggiAvg = dt.length > 0 ? (dt.reduce((acc: number, curr: any) => acc + (Number(curr.tinggi_tanaman) || 0), 0) / dt.length).toFixed(1) : "0";
        const jenisBibit = Array.from(new Set(dt.map((d: any) => d.nama_tanaman))).join(', ');
        
        const tumbuhFaktual = pu.eval_bibit_tumbuh !== null ? pu.eval_bibit_tumbuh : 0;
        
        totalTumbuh += tumbuhFaktual;
        totalRencana += rencana;

        return {
          id_pu: pu.id,
          periode: data.periode_evaluasi || '-',
          pu: pu.nama,
          jenisBibit: jenisBibit || 'Berbagai Jenis',
          rencana: rencana,
          monitoringTumbuh: rencana,
          tumbuh: tumbuhFaktual, 
          rencanaTinggi: tinggiAvg,
          tinggi: pu.eval_tinggi_rata !== null ? pu.eval_tinggi_rata : 0, 
          koordinat: pu.eval_koordinat || '',
          kondisiLahan: pu.eval_keterangan || 'Baik / Normal',
          eval_at: pu.eval_at
        };
      });
      
      setDataPetakUkur(mappedPU);

      const rataRataTumbuh = totalRencana > 0 ? ((totalTumbuh / totalRencana) * 100).toFixed(2) : "0.00";
      const isKritis = parseFloat(rataRataTumbuh) < 75;
      
      // Jika di database sudah tersimpan persentasenya (atau sudah dihitung sebelumnya)
      const persenGlobalDb = data.persentase_tumbuh !== null && data.persentase_tumbuh !== undefined 
        ? Number(data.persentase_tumbuh).toFixed(2) 
        : rataRataTumbuh;

      const isKritisDb = parseFloat(persenGlobalDb) < 75;

      if (sudahDihitung) {
        setHasilIntegrasi({
          persenTumbuhGlobal: persenGlobalDb, 
          skorCPILingkungan: data.skor_cpi ? Number(data.skor_cpi).toFixed(2) : '0.00',
          statusEvaluasiLahan: isKritisDb ? 'PENETAPAN KEGIATAN PENYULAMAN' : 'BERHASIL - MEMENUHI KRITERIA', 
          rekomendasiTindakLanjut: data.rekomendasi_cpi || '', 
          isPerluTindakLanjut: isKritisDb 
        });
      }

    } catch (e) {
      toast.error('Gagal memuat data evaluasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHitungDanMuatPeta = async () => {
    setIsCalculating(true);
    const loading = toast.loading('Mengkalkulasi & Memverifikasi Data (Sesuai Permen LHK)...');
    
    try {
      let totalTumbuh = 0; let totalRencana = 0;
      dataPetakUkur.forEach(p => { totalTumbuh += p.tumbuh; totalRencana += p.rencana; });
      const rataRataTumbuh = totalRencana > 0 ? ((totalTumbuh / totalRencana) * 100).toFixed(2) : "0.00";
      
      await kalkulasiHasilEvaluasi(id!, { persentase_tumbuh: rataRataTumbuh }); 
      
      const isKritis = parseFloat(rataRataTumbuh) < 75;
      let finalStatus = isKritis ? 'PENETAPAN KEGIATAN PENYULAMAN' : 'BERHASIL - MEMENUHI KRITERIA';
      let finalRekomendasi = isKritis 
        ? `Pertumbuhan (${rataRataTumbuh}%) di bawah standar. Wajib menetapkan kegiatan penyulaman segera.` 
        : `Kondisi tanaman mencapai ${rataRataTumbuh}%. Evaluasi berhasil.`;

      setHasilIntegrasi({
        persenTumbuhGlobal: rataRataTumbuh, 
        skorCPILingkungan: dataDetail?.skor_cpi ? Number(dataDetail.skor_cpi).toFixed(2) : '0.00',
        statusEvaluasiLahan: finalStatus, 
        rekomendasiTindakLanjut: finalRekomendasi, 
        isPerluTindakLanjut: isKritis 
      });

      setHasCalculated(true);
      toast.success('Kalkulasi Berhasil Disimpan ke Server!', { id: loading });
    } catch (error) {
      toast.error('Gagal kalkulasi data!', { id: loading });
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id, location.state]);

  const hitungPersenPerPU = (rencana: number, tumbuh: number) => {
    if (rencana === 0) return "0.00";
    return ((tumbuh / rencana) * 100).toFixed(2);
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Memuat detail evaluasi...</div>;

  const mockStatus = hasCalculated ? 'HASIL TERVALIDASI' : 'SIAP DIHITUNG';

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-24 animate-in fade-in duration-300 relative">
      <button onClick={() => navigate('/admin/staff/evaluasi/hasil')} className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#185325] self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali ke Daftar Perhitungan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="w-full">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">Detail Perhitungan Evaluasi</h1>
            <div className="bg-[#f8fbf9] border border-[#DCECE0] rounded-xl p-5 md:p-6 text-sm text-gray-700 relative overflow-hidden">
              <HiOutlineDocumentText className="absolute -right-4 -bottom-4 w-32 h-32 text-[#185325] opacity-5 pointer-events-none" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 relative z-10">
                <div className="flex items-start gap-2"><span className="font-semibold text-gray-500 w-28 shrink-0">Program</span><span className="font-bold text-[#185325]">: {dataDetail?.nama_proyek_lokasi?.split(' - ')[0]}</span></div>
                <div className="flex items-start gap-2"><span className="font-semibold text-gray-500 w-28 shrink-0">Jenis Program</span><span className="font-bold text-gray-800">: {dataDetail?.jenis_program}</span></div>
                <div className="flex items-start gap-2"><span className="font-semibold text-gray-500 w-28 shrink-0">No. Penugasan</span><span className="font-bold text-gray-800">: {dataDetail?.nomor_surat}</span></div>
                <div className="flex items-start gap-2"><span className="font-semibold text-gray-500 w-28 shrink-0">Periode</span><span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100/50">: {dataDetail?.periode_evaluasi}</span></div>
                <div className="flex items-start gap-2 lg:col-span-2"><span className="font-semibold text-gray-500 w-28 shrink-0">Lokasi Lahan</span><span className="font-bold text-gray-800">: {dataDetail?.nama_proyek_lokasi?.split(' - ').slice(1).join(' - ')}</span></div>
              </div>
            </div>
          </div>
        </div>

        {!hasCalculated ? (
          <>
            <TableDataPetakUkur mockStatus={mockStatus} hasCalculated={true} dataPetakUkur={dataPetakUkur} hitungPersenPerPU={hitungPersenPerPU} />
            <div className="flex justify-end py-4 border-t border-gray-100 mt-4">
              {!isDataFilled && !dataPetakUkur.some(pu => pu.eval_at) ? (
                <button
                  onClick={() => navigate(`/admin/staff/evaluasi/hasil/form-lapangan/${id}`, { state: { dataPetakUkur } })}
                  className="px-8 py-3.5 bg-white border-2 border-[#185325] text-[#185325] hover:bg-[#185325]/5 text-sm font-bold rounded-full cursor-pointer flex items-center gap-2"
                >
                  <HiOutlineDocumentText className="w-5 h-5" /> Isi Form Evaluasi Faktual Lapangan
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(`/admin/staff/evaluasi/hasil/form-lapangan/${id}`, { state: { dataPetakUkur } })} className="px-8 py-3.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full flex cursor-pointer">
                    Edit Data Lapangan
                  </button>
                  <button onClick={handleHitungDanMuatPeta} disabled={isCalculating} className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full flex items-center gap-2 cursor-pointer disabled:opacity-70">
                    {isCalculating ? 'Memproses Data...' : 'Simpan, Hitung (Permen LHK) & Peta WebGIS'}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DashboardHasilDanPeta mockStatus={mockStatus} hasilIntegrasi={hasilIntegrasi} dataPetakUkur={dataPetakUkur} />
            <TableDataPetakUkur mockStatus={mockStatus} hasCalculated={true} dataPetakUkur={dataPetakUkur} hitungPersenPerPU={hitungPersenPerPU} />
            
            {/* TOMBOL AKSI AKAN MUNCUL DI SINI SETELAH DIHITUNG */}
            {!showTindakLanjut && (
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-gray-100 pt-8 mt-4">
                <button onClick={() => navigate(`/admin/staff/evaluasi/hasil/form-lapangan/${id}`, { state: { dataPetakUkur } })} className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full cursor-pointer">
                  Edit Data / Kalkulasi Ulang
                </button>
                
                {/* TOMBOL INI MUNCUL JIKA PERSENTASE DI BAWAH 75% */}
                {hasilIntegrasi.isPerluTindakLanjut && (
                  <button onClick={() => setShowTindakLanjut(true)} className="w-full sm:w-auto px-6 py-3.5 bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 text-sm font-bold rounded-full cursor-pointer flex items-center justify-center gap-2">
                    <HiOutlineExclamationTriangle className="w-5 h-5" /> Buat Arahan Tindak Lanjut
                  </button>
                )}

                <button onClick={() => navigate('/admin/staff/evaluasi/laporan')} className="w-full sm:w-auto px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full flex items-center justify-center cursor-pointer gap-2">
                  <HiOutlineCheckBadge className="w-5 h-5" /> Lanjut Buat Laporan
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showTindakLanjut && (
        <SectionTindakLanjut 
          evalId={id!} 
          dataPetakUkur={dataPetakUkur} 
          rekomendasiCpi={dataDetail?.rekomendasi_cpi || ''} 
          onCancel={() => setShowTindakLanjut(false)} 
        />
      )}
    </div>
  );
};
export default DetailPerhitunganHasilEvaluasiStaff;