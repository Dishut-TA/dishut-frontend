import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 
import PreviewBastModal from './components/PreviewBastModal';
import UploadBastModal from './components/UploadBastModal';
import RincianDanaModal from './components/RincianDanaModal';
import KegiatanTable from './components/KegiatanTable';
import { getDonationsAPI } from '@/services/donasi.service';

export type StatusKegiatan = 'Pending' | 'Terkumpul' | 'Disalurkan' | 'Terealisasi';
export type ModalType = 'previewBAST' | 'rincian' | 'uploadBAST' | null;

export interface DetailBibitDana {
  nama: string;
  jumlah: number;
  hargaSatuan: number;
}

export interface KegiatanData {
  id: number;
  idTransaksi: string;
  idDonasi: string;
  program: string;
  jumlahBibit: number;
  status: StatusKegiatan;
  namaDonatur: string;
  rincianBibit: DetailBibitDana[];
  bastUrl?: string | null; 
  buktiTanamUrl?: string | null; 
}

const formatKegiatanData = (item: any): KegiatanData => {
  let rincianBibit: DetailBibitDana[] = [];
  let totalBibit = 0;

  if (Array.isArray(item.seed_details)) {
    rincianBibit = item.seed_details.map((bibit: any) => {
      const jumlah = Number(bibit.quantity) || 0;
      totalBibit += jumlah;
      return {
        nama: bibit.name || 'Bibit',
        jumlah: jumlah,
        hargaSatuan: Number(bibit.price) || 0 
      };
    });
  }

  const seedStatus = item.seed_status; 
  const hasBast = Boolean(item.bast_url || item.bast_path);
  const hasProof = Boolean(item.proof_url || item.proof_path);

  let status: StatusKegiatan = 'Terkumpul';
  if (seedStatus === 'Pending' || seedStatus === 'Menunggu Verifikasi') status = 'Terkumpul';
  else if (hasBast && hasProof) status = 'Terealisasi';
  else if (hasBast) status = 'Disalurkan';
  
  return {
    id: item.id,
    idTransaksi: `TRX-${item.transaction_id || item.donor_id}`,
    idDonasi: `DNS-${item.id}`,
    program: item.donation_program?.name || 'Program Penghijauan',
    namaDonatur: item.donor?.donor_name || 'Hamba Allah',
    jumlahBibit: totalBibit,
    status: status,
    // storage url sementara local dulu yaw
    bastUrl: item.bast_url || (item.bast_path ? `http://127.0.0.1:8000/storage/${item.bast_path}` : null),
    buktiTanamUrl: item.proof_url || (item.proof_path ? `http://127.0.0.1:8000/storage/${item.proof_path}` : null),
    rincianBibit: rincianBibit.length > 0 ? rincianBibit : [{
      nama: 'Bibit Tanaman',
      jumlah: 0,
      hargaSatuan: 0
    }]
  };
};


const PelaksanaanKegiatan: React.FC = () => {
  const [kegiatanList, setKegiatanList] = useState<KegiatanData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<{ type: ModalType; data: KegiatanData | null }>({
    type: null,
    data: null
  });

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const response = await getDonationsAPI();

      const resData = response?.data || response;

      const rawData = resData?.payload || resData?.data || resData;

      const list = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

      setKegiatanList(list.map(formatKegiatanData));
    } catch (error) {
      console.error("Detail Error API:", error); 
      toast.error('Gagal memuat data pelaksanaan kegiatan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleCloseModal = () => {
    setModal({ type: null, data: null });
    fetchDonations(); 
  };

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Pelaksanaan Kegiatan Program Donasi</h1>
        <p className="text-sm md:text-base text-gray-600">
          Dokumentasi penyerahan dan penanaman bibit donasi di lapangan.
        </p>
      </div>

      <KegiatanTable 
        data={kegiatanList} 
        isLoading={isLoading} 
        onOpenModal={(type, data) => setModal({ type, data })} 
      />
      
      <PreviewBastModal 
        isOpen={modal.type === 'previewBAST'} 
        onClose={handleCloseModal} 
      />
      
      <UploadBastModal 
        isOpen={modal.type === 'uploadBAST'} 
        onClose={handleCloseModal} 
        donationId={modal.data ? modal.data.id : null} 
      />
      
      <RincianDanaModal 
        isOpen={modal.type === 'rincian'} 
        onClose={handleCloseModal} 
        data={modal.data} 
      /> 
      
    </div>
  );
};

export default PelaksanaanKegiatan;