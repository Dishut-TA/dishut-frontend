export const ROLES = {
  KABID: "kepala bidang pdas",
  SUPERADMIN: "superadmin",
  STAFF: "staff pdas",
  STAFFBUPM: "staff bupm",
  KABIDBUPM: "kepala bupm",
  KTH: "kelompok tani hutan (kth)",
  CSR: "csr",
  PENYULUH: "penyuluh",
  KTH_PELAKSANAAN: "kth pelaksanaan",
};

export const ROLE_BASE_PATHS: Record<string, string> = {
  [ROLES.KABID]: "/admin/kabid",
  [ROLES.SUPERADMIN]: "/admin/kabid", 
  [ROLES.STAFF]: "/admin/staff",
  [ROLES.STAFFBUPM]: "/admin/staff/bupm",
  [ROLES.KABIDBUPM]: "/admin/kabid/bupm",
  [ROLES.KTH]: "/admin/kth", 
  [ROLES.KTH_PELAKSANAAN]: "/admin/kth-pelaksanaan", 
  [ROLES.CSR]: "/admin/csr", 
  [ROLES.PENYULUH]: "/admin/penyuluh", 
};

export const ROLE_REDIRECTS: Record<string, string> = {
  ...ROLE_BASE_PATHS,
  "kepala dinas": "/admin/kabid",
  "staff pdas": "/admin/staff",
  "staff bupm": "/admin/staff/bupm",
  "kabid bupm": "/admin/kabid/bupm",
  "admin": "/admin/staff",
  "kelompok tani hutan (kth)": "/admin/kth",
  "kth pelaksanaan": "/admin/kth-pelaksanaan",
  "csr": "/admin/csr",
  "penyuluh": "/admin/penyuluh",
};