import React, { useState } from 'react';
import type { UserProfile } from '@/utils/interface';
import { useAuth } from '@/context/AuthContext';
import { updateKthAPI } from '@/services/kth.service';
import { updatePegawaiFormData } from '@/services/pegawai/pegawai.service';
import { ToastError, ToastLoading, ToastSuccess } from '@/utils/toastHelper';
import type { KthFormData } from '../types';
import KthProfileDetail from './KthProfileDetail';
import KthProfileEditWizard from './KthProfileEditWizard';

interface KthProfileViewProps {
  profileData: UserProfile;
  onRefreshProfile?: () => Promise<void>;
}

export const KthProfileView: React.FC<KthProfileViewProps> = ({
  profileData,
  onRefreshProfile,
}) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize initial KTH form data from user profile or cache
  const getInitialData = (): KthFormData => {
    const cachedStr = localStorage.getItem(`kth_profile_data_${profileData.id}`);
    let cached: Partial<KthFormData> = {};
    if (cachedStr) {
      try {
        cached = JSON.parse(cachedStr);
      } catch (e) {
        // ignore
      }
    }

    const kth = (profileData.kth || {}) as any;

    return {
      cdk: cached.cdk || kth.cdk || kth.cabang_dinas || 'Cabang Dinas Kehutanan (CDK) 1',
      kabupaten_kota: cached.kabupaten_kota || kth.kabupaten_kota || 'Kab. Bandung',
      kecamatan: cached.kecamatan || kth.kecamatan || '',
      desa_kelurahan: cached.desa_kelurahan || kth.desa_kelurahan || '',
      nomor_sk: cached.nomor_sk || kth.nomor_sk || kth.no_sk || '',
      nama_kelompok: cached.nama_kelompok || kth.nama || kth.nama_kelompok || 'KTH Rimba Nusantara',
      nama_ketua: cached.nama_ketua || kth.nama_ketua || kth.ketua || 'Asep Romli',
      no_wa_ketua:
        cached.no_wa_ketua ||
        kth.no_wa_ketua ||
        kth.no_wa ||
        profileData.no_telp ||
        profileData.profil?.no_telp ||
        '089786543234',
      jumlah_anggota:
        cached.jumlah_anggota ||
        (kth.jumlah_anggota ? String(kth.jumlah_anggota) : '10 Orang'),
      jenis_usaha: cached.jenis_usaha || kth.jenis_usaha || 'Jenis usaha',
      kelas_kth: cached.kelas_kth || kth.kelas_kth || 'Kelas KTH',
      alamat_sekretariat:
        cached.alamat_sekretariat ||
        kth.alamat_sekretariat ||
        kth.alamat ||
        profileData.alamat ||
        profileData.profil?.alamat ||
        'Jl. Sekeloa Tengah No. 27',
      nama_bank: cached.nama_bank || kth.nama_bank || 'Bank Rakyat Indonesia (BRI)',
      nomor_rekening: cached.nomor_rekening || kth.nomor_rekening || '',
      nama_pemilik_rekening: cached.nama_pemilik_rekening || kth.nama_pemilik_rekening || '',
    };
  };

  const [formData, setFormData] = useState<KthFormData>(getInitialData);

  // Avatar Photo URL
  const fotoAsli = profileData.profil?.foto_profile || profileData.foto_profile;
  const cachedPhoto = localStorage.getItem(`kth_avatar_${profileData.id}`);
  const currentPhotoUrl =
    cachedPhoto ||
    fotoAsli ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.nama_ketua || formData.nama_kelompok || 'KTH'
    )}&background=D5F0DE&color=185325&size=200&bold=true`;

  const handleSubmit = async (updatedData: KthFormData, newPhotoFile: File | null) => {
    setIsSubmitting(true);
    const loadingId = ToastLoading('Menyimpan perubahan profil KTH...');

    try {
      // 1. Update KTH API if kth_id exists
      if (profileData.kth_id) {
        try {
          await updateKthAPI(profileData.kth_id, {
            cdk: updatedData.cdk,
            kabupaten_kota: updatedData.kabupaten_kota,
            kecamatan: updatedData.kecamatan,
            desa_kelurahan: updatedData.desa_kelurahan,
            nama: updatedData.nama_kelompok,
            ketua: updatedData.nama_ketua,
            jenis_usaha: updatedData.jenis_usaha,
            nomor_sk: updatedData.nomor_sk,
            no_wa_ketua: updatedData.no_wa_ketua,
            jumlah_anggota: updatedData.jumlah_anggota,
            kelas_kth: updatedData.kelas_kth,
            alamat_sekretariat: updatedData.alamat_sekretariat,
            nama_bank: updatedData.nama_bank,
            nomor_rekening: updatedData.nomor_rekening,
            nama_pemilik_rekening: updatedData.nama_pemilik_rekening,
          });
        } catch (apiError) {
          console.warn('Gagal memanggil updateKthAPI:', apiError);
        }
      }

      // 2. Upload new avatar if selected
      let uploadedPhotoUrl = currentPhotoUrl;
      if (newPhotoFile) {
        try {
          const photoFormData = new FormData();
          photoFormData.append('foto_profile', newPhotoFile);
          photoFormData.append('_method', 'PUT');
          const photoRes = await updatePegawaiFormData(profileData.id, photoFormData);
          if (photoRes?.payload?.foto_profile) {
            uploadedPhotoUrl = photoRes.payload.foto_profile;
          }
        } catch (photoError) {
          console.warn('Gagal upload foto ke backend:', photoError);
          // Fallback to local object URL
          const localPhotoUrl = URL.createObjectURL(newPhotoFile);
          uploadedPhotoUrl = localPhotoUrl;
          localStorage.setItem(`kth_avatar_${profileData.id}`, localPhotoUrl);
        }
      }

      // 3. Persist updated form data to localStorage
      localStorage.setItem(`kth_profile_data_${profileData.id}`, JSON.stringify(updatedData));
      setFormData(updatedData);

      // 4. Sync AuthContext state
      const updatedUser: UserProfile = {
        ...profileData,
        foto_profile: uploadedPhotoUrl,
        profil: {
          ...(profileData.profil || {
            id: profileData.id,
            nip: null,
            no_telp: null,
            tanggal_lahir: null,
            alamat: null,
            foto_profile: null,
          }),
          foto_profile: uploadedPhotoUrl,
          alamat: updatedData.alamat_sekretariat,
          no_telp: updatedData.no_wa_ketua,
        },
        kth: {
          nama: updatedData.nama_kelompok,
          nama_ketua: updatedData.nama_ketua,
          desa_kelurahan: updatedData.desa_kelurahan,
          kecamatan: updatedData.kecamatan,
          kabupaten_kota: updatedData.kabupaten_kota,
          ...(updatedData as any),
        },
      };
      updateUser(updatedUser);

      // 5. Optionally refresh server state
      if (onRefreshProfile) {
        try {
          await onRefreshProfile();
        } catch (e) {
          // ignore
        }
      }

      ToastSuccess('Profil KTH berhasil diperbarui!', loadingId);
      setIsEditing(false);
    } catch (err: any) {
      ToastError(err.message || 'Gagal menyimpan perubahan profil', loadingId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-4 px-2 sm:px-4">
      {isEditing ? (
        <KthProfileEditWizard
          initialData={formData}
          photoUrl={currentPhotoUrl}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <KthProfileDetail
          formData={formData}
          photoUrl={currentPhotoUrl}
          onEditClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default KthProfileView;
