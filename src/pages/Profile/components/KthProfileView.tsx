import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/utils/interface';
import { useAuth } from '@/context/AuthContext';
import { getKthProfileAPI, updateKthProfileAPI } from '@/services/kth.service';
import { ToastError, ToastLoading, ToastSuccess } from '@/utils/toastHelper';
import type { KthFormData } from '../types';
import KthProfileDetail from './KthProfileDetail';
import KthProfileEditWizard from './KthProfileEditWizard';

interface KthProfileViewProps {
  profileData: UserProfile;
  onRefreshProfile?: () => Promise<void>;
}

// Helper untuk memastikan URL storage mengarah ke endpoint yang benar
const formatStorageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http://localhost/')) {
    return url.replace('http://localhost/', 'http://127.0.0.1:8000/');
  }
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('blob:')) {
    const clean = url.replace(/^\/?(storage\/)?/, '');
    return `http://127.0.0.1:8000/storage/${clean}`;
  }
  return url;
};

export const KthProfileView: React.FC<KthProfileViewProps> = ({
  profileData,
  onRefreshProfile,
}) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

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
      jenis_usaha: cached.jenis_usaha || kth.jenis_usaha || kth.jenis_usaha_utama || 'Jenis usaha',
      kelas_kth: cached.kelas_kth || kth.kelas_kth || 'Kelas KTH',
      alamat_sekretariat:
        cached.alamat_sekretariat ||
        kth.alamat_sekretariat ||
        kth.alamat ||
        profileData.alamat ||
        profileData.profil?.alamat ||
        'Jl. Sekeloa Tengah No. 27',
      nama_bank: cached.nama_bank || kth.nama_bank || 'Bank Rakyat Indonesia (BRI)',
      nomor_rekening: cached.nomor_rekening || kth.nomor_rekening || kth.no_rekening || '',
      nama_pemilik_rekening: cached.nama_pemilik_rekening || kth.nama_pemilik_rekening || '',
    };
  };

  const [formData, setFormData] = useState<KthFormData>(getInitialData);

  // Avatar Photo URL
  const initialPhotoUrl = (): string => {
    const rawPhoto = (profileData.kth as any)?.foto_profil || profileData.profil?.foto_profile || profileData.foto_profile;
    const formatted = formatStorageUrl(rawPhoto);
    const cachedPhoto = localStorage.getItem(`kth_avatar_${profileData.id}`);
    return (
      cachedPhoto ||
      formatted ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profileData.kth?.nama_ketua || profileData.kth?.nama || profileData.nama_pengguna || 'KTH'
      )}&background=D5F0DE&color=185325&size=200&bold=true`
    );
  };

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>(initialPhotoUrl);

  // Fetch KTH Profile directly from backend endpoint /api/kth/profile
  const fetchKthProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const res = await getKthProfileAPI();
      if (res) {
        const mappedData: KthFormData = {
          cdk: res.cdk || 'Cabang Dinas Kehutanan (CDK) 1',
          kabupaten_kota: res.kabupaten_kota || '',
          kecamatan: res.kecamatan || '',
          desa_kelurahan: res.desa_kelurahan || '',
          nomor_sk: res.nomor_sk || '',
          nama_kelompok: res.nama || res.nama_kelompok || '',
          nama_ketua: res.ketua || res.nama_ketua || '',
          no_wa_ketua: res.no_wa_ketua || '',
          jumlah_anggota: res.jumlah_anggota ? String(res.jumlah_anggota) : '',
          jenis_usaha: res.jenis_usaha || res.jenis_usaha_utama || '',
          kelas_kth: res.kelas_kth || '',
          alamat_sekretariat: res.alamat_sekretariat || '',
          nama_bank: res.nama_bank || '',
          nomor_rekening: res.no_rekening || res.nomor_rekening || '',
          nama_pemilik_rekening: res.nama_pemilik_rekening || '',
        };
        setFormData(mappedData);
        localStorage.setItem(`kth_profile_data_${profileData.id}`, JSON.stringify(mappedData));

        if (res.foto_profil) {
          const formattedPhoto = formatStorageUrl(res.foto_profil);
          if (formattedPhoto) {
            setCurrentPhotoUrl(formattedPhoto);
            localStorage.setItem(`kth_avatar_${profileData.id}`, formattedPhoto);
          }
        }
      }
    } catch (err) {
      console.warn('Memuat profil KTH dari cache/props lokal (API belum siap atau offline):', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [profileData.id]);

  useEffect(() => {
    fetchKthProfile();
  }, [fetchKthProfile]);

  const handleSubmit = async (updatedData: KthFormData, newPhotoFile: File | null) => {
    setIsSubmitting(true);
    const loadingId = ToastLoading('Menyimpan perubahan profil KTH...');

    try {
      // 1. Siapkan FormData untuk dikirimkan ke endpoint baru /api/kth/profile
      const submitFormData = new FormData();
      submitFormData.append('cdk', updatedData.cdk);
      submitFormData.append('kabupaten_kota', updatedData.kabupaten_kota);
      submitFormData.append('kecamatan', updatedData.kecamatan);
      submitFormData.append('desa_kelurahan', updatedData.desa_kelurahan);
      submitFormData.append('nomor_sk', updatedData.nomor_sk || '');
      submitFormData.append('nama', updatedData.nama_kelompok);
      submitFormData.append('nama_kelompok', updatedData.nama_kelompok);
      submitFormData.append('ketua', updatedData.nama_ketua);
      submitFormData.append('nama_ketua', updatedData.nama_ketua);
      submitFormData.append('no_wa_ketua', updatedData.no_wa_ketua || '');
      submitFormData.append('jumlah_anggota', updatedData.jumlah_anggota || '');
      submitFormData.append('jenis_usaha', updatedData.jenis_usaha || '');
      submitFormData.append('kelas_kth', updatedData.kelas_kth || '');
      submitFormData.append('alamat_sekretariat', updatedData.alamat_sekretariat || '');
      submitFormData.append('nama_bank', updatedData.nama_bank || '');
      submitFormData.append('no_rekening', updatedData.nomor_rekening || '');
      submitFormData.append('nomor_rekening', updatedData.nomor_rekening || '');
      submitFormData.append('nama_pemilik_rekening', updatedData.nama_pemilik_rekening || '');

      if (newPhotoFile) {
        submitFormData.append('foto_profil', newPhotoFile);
      }

      // 2. Panggil API backend /api/kth/profile
      const response = await updateKthProfileAPI(submitFormData);

      // 3. Resolve URL foto profil terbaru
      let uploadedPhotoUrl = currentPhotoUrl;
      if (response?.foto_profil) {
        uploadedPhotoUrl = formatStorageUrl(response.foto_profil) || currentPhotoUrl;
        setCurrentPhotoUrl(uploadedPhotoUrl);
        localStorage.setItem(`kth_avatar_${profileData.id}`, uploadedPhotoUrl);
      } else if (newPhotoFile) {
        uploadedPhotoUrl = URL.createObjectURL(newPhotoFile);
        setCurrentPhotoUrl(uploadedPhotoUrl);
        localStorage.setItem(`kth_avatar_${profileData.id}`, uploadedPhotoUrl);
      }

      // 4. Update data lokal & localStorage
      localStorage.setItem(`kth_profile_data_${profileData.id}`, JSON.stringify(updatedData));
      setFormData(updatedData);

      // 5. Sync AuthContext state
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
          ...(profileData.kth || {}),
          id: response?.id || profileData.kth_id,
          nama: updatedData.nama_kelompok,
          nama_ketua: updatedData.nama_ketua,
          desa_kelurahan: updatedData.desa_kelurahan,
          kecamatan: updatedData.kecamatan,
          kabupaten_kota: updatedData.kabupaten_kota,
          ...(response || updatedData),
          foto_profil: uploadedPhotoUrl,
        },
      };
      updateUser(updatedUser);

      // 6. Refresh profile data di parent jika tersedia
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

  if (isLoadingProfile && !formData.nama_kelompok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-10 h-10 border-4 border-[#185325]/20 border-t-[#185325] rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Memuat profil KTH...</p>
      </div>
    );
  }

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
