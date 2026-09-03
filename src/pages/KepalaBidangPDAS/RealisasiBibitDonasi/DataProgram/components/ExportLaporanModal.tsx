import React, { useState, useEffect } from 'react';
import { HiOutlineDocumentText, HiOutlineXMark } from 'react-icons/hi2';
import * as XLSX from 'xlsx-js-style'; 
import toast from 'react-hot-toast';
import { getDonationsAPI } from '@/services/donasi.service'; 
import { getDonationProgramsAPI } from '@/services/program-donasi.service';
interface ExportLaporanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportLaporanModal: React.FC<ExportLaporanModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchPrograms = async () => {
        setIsLoadingPrograms(true);
        try {
          const res = await getDonationProgramsAPI();
          setPrograms(res.payload || []);
        } catch (error) {
          toast.error('Gagal memuat daftar program.');
        } finally {
          setIsLoadingPrograms(false);
        }
      };
      fetchPrograms();
    } else {
      setSelectedProgram('');
      setStartDate('');
      setEndDate('');
    }
  }, [isOpen]);

  // Fungsi helper format tanggal jadi "3 Agustus 2026"
  const formatTanggalTitle = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleExportExcel = async () => {
    if (!selectedProgram) {
      return toast.error("Silakan pilih program terlebih dahulu.");
    }
    if (!startDate || !endDate) {
      return toast.error("Silakan tentukan rentang tanggal (Mulai & Selesai).");
    }

    setIsExporting(true);
    const loadingToast = toast.loading('Menyiapkan dokumen Excel...');
    
    try {
      const response = await getDonationsAPI();
      let donations = response.payload || response.data || [];

      if (selectedProgram !== 'all') {
         donations = donations.filter((don: any) => String(don.donation_program_id) === String(selectedProgram));
      }

      if (startDate) {
         const start = new Date(startDate);
         start.setHours(0, 0, 0, 0); 
         donations = donations.filter((don: any) => new Date(don.created_at) >= start);
      }

      if (endDate) {
         const end = new Date(endDate);
         end.setHours(23, 59, 59, 999); 
         donations = donations.filter((don: any) => new Date(don.created_at) <= end);
      }

      if (donations.length === 0) {
        toast.error('Tidak ada data donasi yang sesuai dengan filter tersebut.', { id: loadingToast });
        setIsExporting(false);
        return;
      }

      // --- MENGAMBIL NAMA PROGRAM & PERIODE UNTUK JUDUL EXCEL ---
      const progNameText = selectedProgram === 'all' 
        ? 'Semua Program Donasi' 
        : programs.find(p => p.id.toString() === selectedProgram)?.name || 'Program Donasi';
      
      const periodText = `Periode Dari Tanggal ${formatTanggalTitle(startDate)} - ${formatTanggalTitle(endDate)}`;

      // --- MEMBANGUN ARRAY OF ARRAYS (AOA) ---
      const wsData: any[][] = [
        [progNameText], // Baris 1
        [periodText],   // Baris 2
        [],             // Baris 3 (Kosong)
        [],             // Baris 4 (Kosong)
        ['ID DONASI', 'DONATUR', 'ALAMAT', 'TANGGAL DONASI', 'JENIS BIBIT', 'TOTAL DONASI', 'BIBIT TERKUMPUL', 'BIBIT TEREALISASI', 'TANGGAL PENANAMAN', 'STATUS'] // Baris 5 (Header Tabel)
      ];

      let countDonatur = 0;
      let sumTotalDonasi = 0;
      let sumBibitTerkumpul = 0;
      let sumBibitTerealisasi = 0;

      // Loop Data Donasi
      donations.forEach((don: any) => {
        countDonatur++; 

        const nominalRupiah = Number(don.transaction?.amount) || 0;
        sumTotalDonasi += nominalRupiah; 
        const totalDonasi = nominalRupiah > 0 ? `Rp ${nominalRupiah.toLocaleString('id-ID')}` : '-';

        const bibitTerkumpul = Number(don.seed_quantity) || 0;
        sumBibitTerkumpul += bibitTerkumpul; 

        const status = don.seed_status || 'Menunggu Verifikasi';
        const bibitTerealisasi = (status.toLowerCase() === 'terealisasi' || status.toLowerCase() === 'disalurkan' || status.toLowerCase() === 'selesai') 
            ? bibitTerkumpul 
            : 0;
        sumBibitTerealisasi += bibitTerealisasi; 

        const yearSuffix = new Date(don.created_at).getFullYear().toString().slice(-2);
        const formatIdDonasi = `DNS-${yearSuffix}-${String(don.id).padStart(3, '0')}`;
        const tglPenanaman = don.donation_program?.start_date ? new Date(don.donation_program.start_date).toLocaleDateString('id-ID') : '-';

        wsData.push([
          formatIdDonasi,
          don.donor?.donor_name || 'Hamba Allah',
          don.donor?.address || '-',
          new Date(don.created_at).toLocaleDateString('id-ID'),
          don.seed?.nama || don.seed?.name || '-',
          totalDonasi,
          bibitTerkumpul,
          bibitTerealisasi,
          tglPenanaman,
          status
        ]);
      });

      // Tambahkan Baris Total di Paling Bawah
      wsData.push([
        'TOTAL',
        `${countDonatur} Donatur`,
        '', '', '',
        `Rp ${sumTotalDonasi.toLocaleString('id-ID')}`,
        sumBibitTerkumpul,
        sumBibitTerealisasi,
        '', ''
      ]);

      // Buat Worksheet dari Data Array
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);

      // --- MENGGABUNGKAN CELL (MERGE) UNTUK JUDUL ---
      worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // Merge Baris 1 dari Kolom A sampai J
        { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }  // Merge Baris 2 dari Kolom A sampai J
      ];

      // --- STYLING BORDER, BOLD, DLL ---
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);

          if (!worksheet[cellRef]) continue;

          // Style untuk Judul (Baris 1 dan 2)
          if (R === 0 || R === 1) {
            worksheet[cellRef].s = {
              font: { bold: true, sz: R === 0 ? 14 : 12 },
              alignment: { horizontal: 'center', vertical: 'center' }
            };
          } 
          // Style untuk Header Tabel (Baris 5 / index 4) dan Data
          else if (R >= 4) {
            worksheet[cellRef].s = {
              ...worksheet[cellRef].s,
              border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
              alignment: { vertical: 'center' }
            };

            // Warna hijau untuk Header
            if (R === 4) {
              worksheet[cellRef].s.font = { bold: true };
              worksheet[cellRef].s.fill = { fgColor: { rgb: "DCECE0" } }; 
              worksheet[cellRef].s.alignment = { horizontal: 'center', vertical: 'center' };
            }

            // Bold untuk baris TOTAL paling bawah
            if (R === range.e.r) {
              worksheet[cellRef].s.font = { bold: true };
            }
          }
        }
      }
      
      // Mengatur Lebar Kolom
      worksheet['!cols'] = [
        { wch: 15 }, // ID DONASI
        { wch: 25 }, // DONATUR
        { wch: 35 }, // ALAMAT
        { wch: 18 }, // TANGGAL DONASI
        { wch: 25 }, // JENIS BIBIT
        { wch: 20 }, // TOTAL DONASI
        { wch: 18 }, // BIBIT TERKUMPUL
        { wch: 18 }, // BIBIT TEREALISASI
        { wch: 22 }, // TANGGAL PENANAMAN
        { wch: 20 }, // STATUS
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Donasi");

      XLSX.writeFile(workbook, `Laporan_Donasi_${new Date().getTime()}.xlsx`);
      
      toast.success('Laporan berhasil diekspor!', { id: loadingToast });
      onClose(); 

    } catch (error: any) {
      console.error(error);
      toast.error('Gagal mengekspor laporan. Pastikan koneksi API berjalan baik.', { id: loadingToast });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Export Laporan Donasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Pilih program dan tentukan rentang waktu untuk mengunduh laporan rekapitulasi data donasi dalam format Excel (.xlsx).
          </p>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Program</label>
              <select 
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={isLoadingPrograms}
                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] disabled:bg-gray-50"
              >
                <option value="" disabled>-- Pilih Program Donasi --</option>
                <option value="all">Semua Program</option>
                {programs.map(prog => (
                  <option key={prog.id} value={prog.id}>{prog.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Mulai</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Selesai</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              disabled={isExporting}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#185325] hover:bg-[#123d1c] rounded-full transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm cursor-pointer"
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses...
                </span>
              ) : (
                <>
                  <HiOutlineDocumentText className="w-5 h-5" /> Unduh Laporan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportLaporanModal;