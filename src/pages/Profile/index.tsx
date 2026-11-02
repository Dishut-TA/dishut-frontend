import React, { useEffect, useState, useCallback } from 'react';
import { getUserProfile } from '@/services/authService';
import type { UserProfile } from '@/utils/interface';
import { useAuth } from '@/context/AuthContext';
import KthProfileView from './components/KthProfileView';
import StandardProfileView from './components/StandardProfileView';

export const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(authUser);
  const [isLoading, setIsLoading] = useState<boolean>(!authUser);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getUserProfile();
      setProfileData(data);
      setError(null);
    } catch (err: any) {
      if (!profileData) {
        setError(err.message || 'Gagal memuat profil pengguna');
      }
    } finally {
      setIsLoading(false);
    }
  }, [profileData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-[#185325]/20 border-t-[#185325] rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Memuat profil pengguna...</p>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-4 rounded-xl bg-red-50 text-red-600 mb-3 border border-red-100">
          <p className="text-sm font-semibold">Error: {error}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              fetchProfile();
            }}
            className="px-4 py-2 bg-[#185325] text-white text-xs font-semibold rounded-lg hover:bg-[#12401c] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  // Determine if the user has a KTH role or is affiliated with KTH
  const isKthRole = (user: UserProfile): boolean => {
    const hasRoleKth = user.peran?.some((r) => {
      const name = r.nama.toLowerCase();
      return (
        name.includes('kth') ||
        name.includes('kelompok tani') ||
        name === 'kelompok tani hutan (kth)' ||
        name === 'kth pelaksanaan'
      );
    });
    return Boolean(hasRoleKth || user.kth || user.kth_id);
  };

  const isKth = isKthRole(profileData);

  return isKth ? (
    <KthProfileView profileData={profileData} onRefreshProfile={fetchProfile} />
  ) : (
    <StandardProfileView profileData={profileData} />
  );
};

export default Profile;