import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface StatusMuatProps {
  isLoading: boolean;
  error?: string | null;
  /** Dianggap kosong bila bernilai null/undefined. */
  data?: unknown;
  loadingText?: string;
  emptyText?: string;
  children: React.ReactNode;
}

/**
 * Pembungkus keadaan muat/gagal/kosong untuk halaman detail.
 *
 * Dipakai agar halaman tidak merender data hardcoded saat request masih jalan
 * atau gagal, yang membuat data lama terlihat seolah valid.
 */
const StatusMuat: React.FC<StatusMuatProps> = ({
  isLoading,
  error,
  data,
  loadingText = 'Memuat data...',
  emptyText = 'Data tidak ditemukan.',
  children,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#185325] font-bold gap-3">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin" />
        {loadingText}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-center px-6">
        <HiOutlineExclamationTriangle className="w-8 h-8 text-amber-500" />
        <p className="text-sm font-semibold text-gray-700">{error}</p>
      </div>
    );
  }

  if (data === null || data === undefined) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-500 font-medium">
        {emptyText}
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusMuat;
