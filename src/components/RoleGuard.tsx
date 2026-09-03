import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ToastError } from '@/utils/toastHelper';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  let currentUserRole = "";
  if (user?.peran && user.peran.length > 0) {
    currentUserRole = user.peran[0].nama.trim().toLowerCase();
  }

  const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase());

  if (!currentUserRole || !normalizedAllowedRoles.includes(currentUserRole)) {
    ToastError("Akses Ditolak: Anda tidak memiliki izin untuk halaman ini.", "unauthorized");
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;