import React from 'react';
import type { KthFormData } from '../types';
import KthFormInput from './KthFormInput';

interface KthProfileDetailProps {
  formData: KthFormData;
  photoUrl: string;
  onEditClick: () => void;
}

export const KthProfileDetail: React.FC<KthProfileDetailProps> = ({
  formData,
  photoUrl,
  onEditClick,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 sm:px-6">
      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16">
        {/* Left: Form Fields (Read-only View Mode) */}
        <div className="w-full max-w-xl space-y-4">
          <KthFormInput
            label="Cabang Dinas Kehutanan"
            required
            isReadOnly
            value={formData.cdk}
            placeholder="Cabang Dinas Kehutanan (CDK)"
          />

          <KthFormInput
            label="Kabupaten / Kota"
            required
            isReadOnly
            value={formData.kabupaten_kota}
            placeholder="Kabupaten / Kota"
          />

          <KthFormInput
            label="Kecamatan"
            required
            isReadOnly
            value={formData.kecamatan}
            placeholder="Kecamatan"
          />

          <KthFormInput
            label="Desa / Kelurahan"
            required
            isReadOnly
            value={formData.desa_kelurahan}
            placeholder="Desa / Kelurahan"
          />

          <KthFormInput
            label="Nomor SK / Register KTH"
            required
            isReadOnly
            value={formData.nomor_sk}
            placeholder="Nomor SK ada di surat pengukuhan KTH"
          />

          <KthFormInput
            label="Nama Kelompok"
            required
            isReadOnly
            value={formData.nama_kelompok}
            placeholder="Nama Kelompok KTH"
          />

          <KthFormInput
            label="Nama Lengkap Ketua KTH"
            required
            isReadOnly
            value={formData.nama_ketua}
            placeholder="Nama Lengkap Ketua KTH"
          />

          {/* 2 Columns: No WhatsApp & Jumlah Anggota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KthFormInput
              label="No. WhatsApp Ketua"
              required
              isReadOnly
              value={formData.no_wa_ketua}
              placeholder="08xxxxxxxxxx"
            />
            <KthFormInput
              label="Jumlah Anggota (Orang)"
              required
              isReadOnly
              value={formData.jumlah_anggota}
              placeholder="10 Orang"
            />
          </div>

          <KthFormInput
            label="Jenis Usaha Utama"
            required
            isReadOnly
            value={formData.jenis_usaha}
            placeholder="Jenis usaha"
          />

          <KthFormInput
            label="Kelas KTH"
            isReadOnly
            value={formData.kelas_kth}
            placeholder="Kelas KTH"
          />

          <KthFormInput
            label="Alamat Lengkap Sekretariat"
            required
            isReadOnly
            value={formData.alamat_sekretariat}
            placeholder="Alamat Lengkap Sekretariat"
          />

          <KthFormInput
            label="Nama Bank"
            required
            isReadOnly
            value={formData.nama_bank}
            placeholder="Nama Bank"
          />

          <KthFormInput
            label="Nomor Rekening Bank"
            required
            isReadOnly
            value={formData.nomor_rekening}
            placeholder="Nomor Rekening Bank"
          />

          <KthFormInput
            label="Nama Pemilik Rekening"
            required
            isReadOnly
            value={formData.nama_pemilik_rekening}
            placeholder="Nama Pemilik Rekening"
          />

          {/* Edit Profile Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onEditClick}
              className="w-full bg-[#185325] hover:bg-[#12421c] text-white font-semibold text-sm py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer text-center"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right: Circular Profile Avatar Photo */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-start shrink-0 pt-2">
          <div className="relative">
            <img
              src={photoUrl}
              alt="Avatar KTH"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover shadow-sm border border-gray-100 bg-[#E8EFE9]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  formData.nama_ketua || formData.nama_kelompok || 'KTH'
                )}&background=D5F0DE&color=185325&size=200&bold=true`;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KthProfileDetail;
