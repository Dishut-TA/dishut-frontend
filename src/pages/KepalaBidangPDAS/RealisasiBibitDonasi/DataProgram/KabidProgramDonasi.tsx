import React, { useState, useEffect } from 'react';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineEye, 
  HiOutlineCheckBadge,
  HiOutlineArrowDownTray 
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import VerifikasiProgramModal from './components/VerifikasiProgramModal';
import ExportLaporanModal from './components/ExportLaporanModal';
import DetailProgramModal from '@/pages/StaffPDAS/RealisasiBibitDonasi/ProgramDonasi/components/DetailProgramModal';
import { getDonationProgramsAPI, updateDonationProgramAPI } from '@/services/program-donasi.service';

export interface ProgramDataExtended {
  id: string;
  nama: string;
  description: string;
  lokasi: string;
  terkumpul: string;
  totalTerealisasi: string;
  status: string;
  jenisBibit: any[];
  
  raw_analysis_result_id: any;
  raw_kth_id: number;
  raw_seed_specification_id: any;
  raw_total_seeds_collected: number;
  raw_total_seeds_realized: number;
}

const getStatusBadge = (status: string) => {
  const baseStyle = "px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap";
  switch (status.toLowerCase()) {
    case 'aktif': 
      return <span className={`${baseStyle} bg-[#2E7D32] text-white`}>Aktif</span>;
    case 'selesai': 
      return <span className={`${baseStyle} bg-gray-200 text-gray-600`}>Selesai</span>;
    case 'menunggu verifikasi': 
    case 'pending':
      return <span className={`${baseStyle} bg-[#F2C94C] text-gray-800`}>Menunggu Verifikasi</span>;
    case 'ditolak':
    case 'rejected':
      return <span className={`${baseStyle} bg-red-100 text-red-700`}>Ditolak</span>;
    default: 
      return <span className={`${baseStyle} bg-gray-100 text-gray-600`}>{status}</span>;
  }
};

const KabidProgramDonasi: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [programsData, setProgramsData] = useState<ProgramDataExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProgram, setSelectedProgram] = useState<ProgramDataExtended | null>(null);
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const response = await getDonationProgramsAPI();
      
      const mappedData: ProgramDataExtended[] = response.payload.map((item: any) => {
        const mappedBibit = item.jenis_bibit && item.jenis_bibit.length > 0 
          ? item.jenis_bibit.map((bibit: any) => ({
              nama: bibit.nama || bibit.name || `Spek ID: ${bibit.id}` 
            }))
          : [];

        return {
          id: item.id.toString(),
          nama: item.name,
          description: item.description || '', 
          lokasi: item.location,
          terkumpul: item.total_seeds_collected.toLocaleString('id-ID'),
          totalTerealisasi: item.total_seeds_realized.toLocaleString('id-ID'),
          status: item.status,
          jenisBibit: mappedBibit,

          raw_analysis_result_id: item.analysis_result_id,
          raw_kth_id: item.kth_id,
          raw_seed_specification_id: item.seed_specification_id,
          raw_total_seeds_collected: item.total_seeds_collected,
          raw_total_seeds_realized: item.total_seeds_realized
        };
      }).sort((a: ProgramDataExtended, b: ProgramDataExtended) => {
        if (a.status === 'Menunggu Verifikasi' && b.status !== 'Menunggu Verifikasi') return -1;
        if (a.status !== 'Menunggu Verifikasi' && b.status === 'Menunggu Verifikasi') return 1;
        return 0;
      });

      setProgramsData(mappedData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = programsData.filter(program => 
    program.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenVerifikasi = (program: ProgramDataExtended) => {
    setSelectedProgram(program);
    setIsVerifModalOpen(true);
  };

  const handleOpenDetail = (program: ProgramDataExtended) => {
    setSelectedProgram(program);
    setIsDetailModalOpen(true);
  };

  const updateProgramStatus = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading('Memproses verifikasi...');

    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      await updateDonationProgramAPI(id, formData);

      toast.success(`Program berhasil ${newStatus === 'Aktif' ? 'disetujui' : 'ditolak'}!`, { id: loadingToast });
      
      setIsVerifModalOpen(false);
      fetchPrograms();

    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  const handleSetuju = (id: string) => {
    updateProgramStatus(id, "Aktif");
  };

  const handleTolak = (id: string) => {
    updateProgramStatus(id, "Ditolak");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Verifikasi Program Realisasi Bibit dan Donasi</h1>
          <p className="text-sm md:text-base text-gray-500">Tinjau dan setujui pembukaan program realisasi bibit dan donasi baru yang diajukan oleh Staff PDAS.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari program..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#DCECE0]/30 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-sm text-sm text-gray-700 shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-primary hover:bg-[#063727] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <HiOutlineArrowDownTray className="w-5 h-5" strokeWidth={2} />
            Export Laporan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-[#DCECE0] text-[#3A4D3F] text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 whitespace-nowrap">Nama Program</th>
                <th className="px-6 py-4 whitespace-nowrap">Lokasi</th>
                <th className="px-6 py-4 whitespace-nowrap">Jenis Bibit</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Terkumpul</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Terealisasi</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="w-8 h-8 border-4 border-gray-200 border-t-[#185325] rounded-full animate-spin"></span>
                      <p className="text-sm font-bold text-gray-500">Memuat data program donasi...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{program.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{program.lokasi}</td>
                    
                    <td className="px-6 py-4 max-w-62.5">
                      <div className="flex flex-wrap gap-1.5">
                        {program.jenisBibit && program.jenisBibit.length > 0 ? (
                          program.jenisBibit.map((bibit: any, index: number) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-[11px] font-medium whitespace-nowrap shadow-sm"
                            >
                              {bibit.nama}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">Belum ditentukan.</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-[#2E7D32] text-center whitespace-nowrap">
                      {program.terkumpul}
                    </td>
                    
                    <td className="px-6 py-4 text-sm font-bold text-[#185325] text-center whitespace-nowrap">
                      {program.totalTerealisasi}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                       {getStatusBadge(program.status)}
                    </td>
                    
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                      {program.status === 'Menunggu Verifikasi' ? (
                        <button 
                          onClick={() => handleOpenVerifikasi(program)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm cursor-pointer"
                        >
                          <HiOutlineCheckBadge className="w-4 h-4" /> Verifikasi
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenDetail(program)}
                          title="Lihat Detail"
                          className="p-1.5 text-gray-400 hover:text-[#2E7D32] hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Program tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VerifikasiProgramModal 
        isOpen={isVerifModalOpen} 
        onClose={() => setIsVerifModalOpen(false)} 
        program={selectedProgram as any}
        onSetuju={handleSetuju}
        onTolak={handleTolak}
      />

      <DetailProgramModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        program={selectedProgram as any}
      />

      <ExportLaporanModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}

export default KabidProgramDonasi;