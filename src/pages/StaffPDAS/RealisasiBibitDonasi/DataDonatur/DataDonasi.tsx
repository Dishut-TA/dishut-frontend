import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DetailDonaturModal from './components/DetailDonaturModal';
import DonasiToolbar from './components/DonasiToolbar';
import DonasiTable from './components/DonasiTable';
import VerifikasiDonaturModal from './components/VerifikasiDonaturModal';
import type { DonaturData } from '@/utils/interface';
import { getDonationsAPI, updateDonationStatusAPI, deleteDonationAPI } from '@/services/donasi.service';
import ConfirmAlert from '@/components/ConfirmAlert';

const formatDonationData = (item: any): DonaturData => {
  const spec = item.seed?.specifications?.[0];
  const harga = spec ? Number(spec.price) : 0;

  return {
    id: item.id,
    idTransaksi: `TRX-${item.donor_id}`,
    idDonasi: `DNS-${item.id}`,
    namaDonatur: item.donor?.donor_name || 'Hamba Allah',
    program: item.donation_program?.name || 'Program Umum',
    jumlahBibit: item.seed_quantity || 0,
    status: item.seed_status || 'Menunggu Verifikasi',
    tanggalDonasi: item.created_at,
    proof_url: item.proof_url,
    rincianBibit: [{
      nama: item.seed?.nama || item.seed?.name || 'Bibit',
      jumlah: item.seed_quantity || 0,
      hargaSatuan: harga
    }],
  };
};

const DataDonasi: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [donationsData, setDonationsData] = useState<DonaturData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalDetail, setModalDetail] = useState<DonaturData | null>(null);
  const [modalVerif, setModalVerif] = useState<DonaturData | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [donaturToDelete, setDonaturToDelete] = useState<DonaturData | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const response = await getDonationsAPI();
      const rawData = response.data || response.payload || [];
      const arrayData = Array.isArray(rawData) ? rawData : [rawData].filter(Boolean);
      
      setDonationsData(arrayData.map(formatDonationData));
    } catch (error: any) {
      toast.error('Gagal memuat data donasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAction = async (status: 'Terkumpul' | 'Ditolak') => {
    if (!modalVerif) return;
    try {
      await updateDonationStatusAPI(modalVerif.id, status);
      toast.success(status === 'Terkumpul' ? "Donasi berhasil diverifikasi!" : "Donasi ditolak.");
      setModalVerif(null);
      fetchDonations(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Gagal memproses donasi.`);
    }
  };

  const promptDelete = (donatur: DonaturData) => {
    setDonaturToDelete(donatur);
    setIsDeleteAlertOpen(true);
  };

  const executeDelete = async () => {
    if (!donaturToDelete) return;

    setIsDeleteLoading(true);
    try {
      await deleteDonationAPI(donaturToDelete.id);
      toast.success('Data donasi berhasil dihapus.');
      
      setIsDeleteAlertOpen(false);
      setDonaturToDelete(null);
      
      fetchDonations(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus data donasi.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const filteredData = donationsData.filter(donatur => 
    donatur.idTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donatur.namaDonatur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      
      <DonasiToolbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <DonasiTable 
        data={filteredData} 
        isLoading={isLoading} 
        onVerify={(donatur) => setModalVerif(donatur)} 
        onViewDetail={(donatur) => setModalDetail(donatur)} 
        onDelete={promptDelete} 
      />

      <DetailDonaturModal 
        isOpen={modalDetail !== null}
        onClose={() => setModalDetail(null)}
        donatur={modalDetail}
      />

      <VerifikasiDonaturModal
        isOpen={modalVerif !== null}
        onClose={() => setModalVerif(null)}
        donatur={modalVerif}
        onTerima={() => handleVerifyAction('Terkumpul')}
        onTolak={() => handleVerifyAction('Ditolak')}
      />

      <ConfirmAlert
        isOpen={isDeleteAlertOpen}
        title="Hapus Data Donasi?"
        message={`Apakah Anda yakin ingin menghapus donasi dari ${donaturToDelete?.namaDonatur}? Data yang dihapus tidak dapat dikembalikan.`}
        isDanger={true}
        confirmText="Ya, Hapus"
        isLoading={isDeleteLoading}
        onConfirm={executeDelete}
        onCancel={() => {
          setIsDeleteAlertOpen(false);
          setDonaturToDelete(null);
        }}
      />

    </div>
  );
};

export default DataDonasi;