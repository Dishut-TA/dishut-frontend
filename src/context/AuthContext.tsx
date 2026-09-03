import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, logoutAccount } from '@/services/authService';
import type { UserProfile } from '@/utils/interface';

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
          // Sinkronisasi data terbaru ke localStorage (termasuk peran dan izin)
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
          // Opsional: Hapus token jika ternyata token sudah expired/tidak valid
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    await logoutAccount();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);