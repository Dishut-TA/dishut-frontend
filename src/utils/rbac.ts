import type { UserProfile } from "./interface";

export const canManageAccounts = (user: UserProfile | null): boolean => {
  if (!user || !user.peran) return false;
  
  const allowedRoles = ['superadmin', 'kepala bidang pdas'];
  return user.peran.some(role => allowedRoles.includes(role.nama.toLowerCase()));
};