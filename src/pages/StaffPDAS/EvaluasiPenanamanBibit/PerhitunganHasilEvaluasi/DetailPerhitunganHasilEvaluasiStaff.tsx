import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, HiOutlineCheckBadge, HiOutlineDocumentText, 
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import type { PetakUkur } from './types';
import DashboardHasilDanPeta from './components/DashboardHasilDanPeta';
import TableDataPetakUkur from './components/TableDataPetakUkur';
import SectionTindakLanjut from './components/SectionTindakLanjut';

const DetailPerhitunganHasilEvaluasiStaff: React.FC = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  
  const mockStatus: string = 'SIAP DIHITUNG'; 
  
  const location = useLocation();
  const stateData = location.state?.updatedData;
  const isDataFilled = location.state?.isDataFilled || false;

  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(mockStatus === 'HASIL TERVALIDASI');
  const [showTindakLanjut, setShowTindakLanjut] = useState(false);

  const infoTugas = {
    noSurat: 'ST.76/TKTRH/RRPKH/DAS.04.03/B/03/2026',
    namaProyek: 'Rehabilitasi Lahan Kompensasi PT. Jawa Satu Power',
    lokasi: 'Hutan Lindung Desa Sudalarang, Kab. Garut',
    periode: 'Pemeliharaan II (P2)',
    jenisProgram: 'APBD', 
    statusPendanaan: 'Dihentikan'
  };

  const [dataPetakUkur] = useState<PetakUkur[]>(stateData || [
    { periode: 'P2', pu: 'PU-1', jenisBibit: 'Mahoni (Swietenia macrophylla)', rencana: 110, monitoringTumbuh: 100, tumbuh: 0, rencanaTinggi: 120, tinggi: 0, koordinat: '', kondisiLahan: 'Baik / Normal' },
    { periode: 'P2', pu: 'PU-2', jenisBibit: 'Mahoni (Swietenia macrophylla)', rencana: 110, monitoringTumbuh: 105, tumbuh: 0, rencanaTinggi: 120, tinggi: 0, koordinat: '', kondisiLahan: 'Baik / Normal' },
    { periode: 'P2', pu: 'PU-3', jenisBibit: 'Pinus (Pinus merkusii)', rencana: 63, monitoringTumbuh: 60, tumbuh: 0, rencanaTinggi: 110, tinggi: 0, koordinat: '', kondisiLahan: 'Baik / Normal' },
    { periode: 'P2', pu: 'PU-4', jenisBibit: 'Pinus (Pinus merkusii)', rencana: 40, monitoringTumbuh: 35, tumbuh: 0, rencanaTinggi: 110, tinggi: 0, koordinat: '', kondisiLahan: 'Banyak Gulma' },
  ]);

  const [hasilIntegrasi, setHasilIntegrasi] = useState({
    persenTumbuhGlobal: mockStatus === 'HASIL TERVALIDASI' ? '91.65' : '0.00',
    skorCPILingkungan: mockStatus === 'HASIL TERVALIDASI' ? '3.45' : '0.00',
    statusEvaluasiLahan: mockStatus === 'HASIL TERVALIDASI' ? 'BERHASIL' : '-',
    rekomendasiTindakLanjut: mockStatus === 'HASIL TERVALIDASI' ? 'Kondisi tanaman tumbuh sangat baik.' : '',
    isPerluTindakLanjut: false
  });


  const hitungPersenPerPU = (rencana: number, tumbuh: number) => {
    if (rencana === 0) return "0.00";
    return ((tumbuh / rencana) * 100).toFixed(2);
  };

  const handleHitungDanMuatPeta = () => {
    setIsCalculating(true);
    const loading = toast.loading('Mengkalkulasi persentase tumbuh (Sesuai Permen LHK)...');
    
    setTimeout(() => {
      let totalTumbuh = 0;
      let totalRencana = 0;

      dataPetakUkur.forEach(p => { 
        totalTumbuh += p.tumbuh; 
        totalRencana += p.rencana; 
      });

      const rataRataTumbuh = totalRencana > 0 
        ? ((totalTumbuh / totalRencana) * 100).toFixed(2) 
        : "0.00";
      
      let finalStatus = '';
      let finalRekomendasi = '';
      let needTindakLanjut = false;

      if (parseFloat(rataRataTumbuh) >= 75) {
        finalStatus = 'BERHASIL - MEMENUHI KRITERIA';
        finalRekomendasi = `Kondisi tanaman tumbuh mencapai ${rataRataTumbuh}%. Evaluasi berhasil tanpa perlu penyulaman lanjutan.`;
      } else {
        if (infoTugas.jenisProgram === 'CSR' && infoTugas.statusPendanaan === 'Dihentikan') {
          finalStatus = 'PROGRAM DIHENTIKAN';
          finalRekomendasi = `Pertumbuhan di bawah standar (${rataRataTumbuh}%), namun pendanaan CSR terdeteksi Dihentikan. Program tidak dapat dilanjutkan ke tahap penyulaman.`;
          needTindakLanjut = false; 
        } else {
          finalStatus = 'PENETAPAN KEGIATAN PENYULAMAN';
          finalRekomendasi = `Pertumbuhan di bawah standar (${rataRataTumbuh}%). Karena berada di zona dengan Skor CPI Tinggi (3.45), lahan ini wajib mendapatkan penetapan kegiatan penyulaman segera.`;
          needTindakLanjut = true; 
        }
      }

      setHasilIntegrasi({
        persenTumbuhGlobal: rataRataTumbuh,
        skorCPILingkungan: '3.45',
        statusEvaluasiLahan: finalStatus,
        rekomendasiTindakLanjut: finalRekomendasi,
        isPerluTindakLanjut: needTindakLanjut
      });

      setIsCalculating(false);
      setHasCalculated(true);
      toast.success('Kalkulasi & Visualisasi Spasial Berhasil Dimuat!', { id: loading });
    }, 2500);
  };

  const handleSetujuiHasil = () => {
    toast.success('Data Perhitungan Tervalidasi!');
    navigate('/admin/staff/evaluasi/laporan'); 
  };

  const handleSubmitTindakLanjut = () => {
    toast.success('Arahan Tindak Lanjut berhasil dikirim ke Penyuluh!');
    navigate('/admin/staff/evaluasi');
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-24 animate-in fade-in duration-300 relative">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 self-start transition-colors">
        <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali ke Daftar Perhitungan
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detail Perhitungan Evaluasi</h1>
            </div>
            
            <div className="bg-[#f8fbf9] border border-[#DCECE0] rounded-xl p-5 md:p-6 text-sm text-gray-700 relative overflow-hidden">
              <HiOutlineDocumentText className="absolute -right-4 -bottom-4 w-32 h-32 text-[#185325] opacity-5 pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 relative z-10">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-500 w-28 shrink-0">Program</span>
                  <span className="font-semibold text-gray-500 shrink-0">:</span>
                  <span className="font-bold text-[#185325]">{infoTugas.namaProyek}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-500 w-28 shrink-0">Jenis Program</span>
                  <span className="font-semibold text-gray-500 shrink-0">:</span>
                  <span className="font-bold text-gray-800">{infoTugas.jenisProgram} ({infoTugas.statusPendanaan})</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-500 w-28 shrink-0">No. Penugasan</span>
                  <span className="font-semibold text-gray-500 shrink-0">:</span>
                  <span className="font-bold text-gray-800">{infoTugas.noSurat}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-500 w-28 shrink-0">Periode</span>
                  <span className="font-semibold text-gray-500 shrink-0">:</span>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100/50">{infoTugas.periode}</span>
                </div>
                
                <div className="flex items-start gap-2 lg:col-span-2">
                  <span className="font-semibold text-gray-500 w-28 shrink-0">Lokasi Lahan</span>
                  <span className="font-semibold text-gray-500 shrink-0">:</span>
                  <span className="font-bold text-gray-800">{infoTugas.lokasi}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {!hasCalculated ? (
          <>
            <TableDataPetakUkur 
              mockStatus={mockStatus} hasCalculated={true} dataPetakUkur={dataPetakUkur}
              hitungPersenPerPU={hitungPersenPerPU}
            />
            <div className="flex justify-end py-4 border-t border-gray-100 mt-4">
              {!isDataFilled ? (
                <button 
                  onClick={() => navigate('/admin/staff/evaluasi/hasil/form-lapangan', { state: { dataPetakUkur } })} 
                  className="px-8 py-3.5 bg-white border-2 border-[#185325] text-[#185325] hover:bg-[#185325]/5 text-sm font-bold rounded-full transition-colors flex items-center gap-2"
                >
                  <HiOutlineDocumentText className="w-5 h-5" /> Isi Form Evaluasi Faktual Lapangan
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate('/admin/staff/evaluasi/hasil/form-lapangan', { state: { dataPetakUkur } })} 
                    className="px-8 py-3.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full transition-colors flex items-center gap-2"
                  >
                    Edit Data Lapangan
                  </button>
                  <button 
                    onClick={handleHitungDanMuatPeta} 
                    disabled={isCalculating} 
                    className="px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full transition-colors shadow-md flex items-center gap-2 disabled:opacity-75"
                  >
                    {isCalculating ? 'Memproses Data Sesuai Aturan...' : 'Simpan, Hitung (Permen LHK) & Peta WebGIS'}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DashboardHasilDanPeta 
              mockStatus={mockStatus} 
              hasilIntegrasi={hasilIntegrasi} 
              dataPetakUkur={dataPetakUkur} 
            />
            
            <TableDataPetakUkur 
              mockStatus={mockStatus} hasCalculated={true} dataPetakUkur={dataPetakUkur}
              hitungPersenPerPU={hitungPersenPerPU}
            />
            
            {!showTindakLanjut && (
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-gray-100 pt-8 mt-4 animate-in fade-in">
                <button 
                  onClick={() => navigate('/admin/staff/evaluasi/hasil/form-lapangan', { state: { dataPetakUkur } })} 
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full transition-colors"
                >
                  Edit Data Lapangan / Kalkulasi Ulang
                </button>
                
                {hasilIntegrasi.isPerluTindakLanjut && (
                  <button 
                    onClick={() => {
                      setShowTindakLanjut(true);
                      setTimeout(() => document.getElementById('section-tindak-lanjut')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    <HiOutlineExclamationTriangle className="w-5 h-5" /> Buat Arahan Tindak Lanjut
                  </button>
                )}

                <button 
                  onClick={handleSetujuiHasil} 
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-sm font-bold rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlineCheckBadge className="w-5 h-5" /> Validasi & Lanjut Buat Laporan
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showTindakLanjut && (
        <SectionTindakLanjut 
          dataPetakUkur={dataPetakUkur}
          onCancel={() => setShowTindakLanjut(false)}
          onSubmit={handleSubmitTindakLanjut}
        />
      )}
    </div>
  );
};

export default DetailPerhitunganHasilEvaluasiStaff;